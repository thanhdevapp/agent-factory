const fs = require('fs');
const path = require('path');

const TIERS = ['free', 'coffee', 'lunch', 'vip'];
const RARITIES = ['common', 'rare', 'epic', 'legendary', 'mythic'];

// Palettes
const PALETTES = [
  { primary: '#00f0ff', secondary: '#003b46', name: 'Cyber Cyan' },
  { primary: '#ff007f', secondary: '#4a0024', name: 'Neon Magenta' },
  { primary: '#a855f7', secondary: '#2e1065', name: 'Electric Violet' },
  { primary: '#10b981', secondary: '#022c22', name: 'Matrix Emerald' },
  { primary: '#f59e0b', secondary: '#451a03', name: 'Amber Glow' },
  { primary: '#3b82f6', secondary: '#172554', name: 'Plasma Blue' },
  { primary: '#f43f5e', secondary: '#4c0519', name: 'Crimson Laser' },
  { primary: '#e2e8f0', secondary: '#1e293b', name: 'Titanium Chrome' },
  { primary: '#fbbf24', secondary: '#78350f', name: 'Gilded Gold' },
  { primary: '#06b6d4', secondary: '#083344', name: 'Quantum Aqua' },
];

// 1. Generate 250 Skins
const generateSkins = () => {
  const archetypes = [
    { type: 'cyber_suit', prefix: ['Neon', 'Cyber', 'Vortex', 'Pulse', 'Hyper', 'Titan', 'Carbon', 'Synapse', 'Vector', 'Grid'], nouns: ['Enforcer', 'Agent', 'Operative', 'Scout', 'Vanguard', 'Specter', 'Sentinel', 'Striker', 'Ghost', 'Ranger'] },
    { type: 'mecha_pilot', prefix: ['Heavy', 'Apex', 'Giga', 'Iron', 'Omega', 'Mecha', 'Orbital', 'Dread', 'Armor', 'Siege'], nouns: ['Pilot', 'Colossus', 'Frame', 'Juggernaut', 'Goliath', 'Mech', 'Battlesuit', 'Warmachine', 'Titan', 'Exo'] },
    { type: 'stealth_ninja', prefix: ['Shadow', 'Midnight', 'Stealth', 'Phantom', 'Kage', 'Shinobi', 'Silent', 'Obsidian', 'Dark', 'Smoke'], nouns: ['Ninja', 'Assassin', 'Infiltrator', 'Blade', 'Ronin', 'Samurai', 'Slayer', 'Stalker', 'Wraith', 'Duelist'] },
    { type: 'matrix_hacker', prefix: ['ZeroDay', 'Root', 'Glitch', 'Kernel', 'Crypto', 'Binary', 'Cipher', 'Byte', 'Overclock', 'Defrag'], nouns: ['Hacker', 'Breacher', 'Coder', 'Netrunner', 'Cracker', 'Dev', 'Admin', 'Architect', 'Daemon', 'Phreak'] },
    { type: 'celestial_astro', prefix: ['Solar', 'Lunar', 'Cosmic', 'Stellar', 'Nebula', 'Astral', 'Void', 'Galaxy', 'Aurora', 'Zenith'], nouns: ['Astronaut', 'Cosmonaut', 'Voyager', 'Pioneer', 'Drifter', 'Explorer', 'Starfarer', 'Stargazer', 'Nomad', 'Oracle'] },
  ];

  const items = [];
  let idCounter = 0;

  for (let a = 0; a < archetypes.length; a++) {
    const arch = archetypes[a];
    for (let i = 0; i < 50; i++) {
      const p = arch.prefix[i % arch.prefix.length];
      const n = arch.nouns[Math.floor(i / arch.prefix.length) % arch.nouns.length];
      const pal = PALETTES[(idCounter + i) % PALETTES.length];
      const tier = i < 5 ? 'free' : i < 20 ? 'coffee' : i < 38 ? 'lunch' : 'vip';
      const rarity = i < 5 ? 'common' : i < 20 ? 'rare' : i < 35 ? 'epic' : i < 46 ? 'legendary' : 'mythic';

      items.push({
        id: `skin_${idCounter}`,
        name: `${p} ${n}`,
        category: 'skins',
        archetype: arch.type,
        tier,
        rarity,
        color: pal.primary,
        secondaryColor: pal.secondary,
        paletteName: pal.name,
        description: `Custom 3D high-tech outfit featuring ${pal.name.toLowerCase()} armor plating and responsive neon energy visor.`,
        previewColor: pal.primary,
      });
      idCounter++;
    }
  }

  return items;
};

