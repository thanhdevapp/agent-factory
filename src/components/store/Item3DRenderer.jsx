"use client";

import React, { useMemo } from "react";
import { getItemById } from "@/lib/catalog/index.js";

/**
 * High-Fidelity 3D Isometric Vector Renderer Engine for 1000 Catalog Items.
 * Features:
 * - 3D Isometric projection with Top, Left, Right directional shading
 * - Emissive neon glow filters & ambient occlusion contact shadows
 * - Specular edge highlights & metallic bevels
 * - Micro-details: status LEDs, panel lines, circuit traces, gradient refractions
 * - Scaled Chibi Cyber Agent mockup in 3D perspective
 */

export function Item3DPreview({ item, itemId, className = "w-24 h-24" }) {
  const targetItem = useMemo(() => {
    if (item) return item;
    if (itemId) return getItemById(itemId);
    return null;
  }, [item, itemId]);

  if (!targetItem) {
    return (
      <div className="w-full h-28 rounded-xl bg-[#18181c] border border-[#2b2b34] flex items-center justify-center text-slate-500 font-mono text-xs">
        ITEM NOT FOUND
      </div>
    );
  }

  const itemAccent = targetItem.color || targetItem.palette?.accentColor || "#00f0ff";
  const { id, name, category, archetype, color = itemAccent, secondaryColor = "#111827", rarity = "rare" } = targetItem;
  const filterId = `glow-${id}`;
  const gradId = `grad-${id}`;

  return (
    <div className="w-full h-28 sm:h-32 rounded-xl bg-gradient-to-b from-[#1c1c24] to-[#0e0e14] border border-[#2a2a36] hover:border-cyan-400/80 transition-all duration-300 flex items-center justify-center relative overflow-hidden group shadow-lg">
      {/* Background Cybernetic Ambient Radial Glow */}
      <div
        className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}25 0%, transparent 70%)`,
        }}
      />

      {/* SVG Canvas (100x85 isometric viewport) */}
      <svg
        viewBox="0 0 100 85"
        className={`${className} relative z-10 transition-transform duration-300 group-hover:scale-105 select-none`}
        style={{ filter: `drop-shadow(0 6px 14px ${color}40)` }}
      >
        <defs>
          {/* 3D Directional Lighting Gradients */}
          <linearGradient id={`${gradId}-top`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="30%" stopColor={color} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>

          <linearGradient id={`${gradId}-left`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#0a0a14" />
          </linearGradient>

          <linearGradient id={`${gradId}-right`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.7" />
            <stop offset="100%" stopColor="#05050a" />
          </linearGradient>

          {/* Emissive Neon Glow Filter */}
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Floor Ambient Occlusion Shadow */}
        <ellipse cx="50" cy="72" rx="36" ry="7" fill="#000000" opacity="0.55" />

        {/* 2. Category-Specific 3D Geometry Rendering */}
        {category === "skins" && <Render3DSkin item={targetItem} gradId={gradId} />}
        {category === "props" && <Render3DProp item={targetItem} gradId={gradId} />}
        {category === "pets" && <Render3DPet item={targetItem} gradId={gradId} />}
        {category === "auras" && <Render3DAura item={targetItem} gradId={gradId} />}
        {category === "trophies" && <Render3DTrophy item={targetItem} gradId={gradId} />}
        {category === "themes" && <Render3DTheme item={targetItem} gradId={gradId} />}
      </svg>

      {/* Rarity & Name Badge */}
      <span
        className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold shadow-sm"
        style={{
          color: color,
          backgroundColor: `${color}15`,
          borderColor: `${color}40`,
        }}
      >
        {name}
      </span>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 3D CHIBI AGENT BASE MOCKUP (Used alongside props, pets, and in skins)
// ----------------------------------------------------------------------------
function RenderChibiAgent3D({ x = 12, y = 20, scale = 0.85, accentColor = "#00f0ff" }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* 3D Contact Shadow */}
      <ellipse cx="20" cy="50" rx="14" ry="4" fill="#000000" opacity="0.6" />

      {/* 3D Boots */}
      <rect x="10" y="44" width="8" height="5" rx="2" fill="#0d0d17" stroke="#1f1f2e" strokeWidth="1" />
      <rect x="22" y="44" width="8" height="5" rx="2" fill="#0d0d17" stroke="#1f1f2e" strokeWidth="1" />

      {/* 3D Torso Suit */}
      <path d="M12,32 L28,32 L26,45 L14,45 Z" fill="#161622" stroke="#2c2c3d" strokeWidth="1.2" />
      {/* Chest Reactor Core */}
      <circle cx="20" cy="38" r="3.5" fill="#070710" stroke={accentColor} strokeWidth="1" />
      <circle cx="20" cy="38" r="1.8" fill={accentColor} opacity="0.9" />

      {/* 3D Shoulder Pauldrons */}
      <polygon points="9,31 13,31 11,37" fill={accentColor} opacity="0.8" />
      <polygon points="31,31 27,31 29,37" fill={accentColor} opacity="0.8" />

      {/* 3D Spherical Head / Helmet */}
      <ellipse cx="20" cy="20" rx="17" ry="14" fill="#1c1c2b" stroke={accentColor} strokeWidth="1.8" />
      {/* 3D Helmet Top Highlight */}
      <path d="M10,14 Q20,8 30,14" stroke="#ffffff" strokeWidth="1.2" fill="none" opacity="0.5" strokeLinecap="round" />

      {/* Curved 3D Visor */}
      <path d="M8,20 Q20,13 32,20 L30,27 Q20,23 10,27 Z" fill="#06060f" stroke="#222233" strokeWidth="1" />
      {/* Emissive Visor Line */}
      <path d="M11,22 Q20,16 29,22" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.95" />
      <circle cx="16" cy="21" r="1" fill="#ffffff" />
      <circle cx="24" cy="21" r="1" fill="#ffffff" />

      {/* 3D Ear Comm Pods */}
      <ellipse cx="4" cy="20" rx="2.5" ry="4" fill="#0f0f1c" stroke={accentColor} strokeWidth="1.2" />
      <ellipse cx="36" cy="20" rx="2.5" ry="4" fill="#0f0f1c" stroke={accentColor} strokeWidth="1.2" />
    </g>
  );
}

// ----------------------------------------------------------------------------
// 3D DISTINCT STAFF TORSO SILHOUETTES & UNIFORMS (5 ARCHETYPES)
// ----------------------------------------------------------------------------
function Render3DStaffTorso({ archetype, color, secondaryColor = "#111827", accentColor = "#ffffff", gradId }) {
  if (archetype === "mecha_pilot") {
    return (
      <g id="staff-3d-mecha-pilot">
        {/* Heavy Armored Exoskeleton Vest */}
        <polygon points="26,54 74,54 67,76 33,76" fill="#18181b" stroke={color} strokeWidth="1.6" />
        {/* Armored Shoulder Pauldrons */}
        <polygon points="22,54 30,52 28,62 20,62" fill="#27272a" stroke={color} strokeWidth="1" />
        <polygon points="78,54 70,52 72,62 80,62" fill="#27272a" stroke={color} strokeWidth="1" />
        {/* Industrial Hazard Chevrons */}
        <polygon points="36,57 41,57 37,62 32,62" fill="#eab308" />
        <polygon points="43,57 48,57 44,62 39,62" fill="#18181b" />
        <polygon points="52,57 57,57 53,62 48,62" fill="#eab308" />
        <polygon points="59,57 64,57 60,62 55,62" fill="#18181b" />
        {/* Heavy Duty Harness Straps */}
        <line x1="38" y1="54" x2="39" y2="76" stroke={color} strokeWidth="1.6" />
        <line x1="62" y1="54" x2="61" y2="76" stroke={color} strokeWidth="1.6" />
        {/* Central Fusion Core with Protective Cage */}
        <circle cx="50" cy="67" r="4.5" fill="#09090b" stroke={color} strokeWidth="1.2" />
        <circle cx="50" cy="67" r="2.5" fill={color} />
        <line x1="46" y1="67" x2="54" y2="67" stroke="#ffffff" strokeWidth="0.8" />
        <line x1="50" y1="63" x2="50" y2="71" stroke="#ffffff" strokeWidth="0.8" />
      </g>
    );
  }

  if (archetype === "stealth_ninja") {
    return (
      <g id="staff-3d-stealth-ninja">
        {/* Form-Fitting Shinobi Gi */}
        <polygon points="31,54 69,54 63,74 37,74" fill="#090d16" stroke={color} strokeWidth="1.4" />
        {/* Crossed Kimono Collar */}
        <line x1="32" y1="54" x2="55" y2="66" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="68" y1="54" x2="48" y2="66" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
        {/* Diagonal Tactical Sash */}
        <polygon points="32,55 36,54 62,72 58,74" fill={color} opacity="0.9" />
        {/* Stealth Kunai Sheath */}
        <rect x="44" y="60" width="10" height="3" rx="1" fill="#1e293b" stroke="#ffffff" strokeWidth="0.6" transform="rotate(-30 49 61.5)" />
        {/* Tied Fabric Obi Waist Sash with Hanging Tails */}
        <rect x="36" y="69" width="28" height="5" rx="1.5" fill="#1e1b4b" stroke={color} strokeWidth="1" />
        <path d="M 52 73 Q 54 78 53 82 Q 50 78 52 73" fill={color} />
      </g>
    );
  }

  if (archetype === "matrix_hacker") {
    return (
      <g id="staff-3d-matrix-hacker">
        {/* Baggy Slouchy Hoodie Body */}
        <rect x="26" y="54" width="48" height="21" rx="6" fill="#121217" stroke={color} strokeWidth="1.5" />
        {/* Draped Neck Cowl */}
        <path d="M 30 53 Q 50 58 70 53 Q 62 61 50 61 Q 38 61 30 53 Z" fill="#1f1f28" stroke={color} strokeWidth="1" />
        {/* Hanging Drawstrings with Metal Aglets */}
        <path d="M 44 59 Q 42 66 45 71" stroke="#ffffff" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <rect x="43.5" y="70" width="2.5" height="3.5" rx="0.5" fill={color} />
        <path d="M 56 59 Q 58 66 55 71" stroke="#ffffff" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <rect x="54" y="70" width="2.5" height="3.5" rx="0.5" fill={color} />
        {/* Kangaroo Front Pouch Pocket */}
        <path d="M 35 66 L 65 66 L 62 73 L 38 73 Z" fill="#09090d" stroke="#27272a" strokeWidth="0.8" />
        <line x1="36" y1="66" x2="38" y2="70" stroke={color} strokeWidth="1" />
        <line x1="64" y1="66" x2="62" y2="70" stroke={color} strokeWidth="1" />
        {/* Glitch Barcode Patch */}
        <g transform="translate(56, 60)">
          <rect x="0" y="0" width="8" height="4" fill="#000000" stroke={accentColor} strokeWidth="0.6" />
          <line x1="2" y1="1" x2="2" y2="3" stroke={color} strokeWidth="0.6" />
          <line x1="4" y1="1" x2="4" y2="3" stroke={color} strokeWidth="1" />
          <line x1="6" y1="1" x2="6" y2="3" stroke={color} strokeWidth="0.6" />
        </g>
      </g>
    );
  }

  if (archetype === "celestial_astro") {
    return (
      <g id="staff-3d-celestial-astro">
        {/* Streamlined Flight Suit Body */}
        <polygon points="28,54 72,54 66,74 34,74" fill="#f1f5f9" stroke={color} strokeWidth="1.4" />
        {/* Hermetic Neck Ring */}
        <rect x="36" y="52" width="28" height="4" rx="1.5" fill="#334155" stroke={color} strokeWidth="1" />
        {/* Gold Command Rank Epaulets */}
        <rect x="24" y="53" width="7" height="4" rx="0.8" fill="#f59e0b" stroke="#78350f" strokeWidth="0.6" />
        <rect x="69" y="53" width="7" height="4" rx="0.8" fill="#f59e0b" stroke="#78350f" strokeWidth="0.6" />
        {/* Dual Pressure Dials with Conduit */}
        <circle cx="44" cy="65" r="3" fill="#0f172a" stroke={color} strokeWidth="1" />
        <circle cx="44" cy="65" r="1.2" fill="#22c55e" />
        <circle cx="56" cy="65" r="3" fill="#0f172a" stroke={color} strokeWidth="1" />
        <circle cx="56" cy="65" r="1.2" fill="#38bdf8" />
        <path d="M 47 65 Q 50 68 53 65" fill="none" stroke={color} strokeWidth="1.2" />
        {/* Mission Patch Insignia */}
        <polygon points="40,58 45,58 42.5,62" fill={color} stroke="#ffffff" strokeWidth="0.6" />
        <ellipse cx="42.5" cy="60" rx="3.5" ry="1.2" fill="none" stroke="#f59e0b" strokeWidth="0.6" transform="rotate(-20 42.5 60)" />
      </g>
    );
  }

  // Default Cyber Suit (Corporate Executive)
  return (
    <g id="staff-3d-cyber-suit">
      <polygon points="28,54 72,54 65,74 35,74" fill={`url(#${gradId}-left)`} stroke={color} strokeWidth="1.4" />
      <polygon points="30,54 44,66 38,66" fill="#090d16" stroke={color} strokeWidth="0.8" />
      <polygon points="70,54 56,66 62,66" fill="#090d16" stroke={color} strokeWidth="0.8" />
      <line x1="50" y1="54" x2="50" y2="70" stroke={color} strokeWidth="1.2" />
      <path d="M 46 54 Q 50 63 54 54" stroke={accentColor} strokeWidth="1" fill="none" opacity="0.85" />
      <rect x="46" y="61" width="8" height="10" rx="1" fill="#070a12" stroke={color} strokeWidth="0.8" />
      <rect x="47.5" y="62.5" width="5" height="3" fill={color} />
      <line x1="47.5" y1="67" x2="52.5" y2="67" stroke="#ffffff" strokeWidth="0.6" />
      <rect x="47" y="71" width="6" height="3.5" rx="0.8" fill="#1e293b" stroke={color} strokeWidth="0.8" />
    </g>
  );
}

