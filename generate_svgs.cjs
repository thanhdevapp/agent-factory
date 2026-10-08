const fs = require('fs');

// Helper to escape SVG quotes safely
const getLinearGradient = (id, c1, c2) => `
  <defs>
    <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
    <filter id="glow-${id}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
`;

// Chibi Agent Base Character for mock preview
const renderChibiAgent = (x, y, scale = 1, accentColor = "#00f0ff") => {
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})">
      
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" opacity="0.4" />
      
      <rect x="12" y="32" width="16" height="15" rx="5" fill="#181824" stroke="#2a2a3c" strokeWidth="1.5" />
      <rect x="16" y="35" width="8" height="8" rx="2" fill="${accentColor}" opacity="0.3" />
      
      <rect x="10" y="44" width="7" height="4" rx="2" fill="#11111a" />
      <rect x="23" y="44" width="7" height="4" rx="2" fill="#11111a" />
      
      <rect x="4" y="10" width="32" height="25" rx="10" fill="#1e1e2d" stroke="${accentColor}" strokeWidth="1.5" />
      
      <rect x="8" y="17" width="24" height="11" rx="4" fill="#0a0a14" />
      <rect x="11" y="20" width="18" height="5" rx="2" fill="${accentColor}" opacity="0.9" />
      
      <circle cx="4" cy="22" r="3" fill="${accentColor}" opacity="0.8" />
      <circle cx="36" cy="22" r="3" fill="${accentColor}" opacity="0.8" />
    </g>
  `;
};

// 1. Generate Skins (30 Outfits)
const createSkinSVG = (skin) => {
  const id = skin.id;
  const name = skin.name;
  const color = skin.previewColor || "#00f0ff";
  const gradId = `grad-${id}`;

  let headgear = "";
  let visorEffect = `<rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="${color}" strokeWidth="1.5" />
                     <rect x="26" y="34" width="48" height="10" rx="3" fill="${color}" opacity="0.85" />
                     <circle cx="36" cy="39" r="2" fill="#ffffff" />
                     <circle cx="64" cy="39" r="2" fill="#ffffff" />`;

  if (name.includes("Cat") || name.includes("Kitty")) {
    headgear = `<polygon points="20,24 32,4 44,20" fill="${color}" stroke="#ffffff" strokeWidth="1" />
                <polygon points="56,20 68,4 80,24" fill="${color}" stroke="#ffffff" strokeWidth="1" />`;
    visorEffect = `<rect x="22" y="30" width="56" height="18" rx="6" fill="#05050d" stroke="${color}" strokeWidth="1.5" />
                   <path d="M30,39 Q38,34 46,39" stroke="${color}" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                   <path d="M54,39 Q62,34 70,39" stroke="${color}" strokeWidth="2.5" fill="none" strokeLinecap="round" />`;
  } else if (name.includes("Ninja") || name.includes("Samurai") || name.includes("Shadow")) {
    headgear = `<path d="M14,30 Q50,16 86,30 L82,42 Q50,30 18,42 Z" fill="${color}" opacity="0.9" />
                <path d="M78,44 Q95,48 98,62 Q85,58 74,52 Z" fill="${color}" opacity="0.75" />`;
    visorEffect = `<rect x="24" y="33" width="52" height="12" rx="4" fill="#070710" />
                   <line x1="28" y1="39" x2="72" y2="39" stroke="${color}" strokeWidth="3" strokeLinecap="round" />`;
  } else if (name.includes("Hacker") || name.includes("Ghost") || name.includes("Void") || name.includes("Glitch")) {
    headgear = `<path d="M12,46 Q12,10 50,10 Q88,10 88,46 Q68,52 50,52 Q32,52 12,46 Z" fill="#081820" stroke="${color}" strokeWidth="2" />`;
    visorEffect = `<rect x="26" y="28" width="18" height="13" rx="3" fill="${color}" />
                   <rect x="56" y="28" width="18" height="13" rx="3" fill="${color}" />
                   <circle cx="35" cy="34" r="2.5" fill="#ffffff" />
                   <circle cx="65" cy="34" r="2.5" fill="#ffffff" />`;
  } else if (name.includes("Cyborg") || name.includes("Mecha") || name.includes("Robot") || name.includes("Quantum")) {
    headgear = `<line x1="50" y1="4" x2="50" y2="16" stroke="${color}" strokeWidth="2.5" />
                <circle cx="50" cy="4" r="4" fill="${color}" />
                <rect x="10" y="24" width="6" height="16" rx="2" fill="${color}" />
                <rect x="84" y="24" width="6" height="16" rx="2" fill="${color}" />`;
    visorEffect = `<polygon points="25,32 75,32 70,46 30,46" fill="#0a0a14" stroke="${color}" strokeWidth="1.5" />
                   <polygon points="29,35 71,35 67,43 33,43" fill="${color}" opacity="0.8" />`;
  } else if (name.includes("Astronaut") || name.includes("Cosmic") || name.includes("Solar") || name.includes("Lunar")) {
    headgear = `<circle cx="50" cy="38" r="32" fill="none" stroke="${color}" strokeWidth="2.5" opacity="0.4" />
                <circle cx="50" cy="10" r="5" fill="${color}" />`;
    visorEffect = `<ellipse cx="50" cy="38" rx="28" ry="16" fill="#080c18" stroke="${color}" strokeWidth="2" />
                   <ellipse cx="50" cy="38" rx="23" ry="11" fill="${color}" opacity="0.75" />
                   <path d="M34,32 Q50,26 66,32" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.6" />`;
  } else {
    headgear = `<rect x="42" y="8" width="16" height="8" rx="3" fill="${color}" />
                <circle cx="16" cy="38" r="4" fill="${color}" opacity="0.7" />
                <circle cx="84" cy="38" r="4" fill="${color}" opacity="0.7" />`;
  }

  return `
    if (skinId === "${id}") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1c1a2e] to-[#0c0a18] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '${color}50' }}>
          <div className="absolute inset-0 bg-radial from-[${color}15] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 85" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 12px ${color}60)' }}>
            ${getLinearGradient(gradId, color, "#111827")}
            
            <rect x="34" y="58" width="32" height="24" rx="8" fill="#161524" stroke="${color}" strokeWidth="1.5" />
            <rect x="40" y="64" width="20" height="12" rx="4" fill="${color}" opacity="0.25" />
            
            <rect x="16" y="16" width="68" height="46" rx="20" fill="#1a182c" stroke="${color}" strokeWidth="2" />
            ${headgear}
            ${visorEffect}
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '${color}', backgroundColor: '${color}15', borderColor: '${color}50' }}>
            ${name}
          </span>
        </div>
      );
    }
  `;
};

