const fs = require('fs');

const createSkinSVG = (id, name, color) => {
  // Base shapes
  let head = `<rect x="25" y="20" width="50" height="40" rx="18" fill="#1e1035" stroke="${color}" strokeWidth="2" />`;
  let eyes = `<rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
              <rect x="34" y="39" width="32" height="7" rx="3" fill="${color}" opacity="0.8" />`;
  let accessory = "";
  
  if (name.includes("Cat")) {
    accessory = `<polygon points="26,30 36,10 46,26" fill="${color}" /><polygon points="74,30 64,10 54,26" fill="${color}" />`;
    eyes = `<path d="M37,41 Q42,35 47,41" stroke="${color}" strokeWidth="2.5" fill="none" />
            <path d="M53,41 Q58,35 63,41" stroke="${color}" strokeWidth="2.5" fill="none" />`;
  } else if (name.includes("Ninja") || name.includes("Samurai")) {
    accessory = `<path d="M68,54 Q85,58 92,70 Q80,68 66,60 Z" fill="${color}" opacity="0.8"/>`;
    eyes = `<rect x="30" y="35" width="40" height="15" rx="5" fill="#090514" />
            <line x1="36" y1="42.5" x2="64" y2="42.5" stroke="${color}" strokeWidth="2" strokeLinecap="round" />`;
  } else if (name.includes("Hacker") || name.includes("Ghost") || name.includes("Void")) {
    head = `<path d="M22,50 Q22,14 50,14 Q78,14 78,50 Q66,54 50,54 Q34,54 22,50 Z" fill="#022c22" stroke="${color}" strokeWidth="2" />`;
    eyes = `<rect x="34" y="32" width="13" height="10" rx="3" fill="${color}" />
            <rect x="53" y="32" width="13" height="10" rx="3" fill="${color}" />`;
  } else if (name.includes("Cyborg") || name.includes("Mecha") || name.includes("Robot")) {
    head = `<rect x="25" y="24" width="50" height="38" rx="8" fill="#1e1e24" stroke="${color}" strokeWidth="2" />`;
    accessory = `<line x1="50" y1="14" x2="50" y2="24" stroke="${color}" strokeWidth="2" /><circle cx="50" cy="12" r="3.5" fill="${color}" />`;
    eyes = `<ellipse cx="40" cy="42" rx="4.5" ry="5" fill="${color}" /><ellipse cx="60" cy="42" rx="4.5" ry="5" fill="${color}" />`;
  } else {
    // default pattern
    head = `<rect x="25" y="24" width="50" height="38" rx="18" fill="#1a1a24" stroke="${color}" strokeWidth="2" />`;
  }

  return `
    if (skinId === "${id}") {
      return (
        <div className="w-full h-24 rounded-lg bg-gradient-to-b from-[#1b152b] to-[#0f0c1a] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '${color}40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 10px ${color}50)' }}>
            <rect x="36" y="56" width="28" height="20" rx="6" fill="#1a1a24" stroke="${color}" strokeWidth="1.5" />
            ${accessory}
            ${head}
            ${eyes}
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '${color}', backgroundColor: '${color}20', borderColor: '${color}50' }}>
            ${name}
          </span>
        </div>
      );
    }
  `;
};

const createPropSVG = (id, name) => {
  let color = "#38bdf8";
  let content = "";
  if (name.includes("Coffee") || name.includes("Mug") || name.includes("Cup")) {
    color = "#fbbf24";
    content = `<rect x="65" y="45" width="16" height="22" rx="3" fill="#334155" stroke="${color}" strokeWidth="1" />
               <path d="M72,40 Q75,35 72,30" stroke="${color}" strokeWidth="1" fill="none" opacity="0.8" />`;
  } else if (name.includes("Bonsai") || name.includes("Plant") || name.includes("Tree")) {
    color = "#10b981";
    content = `<polygon points="63,65 77,65 75,75 65,75" fill="#9a3412" stroke="#c2410c" strokeWidth="1" />
               <ellipse cx="70" cy="48" rx="10" ry="6" fill="${color}" />
               <ellipse cx="76" cy="54" rx="8" ry="4" fill="${color}" />`;
  } else if (name.includes("Keyboard") || name.includes("Computer") || name.includes("Monitor") || name.includes("TV")) {
    color = "#a855f7";
    content = `<rect x="60" y="50" width="30" height="16" rx="2" fill="#1e1e24" stroke="${color}" strokeWidth="1" />
               <rect x="62" y="52" width="26" height="4" rx="1" fill="${color}" opacity="0.5" />
               <rect x="62" y="58" width="26" height="6" rx="1" fill="#ec4899" opacity="0.8" />`;
  } else {
    color = "#06b6d4";
    content = `<circle cx="70" cy="55" r="12" fill="none" stroke="${color}" strokeWidth="1.5" strokeDasharray="2 2" />
               <rect x="65" y="50" width="10" height="10" rx="2" fill="${color}" opacity="0.5" />`;
  }

  // Base character on the left (x=15, y=30, w=30, h=30)
  const baseChar = `
    <rect x="25" y="55" width="14" height="15" rx="3" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="15" y="30" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="19" y="40" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="22" y="43" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  `;

  return `
    if (propId === "${id}") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '${color}40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px ${color}50)' }}>
            ${baseChar}
            ${content}
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '${color}', backgroundColor: '${color}20', borderColor: '${color}50' }}>
            ${name}
          </span>
        </div>
      );
    }
  `;
};

