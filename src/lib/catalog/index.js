import { skins } from './skins.js';
import { props } from './props.js';
import { pets } from './pets.js';
import { auras } from './auras.js';
import { trophies } from './trophies.js';
import { officeThemes } from './officeThemes.js';

export { skins, props, pets, auras, trophies, officeThemes };

export const COSMETIC_CATALOG = {
  skins,
  props,
  pets,
  auras,
  trophies,
  officeThemes,
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

// Fast index map for O(1) item lookup across 1000+ items
export const CATALOG_LOOKUP = new Map();
[...skins, ...props, ...pets, ...auras, ...trophies, ...officeThemes].forEach(item => {
  CATALOG_LOOKUP.set(item.id, item);
});

export const getItemById = (id) => {
  if (!id) return null;
  const direct = CATALOG_LOOKUP.get(id);
  if (direct) return direct;

  // Resilient fallback for legacy unpruned IDs from old localStorage or traces
  if (typeof id === "string") {
    if (id.startsWith("skin_")) {
      const num = parseInt(id.replace("skin_", ""), 10);
      if (!isNaN(num)) {
        if (num >= 200) return CATALOG_LOOKUP.get(`skin_${40 + (num % 10)}`) || skins[40];
        if (num >= 150) return CATALOG_LOOKUP.get(`skin_${30 + (num % 10)}`) || skins[30];
        if (num >= 100) return CATALOG_LOOKUP.get(`skin_${20 + (num % 10)}`) || skins[20];
        if (num >= 50) return CATALOG_LOOKUP.get(`skin_${10 + (num % 10)}`) || skins[10];
        return skins[num % skins.length] || skins[0];
      }
    }
    if (id.startsWith("prop_")) {
      const num = parseInt(id.replace("prop_", ""), 10);
      if (!isNaN(num)) {
        if (num >= 300) return CATALOG_LOOKUP.get(`prop_${30 + (num % 5)}`) || props[30];
        if (num >= 250) return CATALOG_LOOKUP.get(`prop_${25 + (num % 5)}`) || props[25];
        if (num >= 200) return CATALOG_LOOKUP.get(`prop_${20 + (num % 5)}`) || props[20];
        if (num >= 150) return CATALOG_LOOKUP.get(`prop_${15 + (num % 5)}`) || props[15];
        if (num >= 100) return CATALOG_LOOKUP.get(`prop_${10 + (num % 5)}`) || props[10];
        if (num >= 50) return CATALOG_LOOKUP.get(`prop_${5 + (num % 5)}`) || props[5];
        return props[num % props.length] || props[0];
      }
    }
    if (id.startsWith("pet_")) {
      const num = parseInt(id.replace("pet_", ""), 10);
      if (!isNaN(num)) {
        if (num === 0) return CATALOG_LOOKUP.get("pet_0") || pets[0];
        if (num >= 150) return CATALOG_LOOKUP.get(`pet_${16 + (num % 5)}`) || pets[16];
        if (num >= 100) return CATALOG_LOOKUP.get(`pet_${11 + (num % 5)}`) || pets[11];
        if (num >= 50) return CATALOG_LOOKUP.get(`pet_${6 + (num % 5)}`) || pets[6];
        return pets[1 + (num % 5)] || pets[1];
      }
    }
    if (id.startsWith("aura_")) {
      const num = parseInt(id.replace("aura_", ""), 10);
      if (!isNaN(num)) {
        if (num >= 75) return CATALOG_LOOKUP.get(`aura_${12 + (num % 4)}`) || auras[12];
        if (num >= 50) return CATALOG_LOOKUP.get(`aura_${8 + (num % 4)}`) || auras[8];
        if (num >= 25) return CATALOG_LOOKUP.get(`aura_${4 + (num % 4)}`) || auras[4];
        return auras[num % auras.length] || auras[0];
      }
    }
    if (id.startsWith("trophy_")) {
      const num = parseInt(id.replace("trophy_", ""), 10);
      if (!isNaN(num)) {
        if (num >= 75) return CATALOG_LOOKUP.get(`trophy_${12 + (num % 4)}`) || trophies[12];
        if (num >= 50) return CATALOG_LOOKUP.get(`trophy_${8 + (num % 4)}`) || trophies[8];
        if (num >= 25) return CATALOG_LOOKUP.get(`trophy_${4 + (num % 4)}`) || trophies[4];
        return trophies[num % trophies.length] || trophies[0];
      }
    }
  }
  return null;
};
export const TOTAL_CATALOG_COUNT = skins.length + props.length + pets.length + auras.length + trophies.length + officeThemes.length;
