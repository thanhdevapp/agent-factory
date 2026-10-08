/**
 * Comprehensive Automated Test Suite: All Mock Items & Archetypes Verification
 * Tests:
 * 1. Preset generation across all 7 mock presets (showcase, cases, skins, props, pets, auras, trophies)
 * 2. 100% archetype coverage for all 5 cosmetic categories (24 total archetypes)
 * 3. Exact O(1) item resolution via getItemById
 * 4. Office layout transformation and workstation cosmetic assignment
 */

import assert from "node:assert";
import {
  MOCK_PRESETS,
  generateMockTraces,
  SHOWCASE_ALL_DECK,
  CASE_DECK,
  SHOWCASE_SKINS_DECK,
  SHOWCASE_PROPS_DECK,
  SHOWCASE_PETS_DECK,
  SHOWCASE_AURAS_DECK,
  SHOWCASE_TROPHIES_DECK,
} from "../src/lib/mockTraces.js";
import { getItemById, COSMETIC_CATALOG } from "../src/lib/catalog/index.js";
import { buildOffice } from "../src/components/factory/scene/office-layout.js";

let passed = 0;
let failed = 0;

function it(desc, fn) {
  try {
    fn();
    passed++;
    console.log(`  [PASS] ${desc}`);
  } catch (err) {
    failed++;
    console.error(`  [FAIL] ${desc}:`, err.message);
  }
}

console.log("=== STEP 1: VERIFY ALL SHOWCASE DECKS ===");

it("MOCK_PRESETS defines all 7 showcase & testing presets", () => {
  assert.ok(MOCK_PRESETS.showcase, "showcase preset exists");
  assert.ok(MOCK_PRESETS.cases, "cases preset exists");
  assert.ok(MOCK_PRESETS.showcase_skins, "showcase_skins preset exists");
  assert.ok(MOCK_PRESETS.showcase_props, "showcase_props preset exists");
  assert.ok(MOCK_PRESETS.showcase_pets, "showcase_pets preset exists");
  assert.ok(MOCK_PRESETS.showcase_auras, "showcase_auras preset exists");
  assert.ok(MOCK_PRESETS.showcase_trophies, "showcase_trophies preset exists");
});

it("SHOWCASE_ALL_DECK has exactly 24 workstations with valid items", () => {
  assert.strictEqual(SHOWCASE_ALL_DECK.length, 24);
  for (const item of SHOWCASE_ALL_DECK) {
    assert.ok(item.name, "has name");
    assert.ok(item.skin, "has skin");
    assert.ok(item.pet, "has pet");
    assert.ok(item.props && item.props.length > 0, "has props");
    assert.ok(item.aura, "has aura");
    assert.ok(item.trophy, "has trophy");
  }
});

console.log("\n=== STEP 2: 100% ARCHETYPE COVERAGE IN SHOWCASE DECK ===");

const REQUIRED_SKINS = ["cyber_suit", "mecha_pilot", "stealth_ninja", "matrix_hacker", "celestial_astro"];
const REQUIRED_PROPS = ["supercomputer", "dual_monitor", "espresso_station", "hologram_emitter", "arcade_cabinet", "terrarium_bonsai", "lab_oscilloscope"];
const REQUIRED_PETS = ["cyber_cat", "dozing_shiba", "hover_drone", "cyber_owl"];
const REQUIRED_AURAS = ["matrix_rain", "plasma_ring", "quantum_mist", "glitch_halo"];
const REQUIRED_TROPHIES = ["golden_key", "silicon_wafer", "quantum_crystal", "diamond_bug"];

it("SHOWCASE_ALL_DECK covers all 5 Skin archetypes", () => {
  const found = new Set();
  for (const agent of SHOWCASE_ALL_DECK) {
    const item = getItemById(agent.skin);
    assert.ok(item, `Skin item ${agent.skin} exists`);
    found.add(item.archetype);
  }
  for (const arch of REQUIRED_SKINS) {
    assert.ok(found.has(arch), `Covers skin archetype: ${arch}`);
  }
  assert.strictEqual(found.size, 5);
});

