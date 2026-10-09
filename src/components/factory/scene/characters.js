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
  const skinVariant = skinItem?.variant || "tactical_visor";
  const skinColor = skinItem?.color ? parseHexColor(skinItem.color, trimColor ?? defaultTrim) : (trimColor ?? defaultTrim);
  const skinSecondaryColor = skinItem?.secondaryColor ? parseHexColor(skinItem.secondaryColor, 0x111827) : 0x111827;
  const skinAccentColor = skinItem?.accentColor ? parseHexColor(skinItem.accentColor, 0xffffff) : 0xffffff;
  const trim = skinColor;
  const SHELL = hasCustomSkin ? 0x1e2430 : 0xf3f5f9;
  const SHADE = hasCustomSkin ? 0x111622 : 0xc9d0dc;

  // Torso: 5 Distinct Staff Uniforms & Silhouettes
  const body = new Graphics();
  if (skinArchetype === "mecha_pilot") {
    // Heavy Industrial Exoskeleton Vest
    body.poly([-22, -30, 22, -30, 18, -6, -18, -6]).fill({ color: 0x18181b }).stroke({ width: 1.5, color: skinColor });
    // Pauldrons
    body.poly([-27, -29, -20, -33, -17, -25, -25, -20]).fill({ color: 0x27272a }).stroke({ width: 1, color: skinColor });
    body.poly([27, -29, 20, -33, 17, -25, 25, -20]).fill({ color: 0x27272a }).stroke({ width: 1, color: skinColor });
    // Hazard Chevrons
    body.poly([-12, -26, -7, -26, -3, -20, -8, -20]).fill({ color: 0xeab308 });
    body.poly([2, -26, 7, -26, 11, -20, 6, -20]).fill({ color: 0xeab308 });
    // Heavy Tactical Harness Straps
    body.rect(-13, -30, 2, 24).fill({ color: skinColor });
    body.rect(11, -30, 2, 24).fill({ color: skinColor });
    // Central Fusion Core with Cage Grille
    body.circle(0, -14, 5.5).fill({ color: 0x09090b }).stroke({ width: 1.4, color: skinColor });
    body.circle(0, -14, 3).fill({ color: skinColor });
    body.rect(-4, -15, 8, 2).fill({ color: 0xffffff });
  } else if (skinArchetype === "stealth_ninja") {
    // Sleek Form-Fitting Shinobi Gi
    body.poly([-16, -30, 16, -30, 13, -6, -13, -6]).fill({ color: 0x090d16 }).stroke({ width: 1.4, color: skinColor });
    // Crossed Kimono Lapels
    body.poly([-16, -30, 5, -14, 2, -14, -16, -28]).fill({ color: skinColor });
    // Diagonal Tactical Sash
    body.poly([-16, -28, -11, -30, 14, -9, 9, -7]).fill({ color: skinColor, alpha: 0.9 });
    // Obi Waist Sash & Knot
    body.roundRect(-14, -12, 28, 6, 2).fill({ color: 0x1e1b4b }).stroke({ width: 1.2, color: skinColor });
    body.poly([3, -7, 6, 1, 4, 6, 1, 1, 3, -7]).fill({ color: skinColor });
  } else if (skinArchetype === "matrix_hacker") {
    // Loose Oversized Slouchy Techwear Hoodie Body
    body.roundRect(-21, -30, 42, 25, 7).fill({ color: 0x121217 }).stroke({ width: 1.5, color: skinColor });
    // Cowl Neck Collar
    body.roundRect(-18, -32, 36, 10, 4).fill({ color: 0x1f1f28 }).stroke({ width: 1.2, color: skinColor });
    // Hanging Drawstrings with Metal Aglets
    body.rect(-7, -23, 2, 16).fill({ color: 0xffffff });
    body.rect(-7.5, -7, 3, 4).fill({ color: skinColor });
    body.rect(5, -23, 2, 16).fill({ color: 0xffffff });
    body.rect(4.5, -7, 3, 4).fill({ color: skinColor });
    // Kangaroo Pouch Pocket
    body.poly([-15, -14, 15, -14, 13, -6, -13, -6]).fill({ color: 0x09090d }).stroke({ width: 1, color: 0x27272a });
  } else if (skinArchetype === "celestial_astro") {
    // Pressurized Flight Suit Body
    body.poly([-18, -30, 18, -30, 16, -6, -16, -6]).fill({ color: 0xf1f5f9 }).stroke({ width: 1.4, color: skinColor });
    // Hermetic Helmet Seal Ring
    body.roundRect(-14, -33, 28, 5, 2).fill({ color: 0x334155 }).stroke({ width: 1.2, color: skinColor });
    // Gold Command Epaulets on Shoulders
    body.roundRect(-24, -31, 8, 4.5, 1).fill({ color: 0xf59e0b }).stroke({ width: 0.8, color: 0x78350f });
    body.roundRect(16, -31, 8, 4.5, 1).fill({ color: 0xf59e0b }).stroke({ width: 0.8, color: 0x78350f });
    // Dual Atmospheric Pressure Regulator Dials
    body.circle(-7, -17, 3.5).fill({ color: 0x0f172a }).stroke({ width: 1.2, color: skinColor });
    body.circle(-7, -17, 1.5).fill({ color: 0x22c55e });
    body.circle(7, -17, 3.5).fill({ color: 0x0f172a }).stroke({ width: 1.2, color: skinColor });
    body.circle(7, -17, 1.5).fill({ color: 0x38bdf8 });
  } else {
    // Default Cyber Suit (Corporate Tech Field Ops / Executive Security)
    body.poly([-18, -30, 18, -30, 15, -6, -15, -6]).fill(vgrad(0xffffff, SHELL, SHADE)).stroke({ width: 1.2, color: skinColor });
    // Sharp Lapels
    body.poly([-17, -30, -7, -14, -13, -14]).fill({ color: 0x0d1117 });
    body.poly([17, -30, 7, -14, 13, -14]).fill({ color: 0x0d1117 });
    // Security ID Badge Lanyard
    body.poly([-5, -30, 0, -18, 5, -30]).stroke({ width: 1.2, color: skinAccentColor, alpha: 0.85 });
    body.roundRect(-4.5, -19, 9, 12, 1.5).fill({ color: 0x090d16 }).stroke({ width: 1, color: skinColor });
    body.rect(-3, -17.5, 6, 4.5).fill({ color: skinColor });
    body.rect(-3, -11, 6, 1.5).fill({ color: 0xffffff });
    // Corporate Belt & Buckle
    body.rect(-15, -10, 30, 4).fill({ color: 0x020617 });
    body.roundRect(-3.5, -11, 7, 6, 1).fill({ color: 0x1e293b }).stroke({ width: 1, color: skinColor });
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

  // Custom Skin Accessories on Head matching 50 Curated Variants
  // 1. CYBER SUIT VARIANTS
  if (skinVariant === "tactical_visor") {
    head.roundRect(-24, -66, 48, 7, 2.5).fill({ color: 0x0f172a });
    head.roundRect(-24, -66, 48, 7, 2.5).stroke({ width: 1.6, color: skinColor });
    head.poly([-26, -66, -34, -76, -26, -72]).fill({ color: skinColor });
    head.poly([26, -66, 34, -76, 26, -72]).fill({ color: skinColor });
    head.circle(0, -62.5, 2.5).fill({ color: skinAccentColor });
  } else if (skinVariant === "laser_scout") {
    head.circle(8, -57, 7).stroke({ width: 1.6, color: skinColor });
    head.circle(8, -57, 2.5).fill({ color: 0xff0000 });
  } else if (skinVariant === "riot_shield") {
    head.roundRect(-25, -68, 50, 9, 3).fill({ color: 0x1e2430 });
    head.roundRect(-25, -68, 50, 9, 3).stroke({ width: 1.8, color: skinColor });
    head.circle(-16, -64, 2.5).fill({ color: skinAccentColor });
    head.circle(16, -64, 2.5).fill({ color: skinAccentColor });
  } else if (skinVariant === "cyber_horns") {
    head.poly([-20, -70, -30, -88, -14, -76]).fill({ color: skinColor });
    head.poly([20, -70, 30, -88, 14, -76]).fill({ color: skinColor });
  } else if (skinVariant === "crown_radiator") {
    head.poly([-16, -72, -14, -86, -8, -74]).fill({ color: skinColor });
    head.poly([-4, -74, 0, -92, 4, -74]).fill({ color: skinColor });
    head.poly([8, -74, 14, -86, 16, -72]).fill({ color: skinColor });
    head.circle(0, -70, 3).fill({ color: skinAccentColor });
  } else if (skinVariant === "gas_respirator") {
    head.circle(-14, -44, 6).fill({ color: 0x1e2430 }).stroke({ width: 1.5, color: skinColor });
    head.circle(14, -44, 6).fill({ color: 0x1e2430 }).stroke({ width: 1.5, color: skinColor });
    head.circle(-14, -44, 3).fill({ color: skinColor });
    head.circle(14, -44, 3).fill({ color: skinColor });
  } else if (skinVariant === "prism_goggles") {
    head.poly([-16, -62, -8, -66, -2, -62, -2, -52, -8, -48, -16, -52]).fill({ color: 0x0c4a6e }).stroke({ width: 1.6, color: skinColor });
    head.poly([2, -62, 8, -66, 16, -62, 16, -52, 8, -48, 2, -52]).fill({ color: 0x0c4a6e }).stroke({ width: 1.6, color: skinColor });
    head.circle(-9, -57, 2.5).fill({ color: skinAccentColor });
    head.circle(9, -57, 2.5).fill({ color: skinAccentColor });
  } else if (skinVariant === "samurai_crest") {
    head.poly([-22, -72, 0, -88, 22, -72, 0, -80]).fill({ color: skinColor });
    head.circle(0, -78, 3).fill({ color: skinAccentColor });
  } else if (skinVariant === "overdrive_vents") {
    head.poly([-18, -72, -28, -90, -14, -76]).fill({ color: skinColor });
    head.poly([18, -72, 28, -90, 14, -76]).fill({ color: skinColor });
  } else if (skinVariant === "holo_shroud") {
    head.ellipse(0, -66, 28, 12).stroke({ width: 1.8, color: skinColor, alpha: 0.8 });
    head.circle(0, -78, 4).fill({ color: skinAccentColor });
  }
  // 2. MECHA PILOT VARIANTS
  else if (skinVariant === "v_fin") {
    head.poly([-24, -88, -18, -92, 0, -76, 18, -92, 24, -88, 0, -72]).fill({ color: skinColor });
    head.poly([-4, -72, 0, -78, 4, -72, 0, -68]).fill({ color: 0xef4444 });
  } else if (skinVariant === "blast_shield") {
    head.roundRect(-24, -68, 48, 14, 3).fill({ color: 0x0f172a }).stroke({ width: 2, color: skinColor });
    head.circle(-18, -80, 3.5).fill({ color: 0xfde047 });
    head.circle(18, -80, 3.5).fill({ color: 0xfde047 });
  } else if (skinVariant === "eva_horn") {
    head.poly([-3, -74, 0, -98, 3, -74]).fill({ color: skinColor });
    head.roundRect(-28, -48, 5, 18, 2).fill({ color: skinColor });
    head.roundRect(23, -48, 5, 18, 2).fill({ color: skinColor });
  } else if (skinVariant === "cage_grille") {
    head.roundRect(-16, -52, 32, 14, 2).fill({ color: 0x18181b }).stroke({ width: 1.6, color: skinColor });
    head.roundRect(-22, -86, 4, 16, 1).fill({ color: 0x27272a }).stroke({ width: 1, color: skinColor });
    head.roundRect(18, -86, 4, 16, 1).fill({ color: 0x27272a }).stroke({ width: 1, color: skinColor });
  } else if (skinVariant === "missile_pod") {
    head.roundRect(-30, -42, 8, 12, 2).fill({ color: 0x1c1917 }).stroke({ width: 1.5, color: skinColor });
    head.roundRect(22, -42, 8, 12, 2).fill({ color: 0x1c1917 }).stroke({ width: 1.5, color: skinColor });
    head.circle(-26, -38, 1.5).fill({ color: 0xef4444 });
    head.circle(26, -38, 1.5).fill({ color: 0xef4444 });
  } else if (skinVariant === "quad_array") {
    head.poly([-22, -72, -26, -90, -20, -72]).fill({ color: skinColor });
    head.poly([-12, -76, -14, -94, -10, -76]).fill({ color: skinColor });
    head.poly([10, -76, 14, -94, 12, -76]).fill({ color: skinColor });
    head.poly([20, -72, 26, -90, 22, -72]).fill({ color: skinColor });
    head.circle(-26, -90, 2).fill({ color: skinAccentColor });
    head.circle(26, -90, 2).fill({ color: skinAccentColor });
  } else if (skinVariant === "halo_shield") {
    head.poly([-32, -42, -26, -46, -20, -42, -20, -34, -26, -30, -32, -34]).fill({ color: 0x064e3b }).stroke({ width: 1.5, color: skinColor });
    head.poly([20, -42, 26, -46, 32, -42, 32, -34, 26, -30, 20, -34]).fill({ color: 0x064e3b }).stroke({ width: 1.5, color: skinColor });
  } else if (skinVariant === "ram_horns") {
    head.poly([-18, -72, -34, -86, -18, -92, -14, -72]).fill({ color: skinColor });
    head.poly([18, -72, 34, -86, 18, -92, 14, -72]).fill({ color: skinColor });
  } else if (skinVariant === "radar_dish") {
    head.ellipse(-24, -84, 7, 12).fill({ color: 0x18181b }).stroke({ width: 1.5, color: skinColor });
    head.circle(-24, -84, 2).fill({ color: skinAccentColor });
  } else if (skinVariant === "hyper_wings") {
    head.poly([-26, -46, -44, -64, -34, -40]).fill({ color: skinColor });
    head.poly([26, -46, 44, -64, 34, -40]).fill({ color: skinColor });
  }
  // 3. STEALTH NINJA VARIANTS
  else if (skinVariant === "flowing_headband") {
    head.roundRect(-24, -66, 48, 8, 2).fill({ color: 0x1e1b4b }).stroke({ width: 1.5, color: skinColor });
    head.circle(0, -62, 3).fill({ color: 0x38bdf8 });
    head.poly([24, -62, 38, -56, 46, -46, 36, -48, 24, -56]).fill({ color: skinColor });
  } else if (skinVariant === "tactical_cowl") {
    head.roundRect(-24, -68, 48, 24, 6).fill({ color: 0x0f172a, alpha: 0.8 }).stroke({ width: 1.4, color: skinColor });
    head.circle(6, -57, 4.5).stroke({ width: 1.8, color: 0x22c55e });
    head.circle(6, -57, 1.5).fill({ color: 0x22c55e });
  } else if (skinVariant === "oni_mask") {
    head.poly([-16, -72, -24, -88, -12, -76]).fill({ color: 0xef4444 });
    head.poly([16, -72, 24, -88, 12, -76]).fill({ color: 0xef4444 });
    head.poly([-16, -46, -10, -40, 0, -42, 10, -40, 16, -46, 12, -36, -12, -36]).fill({ color: 0xffffff });
  } else if (skinVariant === "kitsune_ears") {
    head.poly([-22, -72, -14, -88, -6, -76]).fill({ color: 0x1e2430 });
    head.poly([-20, -73, -14, -85, -8, -76]).fill({ color: skinColor });
    head.poly([6, -76, 14, -88, 22, -72]).fill({ color: 0x1e2430 });
    head.poly([8, -76, 14, -85, 20, -73]).fill({ color: skinColor });
  } else if (skinVariant === "conical_kasa") {
    head.poly([-36, -72, 0, -92, 36, -72]).fill({ color: 0x18181b }).stroke({ width: 1.6, color: skinColor });
    head.roundRect(-36, -72, 72, 2.5, 1).fill({ color: skinAccentColor });
  } else if (skinVariant === "twin_katanas") {
    head.poly([-24, -32, 28, -88, 25, -88, -27, -32]).fill({ color: skinColor });
    head.poly([24, -32, -28, -88, -25, -88, 27, -32]).fill({ color: skinColor });
  } else if (skinVariant === "tengu_beak") {
    head.poly([-12, -48, 0, -34, 12, -48, 0, -44]).fill({ color: 0x0f172a }).stroke({ width: 1.5, color: skinColor });
  } else if (skinVariant === "veil_shroud") {
    head.roundRect(-22, -62, 44, 26, 6).fill({ color: 0x0f172a, alpha: 0.85 }).stroke({ width: 1.2, color: skinColor });
  } else if (skinVariant === "scythe_crest") {
    head.poly([-14, -66, 0, -88, 14, -66, 0, -82]).fill({ color: skinColor });
  } else if (skinVariant === "void_mask") {
    head.roundRect(-18, -62, 36, 20, 4).fill({ color: 0x000000 }).stroke({ width: 1.8, color: skinColor });
    head.circle(0, -52, 3).fill({ color: skinColor });
  }
  // 4. MATRIX HACKER VARIANTS
  else if (skinVariant === "hoodie_cowl") {
    head.roundRect(-28, -74, 56, 46, 14).fill({ color: 0x051f0b, alpha: 0.9 }).stroke({ width: 1.8, color: skinColor });
  } else if (skinVariant === "vr_goggles") {
    head.roundRect(-22, -64, 44, 15, 3).fill({ color: 0x083344 }).stroke({ width: 1.8, color: skinColor });
    head.circle(-16, -78, 2.5).fill({ color: skinAccentColor });
    head.poly([-16, -64, -16, -78, -14, -78, -14, -64]).fill({ color: skinColor });
  } else if (skinVariant === "daemon_horns") {
    head.poly([-16, -70, -22, -86, -10, -74]).fill({ color: skinColor });
    head.poly([16, -70, 22, -86, 10, -74]).fill({ color: skinColor });
  } else if (skinVariant === "glitch_halo") {
    head.rect(-28, -76, 56, 42).stroke({ width: 1.5, color: skinColor, alpha: 0.8 });
    head.rect(-18, -82, 12, 6).fill({ color: skinColor, alpha: 0.7 });
  } else if (skinVariant === "floating_hud") {
    head.roundRect(24, -78, 30, 16, 2).fill({ color: 0x09090b }).stroke({ width: 1, color: skinColor });
  } else if (skinVariant === "respirator_eq") {
    head.roundRect(-18, -46, 36, 10, 3).fill({ color: 0x0f172a }).stroke({ width: 1.2, color: skinColor });
    head.rect(-12, -43, 4, 5).fill({ color: 0x22c55e });
    head.rect(-4, -45, 4, 7).fill({ color: 0xeab308 });
    head.rect(4, -45, 4, 7).fill({ color: 0xef4444 });
    head.rect(12, -43, 4, 5).fill({ color: 0x22c55e });
  } else if (skinVariant === "heatsink_fins") {
    head.rect(-18, -84, 4, 14).fill({ color: 0xea580c });
    head.rect(-10, -88, 4, 18).fill({ color: 0xea580c });
    head.rect(-2, -90, 4, 20).fill({ color: 0xea580c });
    head.rect(6, -88, 4, 18).fill({ color: 0xea580c });
    head.rect(14, -84, 4, 14).fill({ color: 0xea580c });
  } else if (skinVariant === "cable_dreads") {
    head.poly([-22, -62, -32, -48, -28, -12, -26, -12, -30, -48, -20, -62]).fill({ color: skinColor });
    head.poly([22, -62, 32, -48, 28, -12, 26, -12, 30, -48, 20, -62]).fill({ color: skinColor });
  } else if (skinVariant === "cyber_skull") {
    head.circle(-7, -55, 4).fill({ color: 0x000000 }).stroke({ width: 1.5, color: skinColor });
    head.circle(7, -55, 4).fill({ color: 0x000000 }).stroke({ width: 1.5, color: skinColor });
    head.poly([-8, -40, 8, -40, 8, -38, -8, -38]).fill({ color: skinColor });
  } else if (skinVariant === "wireframe_cube") {
    head.rect(-24, -76, 48, 42).stroke({ width: 1.6, color: skinColor });
    head.rect(-16, -68, 32, 26).stroke({ width: 1.2, color: skinAccentColor, alpha: 0.8 });
  }
  // 5. CELESTIAL ASTRO VARIANTS
  else if (skinVariant === "bubble_dome") {
    head.circle(0, -56, 28).stroke({ width: 2.5, color: skinColor, alpha: 0.9 });
    head.circle(0, -84, 3.5).fill({ color: 0xfef08a });
  } else if (skinVariant === "lunar_pack") {
    head.rect(-20, -86, 2, 18).fill({ color: skinColor });
    head.circle(-19, -86, 2).fill({ color: 0xffffff });
    head.ellipse(0, -54, 24, 18).stroke({ width: 2, color: 0xe2e8f0 });
  } else if (skinVariant === "sunburst_halo") {
    head.ellipse(0, -64, 30, 8).stroke({ width: 2, color: skinColor, alpha: 0.85 });
    head.circle(0, -76, 3).fill({ color: 0xfef08a });
    head.circle(-22, -70, 2).fill({ color: 0xfef08a });
    head.circle(22, -70, 2).fill({ color: 0xfef08a });
  } else if (skinVariant === "saturn_ring") {
    head.ellipse(0, -56, 36, 10).stroke({ width: 2.2, color: skinColor });
    head.circle(28, -62, 3).fill({ color: skinAccentColor });
  } else if (skinVariant === "star_crown") {
    head.poly([-16, -74, -12, -86, -8, -76]).fill({ color: skinColor });
    head.poly([-6, -76, 0, -92, 6, -76]).fill({ color: skinColor });
    head.poly([8, -76, 12, -86, 16, -74]).fill({ color: skinColor });
    head.circle(0, -74, 2.5).fill({ color: 0xffffff });
  } else if (skinVariant === "eclipse_corona") {
    head.ellipse(0, -56, 32, 18).stroke({ width: 3, color: skinColor, alpha: 0.6 });
    head.circle(0, -56, 22).fill({ color: 0x000000 }).stroke({ width: 1.5, color: skinColor });
  } else if (skinVariant === "pulsar_spires") {
    head.poly([-1.5, -78, 1.5, -78, 1.5, -98, -1.5, -98]).fill({ color: skinColor });
    head.circle(0, -98, 3).fill({ color: 0xffffff });
    head.poly([-1.5, -34, 1.5, -34, 1.5, -18, -1.5, -18]).fill({ color: skinColor });
    head.circle(0, -18, 3).fill({ color: 0xffffff });
  } else if (skinVariant === "aurora_ribbons") {
    head.ellipse(0, -78, 24, 6).stroke({ width: 2.5, color: skinColor, alpha: 0.75 });
  } else if (skinVariant === "angel_wings") {
    head.poly([-26, -46, -48, -78, -32, -38]).fill({ color: skinColor, alpha: 0.85 });
    head.poly([26, -46, 48, -78, 32, -38]).fill({ color: skinColor, alpha: 0.85 });
    head.ellipse(0, -80, 16, 5).stroke({ width: 1.6, color: skinAccentColor });
  } else if (skinVariant === "singularity_core") {
    head.ellipse(0, -56, 30, 26).stroke({ width: 2, color: 0xffffff, alpha: 0.9 });
    head.circle(-22, -70, 2.5).fill({ color: skinAccentColor });
    head.circle(22, -42, 2.5).fill({ color: skinAccentColor });
  }
  // Archetype fallbacks
  else if (skinArchetype === "stealth_ninja" || skinArchetype === "ninja") {
    head.roundRect(-24, -66, 48, 8, 3).fill({ color: 0x1e1b4b }).stroke({ width: 1.5, color: skinColor });
    head.circle(0, -62, 3).fill({ color: 0x38bdf8 });
  } else if (skinArchetype === "mecha_pilot") {
    head.poly([-22, -72, -18, -90, -12, -70]).fill({ color: skinColor });
    head.poly([12, -70, 18, -90, 22, -72]).fill({ color: skinColor });
  } else if (skinArchetype === "celestial_astro") {
    head.ellipse(0, -64, 30, 8).stroke({ width: 2, color: skinColor, alpha: 0.85 });
  } else if (skinArchetype === "matrix_hacker" || skinArchetype === "hacker") {
    head.roundRect(-27, -78, 54, 48, 16).fill({ color: 0x111827 }).stroke({ width: 1.6, color: skinColor });
  } else if (skinArchetype === "cyber_cat" || skin === "cat") {
    head.poly([-22, -72, -14, -86, -6, -76]).fill({ color: SHELL });
    head.poly([-20, -73, -14, -83, -8, -76]).fill({ color: 0xf472b6, alpha: 0.8 });
    head.poly([6, -76, 14, -86, 22, -72]).fill({ color: SHELL });
    head.poly([8, -76, 14, -83, 20, -73]).fill({ color: 0xf472b6, alpha: 0.8 });
  } else {
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
  isLooping = false,
  pet = "none",
  props = [],
  trophy = "none",
  detectedPort = null,
  webPort = null,
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

  // Advertised localhost web port badge (Orca Localhost Pattern)
  const portNum = detectedPort?.port || webPort;
  if (portNum) {
    const portLabel = `:${portNum}`;
    const portTag = new Graphics();
    portTag.roundRect(W / 2 - 17, -13, 27, 11, 2.5).fill({ color: 0x083344, alpha: 0.95 });
    portTag.roundRect(W / 2 - 17, -13, 27, 11, 2.5).stroke({ width: 0.8, color: 0x06b6d4, alpha: 0.95 });
    root.addChild(portTag);

    const portTagText = new Text({
      text: portLabel,
      style: { fontFamily: getMonoFont(), fontSize: 7, fill: 0x67e8f9, fontWeight: "900" },
    });
    portTagText.anchor.set(0.5, 0.5);
    portTagText.x = W / 2 - 3.5;
    portTagText.y = -7.5;
    root.addChild(portTagText);
  }

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

/**
 * Create a futuristic mini companion drone that hovers and patrols around a workstation desk.
 * Represents an active or completed subagent delegated by the lead agent.
 *
 * Visual parts:
 * - Sleek aerodynamic cyber-chassis with status-colored trim
 * - Optical sensor / cyclops eye that pulses when working, emerald when done, amber when waiting
 * - Dual anti-gravity thruster nacelles with flickering plasma flames
 * - Twin energy rings on engine nacelles
 * - Antenna with blinking beacon LED
 * - Floating mini role badge pill above the drone
 * - Interactive hover & click feedback
 */
export function createSubagentDrone({
  role = "Subagent",
  typeName = "specialist",
  status = "streaming",
  model = "flash",
  color = 0x38bdf8,
  index = 0,
  total = 1,
  depth = 1,
}) {
  const root = new Container();

  const STATUS_PALETTE = {
    streaming: { eye: 0x00f0ff, glow: 0x0284c7, flame: 0x38bdf8, trim: 0x38bdf8 },
    pending: { eye: 0xfbbf24, glow: 0xb45309, flame: 0xf59e0b, trim: 0xf59e0b },
    done: { eye: 0x34d399, glow: 0x059669, flame: 0x10b981, trim: 0x10b981 },
    idle: { eye: 0x38bdf8, glow: 0x0369a1, flame: 0x0284c7, trim: 0x64748b },
    error: { eye: 0xf43f5e, glow: 0x9f1239, flame: 0xef4444, trim: 0xef4444 },
  };

  const pal = STATUS_PALETTE[status] || STATUS_PALETTE.streaming;

  // 1. Thruster plasma flames (drawn dynamically in animate)
  const flames = new Graphics();
  root.addChild(flames);

  // 2. Main chassis body
  const body = new Graphics();

  // Outer engine struts
  body.roundRect(-20, -3, 40, 6, 2).fill({ color: 0x1e293b }).stroke({ width: 1, color: 0x334155 });

  // Left and Right thruster nacelles
  body.roundRect(-22, -6, 8, 14, 2.5).fill({ color: 0x0f172a }).stroke({ width: 1.2, color: pal.trim });
  body.roundRect(14, -6, 8, 14, 2.5).fill({ color: 0x0f172a }).stroke({ width: 1.2, color: pal.trim });

  // Energy rings on top of nacelles
  body.ellipse(-18, -6, 5, 1.8).fill({ color: pal.eye, alpha: 0.8 });
  body.ellipse(18, -6, 5, 1.8).fill({ color: pal.eye, alpha: 0.8 });

  // Central chassis pod (sleek hexagonal capsule)
  body.poly([-12, -7, 12, -7, 15, 0, 12, 7, -12, 7, -15, 0]).fill({ color: 0x090d16 }).stroke({ width: 1.4, color: pal.trim });

  // Specular top highlight
  body.poly([-9, -6, 9, -6, 12, -1, -12, -1]).fill({ color: 0xffffff, alpha: 0.15 });

  // Optical sensor (cyclops eye)
  body.circle(0, 0, 4.5).fill({ color: 0x030712 }).stroke({ width: 1.2, color: pal.eye });
  body.circle(0, 0, 2.8).fill({ color: pal.eye });
  body.circle(-1, -1, 1).fill({ color: 0xffffff });

  // Mini antenna
  body.moveTo(0, -7).lineTo(0, -14).stroke({ width: 1.2, color: 0x64748b });
  root.addChild(body);

  // 3. Beacon LED at tip of antenna
  const beacon = new Graphics();
  beacon.circle(0, -14, 1.8).fill({ color: pal.eye });
  beacon.circle(0, -14, 3.5).stroke({ width: 0.8, color: pal.eye, alpha: 0.4 });
  root.addChild(beacon);

  // 4. Role tag pill
  const cleanRole = clip(role || typeName || "Subagent", 14);
  const tagContainer = new Container();
  const tagBg = new Graphics();
  const tagText = new Text({
    text: cleanRole.toUpperCase(),
    style: {
      fontFamily: getMonoFont(),
      fontSize: 8,
      fill: pal.eye,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
  });
  tagText.anchor.set(0.5, 0.5);
  const tagW = Math.max(34, tagText.width + 10);
  const tagH = 13;
  tagBg.roundRect(-tagW / 2, -tagH / 2, tagW, tagH, 3.5)
    .fill({ color: 0x090d16, alpha: 0.88 })
    .stroke({ width: 1, color: pal.trim, alpha: 0.8 });
  tagContainer.addChild(tagBg, tagText);
  tagContainer.y = -24;
  root.addChild(tagContainer);

  // 5. Interaction
  root.eventMode = "static";
  root.cursor = "pointer";
  root.hitArea = new Rectangle(-24, -32, 48, 46);
  root.scale.set(0.9 * depth);

  return {
    root,
    status,
    role,
    animate(t, deskX, deskY) {
      // Calculate smooth hover position around desk
      let targetX = deskX + 75;
      let targetY = deskY - 50;

      if (total === 1) {
        targetX += -60;
        targetY += -30;
      } else if (total === 2) {
        targetX += index === 0 ? -65 : 65;
        targetY += -30;
      } else if (total === 3) {
        if (index === 0) { targetX += -75; targetY += -15; }
        else if (index === 1) { targetX += 0; targetY += -45; }
        else { targetX += 75; targetY += -15; }
      } else {
        // Multi-drone orbital arch
        const spread = Math.PI * 0.9;
        const startAngle = -Math.PI * 0.95;
        const angle = startAngle + (index / (total - 1)) * spread;
        targetX += Math.cos(angle) * 78;
        targetY += Math.sin(angle) * 45 - 15;
      }

      // Smooth floating oscillation
      const bobY = Math.sin(t * 0.004 + index * 1.6) * 5;
      const driftX = Math.cos(t * 0.003 + index * 1.3) * 4;
      root.x = targetX + driftX;
      root.y = targetY + bobY;
      root.rotation = Math.sin(t * 0.0035 + index) * 0.06;

      // Thruster flame animation
      flames.clear();
      const isWorking = status === "streaming";
      const flameH = (isWorking ? 8 : 4.5) + Math.sin(t * 0.03 + index * 2) * (isWorking ? 3.5 : 1.5);
      const flameAlpha = isWorking ? 0.85 : 0.55;

      // Left flame
      flames.poly([-20, 8, -16, 8, -18, 8 + flameH]).fill({ color: pal.flame, alpha: flameAlpha });
      flames.poly([-19, 8, -17, 8, -18, 8 + flameH * 0.6]).fill({ color: 0xffffff, alpha: 0.9 });

      // Right flame
      flames.poly([16, 8, 20, 8, 18, 8 + flameH]).fill({ color: pal.flame, alpha: flameAlpha });
      flames.poly([17, 8, 19, 8, 18, 8 + flameH * 0.6]).fill({ color: 0xffffff, alpha: 0.9 });

      // Beacon LED blink
      beacon.alpha = 0.5 + Math.sin(t * (isWorking ? 0.015 : 0.005) + index) * 0.5;
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
