export const MOCK_PRESETS = {
  showcase: { agents: 24, errorRatio: 0, preset: "showcase", label: "All Items Showcase (24)" },
  cases: { agents: 17, errorRatio: 0, cases: true, label: "Edge Cases & Items (17)" },
  showcase_skins: { agents: 15, errorRatio: 0, preset: "showcase_skins", label: "Skins & Outfits (15)" },
  showcase_props: { agents: 14, errorRatio: 0, preset: "showcase_props", label: "Tech Props & Gadgets (14)" },
  showcase_pets: { agents: 12, errorRatio: 0, preset: "showcase_pets", label: "Pets & Companions (12)" },
  showcase_auras: { agents: 12, errorRatio: 0, preset: "showcase_auras", label: "Particle Auras & VFX (12)" },
  showcase_trophies: { agents: 12, errorRatio: 0, preset: "showcase_trophies", label: "Trophies & Badges (12)" },
  storm: { agents: 30, errorRatio: 0.15, label: "Storm (30 Agents)" },
  busy: { agents: 8, errorRatio: 0, label: "Busy (8 Agents)" },
  idle: { agents: 2, errorRatio: 0, label: "Idle (2 Agents)" },
  errors: { agents: 10, errorRatio: 0.6, label: "Error States" },
};

const CLIENTS = [
  { account: "Claude Code · main", icon: "terminal" },
  { account: "Claude Code · review", icon: "rate_review" },
  { account: "Antigravity · agent", icon: "smart_toy" },
  { account: "Antigravity · dev", icon: "construction" },
  { account: "Cursor · workspace", icon: "edit_note" },
  { account: "OpenCode · build", icon: "science" },
  { account: "Aider", icon: "smart_toy" },
  { account: "Continue · dev", icon: "play_arrow" },
];

const PROVIDER_MODELS = [
  { provider: "claude", model: "claude-3-7-sonnet" },
  { provider: "gemini", model: "gemini-2.5-pro" },
  { provider: "openai", model: "gpt-4o" },
  { provider: "minimax", model: "minimax-m2" },
  { provider: "deepseek", model: "deepseek-v3" },
];

const ERROR_REASONS = [
  "rate_limited",
  "upstream_timeout",
  "quota_exhausted",
  "auth_refresh_failed",
];

export const MOCK_TOOL_TYPES = ["bash", "read", "edit", "search", "web", "mcp", "agent", "gitnexus", "browser", "git", "docker"];

/**
 * 1. Enriched Edge Cases Deck: 17 real edge-case conditions with personality-matched gear.
 */