// ----------------------------------------------------------------------------
// 1. 3D AGENT SKINS (50 CURATED ICONIC MODELS)
// ----------------------------------------------------------------------------
function Render3DSkin({ item, gradId }) {
  const { name, color, archetype, variant = "tactical_visor", secondaryColor = "#111827", accentColor = "#ffffff" } = item;

  let headgear = null;

  // 1. CYBER SUIT VARIANTS (10)
  if (variant === "tactical_visor") {
    headgear = (
      <g>
        <polygon points="40,8 60,8 55,2 45,2" fill={color} />
        <line x1="50" y1="2" x2="50" y2="8" stroke={accentColor} strokeWidth="1.5" />
        <polygon points="18,24 10,12 18,18" fill={color} />
        <polygon points="82,24 90,12 82,18" fill={color} />
      </g>
    );
  } else if (variant === "laser_scout") {
    headgear = (
      <g>
        <circle cx="60" cy="34" r="8" fill="none" stroke={color} strokeWidth="1.8" />
        <line x1="60" y1="22" x2="60" y2="46" stroke={color} strokeWidth="1" strokeDasharray="1 2" />
        <line x1="48" y1="34" x2="72" y2="34" stroke={color} strokeWidth="1" strokeDasharray="1 2" />
        <circle cx="60" cy="34" r="2.5" fill="#ff0000" />
      </g>
    );
  } else if (variant === "riot_shield") {
    headgear = (
      <g>
        <rect x="22" y="18" width="56" height="10" rx="3" fill="#181824" stroke={color} strokeWidth="1.8" />
        <circle cx="32" cy="23" r="2.5" fill={accentColor} />
        <circle cx="68" cy="23" r="2.5" fill={accentColor} />
      </g>
    );
  } else if (variant === "cyber_horns") {
    headgear = (
      <g>
        <polygon points="28,20 16,2 34,14" fill={color} stroke={secondaryColor} strokeWidth="1" />
        <polygon points="72,20 84,2 66,14" fill={color} stroke={secondaryColor} strokeWidth="1" />
        <line x1="30" y1="16" x2="22" y2="6" stroke={accentColor} strokeWidth="1.5" />
        <line x1="70" y1="16" x2="78" y2="6" stroke={accentColor} strokeWidth="1.5" />
      </g>
    );
  } else if (variant === "crown_radiator") {
    headgear = (
      <g fill={color}>
        <polygon points="32,18 36,4 42,16" />
        <polygon points="46,14 50,0 54,14" />
        <polygon points="58,16 64,4 68,18" />
        <circle cx="50" cy="18" r="3" fill={accentColor} />
      </g>
    );
  } else if (variant === "gas_respirator") {
    headgear = (
      <g>
        <circle cx="34" cy="46" r="7" fill="#181824" stroke={color} strokeWidth="1.6" />
        <circle cx="66" cy="46" r="7" fill="#181824" stroke={color} strokeWidth="1.6" />
        <circle cx="34" cy="46" r="3" fill={color} />
        <circle cx="66" cy="46" r="3" fill={color} />
        <rect x="42" y="44" width="16" height="6" rx="2" fill="#0f0f18" stroke={color} strokeWidth="1" />
      </g>
    );
  } else if (variant === "prism_goggles") {
    headgear = (
      <g>
        <polygon points="30,28 40,24 48,28 48,40 40,44 30,40" fill="#0c4a6e" stroke={color} strokeWidth="1.8" />
        <polygon points="52,28 60,24 70,28 70,40 60,44 52,40" fill="#0c4a6e" stroke={color} strokeWidth="1.8" />
        <circle cx="39" cy="34" r="3" fill={accentColor} />
        <circle cx="61" cy="34" r="3" fill={accentColor} />
      </g>
    );
  } else if (variant === "samurai_crest") {
    headgear = (
      <g>
        <path d="M 24 18 Q 50 -6 76 18 Q 50 6 24 18 Z" fill={color} stroke={secondaryColor} strokeWidth="1.2" />
        <circle cx="50" cy="10" r="3.5" fill={accentColor} />
      </g>
    );
  } else if (variant === "overdrive_vents") {
    headgear = (
      <g strokeLinecap="round">
        <line x1="28" y1="16" x2="16" y2="2" stroke={color} strokeWidth="3.5" />
        <line x1="72" y1="16" x2="84" y2="2" stroke={color} strokeWidth="3.5" />
        <line x1="34" y1="18" x2="26" y2="6" stroke={accentColor} strokeWidth="2" />
        <line x1="66" y1="18" x2="74" y2="6" stroke={accentColor} strokeWidth="2" />
      </g>
    );
  } else if (variant === "holo_shroud") {
    headgear = (
      <g>
        <ellipse cx="50" cy="18" rx="34" ry="14" fill="none" stroke={color} strokeWidth="1.8" strokeDasharray="5 3" />
        <circle cx="50" cy="4" r="4" fill={accentColor} />
      </g>
    );
  }

  // 2. MECHA PILOT VARIANTS (10)
  else if (variant === "v_fin") {
    headgear = (
      <g>
        <polygon points="20,-2 26,-6 50,14 74,-6 80,-2 50,20" fill={color} stroke={secondaryColor} strokeWidth="1.2" />
        <polygon points="46,18 50,10 54,18 50,22" fill="#ef4444" />
      </g>
    );
  } else if (variant === "blast_shield") {
    headgear = (
      <g>
        <rect x="22" y="22" width="56" height="18" rx="3" fill="#0f172a" stroke={color} strokeWidth="2" />
        <circle cx="28" cy="8" r="4" fill="#fde047" stroke={color} strokeWidth="1.5" />
        <circle cx="72" cy="8" r="4" fill="#fde047" stroke={color} strokeWidth="1.5" />
        <rect x="8" y="48" width="16" height="12" rx="3" fill="#1a1a26" stroke={color} strokeWidth="1.5" />
        <rect x="76" y="48" width="16" height="12" rx="3" fill="#1a1a26" stroke={color} strokeWidth="1.5" />
      </g>
    );
  } else if (variant === "eva_horn") {
    headgear = (
      <g>
        <polygon points="47,18 50,-14 53,18" fill={color} stroke={secondaryColor} strokeWidth="1" />
        <rect x="12" y="32" width="6" height="24" rx="2" fill={color} stroke={secondaryColor} strokeWidth="1" />
        <rect x="82" y="32" width="6" height="24" rx="2" fill={color} stroke={secondaryColor} strokeWidth="1" />
      </g>
    );
  } else if (variant === "cage_grille") {
    headgear = (
      <g>
        <rect x="30" y="30" width="40" height="20" rx="3" fill="#18181b" stroke={color} strokeWidth="1.8" />
        <line x1="38" y1="30" x2="38" y2="50" stroke={color} strokeWidth="1.5" />
        <line x1="46" y1="30" x2="46" y2="50" stroke={color} strokeWidth="1.5" />
        <line x1="54" y1="30" x2="54" y2="50" stroke={color} strokeWidth="1.5" />
        <line x1="62" y1="30" x2="62" y2="50" stroke={color} strokeWidth="1.5" />
        <rect x="22" y="-2" width="6" height="22" rx="1" fill="#27272a" stroke={color} strokeWidth="1" />
        <rect x="72" y="-2" width="6" height="22" rx="1" fill="#27272a" stroke={color} strokeWidth="1" />
      </g>
    );
  } else if (variant === "missile_pod") {
    headgear = (
      <g>
        <rect x="6" y="38" width="14" height="18" rx="3" fill="#1c1917" stroke={color} strokeWidth="1.5" />
        <circle cx="13" cy="44" r="2" fill="#ef4444" />
        <circle cx="13" cy="50" r="2" fill="#ef4444" />
        <rect x="80" y="38" width="14" height="18" rx="3" fill="#1c1917" stroke={color} strokeWidth="1.5" />
        <circle cx="87" cy="44" r="2" fill="#ef4444" />
        <circle cx="87" cy="50" r="2" fill="#ef4444" />
      </g>
    );
  } else if (variant === "quad_array") {
    headgear = (
      <g stroke={color} strokeWidth="2">
        <line x1="24" y1="18" x2="16" y2="-4" />
        <line x1="36" y1="14" x2="32" y2="-8" />
        <line x1="64" y1="14" x2="68" y2="-8" />
        <line x1="76" y1="18" x2="84" y2="-4" />
        <circle cx="16" cy="-4" r="2.5" fill={accentColor} stroke="none" />
        <circle cx="32" cy="-8" r="2.5" fill={accentColor} stroke="none" />
        <circle cx="68" cy="-8" r="2.5" fill={accentColor} stroke="none" />
        <circle cx="84" cy="-4" r="2.5" fill={accentColor} stroke="none" />
      </g>
    );
  } else if (variant === "halo_shield") {
    headgear = (
      <g>
        <polygon points="6,44 14,38 22,44 22,54 14,60 6,54" fill="#064e3b" stroke={color} strokeWidth="1.8" />
        <polygon points="78,44 86,38 94,44 94,54 86,60 78,54" fill="#064e3b" stroke={color} strokeWidth="1.8" />
      </g>
    );
  } else if (variant === "ram_horns") {
    headgear = (
      <g>
        <path d="M 28 16 C 6 2, 8 -16, 28 -10 C 20 -4, 20 8, 34 16 Z" fill={color} stroke={secondaryColor} strokeWidth="1.2" />
        <path d="M 72 16 C 94 2, 92 -16, 72 -10 C 80 -4, 80 8, 66 16 Z" fill={color} stroke={secondaryColor} strokeWidth="1.2" />
      </g>
    );
  } else if (variant === "radar_dish") {
    headgear = (
      <g>
        <ellipse cx="20" cy="2" rx="9" ry="16" fill="#18181b" stroke={color} strokeWidth="2" transform="rotate(-25 20 2)" />
        <circle cx="20" cy="2" r="3" fill={accentColor} />
      </g>
    );
  } else if (variant === "hyper_wings") {
    headgear = (
      <g>
        <polygon points="20,44 -2,22 10,54" fill={color} stroke={secondaryColor} strokeWidth="1.5" />
        <polygon points="80,44 102,22 90,54" fill={color} stroke={secondaryColor} strokeWidth="1.5" />
      </g>
    );
  }

  // 3. STEALTH NINJA VARIANTS (10)
  else if (variant === "flowing_headband") {
    headgear = (
      <g>
        <line x1="18" y1="52" x2="82" y2="12" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        <line x1="22" y1="48" x2="80" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <path d="M 74 32 Q 90 26 96 42 Q 84 38 72 36" fill={color} opacity="0.9" />
      </g>
    );
  } else if (variant === "tactical_cowl") {
    headgear = (
      <g>
        <path d="M 22 24 Q 50 14 78 24 L 74 52 Q 50 60 26 52 Z" fill="#0f172a" stroke={color} strokeWidth="1.6" opacity="0.85" />
        <circle cx="58" cy="34" r="6" fill="none" stroke="#22c55e" strokeWidth="2" />
        <circle cx="58" cy="34" r="2" fill="#22c55e" />
      </g>
    );
  } else if (variant === "oni_mask") {
    headgear = (
      <g>
        <polygon points="30,16 18,-4 34,8" fill="#ef4444" stroke="#450a0a" strokeWidth="1.2" />
        <polygon points="70,16 82,-4 66,8" fill="#ef4444" stroke="#450a0a" strokeWidth="1.2" />
        <path d="M 32 44 L 40 50 L 46 44 L 50 48 L 54 44 L 60 50 L 68 44 L 62 56 L 38 56 Z" fill="#ffffff" stroke={color} strokeWidth="1.2" />
      </g>
    );
  } else if (variant === "kitsune_ears") {
    headgear = (
      <g>
        <polygon points="22,18 32,-4 42,12" fill="#1e2430" />
        <polygon points="25,16 32,-1 39,12" fill={color} />
        <polygon points="58,12 68,-4 78,18" fill="#1e2430" />
        <polygon points="61,12 68,-1 75,16" fill={color} />
        <line x1="36" y1="42" x2="22" y2="40" stroke={color} strokeWidth="1.5" />
        <line x1="64" y1="42" x2="78" y2="40" stroke={color} strokeWidth="1.5" />
      </g>
    );
  } else if (variant === "conical_kasa") {
    headgear = (
      <g>
        <polygon points="6,24 50,-8 94,24" fill="#18181b" stroke={color} strokeWidth="2" />
        <line x1="6" y1="24" x2="94" y2="24" stroke={accentColor} strokeWidth="3" />
      </g>
    );
  } else if (variant === "twin_katanas") {
    headgear = (
      <g strokeLinecap="round">
        <line x1="16" y1="56" x2="84" y2="-4" stroke="#475569" strokeWidth="3.5" />
        <line x1="20" y1="52" x2="82" y2="-2" stroke={color} strokeWidth="2" />
        <line x1="84" y1="56" x2="16" y2="-4" stroke="#475569" strokeWidth="3.5" />
        <line x1="80" y1="52" x2="18" y2="-2" stroke={color} strokeWidth="2" />
      </g>
    );
  } else if (variant === "tengu_beak") {
    headgear = (
      <g>
        <polygon points="36,42 50,58 64,42 50,46" fill="#0f172a" stroke={color} strokeWidth="1.8" />
      </g>
    );
  } else if (variant === "veil_shroud") {
    headgear = (
      <g>
        <path d="M 22 30 Q 50 18 78 30 L 74 54 Q 50 64 26 54 Z" fill="#0f172a" opacity="0.85" stroke={color} strokeWidth="1.5" strokeDasharray="4 2" />
      </g>
    );
  } else if (variant === "scythe_crest") {
    headgear = (
      <g>
        <path d="M 50 -10 C 32 -10, 24 6, 32 18 C 24 10, 32 -4, 50 -4 C 68 -4, 76 10, 68 18 C 76 6, 68 -10, 50 -10 Z" fill={color} stroke={secondaryColor} strokeWidth="1.2" />
      </g>
    );
  } else if (variant === "void_mask") {
    headgear = (
      <g>
        <rect x="28" y="24" width="44" height="24" rx="4" fill="#000000" stroke={color} strokeWidth="2" />
        <text x="50" y="42" fill={color} fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">零</text>
      </g>
    );
  }

  // 4. MATRIX HACKER VARIANTS (10)
  else if (variant === "hoodie_cowl") {
    headgear = (
      <g>
        <path d="M 14,42 Q 14,8 50,8 Q 86,8 86,42 Q 70,48 50,48 Q 30,48 14,42 Z" fill="#081018" stroke={color} strokeWidth="1.8" />
        <circle cx="28" cy="18" r="1.5" fill={color} opacity="0.7" />
        <circle cx="36" cy="14" r="1.5" fill={color} opacity="0.9" />
        <circle cx="64" cy="14" r="1.5" fill={color} opacity="0.9" />
        <circle cx="72" cy="18" r="1.5" fill={color} opacity="0.7" />
      </g>
    );
  } else if (variant === "vr_goggles") {
    headgear = (
      <g>
        <rect x="24" y="24" width="52" height="18" rx="4" fill="#083344" stroke={color} strokeWidth="2" />
        <line x1="36" y1="24" x2="30" y2="4" stroke={color} strokeWidth="2" />
        <circle cx="30" cy="4" r="3" fill={accentColor} />
        <line x1="32" y1="33" x2="68" y2="33" stroke={accentColor} strokeWidth="1.6" />
      </g>
    );
  } else if (variant === "daemon_horns") {
    headgear = (
      <g>
        <path d="M 22 20 Q 50 4 78 20" stroke={color} strokeWidth="3.5" fill="none" />
        <polygon points="32,20 24,0 40,14" fill={color} stroke={secondaryColor} strokeWidth="1.2" />
        <polygon points="68,20 76,0 60,14" fill={color} stroke={secondaryColor} strokeWidth="1.2" />
      </g>
    );
  } else if (variant === "glitch_halo") {
    headgear = (
      <g>
        <rect x="18" y="10" width="64" height="48" fill="none" stroke={color} strokeWidth="1.8" strokeDasharray="8 4 3 5" />
        <rect x="28" y="4" width="16" height="8" fill={color} opacity="0.8" />
        <rect x="62" y="46" width="14" height="6" fill={color} opacity="0.8" />
      </g>
    );
  } else if (variant === "floating_hud") {
    headgear = (
      <g>
        <rect x="74" y="6" width="40" height="22" rx="3" fill="#09090b" stroke={color} strokeWidth="1.2" />
        <text x="78" y="20" fill={color} fontSize="8" fontFamily="monospace">root#_</text>
      </g>
    );
  } else if (variant === "respirator_eq") {
    headgear = (
      <g strokeWidth="2.5">
        <rect x="28" y="42" width="44" height="14" rx="4" fill="#0f172a" stroke={color} strokeWidth="1.5" />
        <line x1="36" y1="52" x2="36" y2="46" stroke="#22c55e" />
        <line x1="43" y1="52" x2="43" y2="44" stroke="#eab308" />
        <line x1="50" y1="52" x2="50" y2="43" stroke="#ef4444" />
        <line x1="57" y1="52" x2="57" y2="45" stroke="#eab308" />
        <line x1="64" y1="52" x2="64" y2="47" stroke="#22c55e" />
      </g>
    );
  } else if (variant === "heatsink_fins") {
    headgear = (
      <g fill="#ea580c" stroke="#fed7aa" strokeWidth="1.2">
        <rect x="28" y="-2" width="6" height="18" rx="1.5" />
        <rect x="38" y="-6" width="6" height="22" rx="1.5" />
        <rect x="47" y="-8" width="6" height="24" rx="1.5" />
        <rect x="56" y="-6" width="6" height="22" rx="1.5" />
        <rect x="66" y="-2" width="6" height="18" rx="1.5" />
      </g>
    );
  } else if (variant === "cable_dreads") {
    headgear = (
      <g fill="none" strokeLinecap="round">
        <path d="M 24 30 C 12 46, 14 74, 16 90" stroke={color} strokeWidth="3" />
        <path d="M 30 26 C 22 50, 24 80, 26 94" stroke={accentColor} strokeWidth="2.5" />
        <path d="M 70 26 C 78 50, 76 80, 74 94" stroke={accentColor} strokeWidth="2.5" />
        <path d="M 76 30 C 88 46, 86 74, 84 90" stroke={color} strokeWidth="3" />
      </g>
    );
  } else if (variant === "cyber_skull") {
    headgear = (
      <g>
        <ellipse cx="42" cy="34" rx="6" ry="5" fill="#000000" stroke={color} strokeWidth="1.8" />
        <ellipse cx="58" cy="34" rx="6" ry="5" fill="#000000" stroke={color} strokeWidth="1.8" />
        <polygon points="48,44 50,40 52,44" fill={color} />
        <line x1="40" y1="50" x2="60" y2="50" stroke={color} strokeWidth="2" />
        <line x1="44" y1="47" x2="44" y2="53" stroke={color} strokeWidth="1.5" />
        <line x1="50" y1="47" x2="50" y2="53" stroke={color} strokeWidth="1.5" />
        <line x1="56" y1="47" x2="56" y2="53" stroke={color} strokeWidth="1.5" />
      </g>
    );
  } else if (variant === "wireframe_cube") {
    headgear = (
      <g stroke={color}>
        <rect x="20" y="8" width="60" height="52" rx="4" fill="none" strokeWidth="1.8" />
        <rect x="30" y="18" width="40" height="32" rx="2" fill="none" stroke={accentColor} strokeWidth="1.4" strokeDasharray="4 2" />
        <line x1="20" y1="8" x2="30" y2="18" strokeWidth="1.4" />
        <line x1="80" y1="8" x2="70" y2="18" strokeWidth="1.4" />
        <line x1="20" y1="60" x2="30" y2="50" strokeWidth="1.4" />
        <line x1="80" y1="60" x2="70" y2="50" strokeWidth="1.4" />
      </g>
    );
  }

  // 5. CELESTIAL ASTRO VARIANTS (10)
  else if (variant === "bubble_dome") {
    headgear = (
      <g>
        <ellipse cx="50" cy="34" rx="36" ry="26" fill="none" stroke={color} strokeWidth="2.8" opacity="0.9" />
        <circle cx="50" cy="4" r="4.5" fill="#fef08a" stroke={color} strokeWidth="1.5" />
        <path d="M 32 18 Q 50 8 68 18" stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.7" strokeLinecap="round" />
      </g>
    );
  } else if (variant === "lunar_pack") {
    headgear = (
      <g>
        <rect x="24" y="-4" width="3" height="24" fill={color} />
        <circle cx="25.5" cy="-4" r="2.5" fill="#ffffff" />
        <ellipse cx="50" cy="34" rx="32" ry="24" fill="none" stroke="#e2e8f0" strokeWidth="2.2" />
      </g>
    );
  } else if (variant === "sunburst_halo") {
    headgear = (
      <g stroke={color} strokeWidth="2" opacity="0.9">
        <line x1="50" y1="-2" x2="50" y2="-14" />
        <line x1="76" y1="8" x2="88" y2="-4" />
        <line x1="86" y1="34" x2="100" y2="34" />
        <line x1="76" y1="60" x2="88" y2="72" />
        <line x1="50" y1="70" x2="50" y2="82" />
        <line x1="24" y1="60" x2="12" y2="72" />
        <line x1="14" y1="34" x2="0" y2="34" />
        <line x1="24" y1="8" x2="12" y2="-4" />
      </g>
    );
  } else if (variant === "saturn_ring") {
    headgear = (
      <g>
        <ellipse cx="50" cy="34" rx="46" ry="14" fill="none" stroke={color} strokeWidth="2.8" transform="rotate(-15 50 34)" />
        <circle cx="86" cy="26" r="3.5" fill={accentColor} />
      </g>
    );
  } else if (variant === "star_crown") {
    headgear = (
      <g fill={color}>
        <polygon points="30,12 36,-2 42,10" />
        <polygon points="44,8 50,-8 56,8" />
        <polygon points="58,10 64,-2 70,12" />
        <circle cx="50" cy="10" r="3" fill="#ffffff" />
      </g>
    );
  } else if (variant === "eclipse_corona") {
    headgear = (
      <g>
        <ellipse cx="50" cy="34" rx="40" ry="24" fill="none" stroke={color} strokeWidth="3.5" opacity="0.65" strokeDasharray="10 5" />
        <circle cx="50" cy="34" r="28" fill="#000000" stroke={color} strokeWidth="1.8" />
      </g>
    );
  } else if (variant === "pulsar_spires") {
    headgear = (
      <g stroke={color} strokeWidth="3.2" strokeLinecap="round">
        <line x1="50" y1="8" x2="50" y2="-16" />
        <circle cx="50" cy="-16" r="3.5" fill="#ffffff" stroke="none" />
        <line x1="50" y1="60" x2="50" y2="78" />
        <circle cx="50" cy="78" r="3.5" fill="#ffffff" stroke="none" />
      </g>
    );
  } else if (variant === "aurora_ribbons") {
    headgear = (
      <g fill="none" strokeLinecap="round">
        <path d="M 14 -2 Q 32 -18 50 -4 T 86 -8" stroke={color} strokeWidth="3.5" opacity="0.8" />
        <path d="M 20 -8 Q 38 -24 56 -10 T 80 -14" stroke={accentColor} strokeWidth="2.5" opacity="0.6" />
      </g>
    );
  } else if (variant === "angel_wings") {
    headgear = (
      <g>
        <polygon points="20,44 -6,6 12,54" fill={color} stroke={secondaryColor} strokeWidth="1.5" opacity="0.9" />
        <polygon points="80,44 106,6 88,54" fill={color} stroke={secondaryColor} strokeWidth="1.5" opacity="0.9" />
        <ellipse cx="50" cy="2" rx="20" ry="6" fill="none" stroke={accentColor} strokeWidth="2" />
      </g>
    );
  } else if (variant === "singularity_core") {
    headgear = (
      <g>
        <ellipse cx="50" cy="34" rx="38" ry="32" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.9" />
        <circle cx="22" cy="18" r="3" fill={accentColor} />
        <circle cx="78" cy="50" r="3" fill={accentColor} />
      </g>
    );
  } else {
    // Default High-Tech Helm
    headgear = (
      <>
        <polygon points="40,8 60,8 55,2 45,2" fill={color} />
        <line x1="50" y1="2" x2="50" y2="8" stroke="#ffffff" strokeWidth="1.5" />
      </>
    );
  }

  return (
    <g transform="translate(0, 2)">
      {headgear}

      {/* 3D Chibi Chassis Body with Distinct Staff Uniform */}
      <Render3DStaffTorso
        archetype={archetype}
        color={color}
        secondaryColor={secondaryColor}
        accentColor={accentColor}
        gradId={gradId}
      />

      {/* 3D Volumetric Head Helmet */}
      <ellipse cx="50" cy="34" rx="30" ry="22" fill="#171724" stroke={color} strokeWidth="2" />
      {/* Specular Highlight Arc */}
      <path d="M30,20 Q50,12 70,20" stroke="#ffffff" strokeWidth="1.8" fill="none" opacity="0.6" strokeLinecap="round" />

      {/* 3D Curved Visor */}
      <path d="M26,34 Q50,22 74,34 L70,44 Q50,38 30,44 Z" fill="#06060c" stroke="#1f1f2e" strokeWidth="1.2" />
      {/* Emissive Visor Screen */}
      <path d="M30,36 Q50,27 70,36" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="34" r="1.8" fill="#ffffff" />
      <circle cx="60" cy="34" r="1.8" fill="#ffffff" />

      {/* 3D Cyber Ear Pods */}
      <ellipse cx="20" cy="34" rx="4" ry="7" fill="#12121d" stroke={color} strokeWidth="1.5" />
      <circle cx="20" cy="34" r="2" fill={color} />
      <ellipse cx="80" cy="34" rx="4" ry="7" fill="#12121d" stroke={color} strokeWidth="1.5" />
      <circle cx="80" cy="34" r="2" fill={color} />
    </g>
  );
}

