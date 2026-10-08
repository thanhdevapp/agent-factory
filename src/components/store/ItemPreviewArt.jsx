"use client";
import React from "react";

export function SkinPreview({ skinId }) {

    if (skinId === "skin_0") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(0, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(0, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(0, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_0" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(0, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_0" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(0, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(0, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(0, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(0, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(0, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(0, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(0, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(0, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(0, 70%, 50%)', backgroundColor: 'hsl(0, 70%, 50%)15', borderColor: 'hsl(0, 70%, 50%)50' }}>
            Classic
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_1") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(12, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(12, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(12, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(12, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_1" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(12, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(12, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(12, 70%, 50%)" strokeWidth="2" />
            <polygon points="20,24 32,4 44,20" fill="hsl(12, 70%, 50%)" stroke="#ffffff" strokeWidth="1" />
                <polygon points="56,20 68,4 80,24" fill="hsl(12, 70%, 50%)" stroke="#ffffff" strokeWidth="1" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(12, 70%, 50%)" strokeWidth="1.5" />
                   <path d="M30,39 Q38,34 46,39" stroke="hsl(12, 70%, 50%)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                   <path d="M54,39 Q62,34 70,39" stroke="hsl(12, 70%, 50%)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(12, 70%, 50%)', backgroundColor: 'hsl(12, 70%, 50%)15', borderColor: 'hsl(12, 70%, 50%)50' }}>
            Cat
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_2") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(24, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(24, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(24, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(24, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_2" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(24, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(24, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(24, 70%, 50%)" strokeWidth="2" />
            <path d="M14,30 Q50,16 86,30 L82,42 Q50,30 18,42 Z" fill="hsl(24, 70%, 50%)" opacity="0.9" />
                <path d="M78,44 Q95,48 98,62 Q85,58 74,52 Z" fill="hsl(24, 70%, 50%)" opacity="0.75" />
            <rect x="24" y="33" width="52" height="12" rx="4" fill="#070710" />
                   <line x1="28" y1="39" x2="72" y2="39" stroke="hsl(24, 70%, 50%)" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(24, 70%, 50%)', backgroundColor: 'hsl(24, 70%, 50%)15', borderColor: 'hsl(24, 70%, 50%)50' }}>
            Ninja
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_3") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(36, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(36, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(36, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(36, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_3" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(36, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(36, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(36, 70%, 50%)" strokeWidth="2" />
            <path d="M12,46 Q12,10 50,10 Q88,10 88,46 Q68,52 50,52 Q32,52 12,46 Z" fill="#081820" stroke="hsl(36, 70%, 50%)" strokeWidth="2" />
            <rect x="26" y="28" width="18" height="13" rx="3" fill="hsl(36, 70%, 50%)" />
                   <rect x="56" y="28" width="18" height="13" rx="3" fill="hsl(36, 70%, 50%)" />
                   <circle cx="35" cy="34" r="2.5" fill="#ffffff" />
                   <circle cx="65" cy="34" r="2.5" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(36, 70%, 50%)', backgroundColor: 'hsl(36, 70%, 50%)15', borderColor: 'hsl(36, 70%, 50%)50' }}>
            Hacker
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_4") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(48, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(48, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(48, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(48, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_4" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(48, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(48, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(48, 70%, 50%)" strokeWidth="2" />
            <line x1="50" y1="4" x2="50" y2="16" stroke="hsl(48, 70%, 50%)" strokeWidth="2.5" />
                <circle cx="50" cy="4" r="4" fill="hsl(48, 70%, 50%)" />
                <rect x="10" y="24" width="6" height="16" rx="2" fill="hsl(48, 70%, 50%)" />
                <rect x="84" y="24" width="6" height="16" rx="2" fill="hsl(48, 70%, 50%)" />
            <polygon points="25,32 75,32 70,46 30,46" fill="#0a0a14" stroke="hsl(48, 70%, 50%)" strokeWidth="1.5" />
                   <polygon points="29,35 71,35 67,43 33,43" fill="hsl(48, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(48, 70%, 50%)', backgroundColor: 'hsl(48, 70%, 50%)15', borderColor: 'hsl(48, 70%, 50%)50' }}>
            Cyborg
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_5") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(60, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(60, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(60, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(60, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_5" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(60, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(60, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(60, 70%, 50%)" strokeWidth="2" />
            <circle cx="50" cy="38" r="32" fill="none" stroke="hsl(60, 70%, 50%)" strokeWidth="2.5" opacity="0.4" />
                <circle cx="50" cy="10" r="5" fill="hsl(60, 70%, 50%)" />
            <ellipse cx="50" cy="38" rx="28" ry="16" fill="#080c18" stroke="hsl(60, 70%, 50%)" strokeWidth="2" />
                   <ellipse cx="50" cy="38" rx="23" ry="11" fill="hsl(60, 70%, 50%)" opacity="0.75" />
                   <path d="M34,32 Q50,26 66,32" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.6" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(60, 70%, 50%)', backgroundColor: 'hsl(60, 70%, 50%)15', borderColor: 'hsl(60, 70%, 50%)50' }}>
            Astronaut
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_6") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(72, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(72, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(72, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(72, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_6" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(72, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(72, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(72, 70%, 50%)" strokeWidth="2" />
            <path d="M14,30 Q50,16 86,30 L82,42 Q50,30 18,42 Z" fill="hsl(72, 70%, 50%)" opacity="0.9" />
                <path d="M78,44 Q95,48 98,62 Q85,58 74,52 Z" fill="hsl(72, 70%, 50%)" opacity="0.75" />
            <rect x="24" y="33" width="52" height="12" rx="4" fill="#070710" />
                   <line x1="28" y1="39" x2="72" y2="39" stroke="hsl(72, 70%, 50%)" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(72, 70%, 50%)', backgroundColor: 'hsl(72, 70%, 50%)15', borderColor: 'hsl(72, 70%, 50%)50' }}>
            Samurai
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_7") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(84, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(84, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(84, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_7" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(84, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_7" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(84, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(84, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(84, 70%, 50%)" strokeWidth="2" />
            <path d="M12,46 Q12,10 50,10 Q88,10 88,46 Q68,52 50,52 Q32,52 12,46 Z" fill="#081820" stroke="hsl(84, 70%, 50%)" strokeWidth="2" />
            <rect x="26" y="28" width="18" height="13" rx="3" fill="hsl(84, 70%, 50%)" />
                   <rect x="56" y="28" width="18" height="13" rx="3" fill="hsl(84, 70%, 50%)" />
                   <circle cx="35" cy="34" r="2.5" fill="#ffffff" />
                   <circle cx="65" cy="34" r="2.5" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(84, 70%, 50%)', backgroundColor: 'hsl(84, 70%, 50%)15', borderColor: 'hsl(84, 70%, 50%)50' }}>
            Ghost
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_8") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(96, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(96, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(96, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_8" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(96, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_8" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(96, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(96, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(96, 70%, 50%)" strokeWidth="2" />
            <line x1="50" y1="4" x2="50" y2="16" stroke="hsl(96, 70%, 50%)" strokeWidth="2.5" />
                <circle cx="50" cy="4" r="4" fill="hsl(96, 70%, 50%)" />
                <rect x="10" y="24" width="6" height="16" rx="2" fill="hsl(96, 70%, 50%)" />
                <rect x="84" y="24" width="6" height="16" rx="2" fill="hsl(96, 70%, 50%)" />
            <polygon points="25,32 75,32 70,46 30,46" fill="#0a0a14" stroke="hsl(96, 70%, 50%)" strokeWidth="1.5" />
                   <polygon points="29,35 71,35 67,43 33,43" fill="hsl(96, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(96, 70%, 50%)', backgroundColor: 'hsl(96, 70%, 50%)15', borderColor: 'hsl(96, 70%, 50%)50' }}>
            Mecha
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_9") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(108, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(108, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(108, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_9" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(108, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_9" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(108, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(108, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(108, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(108, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(108, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(108, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(108, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(108, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(108, 70%, 50%)', backgroundColor: 'hsl(108, 70%, 50%)15', borderColor: 'hsl(108, 70%, 50%)50' }}>
            Steampunk
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_10") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(120, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(120, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(120, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_10" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(120, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_10" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(120, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(120, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(120, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(120, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(120, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(120, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(120, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(120, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(120, 70%, 50%)', backgroundColor: 'hsl(120, 70%, 50%)15', borderColor: 'hsl(120, 70%, 50%)50' }}>
            Neon Punk
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_11") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(132, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(132, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(132, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_11" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(132, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_11" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(132, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(132, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(132, 70%, 50%)" strokeWidth="2" />
            <path d="M12,46 Q12,10 50,10 Q88,10 88,46 Q68,52 50,52 Q32,52 12,46 Z" fill="#081820" stroke="hsl(132, 70%, 50%)" strokeWidth="2" />
            <rect x="26" y="28" width="18" height="13" rx="3" fill="hsl(132, 70%, 50%)" />
                   <rect x="56" y="28" width="18" height="13" rx="3" fill="hsl(132, 70%, 50%)" />
                   <circle cx="35" cy="34" r="2.5" fill="#ffffff" />
                   <circle cx="65" cy="34" r="2.5" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(132, 70%, 50%)', backgroundColor: 'hsl(132, 70%, 50%)15', borderColor: 'hsl(132, 70%, 50%)50' }}>
            Void Walker
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_12") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(144, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(144, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(144, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_12" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(144, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_12" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(144, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(144, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(144, 70%, 50%)" strokeWidth="2" />
            <path d="M12,46 Q12,10 50,10 Q88,10 88,46 Q68,52 50,52 Q32,52 12,46 Z" fill="#081820" stroke="hsl(144, 70%, 50%)" strokeWidth="2" />
            <rect x="26" y="28" width="18" height="13" rx="3" fill="hsl(144, 70%, 50%)" />
                   <rect x="56" y="28" width="18" height="13" rx="3" fill="hsl(144, 70%, 50%)" />
                   <circle cx="35" cy="34" r="2.5" fill="#ffffff" />
                   <circle cx="65" cy="34" r="2.5" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(144, 70%, 50%)', backgroundColor: 'hsl(144, 70%, 50%)15', borderColor: 'hsl(144, 70%, 50%)50' }}>
            Glitch
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_13") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(156, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(156, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(156, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_13" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(156, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_13" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(156, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(156, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(156, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(156, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(156, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(156, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(156, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(156, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(156, 70%, 50%)', backgroundColor: 'hsl(156, 70%, 50%)15', borderColor: 'hsl(156, 70%, 50%)50' }}>
            Vampire
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_14") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(168, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(168, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(168, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_14" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(168, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_14" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(168, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(168, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(168, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(168, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(168, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(168, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(168, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(168, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(168, 70%, 50%)', backgroundColor: 'hsl(168, 70%, 50%)15', borderColor: 'hsl(168, 70%, 50%)50' }}>
            Zombie
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_15") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(180, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(180, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(180, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_15" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(180, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_15" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(180, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(180, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(180, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(180, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(180, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(180, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(180, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(180, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(180, 70%, 50%)', backgroundColor: 'hsl(180, 70%, 50%)15', borderColor: 'hsl(180, 70%, 50%)50' }}>
            Pirate
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_16") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(192, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(192, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(192, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_16" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(192, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_16" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(192, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(192, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(192, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(192, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(192, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(192, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(192, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(192, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(192, 70%, 50%)', backgroundColor: 'hsl(192, 70%, 50%)15', borderColor: 'hsl(192, 70%, 50%)50' }}>
            Knight
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_17") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(204, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(204, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(204, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_17" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(204, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_17" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(204, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(204, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(204, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(204, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(204, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(204, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(204, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(204, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(204, 70%, 50%)', backgroundColor: 'hsl(204, 70%, 50%)15', borderColor: 'hsl(204, 70%, 50%)50' }}>
            Mage
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_18") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(216, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(216, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(216, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_18" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(216, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_18" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(216, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(216, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(216, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(216, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(216, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(216, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(216, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(216, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(216, 70%, 50%)', backgroundColor: 'hsl(216, 70%, 50%)15', borderColor: 'hsl(216, 70%, 50%)50' }}>
            Alien
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_19") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(228, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(228, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(228, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_19" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(228, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_19" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(228, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(228, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(228, 70%, 50%)" strokeWidth="2" />
            <line x1="50" y1="4" x2="50" y2="16" stroke="hsl(228, 70%, 50%)" strokeWidth="2.5" />
                <circle cx="50" cy="4" r="4" fill="hsl(228, 70%, 50%)" />
                <rect x="10" y="24" width="6" height="16" rx="2" fill="hsl(228, 70%, 50%)" />
                <rect x="84" y="24" width="6" height="16" rx="2" fill="hsl(228, 70%, 50%)" />
            <polygon points="25,32 75,32 70,46 30,46" fill="#0a0a14" stroke="hsl(228, 70%, 50%)" strokeWidth="1.5" />
                   <polygon points="29,35 71,35 67,43 33,43" fill="hsl(228, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(228, 70%, 50%)', backgroundColor: 'hsl(228, 70%, 50%)15', borderColor: 'hsl(228, 70%, 50%)50' }}>
            Robot
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_20") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(240, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(240, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(240, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_20" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(240, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_20" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(240, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(240, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(240, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(240, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(240, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(240, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(240, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(240, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(240, 70%, 50%)', backgroundColor: 'hsl(240, 70%, 50%)15', borderColor: 'hsl(240, 70%, 50%)50' }}>
            Demon
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_21") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(252, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(252, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(252, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_21" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(252, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_21" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(252, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(252, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(252, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(252, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(252, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(252, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(252, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(252, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(252, 70%, 50%)', backgroundColor: 'hsl(252, 70%, 50%)15', borderColor: 'hsl(252, 70%, 50%)50' }}>
            Angel
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_22") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(264, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(264, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(264, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_22" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(264, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_22" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(264, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(264, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(264, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(264, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(264, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(264, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(264, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(264, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(264, 70%, 50%)', backgroundColor: 'hsl(264, 70%, 50%)15', borderColor: 'hsl(264, 70%, 50%)50' }}>
            Dragon
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_23") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(276, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(276, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(276, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_23" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(276, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_23" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(276, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(276, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(276, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(276, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(276, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(276, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(276, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(276, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(276, 70%, 50%)', backgroundColor: 'hsl(276, 70%, 50%)15', borderColor: 'hsl(276, 70%, 50%)50' }}>
            Phoenix
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_24") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(288, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(288, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(288, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_24" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(288, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_24" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(288, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(288, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(288, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(288, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(288, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(288, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(288, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(288, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(288, 70%, 50%)', backgroundColor: 'hsl(288, 70%, 50%)15', borderColor: 'hsl(288, 70%, 50%)50' }}>
            Elf
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_25") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(300, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(300, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(300, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_25" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(300, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_25" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(300, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(300, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(300, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(300, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(300, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(300, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(300, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(300, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(300, 70%, 50%)', backgroundColor: 'hsl(300, 70%, 50%)15', borderColor: 'hsl(300, 70%, 50%)50' }}>
            Orc
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_26") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(312, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(312, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(312, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_26" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(312, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_26" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(312, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(312, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(312, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(312, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(312, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(312, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(312, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(312, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(312, 70%, 50%)', backgroundColor: 'hsl(312, 70%, 50%)15', borderColor: 'hsl(312, 70%, 50%)50' }}>
            Goblin
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_27") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(324, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(324, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(324, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_27" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(324, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_27" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(324, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(324, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(324, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(324, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(324, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(324, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(324, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(324, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(324, 70%, 50%)', backgroundColor: 'hsl(324, 70%, 50%)15', borderColor: 'hsl(324, 70%, 50%)50' }}>
            Slime
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_28") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(336, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(336, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(336, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_28" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(336, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_28" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(336, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(336, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(336, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(336, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(336, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(336, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(336, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(336, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(336, 70%, 50%)', backgroundColor: 'hsl(336, 70%, 50%)15', borderColor: 'hsl(336, 70%, 50%)50' }}>
            Fairy
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_29") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: 'hsl(348, 70%, 50%)50' }}>
          <div className="absolute inset-0 bg-radial from-[hsl(348, 70%, 50%)15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px hsl(348, 70%, 50%)60)' }}>
            
  <defs>
    <linearGradient id="grad-skin_29" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(348, 70%, 50%)" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <filter id="glow-grad-skin_29" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="hsl(348, 70%, 50%)" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="hsl(348, 70%, 50%)" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="hsl(348, 70%, 50%)" strokeWidth="2" />
            <rect x="42" y="8" width="16" height="8" rx="3" fill="hsl(348, 70%, 50%)" />
                <circle cx="16" cy="38" r="4" fill="hsl(348, 70%, 50%)" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="hsl(348, 70%, 50%)" opacity="0.7" />
            <rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="hsl(348, 70%, 50%)" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="hsl(348, 70%, 50%)" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: 'hsl(348, 70%, 50%)', backgroundColor: 'hsl(348, 70%, 50%)15', borderColor: 'hsl(348, 70%, 50%)50' }}>
            Mermaid
          </span>
        </div>
      );
    }
  
  return <div className="w-full h-28 rounded-xl bg-[#181818] border border-[#333333] flex items-center justify-center text-slate-500 text-xs font-mono">NO SKIN</div>;
}

export function PropPreview({ propId }) {

    if (propId === "prop_0") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#f59e0b40' }}>
          <div className="absolute inset-0 bg-radial from-[#f59e0b12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #f59e0b50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#f59e0b" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#f59e0b" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#f59e0b" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#f59e0b" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#f59e0b" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 26)">
        <rect x="4" y="10" width="28" height="34" rx="4" fill="#2d2838" stroke="#f59e0b" strokeWidth="1.5" />
        <rect x="8" y="14" width="20" height="8" rx="2" fill="#0f0c1a" />
        <circle cx="12" cy="18" r="1.5" fill="#10b981" />
        <circle cx="18" cy="18" r="1.5" fill="#ef4444" />
        
        <rect x="12" y="24" width="12" height="4" rx="1" fill="#475569" />
        <rect x="13" y="32" width="10" height="10" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
        
        <path d="M16,28 Q18,24 16,20 Q14,16 17,12" stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.8" strokeLinecap="round" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#f59e0b', backgroundColor: '#f59e0b15', borderColor: '#f59e0b50' }}>
            Espresso Machine
          </span>
        </div>
      );
    }
  
    if (propId === "prop_1") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#10b98140' }}>
          <div className="absolute inset-0 bg-radial from-[#10b98112] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #10b98150)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#10b981" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#10b981" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#10b981" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#10b981" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#10b981" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 24)">
        <polygon points="6,38 30,38 27,48 9,48" fill="#78350f" stroke="#b45309" strokeWidth="1.5" />
        <path d="M18,38 Q18,28 14,24 Q24,20 22,12" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="14" cy="18" rx="10" ry="6" fill="#10b981" />
        <ellipse cx="26" cy="14" rx="9" ry="5.5" fill="#34d399" />
        <ellipse cx="20" cy="24" rx="7" ry="4.5" fill="#059669" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#10b981', backgroundColor: '#10b98115', borderColor: '#10b98150' }}>
            Bonsai Tree
          </span>
        </div>
      );
    }
  
    if (propId === "prop_2") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#a855f740' }}>
          <div className="absolute inset-0 bg-radial from-[#a855f712] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #a855f750)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#a855f7" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#a855f7" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#a855f7" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#a855f7" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#a855f7" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(50, 32)">
        <polygon points="0,20 38,12 44,32 6,40" fill="#1e1e2d" stroke="#a855f7" strokeWidth="1.5" />
        
        <line x1="6" y1="20" x2="36" y2="14" stroke="#ec4899" strokeWidth="3" strokeDasharray="3 2" />
        <line x1="8" y1="26" x2="38" y2="20" stroke="#06b6d4" strokeWidth="3" strokeDasharray="3 2" />
        <line x1="10" y1="32" x2="40" y2="26" stroke="#eab308" strokeWidth="3" strokeDasharray="3 2" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#a855f7', backgroundColor: '#a855f715', borderColor: '#a855f750' }}>
            RGB Keyboard
          </span>
        </div>
      );
    }
  
    if (propId === "prop_3") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#06b6d440' }}>
          <div className="absolute inset-0 bg-radial from-[#06b6d412] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #06b6d450)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#06b6d4" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#06b6d4" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#06b6d4" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#06b6d4" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#06b6d4" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 18)">
        <rect x="4" y="6" width="28" height="48" rx="3" fill="#161824" stroke="#06b6d4" strokeWidth="1.5" />
        <rect x="8" y="10" width="20" height="8" rx="2" fill="#222538" />
        <circle cx="12" cy="14" r="1.5" fill="#22c55e" />
        <circle cx="16" cy="14" r="1.5" fill="#38bdf8" />
        <rect x="8" y="22" width="20" height="8" rx="2" fill="#222538" />
        <circle cx="12" cy="26" r="1.5" fill="#22c55e" />
        <circle cx="16" cy="26" r="1.5" fill="#f59e0b" />
        <rect x="8" y="34" width="20" height="8" rx="2" fill="#222538" />
        <line x1="12" y1="38" x2="24" y2="38" stroke="#06b6d4" strokeWidth="2" strokeDasharray="2 1" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#06b6d4', backgroundColor: '#06b6d415', borderColor: '#06b6d450' }}>
            Server Rack
          </span>
        </div>
      );
    }
  
    if (propId === "prop_4") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            3D Printer
          </span>
        </div>
      );
    }
  
    if (propId === "prop_5") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#38bdf840' }}>
          <div className="absolute inset-0 bg-radial from-[#38bdf812] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #38bdf850)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#38bdf8" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#38bdf8" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#38bdf8" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#38bdf8" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#38bdf8" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 16)">
        <ellipse cx="18" cy="46" rx="14" ry="5" fill="#1f2937" stroke="#38bdf8" strokeWidth="1.5" />
        <polygon points="18,44 6,18 30,18" fill="#38bdf8" opacity="0.25" />
        
        <polygon points="18,10 26,14 18,18 10,14" fill="#38bdf8" opacity="0.9" />
        <polygon points="10,14 18,18 18,26 10,22" fill="#0284c7" opacity="0.9" />
        <polygon points="26,14 18,18 18,26 26,22" fill="#0369a1" opacity="0.9" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#38bdf8', backgroundColor: '#38bdf815', borderColor: '#38bdf850' }}>
            Holographic Projector
          </span>
        </div>
      );
    }
  
    if (propId === "prop_6") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#ec489940' }}>
          <div className="absolute inset-0 bg-radial from-[#ec489912] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #ec489950)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#ec4899" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#ec4899" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#ec4899" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#ec4899" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#ec4899" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 18)">
        <polygon points="6,48 28,48 28,6 10,6 6,18" fill="#181828" stroke="#ec4899" strokeWidth="1.5" />
        <rect x="10" y="8" width="16" height="6" fill="#ec4899" />
        <rect x="10" y="18" width="15" height="12" rx="2" fill="#090514" stroke="#8b5cf6" strokeWidth="1" />
        <circle cx="15" cy="24" r="2" fill="#22c55e" />
        <circle cx="16" cy="35" r="2.5" fill="#ef4444" />
        <line x1="16" y1="35" x2="16" y2="39" stroke="#cbd5e1" strokeWidth="2" />
        <circle cx="22" cy="37" r="1.5" fill="#eab308" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#ec4899', backgroundColor: '#ec489915', borderColor: '#ec489950' }}>
            Retro Arcade
          </span>
        </div>
      );
    }
  
    if (propId === "prop_7") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#f9731640' }}>
          <div className="absolute inset-0 bg-radial from-[#f9731612] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #f9731650)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#f97316" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#f97316" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#f97316" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#f97316" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#f97316" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(60, 20)">
        <polygon points="8,46 22,46 20,40 10,40" fill="#334155" />
        <path d="M10,40 Q8,24 12,14 Q15,6 15,6 Q15,6 18,14 Q22,24 20,40 Z" fill="#7c2d12" stroke="#f97316" strokeWidth="1.5" />
        <circle cx="15" cy="34" r="3.5" fill="#f97316" opacity="0.9" />
        <circle cx="14" cy="24" r="2.5" fill="#f97316" opacity="0.9" />
        <circle cx="16" cy="16" r="1.8" fill="#f97316" opacity="0.9" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#f97316', backgroundColor: '#f9731615', borderColor: '#f9731650' }}>
            Lava Lamp
          </span>
        </div>
      );
    }
  
    if (propId === "prop_8") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#10b98140' }}>
          <div className="absolute inset-0 bg-radial from-[#10b98112] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #10b98150)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#10b981" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#10b981" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#10b981" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#10b981" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#10b981" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(52, 22)">
        <ellipse cx="20" cy="22" rx="8" ry="5" fill="#1f2937" stroke="#10b981" strokeWidth="1.5" />
        <line x1="12" y1="18" x2="4" y2="12" stroke="#475569" strokeWidth="2" />
        <line x1="28" y1="18" x2="36" y2="12" stroke="#475569" strokeWidth="2" />
        <ellipse cx="4" cy="12" rx="6" ry="2" fill="#10b981" opacity="0.8" />
        <ellipse cx="36" cy="12" rx="6" ry="2" fill="#10b981" opacity="0.8" />
        <circle cx="20" cy="23" r="2.5" fill="#38bdf8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#10b981', backgroundColor: '#10b98115', borderColor: '#10b98150' }}>
            Drone Station
          </span>
        </div>
      );
    }
  
    if (propId === "prop_9") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#8b5cf640' }}>
          <div className="absolute inset-0 bg-radial from-[#8b5cf612] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #8b5cf650)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#8b5cf6" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#8b5cf6" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#8b5cf6" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#8b5cf6" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#8b5cf6" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 28)">
        <rect x="6" y="12" width="28" height="16" rx="6" fill="#1e1e2d" stroke="#8b5cf6" strokeWidth="2" />
        <path d="M10,18 Q16,24 22,18 Q28,24 30,18" stroke="#8b5cf6" strokeWidth="2" fill="none" />
        <line x1="2" y1="20" x2="6" y2="20" stroke="#64748b" strokeWidth="3" />
        <line x1="34" y1="20" x2="38" y2="20" stroke="#64748b" strokeWidth="3" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#8b5cf6', backgroundColor: '#8b5cf615', borderColor: '#8b5cf650' }}>
            VR Headset
          </span>
        </div>
      );
    }
  
    if (propId === "prop_10") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#10b98140' }}>
          <div className="absolute inset-0 bg-radial from-[#10b98112] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #10b98150)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#10b981" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#10b981" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#10b981" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#10b981" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#10b981" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 24)">
        <polygon points="6,38 30,38 27,48 9,48" fill="#78350f" stroke="#b45309" strokeWidth="1.5" />
        <path d="M18,38 Q18,28 14,24 Q24,20 22,12" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="14" cy="18" rx="10" ry="6" fill="#10b981" />
        <ellipse cx="26" cy="14" rx="9" ry="5.5" fill="#34d399" />
        <ellipse cx="20" cy="24" rx="7" ry="4.5" fill="#059669" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#10b981', backgroundColor: '#10b98115', borderColor: '#10b98150' }}>
            Smart Plant
          </span>
        </div>
      );
    }
  
    if (propId === "prop_11") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#3b82f640' }}>
          <div className="absolute inset-0 bg-radial from-[#3b82f612] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #3b82f650)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#3b82f6" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#3b82f6" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#3b82f6" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#3b82f6" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#3b82f6" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(52, 22)">
        <rect x="4" y="6" width="34" height="24" rx="3" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
        
        <line x1="8" y1="12" x2="20" y2="12" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="17" x2="28" y2="17" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="22" x2="24" y2="22" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
        
        <rect x="19" y="30" width="4" height="8" fill="#475569" />
        <ellipse cx="21" cy="38" rx="10" ry="3" fill="#334155" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#3b82f6', backgroundColor: '#3b82f615', borderColor: '#3b82f650' }}>
            Dual Monitors
          </span>
        </div>
      );
    }
  
    if (propId === "prop_12") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#3b82f640' }}>
          <div className="absolute inset-0 bg-radial from-[#3b82f612] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #3b82f650)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#3b82f6" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#3b82f6" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#3b82f6" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#3b82f6" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#3b82f6" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(52, 22)">
        <rect x="4" y="6" width="34" height="24" rx="3" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
        
        <line x1="8" y1="12" x2="20" y2="12" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="17" x2="28" y2="17" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="22" x2="24" y2="22" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
        
        <rect x="19" y="30" width="4" height="8" fill="#475569" />
        <ellipse cx="21" cy="38" rx="10" ry="3" fill="#334155" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#3b82f6', backgroundColor: '#3b82f615', borderColor: '#3b82f650' }}>
            CRT TV
          </span>
        </div>
      );
    }
  
    if (propId === "prop_13") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#06b6d440' }}>
          <div className="absolute inset-0 bg-radial from-[#06b6d412] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #06b6d450)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#06b6d4" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#06b6d4" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#06b6d4" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#06b6d4" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#06b6d4" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 18)">
        <rect x="8" y="4" width="26" height="6" rx="2" fill="#e2e8f0" />
        <line x1="14" y1="10" x2="14" y2="38" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="21" y1="10" x2="21" y2="38" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="28" y1="10" x2="28" y2="38" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="21" cy="38" r="8" fill="#0e7490" stroke="#06b6d4" strokeWidth="2" />
        <circle cx="21" cy="38" r="3" fill="#ffffff" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#06b6d4', backgroundColor: '#06b6d415', borderColor: '#06b6d450' }}>
            Quantum Computer
          </span>
        </div>
      );
    }
  
    if (propId === "prop_14") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Oscilloscope
          </span>
        </div>
      );
    }
  
    if (propId === "prop_15") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#06b6d440' }}>
          <div className="absolute inset-0 bg-radial from-[#06b6d412] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #06b6d450)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#06b6d4" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#06b6d4" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#06b6d4" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#06b6d4" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#06b6d4" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 18)">
        <rect x="8" y="4" width="26" height="6" rx="2" fill="#e2e8f0" />
        <line x1="14" y1="10" x2="14" y2="38" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="21" y1="10" x2="21" y2="38" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="28" y1="10" x2="28" y2="38" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="21" cy="38" r="8" fill="#0e7490" stroke="#06b6d4" strokeWidth="2" />
        <circle cx="21" cy="38" r="3" fill="#ffffff" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#06b6d4', backgroundColor: '#06b6d415', borderColor: '#06b6d450' }}>
            Turing Machine
          </span>
        </div>
      );
    }
  
    if (propId === "prop_16") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#06b6d440' }}>
          <div className="absolute inset-0 bg-radial from-[#06b6d412] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #06b6d450)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#06b6d4" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#06b6d4" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#06b6d4" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#06b6d4" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#06b6d4" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 18)">
        <rect x="4" y="6" width="28" height="48" rx="3" fill="#161824" stroke="#06b6d4" strokeWidth="1.5" />
        <rect x="8" y="10" width="20" height="8" rx="2" fill="#222538" />
        <circle cx="12" cy="14" r="1.5" fill="#22c55e" />
        <circle cx="16" cy="14" r="1.5" fill="#38bdf8" />
        <rect x="8" y="22" width="20" height="8" rx="2" fill="#222538" />
        <circle cx="12" cy="26" r="1.5" fill="#22c55e" />
        <circle cx="16" cy="26" r="1.5" fill="#f59e0b" />
        <rect x="8" y="34" width="20" height="8" rx="2" fill="#222538" />
        <line x1="12" y1="38" x2="24" y2="38" stroke="#06b6d4" strokeWidth="2" strokeDasharray="2 1" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#06b6d4', backgroundColor: '#06b6d415', borderColor: '#06b6d450' }}>
            Crypto Miner
          </span>
        </div>
      );
    }
  
    if (propId === "prop_17") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Gaming Mouse
          </span>
        </div>
      );
    }
  
    if (propId === "prop_18") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Webcam
          </span>
        </div>
      );
    }
  
    if (propId === "prop_19") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#f43f5e40' }}>
          <div className="absolute inset-0 bg-radial from-[#f43f5e12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #f43f5e50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#f43f5e" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#f43f5e" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#f43f5e" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#f43f5e" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#f43f5e" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 20)">
        <rect x="8" y="10" width="18" height="28" rx="6" fill="#1e1e2d" stroke="#f43f5e" strokeWidth="2" />
        <circle cx="17" cy="22" r="5" fill="#334155" stroke="#f43f5e" strokeWidth="1" />
        <circle cx="17" cy="32" r="2.5" fill="#334155" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#f43f5e', backgroundColor: '#f43f5e15', borderColor: '#f43f5e50' }}>
            Microphone
          </span>
        </div>
      );
    }
  
    if (propId === "prop_20") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#f43f5e40' }}>
          <div className="absolute inset-0 bg-radial from-[#f43f5e12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #f43f5e50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#f43f5e" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#f43f5e" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#f43f5e" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#f43f5e" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#f43f5e" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 20)">
        <rect x="8" y="10" width="18" height="28" rx="6" fill="#1e1e2d" stroke="#f43f5e" strokeWidth="2" />
        <circle cx="17" cy="22" r="5" fill="#334155" stroke="#f43f5e" strokeWidth="1" />
        <circle cx="17" cy="32" r="2.5" fill="#334155" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#f43f5e', backgroundColor: '#f43f5e15', borderColor: '#f43f5e50' }}>
            Headphones
          </span>
        </div>
      );
    }
  
    if (propId === "prop_21") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Drawing Tablet
          </span>
        </div>
      );
    }
  
    if (propId === "prop_22") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#f43f5e40' }}>
          <div className="absolute inset-0 bg-radial from-[#f43f5e12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #f43f5e50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#f43f5e" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#f43f5e" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#f43f5e" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#f43f5e" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#f43f5e" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 20)">
        <rect x="8" y="10" width="18" height="28" rx="6" fill="#1e1e2d" stroke="#f43f5e" strokeWidth="2" />
        <circle cx="17" cy="22" r="5" fill="#334155" stroke="#f43f5e" strokeWidth="1" />
        <circle cx="17" cy="32" r="2.5" fill="#334155" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#f43f5e', backgroundColor: '#f43f5e15', borderColor: '#f43f5e50' }}>
            Smart Speaker
          </span>
        </div>
      );
    }
  
    if (propId === "prop_23") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            E-Reader
          </span>
        </div>
      );
    }
  
    if (propId === "prop_24") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smartwatch
          </span>
        </div>
      );
    }
  
    if (propId === "prop_25") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Fitness Tracker
          </span>
        </div>
      );
    }
  
    if (propId === "prop_26") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Action Camera
          </span>
        </div>
      );
    }
  
    if (propId === "prop_27") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#10b98140' }}>
          <div className="absolute inset-0 bg-radial from-[#10b98112] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #10b98150)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#10b981" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#10b981" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#10b981" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#10b981" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#10b981" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(52, 22)">
        <ellipse cx="20" cy="22" rx="8" ry="5" fill="#1f2937" stroke="#10b981" strokeWidth="1.5" />
        <line x1="12" y1="18" x2="4" y2="12" stroke="#475569" strokeWidth="2" />
        <line x1="28" y1="18" x2="36" y2="12" stroke="#475569" strokeWidth="2" />
        <ellipse cx="4" cy="12" rx="6" ry="2" fill="#10b981" opacity="0.8" />
        <ellipse cx="36" cy="12" rx="6" ry="2" fill="#10b981" opacity="0.8" />
        <circle cx="20" cy="23" r="2.5" fill="#38bdf8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#10b981', backgroundColor: '#10b98115', borderColor: '#10b98150' }}>
            Drone
          </span>
        </div>
      );
    }
  
    if (propId === "prop_28") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Electric Skateboard
          </span>
        </div>
      );
    }
  
    if (propId === "prop_29") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Hoverboard
          </span>
        </div>
      );
    }
  
    if (propId === "prop_30") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Robot Vacuum
          </span>
        </div>
      );
    }
  
    if (propId === "prop_31") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Lock
          </span>
        </div>
      );
    }
  
    if (propId === "prop_32") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Thermostat
          </span>
        </div>
      );
    }
  
    if (propId === "prop_33") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Bulb
          </span>
        </div>
      );
    }
  
    if (propId === "prop_34") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Plug
          </span>
        </div>
      );
    }
  
    if (propId === "prop_35") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Mirror
          </span>
        </div>
      );
    }
  
    if (propId === "prop_36") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Scale
          </span>
        </div>
      );
    }
  
    if (propId === "prop_37") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Water Bottle
          </span>
        </div>
      );
    }
  
    if (propId === "prop_38") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Mug
          </span>
        </div>
      );
    }
  
    if (propId === "prop_39") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Notebook
          </span>
        </div>
      );
    }
  
    if (propId === "prop_40") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Pen
          </span>
        </div>
      );
    }
  
    if (propId === "prop_41") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#8b5cf640' }}>
          <div className="absolute inset-0 bg-radial from-[#8b5cf612] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #8b5cf650)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#8b5cf6" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#8b5cf6" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#8b5cf6" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#8b5cf6" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#8b5cf6" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 28)">
        <rect x="6" y="12" width="28" height="16" rx="6" fill="#1e1e2d" stroke="#8b5cf6" strokeWidth="2" />
        <path d="M10,18 Q16,24 22,18 Q28,24 30,18" stroke="#8b5cf6" strokeWidth="2" fill="none" />
        <line x1="2" y1="20" x2="6" y2="20" stroke="#64748b" strokeWidth="3" />
        <line x1="34" y1="20" x2="38" y2="20" stroke="#64748b" strokeWidth="3" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#8b5cf6', backgroundColor: '#8b5cf615', borderColor: '#8b5cf650' }}>
            Smart Glasses
          </span>
        </div>
      );
    }
  
    if (propId === "prop_42") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Ring
          </span>
        </div>
      );
    }
  
    if (propId === "prop_43") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Belt
          </span>
        </div>
      );
    }
  
    if (propId === "prop_44") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Shoe
          </span>
        </div>
      );
    }
  
    if (propId === "prop_45") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Backpack
          </span>
        </div>
      );
    }
  
    if (propId === "prop_46") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Umbrella
          </span>
        </div>
      );
    }
  
    if (propId === "prop_47") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Wallet
          </span>
        </div>
      );
    }
  
    if (propId === "prop_48") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Keychain
          </span>
        </div>
      );
    }
  
    if (propId === "prop_49") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '#00f0ff40' }}>
          <div className="absolute inset-0 bg-radial from-[#00f0ff12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #00f0ff50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#00f0ff" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#00f0ff" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#00f0ff" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#00f0ff" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="#00f0ff" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="#00f0ff" opacity="0.8" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#00f0ff', backgroundColor: '#00f0ff15', borderColor: '#00f0ff50' }}>
            Smart Tag
          </span>
        </div>
      );
    }
  
  return <div className="w-full h-28 rounded-xl bg-[#181818] border border-[#333333] flex items-center justify-center text-slate-500 text-xs font-mono">NO PROP</div>;
}