export const CASE_DECK = [
  {
    name: "01 · Sleeping (Dozing Shiba)",
    state: "done",
    ageMs: 38000,
    skin: "skin_0", // cyber_suit
    props: ["prop_100"], // espresso_station
    pet: "pet_50", // dozing_shiba
    aura: "none",
    trophy: "none",
  },
  {
    name: "02 · Happy (Celebration)",
    state: "done",
    ageMs: 9000,
    cost: 1.42,
    skin: "skin_200", // celestial_astro
    props: ["prop_200"], // arcade_cabinet
    pet: "pet_1", // cyber_cat
    aura: "aura_25", // plasma_ring
    trophy: "trophy_0", // golden_key
  },
  {
    name: "03 · Pending (Drone Thinking)",
    state: "pending",
    ageMs: 2500,
    tools: ["todo"],
    skin: "skin_100", // stealth_ninja
    props: ["prop_50"], // dual_monitor
    pet: "pet_100", // hover_drone
    aura: "none",
    trophy: "none",
  },
  {
    name: "04 · GitNexus (Matrix Rain)",
    state: "streaming",
    ageMs: 14000,
    tools: ["gitnexus", "read"],
    skin: "skin_150", // matrix_hacker
    props: ["prop_0"], // supercomputer
    pet: "pet_150", // cyber_owl
    aura: "aura_0", // matrix_rain
    trophy: "trophy_25", // silicon_wafer
  },
  {
    name: "05 · Docker (Quantum Mist)",
    state: "streaming",
    ageMs: 15000,
    tools: ["docker", "bash"],
    skin: "skin_50", // mecha_pilot
    props: ["prop_50"], // dual_monitor
    pet: "pet_1", // cyber_cat
    aura: "aura_50", // quantum_mist
    trophy: "none",
  },
  {
    name: "06 · Browser (Holo Emitter)",
    state: "streaming",
    ageMs: 16000,
    tools: ["browser", "web"],
    skin: "skin_1", // cyber_suit
    props: ["prop_150"], // hologram_emitter
    pet: "pet_100", // hover_drone
    aura: "aura_75", // glitch_halo
    trophy: "trophy_50", // quantum_crystal
  },
  {
    name: "07 · Git+Agent (Arcade Diamond)",
    state: "streaming",
    ageMs: 12000,
    tools: ["git", "agent"],
    concurrent: 4,
    skin: "skin_51", // mecha_pilot
    props: ["prop_200"], // arcade_cabinet
    pet: "pet_50", // dozing_shiba
    aura: "aura_25", // plasma_ring
    trophy: "trophy_75", // diamond_bug
  },
  {
    name: "08 · Rate Limited (Oscilloscope)",
    state: "error",
    ageMs: 6000,
    error: "rate_limited",
    skin: "skin_101", // stealth_ninja
    props: ["prop_300"], // lab_oscilloscope
    pet: "pet_150", // cyber_owl
    aura: "aura_75", // glitch_halo
    trophy: "trophy_50", // quantum_crystal
  },
  {
    name: "09 · Upstream Timeout (Bonsai)",
    state: "error",
    ageMs: 30000,
    error: "upstream_timeout",
    skin: "skin_201", // celestial_astro
    props: ["prop_250"], // terrarium_bonsai
    pet: "pet_100", // hover_drone
    aura: "none",
    trophy: "none",
  },
  {
    name: "10 · Quota Exhausted (Server)",
    state: "error",
    ageMs: 8000,
    error: "quota_exhausted",
    skin: "skin_151", // matrix_hacker
    props: ["prop_0"], // supercomputer
    pet: "pet_1", // cyber_cat
    aura: "aura_0", // matrix_rain
    trophy: "none",
  },
  {
    name: "11 · Auth Failed (Ninja Spark)",
    state: "error",
    ageMs: 5000,
    error: "auth_refresh_failed",
    skin: "skin_100", // stealth_ninja
    props: ["prop_100"], // espresso_station
    pet: "pet_50", // dozing_shiba
    aura: "aura_75", // glitch_halo
    trophy: "none",
  },
  {
    name: "12 · Fallback 1 (Espresso Station)",
    state: "streaming",
    ageMs: 13000,
    tools: ["bash"],
    fallbackShift: 3,
    skin: "skin_0", // cyber_suit
    props: ["prop_100"], // espresso_station
    pet: "pet_1", // cyber_cat
    aura: "aura_50", // quantum_mist
    trophy: "trophy_0", // golden_key
  },
  {
    name: "13 · Fallback 2 (Holo + Key)",
    state: "streaming",
    ageMs: 14000,
    tools: ["browser", "mcp"],
    fallbackShift: 2,
    skin: "skin_50", // mecha_pilot
    props: ["prop_150"], // hologram_emitter
    pet: "pet_150", // cyber_owl
    aura: "aura_25", // plasma_ring
    trophy: "trophy_0", // golden_key
  },
  {
    name: "14 · Slow Task (DualMon + Owl)",
    state: "streaming",
    ageMs: 36000,
    tools: ["docker"],
    skin: "skin_152", // matrix_hacker
    props: ["prop_50"], // dual_monitor
    pet: "pet_150", // cyber_owl
    aura: "aura_0", // matrix_rain
    trophy: "trophy_25", // silicon_wafer
  },
  {
    name: "15 · Queue+Cached (Bonsai Master)",
    state: "streaming",
    ageMs: 10000,
    tools: ["read", "search"],
    concurrent: 5,
    cachedBoost: true,
    skin: "skin_202", // celestial_astro
    props: ["prop_250"], // terrarium_bonsai
    pet: "pet_50", // dozing_shiba
    aura: "aura_50", // quantum_mist
    trophy: "trophy_50", // quantum_crystal
  },
  {
    name: "16 · Runaway Loop (Oscilloscope)",
    state: "streaming",
    ageMs: 18000,
    tools: ["bash"],
    isLooping: true,
    skin: "skin_102", // stealth_ninja
    props: ["prop_300"], // lab_oscilloscope
    pet: "pet_1", // cyber_cat
    aura: "aura_75", // glitch_halo
    trophy: "trophy_75", // diamond_bug
  },
  {
    name: "17 · Expensive Task (Arcade Bug)",
    state: "done",
    ageMs: 20000,
    cost: 7.35,
    skin: "skin_52", // mecha_pilot
    props: ["prop_200", "prop_0"], // arcade + supercomputer
    pet: "pet_100", // hover_drone
    aura: "aura_25", // plasma_ring
    trophy: "trophy_75", // diamond_bug
  },
];

/**
 * 2. Comprehensive Showcase Deck: 24 workstations covering 100% of archetypes across all categories.
 */