it("SHOWCASE_ALL_DECK covers all 7 Tech Prop archetypes", () => {
  const found = new Set();
  for (const agent of SHOWCASE_ALL_DECK) {
    for (const propId of agent.props) {
      const item = getItemById(propId);
      assert.ok(item, `Prop item ${propId} exists`);
      found.add(item.archetype);
    }
  }
  for (const arch of REQUIRED_PROPS) {
    assert.ok(found.has(arch), `Covers prop archetype: ${arch}`);
  }
  assert.strictEqual(found.size, 7);
});

it("SHOWCASE_ALL_DECK covers all 4 Pet archetypes", () => {
  const found = new Set();
  for (const agent of SHOWCASE_ALL_DECK) {
    const item = getItemById(agent.pet);
    assert.ok(item, `Pet item ${agent.pet} exists`);
    found.add(item.archetype);
  }
  for (const arch of REQUIRED_PETS) {
    assert.ok(found.has(arch), `Covers pet archetype: ${arch}`);
  }
  assert.strictEqual(found.size, 4);
});

it("SHOWCASE_ALL_DECK covers all 4 Aura archetypes", () => {
  const found = new Set();
  for (const agent of SHOWCASE_ALL_DECK) {
    const item = getItemById(agent.aura);
    assert.ok(item, `Aura item ${agent.aura} exists`);
    found.add(item.archetype);
  }
  for (const arch of REQUIRED_AURAS) {
    assert.ok(found.has(arch), `Covers aura archetype: ${arch}`);
  }
  assert.strictEqual(found.size, 4);
});

it("SHOWCASE_ALL_DECK covers all 4 Trophy archetypes", () => {
  const found = new Set();
  for (const agent of SHOWCASE_ALL_DECK) {
    const item = getItemById(agent.trophy);
    assert.ok(item, `Trophy item ${agent.trophy} exists`);
    found.add(item.archetype);
  }
  for (const arch of REQUIRED_TROPHIES) {
    assert.ok(found.has(arch), `Covers trophy archetype: ${arch}`);
  }
  assert.strictEqual(found.size, 4);
});

it("SHOWCASE_ALL_DECK covers all 6 Motion Modes", () => {
  const modes = new Set();
  for (const agent of SHOWCASE_ALL_DECK) {
    if (agent.isLooping) modes.add("looping");
    else if (agent.state === "error") modes.add("error");
    else if (agent.state === "streaming") modes.add("streaming");
    else if (agent.state === "pending") modes.add("pending");
    else if (agent.ageMs >= 32000) modes.add("sleeping");
    else modes.add("happy");
  }
  assert.ok(modes.has("streaming"), "has streaming mode");
  assert.ok(modes.has("happy"), "has happy mode");
  assert.ok(modes.has("pending"), "has pending mode");
  assert.ok(modes.has("sleeping"), "has sleeping mode");
  assert.ok(modes.has("error"), "has error mode");
  assert.ok(modes.has("looping"), "has looping mode");
  assert.strictEqual(modes.size, 6);
});

console.log("\n=== STEP 3: DEDICATED CATEGORY SHOWCASE DECKS ===");

it("SHOWCASE_SKINS_DECK has 15 agents covering all 5 skin archetypes", () => {
  assert.strictEqual(SHOWCASE_SKINS_DECK.length, 15);
  const found = new Set(SHOWCASE_SKINS_DECK.map((a) => getItemById(a.skin)?.archetype));
  for (const arch of REQUIRED_SKINS) {
    assert.ok(found.has(arch), `Skins deck covers ${arch}`);
  }
});

it("SHOWCASE_PROPS_DECK has 14 agents covering all 7 prop archetypes in single & dual", () => {
  assert.strictEqual(SHOWCASE_PROPS_DECK.length, 14);
  const found = new Set();
  for (const a of SHOWCASE_PROPS_DECK) {
    for (const p of a.props) {
      found.add(getItemById(p)?.archetype);
    }
  }
  for (const arch of REQUIRED_PROPS) {
    assert.ok(found.has(arch), `Props deck covers ${arch}`);
  }
});

it("SHOWCASE_PETS_DECK has 12 agents covering all 4 pet archetypes", () => {
  assert.strictEqual(SHOWCASE_PETS_DECK.length, 12);
  const found = new Set(SHOWCASE_PETS_DECK.map((a) => getItemById(a.pet)?.archetype));
  for (const arch of REQUIRED_PETS) {
    assert.ok(found.has(arch), `Pets deck covers ${arch}`);
  }
});

