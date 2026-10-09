/**
 * AGMon AI Factory - Local-First Progression & Wallet Store
 * Persists XP, Level, $COIN balance and statistics in localStorage with zero network overhead.
 */

import { calculateTurnXP, calculateCoinReward } from "./xpEngine.js";
import { getLevelForXP, getProgressStats } from "./rankRules.js";

const STORAGE_KEY = "agmon_factory_progression_v1";

const DEFAULT_STATE = {
  totalXP: 0,
  coins: 50, // Starting bonus for new workers
  stats: {
    tokensMined: 0,
    turnsCompleted: 0,
    commitsCount: 0,
    lastActiveDate: null
  },
  unlockedThemes: ["default"],
  equippedTheme: "default",
  unlockedProps: [],
  history: []
};

class WalletStore {
  constructor() {
    this.state = DEFAULT_STATE;
    this.listeners = new Set();
    this.isLoaded = false;
    this.cachedLevel = 1;
    this.load();
  }

  load() {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.state = {
          ...DEFAULT_STATE,
          ...parsed,
          stats: { ...DEFAULT_STATE.stats, ...(parsed.stats || {}) }
        };
      }
    } catch (e) {
      console.warn("[WalletStore] Failed to load progression from localStorage:", e);
    }
    this.cachedLevel = getLevelForXP(this.state.totalXP);
    this.isLoaded = true;
  }

  save() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn("[WalletStore] Failed to save progression to localStorage:", e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(eventPayload = null) {
    const stats = this.getProgress();
    for (const listener of this.listeners) {
      try {
        listener(this.state, stats, eventPayload);
      } catch (err) {
        console.error("[WalletStore] Listener error:", err);
      }
    }
    // Also dispatch browser custom event for external components
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("agmon-progression-updated", {
          detail: { state: this.state, stats, event: eventPayload }
        })
      );
    }
  }

  getState() {
    return this.state;
  }

  getProgress() {
    return getProgressStats(this.state.totalXP);
  }

  /**
   * Adds XP from actual real-work activity and awards $COIN
   * Returns: { gainedXP, gainedCoins, didLevelUp, oldLevel, newLevel }
   */
  recordActivity({ tokenDelta = 0, toolCalls = [], isCompleted = false, isCommit = false } = {}) {
    const gainedXP = calculateTurnXP({
      tokenCount: tokenDelta,
      toolCalls,
      isCompleted,
      isCommit
    });

    if (gainedXP <= 0) return null;

    const gainedCoins = calculateCoinReward(gainedXP);
    const oldLevel = this.cachedLevel;
    const oldTotalXP = this.state.totalXP;
    const newTotalXP = oldTotalXP + gainedXP;
    const newLevel = getLevelForXP(newTotalXP);
    const didLevelUp = newLevel > oldLevel;

    this.state.totalXP = newTotalXP;
    this.state.coins += gainedCoins;
    this.state.stats.tokensMined += tokenDelta;
    if (isCompleted) this.state.stats.turnsCompleted += 1;
    if (isCommit) this.state.stats.commitsCount += 1;
    this.state.stats.lastActiveDate = new Date().toISOString();
    this.cachedLevel = newLevel;

    const eventPayload = {
      gainedXP,
      gainedCoins,
      didLevelUp,
      oldLevel,
      newLevel,
      timestamp: Date.now()
    };

    this.save();
    this.notify(eventPayload);

    if (didLevelUp && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("agmon-level-up", {
          detail: eventPayload
        })
      );
    }

    return eventPayload;
  }

  spendCoins(amount) {
    if (this.state.coins < amount) return false;
    this.state.coins -= amount;
    this.save();
    return true;
  }

  unlockTheme(themeId) {
    if (!this.state.unlockedThemes.includes(themeId)) {
      this.state.unlockedThemes.push(themeId);
      this.save();
    }
  }

  equipTheme(themeId) {
    this.state.equippedTheme = themeId;
    this.save();
  }
}

// Singleton instance
export const walletStore = new WalletStore();
export default walletStore;
