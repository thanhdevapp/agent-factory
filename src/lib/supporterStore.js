"use client";

/**
 * Supporter Store & Cosmetic Customization Engine
 * Manages supporter status, item inventory (1,000 Skins, Props, Pets, Auras, Trophies), and Ambient soundscapes.
 * Persists in localStorage and broadcasts sync events to PixiJS Canvas.
 */

import { COSMETIC_CATALOG } from "./catalog/index.js";

export { COSMETIC_CATALOG };
export const SUPPORTER_STORAGE_KEY = "agmon_supporter_data";
export const SUPPORTER_CHANGE_EVENT = "agmon:supporter-change";

// Collect all free items by default
const FREE_SKIN_IDS = COSMETIC_CATALOG.skins.filter((s) => s.tier === "free").map((s) => s.id);
const FREE_PET_IDS = COSMETIC_CATALOG.pets.filter((p) => p.tier === "free").map((p) => p.id);
const FREE_PROP_IDS = COSMETIC_CATALOG.props.filter((pr) => pr.tier === "free").map((pr) => pr.id);
const FREE_AURA_IDS = (COSMETIC_CATALOG.auras || []).filter((a) => a.tier === "free").map((a) => a.id);
const FREE_TROPHY_IDS = (COSMETIC_CATALOG.trophies || []).filter((t) => t.tier === "free").map((t) => t.id);
const FREE_THEME_IDS = (COSMETIC_CATALOG.officeThemes || []).filter((th) => th.tier === "free").map((th) => th.id);

const DEFAULT_STATE = {
  isSupporter: false,
  supporterTier: "none", // 'none' | 'coffee' | 'meal' | 'vip'
  equippedSkin: "skin_0",
  equippedPet: "pet_0",
  equippedProps: [],
  equippedAura: "none",
  equippedTrophy: "none",
  equippedOfficeTheme: "theme_default",
  ambientSound: "none",
  ambientVolume: 0.35,
  unlockedItems: Array.from(
    new Set([
      "skin_0",
      "pet_0",
      "prop_0",
      "aura_0",
      "trophy_0",
      "theme_default",
      "classic",
      "none",
      ...FREE_SKIN_IDS,
      ...FREE_PET_IDS,
      ...FREE_PROP_IDS,
      ...FREE_AURA_IDS,
      ...FREE_TROPHY_IDS,
      ...FREE_THEME_IDS,
    ])
  ),
};

// Normalize legacy IDs (e.g. classic -> skin_0, none -> pet_0)
function normalizeState(state) {
  if (!state) return DEFAULT_STATE;
  const s = { ...DEFAULT_STATE, ...state };
  if (s.equippedSkin === "classic" || !s.equippedSkin) s.equippedSkin = "skin_0";
  if (s.equippedPet === "none" || !s.equippedPet) s.equippedPet = "pet_0";
  if (!s.equippedAura) s.equippedAura = "none";
  if (!s.equippedTrophy) s.equippedTrophy = "none";
  if (!s.equippedOfficeTheme) s.equippedOfficeTheme = "theme_default";
  if (!Array.isArray(s.unlockedItems)) s.unlockedItems = DEFAULT_STATE.unlockedItems;
  return s;
}

// Read state from localStorage
export function getSupporterState() {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(SUPPORTER_STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch {
    return DEFAULT_STATE;
  }
}

// Save state and dispatch change event
function saveAndNotify(nextState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SUPPORTER_STORAGE_KEY, JSON.stringify(nextState));
    window.dispatchEvent(new CustomEvent(SUPPORTER_CHANGE_EVENT, { detail: nextState }));
  } catch (err) {
    console.error("[SupporterStore] Save error:", err);
  }
}

