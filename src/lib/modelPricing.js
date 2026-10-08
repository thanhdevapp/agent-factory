/**
 * Published list prices in USD per 1,000,000 tokens.
 *
 * Kept free of Node built-ins so both the server-side report aggregator and the
 * browser-side replay engine can use it.
 *
 * `cached` is the published cache-read (cache-hit) rate. Where a vendor
 * publishes no separate cache rate, the base input rate is used rather than
 * inventing a discount.
 *
 * Models absent from this table have no price and are reported as unpriced
 * instead of being silently rated with a generic default.
 */
export const MODEL_PRICING = {
  // Gemini
  "gemini-3.8-flash": { input: 0.075, output: 0.30, cached: 0.01875 },
  "gemini-2.5-flash": { input: 0.075, output: 0.30, cached: 0.01875 },
  "gemini-1.5-flash": { input: 0.075, output: 0.30, cached: 0.01875 },
  "gemini-3.8-pro": { input: 1.25, output: 5.00, cached: 0.3125 },
  "gemini-3.1-pro": { input: 1.25, output: 5.00, cached: 0.3125 },
  "gemini-2.5-pro": { input: 1.25, output: 5.00, cached: 0.3125 },
  "gemini-1.5-pro": { input: 1.25, output: 5.00, cached: 0.3125 },

  // Claude 5 family
  "claude-opus-5-5": { input: 4.00, output: 20.00, cached: 0.20 },
  "claude-sonnet-5-5": { input: 2.00, output: 10.00, cached: 0.10 },
  "claude-haiku-5-5": { input: 0.10, output: 0.50, cached: 0.01 },
  "claude-fable-5": { input: 10.00, output: 50.00, cached: 1.00 },
  "claude-mythos-5": { input: 10.00, output: 50.00, cached: 1.00 },

  // Claude 4.x family
  "claude-opus-4-8": { input: 5.00, output: 25.00, cached: 0.50 },
  "claude-opus-4-7": { input: 5.00, output: 25.00, cached: 0.50 },
  "claude-opus-4-6": { input: 5.00, output: 25.00, cached: 0.50 },
  "claude-opus-4-5": { input: 5.00, output: 25.00, cached: 0.50 },
  "claude-sonnet-4-6": { input: 3.00, output: 15.00, cached: 0.30 },
  "claude-sonnet-4-5": { input: 3.00, output: 15.00, cached: 0.30 },
  "claude-haiku-4-5": { input: 1.00, output: 5.00, cached: 0.10 },

  // Claude 3.x family
  "claude-3-7-sonnet": { input: 3.00, output: 15.00, cached: 0.30 },
  "claude-3-5-sonnet": { input: 3.00, output: 15.00, cached: 0.30 },
  "claude-3-5-haiku": { input: 0.80, output: 4.00, cached: 0.08 },
  "claude-3-opus": { input: 15.00, output: 75.00, cached: 1.50 },
  "claude-3-haiku": { input: 0.25, output: 1.25, cached: 0.025 },

  // OpenAI
  "gpt-4o-mini": { input: 0.15, output: 0.60, cached: 0.075 },
  "gpt-4o": { input: 2.50, output: 10.00, cached: 1.25 },

  // MiniMax (no published cache rate, so cached tokens bill at the input rate)
  "minimax": { input: 0.30, output: 1.20, cached: 0.30 },
};

// Longest key first so "claude-opus-5-5" wins over "claude-opus-5".
const PRICING_KEYS_BY_LENGTH = Object.keys(MODEL_PRICING).sort((a, b) => b.length - a.length);

/** @returns {object|null} Price for the model, or null when it is not priced. */
export function getPricingForModel(model) {
  const norm = (model || "").toLowerCase();
  if (!norm) return null;
  for (const key of PRICING_KEYS_BY_LENGTH) {
    if (norm.includes(key)) return MODEL_PRICING[key];
  }
  return null;
}

/** @returns {number|null} Cost in USD, or null when the model has no known price. */
export function calculateCost(model, input = 0, output = 0, cached = 0) {
  const price = getPricingForModel(model);
  if (!price) return null;
  const cost =
    (input / 1_000_000) * price.input +
    (output / 1_000_000) * price.output +
    (cached / 1_000_000) * price.cached;
  return Math.round(cost * 10000) / 10000;
}

/** @returns {number|null} Cache savings vs. billing those tokens as raw input. */
export function calculateCacheSavings(model, cached = 0) {
  const price = getPricingForModel(model);
  if (!price) return null;
  const diff = Math.max(0, price.input - price.cached);
  const savings = (cached / 1_000_000) * diff;
  return Math.round(savings * 10000) / 10000;
}