import { Container, FillGradient, Graphics, Rectangle, Text } from "pixi.js";
import { STATE_COLORS, STATE_LABELS } from "./office-layout";

function clip(text, max) {
  const str = String(text || "");
  return str.length > max ? `${str.slice(0, max - 1)}…` : str;
}

const MONO = "ui-monospace, Menlo, monospace";
const SANS = "Inter, system-ui, sans-serif";

// Vertical two/three-stop gradient in the shape's own space — the cheap trick
// that turns flat 2D primitives into lit, rounded-looking "3D" volumes.
function vgrad(...stops) {
  return new FillGradient({
    type: "linear",
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    colorStops: stops.map((color, i) => ({ offset: i / (stops.length - 1), color })),
    textureSpace: "local",
  });
}

// A chibi robot (big round helmet, oval visor with scanline eyes, coloured ear
// pods, tiny body) drawn from primitives — no sprite sheet, so every colour and
// pose is controllable from live data. Origin = base of the torso (hidden
// behind the desk/console), so the helmet and shoulders peek over the edge.
//
// Poses (`mode`):
//   streaming  typing, scanline eyes          pending   one arm waving, waiting
//   happy      ^ ^ eyes, smile, bounce        sleeping  closed eyes, drifting z's
//   error      X eyes, shaking, smoke, arms up
export function createCharacter({ color, depth = 1, scale = 1, seed = 0, trimColor, mode = "streaming", clientType = "cli" }) {
  const root = new Container();
  const isApp = clientType === "app";
  const defaultTrim = isApp ? 0x8b5cf6 : 0x10b981; // purple for app, emerald for cli
  const trim = trimColor ?? defaultTrim;
  const SHELL = 0xf3f5f9;
  const SHADE = 0xc9d0dc;

  // Torso: two stacked shells with a coloured band between them.
  const body = new Graphics();
  body.roundRect(-17, -30, 34, 22, 11).fill(vgrad(0xffffff, SHELL, SHADE));
  body.roundRect(-17, -30, 34, 8, 8).fill({ color: 0xffffff, alpha: 0.6 });
  body.roundRect(-14, -12, 28, 8, 4).fill({ color: trim });
  body.roundRect(-16, -8, 32, 16, 8).fill(vgrad(SHELL, SHADE, 0x8c97a9));
  body.roundRect(-16, 2, 32, 6, 4).fill({ color: SHADE, alpha: 0.6 });

  const neck = new Graphics();
  neck.roundRect(-10, -36, 20, 8, 4).fill({ color: trim });
  const status = new Graphics();
  status.roundRect(-6, -34, 12, 3, 1.5).fill({ color });

  // Arms pivot at the shoulder so raising one does not swing it around the hip.
  const armL = new Graphics();
  const armR = new Graphics();
  for (const [arm, x, dir] of [[armL, -26, -1], [armR, 18, 1]]) {
    arm.roundRect(x, -28, 8, 24, 4).fill({ color: SHELL });
    arm.roundRect(x, -28, 8, 8, 4).fill({ color: 0xffffff, alpha: 0.6 });
    arm.circle(x + 4 + dir * 1.5, -2, 4.5).stroke({ width: 2.4, color: SHELL });
    arm.pivot.set(x + 4, -26);
    arm.position.set(x + 4, -26);
  }

  const head = new Graphics();
  head.circle(-27, -56, 8).fill({ color: trim });
  head.circle(27, -56, 8).fill({ color: trim });
  head.circle(-29, -58, 3).fill({ color: 0xffffff, alpha: 0.35 });
  head.circle(25, -58, 3).fill({ color: 0xffffff, alpha: 0.35 });
  head.ellipse(0, -56, 26, 24).fill(vgrad(0xffffff, SHELL, 0x9aa6b8));
  head.ellipse(4, -50, 24, 21).stroke({ width: 3, color: 0x6b7a90, alpha: 0.25 }); // bottom-right rim shade
  head.ellipse(-8, -68, 12, 5.5).fill({ color: 0xffffff, alpha: 0.8 }); // specular
  head.circle(-14, -64, 2).fill({ color: 0xffffff, alpha: 0.9 });
  head.ellipse(0, -53, 22, 17).fill({ color: SHADE });
  head.ellipse(0, -53, 20, 15.5).fill({ color: 0x0f141c });
  head.ellipse(-5, -58, 11, 5).fill({ color: 0xffffff, alpha: 0.06 });

  const face = new Graphics();
  const fx = new Graphics(); // smoke / z's, drawn in front of everything

  root.addChild(body, neck, status, armL, armR, head, face, fx);
  root.scale.set(scale * depth);

  let currentMode = mode;
  let faceColor = color;

  const stroke = (w, c, a = 1) => ({ width: w, color: c, alpha: a, cap: "round", join: "round" });

  const eye = (cx, cy, w, h, a, kind) => {
    if (kind === "happy") {
      face.moveTo(cx - 4.6, cy + 2).arc(cx, cy + 2, 4.6, Math.PI, 0).stroke(stroke(2.6, faceColor, a));
    } else if (kind === "sleep") {
      face.moveTo(cx - 4.6, cy).arc(cx, cy, 4.6, 0, Math.PI).stroke(stroke(2.2, faceColor, 0.7));
    } else if (kind === "x") {
      face.moveTo(cx - 4, cy - 4).lineTo(cx + 4, cy + 4).stroke(stroke(2.6, faceColor, a));
      face.moveTo(cx + 4, cy - 4).lineTo(cx - 4, cy + 4).stroke(stroke(2.6, faceColor, a));
    } else if (kind === "looping") {
      face.circle(cx, cy, 4.2).stroke(stroke(1.8, faceColor, a));
      face.circle(cx, cy, 2.0).stroke(stroke(1.4, faceColor, a));
      face.circle(cx, cy, 0.6).fill({ color: faceColor, alpha: a });
    } else {
      face.ellipse(cx, cy, w, h).fill({ color: faceColor, alpha: 0.9 * a });
      for (let y = cy - h + 1; y < cy + h; y += 2.4) {
        face.rect(cx - w - 1, y, w * 2 + 2, 1).fill({ color: 0x0f141c, alpha: 0.55 });
      }
    }
  };

  return {
    root,
    statusDot: status,
    setMode(next) {
      currentMode = next;
    },
    /** `intensity` 0..1 scales how hard the agent is working. */
    animate(t, intensity = 0) {
      const bx = root.baseX ?? root.x;
      const m = currentMode;
      const phase = t * 0.012 + bx;

      // Body motion per mode.
      let bob = Math.sin(t * 0.004 + bx * 0.05) * (0.8 + intensity * 1.4);
      let shake = 0;
      let tilt = 0;
      if (m === "happy") bob = -Math.abs(Math.sin(t * 0.005 + bx)) * 3.2;
      if (m === "sleeping") {
        bob = Math.sin(t * 0.0016 + bx) * 1.1 + 2.2;
        tilt = 0.12 + Math.sin(t * 0.0016 + bx) * 0.02;
      }
      if (m === "error") shake = Math.sin(t * 0.09) * 1.8;
      if (m === "looping") {
        shake = Math.sin(t * 0.08) * 2.2;
        bob = Math.sin(t * 0.015) * 1.6;
        tilt = Math.sin(t * 0.02) * 0.16;
      }
      root.x = bx + shake;
      root.y = (root.baseY || 0) + bob;
      root.rotation = tilt;

      // Arms.
      armL.rotation = 0;
      armR.rotation = 0;
      if (m === "streaming") {
        armL.rotation = Math.sin(phase) * 0.14 * (0.3 + intensity);
        armR.rotation = -Math.sin(phase + 1.3) * 0.14 * (0.3 + intensity);
      } else if (m === "pending") {
        armL.rotation = 2.5 + Math.sin(t * 0.012) * 0.35; // waving for attention
        armR.rotation = -Math.sin(phase + 1.3) * 0.06;
      } else if (m === "happy") {
        armL.rotation = 2.2 + Math.sin(t * 0.01) * 0.2;
        armR.rotation = -2.2 - Math.sin(t * 0.01 + 1) * 0.2;
      } else if (m === "error") {
        armL.rotation = 2.7 + Math.sin(t * 0.08) * 0.1; // hands on head
        armR.rotation = -2.7 - Math.sin(t * 0.08) * 0.1;
      } else if (m === "looping") {
        armL.rotation = 2.4 + Math.sin(t * 0.02) * 0.4;
        armR.rotation = -2.4 - Math.sin(t * 0.02 + 1) * 0.4;
      } else if (m === "sleeping") {
        armL.rotation = 0.05;
        armR.rotation = -0.05;
      }

      // Face.
      const blinking = Math.sin(t * 0.0013 + seed * 2.1) > 0.985;
      const flicker = 0.85 + Math.sin(t * 0.01 + seed) * 0.15;
      face.clear();
      const kind = m === "happy" ? "happy" : m === "sleeping" ? "sleep" : m === "error" ? "x" : m === "looping" ? "looping" : "scan";
      eye(-8, -57, 4.8, blinking ? 0.8 : 4.4, flicker, kind);
      eye(8, -57, 4.8, blinking ? 0.8 : 4.4, flicker, kind);
      if (m === "happy") {
        face.moveTo(-6, -48).arc(0, -48, 6, 0, Math.PI).stroke(stroke(2.2, faceColor, 0.9));
      } else if (m === "sleeping") {
        face.circle(0, -45, 1.8).stroke(stroke(1.6, faceColor, 0.6));
      } else if (m === "error") {
        face.moveTo(-7, -45).lineTo(-3.5, -48).lineTo(0, -45).lineTo(3.5, -48).lineTo(7, -45)
          .stroke(stroke(2, faceColor, flicker));
      } else if (m === "looping") {
        face.circle(0, -46, 3.2).stroke(stroke(2, faceColor, flicker));
      } else {
        const mw = 5 + intensity * 3;
        face.ellipse(0, -46, mw, 2.4 + intensity * 1.2).fill({ color: faceColor, alpha: 0.75 * flicker });
      }

      // Effects: drifting z's while asleep, smoke while failing or looping.
      fx.clear();
      if (m === "sleeping") {
        for (let k = 0; k < 3; k += 1) {
          const p = ((t * 0.0004 + k / 3 + seed * 0.13) % 1);
          const zx = 20 + p * 16;
          const zy = -78 - p * 30;
          const s = 3 + p * 4;
          fx.moveTo(zx, zy).lineTo(zx + s, zy).lineTo(zx, zy + s).lineTo(zx + s, zy + s)
            .stroke(stroke(1.6, 0xa5b4cc, 1 - p));
        }
      } else if (m === "error" || m === "looping") {
        for (let k = 0; k < 5; k += 1) {
          const p = ((t * 0.0008 + k / 5 + seed * 0.12) % 1);
          const sx = Math.sin(p * 8 + k * 1.3) * 7 + (k - 2) * 3.5;
          const sy = -76 - p * 38;
          const r = 2.5 + p * 7;
          fx.circle(sx, sy, r).fill({ color: 0x4b5563, alpha: 0.65 * (1 - p) });
        }
      }

      status.alpha = 0.6 + Math.sin(t * 0.007 + seed) * 0.4 * (0.3 + intensity);
    },
    setState(nextColor) {
      status.tint = nextColor;
    },
  };
}

