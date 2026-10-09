"use client";

import React, { useEffect, useState } from "react";
import { Award, Coins, Sparkles } from "lucide-react";
import walletStore from "@/lib/progression/walletStore";

export default function WorkerProgressWidget({ className = "" }) {
  const [progression, setProgression] = useState(() => walletStore.getProgress());
  const [coins, setCoins] = useState(() => walletStore.getState().coins);
  const [justLeveledUp, setJustLeveledUp] = useState(false);

  useEffect(() => {
    const unsubscribe = walletStore.subscribe((state, stats, event) => {
      setProgression(stats);
      setCoins(state.coins);
      if (event?.didLevelUp) {
        setJustLeveledUp(true);
        setTimeout(() => setJustLeveledUp(false), 3500);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div
      data-testid="worker-progress-widget"
      title={`Worker Rank: Level ${progression.currentLevel} - ${progression.title}\nXP: ${progression.currentXPIntoLevel.toLocaleString()} / ${progression.levelXPRequired.toLocaleString()} (${progression.progressPercent}%)\nNext Unlock: ${progression.unlockName}\nBalance: ${coins.toLocaleString()} $COIN`}
      className={`flex items-center gap-2 bg-[#1f1f23] hover:bg-[#27272b] border border-[#333338] hover:border-[#f59e0b]/50 px-2 py-0.5 rounded text-[11px] select-none cursor-pointer transition-all shadow-sm ${
        justLeveledUp ? "ring-2 ring-[#f59e0b] animate-pulse" : ""
      } ${className}`}
    >
      {/* Rank Badge & Icon */}
      <div className="flex items-center gap-1">
        <Award className="w-3.5 h-3.5" style={{ color: progression.badgeColor || "#f59e0b" }} />
        <span className="font-bold text-slate-100 whitespace-nowrap">
          Lv.{progression.currentLevel}
        </span>
        <span
          className="hidden xl:inline text-[10px] font-medium truncate max-w-[110px]"
          style={{ color: progression.badgeColor || "#f59e0b" }}
        >
          {progression.title}
        </span>
      </div>

      {/* Mini Progress Bar */}
      <div className="w-12 sm:w-16 h-1.5 bg-[#2d2d32] rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
          style={{ width: `${progression.progressPercent}%` }}
        />
      </div>

      {/* $COIN Wallet */}
      <div className="flex items-center gap-1 font-mono text-[10px] text-amber-300 pl-0.5 border-l border-[#3a3a40]">
        <Coins className="w-3 h-3 text-amber-400 shrink-0" />
        <span className="font-bold">{coins.toLocaleString()}</span>
      </div>

      {justLeveledUp && (
        <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-300 bg-amber-950/80 px-1 rounded animate-bounce">
          <Sparkles className="w-2.5 h-2.5" />
          UP!
        </span>
      )}
    </div>
  );
}
