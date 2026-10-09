import { Application, Container, FillGradient, Graphics, Text } from "pixi.js";
import { buildOffice, OFFICE, STATE_COLORS, PROVIDER_BRAND_COLORS, PROVIDER_LABELS } from "./scene/office-layout";
import { createCharacter, createDesk, createBadge } from "./scene/characters";
import { createToolBadge, STATUS_KEYS, STATUS_TYPES, TOOL_KEYS } from "./scene/tool-icons";
import { createTokenStreams } from "./scene/token-streams";
import { getSupporterState, COSMETIC_CATALOG, SUPPORTER_CHANGE_EVENT } from "@/lib/supporterStore";
import { getActiveFont, THEME_CHANGE_EVENT } from "@/lib/themeStore";

const MAX_ZOOM = 1.0; // Strictly capped at 1.0: large screens display more area instead of enlarging elements!
const MIN_ZOOM = 0.25;

// Base world rectangle the camera frames (floor).
const FLOOR_BASE_W = 2150;
const FLOOR_BASE_H = 980;
const FLOOR = { x: -60, y: 40, w: FLOOR_BASE_W, h: FLOOR_BASE_H };

const DESK_W = 150;
const clamp01 = (v) => Math.max(0, Math.min(1, v));

const MODE_INTENSITY = { streaming: 0.8, pending: 0.3, idle: 0.25, happy: 0.2, sleeping: 0, error: 1 };

/**
 * Mount the office scene on `canvas`.
 *
 * Everything visible is a function of the trace records:
 *  - robot pose        <- account state (typing / waving / happy / asleep / error)
 *  - badge over head   <- queued, done, or the specific failure reason
 *  - badge by monitor  <- tool type currently running
 *  - desk face         <- latency bar, cost, cache share, request pile
 *  - packets           <- input (round), output (diamond), cached (square)
 *  - pods              <- load meter, siren when saturated, operator robot
 *  - amber lanes       <- fallback: courier drone carries the request to another provider
 */
