"use client";
import React from "react";

export function SkinPreview({ skinId }) {

    if (skinId === "skin_0") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(0, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(0, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(0, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(0, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(0, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(0, 70%, 50%)', backgroundColor: 'hsl(0, 70%, 50%)20', borderColor: 'hsl(0, 70%, 50%)50' }}>
            Classic
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_1") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(12, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(12, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(12, 70%, 50%)" strokeWidth="1.5" />
            <polygon points="26,30 36,10 46,26" fill="hsl(12, 70%, 50%)" /><polygon points="74,30 64,10 54,26" fill="hsl(12, 70%, 50%)" />
            <rect x="25" y="20" width="50" height="40" rx="18" fill="#1e1035" stroke="hsl(12, 70%, 50%)" strokeWidth="2" />
            <path d="M37,41 Q42,35 47,41" stroke="hsl(12, 70%, 50%)" strokeWidth="2.5" fill="none" />
            <path d="M53,41 Q58,35 63,41" stroke="hsl(12, 70%, 50%)" strokeWidth="2.5" fill="none" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(12, 70%, 50%)', backgroundColor: 'hsl(12, 70%, 50%)20', borderColor: 'hsl(12, 70%, 50%)50' }}>
            Cat
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_2") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(24, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(24, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(24, 70%, 50%)" strokeWidth="1.5" />
            <path d="M68,54 Q85,58 92,70 Q80,68 66,60 Z" fill="hsl(24, 70%, 50%)" opacity="0.8"/>
            <rect x="25" y="20" width="50" height="40" rx="18" fill="#1e1035" stroke="hsl(24, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
            <line x1="36" y1="42.5" x2="64" y2="42.5" stroke="hsl(24, 70%, 50%)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(24, 70%, 50%)', backgroundColor: 'hsl(24, 70%, 50%)20', borderColor: 'hsl(24, 70%, 50%)50' }}>
            Ninja
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_3") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(36, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(36, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(36, 70%, 50%)" strokeWidth="1.5" />
            
            <path d="M22,50 Q22,14 50,14 Q78,14 78,50 Q66,54 50,54 Q34,54 22,50 Z" fill="#022c22" stroke="hsl(36, 70%, 50%)" strokeWidth="2" />
            <rect x="34" y="32" width="13" height="10" rx="3" fill="hsl(36, 70%, 50%)" />
            <rect x="53" y="32" width="13" height="10" rx="3" fill="hsl(36, 70%, 50%)" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(36, 70%, 50%)', backgroundColor: 'hsl(36, 70%, 50%)20', borderColor: 'hsl(36, 70%, 50%)50' }}>
            Hacker
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_4") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(48, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(48, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(48, 70%, 50%)" strokeWidth="1.5" />
            <line x1="50" y1="14" x2="50" y2="24" stroke="hsl(48, 70%, 50%)" strokeWidth="2" /><circle cx="50" cy="12" r="3.5" fill="hsl(48, 70%, 50%)" />
            <rect x="25" y="24" width="50" height="38" rx="8" fill="#1e1e24" stroke="hsl(48, 70%, 50%)" strokeWidth="2" />
            <ellipse cx="40" cy="42" rx="4.5" ry="5" fill="hsl(48, 70%, 50%)" /><ellipse cx="60" cy="42" rx="4.5" ry="5" fill="hsl(48, 70%, 50%)" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(48, 70%, 50%)', backgroundColor: 'hsl(48, 70%, 50%)20', borderColor: 'hsl(48, 70%, 50%)50' }}>
            Cyborg
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_5") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(60, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(60, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(60, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(60, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(60, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(60, 70%, 50%)', backgroundColor: 'hsl(60, 70%, 50%)20', borderColor: 'hsl(60, 70%, 50%)50' }}>
            Astronaut
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_6") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(72, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(72, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(72, 70%, 50%)" strokeWidth="1.5" />
            <path d="M68,54 Q85,58 92,70 Q80,68 66,60 Z" fill="hsl(72, 70%, 50%)" opacity="0.8"/>
            <rect x="25" y="20" width="50" height="40" rx="18" fill="#1e1035" stroke="hsl(72, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
            <line x1="36" y1="42.5" x2="64" y2="42.5" stroke="hsl(72, 70%, 50%)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(72, 70%, 50%)', backgroundColor: 'hsl(72, 70%, 50%)20', borderColor: 'hsl(72, 70%, 50%)50' }}>
            Samurai
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_7") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(84, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(84, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(84, 70%, 50%)" strokeWidth="1.5" />
            
            <path d="M22,50 Q22,14 50,14 Q78,14 78,50 Q66,54 50,54 Q34,54 22,50 Z" fill="#022c22" stroke="hsl(84, 70%, 50%)" strokeWidth="2" />
            <rect x="34" y="32" width="13" height="10" rx="3" fill="hsl(84, 70%, 50%)" />
            <rect x="53" y="32" width="13" height="10" rx="3" fill="hsl(84, 70%, 50%)" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(84, 70%, 50%)', backgroundColor: 'hsl(84, 70%, 50%)20', borderColor: 'hsl(84, 70%, 50%)50' }}>
            Ghost
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_8") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(96, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(96, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(96, 70%, 50%)" strokeWidth="1.5" />
            <line x1="50" y1="14" x2="50" y2="24" stroke="hsl(96, 70%, 50%)" strokeWidth="2" /><circle cx="50" cy="12" r="3.5" fill="hsl(96, 70%, 50%)" />
            <rect x="25" y="24" width="50" height="38" rx="8" fill="#1e1e24" stroke="hsl(96, 70%, 50%)" strokeWidth="2" />
            <ellipse cx="40" cy="42" rx="4.5" ry="5" fill="hsl(96, 70%, 50%)" /><ellipse cx="60" cy="42" rx="4.5" ry="5" fill="hsl(96, 70%, 50%)" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(96, 70%, 50%)', backgroundColor: 'hsl(96, 70%, 50%)20', borderColor: 'hsl(96, 70%, 50%)50' }}>
            Mecha
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_9") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(108, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(108, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(108, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(108, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(108, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(108, 70%, 50%)', backgroundColor: 'hsl(108, 70%, 50%)20', borderColor: 'hsl(108, 70%, 50%)50' }}>
            Steampunk
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_10") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(120, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(120, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(120, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(120, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(120, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(120, 70%, 50%)', backgroundColor: 'hsl(120, 70%, 50%)20', borderColor: 'hsl(120, 70%, 50%)50' }}>
            Neon Punk
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_11") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(132, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(132, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(132, 70%, 50%)" strokeWidth="1.5" />
            
            <path d="M22,50 Q22,14 50,14 Q78,14 78,50 Q66,54 50,54 Q34,54 22,50 Z" fill="#022c22" stroke="hsl(132, 70%, 50%)" strokeWidth="2" />
            <rect x="34" y="32" width="13" height="10" rx="3" fill="hsl(132, 70%, 50%)" />
            <rect x="53" y="32" width="13" height="10" rx="3" fill="hsl(132, 70%, 50%)" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(132, 70%, 50%)', backgroundColor: 'hsl(132, 70%, 50%)20', borderColor: 'hsl(132, 70%, 50%)50' }}>
            Void Walker
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_12") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(144, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(144, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(144, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(144, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(144, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(144, 70%, 50%)', backgroundColor: 'hsl(144, 70%, 50%)20', borderColor: 'hsl(144, 70%, 50%)50' }}>
            Glitch
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_13") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(156, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(156, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(156, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(156, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(156, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(156, 70%, 50%)', backgroundColor: 'hsl(156, 70%, 50%)20', borderColor: 'hsl(156, 70%, 50%)50' }}>
            Vampire
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_14") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(168, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(168, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(168, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(168, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(168, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(168, 70%, 50%)', backgroundColor: 'hsl(168, 70%, 50%)20', borderColor: 'hsl(168, 70%, 50%)50' }}>
            Zombie
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_15") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(180, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(180, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(180, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(180, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(180, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(180, 70%, 50%)', backgroundColor: 'hsl(180, 70%, 50%)20', borderColor: 'hsl(180, 70%, 50%)50' }}>
            Pirate
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_16") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(192, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(192, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(192, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(192, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(192, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(192, 70%, 50%)', backgroundColor: 'hsl(192, 70%, 50%)20', borderColor: 'hsl(192, 70%, 50%)50' }}>
            Knight
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_17") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(204, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(204, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(204, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(204, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(204, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(204, 70%, 50%)', backgroundColor: 'hsl(204, 70%, 50%)20', borderColor: 'hsl(204, 70%, 50%)50' }}>
            Mage
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_18") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(216, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(216, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(216, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(216, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(216, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(216, 70%, 50%)', backgroundColor: 'hsl(216, 70%, 50%)20', borderColor: 'hsl(216, 70%, 50%)50' }}>
            Alien
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_19") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(228, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(228, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(228, 70%, 50%)" strokeWidth="1.5" />
            <line x1="50" y1="14" x2="50" y2="24" stroke="hsl(228, 70%, 50%)" strokeWidth="2" /><circle cx="50" cy="12" r="3.5" fill="hsl(228, 70%, 50%)" />
            <rect x="25" y="24" width="50" height="38" rx="8" fill="#1e1e24" stroke="hsl(228, 70%, 50%)" strokeWidth="2" />
            <ellipse cx="40" cy="42" rx="4.5" ry="5" fill="hsl(228, 70%, 50%)" /><ellipse cx="60" cy="42" rx="4.5" ry="5" fill="hsl(228, 70%, 50%)" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(228, 70%, 50%)', backgroundColor: 'hsl(228, 70%, 50%)20', borderColor: 'hsl(228, 70%, 50%)50' }}>
            Robot
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_20") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(240, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(240, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(240, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(240, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(240, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(240, 70%, 50%)', backgroundColor: 'hsl(240, 70%, 50%)20', borderColor: 'hsl(240, 70%, 50%)50' }}>
            Demon
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_21") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(252, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(252, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(252, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(252, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(252, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(252, 70%, 50%)', backgroundColor: 'hsl(252, 70%, 50%)20', borderColor: 'hsl(252, 70%, 50%)50' }}>
            Angel
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_22") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(264, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(264, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(264, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(264, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(264, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(264, 70%, 50%)', backgroundColor: 'hsl(264, 70%, 50%)20', borderColor: 'hsl(264, 70%, 50%)50' }}>
            Dragon
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_23") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(276, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(276, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(276, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(276, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(276, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(276, 70%, 50%)', backgroundColor: 'hsl(276, 70%, 50%)20', borderColor: 'hsl(276, 70%, 50%)50' }}>
            Phoenix
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_24") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(288, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(288, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(288, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(288, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(288, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(288, 70%, 50%)', backgroundColor: 'hsl(288, 70%, 50%)20', borderColor: 'hsl(288, 70%, 50%)50' }}>
            Elf
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_25") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(300, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(300, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(300, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(300, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(300, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(300, 70%, 50%)', backgroundColor: 'hsl(300, 70%, 50%)20', borderColor: 'hsl(300, 70%, 50%)50' }}>
            Orc
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_26") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(312, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(312, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(312, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(312, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(312, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(312, 70%, 50%)', backgroundColor: 'hsl(312, 70%, 50%)20', borderColor: 'hsl(312, 70%, 50%)50' }}>
            Goblin
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_27") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(324, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(324, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(324, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(324, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(324, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(324, 70%, 50%)', backgroundColor: 'hsl(324, 70%, 50%)20', borderColor: 'hsl(324, 70%, 50%)50' }}>
            Slime
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_28") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(336, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(336, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(336, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(336, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(336, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(336, 70%, 50%)', backgroundColor: 'hsl(336, 70%, 50%)20', borderColor: 'hsl(336, 70%, 50%)50' }}>
            Fairy
          </span>
        </div>
      );
    }
  
    if (skinId === "skin_29") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: 'hsl(348, 70%, 50%)40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px hsl(348, 70%, 50%)50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="hsl(348, 70%, 50%)" strokeWidth="1.5" />
            
            <rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="hsl(348, 70%, 50%)" strokeWidth="2" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="hsl(348, 70%, 50%)" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: 'hsl(348, 70%, 50%)', backgroundColor: 'hsl(348, 70%, 50%)20', borderColor: 'hsl(348, 70%, 50%)50' }}>
            Mermaid
          </span>
        </div>
      );
    }
  
  return <div className="w-full h-24 rounded-lg bg-[#181818] border border-[#333333] flex items-center justify-center text-slate-500 text-xs font-mono">NO SKIN</div>;
}

