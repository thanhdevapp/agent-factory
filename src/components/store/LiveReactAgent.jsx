"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { getItemById, COSMETIC_CATALOG } from "@/lib/catalog/index.js";

// Floor theme color palettes
const THEME_STYLES = {
  theme_default: { name: "Classic Charcoal Slate", base: "#14161a", tile: "#1e222b", grid: "#2d3548", glow: "#38bdf8" },
  theme_cyberpunk: { name: "Cyberpunk Neon Night", base: "#0d0819", tile: "#1c0d33", grid: "#ff2a85", glow: "#00f0ff" },
  theme_matrix: { name: "Phosphor Matrix Terminal", base: "#020d05", tile: "#051f0b", grid: "#00ff66", glow: "#10b981" },
  theme_wood: { name: "Cozy Scandinavian Loft", base: "#1f1610", tile: "#2c2017", grid: "#451a03", glow: "#f59e0b" },
  theme_space: { name: "Deep Space Void", base: "#030712", tile: "#0b1329", grid: "#1e1b4b", glow: "#6366f1" },
  theme_blueprint: { name: "Blueprint CAD Grid", base: "#0b1a30", tile: "#1e3a8a", grid: "#1d4ed8", glow: "#38bdf8" },
  theme_synthwave: { name: "Retro Synthwave 80s", base: "#1a052e", tile: "#3b0764", grid: "#d946ef", glow: "#ec4899" },
  theme_sakura_cyber: { name: "Sakura Cyber Garden", base: "#1c0e18", tile: "#2e1022", grid: "#f43f5e", glow: "#fb7185" },
  theme_nordic_ice: { name: "Minimalist Nordic Ice", base: "#0f172a", tile: "#1e293b", grid: "#38bdf8", glow: "#e2e8f0" },
  theme_industrial: { name: "High-Voltage Industrial", base: "#18181b", tile: "#27272a", grid: "#eab308", glow: "#f59e0b" },
};

/**
 * 50 Curated High-Fidelity Silhouette & Accessory Variations
 */
