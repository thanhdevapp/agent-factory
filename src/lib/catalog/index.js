import { skins } from './skins';
import { props } from './props';
import { pets } from './pets';

export const COSMETIC_CATALOG = {
  skins,
  props,
  pets,
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
  ]
};