export function PetPreview({ petId }) {

    if (petId === "pet_0") {
      return (
        <div className="w-full h-28 rounded-xl bg-[#181818] border border-[#333333] flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 100 80" className="w-24 h-24 opacity-40">
            
    <g transform="translate(30, 20) scale(1)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#64748b" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#64748b" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#64748b" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#64748b" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#64748b" opacity="0.8" />
    </g>
  
            <text x="50" y="74" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">No Pet Equipped</text>
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono text-slate-400 bg-[#252526] px-2 py-0.5 rounded-full border border-[#3e3e42]">EMPTY</span>
        </div>
      );
    }
      
    if (petId === "pet_1") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#f472b640' }}>
          <div className="absolute inset-0 bg-radial from-[#f472b612] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #f472b650)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#f472b6" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#f472b6" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#f472b6" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#f472b6" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#f472b6" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 32)">
        <ellipse cx="20" cy="20" rx="14" ry="10" fill="#f472b6" />
        <circle cx="10" cy="14" r="9" fill="#f472b6" />
        
        <polygon points="4,8 7,1 11,7" fill="#f43f5e" />
        <polygon points="10,7 14,1 17,8" fill="#f43f5e" />
        
        <path d="M6,14 Q8,17 10,14" stroke="#ffffff" strokeWidth="1.5" fill="none" />
        <path d="M12,14 Q14,17 16,14" stroke="#ffffff" strokeWidth="1.5" fill="none" />
        <text x="26" y="10" fill="#f472b6" fontSize="10" fontWeight="bold">Z</text>
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#f472b6', backgroundColor: '#f472b615', borderColor: '#f472b650' }}>
            Sleepy Cat
          </span>
        </div>
      );
    }
  
    if (petId === "pet_2") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#f59e0b40' }}>
          <div className="absolute inset-0 bg-radial from-[#f59e0b12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #f59e0b50)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#f59e0b" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#f59e0b" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#f59e0b" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#f59e0b" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#f59e0b" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 30)">
        <ellipse cx="20" cy="20" rx="15" ry="10" fill="#f59e0b" />
        <circle cx="10" cy="14" r="9" fill="#f59e0b" />
        
        <polygon points="4,8 7,2 11,8" fill="#b45309" />
        <polygon points="11,8 14,2 17,8" fill="#b45309" />
        <circle cx="7" cy="14" r="1.5" fill="#000" />
        <circle cx="13" cy="14" r="1.5" fill="#000" />
        <ellipse cx="10" cy="18" rx="2" ry="1.5" fill="#000" />
        
        <circle cx="33" cy="16" r="3.5" fill="#f59e0b" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#f59e0b', backgroundColor: '#f59e0b15', borderColor: '#f59e0b50' }}>
            Dozing Shiba
          </span>
        </div>
      );
    }
  
    if (petId === "pet_3") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#06b6d440' }}>
          <div className="absolute inset-0 bg-radial from-[#06b6d412] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #06b6d450)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#06b6d4" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#06b6d4" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#06b6d4" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#06b6d4" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#06b6d4" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(58, 28)">
        <ellipse cx="16" cy="22" rx="11" ry="14" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5" />
        
        <circle cx="11" cy="16" r="5" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
        <circle cx="21" cy="16" r="5" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
        <circle cx="11" cy="16" r="2.5" fill="#06b6d4" />
        <circle cx="21" cy="16" r="2.5" fill="#06b6d4" />
        
        <polygon points="14,21 18,21 16,25" fill="#f59e0b" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#06b6d4', backgroundColor: '#06b6d415', borderColor: '#06b6d450' }}>
            Cyber Owl
          </span>
        </div>
      );
    }
  
    if (petId === "pet_4") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#10b98140' }}>
          <div className="absolute inset-0 bg-radial from-[#10b98112] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #10b98150)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#10b981" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#10b981" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#10b981" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#10b981" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#10b981" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 26)">
        <circle cx="18" cy="18" r="10" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
        <ellipse cx="18" cy="18" rx="15" ry="4" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="18" cy="18" r="4" fill="#38bdf8" />
        <line x1="18" y1="28" x2="18" y2="34" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#10b981', backgroundColor: '#10b98115', borderColor: '#10b98150' }}>
            Mini Drone
          </span>
        </div>
      );
    }
  
    if (petId === "pet_5") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#22c55e40' }}>
          <div className="absolute inset-0 bg-radial from-[#22c55e12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #22c55e50)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#22c55e" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#22c55e" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#22c55e" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#22c55e" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#22c55e" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(58, 30)">
        <path d="M6,24 Q6,12 18,10 Q30,12 30,24 Q28,28 18,28 Q8,28 6,24 Z" fill="#22c55e" opacity="0.85" />
        <circle cx="13" cy="18" r="2.5" fill="#042f2e" />
        <circle cx="23" cy="18" r="2.5" fill="#042f2e" />
        <circle cx="14" cy="17" r="1" fill="#ffffff" />
        <circle cx="24" cy="17" r="1" fill="#ffffff" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#22c55e', backgroundColor: '#22c55e15', borderColor: '#22c55e50' }}>
            Slime Blob
          </span>
        </div>
      );
    }
  
    if (petId === "pet_6") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#a855f740' }}>
          <div className="absolute inset-0 bg-radial from-[#a855f712] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #a855f750)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#a855f7" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#a855f7" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#a855f7" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#a855f7" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#a855f7" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 26)">
        <circle cx="18" cy="18" r="12" fill="#0f0c1b" stroke="#a855f7" strokeWidth="2" />
        <circle cx="18" cy="18" r="7" fill="#a855f7" opacity="0.9" />
        <circle cx="18" cy="18" r="3.5" fill="#000000" />
        <circle cx="20" cy="16" r="1.5" fill="#ffffff" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#a855f7', backgroundColor: '#a855f715', borderColor: '#a855f750' }}>
            Floating Eye
          </span>
        </div>
      );
    }
  
    if (petId === "pet_7") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#6366f140' }}>
          <div className="absolute inset-0 bg-radial from-[#6366f112] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #6366f150)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#6366f1" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#6366f1" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#6366f1" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#6366f1" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#6366f1" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 28)">
        <polygon points="6,24 24,14 26,30" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
        <circle cx="12" cy="18" r="6" fill="#1e1b4b" />
        <polygon points="4,18 10,15 10,21" fill="#f59e0b" />
        <circle cx="11" cy="17" r="1.5" fill="#6366f1" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#6366f1', backgroundColor: '#6366f115', borderColor: '#6366f150' }}>
            Cyber Raven
          </span>
        </div>
      );
    }
  
    if (petId === "pet_8") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#f9731640' }}>
          <div className="absolute inset-0 bg-radial from-[#f9731612] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #f9731650)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#f97316" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#f97316" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#f97316" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#f97316" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#f97316" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 30)">
        <ellipse cx="16" cy="18" rx="12" ry="9" fill="#f97316" />
        <polygon points="6,8 9,1 12,8" fill="#ffffff" />
        <polygon points="12,8 15,1 18,8" fill="#ffffff" />
        <circle cx="9" cy="14" r="1.5" fill="#000" />
        <circle cx="15" cy="14" r="1.5" fill="#000" />
        
        <ellipse cx="28" cy="14" rx="8" ry="12" fill="#f97316" transform="rotate(30, 28, 14)" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#f97316', backgroundColor: '#f9731615', borderColor: '#f9731650' }}>
            Hologram Fox
          </span>
        </div>
      );
    }
  
    if (petId === "pet_9") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#f59e0b40' }}>
          <div className="absolute inset-0 bg-radial from-[#f59e0b12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #f59e0b50)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#f59e0b" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#f59e0b" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#f59e0b" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#f59e0b" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#f59e0b" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 30)">
        <ellipse cx="20" cy="20" rx="15" ry="10" fill="#f59e0b" />
        <circle cx="10" cy="14" r="9" fill="#f59e0b" />
        
        <polygon points="4,8 7,2 11,8" fill="#b45309" />
        <polygon points="11,8 14,2 17,8" fill="#b45309" />
        <circle cx="7" cy="14" r="1.5" fill="#000" />
        <circle cx="13" cy="14" r="1.5" fill="#000" />
        <ellipse cx="10" cy="18" rx="2" ry="1.5" fill="#000" />
        
        <circle cx="33" cy="16" r="3.5" fill="#f59e0b" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#f59e0b', backgroundColor: '#f59e0b15', borderColor: '#f59e0b50' }}>
            Corgi
          </span>
        </div>
      );
    }
  
    if (petId === "pet_10") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#14b8a640' }}>
          <div className="absolute inset-0 bg-radial from-[#14b8a612] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #14b8a650)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#14b8a6" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#14b8a6" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#14b8a6" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#14b8a6" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#14b8a6" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 34)">
        <ellipse cx="18" cy="18" rx="14" ry="9" fill="#0f766e" stroke="#14b8a6" strokeWidth="2" />
        <circle cx="6" cy="18" r="4" fill="#14b8a6" />
        <circle cx="5" cy="17" r="1" fill="#000" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#14b8a6', backgroundColor: '#14b8a615', borderColor: '#14b8a650' }}>
            Turtle
          </span>
        </div>
      );
    }
  
    if (petId === "pet_11") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#ec489940' }}>
          <div className="absolute inset-0 bg-radial from-[#ec489912] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #ec489950)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#ec4899" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#ec4899" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#ec4899" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#ec4899" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#ec4899" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 30)">
        <circle cx="18" cy="18" r="11" fill="#ec4899" opacity="0.9" />
        <circle cx="14" cy="16" r="2" fill="#000" />
        <circle cx="22" cy="16" r="2" fill="#000" />
        <ellipse cx="18" cy="22" rx="3" ry="1.5" fill="#ffffff" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#ec4899', backgroundColor: '#ec489915', borderColor: '#ec489950' }}>
            Hamster
          </span>
        </div>
      );
    }
  
    if (petId === "pet_12") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#ec489940' }}>
          <div className="absolute inset-0 bg-radial from-[#ec489912] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #ec489950)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#ec4899" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#ec4899" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#ec4899" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#ec4899" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#ec4899" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 30)">
        <circle cx="18" cy="18" r="11" fill="#ec4899" opacity="0.9" />
        <circle cx="14" cy="16" r="2" fill="#000" />
        <circle cx="22" cy="16" r="2" fill="#000" />
        <ellipse cx="18" cy="22" rx="3" ry="1.5" fill="#ffffff" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#ec4899', backgroundColor: '#ec489915', borderColor: '#ec489950' }}>
            Parrot
          </span>
        </div>
      );
    }
  
    if (petId === "pet_13") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#f9731640' }}>
          <div className="absolute inset-0 bg-radial from-[#f9731612] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #f9731650)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#f97316" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#f97316" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#f97316" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#f97316" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#f97316" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 26)">
        <circle cx="18" cy="18" r="14" fill="#0284c7" opacity="0.3" stroke="#38bdf8" strokeWidth="1.5" />
        <ellipse cx="18" cy="18" rx="8" ry="5" fill="#f97316" />
        <polygon points="24,18 30,12 30,24" fill="#f97316" opacity="0.8" />
        <circle cx="13" cy="17" r="1.5" fill="#000" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#f97316', backgroundColor: '#f9731615', borderColor: '#f9731650' }}>
            Goldfish
          </span>
        </div>
      );
    }
  
    if (petId === "pet_14") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#ec489940' }}>
          <div className="absolute inset-0 bg-radial from-[#ec489912] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #ec489950)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#ec4899" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#ec4899" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#ec4899" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#ec4899" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#ec4899" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 30)">
        <circle cx="18" cy="18" r="11" fill="#ec4899" opacity="0.9" />
        <circle cx="14" cy="16" r="2" fill="#000" />
        <circle cx="22" cy="16" r="2" fill="#000" />
        <ellipse cx="18" cy="22" rx="3" ry="1.5" fill="#ffffff" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#ec4899', backgroundColor: '#ec489915', borderColor: '#ec489950' }}>
            Iguana
          </span>
        </div>
      );
    }
  
    if (petId === "pet_15") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#ec489940' }}>
          <div className="absolute inset-0 bg-radial from-[#ec489912] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #ec489950)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#ec4899" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#ec4899" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#ec4899" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#ec4899" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#ec4899" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 30)">
        <circle cx="18" cy="18" r="11" fill="#ec4899" opacity="0.9" />
        <circle cx="14" cy="16" r="2" fill="#000" />
        <circle cx="22" cy="16" r="2" fill="#000" />
        <ellipse cx="18" cy="22" rx="3" ry="1.5" fill="#ffffff" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#ec4899', backgroundColor: '#ec489915', borderColor: '#ec489950' }}>
            Snake
          </span>
        </div>
      );
    }
  
    if (petId === "pet_16") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#ec489940' }}>
          <div className="absolute inset-0 bg-radial from-[#ec489912] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #ec489950)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#ec4899" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#ec4899" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#ec4899" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#ec4899" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#ec4899" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 30)">
        <circle cx="18" cy="18" r="11" fill="#ec4899" opacity="0.9" />
        <circle cx="14" cy="16" r="2" fill="#000" />
        <circle cx="22" cy="16" r="2" fill="#000" />
        <ellipse cx="18" cy="22" rx="3" ry="1.5" fill="#ffffff" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#ec4899', backgroundColor: '#ec489915', borderColor: '#ec489950' }}>
            Tarantula
          </span>
        </div>
      );
    }
  
    if (petId === "pet_17") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#ec489940' }}>
          <div className="absolute inset-0 bg-radial from-[#ec489912] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #ec489950)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#ec4899" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#ec4899" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#ec4899" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#ec4899" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#ec4899" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 30)">
        <circle cx="18" cy="18" r="11" fill="#ec4899" opacity="0.9" />
        <circle cx="14" cy="16" r="2" fill="#000" />
        <circle cx="22" cy="16" r="2" fill="#000" />
        <ellipse cx="18" cy="22" rx="3" ry="1.5" fill="#ffffff" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#ec4899', backgroundColor: '#ec489915', borderColor: '#ec489950' }}>
            Scorpion
          </span>
        </div>
      );
    }
  
    if (petId === "pet_18") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#ec489940' }}>
          <div className="absolute inset-0 bg-radial from-[#ec489912] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #ec489950)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#ec4899" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#ec4899" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#ec4899" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#ec4899" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#ec4899" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 30)">
        <circle cx="18" cy="18" r="11" fill="#ec4899" opacity="0.9" />
        <circle cx="14" cy="16" r="2" fill="#000" />
        <circle cx="22" cy="16" r="2" fill="#000" />
        <ellipse cx="18" cy="22" rx="3" ry="1.5" fill="#ffffff" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#ec4899', backgroundColor: '#ec489915', borderColor: '#ec489950' }}>
            Frog
          </span>
        </div>
      );
    }
  
    if (petId === "pet_19") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '#ec489940' }}>
          <div className="absolute inset-0 bg-radial from-[#ec489912] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px #ec489950)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            
    <g transform="translate(8, 20) scale(0.9)">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="#ec4899" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="#ec4899" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="#ec4899" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="#ec4899" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="#ec4899" opacity="0.8" />
    </g>
  
            
            
      <g transform="translate(56, 30)">
        <circle cx="18" cy="18" r="11" fill="#ec4899" opacity="0.9" />
        <circle cx="14" cy="16" r="2" fill="#000" />
        <circle cx="22" cy="16" r="2" fill="#000" />
        <ellipse cx="18" cy="22" rx="3" ry="1.5" fill="#ffffff" />
      </g>
    
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '#ec4899', backgroundColor: '#ec489915', borderColor: '#ec489950' }}>
            Salamander
          </span>
        </div>
      );
    }
  
  return <div className="w-full h-28 rounded-xl bg-[#181818] border border-[#333333] flex items-center justify-center text-slate-500 text-xs font-mono">NO PET</div>;
}
