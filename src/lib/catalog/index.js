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

export const getItemById = (id) => CATALOG_LOOKUP.get(id) || null;
export const TOTAL_CATALOG_COUNT = skins.length + props.length + pets.length + auras.length + trophies.length + officeThemes.length;