// 2. Generate 350 Props
const generateProps = () => {
  const categories = [
    { type: 'supercomputer', prefix: ['Quantum', 'Super', 'Neural', 'Tera', 'Optic', 'Exa'], nouns: ['Server Tower', 'Mainframe Rig', 'Compute Cluster', 'Data Matrix', 'Blade Chassis', 'Cryo Core', 'Host Node'] },
    { type: 'dual_monitor', prefix: ['Ultrawide', 'Dual OLED', 'Curved', 'Holo', 'Frameless', 'Chroma'], nouns: ['Display Arm', 'Monitor Array', 'Code Battlestation', 'Workspace Screen', 'Panoramic Rig', 'HUD Terminal'] },
    { type: 'espresso_station', prefix: ['Artisan', 'Dual-Boiler', 'Hydro', 'Cyber', 'Precision', 'Barista'], nouns: ['Espresso Rig', 'Coffee Machine', 'Brew Station', 'Cold Drip Tower', 'Thermal Pour', 'Caffeine Forge'] },
    { type: 'hologram_emitter', prefix: ['3D Volumetric', 'Hexagonal', 'Photonic', 'Prism', 'Holo', 'Laser'], nouns: ['Projector Base', 'Globe Emitter', 'Code Holopad', 'Planetary Spire', 'Wireframe Core', 'Diagram Cube'] },
    { type: 'arcade_cabinet', prefix: ['Retro 8-Bit', 'Cyberpunk', 'Coin-Op', 'Voxel', 'Neo-Geo', 'Synthwave'], nouns: ['Arcade Machine', 'Pinball Table', 'Fight Station', 'Joystick Cabinet', 'Rhythm Console', 'Vector Box'] },
    { type: 'terrarium_bonsai', prefix: ['Bioluminescent', 'Feng Shui', 'Hydroponic', 'Miniature', 'Zen', 'Cybernetic'], nouns: ['Bonsai Garden', 'Terrarium Dome', 'Flora Incubator', 'Glass Sanctuary', 'Moss Biome', 'Sprout Pod'] },
    { type: 'lab_oscilloscope', prefix: ['Signal', 'Digital Wave', 'Dual-Trace', 'Spectrum', 'RF Logic', 'Frequency'], nouns: ['Oscilloscope', 'Analyzer Unit', 'Test Bench', 'Waveform Monitor', 'Signal Generator', 'Multimeter Hub'] },
  ];

  const items = [];
  let idCounter = 0;

  for (let c = 0; c < categories.length; c++) {
    const cat = categories[c];
    for (let i = 0; i < 50; i++) {
      const p = cat.prefix[i % cat.prefix.length];
      const n = cat.nouns[Math.floor(i / cat.prefix.length) % cat.nouns.length];
      const pal = PALETTES[(idCounter * 3) % PALETTES.length];
      const tier = i < 7 ? 'free' : i < 22 ? 'coffee' : i < 39 ? 'lunch' : 'vip';
      const rarity = i < 7 ? 'common' : i < 22 ? 'rare' : i < 36 ? 'epic' : i < 46 ? 'legendary' : 'mythic';

      items.push({
        id: `prop_${idCounter}`,
        name: `${p} ${n}`,
        category: 'props',
        archetype: cat.type,
        tier,
        rarity,
        color: pal.primary,
        secondaryColor: pal.secondary,
        paletteName: pal.name,
        description: `Isometric 3D desk hardware equipped with ${pal.name.toLowerCase()} accents and status indicator lighting.`,
      });
      idCounter++;
    }
  }

  return items;
};