// Unlock via code (Supporter Key / Coupon Code)
export function unlockWithCode(code) {
  const c = String(code || "").trim().toUpperCase();
  if (!c) return { success: false, message: "Please enter an activation code." };

  const validCodes = [
    "AGMON-COFFEE-VIP",
    "AGMON-DEV-VIP",
    "SUPPORTER-2026",
    "DEV-BUFF-NIGHT",
    "VIETQR-VIP",
  ];

  const isValid = validCodes.includes(c) || c.endsWith("-VIP") || c.endsWith("-SUPPORTER");

  if (isValid) {
    const current = getSupporterState();
    const allSkins = COSMETIC_CATALOG.skins.map((s) => s.id);
    const allPets = COSMETIC_CATALOG.pets.map((p) => p.id);
    const allProps = COSMETIC_CATALOG.props.map((pr) => pr.id);
    const allAuras = (COSMETIC_CATALOG.auras || []).map((a) => a.id);
    const allTrophies = (COSMETIC_CATALOG.trophies || []).map((t) => t.id);
    const allUnlocked = Array.from(
      new Set([
        ...current.unlockedItems,
        ...allSkins,
        ...allPets,
        ...allProps,
        ...allAuras,
        ...allTrophies,
      ])
    );

    const nextState = {
      ...current,
      isSupporter: true,
      supporterTier: "vip",
      unlockedItems: allUnlocked,
      equippedSkin: current.equippedSkin === "classic" || !current.equippedSkin ? "skin_0" : current.equippedSkin,
      equippedPet: current.equippedPet === "none" || !current.equippedPet ? "pet_0" : current.equippedPet,
      equippedProps: Array.from(new Set([...current.equippedProps, "prop_0", "prop_1"])),
    };

    saveAndNotify(nextState);
    return {
      success: true,
      message: "Congratulations! You have unlocked all 1,000 items and VIP Supporter status.",
      state: nextState,
    };
  }

  return { success: false, message: "Invalid activation code. Please check and try again." };
}

// Equip Skin
export function equipSkin(skinId) {
  const current = getSupporterState();
  const isFree = COSMETIC_CATALOG.skins.find((s) => s.id === skinId)?.tier === "free";
  if (!current.unlockedItems.includes(skinId) && !current.isSupporter && !isFree && skinId !== "skin_0") {
    return false;
  }
  const next = { ...current, equippedSkin: skinId };
  saveAndNotify(next);
  return true;
}

// Equip Pet
export function equipPet(petId) {
  const current = getSupporterState();
  const isFree = COSMETIC_CATALOG.pets.find((p) => p.id === petId)?.tier === "free";
  if (!current.unlockedItems.includes(petId) && !current.isSupporter && !isFree && petId !== "pet_0") {
    return false;
  }
  const next = { ...current, equippedPet: petId };
  saveAndNotify(next);
  return true;
}

// Toggle Desk Prop
export function toggleProp(propId) {
  const current = getSupporterState();
  const isFree = COSMETIC_CATALOG.props.find((p) => p.id === propId)?.tier === "free";
  if (!current.unlockedItems.includes(propId) && !current.isSupporter && !isFree) {
    return false;
  }
  const props = new Set(current.equippedProps);
  if (props.has(propId)) {
    props.delete(propId);
  } else {
    props.add(propId);
  }
  const next = { ...current, equippedProps: Array.from(props) };
  saveAndNotify(next);
  return true;
}

// Equip Aura
export function equipAura(auraId) {
  const current = getSupporterState();
  const isFree = (COSMETIC_CATALOG.auras || []).find((a) => a.id === auraId)?.tier === "free";
  if (!current.unlockedItems.includes(auraId) && !current.isSupporter && !isFree && auraId !== "none" && auraId !== "aura_0") {
    return false;
  }
  const next = { ...current, equippedAura: auraId };
  saveAndNotify(next);
  return true;
}

// Equip Trophy
export function equipTrophy(trophyId) {
  const current = getSupporterState();
  const isFree = (COSMETIC_CATALOG.trophies || []).find((t) => t.id === trophyId)?.tier === "free";
  if (!current.unlockedItems.includes(trophyId) && !current.isSupporter && !isFree && trophyId !== "none" && trophyId !== "trophy_0") {
    return false;
  }
  const next = { ...current, equippedTrophy: trophyId };
  saveAndNotify(next);
  return true;
}

// Equip Office Theme / Floor Environment
export function equipOfficeTheme(themeId) {
  const current = getSupporterState();
  const isFree = (COSMETIC_CATALOG.officeThemes || []).find((t) => t.id === themeId)?.tier === "free";
  if (!current.unlockedItems.includes(themeId) && !current.isSupporter && !isFree && themeId !== "theme_default") {
    return false;
  }
  const next = { ...current, equippedOfficeTheme: themeId };
  saveAndNotify(next);
  return true;
}

// Update Ambient Soundscape
export function setAmbientSound(soundId, volume = null) {
  const current = getSupporterState();
  const next = {
    ...current,
    ambientSound: soundId,
    ambientVolume: volume !== null ? volume : current.ambientVolume,
  };
  saveAndNotify(next);
  return next;
}

