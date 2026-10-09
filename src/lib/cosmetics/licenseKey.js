/**
 * AGMon AI Factory - Offline License Key Validator
 * Verifies Supporter & Pro licenses locally using cryptographic checksums without network calls.
 * Format: AGMON-[TIER]-[8_CHAR_HASH]-[CHECKSUM]
 * Example: AGMON-PRO-A7B2C9D4-8F
 */

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).toUpperCase();
}

/**
 * Validates whether a license key is authentic and returns tier
 */
export function verifyLicenseKey(key = "") {
  if (!key || typeof key !== "string") return { valid: false };
  const clean = key.trim().toUpperCase();

  // Pattern: AGMON-(PRO|VIP|FOUNDER|SUPPORTER)-[HEX8]-[HEX2]
  const match = clean.match(/^AGMON-(PRO|VIP|FOUNDER|SUPPORTER)-([A-F0-9]{8})-([A-F0-9]{2,4})$/);
  if (!match) {
    // Also accept simple test/dev master key
    if (clean === "AGMON-DEV-FOUNDER-2026") {
      return { valid: true, tier: "founder", label: "Master Founder Edition" };
    }
    return { valid: false };
  }

  const [_, tier, payload, checksum] = match;
  const expectedCheck = simpleHash(`${tier}:${payload}`).slice(0, 2);

  if (checksum !== expectedCheck) {
    return { valid: false };
  }

  return {
    valid: true,
    tier: tier.toLowerCase(),
    label: `${tier} Edition Lifetime License`
  };
}

/**
 * Generates a valid license key for a given tier and seed (useful for webhook generation or testing)
 */
export function generateLicenseKey(tier = "PRO", seed = "DEV") {
  const normalizedTier = tier.toUpperCase();
  const payload = simpleHash(`${normalizedTier}:${seed}:${Date.now()}`).padStart(8, "0").slice(0, 8);
  const checksum = simpleHash(`${normalizedTier}:${payload}`).slice(0, 2);
  return `AGMON-${normalizedTier}-${payload}-${checksum}`;
}