// 2. Generate Props (50 Tech Gadgets)
const createPropSVG = (prop) => {
  const id = prop.id;
  const name = prop.name;
  let color = "#38bdf8";
  let propArt = "";

  if (name.includes("Espresso") || name.includes("Coffee")) {
    color = "#f59e0b";
    propArt = `
      <g transform="translate(56, 26)">
        <rect x="4" y="10" width="28" height="34" rx="4" fill="#2d2838" stroke="${color}" strokeWidth="1.5" />
        <rect x="8" y="14" width="20" height="8" rx="2" fill="#0f0c1a" />
        <circle cx="12" cy="18" r="1.5" fill="#10b981" />
        <circle cx="18" cy="18" r="1.5" fill="#ef4444" />
        
        <rect x="12" y="24" width="12" height="4" rx="1" fill="#475569" />
        <rect x="13" y="32" width="10" height="10" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
        
        <path d="M16,28 Q18,24 16,20 Q14,16 17,12" stroke="${color}" strokeWidth="1.5" fill="none" opacity="0.8" strokeLinecap="round" />
      </g>
    `;
  } else if (name.includes("Bonsai") || name.includes("Plant")) {
    color = "#10b981";
    propArt = `
      <g transform="translate(56, 24)">
        <polygon points="6,38 30,38 27,48 9,48" fill="#78350f" stroke="#b45309" strokeWidth="1.5" />
        <path d="M18,38 Q18,28 14,24 Q24,20 22,12" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="14" cy="18" rx="10" ry="6" fill="#10b981" />
        <ellipse cx="26" cy="14" rx="9" ry="5.5" fill="#34d399" />
        <ellipse cx="20" cy="24" rx="7" ry="4.5" fill="#059669" />
      </g>
    `;
  } else if (name.includes("Keyboard") || name.includes("Keypad")) {
    color = "#a855f7";
    propArt = `
      <g transform="translate(50, 32)">
        <polygon points="0,20 38,12 44,32 6,40" fill="#1e1e2d" stroke="${color}" strokeWidth="1.5" />
        
        <line x1="6" y1="20" x2="36" y2="14" stroke="#ec4899" strokeWidth="3" strokeDasharray="3 2" />
        <line x1="8" y1="26" x2="38" y2="20" stroke="#06b6d4" strokeWidth="3" strokeDasharray="3 2" />
        <line x1="10" y1="32" x2="40" y2="26" stroke="#eab308" strokeWidth="3" strokeDasharray="3 2" />
      </g>
    `;
  } else if (name.includes("Server") || name.includes("Rack") || name.includes("Miner")) {
    color = "#06b6d4";
    propArt = `
      <g transform="translate(56, 18)">
        <rect x="4" y="6" width="28" height="48" rx="3" fill="#161824" stroke="${color}" strokeWidth="1.5" />
        <rect x="8" y="10" width="20" height="8" rx="2" fill="#222538" />
        <circle cx="12" cy="14" r="1.5" fill="#22c55e" />
        <circle cx="16" cy="14" r="1.5" fill="#38bdf8" />
        <rect x="8" y="22" width="20" height="8" rx="2" fill="#222538" />
        <circle cx="12" cy="26" r="1.5" fill="#22c55e" />
        <circle cx="16" cy="26" r="1.5" fill="#f59e0b" />
        <rect x="8" y="34" width="20" height="8" rx="2" fill="#222538" />
        <line x1="12" y1="38" x2="24" y2="38" stroke="${color}" strokeWidth="2" strokeDasharray="2 1" />
      </g>
    `;
  } else if (name.includes("Hologram") || name.includes("Projector")) {
    color = "#38bdf8";
    propArt = `
      <g transform="translate(56, 16)">
        <ellipse cx="18" cy="46" rx="14" ry="5" fill="#1f2937" stroke="${color}" strokeWidth="1.5" />
        <polygon points="18,44 6,18 30,18" fill="${color}" opacity="0.25" />
        
        <polygon points="18,10 26,14 18,18 10,14" fill="#38bdf8" opacity="0.9" />
        <polygon points="10,14 18,18 18,26 10,22" fill="#0284c7" opacity="0.9" />
        <polygon points="26,14 18,18 18,26 26,22" fill="#0369a1" opacity="0.9" />
      </g>
    `;
  } else if (name.includes("Arcade")) {
    color = "#ec4899";
    propArt = `
      <g transform="translate(56, 18)">
        <polygon points="6,48 28,48 28,6 10,6 6,18" fill="#181828" stroke="${color}" strokeWidth="1.5" />
        <rect x="10" y="8" width="16" height="6" fill="${color}" />
        <rect x="10" y="18" width="15" height="12" rx="2" fill="#090514" stroke="#8b5cf6" strokeWidth="1" />
        <circle cx="15" cy="24" r="2" fill="#22c55e" />
        <circle cx="16" cy="35" r="2.5" fill="#ef4444" />
        <line x1="16" y1="35" x2="16" y2="39" stroke="#cbd5e1" strokeWidth="2" />
        <circle cx="22" cy="37" r="1.5" fill="#eab308" />
      </g>
    `;
  } else if (name.includes("Lava") || name.includes("Lamp")) {
    color = "#f97316";
    propArt = `
      <g transform="translate(60, 20)">
        <polygon points="8,46 22,46 20,40 10,40" fill="#334155" />
        <path d="M10,40 Q8,24 12,14 Q15,6 15,6 Q15,6 18,14 Q22,24 20,40 Z" fill="#7c2d12" stroke="${color}" strokeWidth="1.5" />
        <circle cx="15" cy="34" r="3.5" fill="${color}" opacity="0.9" />
        <circle cx="14" cy="24" r="2.5" fill="${color}" opacity="0.9" />
        <circle cx="16" cy="16" r="1.8" fill="${color}" opacity="0.9" />
      </g>
    `;
  } else if (name.includes("VR") || name.includes("Glasses")) {
    color = "#8b5cf6";
    propArt = `
      <g transform="translate(54, 28)">
        <rect x="6" y="12" width="28" height="16" rx="6" fill="#1e1e2d" stroke="${color}" strokeWidth="2" />
        <path d="M10,18 Q16,24 22,18 Q28,24 30,18" stroke="${color}" strokeWidth="2" fill="none" />
        <line x1="2" y1="20" x2="6" y2="20" stroke="#64748b" strokeWidth="3" />
        <line x1="34" y1="20" x2="38" y2="20" stroke="#64748b" strokeWidth="3" />
      </g>
    `;
  } else if (name.includes("Monitor") || name.includes("Screen") || name.includes("TV")) {
    color = "#3b82f6";
    propArt = `
      <g transform="translate(52, 22)">
        <rect x="4" y="6" width="34" height="24" rx="3" fill="#0f172a" stroke="${color}" strokeWidth="1.5" />
        
        <line x1="8" y1="12" x2="20" y2="12" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="17" x2="28" y2="17" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="22" x2="24" y2="22" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
        
        <rect x="19" y="30" width="4" height="8" fill="#475569" />
        <ellipse cx="21" cy="38" rx="10" ry="3" fill="#334155" />
      </g>
    `;
  } else if (name.includes("Quantum") || name.includes("Turing") || name.includes("Computer")) {
    color = "#06b6d4";
    propArt = `
      <g transform="translate(54, 18)">
        <rect x="8" y="4" width="26" height="6" rx="2" fill="#e2e8f0" />
        <line x1="14" y1="10" x2="14" y2="38" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="21" y1="10" x2="21" y2="38" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="28" y1="10" x2="28" y2="38" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="21" cy="38" r="8" fill="#0e7490" stroke="${color}" strokeWidth="2" />
        <circle cx="21" cy="38" r="3" fill="#ffffff" />
      </g>
    `;
  } else if (name.includes("Drone")) {
    color = "#10b981";
    propArt = `
      <g transform="translate(52, 22)">
        <ellipse cx="20" cy="22" rx="8" ry="5" fill="#1f2937" stroke="${color}" strokeWidth="1.5" />
        <line x1="12" y1="18" x2="4" y2="12" stroke="#475569" strokeWidth="2" />
        <line x1="28" y1="18" x2="36" y2="12" stroke="#475569" strokeWidth="2" />
        <ellipse cx="4" cy="12" rx="6" ry="2" fill="${color}" opacity="0.8" />
        <ellipse cx="36" cy="12" rx="6" ry="2" fill="${color}" opacity="0.8" />
        <circle cx="20" cy="23" r="2.5" fill="#38bdf8" />
      </g>
    `;
  } else if (name.includes("Audio") || name.includes("Speaker") || name.includes("Microphone") || name.includes("Headphones")) {
    color = "#f43f5e";
    propArt = `
      <g transform="translate(56, 20)">
        <rect x="8" y="10" width="18" height="28" rx="6" fill="#1e1e2d" stroke="${color}" strokeWidth="2" />
        <circle cx="17" cy="22" r="5" fill="#334155" stroke="${color}" strokeWidth="1" />
        <circle cx="17" cy="32" r="2.5" fill="#334155" />
      </g>
    `;
  } else if (name.includes("Tesla") || name.includes("Plasma") || name.includes("Laser")) {
    color = "#8b5cf6";
    propArt = `
      <g transform="translate(56, 18)">
        <circle cx="18" cy="22" r="14" fill="#1e1b4b" stroke="${color}" strokeWidth="2" />
        <path d="M18,22 Q12,16 10,18" stroke="#38bdf8" strokeWidth="2" fill="none" />
        <path d="M18,22 Q24,14 26,16" stroke="#ec4899" strokeWidth="2" fill="none" />
        <circle cx="18" cy="22" r="3.5" fill="#ffffff" />
        <rect x="12" y="36" width="12" height="10" rx="2" fill="#334155" />
      </g>
    `;
  } else {
    // Default High-Tech Gadget
    color = "#00f0ff";
    propArt = `
      <g transform="translate(54, 24)">
        <rect x="6" y="8" width="28" height="28" rx="6" fill="#161b26" stroke="${color}" strokeWidth="2" />
        <polygon points="20,12 30,22 20,32 10,22" fill="none" stroke="${color}" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" fill="${color}" opacity="0.8" />
      </g>
    `;
  }

  return `
    if (propId === "${id}") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#181a24] to-[#0d0f17] border flex items-center justify-center relative overflow-hidden group hover:border-cyan-400/80 transition-all shadow-md" style={{ borderColor: '${color}40' }}>
          <div className="absolute inset-0 bg-radial from-[${color}12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px ${color}50)' }}>
            
            <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            
            ${renderChibiAgent(8, 20, 0.9, color)}
            
            ${propArt}
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '${color}', backgroundColor: '${color}15', borderColor: '${color}50' }}>
            ${name}
          </span>
        </div>
      );
    }
  `;
};