// ----------------------------------------------------------------------------
// 2. 3D TECH DESK PROPS (35 CURATED MODELS ACROSS 7 ARCHETYPES)
// ----------------------------------------------------------------------------
function Render3DProp({ item, gradId }) {
  const { name, color, archetype } = item;

  // 3D Isometric Desktop Plane
  const deskSurface = (
    <g>
      {/* Desk Top Isometric Face */}
      <polygon points="10,68 85,68 95,73 20,73" fill="#1a1c24" stroke="#2d303f" strokeWidth="1" />
      {/* Desk Front Edge */}
      <polygon points="20,73 95,73 95,76 20,76" fill="#101117" />
    </g>
  );

  let prop3D = null;

  if (archetype === "supercomputer" || name.includes("Server") || name.includes("Tower") || name.includes("Mainframe") || name.includes("Cluster") || name.includes("Rig")) {
    prop3D = (
      <g transform="translate(54, 18)">
        {/* Isometric Top Face */}
        <polygon points="16,4 34,10 20,16 2,10" fill={`url(#${gradId}-top)`} stroke={color} strokeWidth="1" />
        {/* Isometric Left Face (Front Server Bays) */}
        <polygon points="2,10 20,16 20,52 2,46" fill="#12131c" stroke="#2b2d3d" strokeWidth="1" />
        {/* Isometric Right Face */}
        <polygon points="20,16 34,10 34,46 20,52" fill={`url(#${gradId}-right)`} stroke="#1b1c26" strokeWidth="1" />

        {/* Server Bays & Blinking LEDs */}
        <line x1="5" y1="18" x2="17" y2="22" stroke="#252736" strokeWidth="2.5" />
        <circle cx="6" cy="18" r="1" fill="#22c55e" />
        <line x1="5" y1="26" x2="17" y2="30" stroke="#252736" strokeWidth="2.5" />
        <circle cx="6" cy="26" r="1" fill={color} />
        <line x1="5" y1="34" x2="17" y2="38" stroke="#252736" strokeWidth="2.5" />
        <circle cx="6" cy="34" r="1" fill="#f59e0b" />
        <line x1="5" y1="42" x2="17" y2="46" stroke="#252736" strokeWidth="2.5" />
        <circle cx="6" cy="42" r="1" fill="#ec4899" />
      </g>
    );
  } else if (archetype === "dual_monitor" || name.includes("Monitor") || name.includes("Screen") || name.includes("OLED") || name.includes("Display")) {
    prop3D = (
      <g transform="translate(50, 22)">
        {/* Monitor 1 (Main Left) */}
        <polygon points="2,8 24,4 24,28 2,32" fill="#070a12" stroke={color} strokeWidth="1.5" />
        <line x1="5" y1="12" x2="16" y2="10" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="5" y1="17" x2="20" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="5" y1="22" x2="14" y2="20" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />

        {/* Monitor 2 (Angled Right) */}
        <polygon points="26,4 44,8 44,32 26,28" fill="#070a12" stroke={color} strokeWidth="1.5" />
        <line x1="29" y1="10" x2="38" y2="12" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="29" y1="15" x2="41" y2="17" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Articulated Stand */}
        <line x1="25" y1="28" x2="25" y2="46" stroke="#475569" strokeWidth="2.5" />
        <ellipse cx="25" cy="46" rx="8" ry="3" fill="#334155" />
      </g>
    );
  } else if (archetype === "hologram_emitter" || name.includes("Holo") || name.includes("Projector") || name.includes("Emitter") || name.includes("Tesseract")) {
    prop3D = (
      <g transform="translate(56, 16)">
        {/* Hexagonal Projector Base */}
        <ellipse cx="18" cy="48" rx="15" ry="6" fill="#1a1c26" stroke={color} strokeWidth="1.8" />
        <ellipse cx="18" cy="46" rx="10" ry="4" fill="#080b12" stroke={color} strokeWidth="1" />
        {/* Volumetric Hologram Cone */}
        <polygon points="18,46 4,14 32,14" fill={color} opacity="0.22" />
        {/* 3D Floating Isometric Cube */}
        <polygon points="18,10 26,14 18,18 10,14" fill="#ffffff" opacity="0.9" />
        <polygon points="10,14 18,18 18,26 10,22" fill={color} opacity="0.85" />
        <polygon points="26,14 18,18 18,26 26,22" fill="#0369a1" opacity="0.95" />
      </g>
    );
  } else if (archetype === "espresso_station" || name.includes("Espresso") || name.includes("Coffee") || name.includes("Brewer") || name.includes("Drip")) {
    prop3D = (
      <g transform="translate(56, 26)">
        {/* 3D Espresso Box */}
        <polygon points="4,10 26,6 30,28 8,32" fill="#25232c" stroke={color} strokeWidth="1.5" />
        <rect x="8" y="12" width="18" height="6" rx="1" fill="#0c0a14" />
        <circle cx="11" cy="15" r="1.2" fill="#22c55e" />
        <circle cx="16" cy="15" r="1.2" fill="#ef4444" />
        {/* Ceramic Cup & Steam */}
        <rect x="13" y="24" width="8" height="8" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
        <path d="M15,22 Q17,16 15,12" stroke={color} strokeWidth="1.5" fill="none" opacity="0.8" strokeLinecap="round" />
        <path d="M18,22 Q20,17 18,13" stroke={color} strokeWidth="1.5" fill="none" opacity="0.8" strokeLinecap="round" />
      </g>
    );
  } else if (archetype === "arcade_cabinet" || name.includes("Arcade") || name.includes("Pinball") || name.includes("Cabinet")) {
    prop3D = (
      <g transform="translate(54, 16)">
        {/* Isometric Cabinet Top & Sides */}
        <polygon points="14,2 32,8 20,14 2,8" fill={`url(#${gradId}-top)`} stroke={color} strokeWidth="1" />
        <polygon points="2,8 20,14 20,54 2,48" fill="#18181b" stroke="#2b2d3d" strokeWidth="1" />
        <polygon points="20,14 32,8 32,48 20,54" fill="#0f0f14" stroke="#2b2d3d" strokeWidth="1" />
        {/* Glowing Marquee Banner */}
        <polygon points="4,12 18,17 18,22 4,17" fill={color} />
        {/* Angled CRT Screen */}
        <polygon points="4,22 18,27 18,38 4,33" fill="#000000" stroke={color} strokeWidth="0.8" />
        <rect x="8" y="27" width="5" height="5" fill={color} transform="skewY(15)" />
        {/* Control Deck with Joystick and Buttons */}
        <polygon points="3,36 19,41 17,45 1,40" fill="#27272a" stroke={color} strokeWidth="0.8" />
        <circle cx="6" cy="40" r="1.5" fill="#ef4444" />
        <circle cx="12" cy="42" r="1.2" fill={color} />
        <circle cx="15" cy="43" r="1.2" fill="#eab308" />
      </g>
    );
  } else if (archetype === "terrarium_bonsai" || name.includes("Bonsai") || name.includes("Plant") || name.includes("Garden") || name.includes("Dome")) {
    prop3D = (
      <g transform="translate(56, 20)">
        {/* Hexagonal Ceramic Pot */}
        <polygon points="6,40 28,40 25,48 9,48" fill="#78350f" stroke="#b45309" strokeWidth="1.5" />
        {/* Twisted Bonsai Trunk */}
        <path d="M17,40 Q17,30 13,26 Q24,22 21,14" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Foliage Clouds */}
        <ellipse cx="14" cy="20" rx="9" ry="5.5" fill={color} />
        <ellipse cx="25" cy="15" rx="8" ry="5" fill={color} opacity="0.8" />
        <ellipse cx="19" cy="25" rx="6" ry="4" fill="#059669" />
      </g>
    );
  } else if (archetype === "lab_oscilloscope" || name.includes("Oscilloscope") || name.includes("Multimeter") || name.includes("Analyzer") || name.includes("Scope") || name.includes("Meter")) {
    prop3D = (
      <g transform="translate(52, 22)">
        {/* Instrument Enclosure Top */}
        <polygon points="12,4 38,4 32,16 6,16" fill={`url(#${gradId}-top)`} stroke="#475569" strokeWidth="1" />
        {/* Instrument Front Face */}
        <polygon points="6,16 32,16 32,44 6,44" fill="#111827" stroke={color} strokeWidth="1.2" />
        <polygon points="32,16 38,4 38,32 32,44" fill="#090d16" stroke="#334155" strokeWidth="1" />
        {/* CRT Phosphor Screen */}
        <rect x="9" y="19" width="16" height="15" rx="1.5" fill="#031a12" stroke={color} strokeWidth="0.8" />
        {/* Oscilloscope Sine Wave Trace */}
        <path d="M 10 26 Q 14 20 17 26 T 24 26" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Rotary Knobs & Terminals */}
        <circle cx="28" cy="23" r="2" fill="#374151" stroke="#9ca3af" strokeWidth="0.6" />
        <circle cx="28" cy="30" r="2" fill="#374151" stroke="#9ca3af" strokeWidth="0.6" />
        <circle cx="28" cy="37" r="1.2" fill={color} />
      </g>
    );
  } else {
    // Default 3D Isometric Cyber Terminal
    prop3D = (
      <g transform="translate(54, 22)">
        <polygon points="4,10 24,4 32,24 12,30" fill={`url(#${gradId}-top)`} stroke={color} strokeWidth="1.5" />
        <polygon points="12,30 32,24 32,46 12,52" fill={`url(#${gradId}-left)`} stroke="#1b1c26" strokeWidth="1" />
        <circle cx="22" cy="28" r="4" fill="#ffffff" opacity="0.8" />
      </g>
    );
  }

  return (
    <g>
      {deskSurface}
      {/* 3D Chibi Agent Mockup (Left Side) */}
      <RenderChibiAgent3D x={8} y={18} scale={0.88} accentColor={color} />
      {/* 3D Desk Prop (Right Side) */}
      {prop3D}
    </g>
  );
}