function RenderSkinAccessories({ variant, archetype, color, secondaryColor, accentColor }) {
  // 1. CYBER SUIT VARIANTS (10)
  if (variant === "tactical_visor") {
    return (
      <g>
        <polygon points="-26,-66 -34,-76 -26,-72" fill={color} />
        <polygon points="26,-66 34,-76 26,-72" fill={color} />
        <rect x="-24" y="-66" width="48" height="6" rx="2" fill={color} />
        <circle cx="0" cy="-63" r="2.5" fill={accentColor} />
      </g>
    );
  }
  if (variant === "laser_scout") {
    return (
      <g>
        <circle cx="8" cy="-57" r="7" fill="none" stroke={color} strokeWidth="1.8" />
        <line x1="8" y1="-66" x2="8" y2="-48" stroke={color} strokeWidth="1" strokeDasharray="1 2" />
        <line x1="-1" y1="-57" x2="17" y2="-57" stroke={color} strokeWidth="1" strokeDasharray="1 2" />
        <circle cx="8" cy="-57" r="2" fill="#ff0000" />
      </g>
    );
  }
  if (variant === "riot_shield") {
    return (
      <g>
        <rect x="-25" y="-68" width="50" height="9" rx="3" fill="#1e2430" stroke={color} strokeWidth="1.8" />
        <rect x="-20" y="-34" width="40" height="6" rx="2" fill={color} />
        <circle cx="-16" cy="-64" r="2.5" fill={accentColor} />
        <circle cx="16" cy="-64" r="2.5" fill={accentColor} />
      </g>
    );
  }
  if (variant === "cyber_horns") {
    return (
      <g>
        <polygon points="-20,-70 -30,-88 -14,-76" fill={color} stroke={secondaryColor} strokeWidth="1" />
        <polygon points="20,-70 30,-88 14,-76" fill={color} stroke={secondaryColor} strokeWidth="1" />
        <line x1="-17" y1="-73" x2="-25" y2="-82" stroke={accentColor} strokeWidth="1.5" />
        <line x1="17" y1="-73" x2="25" y2="-82" stroke={accentColor} strokeWidth="1.5" />
      </g>
    );
  }
  if (variant === "crown_radiator") {
    return (
      <g fill={color}>
        <polygon points="-16,-72 -14,-86 -8,-74" />
        <polygon points="-4,-74 0,-92 4,-74" />
        <polygon points="8,-74 14,-86 16,-72" />
        <circle cx="0" cy="-70" r="3" fill={accentColor} />
      </g>
    );
  }
  if (variant === "gas_respirator") {
    return (
      <g>
        <circle cx="-14" cy="-44" r="6" fill="#1e2430" stroke={color} strokeWidth="1.5" />
        <circle cx="14" cy="-44" r="6" fill="#1e2430" stroke={color} strokeWidth="1.5" />
        <circle cx="-14" cy="-44" r="3" fill={color} />
        <circle cx="14" cy="-44" r="3" fill={color} />
        <rect x="-8" y="-46" width="16" height="5" fill="#111827" stroke={color} strokeWidth="1" />
      </g>
    );
  }
  if (variant === "prism_goggles") {
    return (
      <g>
        <polygon points="-16,-62 -8,-66 -2,-62 -2,-52 -8,-48 -16,-52" fill="#0c4a6e" stroke={color} strokeWidth="1.6" />
        <polygon points="2,-62 8,-66 16,-62 16,-52 8,-48 2,-52" fill="#0c4a6e" stroke={color} strokeWidth="1.6" />
        <circle cx="-9" cy="-57" r="2.5" fill={accentColor} />
        <circle cx="9" cy="-57" r="2.5" fill={accentColor} />
      </g>
    );
  }
  if (variant === "samurai_crest") {
    return (
      <g>
        <path d="M -22 -72 Q 0 -92 22 -72 Q 0 -84 -22 -72 Z" fill={color} stroke={secondaryColor} strokeWidth="1" />
        <circle cx="0" cy="-78" r="3" fill={accentColor} />
      </g>
    );
  }
  if (variant === "overdrive_vents") {
    return (
      <g strokeLinecap="round">
        <line x1="-18" y1="-72" x2="-28" y2="-90" stroke={color} strokeWidth="3" />
        <line x1="18" y1="-72" x2="28" y2="-90" stroke={color} strokeWidth="3" />
        <line x1="-12" y1="-70" x2="-20" y2="-84" stroke={accentColor} strokeWidth="2" />
        <line x1="12" y1="-70" x2="20" y2="-84" stroke={accentColor} strokeWidth="2" />
      </g>
    );
  }
  if (variant === "holo_shroud") {
    return (
      <g>
        <ellipse cx="0" cy="-66" rx="28" ry="12" fill="none" stroke={color} strokeWidth="1.8" strokeDasharray="4 2" />
        <circle cx="0" cy="-78" r="4" fill={accentColor} />
      </g>
    );
  }

  // 2. MECHA PILOT VARIANTS (10)
  if (variant === "v_fin") {
    return (
      <g>
        <polygon points="-24,-88 -18,-92 0,-76 18,-92 24,-88 0,-72" fill={color} stroke={secondaryColor} strokeWidth="1" />
        <polygon points="-4,-72 0,-78 4,-72 0,-68" fill="#ef4444" />
      </g>
    );
  }
  if (variant === "blast_shield") {
    return (
      <g>
        <rect x="-24" y="-68" width="48" height="14" rx="3" fill="#0f172a" stroke={color} strokeWidth="2" />
        <circle cx="-18" cy="-80" r="3.5" fill="#fde047" stroke={color} strokeWidth="1" />
        <circle cx="18" cy="-80" r="3.5" fill="#fde047" stroke={color} strokeWidth="1" />
      </g>
    );
  }
  if (variant === "eva_horn") {
    return (
      <g>
        <polygon points="-3,-74 0,-98 3,-74" fill={color} stroke={secondaryColor} strokeWidth="1" />
        <rect x="-28" y="-48" width="5" height="18" rx="2" fill={color} stroke={secondaryColor} strokeWidth="1" />
        <rect x="23" y="-48" width="5" height="18" rx="2" fill={color} stroke={secondaryColor} strokeWidth="1" />
      </g>
    );
  }
  if (variant === "cage_grille") {
    return (
      <g>
        <rect x="-16" y="-52" width="32" height="14" rx="2" fill="#18181b" stroke={color} strokeWidth="1.6" />
        <line x1="-10" y1="-52" x2="-10" y2="-38" stroke={color} strokeWidth="1.2" />
        <line x1="-4" y1="-52" x2="-4" y2="-38" stroke={color} strokeWidth="1.2" />
        <line x1="4" y1="-52" x2="4" y2="-38" stroke={color} strokeWidth="1.2" />
        <line x1="10" y1="-52" x2="10" y2="-38" stroke={color} strokeWidth="1.2" />
        <rect x="-22" y="-86" width="4" height="16" fill="#27272a" stroke={color} strokeWidth="1" />
        <rect x="18" y="-86" width="4" height="16" fill="#27272a" stroke={color} strokeWidth="1" />
      </g>
    );
  }
  if (variant === "missile_pod") {
    return (
      <g>
        <rect x="-30" y="-42" width="8" height="12" rx="2" fill="#1c1917" stroke={color} strokeWidth="1.5" />
        <circle cx="-26" cy="-38" r="1.5" fill="#ef4444" />
        <circle cx="-26" cy="-34" r="1.5" fill="#ef4444" />
        <rect x="22" y="-42" width="8" height="12" rx="2" fill="#1c1917" stroke={color} strokeWidth="1.5" />
        <circle cx="26" cy="-38" r="1.5" fill="#ef4444" />
        <circle cx="26" cy="-34" r="1.5" fill="#ef4444" />
      </g>
    );
  }
  if (variant === "quad_array") {
    return (
      <g stroke={color} strokeWidth="1.8">
        <line x1="-22" y1="-72" x2="-26" y2="-90" />
        <line x1="-12" y1="-76" x2="-14" y2="-94" />
        <line x1="12" y1="-76" x2="14" y2="-94" />
        <line x1="22" y1="-72" x2="26" y2="-90" />
        <circle cx="-26" cy="-90" r="2" fill={accentColor} stroke="none" />
        <circle cx="-14" cy="-94" r="2" fill={accentColor} stroke="none" />
        <circle cx="14" cy="-94" r="2" fill={accentColor} stroke="none" />
        <circle cx="26" cy="-90" r="2" fill={accentColor} stroke="none" />
      </g>
    );
  }
  if (variant === "halo_shield") {
    return (
      <g>
        <polygon points="-32,-42 -26,-46 -20,-42 -20,-34 -26,-30 -32,-34" fill="#064e3b" stroke={color} strokeWidth="1.5" />
        <polygon points="20,-42 26,-46 32,-42 32,-34 26,-30 20,-34" fill="#064e3b" stroke={color} strokeWidth="1.5" />
      </g>
    );
  }
  if (variant === "ram_horns") {
    return (
      <g>
        <path d="M -18 -72 C -34 -82, -32 -96, -18 -92 C -24 -88, -24 -78, -14 -72 Z" fill={color} stroke={secondaryColor} strokeWidth="1" />
        <path d="M 18 -72 C 34 -82, 32 -96, 18 -92 C 24 -88, 24 -78, 14 -72 Z" fill={color} stroke={secondaryColor} strokeWidth="1" />
      </g>
    );
  }
  if (variant === "radar_dish") {
    return (
      <g>
        <ellipse cx="-24" cy="-84" rx="7" ry="12" fill="#18181b" stroke={color} strokeWidth="1.5" transform="rotate(-25 -24 -84)" />
        <circle cx="-24" cy="-84" r="2" fill={accentColor} />
      </g>
    );
  }
  if (variant === "hyper_wings") {
    return (
      <g>
        <polygon points="-26,-46 -44,-64 -34,-40" fill={color} stroke={secondaryColor} strokeWidth="1.2" />
        <polygon points="26,-46 44,-64 34,-40" fill={color} stroke={secondaryColor} strokeWidth="1.2" />
      </g>
    );
  }

  // 3. STEALTH NINJA VARIANTS (10)
  if (variant === "flowing_headband") {
    return (
      <g>
        <rect x="-24" y="-66" width="48" height="8" rx="2" fill="#1e1b4b" stroke={color} strokeWidth="1.5" />
        <circle cx="0" cy="-62" r="3" fill="#38bdf8" />
        <path d="M 24 -62 Q 38 -56 46 -46 Q 36 -48 24 -56" fill={color} />
      </g>
    );
  }
  if (variant === "tactical_cowl") {
    return (
      <g>
        <path d="M -24 -68 Q 0 -76 24 -68 L 22 -44 Q 0 -38 -22 -44 Z" fill="#0f172a" stroke={color} strokeWidth="1.4" opacity="0.8" />
        <circle cx="6" cy="-57" r="4.5" fill="none" stroke="#22c55e" strokeWidth="1.8" />
        <circle cx="6" cy="-57" r="1.5" fill="#22c55e" />
      </g>
    );
  }
  if (variant === "oni_mask") {
    return (
      <g>
        <polygon points="-16,-72 -24,-88 -12,-76" fill="#ef4444" stroke="#450a0a" strokeWidth="1" />
        <polygon points="16,-72 24,-88 12,-76" fill="#ef4444" stroke="#450a0a" strokeWidth="1" />
        <path d="M -16 -46 L -10 -40 L -6 -46 L 0 -42 L 6 -46 L 10 -40 L 16 -46 L 12 -36 L -12 -36 Z" fill="#ffffff" stroke={color} strokeWidth="1" />
      </g>
    );
  }
  if (variant === "kitsune_ears") {
    return (
      <g>
        <polygon points="-22,-72 -14,-88 -6,-76" fill="#1e2430" />
        <polygon points="-20,-73 -14,-85 -8,-76" fill={color} />
        <polygon points="6,-76 14,-88 22,-72" fill="#1e2430" />
        <polygon points="8,-76 14,-85 20,-73" fill={color} />
        <line x1="-12" y1="-46" x2="-22" y2="-48" stroke={color} strokeWidth="1.2" />
        <line x1="12" y1="-46" x2="22" y2="-48" stroke={color} strokeWidth="1.2" />
      </g>
    );
  }
  if (variant === "conical_kasa") {
    return (
      <g>
        <polygon points="-36,-72 0,-92 36,-72" fill="#18181b" stroke={color} strokeWidth="1.6" />
        <line x1="-36" y1="-72" x2="36" y2="-72" stroke={accentColor} strokeWidth="2.4" />
      </g>
    );
  }
  if (variant === "twin_katanas") {
    return (
      <g strokeLinecap="round">
        <line x1="-24" y1="-32" x2="28" y2="-88" stroke="#475569" strokeWidth="3" />
        <line x1="-22" y1="-34" x2="26" y2="-86" stroke={color} strokeWidth="1.6" />
        <line x1="24" y1="-32" x2="-28" y2="-88" stroke="#475569" strokeWidth="3" />
        <line x1="22" y1="-34" x2="-26" y2="-86" stroke={color} strokeWidth="1.6" />
      </g>
    );
  }
  if (variant === "tengu_beak") {
    return (
      <g>
        <polygon points="-12,-48 0,-34 12,-48 0,-44" fill="#0f172a" stroke={color} strokeWidth="1.5" />
      </g>
    );
  }
  if (variant === "veil_shroud") {
    return (
      <g>
        <path d="M -22 -62 Q 0 -70 22 -62 L 20 -36 Q 0 -30 -20 -36 Z" fill="#0f172a" opacity="0.85" stroke={color} strokeWidth="1.2" strokeDasharray="3 2" />
      </g>
    );
  }
  if (variant === "scythe_crest") {
    return (
      <g>
        <path d="M 0 -88 C -14 -88, -20 -76, -14 -66 C -20 -72, -14 -84, 0 -84 C 14 -84, 20 -72, 14 -66 C 20 -76, 14 -88, 0 -88 Z" fill={color} stroke={secondaryColor} strokeWidth="1" />
      </g>
    );
  }
  if (variant === "void_mask") {
    return (
      <g>
        <rect x="-18" y="-62" width="36" height="20" rx="4" fill="#000000" stroke={color} strokeWidth="1.8" />
        <text x="0" y="-48" fill={color} fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">零</text>
      </g>
    );
  }

  // 4. MATRIX HACKER VARIANTS (10)
  if (variant === "hoodie_cowl") {
    return (
      <g>
        <path d="M -28 -74 Q 0 -92 28 -74 Q 28 -34 20 -32 Q 0 -28 -20 -32 Q -28 -34 -28 -74 Z" fill="#051f0b" stroke={color} strokeWidth="1.8" opacity="0.9" />
        <text x="-12" y="-72" fill={color} fontSize="6" fontFamily="monospace" opacity="0.7">101</text>
        <text x="4" y="-72" fill={color} fontSize="6" fontFamily="monospace" opacity="0.7">010</text>
      </g>
    );
  }
  if (variant === "vr_goggles") {
    return (
      <g>
        <rect x="-22" y="-64" width="44" height="15" rx="3" fill="#083344" stroke={color} strokeWidth="1.8" />
        <line x1="-12" y1="-64" x2="-16" y2="-82" stroke={color} strokeWidth="1.6" />
        <circle cx="-16" cy="-82" r="2.5" fill={accentColor} />
        <line x1="-14" y1="-56" x2="14" y2="-56" stroke={accentColor} strokeWidth="1.4" />
      </g>
    );
  }
  if (variant === "daemon_horns") {
    return (
      <g>
        <path d="M -24 -70 Q 0 -82 24 -70" stroke={color} strokeWidth="3" fill="none" />
        <polygon points="-16,-70 -22,-86 -10,-74" fill={color} stroke={secondaryColor} strokeWidth="1" />
        <polygon points="16,-70 22,-86 10,-74" fill={color} stroke={secondaryColor} strokeWidth="1" />
      </g>
    );
  }
  if (variant === "glitch_halo") {
    return (
      <g>
        <rect x="-28" y="-76" width="56" height="42" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="6 3 2 4" />
        <rect x="-18" y="-82" width="12" height="6" fill={color} opacity="0.7" />
        <rect x="12" y="-50" width="10" height="4" fill={color} opacity="0.7" />
      </g>
    );
  }
  if (variant === "floating_hud") {
    return (
      <g>
        <rect x="24" y="-78" width="34" height="18" rx="2" fill="#09090b" stroke={color} strokeWidth="1" />
        <text x="27" y="-66" fill={color} fontSize="6" fontFamily="monospace">root#_</text>
      </g>
    );
  }
  if (variant === "respirator_eq") {
    return (
      <g strokeWidth="2">
        <rect x="-18" y="-46" width="36" height="10" rx="3" fill="#0f172a" stroke={color} strokeWidth="1.2" />
        <line x1="-12" y1="-40" x2="-12" y2="-45" stroke="#22c55e" />
        <line x1="-6" y1="-38" x2="-6" y2="-45" stroke="#eab308" />
        <line x1="0" y1="-37" x2="0" y2="-45" stroke="#ef4444" />
        <line x1="6" y1="-39" x2="6" y2="-45" stroke="#eab308" />
        <line x1="12" y1="-41" x2="12" y2="-45" stroke="#22c55e" />
      </g>
    );
  }
  if (variant === "heatsink_fins") {
    return (
      <g fill="#ea580c" stroke="#fed7aa" strokeWidth="1">
        <rect x="-18" y="-84" width="4" height="14" rx="1" />
        <rect x="-10" y="-88" width="4" height="18" rx="1" />
        <rect x="-2" y="-90" width="4" height="20" rx="1" />
        <rect x="6" y="-88" width="4" height="18" rx="1" />
        <rect x="14" y="-84" width="4" height="14" rx="1" />
      </g>
    );
  }
  if (variant === "cable_dreads") {
    return (
      <g fill="none" strokeLinecap="round">
        <path d="M -22 -62 C -32 -48, -30 -24, -28 -12" stroke={color} strokeWidth="2.5" />
        <path d="M -16 -64 C -22 -44, -20 -20, -18 -8" stroke={accentColor} strokeWidth="2" />
        <path d="M 16 -64 C 22 -44, 20 -20, 18 -8" stroke={accentColor} strokeWidth="2" />
        <path d="M 22 -62 C 32 -48, 30 -24, 28 -12" stroke={color} strokeWidth="2.5" />
      </g>
    );
  }
  if (variant === "cyber_skull") {
    return (
      <g>
        <ellipse cx="-7" cy="-55" rx="5" ry="4" fill="#000000" stroke={color} strokeWidth="1.5" />
        <ellipse cx="7" cy="-55" rx="5" ry="4" fill="#000000" stroke={color} strokeWidth="1.5" />
        <polygon points="-2,-46 0,-43 2,-46" fill={color} />
        <line x1="-8" y1="-40" x2="8" y2="-40" stroke={color} strokeWidth="1.8" />
        <line x1="-6" y1="-43" x2="-6" y2="-37" stroke={color} strokeWidth="1.4" />
        <line x1="0" y1="-43" x2="0" y2="-37" stroke={color} strokeWidth="1.4" />
        <line x1="6" y1="-43" x2="6" y2="-37" stroke={color} strokeWidth="1.4" />
      </g>
    );
  }
  if (variant === "wireframe_cube") {
    return (
      <g stroke={color}>
        <rect x="-24" y="-76" width="48" height="42" rx="4" fill="none" strokeWidth="1.6" />
        <rect x="-16" y="-68" width="32" height="26" rx="2" fill="none" stroke={accentColor} strokeWidth="1.2" strokeDasharray="3 2" />
        <line x1="-24" y1="-76" x2="-16" y2="-68" strokeWidth="1.2" />
        <line x1="24" y1="-76" x2="16" y2="-68" strokeWidth="1.2" />
        <line x1="-24" y1="-34" x2="-16" y2="-42" strokeWidth="1.2" />
        <line x1="24" y1="-34" x2="16" y2="-42" strokeWidth="1.2" />
      </g>
    );
  }

  // 5. CELESTIAL ASTRO VARIANTS (10)
  if (variant === "bubble_dome") {
    return (
      <g>
        <circle cx="0" cy="-56" r="28" fill="none" stroke={color} strokeWidth="2.5" opacity="0.9" />
        <circle cx="0" cy="-84" r="3.5" fill="#fef08a" stroke={color} strokeWidth="1.2" />
        <path d="M -14 -72 Q 0 -80 14 -72" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
      </g>
    );
  }
  if (variant === "lunar_pack") {
    return (
      <g>
        <rect x="-20" y="-86" width="2" height="18" fill={color} />
        <circle cx="-19" cy="-86" r="2" fill="#ffffff" />
        <ellipse cx="0" cy="-54" rx="24" ry="18" fill="none" stroke="#e2e8f0" strokeWidth="2" />
      </g>
    );
  }
  if (variant === "sunburst_halo") {
    return (
      <g stroke={color} strokeWidth="1.8" opacity="0.85">
        <line x1="0" y1="-86" x2="0" y2="-98" />
        <line x1="22" y1="-78" x2="32" y2="-88" />
        <line x1="30" y1="-56" x2="42" y2="-56" />
        <line x1="22" y1="-34" x2="32" y2="-24" />
        <line x1="0" y1="-26" x2="0" y2="-14" />
        <line x1="-22" y1="-34" x2="-32" y2="-24" />
        <line x1="-30" y1="-56" x2="-42" y2="-56" />
        <line x1="-22" y1="-78" x2="-32" y2="-88" />
      </g>
    );
  }
  if (variant === "saturn_ring") {
    return (
      <g>
        <ellipse cx="0" cy="-56" rx="36" ry="10" fill="none" stroke={color} strokeWidth="2.2" transform="rotate(-15 0 -56)" />
        <circle cx="28" cy="-62" r="3" fill={accentColor} />
      </g>
    );
  }
  if (variant === "star_crown") {
    return (
      <g fill={color}>
        <polygon points="-16,-74 -12,-86 -8,-76" />
        <polygon points="-6,-76 0,-92 6,-76" />
        <polygon points="8,-76 12,-86 16,-74" />
        <circle cx="0" cy="-74" r="2.5" fill="#ffffff" />
      </g>
    );
  }
  if (variant === "eclipse_corona") {
    return (
      <g>
        <ellipse cx="0" cy="-56" rx="32" ry="18" fill="none" stroke={color} strokeWidth="3" opacity="0.6" strokeDasharray="8 4" />
        <circle cx="0" cy="-56" r="22" fill="#000000" stroke={color} strokeWidth="1.5" />
      </g>
    );
  }
  if (variant === "pulsar_spires") {
    return (
      <g stroke={color} strokeWidth="2.8" strokeLinecap="round">
        <line x1="0" y1="-78" x2="0" y2="-98" />
        <circle cx="0" cy="-98" r="3" fill="#ffffff" stroke="none" />
        <line x1="0" y1="-34" x2="0" y2="-18" />
        <circle cx="0" cy="-18" r="3" fill="#ffffff" stroke="none" />
      </g>
    );
  }
  if (variant === "aurora_ribbons") {
    return (
      <g fill="none" strokeLinecap="round">
        <path d="M -30 -82 Q -15 -96 0 -84 T 30 -88" stroke={color} strokeWidth="3" opacity="0.75" />
        <path d="M -26 -88 Q -10 -100 6 -88 T 26 -92" stroke={accentColor} strokeWidth="2" opacity="0.6" />
      </g>
    );
  }
  if (variant === "angel_wings") {
    return (
      <g>
        <polygon points="-26,-46 -48,-78 -32,-38" fill={color} stroke={secondaryColor} strokeWidth="1.2" opacity="0.85" />
        <polygon points="26,-46 48,-78 32,-38" fill={color} stroke={secondaryColor} strokeWidth="1.2" opacity="0.85" />
        <ellipse cx="0" cy="-80" rx="16" ry="5" fill="none" stroke={accentColor} strokeWidth="1.6" />
      </g>
    );
  }
  if (variant === "singularity_core") {
    return (
      <g>
        <ellipse cx="0" cy="-56" rx="30" ry="26" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
        <circle cx="-22" cy="-70" r="2.5" fill={accentColor} />
        <circle cx="22" cy="-42" r="2.5" fill={accentColor} />
      </g>
    );
  }

  // Archetype Fallbacks
  if (archetype === "stealth_ninja") {
    return (
      <g>
        <rect x="-24" y="-66" width="48" height="8" rx="2" fill="#1e1b4b" stroke={color} strokeWidth="1.5" />
        <circle cx="0" cy="-62" r="3" fill="#38bdf8" />
      </g>
    );
  }
  if (archetype === "mecha_pilot") {
    return (
      <g fill={color}>
        <rect x="-20" y="-88" width="3" height="20" rx="1" />
        <rect x="17" y="-88" width="3" height="20" rx="1" />
        <circle cx="-18.5" cy="-88" r="3" fill="#ffffff" />
        <circle cx="18.5" cy="-88" r="3" fill="#ffffff" />
      </g>
    );
  }
  if (archetype === "celestial_astro") {
    return (
      <ellipse cx="0" cy="-64" rx="30" ry="8" fill="none" stroke={color} strokeWidth="2" opacity="0.9" />
    );
  }
  if (archetype === "matrix_hacker") {
    return (
      <rect x="-26" y="-76" width="52" height="44" rx="12" fill="none" stroke={color} strokeWidth="1.8" />
    );
  }
  // Default Cyber Suit
  return (
    <rect x="-24" y="-66" width="48" height="6" rx="2" fill={color} />
  );
}

