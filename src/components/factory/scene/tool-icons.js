import { Container, Graphics, Text } from "pixi.js";
import { getActiveFont } from "@/lib/themeStore.js";

// One glyph per tool type. Each is drawn inside a ±10 box so a badge can swap
// icons without relayout. Only the tool *type* is shown — never arguments.

const S = { cap: "round", join: "round" };

export const TOOL_TYPES = {
  bash: {
    label: "Bash",
    color: 0x34d399,
    draw(g, c) {
      g.moveTo(-8, -6).lineTo(-2, 0).lineTo(-8, 6).stroke({ width: 2.4, color: c, ...S });
      g.moveTo(1, 7).lineTo(8, 7).stroke({ width: 2.4, color: c, ...S });
    },
  },
  read: {
    label: "Read",
    color: 0x60a5fa,
    draw(g, c) {
      g.moveTo(-6, -9).lineTo(3, -9).lineTo(7, -5).lineTo(7, 9).lineTo(-6, 9).closePath()
        .stroke({ width: 2, color: c, ...S });
      g.moveTo(-3, -1).lineTo(4, -1).stroke({ width: 1.8, color: c, ...S });
      g.moveTo(-3, 3).lineTo(4, 3).stroke({ width: 1.8, color: c, ...S });
      g.moveTo(-3, 6.5).lineTo(1, 6.5).stroke({ width: 1.8, color: c, ...S });
    },
  },
  edit: {
    label: "Edit",
    color: 0xfbbf24,
    draw(g, c) {
      g.moveTo(-7, 8).lineTo(-6, 3).lineTo(4, -7).lineTo(8, -3).lineTo(-2, 7).closePath()
        .stroke({ width: 2, color: c, ...S });
      g.moveTo(1, -4).lineTo(5, 0).stroke({ width: 1.8, color: c, ...S });
      g.moveTo(-8, 9.5).lineTo(-1, 9.5).stroke({ width: 1.8, color: c, ...S });
    },
  },
  search: {
    label: "Search",
    color: 0xf472b6,
    draw(g, c) {
      g.circle(-2, -2, 6).stroke({ width: 2.2, color: c, ...S });
      g.moveTo(2.5, 2.5).lineTo(8, 8).stroke({ width: 2.6, color: c, ...S });
    },
  },
  web: {
    label: "Web",
    color: 0x22d3ee,
    draw(g, c) {
      g.circle(0, 0, 8.5).stroke({ width: 2, color: c, ...S });
      g.ellipse(0, 0, 3.6, 8.5).stroke({ width: 1.6, color: c, ...S });
      g.moveTo(-8.5, 0).lineTo(8.5, 0).stroke({ width: 1.6, color: c, ...S });
    },
  },
  mcp: {
    label: "MCP",
    color: 0xa78bfa,
    draw(g, c) {
      g.moveTo(-4, -9).lineTo(-4, -3).stroke({ width: 2.4, color: c, ...S });
      g.moveTo(4, -9).lineTo(4, -3).stroke({ width: 2.4, color: c, ...S });
      g.roundRect(-8, -3, 16, 9, 3).stroke({ width: 2, color: c, ...S });
      g.moveTo(0, 6).lineTo(0, 10).stroke({ width: 2.4, color: c, ...S });
    },
  },
  agent: {
    label: "Subagent",
    color: 0xfb923c,
    draw(g, c) {
      g.moveTo(0, -4).lineTo(-6, 6).stroke({ width: 1.8, color: c, ...S });
      g.moveTo(0, -4).lineTo(6, 6).stroke({ width: 1.8, color: c, ...S });
      g.circle(0, -5, 3.6).fill({ color: c });
      g.circle(-6.5, 7, 3).fill({ color: c });
      g.circle(6.5, 7, 3).fill({ color: c });
    },
  },
  todo: {
    label: "Todo",
    color: 0x94a3b8,
    draw(g, c) {
      g.moveTo(-8, -5).lineTo(-6, -3).lineTo(-3, -7).stroke({ width: 1.8, color: c, ...S });
      g.moveTo(1, -5).lineTo(8, -5).stroke({ width: 1.8, color: c, ...S });
      g.moveTo(-8, 5).lineTo(-6, 7).lineTo(-3, 3).stroke({ width: 1.8, color: c, ...S });
      g.moveTo(1, 5).lineTo(8, 5).stroke({ width: 1.8, color: c, ...S });
    },
  },
  gitnexus: {
    label: "GitNexus",
    color: 0xc084fc, // purple-400
    draw(g, c) {
      // Knowledge graph: central hub connected to 3 orbiting nodes
      g.moveTo(0, 0).lineTo(-6, -6).stroke({ width: 1.5, color: c, ...S });
      g.moveTo(0, 0).lineTo(6, -5).stroke({ width: 1.5, color: c, ...S });
      g.moveTo(0, 0).lineTo(0, 7).stroke({ width: 1.5, color: c, ...S });
      g.circle(0, 0, 3.2).fill({ color: c });
      g.circle(-6, -6, 2.2).fill({ color: c });
      g.circle(6, -5, 2.2).fill({ color: c });
      g.circle(0, 7, 2.2).fill({ color: c });
    },
  },
  browser: {
    label: "Browser",
    color: 0x06b6d4, // cyan-500
    draw(g, c) {
      // Browser window with top tab bar
      g.roundRect(-8, -7, 16, 14, 2.5).stroke({ width: 1.8, color: c, ...S });
      g.moveTo(-8, -2).lineTo(8, -2).stroke({ width: 1.4, color: c, ...S });
      g.circle(-5, -4.5, 1).fill({ color: c });
      g.circle(-2, -4.5, 1).fill({ color: c });
    },
  },
  git: {
    label: "Git",
    color: 0xf97316, // orange-500
    draw(g, c) {
      // Git branching tree
      g.moveTo(-4, -7).lineTo(-4, 7).stroke({ width: 2, color: c, ...S });
      g.moveTo(-4, 2).arc(0, 2, 4, Math.PI, 0).lineTo(4, -3).stroke({ width: 1.8, color: c, ...S });
      g.circle(-4, -6, 2.4).fill({ color: c });
      g.circle(-4, 6, 2.4).fill({ color: c });
      g.circle(4, -3, 2.4).fill({ color: c });
    },
  },
  docker: {
    label: "Docker",
    color: 0x38bdf8, // light blue
    draw(g, c) {
      // Container blocks stacked
      g.roundRect(-7, 1, 6, 5, 1).fill({ color: c, alpha: 0.8 }).stroke({ width: 1.2, color: c, ...S });
      g.roundRect(1, 1, 6, 5, 1).fill({ color: c, alpha: 0.8 }).stroke({ width: 1.2, color: c, ...S });
      g.roundRect(-3, -6, 6, 5, 1).fill({ color: c, alpha: 0.8 }).stroke({ width: 1.2, color: c, ...S });
    },
  },
};