export const SHOWCASE_ALL_DECK = [
  {
    name: "01 · CyberSuit · Server · Cat",
    state: "streaming",
    ageMs: 14000,
    tools: ["gitnexus", "read"],
    skin: "skin_0", // cyber_suit
    props: ["prop_0"], // supercomputer
    pet: "pet_1", // cyber_cat
    aura: "aura_25", // plasma_ring
    trophy: "trophy_0", // golden_key
  },
  {
    name: "02 · MechaPilot · DualMon · Shiba",
    state: "streaming",
    ageMs: 16000,
    tools: ["docker", "bash"],
    skin: "skin_50", // mecha_pilot
    props: ["prop_50"], // dual_monitor
    pet: "pet_50", // dozing_shiba
    aura: "aura_50", // quantum_mist
    trophy: "trophy_25", // silicon_wafer
  },
  {
    name: "03 · StealthNinja · Espresso · Drone",
    state: "happy",
    ageMs: 9000,
    cost: 1.45,
    tools: ["edit"],
    skin: "skin_100", // stealth_ninja
    props: ["prop_100"], // espresso_station
    pet: "pet_100", // hover_drone
    aura: "aura_75", // glitch_halo
    trophy: "trophy_50", // quantum_crystal
  },
  {
    name: "04 · MatrixHacker · Holo · Owl",
    state: "streaming",
    ageMs: 18000,
    tools: ["browser", "web"],
    skin: "skin_150", // matrix_hacker
    props: ["prop_150"], // hologram_emitter
    pet: "pet_150", // cyber_owl
    aura: "aura_0", // matrix_rain
    trophy: "trophy_75", // diamond_bug
  },
  {
    name: "05 · CelestialAstro · Arcade · Cat",
    state: "happy",
    ageMs: 11000,
    cost: 2.1,
    tools: ["bash"],
    skin: "skin_200", // celestial_astro
    props: ["prop_200"], // arcade_cabinet
    pet: "pet_2", // cyber_cat
    aura: "aura_25", // plasma_ring
    trophy: "trophy_0", // golden_key
  },
  {
    name: "06 · CyberSuit · Bonsai + Server",
    state: "pending",
    ageMs: 2400,
    tools: ["todo"],
    skin: "skin_1", // cyber_suit
    props: ["prop_250", "prop_1"], // terrarium_bonsai + supercomputer
    pet: "pet_51", // dozing_shiba
    aura: "aura_50", // quantum_mist
    trophy: "trophy_25", // silicon_wafer
  },
  {
    name: "07 · MechaPilot · Oscilloscope · Drone",
    state: "streaming",
    ageMs: 22000,
    tools: ["agent", "git"],
    skin: "skin_51", // mecha_pilot
    props: ["prop_300"], // lab_oscilloscope
    pet: "pet_101", // hover_drone
    aura: "aura_75", // glitch_halo
    trophy: "trophy_50", // quantum_crystal
  },
  {
    name: "08 · StealthNinja · DualMon + Espresso",
    state: "streaming",
    ageMs: 15000,
    tools: ["read", "search"],
    skin: "skin_101", // stealth_ninja
    props: ["prop_51", "prop_101"], // dual_monitor + espresso
    pet: "pet_151", // cyber_owl
    aura: "aura_0", // matrix_rain
    trophy: "trophy_75", // diamond_bug
  },
  {
    name: "09 · MatrixHacker · Oscilloscope (Loop)",
    state: "streaming",
    ageMs: 19000,
    tools: ["bash"],
    isLooping: true,
    skin: "skin_151", // matrix_hacker
    props: ["prop_301"], // lab_oscilloscope
    pet: "pet_3", // cyber_cat
    aura: "aura_25", // plasma_ring
    trophy: "trophy_0", // golden_key
  },
  {
    name: "10 · CelestialAstro · Holo · Shiba",
    state: "streaming",
    ageMs: 13000,
    tools: ["mcp", "bash"],
    skin: "skin_201", // celestial_astro
    props: ["prop_151"], // hologram_emitter
    pet: "pet_52", // dozing_shiba
    aura: "aura_50", // quantum_mist
    trophy: "trophy_25", // silicon_wafer
  },
  {
    name: "11 · CyberSuit · Arcade · Drone",
    state: "streaming",
    ageMs: 21000,
    tools: ["docker"],
    skin: "skin_2", // cyber_suit
    props: ["prop_201"], // arcade_cabinet
    pet: "pet_102", // hover_drone
    aura: "aura_75", // glitch_halo
    trophy: "trophy_50", // quantum_crystal
  },
  {
    name: "12 · MechaPilot · Bonsai · Owl (Sleep)",
    state: "done",
    ageMs: 39000,
    skin: "skin_52", // mecha_pilot
    props: ["prop_251"], // terrarium_bonsai
    pet: "pet_152", // cyber_owl
    aura: "aura_0", // matrix_rain
    trophy: "trophy_75", // diamond_bug
  },
  {
    name: "13 · StealthNinja · Server (Error)",
    state: "error",
    ageMs: 6500,
    error: "rate_limited",
    skin: "skin_102", // stealth_ninja
    props: ["prop_2"], // supercomputer
    pet: "pet_1", // cyber_cat
    aura: "aura_26", // plasma_ring
    trophy: "trophy_1", // golden_key
  },
  {
    name: "14 · MatrixHacker · DualMon · Shiba",
    state: "streaming",
    ageMs: 12000,
    tools: ["web", "read"],
    skin: "skin_152", // matrix_hacker
    props: ["prop_52"], // dual_monitor
    pet: "pet_50", // dozing_shiba
    aura: "aura_51", // quantum_mist
    trophy: "trophy_26", // silicon_wafer
  },
  {
    name: "15 · CelestialAstro · Espresso · Drone",
    state: "happy",
    ageMs: 8500,
    cost: 3.2,
    tools: ["git"],
    skin: "skin_202", // celestial_astro
    props: ["prop_102"], // espresso_station
    pet: "pet_100", // hover_drone
    aura: "aura_76", // glitch_halo
    trophy: "trophy_51", // quantum_crystal
  },
  {
    name: "16 · CyberSuit · Holo · Owl",
    state: "streaming",
    ageMs: 17000,
    tools: ["bash", "edit"],
    skin: "skin_0", // cyber_suit
    props: ["prop_152"], // hologram_emitter
    pet: "pet_150", // cyber_owl
    aura: "aura_1", // matrix_rain
    trophy: "trophy_76", // diamond_bug
  },
  {
    name: "17 · MechaPilot · Arcade · Cat",
    state: "streaming",
    ageMs: 14000,
    tools: ["agent", "gitnexus"],
    skin: "skin_50", // mecha_pilot
    props: ["prop_202"], // arcade_cabinet
    pet: "pet_2", // cyber_cat
    aura: "aura_27", // plasma_ring
    trophy: "trophy_2", // golden_key
  },
  {
    name: "18 · StealthNinja · Bonsai · Shiba",
    state: "pending",
    ageMs: 2200,
    tools: ["todo"],
    skin: "skin_100", // stealth_ninja
    props: ["prop_252"], // terrarium_bonsai
    pet: "pet_51", // dozing_shiba
    aura: "aura_52", // quantum_mist
    trophy: "trophy_27", // silicon_wafer
  },
  {
    name: "19 · MatrixHacker · Oscilloscope · Drone",
    state: "streaming",
    ageMs: 16000,
    tools: ["docker", "mcp"],
    skin: "skin_150", // matrix_hacker
    props: ["prop_302"], // lab_oscilloscope
    pet: "pet_101", // hover_drone
    aura: "aura_77", // glitch_halo
    trophy: "trophy_52", // quantum_crystal
  },
  {
    name: "20 · CelestialAstro · Server · Owl",
    state: "streaming",
    ageMs: 25000,
    tools: ["read", "bash"],
    skin: "skin_200", // celestial_astro
    props: ["prop_0"], // supercomputer
    pet: "pet_151", // cyber_owl
    aura: "aura_2", // matrix_rain
    trophy: "trophy_77", // diamond_bug
  },
  {
    name: "21 · CyberSuit · DualMon + Arcade",
    state: "happy",
    ageMs: 9500,
    cost: 4.5,
    tools: ["gitnexus"],
    skin: "skin_1", // cyber_suit
    props: ["prop_50", "prop_200"], // dual_monitor + arcade
    pet: "pet_1", // cyber_cat
    aura: "aura_25", // plasma_ring
    trophy: "trophy_0", // golden_key
  },
  {
    name: "22 · MechaPilot · Espresso + Holo",
    state: "streaming",
    ageMs: 13500,
    tools: ["web", "mcp"],
    skin: "skin_51", // mecha_pilot
    props: ["prop_100", "prop_150"], // espresso + holo
    pet: "pet_50", // dozing_shiba
    aura: "aura_50", // quantum_mist
    trophy: "trophy_25", // silicon_wafer
  },
  {
    name: "23 · StealthNinja · Oscilloscope + Server",
    state: "streaming",
    ageMs: 15500,
    tools: ["agent", "bash"],
    skin: "skin_101", // stealth_ninja
    props: ["prop_300", "prop_1"], // oscilloscope + supercomputer
    pet: "pet_100", // hover_drone
    aura: "aura_75", // glitch_halo
    trophy: "trophy_50", // quantum_crystal
  },
  {
    name: "24 · MatrixHacker · Bonsai + DualMon",
    state: "streaming",
    ageMs: 17500,
    tools: ["git", "edit"],
    skin: "skin_151", // matrix_hacker
    props: ["prop_250", "prop_51"], // bonsai + dual_monitor
    pet: "pet_150", // cyber_owl
    aura: "aura_0", // matrix_rain
    trophy: "trophy_75", // diamond_bug
  },
];