// 3. Generate Pets (20 Companions)
const createPetSVG = (pet) => {
  const id = pet.id;
  const name = pet.name;
  let color = "#f472b6";
  let petArt = "";

  if (name.includes("Cat") || name.includes("Kitty")) {
    color = "#f472b6";
    petArt = `
      <g transform="translate(56, 32)">
        <ellipse cx="20" cy="20" rx="14" ry="10" fill="${color}" />
        <circle cx="10" cy="14" r="9" fill="${color}" />
        
        <polygon points="4,8 7,1 11,7" fill="#f43f5e" />
        <polygon points="10,7 14,1 17,8" fill="#f43f5e" />
        
        <path d="M6,14 Q8,17 10,14" stroke="#ffffff" strokeWidth="1.5" fill="none" />
        <path d="M12,14 Q14,17 16,14" stroke="#ffffff" strokeWidth="1.5" fill="none" />
        <text x="26" y="10" fill="${color}" fontSize="10" fontWeight="bold">Z</text>
      </g>
    `;
  } else if (name.includes("Shiba") || name.includes("Dog") || name.includes("Corgi")) {
    color = "#f59e0b";
    petArt = `
      <g transform="translate(56, 30)">
        <ellipse cx="20" cy="20" rx="15" ry="10" fill="${color}" />
        <circle cx="10" cy="14" r="9" fill="${color}" />
        
        <polygon points="4,8 7,2 11,8" fill="#b45309" />
        <polygon points="11,8 14,2 17,8" fill="#b45309" />
        <circle cx="7" cy="14" r="1.5" fill="#000" />
        <circle cx="13" cy="14" r="1.5" fill="#000" />
        <ellipse cx="10" cy="18" rx="2" ry="1.5" fill="#000" />
        
        <circle cx="33" cy="16" r="3.5" fill="${color}" />
      </g>
    `;
  } else if (name.includes("Owl")) {
    color = "#06b6d4";
    petArt = `
      <g transform="translate(58, 28)">
        <ellipse cx="16" cy="22" rx="11" ry="14" fill="#1e293b" stroke="${color}" strokeWidth="1.5" />
        
        <circle cx="11" cy="16" r="5" fill="#0f172a" stroke="${color}" strokeWidth="1.5" />
        <circle cx="21" cy="16" r="5" fill="#0f172a" stroke="${color}" strokeWidth="1.5" />
        <circle cx="11" cy="16" r="2.5" fill="${color}" />
        <circle cx="21" cy="16" r="2.5" fill="${color}" />
        
        <polygon points="14,21 18,21 16,25" fill="#f59e0b" />
      </g>
    `;
  } else if (name.includes("Drone")) {
    color = "#10b981";
    petArt = `
      <g transform="translate(56, 26)">
        <circle cx="18" cy="18" r="10" fill="#1e293b" stroke="${color}" strokeWidth="2" />
        <ellipse cx="18" cy="18" rx="15" ry="4" fill="none" stroke="${color}" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="18" cy="18" r="4" fill="#38bdf8" />
        <line x1="18" y1="28" x2="18" y2="34" stroke="${color}" strokeWidth="1.5" strokeDasharray="2 2" />
      </g>
    `;
  } else if (name.includes("Slime")) {
    color = "#22c55e";
    petArt = `
      <g transform="translate(58, 30)">
        <path d="M6,24 Q6,12 18,10 Q30,12 30,24 Q28,28 18,28 Q8,28 6,24 Z" fill="${color}" opacity="0.85" />
        <circle cx="13" cy="18" r="2.5" fill="#042f2e" />
        <circle cx="23" cy="18" r="2.5" fill="#042f2e" />
        <circle cx="14" cy="17" r="1" fill="#ffffff" />
        <circle cx="24" cy="17" r="1" fill="#ffffff" />
      </g>
    `;
  } else if (name.includes("Eye")) {
    color = "#a855f7";
    petArt = `
      <g transform="translate(56, 26)">
        <circle cx="18" cy="18" r="12" fill="#0f0c1b" stroke="${color}" strokeWidth="2" />
        <circle cx="18" cy="18" r="7" fill="${color}" opacity="0.9" />
        <circle cx="18" cy="18" r="3.5" fill="#000000" />
        <circle cx="20" cy="16" r="1.5" fill="#ffffff" />
      </g>
    `;
  } else if (name.includes("Raven")) {
    color = "#6366f1";
    petArt = `
      <g transform="translate(56, 28)">
        <polygon points="6,24 24,14 26,30" fill="#1e1b4b" stroke="${color}" strokeWidth="1.5" />
        <circle cx="12" cy="18" r="6" fill="#1e1b4b" />
        <polygon points="4,18 10,15 10,21" fill="#f59e0b" />
        <circle cx="11" cy="17" r="1.5" fill="${color}" />
      </g>
    `;
  } else if (name.includes("Fox")) {
    color = "#f97316";
    petArt = `
      <g transform="translate(56, 30)">
        <ellipse cx="16" cy="18" rx="12" ry="9" fill="${color}" />
        <polygon points="6,8 9,1 12,8" fill="#ffffff" />
        <polygon points="12,8 15,1 18,8" fill="#ffffff" />
        <circle cx="9" cy="14" r="1.5" fill="#000" />
        <circle cx="15" cy="14" r="1.5" fill="#000" />
        
        <ellipse cx="28" cy="14" rx="8" ry="12" fill="${color}" transform="rotate(30, 28, 14)" />
      </g>
    `;
  } else if (name.includes("Turtle")) {
    color = "#14b8a6";
    petArt = `
      <g transform="translate(56, 34)">
        <ellipse cx="18" cy="18" rx="14" ry="9" fill="#0f766e" stroke="${color}" strokeWidth="2" />
        <circle cx="6" cy="18" r="4" fill="${color}" />
        <circle cx="5" cy="17" r="1" fill="#000" />
      </g>
    `;
  } else if (name.includes("Goldfish")) {
    color = "#f97316";
    petArt = `
      <g transform="translate(56, 26)">
        <circle cx="18" cy="18" r="14" fill="#0284c7" opacity="0.3" stroke="#38bdf8" strokeWidth="1.5" />
        <ellipse cx="18" cy="18" rx="8" ry="5" fill="${color}" />
        <polygon points="24,18 30,12 30,24" fill="${color}" opacity="0.8" />
        <circle cx="13" cy="17" r="1.5" fill="#000" />
      </g>
    `;
  } else {
    // Default Pet
    color = "#ec4899";
    petArt = `
      <g transform="translate(56, 30)">
        <circle cx="18" cy="18" r="11" fill="${color}" opacity="0.9" />
        <circle cx="14" cy="16" r="2" fill="#000" />
        <circle cx="22" cy="16" r="2" fill="#000" />
        <ellipse cx="18" cy="22" rx="3" ry="1.5" fill="#ffffff" />
      </g>
    `;
  }

  return `
    if (petId === "${id}") {
      return (
        <div className="w-full h-28 rounded-xl bg-gradient-to-b from-[#1a1829] to-[#0c0a17] border flex items-center justify-center relative overflow-hidden group hover:border-pink-400/80 transition-all shadow-md" style={{ borderColor: '${color}40' }}>
          <div className="absolute inset-0 bg-radial from-[${color}12] to-transparent opacity-60"></div>
          <svg viewBox="0 0 100 80" className="w-24 h-24 relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ filter: 'drop-shadow(0 4px 10px ${color}50)' }}>
            
            <ellipse cx="74" cy="62" rx="22" ry="8" fill="#181826" stroke="#2e2e42" strokeWidth="1.5" />
            
            ${renderChibiAgent(8, 20, 0.9, color)}
            
            ${petArt}
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold" style={{ color: '${color}', backgroundColor: '${color}15', borderColor: '${color}50' }}>
            ${name}
          </span>
        </div>
      );
    }
  `;
};