// Request-status glyphs share the badge machinery with tools: lifecycle states,
// the four failure reasons, and fallback.
export const STATUS_TYPES = {
  pending: {
    label: "Queued",
    color: 0xf59e0b,
    draw(g, c) {
      for (const x of [-7, 0, 7]) g.circle(x, 1, 2.6).fill({ color: c });
    },
  },
  done: {
    label: "Done",
    color: 0x34d399,
    draw(g, c) {
      g.moveTo(-7, 0).lineTo(-2, 6).lineTo(8, -7).stroke({ width: 3, color: c, ...S });
    },
  },
  rate_limited: {
    label: "Rate limit",
    color: 0xef4444,
    draw(g, c) {
      g.moveTo(-6, -9).lineTo(6, -9).lineTo(-6, 9).lineTo(6, 9).closePath()
        .stroke({ width: 2, color: c, ...S });
      g.moveTo(-3, 6.5).lineTo(3, 6.5).stroke({ width: 2.2, color: c, ...S });
    },
  },
  upstream_timeout: {
    label: "Timeout",
    color: 0xef4444,
    draw(g, c) {
      g.circle(0, 0, 8.5).stroke({ width: 2, color: c, ...S });
      g.moveTo(0, -5).lineTo(0, 0).lineTo(4.5, 3).stroke({ width: 2, color: c, ...S });
    },
  },
  quota_exhausted: {
    label: "Quota",
    color: 0xef4444,
    draw(g, c) {
      g.roundRect(-8, -5, 14, 10, 2).stroke({ width: 2, color: c, ...S });
      g.rect(6, -2, 3, 4).fill({ color: c });
      g.rect(-6, -3, 2.6, 6).fill({ color: c });
    },
  },
  auth_refresh_failed: {
    label: "Auth",
    color: 0xef4444,
    draw(g, c) {
      g.circle(-4, 0, 4.2).stroke({ width: 2, color: c, ...S });
      g.moveTo(0, 0).lineTo(8, 0).stroke({ width: 2, color: c, ...S });
      g.moveTo(5, 0).lineTo(5, 4).stroke({ width: 2, color: c, ...S });
      g.moveTo(-9, -8).lineTo(9, 8).stroke({ width: 2.2, color: 0xfbbf24, ...S });
    },
  },
  fallback: {
    label: "Fallback",
    color: 0xfbbf24,
    draw(g, c) {
      g.moveTo(-8, -4).lineTo(7, -4).stroke({ width: 2.2, color: c, ...S });
      g.moveTo(3, -8).lineTo(8, -4).lineTo(3, 0).stroke({ width: 2.2, color: c, ...S });
      g.moveTo(8, 5).lineTo(-7, 5).stroke({ width: 2.2, color: c, ...S });
      g.moveTo(-3, 1).lineTo(-8, 5).lineTo(-3, 9).stroke({ width: 2.2, color: c, ...S });
    },
  },
  looping: {
    label: "Looping",
    color: 0xf43f5e,
    draw(g, c) {
      g.arc(0, 0, 6.5, -Math.PI * 0.2, Math.PI * 1.3).stroke({ width: 2.2, color: c, ...S });
      g.moveTo(4, -6.5).lineTo(7, -3.5).lineTo(1, -3.5).closePath().fill({ color: c });
    },
  },
};