/**
 * 5 Distinct Staff Uniform & Torso Silhouettes for Employee Roles:
 * - cyber_suit: Corporate Tech Field Ops / Executive blazer with security ID badge lanyard & lapels
 * - mecha_pilot: Heavy Industrial DevOps / Hardware engineer with hazard chevrons, shoulder pauldrons & harness
 * - stealth_ninja: Security Auditor Shinobi with crossed gi collar, diagonal tactical sash, kunai strap & obi
 * - matrix_hacker: Streetwear Netrunner with oversized slouchy techwear cowl-hoodie, drawstrings & kangaroo pocket
 * - celestial_astro: Aerospace Scientist flight uniform with gold command epaulets, hermetic neck seal & pressure dials
 */
export function RenderStaffTorso({ archetype, color, secondaryColor, accentColor, idPrefix, trimColor }) {
  if (archetype === "cyber_suit") {
    return (
      <g id="staff-torso-cyber-suit">
        {/* Tailored Corporate Blazer / Suit Jacket */}
        <polygon points="-18,-30 18,-30 15,-6 -15,-6" fill={`url(#${idPrefix}_bodyGradient)`} stroke={color} strokeWidth="1.2" />
        {/* Crisp Dark Lapels */}
        <polygon points="-17,-30 -7,-14 -13,-14" fill="#0d1117" stroke={color} strokeWidth="0.8" />
        <polygon points="17,-30 7,-14 13,-14" fill="#0d1117" stroke={color} strokeWidth="0.8" />
        {/* Center Zipper / Placket */}
        <line x1="0" y1="-30" x2="0" y2="-10" stroke={color} strokeWidth="1.4" />
        {/* Dual Chest Pocket Slits */}
        <rect x="-14" y="-22" width="5" height="3" rx="1" fill="#1f2937" stroke={color} strokeWidth="0.6" />
        <rect x="9" y="-22" width="5" height="3" rx="1" fill="#1f2937" stroke={color} strokeWidth="0.6" />
        {/* Executive Security ID Lanyard & Hanging Badge */}
        <path d="M -5 -30 Q 0 -18 5 -30" stroke={accentColor} strokeWidth="1.2" fill="none" opacity="0.85" />
        <rect x="-4.5" y="-19" width="9" height="12" rx="1.5" fill="#090d16" stroke={color} strokeWidth="1" />
        <rect x="-3" y="-17.5" width="6" height="4.5" rx="0.5" fill={color} />
        <line x1="-3" y1="-11" x2="3" y2="-11" stroke="#ffffff" strokeWidth="0.8" />
        <line x1="-3" y1="-9" x2="1" y2="-9" stroke="#ffffff" strokeWidth="0.8" />
        {/* Polished Belt & Buckle */}
        <rect x="-15" y="-10" width="30" height="4" fill="#020617" />
        <rect x="-3.5" y="-11" width="7" height="6" rx="1" fill="#1e293b" stroke={color} strokeWidth="1" />
      </g>
    );
  }

  if (archetype === "mecha_pilot") {
    return (
      <g id="staff-torso-mecha-pilot">
        {/* Broad Reinforced Heavy Armored Chest Rig */}
        <polygon points="-22,-30 22,-30 18,-6 -18,-6" fill="#18181b" stroke={color} strokeWidth="1.6" />
        {/* Armored Shoulder Pauldrons */}
        <polygon points="-27,-29 -20,-33 -17,-25 -25,-20" fill="#27272a" stroke={color} strokeWidth="1.2" />
        <polygon points="27,-29 20,-33 17,-25 25,-20" fill="#27272a" stroke={color} strokeWidth="1.2" />
        {/* Heavy Industrial Hazard Chevrons (Yellow/Black) */}
        <polygon points="-12,-26 -7,-26 -3,-20 -8,-20" fill="#eab308" />
        <polygon points="-5,-26 0,-26 4,-20 -1,-20" fill="#18181b" />
        <polygon points="2,-26 7,-26 11,-20 6,-20" fill="#eab308" />
        <polygon points="9,-26 13,-26 17,-20 13,-20" fill="#18181b" />
        {/* Heavy Duty Tactical Harness Straps with Carabiners */}
        <line x1="-13" y1="-30" x2="-11" y2="-6" stroke={color} strokeWidth="1.8" />
        <line x1="13" y1="-30" x2="11" y2="-6" stroke={color} strokeWidth="1.8" />
        <circle cx="-12" cy="-10" r="1.8" fill="none" stroke="#e2e8f0" strokeWidth="1" />
        <circle cx="12" cy="-10" r="1.8" fill="none" stroke="#e2e8f0" strokeWidth="1" />
        {/* Central Reinforced Fusion Reactor with Protective Cage */}
        <circle cx="0" cy="-14" r="5.5" fill="#09090b" stroke={color} strokeWidth="1.5" />
        <circle cx="0" cy="-14" r="3.2" fill={color} />
        <line x1="-5" y1="-14" x2="5" y2="-14" stroke="#ffffff" strokeWidth="1" />
        <line x1="0" y1="-19" x2="0" y2="-9" stroke="#ffffff" strokeWidth="1" />
        {/* Tool Carabiner Pouch */}
        <rect x="-16" y="-9" width="7" height="4" rx="1" fill="#3f3f46" stroke="#71717a" strokeWidth="0.8" />
        <rect x="9" y="-9" width="7" height="4" rx="1" fill="#3f3f46" stroke="#71717a" strokeWidth="0.8" />
      </g>
    );
  }

  if (archetype === "stealth_ninja") {
    return (
      <g id="staff-torso-stealth-ninja">
        {/* Sleek Form-Fitting Shinobi Gi / Wrapped Tunic */}
        <polygon points="-16,-30 16,-30 13,-6 -13,-6" fill="#090d16" stroke={color} strokeWidth="1.4" />
        {/* Crossed Kimono / Gi Lapels */}
        <line x1="-16" y1="-30" x2="5" y2="-14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="16" y1="-30" x2="-3" y2="-14" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
        {/* Prominent Diagonal Tactical Sash (Torso cross-strap) */}
        <polygon points="-16,-28 -11,-30 14,-9 9,-7" fill={color} opacity="0.9" />
        {/* Attached Stealth Kunai / Scroll Sheath */}
        <rect x="-3" y="-21" width="11" height="4" rx="1.5" fill="#1e293b" stroke="#ffffff" strokeWidth="0.8" transform="rotate(-35 2 -19)" />
        {/* Tied Fabric Obi Waist Sash with Hanging Knot Tails */}
        <rect x="-14" y="-12" width="28" height="6" rx="2" fill="#1e1b4b" stroke={color} strokeWidth="1.2" />
        <path d="M 3 -7 Q 6 1 4 6 Q 1 1 3 -7" fill={color} />
        <path d="M 5 -7 Q 9 0 8 5 Q 4 0 5 -7" fill={accentColor} opacity="0.85" />
        {/* Forearm Binding Accents */}
        <line x1="-24" y1="-22" x2="-18" y2="-20" stroke={color} strokeWidth="1.2" />
        <line x1="24" y1="-22" x2="18" y2="-20" stroke={color} strokeWidth="1.2" />
      </g>
    );
  }

  if (archetype === "matrix_hacker") {
    return (
      <g id="staff-torso-matrix-hacker">
        {/* Loose Oversized Slouchy Techwear Hoodie Body */}
        <rect x="-21" y="-30" width="42" height="25" rx="8" fill="#121217" stroke={color} strokeWidth="1.6" />
        {/* Crumpled Fabric Cowl Collar draped around neck */}
        <path d="M -18 -32 Q 0 -26 18 -32 Q 13 -22 0 -22 Q -13 -22 -18 -32 Z" fill="#1f1f28" stroke={color} strokeWidth="1.2" />
        {/* Hanging Dual Drawstring Cords with Metal Aglets */}
        <path d="M -7 -23 Q -9 -14 -6 -7" stroke="#ffffff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <rect x="-7.5" y="-7" width="3" height="4" rx="0.8" fill={color} />
        <path d="M 7 -23 Q 9 -13 6 -6" stroke="#ffffff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <rect x="4.5" y="-6" width="3" height="4" rx="0.8" fill={color} />
        {/* Front Kangaroo Pouch Pocket */}
        <path d="M -15 -14 L 15 -14 L 13 -6 L -13 -6 Z" fill="#09090d" stroke="#27272a" strokeWidth="1" />
        <line x1="-14" y1="-14" x2="-11" y2="-8" stroke={color} strokeWidth="1.2" />
        <line x1="14" y1="-14" x2="11" y2="-8" stroke={color} strokeWidth="1.2" />
        {/* Cyber Holographic Glitch Patch on Chest */}
        <g transform="translate(6, -21)">
          <rect x="0" y="0" width="9" height="5" fill="#000000" stroke={accentColor} strokeWidth="0.8" />
          <line x1="2" y1="1" x2="2" y2="4" stroke={color} strokeWidth="0.8" />
          <line x1="4" y1="1" x2="4" y2="4" stroke={color} strokeWidth="1.2" />
          <line x1="6.5" y1="1" x2="6.5" y2="4" stroke={color} strokeWidth="0.8" />
        </g>
      </g>
    );
  }

  if (archetype === "celestial_astro") {
    return (
      <g id="staff-torso-celestial-astro">
        {/* Pressurized Flight Suit Body */}
        <polygon points="-18,-30 18,-30 16,-6 -16,-6" fill="#f1f5f9" stroke={color} strokeWidth="1.4" />
        {/* Hermetic Helmet Seal Ring */}
        <rect x="-14" y="-33" width="28" height="5" rx="2" fill="#334155" stroke={color} strokeWidth="1.2" />
        {/* Gold Command Rank Epaulets on Shoulders */}
        <rect x="-24" y="-31" width="8" height="4.5" rx="1" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />
        <line x1="-22" y1="-30" x2="-22" y2="-28" stroke="#ffffff" strokeWidth="0.8" />
        <line x1="-19" y1="-30" x2="-19" y2="-28" stroke="#ffffff" strokeWidth="0.8" />
        <rect x="16" y="-31" width="8" height="4.5" rx="1" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />
        <line x1="19" y1="-30" x2="19" y2="-28" stroke="#ffffff" strokeWidth="0.8" />
        <line x1="22" y1="-30" x2="22" y2="-28" stroke="#ffffff" strokeWidth="0.8" />
        {/* Dual Atmospheric Pressure Regulator Dials with Connecting Glowing Tubing */}
        <circle cx="-7" cy="-17" r="3.5" fill="#0f172a" stroke={color} strokeWidth="1.2" />
        <circle cx="-7" cy="-17" r="1.5" fill="#22c55e" />
        <circle cx="7" cy="-17" r="3.5" fill="#0f172a" stroke={color} strokeWidth="1.2" />
        <circle cx="7" cy="-17" r="1.5" fill="#38bdf8" />
        <path d="M -3.5 -17 Q 0 -13 3.5 -17" fill="none" stroke={color} strokeWidth="1.6" />
        {/* Planetary Mission Patch Insignia on Left Chest */}
        <polygon points="-12,-26 -6,-26 -9,-21" fill={color} stroke="#ffffff" strokeWidth="0.8" />
        <ellipse cx="-9" cy="-24" rx="4" ry="1.5" fill="none" stroke="#f59e0b" strokeWidth="0.8" transform="rotate(-20 -9 -24)" />
        {/* Aerodynamic Thermal Seams */}
        <line x1="-12" y1="-14" x2="-10" y2="-6" stroke="#94a3b8" strokeWidth="1" />
        <line x1="12" y1="-14" x2="10" y2="-6" stroke="#94a3b8" strokeWidth="1" />
      </g>
    );
  }

  // Fallback default
  return (
    <g>
      <rect x="-17" y="-30" width="34" height="22" rx="11" fill={`url(#${idPrefix}_bodyGradient)`} />
      <rect x="-14" y="-12" width="28" height="6" fill={trimColor} />
      <circle cx="0" cy="-18" r="4.5" fill="#0f172a" stroke={color} strokeWidth="1.4" />
      <circle cx="0" cy="-18" r="2.2" fill={color} />
    </g>
  );
}