/**
 * 3. Skins Showcase: 15 agents comparing 5 archetypes in 3 colorways each.
 */
export const SHOWCASE_SKINS_DECK = [
  { name: "Neon Enforcer (Visor)", skin: "skin_0", state: "streaming", ageMs: 12000, tools: ["bash"], props: ["prop_50"] },
  { name: "Crimson Striker (Monocle)", skin: "skin_1", state: "streaming", ageMs: 14000, tools: ["read"], props: ["prop_100"] },
  { name: "Electric Specter (Horns)", skin: "skin_3", state: "happy", ageMs: 9000, tools: ["edit"], props: ["prop_200"] },
  { name: "Obsidian Ronin (Kabuto)", skin: "skin_7", state: "pending", ageMs: 2500, tools: ["todo"], props: ["prop_250"] },
  { name: "Apex Frame (V-Fin)", skin: "skin_10", state: "streaming", ageMs: 16000, tools: ["docker"], props: ["prop_0"] },
  { name: "Heavy Colossus (Blast)", skin: "skin_11", state: "streaming", ageMs: 18000, tools: ["agent"], props: ["prop_150"] },
  { name: "Berserk EVA (Horn)", skin: "skin_12", state: "streaming", ageMs: 15000, tools: ["search"], props: ["prop_300"] },
  { name: "Shadow Shinobi (Headband)", skin: "skin_20", state: "streaming", ageMs: 13000, tools: ["gitnexus"], props: ["prop_250"] },
  { name: "Kage Oni (Demon Mask)", skin: "skin_22", state: "streaming", ageMs: 15000, tools: ["search"], props: ["prop_51"] },
  { name: "Cyber Kasa (Conical Hat)", skin: "skin_24", state: "done", ageMs: 38000, props: ["prop_101"] },
  { name: "Root Netrunner (Hoodie)", skin: "skin_30", state: "streaming", ageMs: 17000, tools: ["web"], props: ["prop_0"] },
  { name: "Binary Coder (VR Goggles)", skin: "skin_31", state: "streaming", ageMs: 19000, tools: ["bash"], isLooping: true, props: ["prop_301"] },
  { name: "Cablehead (Dreadlocks)", skin: "skin_37", state: "streaming", ageMs: 11000, tools: ["mcp"], props: ["prop_151"] },
  { name: "Solar Voyager (Bubble Dome)", skin: "skin_40", state: "happy", ageMs: 8000, tools: ["git"], props: ["prop_201"] },
  { name: "Nebula Drifter (Saturn Ring)", skin: "skin_43", state: "error", ageMs: 6000, error: "rate_limited", props: ["prop_52"] },
];