it("SHOWCASE_AURAS_DECK has 12 agents covering all 4 aura archetypes", () => {
  assert.strictEqual(SHOWCASE_AURAS_DECK.length, 12);
  const found = new Set(SHOWCASE_AURAS_DECK.map((a) => getItemById(a.aura)?.archetype));
  for (const arch of REQUIRED_AURAS) {
    assert.ok(found.has(arch), `Auras deck covers ${arch}`);
  }
});

it("SHOWCASE_TROPHIES_DECK has 12 agents covering all 4 trophy archetypes", () => {
  assert.strictEqual(SHOWCASE_TROPHIES_DECK.length, 12);
  const found = new Set(SHOWCASE_TROPHIES_DECK.map((a) => getItemById(a.trophy)?.archetype));
  for (const arch of REQUIRED_TROPHIES) {
    assert.ok(found.has(arch), `Trophies deck covers ${arch}`);
  }
});

it("CASE_DECK (Edge Cases) has 17 cases with assigned items", () => {
  assert.strictEqual(CASE_DECK.length, 17);
  for (const c of CASE_DECK) {
    assert.ok(c.skin || c.props || c.pet || c.aura || c.trophy, `Case ${c.name} has item fields`);
  }
});

console.log("\n=== STEP 4: GENERATEMOCKTRACES PRESET INTEGRATION ===");

it("generateMockTraces({ preset: 'showcase' }) produces 24 complete traces with cosmetics", () => {
  const traces = generateMockTraces({ preset: "showcase" });
  assert.strictEqual(traces.length, 24);
  for (const t of traces) {
    assert.ok(t.connectionId, "has connectionId");
    assert.ok(t.account, "has account name");
    assert.ok(t.skin, "has skin");
    assert.ok(t.aura, "has aura");
    assert.ok(Array.isArray(t.props) && t.props.length > 0, "has props array");
    assert.ok(t.pet, "has pet");
    assert.ok(t.trophy, "has trophy");
  }
});

it("generateMockTraces({ preset: 'cases' }) produces 17 edge case traces", () => {
  const traces = generateMockTraces({ preset: "cases" });
  assert.strictEqual(traces.length, 17);
});

it("generateMockTraces({ preset: 'showcase_skins' }) produces 15 traces", () => {
  const traces = generateMockTraces({ preset: "showcase_skins" });
  assert.strictEqual(traces.length, 15);
});

it("generateMockTraces({ preset: 'showcase_props' }) produces 14 traces", () => {
  const traces = generateMockTraces({ preset: "showcase_props" });
  assert.strictEqual(traces.length, 14);
});

it("generateMockTraces({ preset: 'showcase_pets' }) produces 12 traces", () => {
  const traces = generateMockTraces({ preset: "showcase_pets" });
  assert.strictEqual(traces.length, 12);
});

it("generateMockTraces({ preset: 'showcase_auras' }) produces 12 traces", () => {
  const traces = generateMockTraces({ preset: "showcase_auras" });
  assert.strictEqual(traces.length, 12);
});

it("generateMockTraces({ preset: 'showcase_trophies' }) produces 12 traces", () => {
  const traces = generateMockTraces({ preset: "showcase_trophies" });
  assert.strictEqual(traces.length, 12);
});

console.log("\n=== STEP 5: BUILDOFFICE WORKSTATION TRANSMISSION ===");

it("buildOffice transfers individual cosmetics to each workstation", () => {
  const traces = generateMockTraces({ preset: "showcase" });
  const office = buildOffice(traces);
  assert.strictEqual(office.workstations.length, 24);

  for (const ws of office.workstations) {
    assert.ok(ws.skin, `ws ${ws.connectionId} has skin`);
    assert.ok(ws.aura, `ws ${ws.connectionId} has aura`);
    assert.ok(ws.pet, `ws ${ws.connectionId} has pet`);
    assert.ok(Array.isArray(ws.props) && ws.props.length > 0, `ws ${ws.connectionId} has props`);
    assert.ok(ws.trophy, `ws ${ws.connectionId} has trophy`);
    assert.strictEqual(typeof ws.x, "number");
    assert.strictEqual(typeof ws.y, "number");
    assert.ok(!Number.isNaN(ws.x) && !Number.isNaN(ws.y));
  }
});

console.log("\n==============================================");
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("==============================================");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("ALL MOCK SHOWCASE PRESETS & 24 ARCHETYPES 100% HEALTHY!");
}