// 3. Generate 200 Pets
const generatePets = () => {
  const petArchetypes = [
    { type: 'cyber_cat', prefix: ['Cozy', 'Pixel', 'Sleek', 'Quantum', 'Glitch', 'Nano'], nouns: ['Cyber Cat', 'Kitten Bot', 'Robo Feline', 'Visor Kitty', 'Alloy Prowler'] },
    { type: 'dozing_shiba', prefix: ['Golden', 'Loyal', 'Sleepy', 'Armored', 'Mecha', 'Solar'], nouns: ['Shiba Inu', 'Corgi Pup', 'Cyber Hound', 'Watch Dog', 'Patrol Canine'] },
    { type: 'hover_drone', prefix: ['Orbital', 'Scout', 'Floating', 'Aero', 'Sentry', 'Patrol'], nouns: ['Hover Drone', 'Orb Companion', 'Sensor Eye', 'Surveyor Pod', 'Aero Familiar'] },
    { type: 'cyber_owl', prefix: ['Clockwork', 'Wise', 'Obsidian', 'Brass', 'Nocturnal', 'Optic'], nouns: ['Cyber Owl', 'Gear Raven', 'Falcon Bot', 'Aero Hawk', 'Bionic Bird'] },
  ];

  const items = [];
  let idCounter = 0;

  // First pet is None
  items.push({
    id: `pet_0`,
    name: 'None',
    category: 'pets',
    archetype: 'none',
    tier: 'free',
    rarity: 'common',
    color: '#64748b',
    secondaryColor: '#1e293b',
    paletteName: 'Neutral Slate',
    description: 'Clean workstation desk without an active cyber pet.',
  });
  idCounter++;

  for (let pa = 0; pa < petArchetypes.length; pa++) {
    const arch = petArchetypes[pa];
    const targetCount = pa === 0 ? 49 : 50; // total 1 + 49 + 50 + 50 + 50 = 200
    for (let i = 0; i < targetCount; i++) {
      const p = arch.prefix[i % arch.prefix.length];
      const n = arch.nouns[Math.floor(i / arch.prefix.length) % arch.nouns.length];
      const pal = PALETTES[(idCounter * 7) % PALETTES.length];
      const tier = i < 5 ? 'free' : i < 18 ? 'coffee' : i < 35 ? 'lunch' : 'vip';
      const rarity = i < 5 ? 'common' : i < 18 ? 'rare' : i < 32 ? 'epic' : i < 44 ? 'legendary' : 'mythic';

      items.push({
        id: `pet_${idCounter}`,
        name: `${p} ${n}`,
        category: 'pets',
        archetype: arch.type,
        tier,
        rarity,
        color: pal.primary,
        secondaryColor: pal.secondary,
        paletteName: pal.name,
        description: `Autonomous 3D robotic companion with interactive behavior algorithms and ${pal.name.toLowerCase()} trim.`,
      });
      idCounter++;
    }
  }

  return items;
};

// 4. Generate 100 Visual Effects & Auras
const generateAuras = () => {
  const auraTypes = [
    { type: 'matrix_rain', prefix: ['Digital', 'Emerald', 'Binary', 'Cascading', 'Cryptic'], nouns: ['Matrix Rain', 'Code Stream', 'Data Cascade', 'Terminal Waterfall'] },
    { type: 'plasma_ring', prefix: ['Orbital', 'Chroma', 'Singularity', 'Particle', 'Flux'], nouns: ['Plasma Rings', 'Ion Halo', 'Energy Orbit', 'Charged Gyro'] },
    { type: 'quantum_mist', prefix: ['Ethereal', 'Nebula', 'Cryo', 'Cosmic', 'Void'], nouns: ['Quantum Mist', 'Spectral Vapor', 'Stardust Cloud', 'Chrono Haze'] },
    { type: 'glitch_halo', prefix: ['Flickering', 'Overclocked', 'Holographic', 'Runic', 'Crowned'], nouns: ['Glitch Halo', 'Crown of Code', 'Hex Sigil', 'Vortex Crown'] },
  ];

  const items = [];
  let idCounter = 0;

  for (let at = 0; at < auraTypes.length; at++) {
    const arch = auraTypes[at];
    for (let i = 0; i < 25; i++) {
      const p = arch.prefix[i % arch.prefix.length];
      const n = arch.nouns[Math.floor(i / arch.prefix.length) % arch.nouns.length];
      const pal = PALETTES[(idCounter * 11) % PALETTES.length];
      const tier = i < 3 ? 'free' : i < 9 ? 'coffee' : i < 18 ? 'lunch' : 'vip';
      const rarity = i < 3 ? 'common' : i < 9 ? 'rare' : i < 17 ? 'epic' : i < 22 ? 'legendary' : 'mythic';

      items.push({
        id: `aura_${idCounter}`,
        name: `${p} ${n}`,
        category: 'auras',
        archetype: arch.type,
        tier,
        rarity,
        color: pal.primary,
        secondaryColor: pal.secondary,
        paletteName: pal.name,
        description: `Ambient 3D volumetric visual effect radiating around the agent workstation with animated particle depth.`,
      });
      idCounter++;
    }
  }

  return items;
};