/**
 * 4. Tech Props Showcase: 14 workstations comparing all 7 props (single & dual setups).
 */
export const SHOWCASE_PROPS_DECK = [
  { name: "Supercomputer Solo", props: ["prop_0"], skin: "skin_0", state: "streaming", ageMs: 12000, tools: ["docker"] },
  { name: "Supercomputer + DualMon", props: ["prop_0", "prop_50"], skin: "skin_50", state: "streaming", ageMs: 15000, tools: ["bash"] },
  { name: "Dual Monitor Solo", props: ["prop_50"], skin: "skin_100", state: "streaming", ageMs: 14000, tools: ["read"] },
  { name: "DualMon + Espresso", props: ["prop_50", "prop_100"], skin: "skin_150", state: "happy", ageMs: 9000, tools: ["edit"] },
  { name: "Espresso Station Solo", props: ["prop_100"], skin: "skin_200", state: "streaming", ageMs: 16000, tools: ["web"] },
  { name: "Espresso + Holo", props: ["prop_100", "prop_150"], skin: "skin_1", state: "streaming", ageMs: 18000, tools: ["agent"] },
  { name: "Hologram Emitter Solo", props: ["prop_150"], skin: "skin_51", state: "streaming", ageMs: 13000, tools: ["gitnexus"] },
  { name: "Holo + Arcade", props: ["prop_150", "prop_200"], skin: "skin_101", state: "happy", ageMs: 11000, tools: ["git"] },
  { name: "Arcade Cabinet Solo", props: ["prop_200"], skin: "skin_151", state: "streaming", ageMs: 17000, tools: ["bash"] },
  { name: "Arcade + Bonsai", props: ["prop_200", "prop_250"], skin: "skin_201", state: "pending", ageMs: 2500, tools: ["todo"] },
  { name: "Terrarium Bonsai Solo", props: ["prop_250"], skin: "skin_2", state: "done", ageMs: 38000 },
  { name: "Bonsai + Oscilloscope", props: ["prop_250", "prop_300"], skin: "skin_52", state: "streaming", ageMs: 20000, tools: ["docker"] },
  { name: "Lab Oscilloscope Solo", props: ["prop_300"], skin: "skin_102", state: "streaming", ageMs: 19000, tools: ["bash"], isLooping: true },
  { name: "Oscilloscope + Server", props: ["prop_300", "prop_0"], skin: "skin_152", state: "error", ageMs: 6000, error: "rate_limited" },
];