// Desk + monitor + nameplate. Origin = top-left of the desk surface. All the
// numbers sit on the desk's front face so neighbouring rows never collide:
//   row 1 account · row 2 model + tokens · row 3 latency, cost, cache share
//   bottom bar = elapsed time (green → amber → red), left pile = queued requests
export function createDesk({
  color,
  label = "",
  meta = "",
  provider = "",
  clientType = "cli",
  elapsedMs = 0,
  cost = 0,
  cachedPct = 0,
  queued = 1,
  depth = 1,
  isLooping = false,
}) {
  const root = new Container();
  const W = 150;
  const H = 96;
  const isApp = clientType === "app" || String(provider || "").toLowerCase().includes("app");

  const desk = new Graphics();
  // Soft layered ground shadow (offset down-right, as if lit from top-left).
  desk.ellipse(W / 2 + 8, H + 6, W * 0.62, 11).fill({ color: 0x000000, alpha: 0.18 });
  desk.ellipse(W / 2 + 6, H + 4, W * 0.56, 8).fill({ color: 0x000000, alpha: 0.28 });
  // Front face (gradient, darker toward the floor) + right side face for depth.
  desk.roundRect(0, 34, W, H - 34, 7).fill(vgrad(0x2b3443, 0x181d26));
  desk.poly([W, 40, W + 9, 32, W + 9, H - 8, W, H - 2]).fill({ color: 0x10141b });
  // Desk top: lighter slab seen from slightly above, with a bright front lip.
  desk.poly([-5, 28, 8, 20, W - 2, 20, W + 9, 28]).fill({ color: 0x5d6b7d });
  desk.roundRect(-5, 26, W + 14, 14, 6).fill(vgrad(0x65738a, 0x3a4554));
  desk.roundRect(-5, 26, W + 14, 2.5, 2).fill({ color: 0xffffff, alpha: 0.3 });
  desk.roundRect(0, 40, W, 2, 1).fill({ color: 0x000000, alpha: 0.35 });
  root.addChild(desk);

  // Elapsed-time bar: fill grows with latency, colour warns when it drags.
  const ratio = Math.min(1, elapsedMs / 40000);
  const barColor = elapsedMs < 12000 ? 0x34d399 : elapsedMs < 26000 ? 0xfbbf24 : 0xef4444;
  const bar = new Graphics();
  bar.roundRect(10, H - 9, W - 20, 4, 2).fill({ color: 0x0f141c });
  bar.roundRect(10, H - 9, Math.max(4, (W - 20) * ratio), 4, 2).fill({ color: barColor });
  root.addChild(bar);

  const glow = new Graphics();
  glow.roundRect(W / 2 - 62, -30, 76, 62, 12).fill({ color, alpha: 0.12 });
  root.addChild(glow);

  const screen = new Graphics();
  screen.roundRect(W / 2 - 50, -16, 58, 38, 5).fill({ color: 0x000000, alpha: 0.35 }); // drop shadow
  screen.roundRect(W / 2 - 52, -18, 58, 38, 5).fill(vgrad(0x2a313c, 0x0b0e13));
  screen.roundRect(W / 2 - 48, -14, 50, 30, 3).fill({ color, alpha: 0.6 });
  for (let i = 0; i < 4; i += 1) {
    screen.roundRect(W / 2 - 44, -9 + i * 6, 18 + ((i * 11) % 22), 2.4, 1).fill({ color: 0xffffff, alpha: 0.5 });
  }
  screen.poly([W / 2 - 48, -14, W / 2 - 22, -14, W / 2 - 34, 16, W / 2 - 48, 16]).fill({ color: 0xffffff, alpha: 0.07 }); // glass glare
  screen.roundRect(W / 2 - 29, 20, 8, 6, 2).fill({ color: 0x2d3541 });
  root.addChild(screen);

  // Monitor badge: APP (violet) vs CLI (emerald)
  const badgeLabel = isApp ? "APP" : "CLI";
  const badgeColor = isApp ? 0xd8b4fe : 0x6ee7b7;
  const badgeBg = isApp ? 0x3b0764 : 0x064e3b;
  const badgeBorder = isApp ? 0xa855f7 : 0x059669;

  const monTag = new Graphics();
  monTag.roundRect(W / 2 - 46, -13, 26, 11, 2.5).fill({ color: badgeBg, alpha: 0.9 });
  monTag.roundRect(W / 2 - 46, -13, 26, 11, 2.5).stroke({ width: 0.8, color: badgeBorder, alpha: 0.95 });
  root.addChild(monTag);

  const monTagText = new Text({
    text: badgeLabel,
    style: { fontFamily: MONO, fontSize: 7, fill: badgeColor, fontWeight: "900" },
  });
  monTagText.anchor.set(0.5, 0.5);
  monTagText.x = W / 2 - 33;
  monTagText.y = -7.5;
  root.addChild(monTagText);

  const keys = new Graphics();
  keys.roundRect(W / 2 + 14, 29, 34, 8, 3).fill({ color: 0x0b0e13 });
  keys.roundRect(W / 2 + 14, 27, 34, 8, 3).fill(vgrad(0x3b4554, 0x232a35));
  root.addChild(keys);

  // Request pile: one sheet per queued request (max 5) + ×N when stacked.
  const pile = new Graphics();
  const sheets = Math.min(5, Math.max(1, queued));
  for (let i = 0; i < sheets; i += 1) {
    pile.roundRect(-2 + (i % 2), 22 - i * 3.4, 22, 5, 1.5)
      .fill({ color: i % 2 ? 0xe6edf6 : 0xcfd8e6 })
      .stroke({ width: 0.6, color: 0x0f141c, alpha: 0.5 });
  }
  root.addChild(pile);
  if (queued > 1) {
    const q = new Text({ text: `×${queued}`, style: { fontFamily: SANS, fontSize: 10, fill: 0xfbbf24, fontWeight: "800" } });
    q.anchor.set(0.5, 1);
    q.x = 9;
    q.y = 22 - sheets * 3.4 - 1;
    root.addChild(q);
  }

  const name = new Text({
    text: clip(label, 18),
    style: { fontFamily: SANS, fontSize: 11.5, fill: isApp ? 0xf5d0fe : 0xe6edf6, fontWeight: "700" },
  });
  name.anchor.set(0.5, 0);
  name.x = W / 2;
  name.y = 42;

  const providerUpper = provider ? provider.toUpperCase() : "";
  const subText = providerUpper ? `${providerUpper} · ${clip(meta, 18)}` : clip(meta, 28);
  const sub = new Text({
    text: clip(subText, 28),
    style: { fontFamily: MONO, fontSize: 8.5, fill: isApp ? 0xd8b4fe : 0x93a1b5 },
  });
  sub.anchor.set(0.5, 0);
  sub.x = W / 2;
  sub.y = 57;

  const secs = elapsedMs >= 1000 ? `${(elapsedMs / 1000).toFixed(1)}s` : `${elapsedMs}ms`;
  const stats = new Text({
    text: `${secs} · $${cost.toFixed(2)} · ${cachedPct}% cached`,
    style: { fontFamily: MONO, fontSize: 8.5, fill: barColor },
  });
  stats.anchor.set(0.5, 0);
  stats.x = W / 2;
  stats.y = 71;

  root.addChild(name, sub, stats);

  // Selection ring (toggled from outside) + click target.
  const ring = new Graphics();
  ring.roundRect(-12, -76, W + 24, H + 84, 14).stroke({ width: 2.5, color: 0xfde047, alpha: 0.9 });
  ring.roundRect(-12, -76, W + 24, H + 84, 14).fill({ color: 0xfde047, alpha: 0.05 });
  ring.visible = false;
  root.addChildAt(ring, 0);

  // Hazard border for runaway looping workstations
  const hazard = new Graphics();
  hazard.roundRect(-10, 18, W + 20, H - 8, 10).stroke({ width: 3, color: 0xf43f5e, alpha: 0.95 });
  hazard.roundRect(-10, 18, W + 20, H - 8, 10).fill({ color: 0xf43f5e, alpha: 0.08 });
  hazard.visible = Boolean(isLooping);
  root.addChildAt(hazard, 0);

  root.eventMode = "static";
  root.cursor = "pointer";
  root.hitArea = new Rectangle(-12, -76, W + 24, H + 84);
  root.scale.set(depth);

  return {
    root,
    screen,
    glow,
    setSelected(on) {
      ring.visible = !!on;
    },
    setHazard(on) {
      hazard.visible = !!on;
    },
    /** Flicker on the monitor while work is in flight. */
    animate(t, intensity = 0) {
      screen.alpha = 0.7 + Math.sin(t * 0.008 + root.x) * 0.12 * (0.4 + intensity);
      glow.alpha = 0.3 + intensity * 0.5 + Math.sin(t * 0.004 + root.x) * 0.08;
      if (hazard.visible) {
        hazard.alpha = 0.45 + Math.sin(t * 0.008) * 0.45;
      }
    },
  };
}

export function createBadge(text, { color = 0x22d3ee, size = 10 } = {}) {
  const label = new Text({
    text,
    style: { fontFamily: SANS, fontSize: size, fill: color, fontWeight: "700" },
  });
  return label;
}

export { STATE_COLORS, STATE_LABELS };
