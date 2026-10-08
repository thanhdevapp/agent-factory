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
// 1. 3D AGENT SKINS (250 SKINS)
// ----------------------------------------------------------------------------
function Render3DSkin({ item, gradId }) {
  const { name, color, archetype } = item;

  let headgear = null;
  let visorExtra = null;

  if (archetype === "stealth_ninja" || name.includes("Ninja") || name.includes("Blade")) {
    headgear = (
      <>
        {/* Holographic Katana on back */}
        <line x1="18" y1="52" x2="82" y2="12" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        <line x1="22" y1="48" x2="80" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        {/* Headband Ties */}
        <path d="M74,32 Q88,28 92,42 Q80,38 72,36" fill={color} opacity="0.85" />
      </>
    );
  } else if (archetype === "mecha_pilot" || name.includes("Mecha") || name.includes("Titan")) {
    headgear = (
      <>
        {/* Heavy Shoulder Pods */}
        <rect x="8" y="48" width="16" height="12" rx="3" fill="#1a1a26" stroke={color} strokeWidth="1.5" />
        <rect x="76" y="48" width="16" height="12" rx="3" fill="#1a1a26" stroke={color} strokeWidth="1.5" />
        {/* Dual High-Gain Antennas */}
        <line x1="30" y1="12" x2="22" y2="2" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="22" cy="2" r="2.5" fill={color} />
        <line x1="70" y1="12" x2="78" y2="2" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="78" cy="2" r="2.5" fill={color} />
      </>
    );
  } else if (archetype === "celestial_astro" || name.includes("Astro") || name.includes("Cosmic")) {
    headgear = (
      <>
        {/* Gold Reflective Solar Bubble Halo */}
        <ellipse cx="50" cy="34" rx="36" ry="24" fill="none" stroke={color} strokeWidth="1.8" opacity="0.4" strokeDasharray="4 2" />
        <circle cx="50" cy="8" r="3.5" fill={color} />
      </>
    );
  } else if (archetype === "matrix_hacker" || name.includes("Hacker") || name.includes("Root")) {
    headgear = (
      <>
        {/* Cyberpunk Matrix Cowl */}
        <path d="M14,42 Q14,8 50,8 Q86,8 86,42 Q70,48 50,48 Q30,48 14,42 Z" fill="#081018" stroke={color} strokeWidth="1.5" />
        {/* Digital Binary Dots on Cowl */}
        <circle cx="28" cy="18" r="1.2" fill={color} opacity="0.6" />
        <circle cx="36" cy="14" r="1.2" fill={color} opacity="0.8" />
        <circle cx="64" cy="14" r="1.2" fill={color} opacity="0.8" />
        <circle cx="72" cy="18" r="1.2" fill={color} opacity="0.6" />
      </>
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

      {/* 3D Chibi Chassis Body */}
      <path d="M30,56 L70,56 L64,74 L36,74 Z" fill={`url(#${gradId}-left)`} stroke={color} strokeWidth="1.5" />
      <rect x="42" y="60" width="16" height="10" rx="3" fill="#090912" stroke={color} strokeWidth="1" />
      <circle cx="50" cy="65" r="2.5" fill={color} />

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
// 2. 3D TECH DESK PROPS (350 PROPS)
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

  if (archetype === "supercomputer" || name.includes("Server") || name.includes("Tower")) {
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
  } else if (archetype === "dual_monitor" || name.includes("Monitor") || name.includes("Screen")) {
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
  } else if (archetype === "hologram_emitter" || name.includes("Holo") || name.includes("Projector")) {
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
  } else if (archetype === "espresso_station" || name.includes("Espresso") || name.includes("Coffee")) {
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
  } else if (archetype === "terrarium_bonsai" || name.includes("Bonsai") || name.includes("Plant")) {
    prop3D = (
      <g transform="translate(56, 20)">
        {/* Hexagonal Ceramic Pot */}
        <polygon points="6,40 28,40 25,48 9,48" fill="#78350f" stroke="#b45309" strokeWidth="1.5" />
        {/* Twisted Bonsai Trunk */}
        <path d="M17,40 Q17,30 13,26 Q24,22 21,14" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Foliage Clouds */}
        <ellipse cx="14" cy="20" rx="9" ry="5.5" fill="#10b981" />
        <ellipse cx="25" cy="15" rx="8" ry="5" fill="#34d399" />
        <ellipse cx="19" cy="25" rx="6" ry="4" fill="#059669" />
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
        <text x="50" y="74" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
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