// ----------------------------------------------------------------------------
// 3. 3D PETS & CYBER COMPANIONS (200 PETS)
// ----------------------------------------------------------------------------
function Render3DPet({ item, gradId }) {
  const { name, color, archetype } = item;

  if (archetype === "none" || name === "None") {
    return (
      <g>
        <RenderChibiAgent3D x={32} y={18} scale={0.95} accentColor="#64748b" />
        <text x="50" y="74" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="var(--font-family-ui, sans-serif)">
          No Pet Equipped
        </text>
      </g>
    );
  }

  let pet3D = null;

  if (archetype === "cyber_cat" || name.includes("Cat") || name.includes("Kitty")) {
    pet3D = (
      <g transform="translate(56, 30)">
        {/* Soft 3D Cat Cushion */}
        <ellipse cx="18" cy="28" rx="18" ry="7" fill="#1b1b28" stroke="#333348" strokeWidth="1.2" />
        {/* Curled Body */}
        <ellipse cx="18" cy="20" rx="13" ry="9" fill={color} />
        {/* Head */}
        <circle cx="9" cy="15" r="8" fill={color} />
        {/* Pointy Ears */}
        <polygon points="4,9 6,2 10,8" fill="#f43f5e" />
        <polygon points="9,8 13,2 15,9" fill="#f43f5e" />
        {/* Sleeping Eye arcs */}
        <path d="M6,15 Q8,18 10,15" stroke="#ffffff" strokeWidth="1.5" fill="none" />
        <path d="M11,15 Q13,18 15,15" stroke="#ffffff" strokeWidth="1.5" fill="none" />
        {/* Whiskers */}
        <line x1="3" y1="16" x2="1" y2="15" stroke="#ffffff" strokeWidth="1" />
        <line x1="3" y1="18" x2="1" y2="19" stroke="#ffffff" strokeWidth="1" />
        <text x="24" y="10" fill={color} fontSize="9" fontWeight="bold">Z</text>
      </g>
    );
  } else if (archetype === "dozing_shiba" || name.includes("Shiba") || name.includes("Dog")) {
    pet3D = (
      <g transform="translate(56, 28)">
        <ellipse cx="18" cy="28" rx="18" ry="7" fill="#1b1b28" stroke="#333348" strokeWidth="1.2" />
        <ellipse cx="18" cy="19" rx="14" ry="9" fill={color} />
        <circle cx="8" cy="14" r="8" fill={color} />
        <polygon points="4,8 6,2 10,8" fill="#b45309" />
        <polygon points="9,8 12,2 15,8" fill="#b45309" />
        <circle cx="6" cy="14" r="1.5" fill="#000" />
        <circle cx="11" cy="14" r="1.5" fill="#000" />
        <ellipse cx="8" cy="17" rx="1.8" ry="1.2" fill="#000" />
        {/* Curled Tail */}
        <circle cx="30" cy="15" r="3.5" fill={color} />
      </g>
    );
  } else if (archetype === "hover_drone" || name.includes("Drone") || name.includes("Orb")) {
    pet3D = (
      <g transform="translate(56, 22)">
        {/* Floating Ring */}
        <ellipse cx="18" cy="18" rx="15" ry="4" fill="none" stroke={color} strokeWidth="1.8" strokeDasharray="4 2" />
        {/* 3D Orb Hull */}
        <circle cx="18" cy="18" r="10" fill="#171824" stroke={color} strokeWidth="1.8" />
        {/* Luminous Core Eye */}
        <circle cx="18" cy="18" r="4.5" fill="#38bdf8" />
        <circle cx="16" cy="16" r="1.2" fill="#ffffff" />
        {/* Anti-Grav Particles */}
        <circle cx="18" cy="32" r="1.5" fill={color} opacity="0.8" />
        <circle cx="14" cy="36" r="1" fill={color} opacity="0.5" />
      </g>
    );
  } else {
    // 3D Cyber Owl / Creature
    pet3D = (
      <g transform="translate(58, 26)">
        <ellipse cx="16" cy="22" rx="11" ry="14" fill="#1b1c2b" stroke={color} strokeWidth="1.5" />
        <circle cx="11" cy="16" r="4.5" fill="#070a12" stroke={color} strokeWidth="1.2" />
        <circle cx="21" cy="16" r="4.5" fill="#070a12" stroke={color} strokeWidth="1.2" />
        <circle cx="11" cy="16" r="2" fill={color} />
        <circle cx="21" cy="16" r="2" fill={color} />
        <polygon points="14,20 18,20 16,24" fill="#f59e0b" />
      </g>
    );
  }

  return (
    <g>
      {/* 3D Chibi Agent Mockup (Left Side) */}
      <RenderChibiAgent3D x={8} y={18} scale={0.88} accentColor={color} />
      {/* 3D Cyber Pet Companion (Right Side) */}
      {pet3D}
    </g>
  );
}

