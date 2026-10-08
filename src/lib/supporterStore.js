"use client";

/**
 * Supporter Store & Cosmetic Customization Engine
 * Manages supporter status, item inventory (Skins, Pets, Props), and Ambient soundscapes.
 * Persists in localStorage and broadcasts sync events to PixiJS Canvas.
 */

export const SUPPORTER_STORAGE_KEY = "agmon_supporter_data";
export const SUPPORTER_CHANGE_EVENT = "agmon:supporter-change";

// Item Catalog
export const COSMETIC_CATALOG = {
  skins: [
    {
      id: "classic",
      name: "Classic Bot",
      description: "Original chibi robot featuring a safety helmet and live status display.",
      tier: "free",
      previewColor: "#38bdf8",
    },
    {
      id: "cat",
      name: "Pixel Cat Coder",
      description: "Playful hacker cat with sleek triangular ears and cool whiskers.",
      tier: "coffee",
      previewColor: "#f472b6",
    },
    {
      id: "ninja",
      name: "Cyber Ninja",
      description: "Tech assassin with glowing neon visor and dark stealth scarf.",
      tier: "meal",
      previewColor: "#a855f7",
    },
    {
      id: "hacker",
      name: "Retro Hacker",
      description: "Anonymous coder in dark Matrix-style cyberpunk hoodie.",
      tier: "vip",
      previewColor: "#22c55e",
    },
  ],
  pets: [
    {
      id: "none",
      name: "None",
      description: "Clean desk space without pets.",
      tier: "free",
    },
    {
      id: "cat",
      name: "Cozy Sleepy Cat",
      description: "Peaceful kitten sleeping beside the agent desk with gentle breathing.",
      tier: "coffee",
    },
    {
      id: "shiba",
      name: "Dozing Shiba",
      description: "Loyal Shiba Inu watching over the workspace with half-closed eyes.",
      tier: "meal",
    },
  ],
  props: [
    {
      id: "coffee_machine",
      name: "Mini Espresso Machine",
      description: "Rests on desk corner, puffs warm steam while agent processes commands.",
      tier: "coffee",
    },
    {
      id: "bonsai",
      name: "Feng Shui Bonsai",
      description: "Lush miniature plant bringing calm focus to the workstation.",
      tier: "coffee",
    },
    {
      id: "rgb_keyboard",
      name: "RGB Mechanical Keyboard",
      description: "Underglow keyboard lighting pulsating with keystrokes.",
      tier: "meal",
    },
  ],
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
  ],
};

const DEFAULT_STATE = {
  isSupporter: false,
  supporterTier: "none", // 'none' | 'coffee' | 'meal' | 'vip'
  equippedSkin: "classic",
  equippedPet: "none",
  equippedProps: [],
  ambientSound: "none",
  ambientVolume: 0.35,
  unlockedItems: ["classic", "none"],
};

// Đọc trạng thái từ localStorage
export function getSupporterState() {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(SUPPORTER_STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
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
    const allUnlocked = Array.from(new Set([...current.unlockedItems, ...allSkins, ...allPets, ...allProps]));

    const nextState = {
      ...current,
      isSupporter: true,
      supporterTier: "vip",
      unlockedItems: allUnlocked,
      equippedSkin: current.equippedSkin === "classic" ? "cat" : current.equippedSkin,
      equippedPet: current.equippedPet === "none" ? "cat" : current.equippedPet,
      equippedProps: Array.from(new Set([...current.equippedProps, "coffee_machine", "bonsai"])),
    };

    saveAndNotify(nextState);
    return {
      success: true,
      message: "Congratulations! You have unlocked all VIP items and Supporter status.",
      state: nextState,
    };
  }

  return { success: false, message: "Invalid activation code. Please check and try again." };
}

// Equip Skin
export function equipSkin(skinId) {
  const current = getSupporterState();
  if (!current.unlockedItems.includes(skinId) && !current.isSupporter && skinId !== "classic") {
    return false;
  }
  const next = { ...current, equippedSkin: skinId };
  saveAndNotify(next);
  return true;
}

// Equip Pet
export function equipPet(petId) {
  const current = getSupporterState();
  if (!current.unlockedItems.includes(petId) && !current.isSupporter && petId !== "none") {
    return false;
  }
  const next = { ...current, equippedPet: petId };
  saveAndNotify(next);
  return true;
}

// Toggle Desk Prop
export function toggleProp(propId) {
  const current = getSupporterState();
  if (!current.unlockedItems.includes(propId) && !current.isSupporter) {
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