/**
 * 5. Pets Showcase: 12 workstations with all 4 companions.
 */
export const SHOWCASE_PETS_DECK = [
  { name: "Cyber Cat (Cozy)", pet: "pet_1", skin: "skin_0", state: "streaming", ageMs: 12000, tools: ["bash"] },
  { name: "Cyber Cat (Playful)", pet: "pet_2", skin: "skin_50", state: "happy", ageMs: 9000, tools: ["edit"] },
  { name: "Cyber Cat (Sleeping)", pet: "pet_3", skin: "skin_100", state: "done", ageMs: 38000 },
  { name: "Dozing Shiba (Golden)", pet: "pet_50", skin: "skin_150", state: "streaming", ageMs: 14000, tools: ["read"] },
  { name: "Dozing Shiba (Alert)", pet: "pet_51", skin: "skin_200", state: "happy", ageMs: 10000, tools: ["git"] },
  { name: "Dozing Shiba (Resting)", pet: "pet_52", skin: "skin_1", state: "pending", ageMs: 2400, tools: ["todo"] },
  { name: "Hover Drone (Orbital)", pet: "pet_100", skin: "skin_51", state: "streaming", ageMs: 16000, tools: ["docker"] },
  { name: "Hover Drone (Patrol)", pet: "pet_101", skin: "skin_101", state: "streaming", ageMs: 18000, tools: ["agent"] },
  { name: "Hover Drone (Recon)", pet: "pet_102", skin: "skin_151", state: "error", ageMs: 6500, error: "quota_exhausted" },
  { name: "Cyber Owl (Clockwork)", pet: "pet_150", skin: "skin_201", state: "streaming", ageMs: 13000, tools: ["web"] },
  { name: "Cyber Owl (Wisdom)", pet: "pet_151", skin: "skin_2", state: "happy", ageMs: 8500, tools: ["gitnexus"] },
  { name: "Cyber Owl (Night Watch)", pet: "pet_152", skin: "skin_52", state: "streaming", ageMs: 22000, tools: ["mcp"] },
];

/**
 * 6. Particle Auras Showcase: 12 workstations glowing with all 4 aura archetypes.
 */
export const SHOWCASE_AURAS_DECK = [
  { name: "Matrix Rain (Laser Green)", aura: "aura_0", skin: "skin_150", state: "streaming", ageMs: 14000, tools: ["gitnexus"] },
  { name: "Matrix Rain (Emerald)", aura: "aura_1", skin: "skin_151", state: "streaming", ageMs: 17000, tools: ["bash"], isLooping: true },
  { name: "Matrix Rain (Jade)", aura: "aura_2", skin: "skin_152", state: "happy", ageMs: 9000, tools: ["read"] },
  { name: "Plasma Ring (Cyan Orbit)", aura: "aura_25", skin: "skin_0", state: "streaming", ageMs: 13000, tools: ["web"] },
  { name: "Plasma Ring (Electric)", aura: "aura_26", skin: "skin_1", state: "happy", ageMs: 11000, tools: ["edit"] },
  { name: "Plasma Ring (Cosmic)", aura: "aura_27", skin: "skin_2", state: "pending", ageMs: 2500, tools: ["todo"] },
  { name: "Quantum Mist (Nebula)", aura: "aura_50", skin: "skin_50", state: "streaming", ageMs: 15000, tools: ["docker"] },
  { name: "Quantum Mist (Violet)", aura: "aura_51", skin: "skin_51", state: "streaming", ageMs: 18000, tools: ["agent"] },
  { name: "Quantum Mist (Astral)", aura: "aura_52", skin: "skin_52", state: "done", ageMs: 38000 },
  { name: "Glitch Halo (Prismatic)", aura: "aura_75", skin: "skin_100", state: "streaming", ageMs: 16000, tools: ["mcp"] },
  { name: "Glitch Halo (Amber Shock)", aura: "aura_76", skin: "skin_101", state: "error", ageMs: 6000, error: "rate_limited" },
  { name: "Glitch Halo (Neon Spark)", aura: "aura_77", skin: "skin_102", state: "streaming", ageMs: 20000, tools: ["git"] },
];