// ----------------------------------------------------------------------------
// 4. 3D VISUAL EFFECTS & AURAS (100 AURAS)
// ----------------------------------------------------------------------------
function Render3DAura({ item, gradId }) {
  const { color, archetype } = item;

  return (
    <g>
      {/* 3D Orbital Plasma Energy Rings */}
      <ellipse cx="50" cy="42" rx="38" ry="14" fill="none" stroke={color} strokeWidth="1.8" strokeDasharray="6 3" transform="rotate(-15, 50, 42)" opacity="0.85" />
      <ellipse cx="50" cy="42" rx="38" ry="14" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="3 4" transform="rotate(25, 50, 42)" opacity="0.6" />

      {/* Floating Energy Sparks */}
      <circle cx="20" cy="30" r="2" fill={color} />
      <circle cx="80" cy="26" r="2.5" fill={color} />
      <circle cx="76" cy="56" r="1.5" fill="#ffffff" />
      <circle cx="24" cy="58" r="1.5" fill="#ffffff" />

      {/* Chibi Agent at Center of Aura */}
      <RenderChibiAgent3D x={30} y={16} scale={0.95} accentColor={color} />

      {/* Overhead Glowing Halo */}
      <ellipse cx="50" cy="12" rx="14" ry="4" fill="none" stroke={color} strokeWidth="2" opacity="0.9" />
      <ellipse cx="50" cy="12" rx="11" ry="3" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
    </g>
  );
}

