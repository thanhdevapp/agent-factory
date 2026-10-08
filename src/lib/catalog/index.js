
import { skins } from './skins';
import { props } from './props';
import { pets } from './pets';

export const COSMETIC_CATALOG = {
  skins,
  props,
  pets,
  soundscapes: [
    { id: "none", name: "Mute", description: "Silent mode for deep uninterrupted focus." },
    { id: "rain", name: "Gentle Rain", description: "Soft raindrops tapping on the windowpane." },
    { id: "coffee_shop", name: "Lo-Fi Coffee Shop", description: "Warm coffee shop atmosphere." },
  ]
};