export const TOOL_KEYS = Object.keys(TOOL_TYPES);
export const STATUS_KEYS = ["pending", "done", "rate_limited", "upstream_timeout", "quota_exhausted", "auth_refresh_failed", "fallback", "looping"];

/** A round badge: dark disc, coloured ring, the tool's glyph, optional name. */
export function createToolBadge(tool, { size = 1, showLabel = true, label: labelOverride } = {}) {
  const def = TOOL_TYPES[tool] || STATUS_TYPES[tool] || TOOL_TYPES.bash;
  const root = new Container();

  const halo = new Graphics();
  halo.circle(0, 0, 21).fill({ color: def.color, alpha: 0.18 });

  const disc = new Graphics();
  disc.circle(0, 0, 15).fill({ color: 0x0f141c });
  disc.circle(0, 0, 15).stroke({ width: 2, color: def.color, alpha: 0.95 });

  const glyph = new Graphics();
  def.draw(glyph, def.color);
  glyph.scale.set(0.95);

  root.addChild(halo, disc, glyph);

  if (showLabel) {
    const label = new Text({
      text: labelOverride ?? def.label,
      style: { fontFamily: getActiveFont("ui"), fontSize: 9, fill: def.color, fontWeight: "800" },
    });
    label.anchor.set(0.5, 0);
    label.y = 18;
    root.addChild(label);
  }

  root.scale.set(size);
  return { root, halo, tool };
}