// ----------------------------------------------------------------------------
// 5. 3D OFFICE TROPHIES & BADGES (100 TROPHIES)
// ----------------------------------------------------------------------------
function Render3DTrophy({ item, gradId }) {
  const { color, archetype } = item;

  return (
    <g transform="translate(0, 4)">
      {/* 3D Tiered Mahogany / Obsidian Pedestal */}
      {/* Bottom Step */}
      <polygon points="25,62 75,62 82,69 18,69" fill="#181824" stroke="#2c2c3d" strokeWidth="1" />
      <polygon points="18,69 82,69 82,73 18,73" fill="#0c0c14" />
      {/* Top Step */}
      <polygon points="30,56 70,56 75,62 25,62" fill="#242436" stroke="#3d3d52" strokeWidth="1" />

      {/* Gilded Plaque */}
      <rect x="36" y="64" width="28" height="4" rx="1" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
      <line x1="40" y1="66" x2="60" y2="66" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />

      {/* 3D Faceted Quantum Crystal Monument */}
      {/* Top Pyramid */}
      <polygon points="50,14 66,38 50,42" fill="#ffffff" opacity="0.9" />
      <polygon points="50,14 34,38 50,42" fill={color} opacity="0.85" />
      <polygon points="50,14 34,38 24,34" fill="#0284c7" opacity="0.75" />
      <polygon points="50,14 66,38 76,34" fill="#0369a1" opacity="0.75" />

      {/* Bottom Inverted Pyramid */}
      <polygon points="50,54 66,38 50,42" fill={color} opacity="0.9" />
      <polygon points="50,54 34,38 50,42" fill="#0f172a" opacity="0.8" />

      {/* Specular Light Beams */}
      <circle cx="50" cy="28" r="3" fill="#ffffff" />
      <line x1="50" y1="20" x2="50" y2="36" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <line x1="42" y1="28" x2="58" y2="28" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

// ----------------------------------------------------------------------------
// 6. 3D ISOMETRIC VIRTUAL OFFICE THEME / FLOOR ENVIRONMENT RENDERER
// ----------------------------------------------------------------------------
function Render3DTheme({ item, gradId }) {
  const p = item.palette || {};
  const toHex = (c, fallback = "#38bdf8") =>
    typeof c === "number" ? `#${c.toString(16).padStart(6, "0")}` : (c || fallback);

  const [cTop, cBottom] = (p.floorGradient || [0x0b1018, 0x161f2c]).map((c) => toHex(c));
  const gridHex = toHex(p.gridColor, "#1a2330");
  const borderHex = toHex(p.borderColor, "#263244");
  const rackHex = toHex(p.panelRackColor, "#fde047");
  const podHex = toHex(p.panelPodColor, "#22d3ee");
  const accentHex = p.accentColor || "#007acc";

  return (
    <g>
      <defs>
        <linearGradient id={`${gradId}-floor-face`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={cTop} />
          <stop offset="100%" stopColor={cBottom} />
        </linearGradient>
      </defs>

      {/* 3D Isometric Floor Slab */}
      {/* 1. Left Thickness Slab */}
      <polygon points="12,42 50,64 50,72 12,50" fill={cTop} stroke="#070a10" strokeWidth="1" opacity="0.9" />
      {/* 2. Right Thickness Slab */}
      <polygon points="50,64 88,42 88,50 50,72" fill={cBottom} stroke="#070a10" strokeWidth="1" opacity="0.9" />

      {/* 3. Isometric Top Diamond Face */}
      <polygon
        points="50,20 88,42 50,64 12,42"
        fill={`url(#${gradId}-floor-face)`}
        stroke={borderHex}
        strokeWidth="1.8"
      />

      {/* 4. Isometric Grid Lines (Criss-Cross) */}
      <line x1="31" y1="31" x2="69" y2="53" stroke={gridHex} strokeWidth="1" opacity={p.gridAlpha || 0.75} />
      <line x1="69" y1="31" x2="31" y2="53" stroke={gridHex} strokeWidth="1" opacity={p.gridAlpha || 0.75} />
      <line x1="40" y1="26" x2="78" y2="48" stroke={gridHex} strokeWidth="0.8" opacity={p.gridAlpha || 0.75} />
      <line x1="60" y1="26" x2="22" y2="48" stroke={gridHex} strokeWidth="0.8" opacity={p.gridAlpha || 0.75} />

      {/* 5. Center Hub Platform Highlight (Mini Core Hub Rack) */}
      <polygon
        points="50,33 60,39 50,45 40,39"
        fill={rackHex}
        fillOpacity="0.25"
        stroke={rackHex}
        strokeWidth="1"
      />
      <circle cx="50" cy="39" r="2.5" fill={rackHex} />

      {/* 6. Side Pod Zone Panels */}
      <polygon
        points="65,37 73,42 65,47 57,42"
        fill={podHex}
        fillOpacity="0.2"
        stroke={podHex}
        strokeWidth="0.8"
      />
      <polygon
        points="35,37 43,42 35,47 27,42"
        fill={podHex}
        fillOpacity="0.2"
        stroke={podHex}
        strokeWidth="0.8"
      />

      {/* 7. Ambient Glowing Corner Nodes & Circuit Traces */}
      <circle cx="12" cy="42" r="1.5" fill={borderHex} />
      <circle cx="88" cy="42" r="1.5" fill={borderHex} />
      <circle cx="50" cy="20" r="1.5" fill={borderHex} />
      <circle cx="50" cy="64" r="2" fill={accentHex} />

      {/* 8. Top Surface Specular Flare */}
      <circle cx="50" cy="39" r="6" fill={accentHex} opacity="0.15" />
    </g>
  );
}

// ----------------------------------------------------------------------------
// Legacy Delegates for backwards compatibility
// ----------------------------------------------------------------------------
export function SkinPreview({ skinId }) {
  return <Item3DPreview itemId={skinId} />;
}

export function PropPreview({ propId }) {
  return <Item3DPreview itemId={propId} />;
}

export function PetPreview({ petId }) {
  return <Item3DPreview itemId={petId} />;
}

export function AuraPreview({ auraId }) {
  return <Item3DPreview itemId={auraId} />;
}

export function TrophyPreview({ trophyId }) {
  return <Item3DPreview itemId={trophyId} />;
}

export function ThemePreview({ themeId }) {
  return <Item3DPreview itemId={themeId} />;
}