// 5. Generate 100 Office Trophies & Badges
const generateTrophies = () => {
  const trophyTypes = [
    { type: 'golden_key', prefix: ['Master', 'Architechtural', 'Genesis', 'VIP', 'Legendary'], nouns: ['Golden Key', 'Root Passkey', 'Cryptographic Token', 'Sovereign Seal'] },
    { type: 'silicon_wafer', prefix: ['Nanometer', 'Monolithic', 'Wafer-Scale', 'Die-Shot', 'Pure Silicon'], nouns: ['Silicon Wafer Plaque', 'ASIC Trophy', 'Quantum Core Slab', 'Semiconductor Disc'] },
    { type: 'quantum_crystal', prefix: ['Faceted', 'Prismatic', 'Refractive', 'Resonant', 'Iridescent'], nouns: ['Quantum Crystal', 'Pyramid Monolith', 'Polygonal Relic', 'Crystal Shard'] },
    { type: 'diamond_bug', prefix: ['Zero-Day', 'Bounty Hunter', 'Platinum', 'Defect Hunter', 'Titanium'], nouns: ['Diamond Bug Trophy', 'Golden Beetle', 'SecOps Medal', 'Vulnerability Relic'] },
  ];

  const items = [];
  let idCounter = 0;

  for (let tt = 0; tt < trophyTypes.length; tt++) {
    const arch = trophyTypes[tt];
    for (let i = 0; i < 25; i++) {
      const p = arch.prefix[i % arch.prefix.length];
      const n = arch.nouns[Math.floor(i / arch.prefix.length) % arch.nouns.length];
      const pal = PALETTES[(idCounter * 13) % PALETTES.length];
      const tier = i < 3 ? 'free' : i < 9 ? 'coffee' : i < 18 ? 'lunch' : 'vip';
      const rarity = i < 3 ? 'common' : i < 9 ? 'rare' : i < 17 ? 'epic' : i < 22 ? 'legendary' : 'mythic';

      items.push({
        id: `trophy_${idCounter}`,
        name: `${p} ${n}`,
        category: 'trophies',
        archetype: arch.type,
        tier,
        rarity,
        color: pal.primary,
        secondaryColor: pal.secondary,
        paletteName: pal.name,
        description: `Faceted 3D metallic desktop monument awarded for engineering milestones and supporter contributions.`,
      });
      idCounter++;
    }
  }

  return items;
};

const main = () => {
  console.log('Generating 1000 items catalog...');
  const skins = generateSkins();
  const props = generateProps();
  const pets = generatePets();
  const auras = generateAuras();
  const trophies = generateTrophies();

  console.log(`- Skins: ${skins.length}`);
  console.log(`- Props: ${props.length}`);
  console.log(`- Pets: ${pets.length}`);
  console.log(`- Auras: ${auras.length}`);
  console.log(`- Trophies: ${trophies.length}`);
  console.log(`Total: ${skins.length + props.length + pets.length + auras.length + trophies.length} items`);

  const outDir = path.join(__dirname, '../src/lib/catalog');
  fs.writeFileSync(path.join(outDir, 'skins.js'), `export const skins = ${JSON.stringify(skins, null, 2)};\n`);
  fs.writeFileSync(path.join(outDir, 'props.js'), `export const props = ${JSON.stringify(props, null, 2)};\n`);
  fs.writeFileSync(path.join(outDir, 'pets.js'), `export const pets = ${JSON.stringify(pets, null, 2)};\n`);
  fs.writeFileSync(path.join(outDir, 'auras.js'), `export const auras = ${JSON.stringify(auras, null, 2)};\n`);
  fs.writeFileSync(path.join(outDir, 'trophies.js'), `export const trophies = ${JSON.stringify(trophies, null, 2)};\n`);

  const indexJs = `import { skins } from './skins.js';
import { props } from './props.js';
import { pets } from './pets.js';
import { auras } from './auras.js';
import { trophies } from './trophies.js';

export { skins, props, pets, auras, trophies };

export const COSMETIC_CATALOG = {
  skins,
  props,
  pets,
  auras,
  trophies,
  soundscapes: [
    {
      id: "none",
      name: "Mute",
      description: "Silent mode for deep uninterrupted focus.",
    },
    {
      id: "rain",
      name: "Gentle Rain",
      description: "Soft raindrops tapping on the windowpane for relaxation and focus.",
    },
    {
      id: "coffee_shop",
      name: "Lo-Fi Coffee Shop",
      description: "Warm coffee shop atmosphere with faint murmur and gentle cup clinks.",
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk Alley",
      description: "Deep synthesizer drone with distant neon buzz and hover traffic.",
    },
    {
      id: "fireplace",
      name: "Crackling Fireplace",
      description: "Warm hearth crackling embers for comfortable late-night problem solving.",
    },
    {
      id: "white_noise",
      name: "Server Room Hum",
      description: "Steady cooling fan hum and datacenter airflow for absolute isolation.",
    },
  ],
};

// Fast index map for O(1) item lookup across 1000 items
export const CATALOG_LOOKUP = new Map();
[...skins, ...props, ...pets, ...auras, ...trophies].forEach(item => {
  CATALOG_LOOKUP.set(item.id, item);
});

export const getItemById = (id) => CATALOG_LOOKUP.get(id) || null;
export const TOTAL_CATALOG_COUNT = skins.length + props.length + pets.length + auras.length + trophies.length;
`;

  fs.writeFileSync(path.join(outDir, 'index.js'), indexJs);
  console.log('Successfully written all 1000 items catalog files!');
};

main();