export function RenderStaffArms({ archetype, color, armLRef, armRRef }) {
  let sleeveL = null;
  let sleeveR = null;

  if (archetype === "mecha_pilot") {
    sleeveL = (
      <>
        <rect x="-27" y="-26" width="9" height="24" rx="3" fill="#27272a" stroke={color} strokeWidth="1" />
        <rect x="-28" y="-16" width="11" height="8" rx="2" fill="#3f3f46" stroke="#eab308" strokeWidth="1" />
      </>
    );
    sleeveR = (
      <>
        <rect x="18" y="-26" width="9" height="24" rx="3" fill="#27272a" stroke={color} strokeWidth="1" />
        <rect x="17" y="-16" width="11" height="8" rx="2" fill="#3f3f46" stroke="#eab308" strokeWidth="1" />
      </>
    );
  } else if (archetype === "stealth_ninja") {
    sleeveL = (
      <>
        <rect x="-26" y="-26" width="8" height="24" rx="4" fill="#0f172a" />
        <line x1="-26" y1="-18" x2="-18" y2="-16" stroke={color} strokeWidth="1.2" />
        <line x1="-26" y1="-12" x2="-18" y2="-10" stroke={color} strokeWidth="1.2" />
      </>
    );
    sleeveR = (
      <>
        <rect x="18" y="-26" width="8" height="24" rx="4" fill="#0f172a" />
        <line x1="18" y1="-18" x2="26" y2="-16" stroke={color} strokeWidth="1.2" />
        <line x1="18" y1="-12" x2="26" y2="-10" stroke={color} strokeWidth="1.2" />
      </>
    );
  } else if (archetype === "matrix_hacker") {
    sleeveL = (
      <>
        <rect x="-28" y="-26" width="11" height="24" rx="5" fill="#18181b" stroke={color} strokeWidth="1" />
        <rect x="-27" y="-5" width="9" height="3" rx="1" fill="#27272a" />
      </>
    );
    sleeveR = (
      <>
        <rect x="17" y="-26" width="11" height="24" rx="5" fill="#18181b" stroke={color} strokeWidth="1" />
        <rect x="18" y="-5" width="9" height="3" rx="1" fill="#27272a" />
      </>
    );
  } else if (archetype === "celestial_astro") {
    sleeveL = (
      <>
        <rect x="-26" y="-26" width="8" height="24" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.8" />
        <polygon points="-26,-15 -18,-15 -22,-11" fill={color} />
      </>
    );
    sleeveR = (
      <>
        <rect x="18" y="-26" width="8" height="24" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.8" />
        <polygon points="18,-15 26,-15 22,-11" fill={color} />
      </>
    );
  } else {
    // Default cyber suit tailored sleeve
    sleeveL = (
      <>
        <rect x="-26" y="-26" width="8" height="24" rx="4" fill="#1e2430" stroke={color} strokeWidth="0.8" />
        <line x1="-25" y1="-6" x2="-19" y2="-6" stroke={color} strokeWidth="1" />
      </>
    );
    sleeveR = (
      <>
        <rect x="18" y="-26" width="8" height="24" rx="4" fill="#1e2430" stroke={color} strokeWidth="0.8" />
        <line x1="19" y1="-6" x2="25" y2="-6" stroke={color} strokeWidth="1" />
      </>
    );
  }

  return (
    <>
      <g ref={armLRef}>{sleeveL}</g>
      <g ref={armRRef}>{sleeveR}</g>
    </>
  );
}

/**
 * Pure Declarative React SVG Animated Character & Workstation Engine.
 * Supports:
 * - 6 Actions: streaming, happy, sleeping, error, looping, pending
 * - Live mixing of 810 catalog items (Skins, Props, Pets, Auras, Themes)
 * - Pure SVG rendering (zero canvas dependency) with 60 FPS hardware-accelerated transforms
 * - Zero raw emojis, 100% vector scalability
 */
