/**
 * AGMon AI Factory - Real-Work XP & Mining Engine
 * Converts actual LLM tokens, tool calls, turns and commits into XP and $COIN
 */

export const XP_RULES = {
  PER_100_TOKENS: 1,        // 1 XP for every 100 LLM tokens generated
  TOOL_CALL_SUCCESS: 15,    // 15 XP when tool call finishes
  TURN_COMPLETED: 25,       // 25 XP when an agent finishes an interaction turn
  GIT_COMMIT_DETECTED: 100, // 100 XP when a new git commit is recorded
  COIN_DIVISOR: 5           // 1 $COIN awarded for every 5 XP earned
};

/**
 * Calculates XP earned from a turn event or token delta
 */
export function calculateTurnXP({ tokenCount = 0, toolCalls = [], isCompleted = false, isCommit = false } = {}) {
  let xp = 0;
  if (tokenCount > 0) {
    xp += Math.floor(tokenCount / 100) * XP_RULES.PER_100_TOKENS;
  }
  if (toolCalls && toolCalls.length > 0) {
    xp += toolCalls.length * XP_RULES.TOOL_CALL_SUCCESS;
  }
  if (isCompleted) {
    xp += XP_RULES.TURN_COMPLETED;
  }
  if (isCommit) {
    xp += XP_RULES.GIT_COMMIT_DETECTED;
  }
  return xp;
}

/**
 * Calculates coin reward from XP
 */
export function calculateCoinReward(xp) {
  if (!xp || xp <= 0) return 0;
  return Math.floor(xp / XP_RULES.COIN_DIVISOR);
}