// Generate entire file
const generateFile = () => {
  const { skins } = require('./src/lib/catalog/skins.js');
  const { props } = require('./src/lib/catalog/props.js');
  const { pets } = require('./src/lib/catalog/pets.js');

  let fileContent = `"use client";\nimport React from "react";\n\n`;

  fileContent += `export function SkinPreview({ skinId }) {\n`;
  skins.forEach(skin => {
    fileContent += createSkinSVG(skin);
  });
  fileContent += `\n  return <div className="w-full h-28 rounded-xl bg-[#181818] border border-[#333333] flex items-center justify-center text-slate-500 text-xs font-mono">NO SKIN</div>;\n}\n\n`;

  fileContent += `export function PropPreview({ propId }) {\n`;
  props.forEach(prop => {
    fileContent += createPropSVG(prop);
  });
  fileContent += `\n  return <div className="w-full h-28 rounded-xl bg-[#181818] border border-[#333333] flex items-center justify-center text-slate-500 text-xs font-mono">NO PROP</div>;\n}\n\n`;

  fileContent += `export function PetPreview({ petId }) {\n`;
  pets.forEach(pet => {
    if (pet.name === "None") {
      fileContent += `
    if (petId === "${pet.id}") {
      return (
        <div className="w-full h-28 rounded-xl bg-[#181818] border border-[#333333] flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 100 80" className="w-24 h-24 opacity-40">
            ${renderChibiAgent(30, 20, 1, "#64748b")}
            <text x="50" y="74" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">No Pet Equipped</text>
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono text-slate-400 bg-[#252526] px-2 py-0.5 rounded-full border border-[#3e3e42]">EMPTY</span>
        </div>
      );
    }
      `;
    } else {
      fileContent += createPetSVG(pet);
    }
  });
  fileContent += `\n  return <div className="w-full h-28 rounded-xl bg-[#181818] border border-[#333333] flex items-center justify-center text-slate-500 text-xs font-mono">NO PET</div>;\n}\n`;

  fs.writeFileSync('src/components/store/ItemPreviewArt.jsx', fileContent);
  console.log('ItemPreviewArt.jsx regenerated with HIGH-FIDELITY art for all 100 items!');
};

generateFile();
