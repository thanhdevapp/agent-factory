/**
 * AGMon AI Factory - 50-Tier Worker Rank & Progression Hierarchy
 */

export const RANK_TIERS = [
  { minLevel: 1, maxLevel: 4, title: "Intern Apprentice", badgeColor: "#94a3b8", deskStyle: "wood-rustic", unlockName: "Rustic Wooden Desk & Oil Lamp" },
  { minLevel: 5, maxLevel: 9, title: "Junior Craftsman", badgeColor: "#38bdf8", deskStyle: "crt-classic", unlockName: "Vintage CRT Monitor & Paper Coffee Cup" },
  { minLevel: 10, maxLevel: 19, title: "Senior Artificer", badgeColor: "#34d399", deskStyle: "dual-led", unlockName: "Dual LED Displays & Ergonomic Mesh Chair" },
  { minLevel: 20, maxLevel: 34, title: "Factory Overseer", badgeColor: "#f59e0b", deskStyle: "glass-suite", unlockName: "Glass Partition Suite & Espresso Machine" },
  { minLevel: 35, maxLevel: 49, title: "Chief Architect", badgeColor: "#a855f7", deskStyle: "velvet-exec", unlockName: "Velvet Executive Carpet & Mechanical Tea Butler" },
  { minLevel: 50, maxLevel: 999, title: "Automation Archmage", badgeColor: "#ec4899", deskStyle: "cyber-throne", unlockName: "Floating Cyber Throne & Golden Holographic Aura" }
];

/**
 * Calculates XP required to advance to a given level using an exponential curve:
 * Base 100 XP for Level 2, scaling smoothly to Level 50 (~100,000 XP)
 */
export function getXPForLevel(level) {
  if (level <= 1) return 0;
  // Formula: 60 * (level - 1)^1.9 + (level - 1) * 40
  return Math.floor(60 * Math.pow(level - 1, 1.9) + (level - 1) * 40);
}

/**
 * Returns level given current total XP
 */
export function getLevelForXP(totalXP) {
  if (!totalXP || totalXP <= 0) return 1;
  let level = 1;
  while (getXPForLevel(level + 1) <= totalXP && level < 500) {
    level++;
  }
  return level;
}

/**
 * Detailed progress information for current total XP
 */
export function getProgressStats(totalXP = 0) {
  const currentLevel = getLevelForXP(totalXP);
  const currentLevelBaseXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  const levelXPRequired = Math.max(1, nextLevelXP - currentLevelBaseXP);
  const currentXPIntoLevel = Math.max(0, totalXP - currentLevelBaseXP);
  const progressRatio = Math.min(1, Math.max(0, currentXPIntoLevel / levelXPRequired));
  const progressPercent = Math.round(progressRatio * 100);

  // Find Tier
  const tier = RANK_TIERS.find(t => currentLevel >= t.minLevel && currentLevel <= t.maxLevel) || RANK_TIERS[RANK_TIERS.length - 1];

  return {
    totalXP,
    currentLevel,
    currentXPIntoLevel,
    levelXPRequired,
    nextLevelXP,
    progressPercent,
    progressRatio,
    title: tier.title,
    badgeColor: tier.badgeColor,
    deskStyle: tier.deskStyle,
    unlockName: tier.unlockName
  };
}