/**
 * 7. Trophies Showcase: 12 workstations displaying all 4 trophy models on obsidian pedestals.
 */
export const SHOWCASE_TROPHIES_DECK = [
  { name: "Golden Key (Master)", trophy: "trophy_0", skin: "skin_0", state: "happy", ageMs: 9000, cost: 2.5, tools: ["edit"] },
  { name: "Golden Key (Champion)", trophy: "trophy_1", skin: "skin_1", state: "streaming", ageMs: 14000, tools: ["bash"] },
  { name: "Golden Key (Honor)", trophy: "trophy_2", skin: "skin_2", state: "pending", ageMs: 2500, tools: ["todo"] },
  { name: "Silicon Wafer (3nm)", trophy: "trophy_25", skin: "skin_50", state: "streaming", ageMs: 16000, tools: ["docker"] },
  { name: "Silicon Wafer (Nanometer)", trophy: "trophy_26", skin: "skin_51", state: "happy", ageMs: 10000, cost: 3.1, tools: ["git"] },
  { name: "Silicon Wafer (Quantum)", trophy: "trophy_27", skin: "skin_52", state: "streaming", ageMs: 19000, tools: ["read"] },
  { name: "Quantum Crystal (Prism)", trophy: "trophy_50", skin: "skin_100", state: "streaming", ageMs: 13000, tools: ["gitnexus"] },
  { name: "Quantum Crystal (Facet)", trophy: "trophy_51", skin: "skin_101", state: "happy", ageMs: 8500, cost: 1.8, tools: ["web"] },
  { name: "Quantum Crystal (Pillar)", trophy: "trophy_52", skin: "skin_102", state: "done", ageMs: 38000 },
  { name: "Diamond Bug (Zero-Day)", trophy: "trophy_75", skin: "skin_150", state: "streaming", ageMs: 15000, tools: ["agent"] },
  { name: "Diamond Bug (Flawless)", trophy: "trophy_76", skin: "skin_151", state: "streaming", ageMs: 18000, tools: ["bash"], isLooping: true },
  { name: "Diamond Bug (Exalted)", trophy: "trophy_77", skin: "skin_152", state: "error", ageMs: 6500, error: "rate_limited" },
];