const createPetSVG = (id, name) => {
  let color = "#f472b6";
  let content = "";
  if (name.includes("Cat") || name.includes("Kitty") || name.includes("Lion") || name.includes("Tiger")) {
    color = "#f472b6";
    content = `<ellipse cx="75" cy="60" rx="12" ry="8" fill="${color}" />
               <circle cx="68" cy="56" r="7" fill="${color}" />
               <polygon points="63,51 66,45 69,50" fill="#f43f5e" />
               <polygon points="69,50 72,45 74,51" fill="#f43f5e" />
               <text x="85" y="50" fill="${color}" fontSize="8" fontWeight="bold">Z</text>`;
  } else if (name.includes("Shiba") || name.includes("Dog") || name.includes("Corgi") || name.includes("Fox")) {
    color = "#fbbf24";
    content = `<ellipse cx="75" cy="60" rx="14" ry="8" fill="${color}" />
               <circle cx="65" cy="55" r="8" fill="${color}" />
               <polygon points="60,50 64,42 68,48" fill="#b45309" />
               <text x="85" y="50" fill="${color}" fontSize="8" fontWeight="bold">Z</text>`;
  } else if (name.includes("Dragon") || name.includes("Drake")) {
    color = "#10b981";
    content = `<ellipse cx="75" cy="60" rx="12" ry="8" fill="${color}" />
               <circle cx="68" cy="56" r="7" fill="${color}" />
               <polygon points="72,60 76,52 80,60" fill="#047857" />
               <text x="85" y="50" fill="${color}" fontSize="8" fontWeight="bold">Z</text>`;
  } else {
    color = "#14b8a6";
    content = `<circle cx="72" cy="58" r="8" fill="${color}" />
               <ellipse cx="72" cy="58" rx="4" ry="2" fill="#fff" />
               <circle cx="72" cy="58" r="1" fill="#000" />`;
  }

  // Base character on the left (x=20, y=20, w=34, h=30)
  const baseChar = `
    <rect x="30" y="45" width="14" height="20" rx="4" fill="#1a1a24" stroke="#475569" strokeWidth="1" />
    <rect x="20" y="20" width="34" height="30" rx="10" fill="#1a1a24" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="30" width="26" height="10" rx="3" fill="#0f172a" />
    <rect x="27" y="33" width="20" height="4" rx="2" fill="#38bdf8" opacity="0.8" />
  `;

  return `
    if (petId === "${id}") {
      return (
        <div className="w-full h-24 rounded-lg bg-[#181818] border flex items-center justify-center relative overflow-hidden" style={{ borderColor: '${color}40' }}>
          <svg viewBox="0 0 100 80" className="w-20 h-20" style={{ filter: 'drop-shadow(0 4px 8px ${color}50)' }}>
            ${baseChar}
            ${content}
          </svg>
          <span className="absolute bottom-1 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ color: '${color}', backgroundColor: '${color}20', borderColor: '${color}50' }}>
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
    fileContent += createSkinSVG(skin.id, skin.name, skin.previewColor);
  });
  fileContent += `\n  return <div className="w-full h-24 rounded-lg bg-[#181818] border border-[#333333] flex items-center justify-center text-slate-500 text-xs font-mono">NO SKIN</div>;\n}\n\n`;

  fileContent += `export function PropPreview({ propId }) {\n`;
  props.forEach(prop => {
    fileContent += createPropSVG(prop.id, prop.name);
  });
  fileContent += `\n  return <div className="w-full h-24 rounded-lg bg-[#181818] border border-[#333333] flex items-center justify-center text-slate-500 text-xs font-mono">NO PROP</div>;\n}\n\n`;

  fileContent += `export function PetPreview({ petId }) {\n`;
  pets.forEach(pet => {
    if (pet.name === "None") {
      fileContent += `
    if (petId === "${pet.id}") {
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
      `;
    } else {
      fileContent += createPetSVG(pet.id, pet.name);
    }
  });
  fileContent += `\n  return <div className="w-full h-24 rounded-lg bg-[#181818] border border-[#333333] flex items-center justify-center text-slate-500 text-xs font-mono">NO PET</div>;\n}\n`;

  fs.writeFileSync('src/components/store/ItemPreviewArt.jsx', fileContent);
  console.log('ItemPreviewArt.jsx regenerated successfully with 100 items (with base character preview)!');
};

generateFile();