export function LiveReactAgent({
  mode = "streaming",
  intensity = 0.75,
  skinId = "skin_0",
  skinItem: propSkinItem = null,
  petId = "pet_0",
  petItem: propPetItem = null,
  propsList = [],
  auraId = "aura_0",
  auraItem: propAuraItem = null,
  themeId = "theme_default",
  themeItem: propThemeItem = null,
  clientType = "cli",
  interactive = true,
  isPlaying = true,
  showDesk = true,
  showFloor = true,
  className = "",
  style = {},
  onTelemetry = null,
}) {
  const rawId = React.useId();
  const idPrefix = useMemo(() => "lra_" + rawId.replace(/[^a-zA-Z0-9]/g, "_"), [rawId]);
  // Resolve item objects from catalog or props
  const skin = useMemo(() => {
    return propSkinItem || getItemById(skinId) || (COSMETIC_CATALOG.skins || [])[0];
  }, [propSkinItem, skinId]);

  const pet = useMemo(() => {
    return propPetItem || getItemById(petId) || (COSMETIC_CATALOG.pets || [])[0];
  }, [propPetItem, petId]);

  const aura = useMemo(() => {
    return propAuraItem || getItemById(auraId) || (COSMETIC_CATALOG.auras || [])[0];
  }, [propAuraItem, auraId]);

  const theme = useMemo(() => {
    return propThemeItem || getItemById(themeId) || (COSMETIC_CATALOG.officeThemes || [])[0];
  }, [propThemeItem, themeId]);

  const themeStyle = THEME_STYLES[theme?.id] || THEME_STYLES.theme_default;
  const skinColor = skin?.color || "#00f0ff";
  const skinSecColor = skin?.secondaryColor || "#111827";
  const skinAccColor = skin?.accentColor || "#ffffff";
  const skinVariant = skin?.variant || "tactical_visor";
  const skinArch = skin?.archetype || "cyber_suit";
  const petColor = pet?.color || "#00f0ff";
  const petArch = pet?.archetype || "none";
  const auraColor = aura?.color || "#00f0ff";
  const auraArch = aura?.archetype || "none";
  const trimColor = clientType === "app" ? "#8b5cf6" : "#10b981";

  // SVG Animation Refs for zero-rerender 60 FPS animation
  const rootGRef = useRef(null);
  const bodyGRef = useRef(null);
  const armLRef = useRef(null);
  const armRRef = useRef(null);
  const eyeLRef = useRef(null);
  const eyeRRef = useRef(null);
  const mouthRef = useRef(null);
  const auraRef = useRef(null);
  const petGRef = useRef(null);
  const holoCubeRef = useRef(null);
  const steamRef = useRef(null);
  const serverLedsRef = useRef([]);
  const oscWaveRef = useRef(null);
  const fxGroupRef = useRef(null);
  const auraParticlesRef = useRef(null);
  const monitorScanlineRef = useRef(null);

  // Animation Loop Effect
  useEffect(() => {
    if (!interactive) return;

    let animId;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = 0;

    const tick = (now) => {
      const dt = now - lastTime;
      lastTime = now;
      const t = isPlaying ? now : 0;

      frameCount++;
      fpsTimer += dt;

      // 1. Body Bob, Shake & Tilt
      let bob = Math.sin(t * 0.004) * (0.8 + intensity * 1.4);
      let shake = 0;
      let tilt = 0;

      if (mode === "happy") bob = -Math.abs(Math.sin(t * 0.005)) * 4.2;
      if (mode === "sleeping") {
        bob = Math.sin(t * 0.0016) * 1.1 + 2.2;
        tilt = (0.12 + Math.sin(t * 0.0016) * 0.02) * (180 / Math.PI);
      }
      if (mode === "error") shake = Math.sin(t * 0.09) * 2.2;
      if (mode === "looping") {
        shake = Math.sin(t * 0.08) * 2.5;
        bob = Math.sin(t * 0.015) * 1.8;
        tilt = Math.sin(t * 0.02) * 10;
      }

      if (bodyGRef.current) {
        bodyGRef.current.setAttribute("transform", `translate(${shake.toFixed(2)}, ${bob.toFixed(2)}) rotate(${tilt.toFixed(2)})`);
      }

      // 2. Arms (Shoulder Pivot at (-22, -26) and (22, -26))
      const phase = t * 0.012;
      let rotL = 0;
      let rotR = 0;

      if (mode === "streaming") {
        rotL = Math.sin(phase) * 0.14 * (0.3 + intensity) * (180 / Math.PI);
        rotR = -Math.sin(phase + 1.3) * 0.14 * (0.3 + intensity) * (180 / Math.PI);
      } else if (mode === "pending") {
        rotL = (2.5 + Math.sin(t * 0.012) * 0.35) * (180 / Math.PI);
        rotR = -Math.sin(phase + 1.3) * 0.06 * (180 / Math.PI);
      } else if (mode === "happy") {
        rotL = (2.2 + Math.sin(t * 0.01) * 0.2) * (180 / Math.PI);
        rotR = (-2.2 - Math.sin(t * 0.01 + 1) * 0.2) * (180 / Math.PI);
      } else if (mode === "error") {
        rotL = (2.7 + Math.sin(t * 0.08) * 0.1) * (180 / Math.PI);
        rotR = (-2.7 - Math.sin(t * 0.08) * 0.1) * (180 / Math.PI);
      } else if (mode === "looping") {
        rotL = (2.4 + Math.sin(t * 0.02) * 0.4) * (180 / Math.PI);
        rotR = (-2.4 - Math.sin(t * 0.02 + 1) * 0.4) * (180 / Math.PI);
      }

      if (armLRef.current) armLRef.current.setAttribute("transform", `rotate(${rotL.toFixed(2)}, -22, -26)`);
      if (armRRef.current) armRRef.current.setAttribute("transform", `rotate(${rotR.toFixed(2)}, 22, -26)`);

      // 3. Eyes (Blink & CRT Flicker)
      const blinking = Math.sin(t * 0.0013) > 0.985;
      const flicker = (0.85 + Math.sin(t * 0.01) * 0.15).toFixed(2);

      if (eyeLRef.current) {
        eyeLRef.current.setAttribute("opacity", flicker);
        if (mode === "streaming") {
          eyeLRef.current.setAttribute("ry", blinking ? "0.8" : "4.4");
        }
      }
      if (eyeRRef.current) {
        eyeRRef.current.setAttribute("opacity", flicker);
        if (mode === "streaming") {
          eyeRRef.current.setAttribute("ry", blinking ? "0.8" : "4.4");
        }
      }

      // Telemetry callback
      if (fpsTimer >= 400 && onTelemetry) {
        onTelemetry({
          fps: Math.round((frameCount * 1000) / fpsTimer),
          bob,
          shake,
          rotL,
          rotR,
          blink: blinking,
        });
        frameCount = 0;
        fpsTimer = 0;
      }

      // 4. Aura & Ambient VFX Animation
      if (auraRef.current && auraArch !== "none") {
        const pulse = 1 + Math.sin(t * 0.006) * 0.12;
        auraRef.current.setAttribute("transform", `scale(${pulse.toFixed(3)})`);

        if (auraParticlesRef.current) {
          if (auraArch === "matrix_rain") {
            let mHtml = "";
            const cols = [-40, -28, -16, -4, 8, 20, 32, 44];
            const glyphs = ["0", "1", "λ", "§", "#", "*", ">", "Ψ", "Δ", "01"];
            cols.forEach((colX, cIdx) => {
              const speed = 0.05 + (cIdx % 3) * 0.02;
              const dropY = -45 + ((t * speed + cIdx * 18) % 75);
              mHtml += `<line x1="${colX}" y1="-45" x2="${colX}" y2="${dropY.toFixed(1)}" stroke="${auraColor}" stroke-width="1.2" stroke-dasharray="2 3" opacity="0.35" />`;
              const glyph = glyphs[(Math.floor(t * 0.003 + cIdx * 3)) % glyphs.length];
              mHtml += `<text x="${colX - 3}" y="${dropY.toFixed(1)}" fill="${auraColor}" font-size="7" font-family="monospace" font-weight="bold" opacity="0.9">${glyph}</text>`;
              mHtml += `<circle cx="${colX}" cy="${(dropY + 2).toFixed(1)}" r="1.6" fill="#ffffff" />`;
            });
            auraParticlesRef.current.innerHTML = mHtml;
          } else if (auraArch === "quantum_mist") {
            let qHtml = "";
            const rAng = (t * 0.02) % 360;
            qHtml += `<ellipse cx="0" cy="0" rx="46" ry="18" fill="none" stroke="${auraColor}" stroke-width="1.4" opacity="0.5" transform="rotate(${rAng.toFixed(1)})" />`;
            qHtml += `<ellipse cx="0" cy="0" rx="40" ry="15" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.4" transform="rotate(${(-rAng * 0.7).toFixed(1)})" />`;
            for (let i = 0; i < 6; i++) {
              const orbAng = t * 0.0025 + (i * Math.PI * 2) / 6;
              const ox = Math.cos(orbAng) * 44;
              const oy = Math.sin(orbAng) * 18;
              const zScale = 0.7 + Math.sin(orbAng) * 0.3;
              const alpha = (0.4 + Math.sin(orbAng) * 0.5).toFixed(2);
              qHtml += `<circle cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" r="${(2.5 * zScale).toFixed(1)}" fill="${auraColor}" opacity="${alpha}" />`;
              qHtml += `<circle cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" r="${(1.2 * zScale).toFixed(1)}" fill="#ffffff" opacity="${alpha}" />`;
            }
            auraParticlesRef.current.innerHTML = qHtml;
          } else if (auraArch === "glitch_halo") {
            let gHtml = "";
            const isGlitch = Math.sin(t * 0.04) > 0.65;
            const jitterX = isGlitch ? Math.sin(t * 0.3) * 6 : 0;
            const jitterY = isGlitch ? Math.cos(t * 0.4) * 3 : 0;
            gHtml += `<rect x="${(-38 + jitterX).toFixed(1)}" y="${(-26 + jitterY).toFixed(1)}" width="76" height="34" rx="4" fill="none" stroke="#00f0ff" stroke-width="1.8" opacity="0.75" />`;
            gHtml += `<rect x="${(-38 - jitterX * 0.8).toFixed(1)}" y="${(-26 - jitterY * 0.8).toFixed(1)}" width="76" height="34" rx="4" fill="none" stroke="#ff007f" stroke-width="1.8" opacity="0.75" />`;
            gHtml += `<rect x="-38" y="-26" width="76" height="34" rx="4" fill="none" stroke="${auraColor}" stroke-width="2.2" opacity="0.9" />`;
            for (let sl = -20; sl <= 20; sl += 10) {
              const sOff = isGlitch ? Math.sin(t * 0.2 + sl) * 8 : 0;
              gHtml += `<line x1="${(-38 + sOff).toFixed(1)}" y1="${sl}" x2="${(38 + sOff).toFixed(1)}" y2="${sl}" stroke="#ffffff" stroke-width="0.8" opacity="0.5" />`;
            }
            auraParticlesRef.current.innerHTML = gHtml;
          } else {
            // Plasma Ring & Other Auras
            let pHtml = "";
            const rot1 = (t * 0.03) % 360;
            const rot2 = (-t * 0.045) % 360;
            pHtml += `<ellipse cx="0" cy="0" rx="46" ry="18" fill="none" stroke="${auraColor}" stroke-width="2.5" opacity="0.8" transform="rotate(${rot1.toFixed(1)})" />`;
            pHtml += `<ellipse cx="0" cy="0" rx="42" ry="14" fill="none" stroke="#ffffff" stroke-width="1.2" opacity="0.6" transform="rotate(${rot2.toFixed(1)})" />`;
            for (let i = 0; i < 8; i++) {
              const fAng = (t * 0.002 + (i * Math.PI * 2) / 8);
              const fx = Math.cos(fAng) * 44;
              const fy = Math.sin(fAng) * 16;
              pHtml += `<circle cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" r="2" fill="${auraColor}" opacity="0.8" />`;
            }
            auraParticlesRef.current.innerHTML = pHtml;
          }
        }
      }

      // 5. Props & Desk Animation
      if (holoCubeRef.current) {
        const ang = (t * 0.1) % 360;
        holoCubeRef.current.setAttribute("transform", `translate(65, -15) rotate(${ang.toFixed(1)})`);
      }

      if (serverLedsRef.current.length > 0) {
        const ledCols = ["#22c55e", "#00f0ff", "#f59e0b", "#ec4899"];
        serverLedsRef.current.forEach((led, idx) => {
          if (!led) return;
          const on = Math.sin(t * 0.008 + idx * 1.6) > 0;
          led.setAttribute("fill", on ? ledCols[idx] : "#0f172a");
        });
      }

      if (oscWaveRef.current) {
        let d = "M 57 21";
        for (let ox = 57; ox <= 85; ox += 3) {
          const oy = 21 + Math.sin(t * 0.01 + ox * 0.8) * 4;
          d += ` L ${ox} ${oy.toFixed(1)}`;
        }
        oscWaveRef.current.setAttribute("d", d);
      }

      if (steamRef.current) {
        let sHtml = "";
        for (let i = 0; i < 3; i++) {
          const p = ((t * 0.0008 + i / 3) % 1);
          const sy = 8 - p * 22;
          const sx = -73 + Math.sin(p * 5 + i * 2) * 4;
          const alpha = (0.55 * (1 - p)).toFixed(2);
          const r = 1 + p * 2.5;
          sHtml += `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${r.toFixed(1)}" fill="#ffffff" opacity="${alpha}" />`;
        }
        steamRef.current.innerHTML = sHtml;
      }

      if (monitorScanlineRef.current) {
        const sY = -42 + ((t * 0.035) % 42);
        monitorScanlineRef.current.setAttribute("y1", sY.toFixed(1));
        monitorScanlineRef.current.setAttribute("y2", sY.toFixed(1));
      }

      // 6. Pet Animation
      if (petGRef.current && petArch !== "none") {
        if (petArch === "hover_drone") {
          const droneY = -25 + Math.sin(t * 0.005) * 5;
          petGRef.current.setAttribute("transform", `translate(80, ${droneY.toFixed(2)})`);
        } else if (mode === "happy") {
          const jumpY = -Math.abs(Math.sin(t * 0.008)) * 8;
          const squash = 1 + Math.abs(Math.sin(t * 0.008)) * 0.15;
          petGRef.current.setAttribute("transform", `translate(80, ${jumpY.toFixed(2)}) scale(1, ${squash.toFixed(2)})`);
        } else if (mode === "sleeping") {
          const breathe = 1 + Math.sin(t * 0.0016) * 0.04;
          petGRef.current.setAttribute("transform", `translate(80, 0) scale(1, ${breathe.toFixed(2)})`);
        } else if (mode === "error") {
          const petShake = Math.sin(t * 0.08) * 2;
          petGRef.current.setAttribute("transform", `translate(${(80 + petShake).toFixed(2)}, 0)`);
        } else if (mode === "looping") {
          const petTilt = Math.sin(t * 0.04) * 8;
          petGRef.current.setAttribute("transform", `translate(80, 0) rotate(${petTilt.toFixed(1)})`);
        } else {
          petGRef.current.setAttribute("transform", "translate(80, 0)");
        }
      }

      // 7. Dynamic Workstation & Action Particle Effects
      if (fxGroupRef.current) {
        if (mode === "streaming" || mode === "pending") {
          // Keystroke sparks & floating code bits shooting up from keyboard
          let inner = "";
          const numParticles = Math.min(8, Math.round(3 + intensity * 6));
          const codeTokens = ["✦", "01", "</>", "{ }", "++", "=>", "•", "λ", "=="];
          for (let k = 0; k < numParticles; k++) {
            const p = ((t * (0.0006 + intensity * 0.0006) + k / numParticles) % 1);
            const sx = 20 - p * 30 + Math.sin(p * 6 + k) * 6;
            const sy = 25 - p * 42;
            const alpha = (Math.sin(p * Math.PI) * (0.4 + intensity * 0.6)).toFixed(2);
            const token = codeTokens[k % codeTokens.length];
            if (k % 2 === 0) {
              inner += `<text x="${sx.toFixed(1)}" y="${sy.toFixed(1)}" fill="${skinColor}" font-size="5.5" font-family="monospace" font-weight="bold" opacity="${alpha}">${token}</text>`;
            } else {
              inner += `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${(1 + p * 1.5).toFixed(1)}" fill="#00f0ff" opacity="${alpha}" />`;
            }
          }
          fxGroupRef.current.innerHTML = inner;
        } else if (mode === "happy") {
          // Celebration Confetti & Sparkles
          let inner = "";
          const colors = ["#fbbf24", "#00f0ff", "#f43f5e", "#10b981", "#a855f7", "#ffffff"];
          const shapes = ["✦", "★", "✧", "•"];
          for (let k = 0; k < 10; k++) {
            const p = ((t * 0.0007 + k / 10) % 1);
            const ang = (k / 10) * Math.PI * 2;
            const dist = 18 + p * 45;
            const cx = Math.cos(ang) * dist;
            const cy = -50 + Math.sin(ang) * (dist * 0.7) - p * 15;
            const alpha = ((1 - p) * 0.9).toFixed(2);
            const col = colors[k % colors.length];
            const sym = shapes[k % shapes.length];
            inner += `<text x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" fill="${col}" font-size="7" font-weight="bold" opacity="${alpha}">${sym}</text>`;
          }
          fxGroupRef.current.innerHTML = inner;
        } else if (mode === "sleeping") {
          // Floating Sleep Z Letters & Bubbles
          let inner = "";
          for (let k = 0; k < 4; k++) {
            const p = ((t * 0.0004 + k / 4) % 1);
            const zx = 18 + p * 20;
            const zy = -78 - p * 34;
            const s = 3 + p * 4;
            const alpha = (1 - p).toFixed(2);
            inner += `<path d="M ${zx} ${zy} L ${zx + s} ${zy} L ${zx} ${zy + s} L ${zx + s} ${zy + s}" stroke="#93c5fd" stroke-width="1.8" fill="none" opacity="${alpha}" />`;
            inner += `<circle cx="${(zx - 6).toFixed(1)}" cy="${(zy + 8).toFixed(1)}" r="${(1.5 + p * 3).toFixed(1)}" fill="none" stroke="#60a5fa" stroke-width="0.8" opacity="${(alpha * 0.6).toFixed(2)}" />`;
          }
          fxGroupRef.current.innerHTML = inner;
        } else if (mode === "error" || mode === "looping") {
          // Billowing Smoke & Electric Arc Sparks
          let inner = "";
          for (let k = 0; k < 5; k++) {
            const p = ((t * 0.0008 + k / 5) % 1);
            const sx = Math.sin(p * 8 + k * 1.3) * 8 + (k - 2) * 4;
            const sy = -76 - p * 42;
            const r = 2.5 + p * 8;
            const alpha = (0.65 * (1 - p)).toFixed(2);
            inner += `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${r.toFixed(1)}" fill="#4b5563" opacity="${alpha}" />`;
          }
          if (Math.sin(t * 0.05) > 0.6) {
            inner += `<path d="M -26 -65 L -34 -72 L -28 -74 L -36 -82" stroke="#f43f5e" stroke-width="1.5" fill="none" />`;
            inner += `<path d="M 26 -65 L 34 -72 L 28 -74 L 36 -82" stroke="#facc15" stroke-width="1.5" fill="none" />`;
          }
          fxGroupRef.current.innerHTML = inner;
        } else {
          fxGroupRef.current.innerHTML = "";
        }
      }

      if (isPlaying) {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [interactive, mode, intensity, petArch, isPlaying]);

  // Prop helpers & resolved list
  const resolvedProps = useMemo(() => {
    if (!propsList || propsList.length === 0) return [];
    return propsList
      .map((p) => (typeof p === "object" && p !== null ? p : getItemById(p) || null))
      .filter(Boolean);
  }, [propsList]);

  const hasProp = (keyword) => {
    const kw = String(keyword).toLowerCase();
    return (
      (propsList || []).some((p) => String(p).toLowerCase().includes(kw)) ||
      resolvedProps.some((p) => (p.archetype && p.archetype.includes(kw)) || (p.name && p.name.toLowerCase().includes(kw)))
    );
  };

  const getProp = (arch) => {
    const kw = String(arch).toLowerCase();
    return resolvedProps.find((p) => (p.archetype && p.archetype.includes(kw)) || (p.name && p.name.toLowerCase().includes(kw)) || String(p.id).includes(kw));
  };

  return (
    <div
      className={`relative select-none flex items-center justify-center overflow-hidden ${className}`}
      style={style}
    >
      <svg
        ref={rootGRef}
        viewBox={showDesk || showFloor ? "-170 -160 340 300" : "-65 -95 130 130"}
        className="w-full h-full block"
        style={{ filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.5))" }}
      >
        <defs>
          {/* Radial Ambient Glow */}
          <radialGradient id={`${idPrefix}_ambientGlow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={themeStyle.glow} stopOpacity="0.25" />
            <stop offset="70%" stopColor={themeStyle.base} stopOpacity="0.05" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Torso & Head Shading Gradients */}
          <linearGradient id={`${idPrefix}_bodyGradient`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#1e2430" />
            <stop offset="100%" stopColor="#111622" />
          </linearGradient>

          <linearGradient id={`${idPrefix}_headGradient`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2d3748" />
            <stop offset="60%" stopColor="#1e2430" />
            <stop offset="100%" stopColor="#111622" />
          </linearGradient>

          <linearGradient id={`${idPrefix}_deskGradient`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2b3443" />
            <stop offset="100%" stopColor="#181d26" />
          </linearGradient>

          <linearGradient id={`${idPrefix}_floorGradient`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={themeStyle.tile} />
            <stop offset="100%" stopColor={themeStyle.base} />
          </linearGradient>
        </defs>

        {/* 1. FLOOR THEME ISOMETRIC ENVIRONMENT */}
        {showFloor && (
          <g transform="translate(0, 50)">
            {/* Ambient Radial Spotlight */}
            <circle cx="0" cy="-30" r="140" fill={`url(#${idPrefix}_ambientGlow)`} />

            {/* Floor Cast Shadow */}
            <ellipse cx="0" cy="18" rx="145" ry="46" fill="#000000" opacity="0.55" />

            {/* Isometric Floor Rhombus */}
            <polygon
              points="0,-68 150,0 0,68 -150,0"
              fill={`url(#${idPrefix}_floorGradient)`}
              stroke={themeStyle.grid}
              strokeWidth="1.8"
            />

            {/* Floor Bevel Extrusion Rim */}
            <polygon points="-150,0 0,68 0,76 -150,8" fill="#090a0f" opacity="0.6" />
            <polygon points="150,0 0,68 0,76 150,8" fill="#050608" opacity="0.8" />

            {/* Floor Gridlines */}
            <g stroke={themeStyle.grid} strokeWidth="1" opacity="0.45">
              <line x1="-75" y1="-34" x2="75" y2="34" />
              <line x1="-112" y1="-17" x2="38" y2="51" />
              <line x1="-38" y1="-51" x2="112" y2="17" />
              <line x1="75" y1="-34" x2="-75" y2="34" />
              <line x1="112" y1="-17" x2="-38" y2="51" />
              <line x1="38" y1="-51" x2="-112" y2="17" />
            </g>

            {/* Neon Corner Brackets */}
            <g stroke={themeStyle.glow} strokeWidth="2" fill="none">
              <path d="M -130,-4 L -145,0 L -130,4" />
              <path d="M 130,-4 L 145,0 L 130,4" />
            </g>
          </g>
        )}

        {/* 2. DYNAMIC AURA & ATMOSPHERE EFFECTS LAYER (Behind Character) */}
        {auraArch !== "none" && (
          <g transform="translate(0, -42)">
            <g ref={auraRef}>
              <g ref={auraParticlesRef} />
            </g>
          </g>
        )}

        {/* 3. AGENT BODY & HEAD (Positioned behind desk) */}
        <g id="agent-root" transform="translate(0, -50)">
          <g ref={bodyGRef}>
            {/* Distinct Staff Torso & Uniform Silhouette */}
            <RenderStaffTorso
              archetype={skinArch}
              color={skinColor}
              secondaryColor={skinSecColor}
              accentColor={skinAccColor}
              idPrefix={idPrefix}
              trimColor={trimColor}
            />

            {/* Distinct Staff Arms with Archetype Sleeves */}
            <RenderStaffArms
              archetype={skinArch}
              color={skinColor}
              armLRef={armLRef}
              armRRef={armRRef}
            />

            {/* Comm Pods */}
            <circle cx="-27" cy="-56" r="8" fill={skinColor} />
            <circle cx="27" cy="-56" r="8" fill={skinColor} />

            {/* Helmet Sphere */}
            <ellipse
              cx="0"
              cy="-56"
              rx="26"
              ry="24"
              fill={`url(#${idPrefix}_headGradient)`}
              stroke={skinColor}
              strokeWidth="2.2"
            />

            {/* Visor Cavity */}
            <ellipse cx="0" cy="-53" rx="20" ry="15.5" fill="#0f141c" />

            {/* Custom 50 Curated Skin Accessories */}
            <RenderSkinAccessories
              variant={skinVariant}
              archetype={skinArch}
              color={skinColor}
              secondaryColor={skinSecColor}
              accentColor={skinAccColor}
            />

            {/* CRT Visor Eyes */}
            {mode === "happy" ? (
              <g stroke={skinColor} strokeWidth="2.2" fill="none">
                <path d="M -12.6 -55 A 4.6 4.6 0 0 1 -3.4 -55" />
                <path d="M 3.4 -55 A 4.6 4.6 0 0 1 12.6 -55" />
              </g>
            ) : mode === "sleeping" ? (
              <g stroke={skinColor} strokeWidth="2.2" fill="none">
                <path d="M -12.6 -57 A 4.6 4.6 0 0 0 -3.4 -57" />
                <path d="M 3.4 -57 A 4.6 4.6 0 0 0 12.6 -57" />
              </g>
            ) : mode === "error" ? (
              <g stroke={skinColor} strokeWidth="2.2">
                <line x1="-12" y1="-61" x2="-4" y2="-53" />
                <line x1="-4" y1="-61" x2="-12" y2="-53" />
                <line x1="4" y1="-61" x2="12" y2="-53" />
                <line x1="12" y1="-61" x2="4" y2="-53" />
              </g>
            ) : mode === "looping" ? (
              <g stroke={skinColor} strokeWidth="1.6" fill="none">
                <circle cx="-8" cy="-57" r="4.2" />
                <circle cx="-8" cy="-57" r="2.0" />
                <circle cx="8" cy="-57" r="4.2" />
                <circle cx="8" cy="-57" r="2.0" />
              </g>
            ) : (
              <g>
                <ellipse ref={eyeLRef} cx="-8" cy="-57" rx="4.8" ry="4.4" fill={skinColor} />
                <ellipse ref={eyeRRef} cx="8" cy="-57" rx="4.8" ry="4.4" fill={skinColor} />
              </g>
            )}

            {/* Mouth */}
            {mode === "happy" ? (
              <path d="M -6 -48 A 6 6 0 0 0 6 -48" stroke={skinColor} strokeWidth="2.2" fill="none" />
            ) : mode === "sleeping" ? (
              <circle cx="0" cy="-45" r="1.8" fill="none" stroke={skinColor} strokeWidth="1.6" />
            ) : mode === "error" ? (
              <path d="M -7 -45 L -3.5 -48 L 0 -45 L 3.5 -48 L 7 -45" stroke={skinColor} strokeWidth="2" fill="none" />
            ) : mode === "looping" ? (
              <circle cx="0" cy="-46" r="3.2" fill="none" stroke={skinColor} strokeWidth="2" />
            ) : (
              <ellipse ref={mouthRef} cx="0" cy="-46" rx={5 + intensity * 3} ry={2.4 + intensity * 1.2} fill={skinColor} />
            )}

            {/* Particle Effects Group (Z's or Smoke) */}
            <g ref={fxGroupRef} />
          </g>
        </g>

        {/* 4. WORKSTATION DESK & PROPS (In front of Character) */}
        {showDesk && (
          <g id="desk-root" transform="translate(0, 0)">
            {/* Ground Contact Shadow */}
            <ellipse cx="0" cy="65" rx="110" ry="14" fill="#000000" opacity="0.4" />

            {/* Desk Surface & Base */}
            <rect x="-105" y="0" width="210" height="120" rx="10" fill={`url(#${idPrefix}_deskGradient)`} stroke="#475569" strokeWidth="1.5" />

            {/* Desk Lip Highlight */}
            <rect x="-105" y="0" width="210" height="4" fill="#ffffff" opacity="0.15" />

            {/* Latency / Elapsed Progress Bar */}
            <rect x="-85" y="106" width="170" height="6" rx="3" fill="#0f141c" />
            <rect
              x="-85"
              y="106"
              width={170 * (0.3 + intensity * 0.7)}
              height="6"
              rx="3"
              fill={mode === "error" ? "#f43f5e" : intensity > 0.8 ? "#f59e0b" : "#10b981"}
            />

            {/* Center Monitor Screen */}
            <rect x="-45" y="-45" width="90" height="48" rx="4" fill="#0b0e13" />
            <rect
              x="-42"
              y="-42"
              width="84"
              height="42"
              rx="3"
              fill={mode === "error" ? "rgba(244,63,94,0.3)" : "rgba(0,240,255,0.25)"}
            />

            {/* CRT Active Scanline Beam */}
            <line
              ref={monitorScanlineRef}
              x1="-42"
              y1="-42"
              x2="42"
              y2="-42"
              stroke={mode === "error" ? "#f43f5e" : "#00f0ff"}
              strokeWidth="1.6"
              opacity="0.65"
            />

            {/* Screen Code Lines */}
            <g fill="#ffffff" opacity="0.5">
              <rect x="-38" y="-38" width="24" height="3" rx="1" />
              <rect x="-38" y="-29" width="42" height="3" rx="1" />
              <rect x="-38" y="-20" width="30" height="3" rx="1" />
              <rect x="-38" y="-11" width="36" height="3" rx="1" />
            </g>

            {/* Monitor Client Badge */}
            <rect x="-42" y="-42" width="28" height="12" rx="2" fill={clientType === "app" ? "#3b0764" : "#064e3b"} />
            <text x="-38" y="-33" fontFamily="monospace" fontSize="8" fontWeight="bold" fill={clientType === "app" ? "#d8b4fe" : "#6ee7b7"}>
              {clientType.toUpperCase()}
            </text>

            {/* ----------------- EQUIPPED PROPS (7 DISTINCT ARCHETYPES) ----------------- */}

            {/* 1. SUPERCOMPUTER / SERVER TOWER */}
            {(hasProp("supercomputer") || hasProp("server") || hasProp("tower") || (resolvedProps.length === 0 && hasProp("prop_1"))) && (() => {
              const p = getProp("supercomputer") || { color: "#00f0ff", secondaryColor: "#003b46" };
              return (
                <g id="prop-supercomputer" transform="translate(-98, -26)">
                  <rect x="0" y="0" width="16" height="42" rx="3" fill="#121824" stroke={p.color} strokeWidth="1.2" />
                  {/* Drive bays */}
                  <line x1="3" y1="8" x2="13" y2="8" stroke="#334155" strokeWidth="1.5" />
                  <line x1="3" y1="14" x2="13" y2="14" stroke="#334155" strokeWidth="1.5" />
                  <line x1="3" y1="20" x2="13" y2="20" stroke="#334155" strokeWidth="1.5" />
                  {/* Blinking LEDs */}
                  {[0, 1, 2, 3].map((idx) => (
                    <circle
                      key={`server-led-${idx}`}
                      ref={(el) => (serverLedsRef.current[idx] = el)}
                      cx="5"
                      cy={26 + idx * 4}
                      r="1.4"
                      fill={p.color}
                    />
                  ))}
                  {/* Ventilation Grill */}
                  <line x1="9" y1="26" x2="13" y2="26" stroke={p.color} strokeWidth="0.8" opacity="0.6" />
                  <line x1="9" y1="30" x2="13" y2="30" stroke={p.color} strokeWidth="0.8" opacity="0.6" />
                  <line x1="9" y1="34" x2="13" y2="34" stroke={p.color} strokeWidth="0.8" opacity="0.6" />
                  <line x1="9" y1="38" x2="13" y2="38" stroke={p.color} strokeWidth="0.8" opacity="0.6" />
                </g>
              );
            })()}

            {/* 2. ESPRESSO STATION */}
            {(hasProp("espresso_station") || hasProp("espresso") || hasProp("coffee") || (resolvedProps.length === 0)) && (() => {
              const p = getProp("espresso_station") || { color: "#e2e8f0", secondaryColor: "#1e293b" };
              return (
                <g id="prop-espresso">
                  {/* Steaming Coffee Cup */}
                  <rect x="-80" y="10" width="14" height="16" rx="2" fill={p.color || "#e2e8f0"} stroke="#475569" strokeWidth="1" />
                  <path d="M -66 14 C -62 14, -62 22, -66 22" stroke={p.color || "#e2e8f0"} strokeWidth="2" fill="none" />
                  <g ref={steamRef} />
                  {/* Machine Body (if explicitly an espresso station) */}
                  {(hasProp("espresso_station") || hasProp("espresso")) && (
                    <g transform="translate(-84, -14)">
                      <rect x="0" y="0" width="18" height="24" rx="2" fill="#1e293b" stroke={p.color} strokeWidth="1" />
                      <circle cx="9" cy="8" r="4" fill="#0f172a" stroke={p.color} strokeWidth="0.8" />
                      <line x1="9" y1="8" x2="11" y2="6" stroke="#ef4444" strokeWidth="0.8" />
                      <rect x="6" y="14" width="6" height="3" fill="#64748b" />
                    </g>
                  )}
                </g>
              );
            })()}

            {/* 3. ARCADE CABINET */}
            {(hasProp("arcade_cabinet") || hasProp("arcade")) && (() => {
              const p = getProp("arcade_cabinet") || { color: "#f43f5e", secondaryColor: "#881337" };
              return (
                <g id="prop-arcade" transform="translate(-96, -24)">
                  {/* Cabinet Body */}
                  <polygon points="0,42 0,6 4,0 16,0 18,6 18,42" fill="#18181b" stroke={p.color} strokeWidth="1.2" />
                  {/* Marquee Banner */}
                  <rect x="3" y="2" width="12" height="6" rx="1" fill={p.color} />
                  <text x="9" y="7" fill="#ffffff" fontSize="4" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PLAY</text>
                  {/* Screen Bezel & Screen */}
                  <polygon points="2,11 16,11 15,24 3,24" fill="#09090b" stroke="#27272a" strokeWidth="0.8" />
                  <polygon points="3,12 15,12 14,23 4,23" fill={p.secondaryColor || "#09090b"} />
                  {/* 8-bit Pixel Sprite on Screen */}
                  <rect x="7" y="15" width="4" height="4" fill={p.color} />
                  {/* Control Panel: Joystick & Buttons */}
                  <polygon points="2,25 16,25 17,31 1,31" fill="#27272a" stroke={p.color} strokeWidth="0.8" />
                  <circle cx="5" cy="27.5" r="1.6" fill="#ef4444" />
                  <line x1="5" y1="27.5" x2="5" y2="30" stroke="#ffffff" strokeWidth="0.8" />
                  <circle cx="11" cy="28" r="1.2" fill={p.color} />
                  <circle cx="14" cy="27" r="1.2" fill="#eab308" />
                  {/* Coin Door */}
                  <rect x="6" y="34" width="6" height="6" rx="1" fill="#09090b" stroke="#3f3f46" strokeWidth="0.6" />
                  <rect x="8.5" y="35" width="1" height="3" fill="#eab308" />
                </g>
              );
            })()}

            {/* 4. TERRARIUM BONSAI */}
            {(hasProp("terrarium_bonsai") || hasProp("bonsai") || hasProp("plant")) && (() => {
              const p = getProp("terrarium_bonsai") || { color: "#10b981", secondaryColor: "#064e3b" };
              return (
                <g id="prop-bonsai" transform="translate(-84, 4)">
                  {/* Hexagonal Ceramic Planter */}
                  <polygon points="2,14 16,14 14,20 4,20" fill="#78350f" stroke="#b45309" strokeWidth="1" />
                  {/* Gnarled Bonsai Trunk */}
                  <path d="M 9 14 Q 8 8 5 5 Q 12 2 10 -4" stroke="#92400e" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                  {/* Glowing Foliage / Sakura Clouds */}
                  <ellipse cx="5" cy="2" rx="6.5" ry="4" fill={p.color} opacity="0.9" />
                  <ellipse cx="12" cy="-2" rx="6" ry="3.8" fill={p.color} opacity="0.95" />
                  <ellipse cx="8" cy="6" rx="4.5" ry="3" fill={p.secondaryColor || "#059669"} opacity="0.85" />
                  <circle cx="5" cy="2" r="1.2" fill="#ffffff" />
                  <circle cx="12" cy="-2" r="1.2" fill="#ffffff" />
                </g>
              );
            })()}

            {/* 5. DUAL MONITOR */}
            {(hasProp("dual_monitor") || hasProp("monitor") || hasProp("screen")) && (() => {
              const p = getProp("dual_monitor") || { color: "#06b6d4", secondaryColor: "#083344" };
              return (
                <g id="prop-dual-monitor" transform="translate(50, -36)">
                  {/* Articulated Gas-Spring Mount Arm */}
                  <line x1="22" y1="28" x2="22" y2="46" stroke="#475569" strokeWidth="2.4" />
                  <ellipse cx="22" cy="46" rx="7" ry="2.5" fill="#334155" />
                  {/* Secondary Angled Screen */}
                  <rect x="2" y="0" width="40" height="30" rx="3" fill="#090d16" stroke={p.color} strokeWidth="1.2" />
                  {/* Screen Content: Mini Syntax Code Lines & Status Bar */}
                  <rect x="5" y="4" width="22" height="2" rx="0.5" fill={p.color} opacity="0.8" />
                  <rect x="5" y="8" width="16" height="2" rx="0.5" fill="#ffffff" opacity="0.5" />
                  <rect x="5" y="12" width="28" height="2" rx="0.5" fill="#ffffff" opacity="0.4" />
                  <rect x="5" y="16" width="20" height="2" rx="0.5" fill={p.color} opacity="0.7" />
                  {/* Telemetry Bar Chart on Right */}
                  <rect x="30" y="20" width="2" height="6" fill="#10b981" />
                  <rect x="33" y="16" width="2" height="10" fill={p.color} />
                  <rect x="36" y="12" width="2" height="14" fill="#f59e0b" />
                </g>
              );
            })()}

            {/* 6. HOLOGRAM EMITTER */}
            {(hasProp("hologram_emitter") || hasProp("holo") || hasProp("cube")) && (() => {
              const p = getProp("hologram_emitter") || { color: skinColor, secondaryColor: "#1e1b4b" };
              return (
                <g id="prop-hologram">
                  {/* Hexagonal Emitter Pad */}
                  <ellipse cx="65" cy="14" rx="14" ry="5" fill="#1e293b" stroke={p.color} strokeWidth="1.2" />
                  <ellipse cx="65" cy="13" rx="9" ry="3" fill="#0f172a" stroke={p.color} strokeWidth="0.8" />
                  {/* Upward Volumetric Hologram Cone */}
                  <polygon points="65,13 46,-16 84,-16" fill={p.color} opacity="0.16" />
                  <line x1="46" y1="-16" x2="84" y2="-16" stroke={p.color} strokeWidth="1" opacity="0.4" strokeDasharray="2 2" />
                  {/* Floating Rotating Hologram Core */}
                  <g ref={holoCubeRef}>
                    <rect x="-10" y="-10" width="20" height="20" fill="none" stroke={p.color} strokeWidth="1.4" opacity="0.9" />
                    <line x1="-10" y1="-10" x2="10" y2="10" stroke={p.color} strokeWidth="0.8" opacity="0.5" />
                    <circle cx="0" cy="0" r="2.5" fill={p.color} />
                  </g>
                </g>
              );
            })()}

            {/* 7. LAB OSCILLOSCOPE */}
            {(hasProp("lab_oscilloscope") || hasProp("osc") || hasProp("scope") || hasProp("wave")) && (() => {
              const p = getProp("lab_oscilloscope") || { color: "#10b981", secondaryColor: "#064e3b" };
              return (
                <g id="prop-oscilloscope" transform="translate(56, 8)">
                  {/* Instrument Enclosure */}
                  <rect x="0" y="0" width="34" height="24" rx="3" fill="#111827" stroke="#374151" strokeWidth="1.2" />
                  {/* Phosphor CRT Display */}
                  <rect x="3" y="3" width="20" height="18" rx="2" fill="#051b14" stroke={p.color} strokeWidth="0.8" />
                  {/* Screen Grid Reticle */}
                  <line x1="13" y1="3" x2="13" y2="21" stroke={p.color} strokeWidth="0.4" opacity="0.4" strokeDasharray="1 1" />
                  <line x1="3" y1="12" x2="23" y2="12" stroke={p.color} strokeWidth="0.4" opacity="0.4" strokeDasharray="1 1" />
                  {/* Live Animated Waveform */}
                  <path ref={oscWaveRef} d="M 4 12 L 22 12" stroke={p.color} strokeWidth="1.4" fill="none" />
                  {/* Control Knobs & BNC Jacks */}
                  <circle cx="28" cy="7" r="2.4" fill="#374151" stroke="#9ca3af" strokeWidth="0.6" />
                  <circle cx="28" cy="14" r="2.4" fill="#374151" stroke="#9ca3af" strokeWidth="0.6" />
                  <circle cx="28" cy="19.5" r="1.5" fill={p.color} />
                </g>
              );
            })()}

            {/* Mechanical Keyboard */}
            <g id="prop-keyboard">
              <rect x="15" y="27" width="34" height="8" rx="2" fill="#232a35" stroke="#3b4554" strokeWidth="1" />
            </g>

            {/* ----------------- COMPANION PET ----------------- */}
            {petArch !== "none" && (
              <g ref={petGRef} id="companion-pet">
                {petArch === "hover_drone" ? (
                  <g>
                    <ellipse cx="0" cy="0" rx="14" ry="8" fill="#0f172a" stroke={petColor} strokeWidth="1.5" />
                    <ellipse cx="0" cy="-6" rx="16" ry="3" fill="none" stroke="#ffffff" strokeWidth="1" />
                    <circle cx="0" cy="0" r="2.5" fill={petColor} />
                  </g>
                ) : (
                  <g>
                    <rect x="-10" y="-14" width="20" height="16" rx="5" fill="#1e293b" stroke={petColor} strokeWidth="1.4" />
                    {/* Ears */}
                    <polygon points="-8,-14 -4,-20 -1,-14" fill={petColor} />
                    <polygon points="1,-14 4,-20 8,-14" fill={petColor} />
                    {/* Eyes */}
                    <circle cx="-4" cy="-8" r="1.5" fill="#ffffff" />
                    <circle cx="4" cy="-8" r="1.5" fill="#ffffff" />
                  </g>
                )}
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
export default LiveReactAgent;