function createRandom(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

function pick(rand, list) {
  return list[Math.floor(rand() * list.length) % list.length];
}

function accountTarget(index) {
  return PROVIDER_MODELS[index % PROVIDER_MODELS.length];
}

function randomTokens(rand) {
  return {
    input: Math.round(400 + rand() * 14000),
    output: Math.round(80 + rand() * 2900),
    cached: Math.round(rand() * 6000),
  };
}

export function generateMockTraces({ count = null, errorRatio = 0, seed = 42, now = Date.now(), cases = false, preset = null } = {}) {
  let activeDeck = null;
  if (preset === "showcase" || preset === "items") {
    activeDeck = SHOWCASE_ALL_DECK;
  } else if (preset === "showcase_skins") {
    activeDeck = SHOWCASE_SKINS_DECK;
  } else if (preset === "showcase_props") {
    activeDeck = SHOWCASE_PROPS_DECK;
  } else if (preset === "showcase_pets") {
    activeDeck = SHOWCASE_PETS_DECK;
  } else if (preset === "showcase_auras") {
    activeDeck = SHOWCASE_AURAS_DECK;
  } else if (preset === "showcase_trophies") {
    activeDeck = SHOWCASE_TROPHIES_DECK;
  } else if (cases || preset === "cases") {
    activeDeck = CASE_DECK;
  }

  const effectiveCount = count !== null && count !== undefined ? count : (activeDeck ? activeDeck.length : 8);
  const rand = createRandom(seed);
  const traces = [];

  for (let i = 0; i < effectiveCount; i += 1) {
    const client = CLIENTS[i % CLIENTS.length];
    const cycle = Math.floor(i / CLIENTS.length) + 1;
    const defaultAccount = cycle > 1 ? `${client.account} ${cycle}` : client.account;
    const connectionId = `mock-conn-${i}`;
    const target = accountTarget(i);
    const deck = activeDeck ? activeDeck[i % activeDeck.length] : null;
    const account = deck?.name || defaultAccount;
    const randAge = Math.floor(rand() * 40000);
    const randErr = rand() < errorRatio;
    const ageMs = deck ? deck.ageMs : randAge;
    const startedAt = now - ageMs;
    const isError = deck ? deck.state === "error" : randErr;
    const isLooping = Boolean(deck?.isLooping || (errorRatio > 0.4 && i === 0));

    const ageRatio = ageMs / 40000;
    let state;
    if (isLooping) state = "streaming";
    else if (deck) state = deck.state;
    else if (isError) state = "error";
    else if (ageRatio < 0.25) state = "pending";
    else if (ageRatio < 0.6) state = "streaming";
    else state = "done";

    const tokens = randomTokens(rand);
    const toolRand = createRandom(seed * 7919 + i * 104729 + 13);
    const toolCount = state === "done" ? 0 : 1 + Math.floor(toolRand() * 3);
    const toolPick = [];
    for (let k = 0; k < toolCount; k += 1) {
      toolPick.push(MOCK_TOOL_TYPES[Math.floor(toolRand() * MOCK_TOOL_TYPES.length)]);
    }
    const toolNames = isLooping ? ["bash"] : (deck?.tools ?? (state === "error" ? [] : toolPick));
    const toolCalls = [];
    for (const tool of toolNames) {
      if (!toolCalls.some((c) => c.tool === tool)) {
        toolCalls.push({ tool, state: toolCalls.length === 0 ? "running" : "queued" });
      }
    }

    const wantsFallback = deck ? !!deck.fallbackShift : toolRand() < 0.28;
    const fallbackProvider = PROVIDER_MODELS[(i + (deck?.fallbackShift ?? 3)) % PROVIDER_MODELS.length].provider;
    const fallback =
      wantsFallback && (state === "pending" || state === "streaming") && fallbackProvider !== target.provider
        ? { from: fallbackProvider }
        : null;

    const concurrent = deck?.concurrent ?? (state === "done" || state === "error" ? 1 : 1 + Math.floor(toolRand() * 3));
    if (deck?.cachedBoost) tokens.cached = 14000;

    // Realistic mock logs
    const logs = [];
    const baseTime = startedAt || (now - 20000);
    logs.push({
      timestamp: new Date(baseTime).toLocaleTimeString(),
      type: "prompt",
      summary: "User Prompt",
      detail: `Execute pipeline for ${account} (${target.model})`,
    });

    if (isLooping) {
      for (let j = 0; j < 6; j++) {
        logs.push({
          timestamp: new Date(baseTime + 2000 + j * 2000).toLocaleTimeString(),
          type: "bash",
          summary: "run_command",
          detail: "npm test -- --bail (failed exit 1)",
        });
      }
      logs.push({
        timestamp: new Date(now).toLocaleTimeString(),
        type: "error",
        summary: "Loop Warning",
        detail: "Runaway loop detected: 6 consecutive identical tool failures",
      });
    } else {
      toolNames.forEach((tName, idx) => {
        logs.push({
          timestamp: new Date(baseTime + 1500 + idx * 2500).toLocaleTimeString(),
          type: tName,
          summary: tName,
          detail: `${tName} operation completed`,
        });
      });
      if (isError) {
        logs.push({
          timestamp: new Date(now).toLocaleTimeString(),
          type: "error",
          summary: "Error",
          detail: deck?.error || "Upstream rate limit or timeout",
        });
      }
    }

    traces.push({
      traceId: `mock-${i}-${Math.floor(rand() * 1e6).toString(36)}`,
      cli: "mock",
      connectionId,
      account,
      model: target.model,
      provider: target.provider,
      state,
      startedAt,
      elapsedMs: ageMs,
      tokens,
      cost: deck?.cost ?? Math.round((tokens.input * 0.000015 + tokens.output * 0.00006) * 100) / 100,
      status: isLooping || isError ? "error" : "200",
      error: isError ? deck?.error ?? pick(rand, ERROR_REASONS) : (isLooping ? "runaway_loop" : null),
      clientIcon: client.icon,
      toolCalls,
      tools: toolNames,
      activeTool: toolNames[0] || null,
      currentCommand: isLooping ? "npm test -- --bail (looping)" : (toolNames[0] ? `${toolNames[0]} task running...` : null),
      fallback,
      concurrent,
      isLooping,
      skin: deck?.skin ?? null,
      aura: deck?.aura ?? null,
      props: deck?.props ?? [],
      pet: deck?.pet ?? null,
      trophy: deck?.trophy ?? null,
      theme: deck?.theme ?? null,
      logs,
    });
  }

  return traces;
}

export function mockProviderDescriptors(traces) {
  const seen = new Map();
  for (const trace of traces) {
    if (trace.provider && !seen.has(trace.provider)) {
      seen.set(trace.provider, {
        provider: trace.provider,
        name: trace.provider.charAt(0).toUpperCase() + trace.provider.slice(1),
      });
    }
  }
  return [...seen.values()];
}
