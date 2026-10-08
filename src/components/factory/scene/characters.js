import { Container, FillGradient, Graphics, Rectangle, Text } from "pixi.js";
import { STATE_COLORS, STATE_LABELS } from "./office-layout";
import { getItemById } from "@/lib/catalog/index.js";
import { getActiveFont } from "@/lib/themeStore.js";

function parseHexColor(hexStr, fallback = 0x00f0ff) {
  if (!hexStr) return fallback;
  if (typeof hexStr === "number") return hexStr;
  const clean = String(hexStr).replace("#", "").trim();
  const parsed = parseInt(clean, 16);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function clip(text, max) {
  const str = String(text || "");
  return str.length > max ? `${str.slice(0, max - 1)}…` : str;
}

const getMonoFont = () => getActiveFont("mono");
const getSansFont = () => getActiveFont("ui");

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

const stroke = (w, c, a = 1) => ({ width: w, color: c, alpha: a, cap: "round", join: "round" });

// A chibi robot (big round helmet, oval visor with scanline eyes, coloured ear
// pods, tiny body) drawn from primitives — no sprite sheet, so every colour and
// pose is controllable from live data. Origin = base of the torso (hidden
// behind the desk/console), so the helmet and shoulders peek over the edge.
//
// Poses (`mode`):
//   streaming  typing, scanline eyes          pending   one arm waving, waiting
//   happy      ^ ^ eyes, smile, bounce        sleeping  closed eyes, drifting z's
//   error      X eyes, shaking, smoke, arms up
export function createCharacter({ color, depth = 1, scale = 1, seed = 0, trimColor, mode = "streaming", clientType = "cli", skin = "classic", aura = "none" }) {
  const root = new Container();
  const isApp = clientType === "app";
  const defaultTrim = isApp ? 0x8b5cf6 : 0x10b981; // purple for app, emerald for cli

  // Resolve custom skin from catalog
  const skinItem = typeof skin === "string" ? getItemById(skin) : null;
  const hasCustomSkin = Boolean(skinItem || (skin && skin !== "classic" && skin !== "none"));
  const skinArchetype = skinItem?.archetype || (skin === "cat" ? "cyber_cat" : skin === "ninja" ? "stealth_ninja" : skin === "hacker" ? "matrix_hacker" : skin || "cyber_classic");
  const skinColor = skinItem?.color ? parseHexColor(skinItem.color, trimColor ?? defaultTrim) : (trimColor ?? defaultTrim);
  const trim = skinColor;
  const SHELL = hasCustomSkin ? 0x1e2430 : 0xf3f5f9;
  const SHADE = hasCustomSkin ? 0x111622 : 0xc9d0dc;

  // Torso: two stacked shells with a coloured band between them.
  const body = new Graphics();
  body.roundRect(-17, -30, 34, 22, 11).fill(vgrad(0xffffff, SHELL, SHADE));
  body.roundRect(-17, -30, 34, 8, 8).fill({ color: 0xffffff, alpha: 0.6 });
  body.roundRect(-14, -12, 28, 8, 4).fill({ color: trim });
  body.roundRect(-16, -8, 32, 16, 8).fill(vgrad(SHELL, SHADE, 0x8c97a9));
  body.roundRect(-16, 2, 32, 6, 4).fill({ color: SHADE, alpha: 0.6 });

  // Chest arc reactor for equipped custom skins
  if (hasCustomSkin) {
    body.circle(0, -18, 4).fill({ color: 0x0f172a });
    body.circle(0, -18, 4).stroke({ width: 1.2, color: skinColor });
    body.circle(0, -18, 2).fill({ color: skinColor });
  }

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
  // Ear comm pods
  head.circle(-27, -56, 8).fill({ color: skinColor });
  head.circle(27, -56, 8).fill({ color: skinColor });
  head.circle(-27, -56, 8).stroke({ width: 1.5, color: 0xffffff, alpha: 0.5 });
  head.circle(27, -56, 8).stroke({ width: 1.5, color: 0xffffff, alpha: 0.5 });
  head.circle(-29, -58, 3).fill({ color: 0xffffff, alpha: 0.7 });
  head.circle(25, -58, 3).fill({ color: 0xffffff, alpha: 0.7 });

  // Helmet Sphere
  head.ellipse(0, -56, 26, 24).fill(vgrad(hasCustomSkin ? 0x2d3748 : 0xffffff, SHELL, SHADE));
  if (hasCustomSkin) {
    head.ellipse(0, -56, 27, 25).stroke({ width: 2.2, color: skinColor, alpha: 0.95 }); // Emissive contour rim
  }
  head.ellipse(4, -50, 24, 21).stroke({ width: 3, color: 0x6b7a90, alpha: 0.25 }); // bottom-right rim shade
  head.ellipse(-8, -68, 12, 5.5).fill({ color: 0xffffff, alpha: 0.8 }); // specular
  head.circle(-14, -64, 2).fill({ color: 0xffffff, alpha: 0.9 });
  head.ellipse(0, -53, 22, 17).fill({ color: SHADE });
  head.ellipse(0, -53, 20, 15.5).fill({ color: 0x0f141c });
  head.ellipse(-5, -58, 11, 5).fill({ color: 0xffffff, alpha: 0.06 });

  // Custom Skin Accessories on Head according to 5 Archetypes
  if (skinArchetype === "cyber_suit") {
    // Cyber Suit: Angular Tactical Brow Visor & Wing Antennas
    head.roundRect(-24, -66, 48, 7, 2.5).fill({ color: 0x0f172a });
    head.roundRect(-24, -66, 48, 7, 2.5).stroke({ width: 1.6, color: skinColor });
    head.poly([-26, -66, -34, -76, -26, -72]).fill({ color: skinColor });
    head.poly([26, -66, 34, -76, 26, -72]).fill({ color: skinColor });
    head.circle(0, -62.5, 2.5).fill({ color: skinColor });
  } else if (skinArchetype === "stealth_ninja" || skinArchetype === "ninja") {
    // Ninja Headband & Laser Visor
    head.roundRect(-24, -66, 48, 8, 3).fill({ color: 0x1e1b4b });
    head.roundRect(-24, -66, 48, 8, 3).stroke({ width: 1.5, color: skinColor });
    head.circle(0, -62, 3).fill({ color: 0x38bdf8 });
    head.poly([24, -62, 38, -56, 32, -50, 22, -56]).fill({ color: skinColor, alpha: 0.9 });
  } else if (skinArchetype === "mecha_pilot") {
    // Dual Heavy Antennas
    head.poly([-22, -72, -18, -90, -12, -70]).fill({ color: skinColor });
    head.poly([12, -70, 18, -90, 22, -72]).fill({ color: skinColor });
    head.circle(-18, -90, 2.5).fill({ color: 0xffffff });
    head.circle(18, -90, 2.5).fill({ color: 0xffffff });
  } else if (skinArchetype === "celestial_astro") {
    // Golden Solar Halo
    head.ellipse(0, -64, 30, 8).stroke({ width: 2, color: skinColor, alpha: 0.85 });
    head.circle(0, -72, 3).fill({ color: 0xfef08a });
  } else if (skinArchetype === "matrix_hacker" || skinArchetype === "hacker") {
    // Hacker Matrix Hoodie Cowl
    head.roundRect(-27, -78, 54, 48, 16).fill({ color: 0x111827 });
    head.roundRect(-27, -78, 54, 48, 16).stroke({ width: 1.6, color: skinColor });
  } else if (skinArchetype === "cyber_cat" || skin === "cat") {
    // Cute Cat Ears
    head.poly([-22, -72, -14, -86, -6, -76]).fill({ color: SHELL });
    head.poly([-20, -73, -14, -83, -8, -76]).fill({ color: 0xf472b6, alpha: 0.8 }); // pink inner ear
    head.poly([6, -76, 14, -86, 22, -72]).fill({ color: SHELL });
    head.poly([8, -76, 14, -83, 20, -73]).fill({ color: 0xf472b6, alpha: 0.8 });
  } else {
    // High-Tech Crest
    head.poly([-8, -68, 0, -78, 8, -68]).fill({ color: skinColor });
  }

  // Aura Ring Graphics (drawn behind character)
  let auraGfx = null;
  const auraItem = typeof aura === "string" ? getItemById(aura) : null;
  const auraArchetype = auraItem?.archetype || "plasma_ring";
  if (aura && aura !== "none") {
    auraGfx = new Graphics();
    root.addChildAt(auraGfx, 0);
  }

  const face = new Graphics();
  const fx = new Graphics(); // smoke / z's, drawn in front of everything

  root.addChild(body, neck, status, armL, armR, head, face, fx);
  root.scale.set(scale * depth);

  let currentMode = mode;
  let faceColor = hasCustomSkin ? skinColor : color;

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

      // Cat skin face whiskers and nose
      if (skin === "cat") {
        face.moveTo(-12, -47).lineTo(-22, -49).stroke(stroke(1.2, 0xffffff, 0.7));
        face.moveTo(-12, -44).lineTo(-21, -43).stroke(stroke(1.2, 0xffffff, 0.7));
        face.moveTo(12, -47).lineTo(22, -49).stroke(stroke(1.2, 0xffffff, 0.7));
        face.moveTo(12, -44).lineTo(21, -43).stroke(stroke(1.2, 0xffffff, 0.7));
        face.poly([-2, -48, 0, -46, 2, -48]).fill({ color: 0xf472b6 });
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

      if (auraGfx) {
        auraGfx.clear();
        const auraCol = auraItem?.color ? parseHexColor(auraItem.color, 0x00f0ff) : 0x00f0ff;
        const pulse = 1 + Math.sin(t * 0.006) * 0.12;
        const aAlpha = m === "happy" ? 0.95 : m === "error" ? 0.35 + Math.sin(t * 0.08) * 0.35 : m === "sleeping" ? 0.25 : 0.65;

        if (auraArchetype === "matrix_rain") {
          for (let col = -3; col <= 3; col++) {
            const cx = col * 9;
            const dropP = ((t * 0.002 + col * 0.33 + seed * 0.2) % 1);
            const cy = -70 + dropP * 50;
            auraGfx.moveTo(cx, cy - 8).lineTo(cx, cy).stroke({ width: 1.5, color: auraCol, alpha: aAlpha * 0.8 });
            auraGfx.circle(cx, cy, 1.2).fill({ color: 0xffffff, alpha: aAlpha });
          }
        } else if (auraArchetype === "quantum_mist") {
          for (let p = 0; p < 4; p++) {
            const ang = t * 0.003 + (p * Math.PI) / 2;
            const rx = 30 * pulse + Math.sin(ang) * 4;
            const ry = 14 * pulse + Math.cos(ang) * 3;
            auraGfx.ellipse(0, -42, rx, ry).stroke({ width: 1.2, color: auraCol, alpha: aAlpha * 0.5 });
          }
          auraGfx.circle(Math.sin(t * 0.007) * 28, -42 + Math.cos(t * 0.007) * 11, 2.2).fill({ color: 0xffffff, alpha: aAlpha });
        } else if (auraArchetype === "glitch_halo") {
          const jitterX = Math.sin(t * 0.09) * 2;
          auraGfx.roundRect(-30 * pulse + jitterX, -54 * pulse, 60 * pulse, 24 * pulse, 6).stroke({ width: 2, color: auraCol, alpha: aAlpha });
          auraGfx.circle(jitterX * 2, -42, 3).stroke({ width: 1, color: 0xffffff, alpha: aAlpha * 0.7 });
        } else {
          auraGfx.ellipse(0, -42, 34 * pulse, 13 * pulse).stroke({ width: 2, color: auraCol, alpha: aAlpha });
          auraGfx.ellipse(0, -42, 26 * pulse, 9 * pulse).stroke({ width: 1.2, color: 0xffffff, alpha: aAlpha * 0.8 });
          if (m === "happy") {
            auraGfx.circle(Math.sin(t * 0.01) * 32, -42 + Math.cos(t * 0.01) * 12, 2.5).fill({ color: 0xffffff });
          }
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
  pet = "none",
  props = [],
  trophy = "none",
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
    style: { fontFamily: getMonoFont(), fontSize: 7, fill: badgeColor, fontWeight: "900" },
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
    const q = new Text({ text: `×${queued}`, style: { fontFamily: getSansFont(), fontSize: 10, fill: 0xfbbf24, fontWeight: "800" } });
    q.anchor.set(0.5, 1);
    q.x = 9;
    q.y = 22 - sheets * 3.4 - 1;
    root.addChild(q);
  }

  const name = new Text({
    text: clip(label, 18),
    style: { fontFamily: getSansFont(), fontSize: 11.5, fill: isApp ? 0xf5d0fe : 0xe6edf6, fontWeight: "700" },
  });
  name.anchor.set(0.5, 0);
  name.x = W / 2;
  name.y = 42;

  const providerUpper = provider ? provider.toUpperCase() : "";
  const subText = providerUpper ? `${providerUpper} · ${clip(meta, 18)}` : clip(meta, 28);
  const sub = new Text({
    text: clip(subText, 28),
    style: { fontFamily: getMonoFont(), fontSize: 8.5, fill: isApp ? 0xd8b4fe : 0x93a1b5 },
  });
  sub.anchor.set(0.5, 0);
  sub.x = W / 2;
  sub.y = 57;

  // Unknown telemetry (null) renders as an em dash, never as a fabricated zero.
  const safeElapsed = Number.isFinite(elapsedMs) ? elapsedMs : null;
  const costLabel = Number.isFinite(cost) ? `$${cost.toFixed(2)}` : "—";
  const cachedLabel = Number.isFinite(cachedPct) ? `${cachedPct}% cached` : "— cached";
  const secs = safeElapsed === null
    ? "—"
    : safeElapsed >= 1000 ? `${(safeElapsed / 1000).toFixed(1)}s` : `${safeElapsed}ms`;
  const stats = new Text({
    text: `${secs} · ${costLabel} · ${cachedLabel}`,
    style: { fontFamily: getMonoFont(), fontSize: 8.5, fill: barColor },
  });
  stats.anchor.set(0.5, 0);
  stats.x = W / 2;
  stats.y = 71;

  root.addChild(name, sub, stats);

  // Cosmetic Props, Pets & Trophies from Catalog
  const propList = Array.isArray(props) ? props : [props];
  const propItems = propList.map((p) => (typeof p === "string" ? getItemById(p) : p)).filter(Boolean);
  const hasEspresso = propList.includes("coffee_machine") || propItems.some((it) => it.archetype === "espresso_station" || it.id?.includes("prop_3") || it.id?.includes("espresso"));
  const hasBonsai = propList.includes("bonsai") || propItems.some((it) => it.archetype === "terrarium_bonsai" || it.id?.includes("prop_4") || it.id?.includes("bonsai"));
  const hasServer = propItems.some((it) => it.archetype === "supercomputer" || it.id?.includes("prop_0") || it.id?.includes("server"));
  const hasHolo = propItems.some((it) => it.archetype === "hologram_emitter" || it.id?.includes("prop_2") || it.id?.includes("holo"));
  const hasDualMonitor = propItems.some((it) => it.archetype === "dual_monitor" || it.id?.includes("prop_1") || it.id?.includes("monitor"));
  const hasArcade = propItems.some((it) => it.archetype === "arcade_cabinet" || it.id?.includes("arcade"));
  const hasOscilloscope = propItems.some((it) => it.archetype === "lab_oscilloscope" || it.id?.includes("oscilloscope"));

  let coffeeSteam = null;
  if (hasEspresso) {
    const coffeeMachine = new Container();
    coffeeMachine.x = W - 32;
    coffeeMachine.y = 12;
    const cmBody = new Graphics();
    cmBody.roundRect(0, 0, 16, 20, 3).fill(vgrad(0x475569, 0x1e293b));
    cmBody.roundRect(2, 2, 12, 5, 1.5).fill({ color: 0x0f172a });
    cmBody.roundRect(3, 3, 3, 3, 1).fill({ color: 0x38bdf8 });
    cmBody.roundRect(2, 9, 12, 9, 1).fill({ color: 0x0f172a });
    cmBody.roundRect(4, 11, 7, 7, 2).fill({ color: 0xf8fafc }); // cup
    cmBody.roundRect(5, 12, 5, 2, 1).fill({ color: 0x78350f }); // coffee
    coffeeMachine.addChild(cmBody);
    coffeeSteam = new Graphics();
    coffeeMachine.addChild(coffeeSteam);
    root.addChild(coffeeMachine);
  }

  if (hasBonsai) {
    const bonsai = new Container();
    bonsai.x = 4;
    bonsai.y = 14;
    const bPot = new Graphics();
    bPot.roundRect(0, 10, 14, 7, 2).fill({ color: 0x7c2d12 });
    bPot.ellipse(7, 6, 7, 5).fill({ color: 0x15803d });
    bPot.circle(4, 4, 3.8).fill({ color: 0x22c55e });
    bPot.circle(10, 4, 3.8).fill({ color: 0x16a34a });
    bonsai.addChild(bPot);
    root.addChild(bonsai);
  }

  let serverLeds = null;
  if (hasServer) {
    const serverTower = new Container();
    serverTower.x = W - 22;
    serverTower.y = 8;
    const stGfx = new Graphics();
    stGfx.roundRect(0, 0, 14, 28, 2).fill(vgrad(0x1e293b, 0x0f172a));
    stGfx.roundRect(0, 0, 14, 28, 2).stroke({ width: 1, color: 0x334155 });
    serverTower.addChild(stGfx);
    serverLeds = new Graphics();
    serverTower.addChild(serverLeds);
    root.addChild(serverTower);
  }

  let holoCube = null;
  if (hasHolo) {
    const holoProj = new Container();
    holoProj.x = 6;
    holoProj.y = 10;
    const hpBase = new Graphics();
    hpBase.ellipse(8, 22, 9, 3.5).fill({ color: 0x1e293b });
    hpBase.ellipse(8, 22, 9, 3.5).stroke({ width: 1, color: 0x06b6d4 });
    hpBase.poly([8, 22, 1, 6, 15, 6]).fill({ color: 0x06b6d4, alpha: 0.2 });
    holoProj.addChild(hpBase);
    holoCube = new Graphics();
    holoCube.x = 8;
    holoCube.y = 4;
    holoCube.roundRect(-4, -4, 8, 8, 1).stroke({ width: 1.2, color: 0x38bdf8, alpha: 0.9 });
    holoCube.roundRect(-4, -4, 8, 8, 1).fill({ color: 0x06b6d4, alpha: 0.4 });
    holoProj.addChild(holoCube);
    root.addChild(holoProj);
  }

  if (hasDualMonitor) {
    const sideMon = new Container();
    sideMon.x = 4;
    sideMon.y = 10;
    const smGfx = new Graphics();
    smGfx.roundRect(0, 0, 14, 24, 2).fill(vgrad(0x1e293b, 0x0f172a));
    smGfx.roundRect(0, 0, 14, 24, 2).stroke({ width: 1, color: 0x38bdf8, alpha: 0.7 });
    smGfx.roundRect(2, 2, 10, 20, 1).fill({ color: 0x020617 });
    // Code lines on side monitor
    for (let l = 0; l < 4; l++) {
      smGfx.roundRect(3, 4 + l * 4.5, 5 + (l % 2) * 3, 1.2, 0.5).fill({ color: l % 2 ? 0x22c55e : 0x00f0ff, alpha: 0.8 });
    }
    sideMon.addChild(smGfx);
    root.addChild(sideMon);
  }

  if (hasArcade) {
    const arc = new Container();
    arc.x = W - 24;
    arc.y = 6;
    const arcGfx = new Graphics();
    arcGfx.roundRect(0, 0, 16, 30, 2).fill(vgrad(0x4c1d95, 0x1e1b4b));
    arcGfx.roundRect(0, 0, 16, 30, 2).stroke({ width: 1, color: 0xa855f7 });
    arcGfx.roundRect(2, 2, 12, 6, 1).fill({ color: 0xf43f5e }); // Marquee
    arcGfx.roundRect(2, 10, 12, 11, 1).fill({ color: 0x060814 }); // Screen
    arcGfx.circle(5, 24, 1.5).fill({ color: 0xf59e0b }); // Joystick
    arc.addChild(arcGfx);
    root.addChild(arc);
  }

  let oscWave = null;
  if (hasOscilloscope) {
    const osc = new Container();
    osc.x = 6;
    osc.y = 12;
    const oscGfx = new Graphics();
    oscGfx.roundRect(0, 0, 18, 18, 2).fill({ color: 0x1e293b });
    oscGfx.roundRect(0, 0, 18, 18, 2).stroke({ width: 1, color: 0x10b981 });
    oscGfx.circle(9, 9, 6.5).fill({ color: 0x022c22 });
    osc.addChild(oscGfx);
    oscWave = new Graphics();
    osc.addChild(oscWave);
    root.addChild(osc);
  }

  if (trophy && trophy !== "none") {
    const trophyItem = typeof trophy === "string" ? getItemById(trophy) : null;
    const trophyCol = trophyItem?.color ? parseHexColor(trophyItem.color, 0xf59e0b) : 0xf59e0b;
    const trArchetype = trophyItem?.archetype || "quantum_crystal";
    const trophyCont = new Container();
    trophyCont.x = W - 14;
    trophyCont.y = 16;
    const trGfx = new Graphics();
    trGfx.roundRect(-6, 8, 12, 4, 1).fill({ color: 0x0f172a }); // Obsidian base
    trGfx.roundRect(-6, 8, 12, 4, 1).stroke({ width: 0.8, color: trophyCol, alpha: 0.6 });

    if (trArchetype === "golden_key") {
      trGfx.circle(0, -2, 4).stroke({ width: 1.5, color: trophyCol });
      trGfx.moveTo(0, 2).lineTo(0, 8).stroke({ width: 1.5, color: trophyCol });
      trGfx.moveTo(0, 5).lineTo(2.5, 5).stroke({ width: 1.2, color: trophyCol });
    } else if (trArchetype === "silicon_wafer") {
      trGfx.circle(0, 0, 5.5).fill({ color: 0x1e293b });
      trGfx.circle(0, 0, 5.5).stroke({ width: 1.2, color: trophyCol });
      trGfx.moveTo(-4, 0).lineTo(4, 0).stroke({ width: 0.8, color: 0x38bdf8, alpha: 0.8 });
      trGfx.moveTo(0, -4).lineTo(0, 4).stroke({ width: 0.8, color: 0xec4899, alpha: 0.8 });
    } else if (trArchetype === "diamond_bug") {
      trGfx.ellipse(0, 0, 4.5, 5.5).fill({ color: trophyCol });
      trGfx.circle(0, -3.5, 2.5).fill({ color: 0xffffff });
      trGfx.moveTo(-4, -1).lineTo(-6, -3).stroke({ width: 1, color: trophyCol });
      trGfx.moveTo(4, -1).lineTo(6, -3).stroke({ width: 1, color: trophyCol });
    } else {
      trGfx.poly([0, -6, 5, 2, -5, 2]).fill({ color: trophyCol });
      trGfx.poly([0, -6, 5, 2, 0, 6, -5, 2]).stroke({ width: 1, color: 0xffffff, alpha: 0.8 });
      trGfx.circle(0, 0, 1.5).fill({ color: 0xffffff });
    }
    trophyCont.addChild(trGfx);
    root.addChild(trophyCont);
  }

  let petContainer = null;
  const petItem = typeof pet === "string" ? getItemById(pet) : null;
  const petArchetype = petItem?.archetype || (pet === "cat" ? "cyber_cat" : pet === "shiba" ? "dozing_shiba" : pet);
  const petColor = petItem?.color ? parseHexColor(petItem.color, 0xf472b6) : (petArchetype === "dozing_shiba" ? 0xd97706 : 0xf472b6);

  if (pet && pet !== "none") {
    petContainer = new Container();
    petContainer.x = 24;
    petContainer.y = H - 16;
    const petGfx = new Graphics();

    if (petArchetype === "cyber_cat" || pet === "cat") {
      petGfx.ellipse(0, 0, 11, 7).fill({ color: petColor });
      petGfx.circle(-7, -2, 5.5).fill({ color: petColor });
      petGfx.poly([-11, -7, -8, -11, -5, -7]).fill({ color: 0xf43f5e });
      petGfx.poly([-7, -7, -4, -11, -1, -7]).fill({ color: 0xf43f5e });
      petGfx.moveTo(-9, -1).arc(-7, -1, 2, 0, Math.PI).stroke(stroke(1, 0x881337));
      petGfx.ellipse(7, 2, 5, 2.5).fill({ color: petColor });
    } else if (petArchetype === "dozing_shiba" || pet === "shiba") {
      petGfx.ellipse(0, 0, 13, 8).fill({ color: petColor });
      petGfx.ellipse(2, 2, 9, 4).fill({ color: 0xfef3c7 });
      petGfx.circle(-8, -2, 6).fill({ color: petColor });
      petGfx.poly([-12, -7, -9, -12, -6, -7]).fill({ color: 0xb45309 });
      petGfx.poly([-7, -7, -4, -12, -1, -7]).fill({ color: 0xb45309 });
      petGfx.moveTo(-10, -1).arc(-8, -1, 2, 0, Math.PI).stroke(stroke(1, 0x78350f));
      petGfx.circle(9, -2, 4).fill({ color: petColor });
    } else if (petArchetype === "hover_drone") {
      petGfx.ellipse(0, 6, 12, 3.5).stroke({ width: 1.5, color: petColor, alpha: 0.8 });
      petGfx.circle(0, 0, 7).fill({ color: 0x1e293b });
      petGfx.circle(0, 0, 7).stroke({ width: 1.2, color: petColor });
      petGfx.circle(0, 0, 3).fill({ color: 0x38bdf8 });
      petGfx.circle(-1, -1, 1).fill({ color: 0xffffff });
    } else {
      // Cyber Owl
      petGfx.ellipse(0, 0, 8, 10).fill({ color: 0x1e293b });
      petGfx.ellipse(0, 0, 8, 10).stroke({ width: 1.2, color: petColor });
      petGfx.circle(-3, -4, 2.5).fill({ color: petColor });
      petGfx.circle(3, -4, 2.5).fill({ color: petColor });
      petGfx.poly([-1, 0, 1, 0, 0, 2]).fill({ color: 0xf59e0b });
    }

    petContainer.addChild(petGfx);
    root.addChild(petContainer);
  }

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
    /** Flicker on the monitor and animate props/pets reacting to agent mode */
    animate(t, intensity = 0, mode = "streaming") {
      screen.alpha = 0.7 + Math.sin(t * 0.008 + root.x) * 0.12 * (0.4 + intensity);
      glow.alpha = 0.3 + intensity * 0.5 + Math.sin(t * 0.004 + root.x) * 0.08;
      if (hazard.visible) {
        hazard.alpha = 0.45 + Math.sin(t * 0.008) * 0.45;
      }
      if (coffeeSteam && intensity > 0) {
        coffeeSteam.clear();
        for (let i = 0; i < 3; i++) {
          const p = ((t * 0.001 + i / 3) % 1);
          const sx = 7 + Math.sin(p * 5 + i) * 3;
          const sy = 8 - p * 12;
          coffeeSteam.circle(sx, sy, 1 + p * 1.8).fill({ color: 0xffffff, alpha: 0.45 * (1 - p) });
        }
      } else if (coffeeSteam) {
        coffeeSteam.clear();
      }
      if (serverLeds) {
        serverLeds.clear();
        for (let idx = 0; idx < 4; idx++) {
          const blink = Math.sin(t * 0.008 + idx * 1.6) > 0;
          const ledCol = [0x22c55e, 0x00f0ff, 0xf59e0b, 0xec4899][idx];
          serverLeds.circle(4, 4 + idx * 6, 1.3).fill({ color: blink ? ledCol : 0x1e293b });
        }
      }
      if (holoCube) {
        holoCube.rotation = t * 0.002;
      }
      if (oscWave) {
        oscWave.clear();
        oscWave.moveTo(3, 9);
        for (let ox = 3; ox <= 15; ox += 1.5) {
          const oy = 9 + Math.sin(t * 0.01 + ox * 0.8) * 3;
          oscWave.lineTo(ox, oy);
        }
        oscWave.stroke({ width: 1.2, color: 0x34d399, alpha: 0.9 });
      }
      if (petContainer) {
        if (petArchetype === "hover_drone") {
          petContainer.y = (H - 24) + Math.sin(t * 0.005) * 4;
          petContainer.scale.y = 1;
        } else if (mode === "happy") {
          // Pet jumps up excitedly with celebrating agent
          petContainer.y = (H - 16) - Math.abs(Math.sin(t * 0.008)) * 7;
          petContainer.scale.y = 1 + Math.abs(Math.sin(t * 0.008)) * 0.15;
        } else if (mode === "sleeping") {
          // Pet sleeps calmly with gentle breathing
          petContainer.y = H - 16;
          petContainer.scale.y = 1 + Math.sin(t * 0.0016) * 0.04;
        } else if (mode === "error") {
          // Pet nervous shiver
          petContainer.x = 24 + Math.sin(t * 0.08) * 1.5;
          petContainer.y = H - 16;
        } else if (mode === "looping") {
          // Pet dizzy tilt
          petContainer.rotation = Math.sin(t * 0.04) * 0.15;
        } else {
          petContainer.y = H - 16;
          petContainer.scale.y = 1 + Math.sin(t * 0.003) * 0.06;
        }
      }
    },
  };
}

export function createBadge(text, { color = 0x22d3ee, size = 10 } = {}) {
  const label = new Text({
    text,
    style: { fontFamily: getSansFont(), fontSize: size, fill: color, fontWeight: "700" },
  });
  return label;
}

export { STATE_COLORS, STATE_LABELS };