export function PropPreview({ propId }) {

    if (propId === "prop_0") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Espresso Machine
          </span>
        </div>
      );
    }
  
    if (propId === "prop_1") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#10b98140' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #10b98150)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <polygon points="63,65 77,65 75,75 65,75" fill="#9a3412" stroke="#c2410c" strokeWidth="1" />
               <ellipse cx="70" cy="48" rx="10" ry="6" fill="#10b981" />
               <ellipse cx="76" cy="54" rx="8" ry="4" fill="#10b981" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#10b981', backgroundColor: '#10b98120', borderColor: '#10b98150' }}>
            Bonsai Tree
          </span>
        </div>
      );
    }
  
    if (propId === "prop_2") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#a855f740' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #a855f750)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <rect x="60" y="50" width="30" height="16" rx="2" fill="#1e1e24" stroke="#a855f7" strokeWidth="1" />
               <rect x="62" y="52" width="26" height="4" rx="1" fill="#a855f7" opacity="0.5" />
               <rect x="62" y="58" width="26" height="6" rx="1" fill="#ec4899" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#a855f7', backgroundColor: '#a855f720', borderColor: '#a855f750' }}>
            RGB Keyboard
          </span>
        </div>
      );
    }
  
    if (propId === "prop_3") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Server Rack
          </span>
        </div>
      );
    }
  
    if (propId === "prop_4") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            3D Printer
          </span>
        </div>
      );
    }
  
    if (propId === "prop_5") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Holographic Projector
          </span>
        </div>
      );
    }
  
    if (propId === "prop_6") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Retro Arcade
          </span>
        </div>
      );
    }
  
    if (propId === "prop_7") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Lava Lamp
          </span>
        </div>
      );
    }
  
    if (propId === "prop_8") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Drone Station
          </span>
        </div>
      );
    }
  
    if (propId === "prop_9") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            VR Headset
          </span>
        </div>
      );
    }
  
    if (propId === "prop_10") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#10b98140' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #10b98150)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <polygon points="63,65 77,65 75,75 65,75" fill="#9a3412" stroke="#c2410c" strokeWidth="1" />
               <ellipse cx="70" cy="48" rx="10" ry="6" fill="#10b981" />
               <ellipse cx="76" cy="54" rx="8" ry="4" fill="#10b981" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#10b981', backgroundColor: '#10b98120', borderColor: '#10b98150' }}>
            Smart Plant
          </span>
        </div>
      );
    }
  
    if (propId === "prop_11") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#a855f740' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #a855f750)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <rect x="60" y="50" width="30" height="16" rx="2" fill="#1e1e24" stroke="#a855f7" strokeWidth="1" />
               <rect x="62" y="52" width="26" height="4" rx="1" fill="#a855f7" opacity="0.5" />
               <rect x="62" y="58" width="26" height="6" rx="1" fill="#ec4899" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#a855f7', backgroundColor: '#a855f720', borderColor: '#a855f750' }}>
            Dual Monitors
          </span>
        </div>
      );
    }
  
    if (propId === "prop_12") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#a855f740' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #a855f750)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <rect x="60" y="50" width="30" height="16" rx="2" fill="#1e1e24" stroke="#a855f7" strokeWidth="1" />
               <rect x="62" y="52" width="26" height="4" rx="1" fill="#a855f7" opacity="0.5" />
               <rect x="62" y="58" width="26" height="6" rx="1" fill="#ec4899" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#a855f7', backgroundColor: '#a855f720', borderColor: '#a855f750' }}>
            CRT TV
          </span>
        </div>
      );
    }
  
    if (propId === "prop_13") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#a855f740' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #a855f750)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <rect x="60" y="50" width="30" height="16" rx="2" fill="#1e1e24" stroke="#a855f7" strokeWidth="1" />
               <rect x="62" y="52" width="26" height="4" rx="1" fill="#a855f7" opacity="0.5" />
               <rect x="62" y="58" width="26" height="6" rx="1" fill="#ec4899" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#a855f7', backgroundColor: '#a855f720', borderColor: '#a855f750' }}>
            Quantum Computer
          </span>
        </div>
      );
    }
  
    if (propId === "prop_14") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Oscilloscope
          </span>
        </div>
      );
    }
  
    if (propId === "prop_15") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Turing Machine
          </span>
        </div>
      );
    }
  
    if (propId === "prop_16") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Crypto Miner
          </span>
        </div>
      );
    }
  
    if (propId === "prop_17") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Gaming Mouse
          </span>
        </div>
      );
    }
  
    if (propId === "prop_18") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Webcam
          </span>
        </div>
      );
    }
  
    if (propId === "prop_19") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Microphone
          </span>
        </div>
      );
    }
  
    if (propId === "prop_20") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Headphones
          </span>
        </div>
      );
    }
  
    if (propId === "prop_21") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Drawing Tablet
          </span>
        </div>
      );
    }
  
    if (propId === "prop_22") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Speaker
          </span>
        </div>
      );
    }
  
    if (propId === "prop_23") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            E-Reader
          </span>
        </div>
      );
    }
  
    if (propId === "prop_24") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smartwatch
          </span>
        </div>
      );
    }
  
    if (propId === "prop_25") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Fitness Tracker
          </span>
        </div>
      );
    }
  
    if (propId === "prop_26") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Action Camera
          </span>
        </div>
      );
    }
  
    if (propId === "prop_27") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Drone
          </span>
        </div>
      );
    }
  
    if (propId === "prop_28") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Electric Skateboard
          </span>
        </div>
      );
    }
  
    if (propId === "prop_29") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Hoverboard
          </span>
        </div>
      );
    }
  
    if (propId === "prop_30") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Robot Vacuum
          </span>
        </div>
      );
    }
  
    if (propId === "prop_31") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Lock
          </span>
        </div>
      );
    }
  
    if (propId === "prop_32") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Thermostat
          </span>
        </div>
      );
    }
  
    if (propId === "prop_33") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Bulb
          </span>
        </div>
      );
    }
  
    if (propId === "prop_34") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Plug
          </span>
        </div>
      );
    }
  
    if (propId === "prop_35") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Mirror
          </span>
        </div>
      );
    }
  
    if (propId === "prop_36") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Scale
          </span>
        </div>
      );
    }
  
    if (propId === "prop_37") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Water Bottle
          </span>
        </div>
      );
    }
  
    if (propId === "prop_38") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#fbbf2440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #fbbf2450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <rect x="65" y="45" width="16" height="22" rx="3" fill="#334155" stroke="#fbbf24" strokeWidth="1" />
               <path d="M72,40 Q75,35 72,30" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.8" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#fbbf24', backgroundColor: '#fbbf2420', borderColor: '#fbbf2450' }}>
            Smart Mug
          </span>
        </div>
      );
    }
  
    if (propId === "prop_39") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Notebook
          </span>
        </div>
      );
    }
  
    if (propId === "prop_40") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Pen
          </span>
        </div>
      );
    }
  
    if (propId === "prop_41") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Glasses
          </span>
        </div>
      );
    }
  
    if (propId === "prop_42") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Ring
          </span>
        </div>
      );
    }
  
    if (propId === "prop_43") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Belt
          </span>
        </div>
      );
    }
  
    if (propId === "prop_44") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Shoe
          </span>
        </div>
      );
    }
  
    if (propId === "prop_45") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Backpack
          </span>
        </div>
      );
    }
  
    if (propId === "prop_46") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Umbrella
          </span>
        </div>
      );
    }
  
    if (propId === "prop_47") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Wallet
          </span>
        </div>
      );
    }
  
    if (propId === "prop_48") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Keychain
          </span>
        </div>
      );
    }
  
    if (propId === "prop_49") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#06b6d440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #06b6d450)' }}>
            
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="70" cy="55" r="12" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.5" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#06b6d4', backgroundColor: '#06b6d420', borderColor: '#06b6d450' }}>
            Smart Tag
          </span>
        </div>
      );
    }
  
  return <div className="w-full h-24 rounded-lg bg-[#181818] border border-[#333333] flex items-center justify-center text-slate-500 text-xs font-mono">NO PROP</div>;
}

