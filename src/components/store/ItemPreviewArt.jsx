"use client";

import React from "react";

/**
 * High-quality Visual Art Previews for Store Items
 * Pure scalable SVG illustrations without any external image assets or emojis.
 */

// 1. CHARACTER SKIN PREVIEWS
export function SkinPreview({ skinId }) {
  if (skinId === "cat") {
    return (
      <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#2a1a2e] to-[#161219] border border-pink-500/20 flex items-center justify-center relative overflow-hidden group">
        <svg viewBox="0 0 100 80" className="w-20 h-20 drop-shadow-[0_4px_10px_rgba(244,114,182,0.3)]">
          {/* Triangular Cat Ears */}
          <polygon points="26,30 36,10 46,26" fill="#f472b6" />
          <polygon points="30,28 36,15 42,26" fill="#fbcfe8" />
          <polygon points="74,30 64,10 54,26" fill="#f472b6" />
          <polygon points="70,28 64,15 58,26" fill="#fbcfe8" />

          {/* Torso & Collar */}
          <rect x="36" y="58" width="28" height="18" rx="6" fill="#f472b6" />
          <circle cx="50" cy="62" r="3" fill="#fbbf24" />

          {/* Chibi Head / Helmet */}
          <rect x="25" y="22" width="50" height="38" rx="19" fill="#fdf2f8" stroke="#f472b6" strokeWidth="2" />

          {/* Dark Glass Visor */}
          <rect x="30" y="28" width="40" height="24" rx="10" fill="#2d1537" />

          {/* Cat Eyes (^ ^) */}
          <path d="M37,41 Q42,35 47,41" stroke="#f472b6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M53,41 Q58,35 63,41" stroke="#f472b6" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Tiny Nose */}
          <polygon points="49,44 51,44 50,46" fill="#f472b6" />

          {/* Cat Whiskers */}
          <line x1="20" y1="40" x2="31" y2="42" stroke="#f472b6" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="19" y1="45" x2="31" y2="45" stroke="#f472b6" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="80" y1="40" x2="69" y2="42" stroke="#f472b6" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="81" y1="45" x2="69" y2="45" stroke="#f472b6" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="absolute bottom-1 right-2 text-[9px] font-mono text-pink-400 bg-pink-950/60 px-1.5 py-0.5 rounded border border-pink-500/30">
          CAT CODER
        </span>
      </div>
    );
  }

  if (skinId === "ninja") {
    return (
      <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border border-purple-500/20 flex items-center justify-center relative overflow-hidden group">
        <svg viewBox="0 0 100 80" className="w-20 h-20 drop-shadow-[0_4px_12px_rgba(168,85,247,0.35)]">
          {/* Ninja Scarf Ends Blowing */}
          <path d="M68,54 Q85,58 92,70 Q80,68 66,60 Z" fill="#9333ea" />
          <path d="M66,56 Q82,64 88,76 Q78,70 64,62 Z" fill="#7e22ce" />

          {/* Dark Torso */}
          <rect x="36" y="56" width="28" height="20" rx="6" fill="#2e1065" stroke="#a855f7" strokeWidth="1.5" />
          {/* Belt */}
          <rect x="36" y="66" width="28" height="4" fill="#a855f7" />

          {/* Ninja Cowl / Head */}
          <rect x="25" y="20" width="50" height="40" rx="18" fill="#1e1035" stroke="#a855f7" strokeWidth="2" />

          {/* Forehead Protector / Metal Plate */}
          <rect x="32" y="24" width="36" height="8" rx="2" fill="#4c1d95" stroke="#c084fc" strokeWidth="1" />
          <circle cx="50" cy="28" r="2" fill="#38bdf8" />

          {/* Narrow Slit Visor */}
          <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />

          {/* Glowing Laser Visor Eye Strip */}
          <rect x="34" y="39" width="32" height="7" rx="3" fill="#06b6d4" />
          <line x1="36" y1="42.5" x2="64" y2="42.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          {/* Laser Glow Flare */}
          <circle cx="60" cy="42.5" r="4" fill="#38bdf8" opacity="0.8" />
        </svg>
        <span className="absolute bottom-1 right-2 text-[9px] font-mono text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30">
          CYBER NINJA
        </span>
      </div>
    );
  }

  if (skinId === "hacker") {
    return (
      <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#0a2318] to-[#06140e] border border-emerald-500/20 flex items-center justify-center relative overflow-hidden group">
        {/* Subtle Matrix Code Rain Effect Background */}
        <div className="absolute inset-0 opacity-15 font-mono text-[8px] text-emerald-400 select-none overflow-hidden leading-tight p-1 pointer-events-none">
          101010010110 011001010101 110101100110
        </div>
        <svg viewBox="0 0 100 80" className="w-20 h-20 drop-shadow-[0_4px_12px_rgba(34,197,94,0.35)] relative z-10">
          {/* Matrix Hoodie Body */}
          <path d="M30,76 L36,54 L64,54 L70,76 Z" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />

          {/* Deep Dark Hood (Silhouette) */}
          <path d="M22,50 Q22,14 50,14 Q78,14 78,50 Q66,54 50,54 Q34,54 22,50 Z" fill="#022c22" stroke="#22c55e" strokeWidth="2" />

          {/* Inner Shadow / Void */}
          <ellipse cx="50" cy="38" rx="20" ry="14" fill="#011812" />

          {/* Glowing Green Retro Sunglasses */}
          <rect x="34" y="32" width="13" height="10" rx="3" fill="#22c55e" stroke="#86efac" strokeWidth="1" />
          <rect x="53" y="32" width="13" height="10" rx="3" fill="#22c55e" stroke="#86efac" strokeWidth="1" />
          <line x1="47" y1="36" x2="53" y2="36" stroke="#86efac" strokeWidth="1.5" />

          {/* Scanline Glint */}
          <line x1="36" y1="35" x2="44" y2="35" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
          <line x1="55" y1="35" x2="63" y2="35" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />

          {/* Subtle Smirk */}
          <path d="M48,46 Q52,48 56,46" stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
        <span className="absolute bottom-1 right-2 text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
          RETRO HACKER
        </span>
      </div>
    );
  }

  // Classic Bot (Default)
  return (
    <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#162536] to-[#0c1622] border border-cyan-500/20 flex items-center justify-center relative overflow-hidden group">
      <svg viewBox="0 0 100 80" className="w-20 h-20 drop-shadow-[0_4px_10px_rgba(56,189,248,0.25)]">
        {/* Antenna */}
        <line x1="50" y1="14" x2="50" y2="24" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="12" r="3.5" fill="#38bdf8" />

        {/* Torso */}
        <rect x="36" y="58" width="28" height="18" rx="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
        <rect x="42" y="63" width="16" height="4" rx="2" fill="#38bdf8" />

        {/* Helmet */}
        <rect x="25" y="24" width="50" height="38" rx="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        {/* Ear Pods */}
        <rect x="21" y="36" width="6" height="14" rx="3" fill="#38bdf8" />
        <rect x="73" y="36" width="6" height="14" rx="3" fill="#38bdf8" />

        {/* Dark Visor */}
        <rect x="30" y="30" width="40" height="24" rx="10" fill="#0f172a" />

        {/* Happy Scanline Eyes */}
        <ellipse cx="40" cy="42" rx="4.5" ry="5" fill="#38bdf8" />
        <circle cx="41.5" cy="40.5" r="1.5" fill="#ffffff" />
        <ellipse cx="60" cy="42" rx="4.5" ry="5" fill="#38bdf8" />
        <circle cx="61.5" cy="40.5" r="1.5" fill="#ffffff" />

        {/* Status Line */}
        <line x1="44" y1="48" x2="56" y2="48" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </svg>
      <span className="absolute bottom-1 right-2 text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
        CLASSIC BOT
      </span>
    </div>
  );
}