export async function mountOfficeScene(canvas, traces, options = {}) {
  let selectedId = options.selectedId ?? null;
  let onSelect = options.onSelect;

  let isPanning = false;
  let panStart = { x: 0, y: 0 };
  let worldStart = { x: 0, y: 0 };
  let hasMoved = false;

  const app = new Application();
  await app.init({
    canvas,
    preference: "webgl",
    resizeTo: canvas.parentElement,
    background: 0x0b0f16,
    antialias: true,
    resolution: Math.min(globalThis.devicePixelRatio || 1, 2),
    autoDensity: true,
  });

  // Safely wrap loseContext on the renderer context system to never throw INVALID_OPERATION
  const loseExt = app.renderer?.context?.extensions?.loseContext;
  if (loseExt && typeof loseExt.loseContext === "function") {
    const origLose = loseExt.loseContext.bind(loseExt);
    loseExt.loseContext = () => {
      try {
        const gl = app.renderer?.gl;
        if (gl && typeof gl.isContextLost === "function" && gl.isContextLost()) {
          return;
        }
        origLose();
      } catch (e) {
        // Silently absorb loseContext errors if browser already revoked context
      }
    };
  }

  const world = new Container();
  const floorLayer = new Container();
  const laneLayer = new Container();
  const deskLayer = new Container();
  const actorLayer = new Container();
  const toolLayer = new Container();
  const hudLayer = new Container();
  const streams = createTokenStreams();
  world.addChild(floorLayer, laneLayer, streams.container, deskLayer, actorLayer, toolLayer, hudLayer);
  app.stage.addChild(world);

  // Declared before drawFloor(): the floor theme reads the first trace's theme.
  let currentTraces = traces;

  // ---- floor -------------------------------------------------------------
  const floor = new Graphics();
  function drawFloor(w = FLOOR_BASE_W, h = FLOOR_BASE_H) {
    FLOOR.w = w;
    FLOOR.h = h;
    floor.clear();

    const supporter = getSupporterState();
    const equippedThemeId = currentTraces?.[0]?.theme || supporter?.equippedOfficeTheme || "theme_default";
    const themeObj =
      (COSMETIC_CATALOG.officeThemes || []).find((t) => t.id === equippedThemeId) ||
      COSMETIC_CATALOG.officeThemes?.[0];
    const palette = themeObj?.palette || {
      floorGradient: [0x0b1018, 0x161f2c],
      gridColor: 0x1a2330,
      gridAlpha: 0.7,
      borderColor: 0x263244,
      panelRackColor: 0xfde047,
      panelPodColor: 0x22d3ee,
    };

    const [gradTop, gradBottom] = palette.floorGradient || [0x0b1018, 0x161f2c];
    const gridCol = palette.gridColor ?? 0x1a2330;
    const gridA = palette.gridAlpha ?? 0.7;
    const borderCol = palette.borderColor ?? 0x263244;
    const rackCol = palette.panelRackColor ?? 0xfde047;
    const podCol = palette.panelPodColor ?? 0x22d3ee;

    floor.roundRect(FLOOR.x, FLOOR.y, FLOOR.w, FLOOR.h, 28).fill(
      new FillGradient({
        type: "linear",
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
        colorStops: [{ offset: 0, color: gradTop }, { offset: 1, color: gradBottom }],
        textureSpace: "local",
      }),
    );
    for (let x = FLOOR.x + 100; x < FLOOR.x + FLOOR.w; x += 100) {
      floor.moveTo(x, FLOOR.y + 14).lineTo(x, FLOOR.y + FLOOR.h - 14).stroke({ width: 1, color: gridCol, alpha: gridA });
    }
    for (let y = FLOOR.y + 100; y < FLOOR.y + FLOOR.h; y += 100) {
      floor.moveTo(FLOOR.x + 14, y).lineTo(FLOOR.x + FLOOR.w - 14, y).stroke({ width: 1, color: gridCol, alpha: gridA });
    }
    floor.roundRect(FLOOR.x, FLOOR.y, FLOOR.w, FLOOR.h, 28).stroke({ width: 2, color: borderCol, alpha: 0.9 });
    // Zone panels: agents | router | providers
    floor.roundRect(OFFICE.rackX - 130, FLOOR.y + 120, 260, FLOOR.h - 240, 22).fill({ color: rackCol, alpha: 0.045 });
    floor.roundRect(OFFICE.podX - 110, FLOOR.y + 40, 220, FLOOR.h - 150, 22).fill({ color: podCol, alpha: 0.045 });
  }
  drawFloor(FLOOR_BASE_W, FLOOR_BASE_H);
  floor.eventMode = "static";
  floor.on("pointertap", () => {
    if (hasMoved) return;
    select(null);
  });
  floorLayer.addChild(floor);

  // ---- central rack (Core Hub) with a dispatcher robot behind it -----------
  const rack = new Container();
  const dispatcher = createCharacter({ color: 0xfde047, trimColor: 0xf59e0b, seed: 3, scale: 0.95, mode: "sleeping" });
  dispatcher.root.baseX = 0;
  dispatcher.root.baseY = -156;
  dispatcher.root.x = 0;
  dispatcher.root.y = -156;
  rack.addChild(dispatcher.root);

  const rackBody = new Graphics();
  rackBody.roundRect(-70, -170, 140, 230, 10).fill({ color: 0x1a222d });
  rackBody.roundRect(-62, -162, 124, 60, 6).fill({ color: 0x223040 });
  rackBody.roundRect(-58, 40, 116, 96, 6).fill({ color: 0x223040 });
  rack.addChild(rackBody);

  const rackGlow = new Graphics();
  rackGlow.roundRect(-80, -180, 160, 250, 14).fill({ color: 0xfde047, alpha: 0.12 });
  rack.addChildAt(rackGlow, 0);

  const leds = new Graphics();
  rack.addChild(leds);

  const rackLabel = new Text({
    text: "CORE HUB",
    style: { fontFamily: getActiveFont("ui"), fontSize: 14, fill: 0x38bdf8, fontWeight: "800", letterSpacing: 2 },
  });
  rackLabel.anchor.set(0.5, 0);
  rackLabel.y = -92;
  rack.addChild(rackLabel);

  const rackCount = createBadge("0", { color: 0xfde047, size: 13 });
  rackCount.anchor.set(0.5, 0);
  rackCount.y = 4;
  rack.addChild(rackCount);
  deskLayer.addChild(rack);

  // ---- build / rebuild on data change ----------------------------------
  // Everything created per data refresh is tracked here and destroyed together.
  let dyn = [];
  let deskEntries = [];
  let podEntries = [];
  let couriers = [];
  let rackActive = false;
  let lastTracesSignature = "";

  function refreshSelection() {
    for (const e of deskEntries) e.desk.setSelected(e.ws.connectionId === selectedId);
  }

  function select(id) {
    selectedId = id;
    refreshSelection();
    onSelect?.(id);
  }

  function dashedLine(g, x, y1, y2, color) {
    const dir = Math.sign(y2 - y1) || 1;
    for (let y = y1; dir > 0 ? y < y2 - 8 : y > y2 + 8; y += dir * 14) {
      g.moveTo(x, y).lineTo(x, y + dir * 8).stroke({ width: 2, color, alpha: 0.8 });
    }
  }

  function getTracesSignature(list) {
    if (!Array.isArray(list) || list.length === 0) return "0:empty";
    let sig = list.length + ":";
    for (let i = 0; i < list.length; i++) {
      const t = list[i];
      if (!t) continue;
      sig += `${t.connectionId || t.id || i}_${t.state || ""}_${t.mode || ""}_${t.isLooping ? 1 : 0}_${t.skin || ""}_${t.aura || ""}_${t.pet || ""}_${t.trophy || ""}_${Array.isArray(t.props) ? t.props.join(",") : (t.props || "")}_${t.cost || 0}_${t.elapsedMs || 0}_${t.tokens?.input || 0}_${t.tokens?.output || 0}_${t.tools?.length || 0}_${t.error || ""}|`;
    }
    return sig;
  }

  function rebuild(nextTraces, force = false) {
    currentTraces = nextTraces;
    const nextSig = getTracesSignature(nextTraces);
    if (!force && nextSig === lastTracesSignature && dyn.length > 0) {
      return;
    }
    lastTracesSignature = nextSig;

    // Double-buffering pattern: build next display hierarchy first before destroying old ones
    // This completely eliminates single-frame flickers on telemetry refreshes
    const newDyn = [];
    const nextDeskEntries = [];
    const nextPodEntries = [];
    const nextCouriers = [];

    const track = (layer, obj) => {
      layer.addChild(obj);
      newDyn.push(obj);
      return obj;
    };

    const office = buildOffice(nextTraces);
    const podByProvider = new Map(office.pods.map((p) => [p.provider, p]));
    const routes = [];

    // Back-to-front so nearer desks overlap further ones.
    const ordered = [...office.workstations].sort((a, b) => a.y - b.y || a.x - b.x);
    const supporter = getSupporterState();

    for (const [i, ws] of ordered.entries()) {
      const isLooping = Boolean(ws.isLooping);
      const isApp = ws.clientType === "app" || String(ws.provider || "").toLowerCase().includes("app");
      const clientType = ws.clientType || (isApp ? "app" : "cli");
      const deskLabel = (ws.sessionTitle && ws.sessionTitle !== "agent-factory" && ws.sessionTitle !== ws.account)
        ? ws.sessionTitle
        : (ws.account || ws.connectionId);
      const deskMeta = `${ws.account && ws.account !== deskLabel ? `${ws.account} · ` : ""}${ws.model || ""} · ${ws.totalLabel}`;

      const desk = createDesk({
        color: ws.color,
        label: deskLabel,
        meta: deskMeta,
        provider: ws.provider,
        clientType,
        elapsedMs: ws.elapsedMs,
        cost: ws.cost,
        cachedPct: ws.cachedPct,
        queued: ws.queued,
        depth: ws.depth,
        isLooping,
        pet: ws.pet || supporter.equippedPet || "none",
        props: (ws.props && ws.props.length > 0) ? ws.props : (supporter.equippedProps || []),
        trophy: ws.trophy || supporter.equippedTrophy || "none",
      });
      desk.root.x = ws.x;
      desk.root.y = ws.y;
      desk.root.on("pointertap", (e) => {
        if (hasMoved) return;
        e.stopPropagation();
        select(ws.connectionId === selectedId ? null : ws.connectionId);
      });

      // Agent first: it sits behind the desk so the desk hides its torso.
      const character = createCharacter({
        color: ws.color,
        depth: ws.depth,
        seed: i,
        mode: ws.mode,
        clientType,
        skin: ws.skin || supporter.equippedSkin || "classic",
        aura: ws.aura || supporter.equippedAura || "none",
      });
      character.root.x = ws.x + 108;
      character.root.baseX = ws.x + 108;
      character.root.baseY = ws.y + 34;
      character.root.y = character.root.baseY;
      track(deskLayer, character.root);
      track(deskLayer, desk.root);

      // Tool-call badges cycle by the monitor, one glyph per tool type.
      const toolBadges = [];
      if (ws.busy > 0 || ws.tools.length > 0) {
        for (const tool of ws.tools) {
          const badge = createToolBadge(tool, { size: 1.05 });
          badge.root.x = ws.x + 28;
          badge.root.y = ws.y - 50;
          badge.root.visible = false;
          track(toolLayer, badge.root);
          toolBadges.push(badge);
        }
      }

      // Status badge over the head: queued / done / looping / the exact failure reason.
      let statusBadge = null;
      const statusKey =
        ws.isLooping ? "looping"
          : ws.mode === "pending" ? "pending"
            : ws.mode === "happy" ? "done"
              : ws.mode === "error" ? (STATUS_TYPES[ws.errorReason] ? ws.errorReason : "rate_limited")
                : null;
      if (statusKey) {
        statusBadge = createToolBadge(statusKey, { size: 1.05 });
        statusBadge.root.x = ws.x + DESK_W + 14;
        statusBadge.root.y = ws.y - 34;
        track(toolLayer, statusBadge.root);
      }

      // Fallback marker: this request already failed over from another provider.
      if (ws.fallbackFrom) {
        const fb = createToolBadge("fallback", { size: 0.85, label: `from ${ws.fallbackFrom}` });
        fb.root.x = ws.x + DESK_W + 14;
        fb.root.y = ws.y + 40;
        track(toolLayer, fb.root);
      }

      // Cost: a coin pops off the desk of a finished account.
      let coin = null;
      if (ws.mode === "happy" && ws.cost > 0) {
        coin = new Container();
        const disc = new Graphics();
        disc.circle(0, 0, 6).fill({ color: 0xfacc15 });
        disc.circle(0, 0, 6).stroke({ width: 1.2, color: 0xa16207 });
        const amount = new Text({
          text: `+$${ws.cost.toFixed(2)}`,
          style: { fontFamily: getActiveFont("ui"), fontSize: 11, fill: 0xfacc15, fontWeight: "800" },
        });
        amount.x = 10;
        amount.anchor.set(0, 0.5);
        coin.addChild(disc, amount);
        coin.x = ws.x + 16;
        coin.visible = false;
        track(toolLayer, coin);
      }

      nextDeskEntries.push({ desk, character, ws, toolBadges, statusBadge, coin });

      const pod = podByProvider.get(ws.provider) || (office.pods.length > 0 ? office.pods[0] : null);
      if (ws.busy > 0) {
        const cap = (v) => Math.max(0.15, clamp01(v));
        const wIn = cap(ws.tokens.input / 16000);
        const wOut = cap(ws.tokens.output / 3200);
        const wCache = ws.tokens.cached > 0 ? cap(ws.tokens.cached / 6500) : 0;
        const deskPt = { x: ws.x + 75, y: ws.y - 10 };
        const rackIn = { x: OFFICE.rackX, y: OFFICE.rackY - 90 };
        // input: desk -> rack -> provider
        routes.push({ from: deskPt, to: rackIn, color: ws.color, weight: wIn });
        if (pod) {
          routes.push({ from: { x: OFFICE.rackX, y: OFFICE.rackY - 40 }, to: { x: pod.x - 46, y: pod.y }, color: pod.brandColor || pod.color, weight: wIn });
          // output: provider -> rack -> desk, arcing underneath
          routes.push({ from: { x: pod.x - 46, y: pod.y + 14 }, to: { x: OFFICE.rackX + 20, y: OFFICE.rackY - 10 }, color: 0x86efac, weight: wOut, shape: "diamond", arc: -22 });
        }
        routes.push({ from: { x: OFFICE.rackX - 20, y: OFFICE.rackY + 10 }, to: { x: ws.x + 100, y: ws.y + 6 }, color: 0x86efac, weight: wOut, shape: "diamond", arc: -22 });
        // cached: served at the rack, never reaches a provider
        if (wCache) {
          routes.push({ from: { x: ws.x + 90, y: ws.y - 20 }, to: { x: OFFICE.rackX - 30, y: OFFICE.rackY - 120 }, color: 0xcbd5e1, weight: wCache, shape: "square", arc: 44 });
        }
      }
    }

    // Provider pods: load meter, siren when saturated, operator robot behind.
    for (const pod of office.pods) {
      const operator = createCharacter({
        color: pod.brandColor || pod.color,
        trimColor: pod.brandColor || pod.color,
        scale: 0.55,
        seed: pod.provider.length,
        mode: pod.overloaded ? "pending" : pod.busy > 0 ? "streaming" : "sleeping",
      });
      operator.root.x = pod.x + 2;
      operator.root.baseX = pod.x + 2;
      operator.root.baseY = pod.y + 10;
      operator.root.y = pod.y + 10;
      track(deskLayer, operator.root);

      const g = new Graphics();
      g.ellipse(0, 34, 52, 10).fill({ color: 0x000000, alpha: 0.35 });
      g.roundRect(-46, -30, 92, 62, 12).fill({ color: 0x1c2531 });
      g.roundRect(-46, -30, 92, 62, 12).stroke({ width: 1.5, color: pod.brandColor || 0x22d3ee, alpha: 0.5 });
      g.roundRect(-46, -30, 92, 6, 5).fill({ color: pod.brandColor || 0xffffff, alpha: 0.15 });
      // Load meter: three rows fill in turn as the provider saturates.
      const meterColor = pod.overloaded ? STATE_COLORS.error : pod.load > 0.5 ? 0xfbbf24 : (pod.brandColor || 0x34d399);
      for (let r = 0; r < 3; r += 1) {
        const fill = clamp01(pod.load * 3 - r);
        g.roundRect(-38, -18 + r * 14, 76, 9, 3).fill({ color: 0x0f141c });
        if (fill > 0) g.roundRect(-38, -18 + r * 14, 76 * fill, 9, 3).fill({ color: meterColor, alpha: 0.9 });
      }
      g.x = pod.x;
      g.y = pod.y;
      track(deskLayer, g);

      const siren = new Graphics();
      siren.x = pod.x + 34;
      siren.y = pod.y - 35;
      track(deskLayer, siren);

      const label = new Text({
        text: PROVIDER_LABELS[pod.provider] || pod.provider.toUpperCase(),
        style: { fontFamily: getActiveFont("ui"), fontSize: 12, fill: 0xdce6f2, fontWeight: "800", letterSpacing: 1 },
      });
      label.anchor.set(0.5, 0);
      label.x = pod.x;
      label.y = pod.y + 38;
      track(deskLayer, label);

      const sub = createBadge(`${pod.busy} in flight${pod.overloaded ? " · FULL" : ""}`, {
        color: pod.overloaded ? STATE_COLORS.error : (pod.brandColor || pod.color),
        size: 10,
      });
      sub.anchor.set(0.5, 0);
      sub.x = pod.x;
      sub.y = pod.y + 53;
      track(deskLayer, sub);

      nextPodEntries.push({ pod, operator, siren });
    }

    // Fallback lanes + courier drones: from the failed provider to the one that served it.
    office.fallbacks.forEach((lane, k) => {
      const from = podByProvider.get(lane.from);
      const to = podByProvider.get(lane.to);
      if (!from || !to) return;
      const laneX = OFFICE.podX - 82 - (k % 4) * 14;

      const g = new Graphics();
      g.moveTo(from.x - 46, from.y).lineTo(laneX, from.y).stroke({ width: 2, color: 0xfbbf24, alpha: 0.5 });
      g.moveTo(to.x - 46, to.y).lineTo(laneX, to.y).stroke({ width: 2, color: 0xfbbf24, alpha: 0.5 });
      dashedLine(g, laneX, from.y, to.y, 0xfbbf24);
      const dir = Math.sign(to.y - from.y) || 1;
      g.poly([laneX - 6, to.y - dir * 10, laneX + 6, to.y - dir * 10, laneX, to.y]).fill({ color: 0xfbbf24 });
      track(laneLayer, g);

      const tag = new Text({
        text: `FALLBACK ×${lane.count}`,
        style: { fontFamily: getActiveFont("ui"), fontSize: 9, fill: 0xfbbf24, fontWeight: "800", letterSpacing: 1 },
      });
      tag.anchor.set(1, 0.5);
      tag.x = laneX - 9;
      tag.y = (from.y + to.y) / 2;
      track(laneLayer, tag);

      const drone = createCharacter({ color: 0xfbbf24, trimColor: 0xf59e0b, scale: 0.5, seed: k + 5, mode: "streaming" });
      const parcel = new Graphics();
      parcel.roundRect(-30, -22, 14, 12, 2).fill({ color: 0xd6a15c });
      parcel.moveTo(-30, -16).lineTo(-16, -16).stroke({ width: 1.2, color: 0x7c4a1d });
      const flame = new Graphics();
      drone.root.addChild(parcel, flame);
      track(actorLayer, drone.root);
      nextCouriers.push({ drone, flame, laneX, y1: from.y, y2: to.y, offset: k * 900 });
    });

    rack.x = OFFICE.rackX;
    rack.y = OFFICE.rackY;
    rackCount.text = String(office.rack.active);
    rackActive = office.rack.active > 0;
    dispatcher.setMode(rackActive ? "streaming" : "sleeping");
    streams.setRoutes(routes);

    // Swap dynamic display lists atomically
    const oldDyn = dyn;
    dyn = newDyn;
    deskEntries = nextDeskEntries;
    podEntries = nextPodEntries;
    couriers = nextCouriers;

    refreshSelection();

    // Safely destroy previous objects now that the new objects are already attached
    for (const o of oldDyn) {
      try {
        o.destroy({ children: true });
      } catch (err) {
        // safe suppress
      }
    }
  }

  // ---- camera -----------------------------------------------------------
  function fit() {
    if (app.screen.width <= 0 || app.screen.height <= 0) return;
    // Strictly capped at MAX_ZOOM (1.0).
    // On large screens, scale does NOT increase beyond 1.0,
    // so elements stay at their natural 1:1 size and the canvas reveals MORE space!
    const autoScale = Math.min(
      app.screen.width / (FLOOR_BASE_W + 40),
      app.screen.height / (FLOOR_BASE_H + 40),
      MAX_ZOOM,
    );
    const scale = Math.max(MIN_ZOOM, autoScale);
    world.scale.set(scale);

    // Dynamic floor sizing: on large displays, expand the office floor
    // to fill the screen bounds seamlessly
    const viewW = Math.max(FLOOR_BASE_W, (app.screen.width / scale) - 30);
    const viewH = Math.max(FLOOR_BASE_H, (app.screen.height / scale) - 30);
    drawFloor(viewW, viewH);

    world.x = (app.screen.width - FLOOR.w * world.scale.x) / 2 - FLOOR.x * world.scale.x;
    world.y = (app.screen.height - FLOOR.h * world.scale.y) / 2 - FLOOR.y * world.scale.y;

    options.onZoomChange?.(Math.round(scale * 100));
  }

  app.renderer.on("resize", fit);

  // ---- pan & zoom interactions ------------------------------------------
  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    isPanning = true;
    hasMoved = false;
    panStart = { x: e.clientX, y: e.clientY };
    worldStart = { x: world.x, y: world.y };
  };

  const onPointerMove = (e) => {
    if (!isPanning) return;
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    if (Math.hypot(dx, dy) > 4) {
      hasMoved = true;
    }
    world.x = worldStart.x + dx;
    world.y = worldStart.y + dy;
  };

  const onPointerUp = () => {
    isPanning = false;
  };

  const onWheel = (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomDelta = e.deltaY < 0 ? 1.08 : 0.92;
    const currentScale = world.scale.x;
    const targetScale = Math.max(MIN_ZOOM, Math.min(1.15, currentScale * zoomDelta));
    if (Math.abs(targetScale - currentScale) < 0.001) return;

    const worldMouseX = (mouseX - world.x) / currentScale;
    const worldMouseY = (mouseY - world.y) / currentScale;

    world.scale.set(targetScale);
    world.x = mouseX - worldMouseX * targetScale;
    world.y = mouseY - worldMouseY * targetScale;

    options.onZoomChange?.(Math.round(targetScale * 100));
  };

  const onDblClick = () => {
    fit();
  };

  let restoreTimer = null;
  const onContextLost = (e) => {
    e.preventDefault(); // Crucial: prevents browser from permanently discarding the WebGL context
    console.warn("[OfficeScene] WebGL context lost - browser reclaimed GPU memory");
  };

  const onContextRestored = () => {
    console.info("[OfficeScene] WebGL context restored by browser");
    // PixiJS v8 runner restores internal GL textures & pipelines automatically.
    // Never call app.render() synchronously here to prevent INVALID_ENUM: texParameter.
    if (restoreTimer) clearTimeout(restoreTimer);
    restoreTimer = setTimeout(() => {
      try {
        rebuild(currentTraces, true);
      } catch (err) {
        console.warn("[OfficeScene] Soft rebuild after context restore:", err);
      }
    }, 200);
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("dblclick", onDblClick);
  canvas.addEventListener("webglcontextlost", onContextLost, false);
  canvas.addEventListener("webglcontextrestored", onContextRestored, false);

  const onThemeOrFontChange = () => {
    drawFloor(FLOOR.w, FLOOR.h);
    rebuild(currentTraces, true);
  };
  window.addEventListener(SUPPORTER_CHANGE_EVENT, onThemeOrFontChange);
  window.addEventListener(THEME_CHANGE_EVENT, onThemeOrFontChange);

  // ---- animation --------------------------------------------------------
  let t = 0;
  app.ticker.add((ticker) => {
    const dt = ticker.deltaMS;
    t += dt;

    streams.animate(dt);

    for (const entry of deskEntries) {
      const { ws } = entry;
      const intensity = ws.mode === "streaming" ? Math.min(1, ws.busy / 2) : MODE_INTENSITY[ws.mode] ?? 0;
      entry.desk.animate(t, intensity, ws.mode);
      entry.character.animate(t, intensity);

      // Tool badges: pop in, float, shrink out; one tool at a time.
      const n = entry.toolBadges.length;
      if (n > 0) {
        const slot = 2200;
        const cycle = Math.floor((t + ws.x * 3) / slot) % n;
        const local = ((t + ws.x * 3) % slot) / slot;
        entry.toolBadges.forEach((b, idx) => {
          const active = idx === cycle;
          b.root.visible = active;
          if (!active) return;
          const k = Math.min(Math.min(1, local * 6), Math.min(1, (1 - local) * 6));
          b.root.scale.set(1.05 * (0.35 + 0.65 * k));
          b.root.alpha = k;
          b.root.y = ws.y - 50 + Math.sin(t * 0.005 + idx) * 2.5;
          b.halo.scale.set(1 + Math.sin(t * 0.01) * 0.12);
        });
      }

      if (entry.statusBadge) {
        const err = ws.mode === "error";
        entry.statusBadge.root.y = ws.y - 34 + Math.sin(t * (err ? 0.02 : 0.004) + ws.x) * (err ? 3 : 2);
        entry.statusBadge.halo.scale.set(1 + Math.sin(t * (err ? 0.016 : 0.008)) * (err ? 0.3 : 0.12));
      }

      if (entry.coin) {
        const p = ((t + ws.x * 5) % 3400) / 3400;
        entry.coin.visible = p < 0.8;
        entry.coin.y = ws.y - 24 - p * 30;
        entry.coin.alpha = Math.sin(Math.min(1, p / 0.8) * Math.PI);
      }
    }

    for (const { pod, operator, siren } of podEntries) {
      operator.animate(t, pod.overloaded ? 1 : Math.min(1, pod.load));
      siren.clear();
      if (pod.overloaded) {
        const on = Math.sin(t * 0.014) > 0;
        siren.circle(0, 0, 5).fill({ color: 0xef4444, alpha: on ? 1 : 0.35 });
        siren.circle(0, 0, 13).fill({ color: 0xef4444, alpha: on ? 0.28 : 0.05 });
      } else {
        siren.circle(0, 0, 3).fill({ color: pod.busy > 0 ? 0x34d399 : 0x475569, alpha: 0.9 });
      }
    }

    for (const c of couriers) {
      const p = ((t + c.offset) % 4500) / 4500;
      const eased = p * p * (3 - 2 * p);
      c.drone.root.baseX = c.laneX;
      c.drone.root.baseY = c.y1 + (c.y2 - c.y1) * eased + 6;
      c.drone.animate(t, 1);
      c.flame.clear();
      c.flame.ellipse(0, 16, 7 + Math.sin(t * 0.04) * 1.5, 10 + Math.sin(t * 0.05) * 3).fill({ color: 0xfbbf24, alpha: 0.55 });
      c.flame.ellipse(0, 14, 4, 6).fill({ color: 0xfff1b8, alpha: 0.85 });
      c.drone.root.alpha = Math.min(1, p * 8) * Math.min(1, (1 - p) * 8);
    }

    dispatcher.animate(t, rackActive ? 1 : 0);

    // Rack activity LEDs
    leds.clear();
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 6; col += 1) {
        const on = Math.sin(t * 0.006 + row * 1.7 + col * 0.9) > (rackActive ? -0.2 : 0.6);
        if (!on) continue;
        leds.circle(-40 + col * 16, 56 + row * 14, 2.4).fill({
          color: row % 3 === 0 ? 0x34d399 : 0x22d3ee,
          alpha: 0.9,
        });
      }
    }
    rackGlow.alpha = rackActive ? 0.5 + Math.sin(t * 0.005) * 0.3 : 0.15;
  });

  // ---- legend ------------------------------------------------------------
  const legendTitle = (text, x) => {
    const title = new Text({
      text,
      style: { fontFamily: getActiveFont("ui"), fontSize: 11, fill: 0x7d8aa0, fontWeight: "800", letterSpacing: 2 },
    });
    title.x = x;
    title.y = FLOOR.y + FLOOR.h - 52;
    hudLayer.addChild(title);
  };
  legendTitle("TOOL CALLS", 35);
  TOOL_KEYS.forEach((tool, i) => {
    const chip = createToolBadge(tool, { size: 0.72 });
    chip.root.x = 160 + i * 65;
    chip.root.y = FLOOR.y + FLOOR.h - 40;
    hudLayer.addChild(chip.root);
  });
  legendTitle("STATUS", 965);
  STATUS_KEYS.forEach((key, i) => {
    const chip = createToolBadge(key, { size: 0.72 });
    chip.root.x = 1050 + i * 68;
    chip.root.y = FLOOR.y + FLOOR.h - 40;
    hudLayer.addChild(chip.root);
  });
  const packetKey = new Text({
    text: "●  input    ◆  output    ■  cached",
    style: { fontFamily: getActiveFont("ui"), fontSize: 11, fill: 0x7d8aa0, fontWeight: "700" },
  });
  packetKey.x = 1560;
  packetKey.y = FLOOR.y + FLOOR.h - 50;
  hudLayer.addChild(packetKey);

  rebuild(traces);
  fit();

  return {
    app,
    rebuild,
    fit,
    zoomIn() {
      const next = Math.min(1.15, world.scale.x * 1.15);
      const cx = app.screen.width / 2;
      const cy = app.screen.height / 2;
      const wx = (cx - world.x) / world.scale.x;
      const wy = (cy - world.y) / world.scale.y;
      world.scale.set(next);
      world.x = cx - wx * next;
      world.y = cy - wy * next;
      options.onZoomChange?.(Math.round(next * 100));
    },
    zoomOut() {
      const next = Math.max(MIN_ZOOM, world.scale.x * 0.85);
      const cx = app.screen.width / 2;
      const cy = app.screen.height / 2;
      const wx = (cx - world.x) / world.scale.x;
      const wy = (cy - world.y) / world.scale.y;
      world.scale.set(next);
      world.x = cx - wx * next;
      world.y = cy - wy * next;
      options.onZoomChange?.(Math.round(next * 100));
    },
    reset100() {
      world.scale.set(1.0);
      world.x = (app.screen.width - FLOOR_BASE_W * 1.0) / 2 - FLOOR.x * 1.0;
      world.y = (app.screen.height - FLOOR_BASE_H * 1.0) / 2 - FLOOR.y * 1.0;
      options.onZoomChange?.(100);
    },
    setSelected(id) {
      selectedId = id;
      refreshSelection();
    },
    setOnSelect(fn) {
      onSelect = fn;
    },
    destroy: () => {
      if (restoreTimer) clearTimeout(restoreTimer);
      try {
        canvas.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("wheel", onWheel);
        canvas.removeEventListener("dblclick", onDblClick);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        canvas.removeEventListener("webglcontextrestored", onContextRestored);
        window.removeEventListener(SUPPORTER_CHANGE_EVENT, onThemeOrFontChange);
        window.removeEventListener(THEME_CHANGE_EVENT, onThemeOrFontChange);
        app.renderer?.off?.("resize", fit);
      } catch {}

      try {
        app.ticker?.stop?.();
      } catch {}

      try {
        // Safe WebGL loseContext handling:
        // In PixiJS v8 GlContextSystem, loseContext is called from this.extensions.loseContext?.loseContext()
        // If the context is already lost, explicitly null out extensions.loseContext so Pixi v8 doesn't invoke it
        const gl = app.renderer?.gl;
        const isLost = !gl || (typeof gl.isContextLost === "function" && gl.isContextLost());
        if (isLost && app.renderer?.context?.extensions) {
          app.renderer.context.extensions.loseContext = null;
        }
        app.destroy(false, { children: true });
      } catch (err) {
        console.warn("[OfficeScene] Cleanly handled app.destroy:", err);
      }
    },
  };
}

export { STATE_COLORS };
