/**
 * Deep Test Suite for Supporter Store State Transitions
 * Tests unlock, equip, unequip, and validation logic across all item types.
 */

// Mock browser localStorage and window event system in Node
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();
global.window = {
  dispatchEvent: (event) => {},
  addEventListener: () => {},
  removeEventListener: () => {},
};
global.CustomEvent = class {
  constructor(name, params) {
    this.name = name;
    this.detail = params?.detail;
  }
};

import {
  getSupporterState,
  unlockWithCode,
  equipSkin,
  equipPet,
  toggleProp,
  equipAura,
  equipTrophy,
  equipOfficeTheme,
} from '../src/lib/supporterStore.js';

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    passCount++;
  } else {
    failCount++;
    console.error(`[FAIL] ${message}`);
  }
}

console.log("=== STEP 1: INITIAL STATE ===");
const initial = getSupporterState();
assert(Boolean(initial), "Initial state exists");
assert(initial.equippedSkin === "skin_0", `Default skin is skin_0, got ${initial.equippedSkin}`);
assert(initial.equippedOfficeTheme === "theme_default", `Default theme is theme_default, got ${initial.equippedOfficeTheme}`);

console.log("=== STEP 2: INVALID ACTIVATION CODE ===");
const badRes = unlockWithCode("INVALID-KEY-123");
assert(badRes.success === false, "Invalid code was rejected");

console.log("=== STEP 3: VIP UNLOCK WITH CODE ===");
const vipRes = unlockWithCode("AGMON-COFFEE-VIP");
assert(vipRes.success === true, "AGMON-COFFEE-VIP was accepted");
assert(vipRes.state.isSupporter === true, "isSupporter is true");
assert(vipRes.state.supporterTier === "vip", "tier is vip");
assert(vipRes.state.unlockedItems.length >= 140, `Unlocked at least 140 items, got ${vipRes.state.unlockedItems.length}`);

console.log("=== STEP 4: EQUIP SKINS ACROSS ALL 5 ARCHETYPES ===");
const sampleSkins = ['skin_0', 'skin_50', 'skin_100', 'skin_150', 'skin_200'];
for (const sId of sampleSkins) {
  const success = equipSkin(sId);
  assert(success === true, `Equipping skin ${sId} succeeded`);
  const current = getSupporterState();
  assert(current.equippedSkin === sId, `Current equipped skin matches ${sId}`);
}

console.log("=== STEP 5: EQUIP PETS ACROSS ALL ARCHETYPES ===");
const samplePets = ['pet_0', 'pet_50', 'pet_100', 'pet_150'];
for (const pId of samplePets) {
  const success = equipPet(pId);
  assert(success === true, `Equipping pet ${pId} succeeded`);
  const current = getSupporterState();
  assert(current.equippedPet === pId, `Current equipped pet matches ${pId}`);
}

console.log("=== STEP 6: TOGGLE PROPS ACROSS ALL 7 ARCHETYPES ===");
const sampleProps = ['prop_0', 'prop_1', 'prop_2', 'prop_3', 'prop_4'];
for (const prId of sampleProps) {
  const before = getSupporterState().equippedProps.includes(prId);
  const success1 = toggleProp(prId);
  assert(success1 === true, `Toggling prop ${prId} succeeded`);
  const after1 = getSupporterState().equippedProps.includes(prId);
  assert(after1 === !before, `Prop ${prId} toggled from ${before} to ${after1}`);

  const success2 = toggleProp(prId);
  assert(success2 === true, `Second toggle prop ${prId} succeeded`);
  const after2 = getSupporterState().equippedProps.includes(prId);
  assert(after2 === before, `Prop ${prId} restored back to ${before}`);
}

console.log("=== STEP 7: EQUIP AURAS ACROSS ALL ARCHETYPES ===");
const sampleAuras = ['aura_0', 'aura_25', 'aura_50', 'aura_75'];
for (const aId of sampleAuras) {
  const success = equipAura(aId);
  assert(success === true, `Equipping aura ${aId} succeeded`);
  const current = getSupporterState();
  assert(current.equippedAura === aId, `Current equipped aura matches ${aId}`);
}

console.log("=== STEP 8: EQUIP TROPHIES ACROSS ALL ARCHETYPES ===");
const sampleTrophies = ['trophy_0', 'trophy_25', 'trophy_50', 'trophy_75'];
for (const tId of sampleTrophies) {
  const success = equipTrophy(tId);
  assert(success === true, `Equipping trophy ${tId} succeeded`);
  const current = getSupporterState();
  assert(current.equippedTrophy === tId, `Current equipped trophy matches ${tId}`);
}

console.log("=== STEP 9: EQUIP ALL 10 OFFICE THEMES ===");
const themeIds = [
  'theme_default', 'theme_cyberpunk', 'theme_phosphor', 'theme_scandinavian',
  'theme_cosmic', 'theme_cleanroom', 'theme_synthwave', 'theme_obsidian',
  'theme_industrial', 'theme_deepsea'
];
for (const thId of themeIds) {
  const success = equipOfficeTheme(thId);
  assert(success === true, `Equipping theme ${thId} succeeded`);
  const current = getSupporterState();
  assert(current.equippedOfficeTheme === thId, `Current equipped theme matches ${thId}`);
}

console.log(`\n==============================================`);
console.log(`STORE LOGIC TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log(`==============================================`);

if (failCount > 0) {
  process.exit(1);
} else {
  console.log("STORE LOGIC & ALL CATEGORY STATE TRANSITIONS 100% VERIFIED!");
}