// 2. PET PREVIEWS
export function PetPreview({ petId }) {
  if (petId === "cat") {
    return (
      <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#2e1d2b] to-[#170e16] border border-pink-500/20 flex items-center justify-center relative overflow-hidden">
        <svg viewBox="0 0 100 70" className="w-20 h-20 drop-shadow-[0_4px_8px_rgba(244,114,182,0.3)]">
          {/* Cushion Bed */}
          <ellipse cx="50" cy="46" rx="34" ry="12" fill="#3f1f3a" stroke="#831843" strokeWidth="1.5" />

          {/* Curled Sleeping Cat Body */}
          <ellipse cx="48" cy="40" rx="20" ry="14" fill="#fda4af" />
          <ellipse cx="48" cy="41" rx="18" ry="12" fill="#fff1f2" />

          {/* Sleeping Cat Head */}
          <circle cx="36" cy="36" r="12" fill="#fda4af" />
          {/* Ears */}
          <polygon points="28,28 32,18 38,26" fill="#f43f5e" />
          <polygon points="36,26 42,19 46,28" fill="#f43f5e" />

          {/* Sleeping Closed Eyes (˘ ˘) */}
          <path d="M30,36 Q33,40 36,36" stroke="#9f1239" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M38,36 Q41,40 44,36" stroke="#9f1239" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Curled Tail */}
          <path d="M64,40 Q72,36 68,30" stroke="#fda4af" strokeWidth="4.5" fill="none" strokeLinecap="round" />

          {/* Zzz Snore bubbles */}
          <text x="70" y="24" fill="#f472b6" fontSize="11" fontWeight="bold" fontFamily="monospace">z</text>
          <text x="77" y="16" fill="#f472b6" fontSize="13" fontWeight="bold" fontFamily="monospace">Z</text>
        </svg>
        <span className="absolute bottom-1 right-2 text-[9px] font-mono text-pink-300 bg-pink-950/60 px-1.5 py-0.5 rounded border border-pink-500/30">
          SLEEPING KITTY
        </span>
      </div>
    );
  }

  if (petId === "shiba") {
    return (
      <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#2e2315] to-[#171109] border border-amber-500/20 flex items-center justify-center relative overflow-hidden">
        <svg viewBox="0 0 100 70" className="w-20 h-20 drop-shadow-[0_4px_8px_rgba(245,158,11,0.3)]">
          {/* Dog Mat */}
          <ellipse cx="50" cy="46" rx="34" ry="12" fill="#451a03" stroke="#78350f" strokeWidth="1.5" />

          {/* Curled Shiba Body */}
          <ellipse cx="50" cy="40" rx="22" ry="14" fill="#d97706" />
          <ellipse cx="48" cy="42" rx="16" ry="10" fill="#fef3c7" />

          {/* Head */}
          <circle cx="35" cy="35" r="13" fill="#d97706" />
          {/* White Shiba Cheeks */}
          <ellipse cx="33" cy="38" rx="8" ry="7" fill="#fef3c7" />
          {/* Triangular Ears */}
          <polygon points="26,27 30,16 36,25" fill="#b45309" />
          <polygon points="36,25 41,18 45,28" fill="#b45309" />

          {/* Sleeping Smile Eyes */}
          <path d="M29,34 Q32,38 35,34" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <circle cx="35" cy="38" r="1.5" fill="#78350f" />

          {/* Curled Fluffy Tail */}
          <circle cx="68" cy="36" r="6" fill="#d97706" />
          <circle cx="68" cy="36" r="3" fill="#fef3c7" />

          {/* Zzz Snore bubbles */}
          <text x="70" y="24" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="monospace">z</text>
          <text x="77" y="16" fill="#fbbf24" fontSize="13" fontWeight="bold" fontFamily="monospace">Z</text>
        </svg>
        <span className="absolute bottom-1 right-2 text-[9px] font-mono text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
          DOZING SHIBA
        </span>
      </div>
    );
  }

  // None (Empty Desk Mat)
  return (
    <div className="w-full h-24 rounded-lg bg-[#181818] border border-[#333333] flex items-center justify-center relative overflow-hidden">
      <svg viewBox="0 0 100 70" className="w-20 h-20 opacity-40">
        <ellipse cx="50" cy="40" rx="34" ry="16" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="50" y="44" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
          No Pet
        </text>
      </svg>
      <span className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400 bg-[#252526] px-1.5 py-0.5 rounded border border-[#3e3e42]">
        EMPTY
      </span>
    </div>
  );
}

// 3. DESK PROPS PREVIEWS
export function PropPreview({ propId }) {
  if (propId === "coffee_machine") {
    return (
      <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#2e1f13] to-[#170e07] border border-amber-500/20 flex items-center justify-center relative overflow-hidden">
        <svg viewBox="0 0 100 80" className="w-20 h-20 drop-shadow-[0_4px_8px_rgba(245,158,11,0.3)]">
          {/* Steam Curls Rising */}
          <path d="M42,22 Q46,15 42,8" stroke="#cbd5e1" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M47,20 Q52,12 48,5" stroke="#cbd5e1" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8" />

          {/* Machine Body */}
          <rect x="30" y="24" width="34" height="46" rx="5" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
          <rect x="33" y="28" width="28" height="8" rx="2" fill="#0f172a" />
          {/* Pressure Gauge */}
          <circle cx="47" cy="32" r="3" fill="#fbbf24" />

          {/* Portafilter Group Head */}
          <rect x="38" y="40" width="16" height="5" rx="1" fill="#94a3b8" />
          <line x1="54" y1="42" x2="62" y2="42" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />

          {/* Mini Espresso Cup with Coffee */}
          <rect x="42" y="52" width="10" height="9" rx="2" fill="#ffffff" />
          <rect x="43" y="53" width="8" height="3" fill="#78350f" />
          {/* Cup Handle */}
          <path d="M52,54 Q55,56 52,59" stroke="#ffffff" strokeWidth="1.5" fill="none" />

          {/* Drip Tray */}
          <rect x="28" y="66" width="38" height="5" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
        </svg>
        <span className="absolute bottom-1 right-2 text-[9px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
          ESPRESSO
        </span>
      </div>
    );
  }

  if (propId === "bonsai") {
    return (
      <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#13291d] to-[#08170f] border border-emerald-500/20 flex items-center justify-center relative overflow-hidden">
        <svg viewBox="0 0 100 80" className="w-20 h-20 drop-shadow-[0_4px_8px_rgba(16,185,129,0.3)]">
          {/* Ceramic Planter Pot */}
          <polygon points="34,60 66,60 62,72 38,72" fill="#9a3412" stroke="#c2410c" strokeWidth="1.5" />
          <ellipse cx="50" cy="60" rx="16" ry="3" fill="#7c2d12" />

          {/* Twisted Bonsai Trunk */}
          <path d="M50,60 Q53,46 44,38 Q40,34 46,26" stroke="#5c3818" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M46,38 Q58,34 54,28" stroke="#5c3818" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Lush Green Foliage Clouds */}
          <ellipse cx="44" cy="24" rx="14" ry="8" fill="#15803d" />
          <ellipse cx="44" cy="22" rx="11" ry="6" fill="#22c55e" />

          <ellipse cx="58" cy="28" rx="10" ry="6" fill="#15803d" />
          <ellipse cx="58" cy="26" rx="8" ry="5" fill="#22c55e" />

          <ellipse cx="36" cy="34" rx="9" ry="5" fill="#166534" />
          <ellipse cx="36" cy="33" rx="7" ry="4" fill="#15803d" />
        </svg>
        <span className="absolute bottom-1 right-2 text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
          BONSAI
        </span>
      </div>
    );
  }

  // RGB Mechanical Keyboard
  return (
    <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1c1829] to-[#0e0c17] border border-purple-500/20 flex items-center justify-center relative overflow-hidden">
      <svg viewBox="0 0 100 80" className="w-20 h-20 drop-shadow-[0_4px_8px_rgba(168,85,247,0.3)]">
        {/* Keyboard Base Case */}
        <rect x="18" y="32" width="64" height="32" rx="4" fill="#1e1e24" stroke="#475569" strokeWidth="1.5" />

        {/* RGB Glow Underglow */}
        <rect x="19" y="33" width="62" height="30" rx="3" fill="none" stroke="url(#rgbGradient)" strokeWidth="1.5" opacity="0.8" />

        <defs>
          <linearGradient id="rgbGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="33%" stopColor="#8b5cf6" />
            <stop offset="66%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* Keycap Rows with Glowing Colors */}
        {/* Row 1 */}
        <rect x="23" y="37" width="7" height="5" rx="1" fill="#ec4899" />
        <rect x="32" y="37" width="7" height="5" rx="1" fill="#d946ef" />
        <rect x="41" y="37" width="7" height="5" rx="1" fill="#a855f7" />
        <rect x="50" y="37" width="7" height="5" rx="1" fill="#8b5cf6" />
        <rect x="59" y="37" width="7" height="5" rx="1" fill="#6366f1" />
        <rect x="68" y="37" width="9" height="5" rx="1" fill="#3b82f6" />

        {/* Row 2 */}
        <rect x="23" y="44" width="8" height="5" rx="1" fill="#f43f5e" />
        <rect x="33" y="44" width="7" height="5" rx="1" fill="#a855f7" />
        <rect x="42" y="44" width="7" height="5" rx="1" fill="#6366f1" />
        <rect x="51" y="44" width="7" height="5" rx="1" fill="#06b6d4" />
        <rect x="60" y="44" width="7" height="5" rx="1" fill="#14b8a6" />
        <rect x="69" y="44" width="8" height="5" rx="1" fill="#10b981" />

        {/* Row 3 (Spacebar) */}
        <rect x="23" y="51" width="10" height="6" rx="1" fill="#ef4444" />
        <rect x="35" y="51" width="28" height="6" rx="1.5" fill="#06b6d4" />
        <rect x="65" y="51" width="12" height="6" rx="1" fill="#10b981" />
      </svg>
      <span className="absolute bottom-1 right-2 text-[9px] font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
        RGB KEYBOARD
      </span>
    </div>
  );
}