export function PetPreview({ petId }) {

    if (petId === "pet_0") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border border-[#333333] flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 100 80" className="w-20 h-20 opacity-40">
            <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#64748b" strokeWidth="1" />
            <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
            <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
            <rect x="27" y="33" width="20" height="4" rx="2" fill="#64748b" opacity="0.8" />
            <text x="75" y="60" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">No Pet</text>
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400 bg-[#252526] px-1.5 py-0.5 rounded border border-[#3e3e42]">EMPTY</span>
        </div>
      );
    }
      
    if (petId === "pet_1") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#f472b640' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #f472b650)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <ellipse cx="75" cy="60" rx="12" ry="8" fill="#f472b6" />
               <circle cx="68" cy="56" r="7" fill="#f472b6" />
               <polygon points="63,51 66,45 69,50" fill="#f43f5e" />
               <polygon points="69,50 72,45 74,51" fill="#f43f5e" />
               <text x="85" y="50" fill="#f472b6" fontSize="8" fontWeight="bold">Z</text>
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#f472b6', backgroundColor: '#f472b620', borderColor: '#f472b650' }}>
            Sleepy Cat
          </span>
        </div>
      );
    }
  
    if (petId === "pet_2") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#fbbf2440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #fbbf2450)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <ellipse cx="75" cy="60" rx="14" ry="8" fill="#fbbf24" />
               <circle cx="65" cy="55" r="8" fill="#fbbf24" />
               <polygon points="60,50 64,42 68,48" fill="#b45309" />
               <text x="85" y="50" fill="#fbbf24" fontSize="8" fontWeight="bold">Z</text>
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#fbbf24', backgroundColor: '#fbbf2420', borderColor: '#fbbf2450' }}>
            Dozing Shiba
          </span>
        </div>
      );
    }
  
    if (petId === "pet_3") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#14b8a640' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #14b8a650)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="72" cy="58" r="8" fill="#14b8a6" />
               <ellipse cx="72" cy="58" rx="4" ry="2" fill="#fff" />
               <circle cx="72" cy="58" r="1" fill="#000" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#14b8a6', backgroundColor: '#14b8a620', borderColor: '#14b8a650' }}>
            Cyber Owl
          </span>
        </div>
      );
    }
  
    if (petId === "pet_4") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#14b8a640' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #14b8a650)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="72" cy="58" r="8" fill="#14b8a6" />
               <ellipse cx="72" cy="58" rx="4" ry="2" fill="#fff" />
               <circle cx="72" cy="58" r="1" fill="#000" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#14b8a6', backgroundColor: '#14b8a620', borderColor: '#14b8a650' }}>
            Mini Drone
          </span>
        </div>
      );
    }
  
    if (petId === "pet_5") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#14b8a640' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #14b8a650)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="72" cy="58" r="8" fill="#14b8a6" />
               <ellipse cx="72" cy="58" rx="4" ry="2" fill="#fff" />
               <circle cx="72" cy="58" r="1" fill="#000" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#14b8a6', backgroundColor: '#14b8a620', borderColor: '#14b8a650' }}>
            Slime Blob
          </span>
        </div>
      );
    }
  
    if (petId === "pet_6") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#14b8a640' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #14b8a650)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="72" cy="58" r="8" fill="#14b8a6" />
               <ellipse cx="72" cy="58" rx="4" ry="2" fill="#fff" />
               <circle cx="72" cy="58" r="1" fill="#000" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#14b8a6', backgroundColor: '#14b8a620', borderColor: '#14b8a650' }}>
            Floating Eye
          </span>
        </div>
      );
    }
  
    if (petId === "pet_7") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#14b8a640' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #14b8a650)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="72" cy="58" r="8" fill="#14b8a6" />
               <ellipse cx="72" cy="58" rx="4" ry="2" fill="#fff" />
               <circle cx="72" cy="58" r="1" fill="#000" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#14b8a6', backgroundColor: '#14b8a620', borderColor: '#14b8a650' }}>
            Cyber Raven
          </span>
        </div>
      );
    }
  
    if (petId === "pet_8") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#fbbf2440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #fbbf2450)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <ellipse cx="75" cy="60" rx="14" ry="8" fill="#fbbf24" />
               <circle cx="65" cy="55" r="8" fill="#fbbf24" />
               <polygon points="60,50 64,42 68,48" fill="#b45309" />
               <text x="85" y="50" fill="#fbbf24" fontSize="8" fontWeight="bold">Z</text>
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#fbbf24', backgroundColor: '#fbbf2420', borderColor: '#fbbf2450' }}>
            Hologram Fox
          </span>
        </div>
      );
    }
  
    if (petId === "pet_9") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#fbbf2440' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #fbbf2450)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <ellipse cx="75" cy="60" rx="14" ry="8" fill="#fbbf24" />
               <circle cx="65" cy="55" r="8" fill="#fbbf24" />
               <polygon points="60,50 64,42 68,48" fill="#b45309" />
               <text x="85" y="50" fill="#fbbf24" fontSize="8" fontWeight="bold">Z</text>
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#fbbf24', backgroundColor: '#fbbf2420', borderColor: '#fbbf2450' }}>
            Corgi
          </span>
        </div>
      );
    }
  
    if (petId === "pet_10") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#14b8a640' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #14b8a650)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="72" cy="58" r="8" fill="#14b8a6" />
               <ellipse cx="72" cy="58" rx="4" ry="2" fill="#fff" />
               <circle cx="72" cy="58" r="1" fill="#000" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#14b8a6', backgroundColor: '#14b8a620', borderColor: '#14b8a650' }}>
            Turtle
          </span>
        </div>
      );
    }
  
    if (petId === "pet_11") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#14b8a640' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #14b8a650)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="72" cy="58" r="8" fill="#14b8a6" />
               <ellipse cx="72" cy="58" rx="4" ry="2" fill="#fff" />
               <circle cx="72" cy="58" r="1" fill="#000" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#14b8a6', backgroundColor: '#14b8a620', borderColor: '#14b8a650' }}>
            Hamster
          </span>
        </div>
      );
    }
  
    if (petId === "pet_12") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#14b8a640' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #14b8a650)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="72" cy="58" r="8" fill="#14b8a6" />
               <ellipse cx="72" cy="58" rx="4" ry="2" fill="#fff" />
               <circle cx="72" cy="58" r="1" fill="#000" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#14b8a6', backgroundColor: '#14b8a620', borderColor: '#14b8a650' }}>
            Parrot
          </span>
        </div>
      );
    }
  
    if (petId === "pet_13") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#14b8a640' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #14b8a650)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="72" cy="58" r="8" fill="#14b8a6" />
               <ellipse cx="72" cy="58" rx="4" ry="2" fill="#fff" />
               <circle cx="72" cy="58" r="1" fill="#000" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#14b8a6', backgroundColor: '#14b8a620', borderColor: '#14b8a650' }}>
            Goldfish
          </span>
        </div>
      );
    }
  
    if (petId === "pet_14") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#14b8a640' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #14b8a650)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="72" cy="58" r="8" fill="#14b8a6" />
               <ellipse cx="72" cy="58" rx="4" ry="2" fill="#fff" />
               <circle cx="72" cy="58" r="1" fill="#000" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#14b8a6', backgroundColor: '#14b8a620', borderColor: '#14b8a650' }}>
            Iguana
          </span>
        </div>
      );
    }
  
    if (petId === "pet_15") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#14b8a640' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #14b8a650)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="72" cy="58" r="8" fill="#14b8a6" />
               <ellipse cx="72" cy="58" rx="4" ry="2" fill="#fff" />
               <circle cx="72" cy="58" r="1" fill="#000" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#14b8a6', backgroundColor: '#14b8a620', borderColor: '#14b8a650' }}>
            Snake
          </span>
        </div>
      );
    }
  
    if (petId === "pet_16") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#14b8a640' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #14b8a650)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="72" cy="58" r="8" fill="#14b8a6" />
               <ellipse cx="72" cy="58" rx="4" ry="2" fill="#fff" />
               <circle cx="72" cy="58" r="1" fill="#000" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#14b8a6', backgroundColor: '#14b8a620', borderColor: '#14b8a650' }}>
            Tarantula
          </span>
        </div>
      );
    }
  
    if (petId === "pet_17") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#14b8a640' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #14b8a650)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="72" cy="58" r="8" fill="#14b8a6" />
               <ellipse cx="72" cy="58" rx="4" ry="2" fill="#fff" />
               <circle cx="72" cy="58" r="1" fill="#000" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#14b8a6', backgroundColor: '#14b8a620', borderColor: '#14b8a650' }}>
            Scorpion
          </span>
        </div>
      );
    }
  
    if (petId === "pet_18") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#14b8a640' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #14b8a650)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="72" cy="58" r="8" fill="#14b8a6" />
               <ellipse cx="72" cy="58" rx="4" ry="2" fill="#fff" />
               <circle cx="72" cy="58" r="1" fill="#000" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#14b8a6', backgroundColor: '#14b8a620', borderColor: '#14b8a650' }}>
            Frog
          </span>
        </div>
      );
    }
  
    if (petId === "pet_19") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '#14b8a640' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px #14b8a650)' }}>
            
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  
            <circle cx="72" cy="58" r="8" fill="#14b8a6" />
               <ellipse cx="72" cy="58" rx="4" ry="2" fill="#fff" />
               <circle cx="72" cy="58" r="1" fill="#000" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '#14b8a6', backgroundColor: '#14b8a620', borderColor: '#14b8a650' }}>
            Salamander
          </span>
        </div>
      );
    }
  
  return <div className="w-full h-24 rounded-lg bg-[#181818] border border-[#333333] flex items-center justify-center text-slate-500 text-xs font-mono">NO PET</div>;
}
