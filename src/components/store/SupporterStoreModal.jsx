"use client";

import React, { useState, useEffect } from "react";
import {
  Coffee,
  Sparkles,
  Heart,
  ShieldCheck,
  Check,
  ExternalLink,
  QrCode,
  ShoppingBag,
  Volume2,
  VolumeX,
  Key,
  X,
  Laptop,
  Flame,
  Sprout,
  Play,
  Square,
  Gift,
  AlertCircle,
  Copy,
  ChevronRight,
} from "lucide-react";
import { Modal, Button, Input, Badge } from "@/components/ui";
import {
  COSMETIC_CATALOG,
  getSupporterState,
  unlockWithCode,
  equipSkin,
  equipPet,
  toggleProp,
  setAmbientSound,
  SUPPORTER_CHANGE_EVENT,
} from "@/lib/supporterStore";
import { startAmbient, stopAmbient, setAmbientVolume } from "@/lib/ambientAudio";

// VietQR donation recipient info
const VIETQR_CONFIG = {
  bankId: "MB", // MB Bank
  bankName: "MB Bank (Ngân hàng Quân đội)",
  accountNo: "0968868862", // Configured recipient account number
  accountName: "NGUYEN VAN THANH",
  template: "compact2",
};

const DONATE_TIERS = [
  {
    id: "coffee",
    title: "Cup of Coffee",
    amount: 20000,
    amountUsd: "$1",
    tag: "Popular",
    description: "Gift the developer a fresh cup of coffee to power late-night coding.",
  },
  {
    id: "lunch",
    title: "Developer Lunch",
    amount: 50000,
    amountUsd: "$2.5",
    tag: "Recommended",
    description: "Fuel continuous development to ship new features to AGMon.",
  },
  {
    id: "vip",
    title: "VIP Dev Buff Pack",
    amount: 100000,
    amountUsd: "$5",
    tag: "VIP Supporter",
    description: "Unlock all supporter badges, skins, pets, and workspace items in the vault.",
  },
];

export default function SupporterStoreModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("donate"); // 'donate' | 'skins' | 'props' | 'ambient'
  const [storeState, setStoreState] = useState(getSupporterState());
  const [selectedTier, setSelectedTier] = useState(DONATE_TIERS[0]);
  const [unlockCodeInput, setUnlockCodeInput] = useState("");
  const [unlockFeedback, setUnlockFeedback] = useState(null);
  const [copiedBank, setCopiedBank] = useState(false);

  // Listen for inventory updates
  useEffect(() => {
    const handleStoreChange = (e) => {
      if (e.detail) {
        setStoreState(e.detail);
      } else {
        setStoreState(getSupporterState());
      }
    };

    window.addEventListener(SUPPORTER_CHANGE_EVENT, handleStoreChange);
    return () => window.removeEventListener(SUPPORTER_CHANGE_EVENT, handleStoreChange);
  }, []);

  // Unlock via activation code
  const handleUnlockCode = (e) => {
    e.preventDefault();
    if (!unlockCodeInput.trim()) return;

    const res = unlockWithCode(unlockCodeInput);
    setUnlockFeedback(res);
    if (res.success) {
      setUnlockCodeInput("");
      setStoreState(res.state);
      setTimeout(() => setUnlockFeedback(null), 5000);
    }
  };

  // Copy bank account number
  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(VIETQR_CONFIG.accountNo);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  // VietQR image generator URL
  const vietQrUrl = `https://img.vietqr.io/image/${VIETQR_CONFIG.bankId}-${VIETQR_CONFIG.accountNo}-${VIETQR_CONFIG.template}.png?amount=${selectedTier.amount}&addInfo=AGMON%20${selectedTier.id.toUpperCase()}&accountName=${encodeURIComponent(VIETQR_CONFIG.accountName)}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Coffee Shop & Supporter Vault"
      description="Support the developer to maintain the project and unlock custom AGMon virtual office decorations"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full text-xs text-slate-400">
          <div className="flex items-center gap-2">
            {storeState.isSupporter ? (
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Status: VIP Supporter Activated</span>
              </span>
            ) : (
              <span>100% of AGMon core engineering features remain completely free</span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-[#333333] pb-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("donate")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "donate"
                ? "bg-[#007acc] text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-[#252526]"
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Buy Me a Coffee (VietQR)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("skins")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "skins"
                ? "bg-[#007acc] text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-[#252526]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Agent Skins</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("props")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "props"
                ? "bg-[#007acc] text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-[#252526]"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pets & Desk Props</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ambient")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "ambient"
                ? "bg-[#007acc] text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-[#252526]"
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Ambient Audio</span>
          </button>
        </div>

        {/* TAB 1: BUY ME A COFFEE & VIETQR */}
        {activeTab === "donate" && (
          <div className="space-y-4 text-xs">
            {/* Tier Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DONATE_TIERS.map((tier) => {
                const isSelected = selectedTier.id === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#007acc]/15 border-[#007acc] text-white shadow-md shadow-[#007acc]/10"
                        : "bg-[#252526] border-[#333333] text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">{tier.title}</span>
                        <Badge variant={isSelected ? "primary" : "secondary"} badgeSize="xs">
                          {tier.tag}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {tier.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#333333] flex items-baseline justify-between">
                      <span className="text-base font-extrabold text-amber-300 font-mono">
                        {tier.amount.toLocaleString()} ₫
                      </span>
                      <span className="text-slate-500 text-[10px] font-mono">
                        {tier.amountUsd}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* QR Code & Banking Details */}
            <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl p-4 flex flex-col sm:flex-row gap-5 items-center">
              {/* QR Image */}
              <div className="bg-white p-2.5 rounded-lg shrink-0 shadow-lg flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vietQrUrl}
                  alt="VietQR donation code"
                  className="w-40 h-40 object-contain"
                  loading="lazy"
                />
                <span className="text-[9px] font-bold text-slate-700 tracking-wider uppercase mt-1">
                  Scan with Banking App
                </span>
              </div>

              {/* Bank Info */}
              <div className="flex-1 space-y-2.5 w-full">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-sm">
                    Support via VietQR / Bank Transfer
                  </span>
                </div>

                <div className="bg-[#252526] p-2.5 rounded-lg border border-[#333333] space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Bank:</span>
                    <span className="text-white font-semibold">{VIETQR_CONFIG.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Account No:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-300 font-bold">{VIETQR_CONFIG.accountNo}</span>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="p-1 rounded hover:bg-[#333333] text-slate-400 hover:text-white"
                        title="Copy account number"
                      >
                        {copiedBank ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Account Name:</span>
                    <span className="text-white font-semibold">{VIETQR_CONFIG.accountName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Amount:</span>
                    <span className="text-emerald-400 font-bold">
                      {selectedTier.amount.toLocaleString()} VND
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Memo:</span>
                    <span className="text-cyan-300 font-semibold">
                      AGMON {selectedTier.id.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* International donation links */}
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://github.com/sponsors"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#252526] hover:bg-[#2d2d2e] border border-[#3e3e42] text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>GitHub Sponsors</span>
                    <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                  </a>

                  <a
                    href="https://buymeacoffee.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#252526] hover:bg-[#2d2d2e] border border-[#3e3e42] text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                  >
                    <Coffee className="w-3.5 h-3.5 text-amber-400" />
                    <span>Buy Me a Coffee</span>
                    <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                  </a>
                </div>
              </div>
            </div>

            {/* Offline Key / Voucher activation box */}
            <div className="bg-[#252526] border border-[#333333] rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Redeem Supporter Key</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Demo code: AGMON-COFFEE-VIP
                </span>
              </div>
              <form onSubmit={handleUnlockCode} className="flex gap-2">
                <Input
                  inputSize="sm"
                  placeholder="Enter activation code (e.g. AGMON-COFFEE-VIP)..."
                  value={unlockCodeInput}
                  onChange={(e) => setUnlockCodeInput(e.target.value)}
                  wrapperClassName="flex-1 font-mono uppercase"
                />
                <Button type="submit" variant="primary" size="sm">
                  Activate
                </Button>
              </form>

              {unlockFeedback && (
                <div
                  className={`p-2 rounded-lg text-xs flex items-center gap-2 ${
                    unlockFeedback.success
                      ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-300"
                      : "bg-rose-950/80 border border-rose-500/40 text-rose-300"
                  }`}
                >
                  {unlockFeedback.success ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{unlockFeedback.message}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: AGENT SKINS */}
        {activeTab === "skins" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {COSMETIC_CATALOG.skins.map((skin) => {
              const isEquipped = storeState.equippedSkin === skin.id;
              const isUnlocked =
                skin.tier === "free" ||
                storeState.isSupporter ||
                storeState.unlockedItems.includes(skin.id);

              return (
                <div
                  key={skin.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                    isEquipped
                      ? "bg-[#007acc]/15 border-[#007acc] shadow-sm shadow-[#007acc]/10"
                      : "bg-[#252526] border-[#333333]"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-block"
                          style={{ backgroundColor: skin.previewColor }}
                        />
                        <span className="font-bold text-white text-sm">{skin.name}</span>
                      </div>
                      <Badge
                        variant={skin.tier === "free" ? "secondary" : "warning"}
                        badgeSize="xs"
                      >
                        {skin.tier === "free" ? "Default" : "Supporter"}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {skin.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-[#333333] flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">
                      {isEquipped ? "In Use" : isUnlocked ? "Unlocked" : "Locked"}
                    </span>
                    <button
                      type="button"
                      disabled={!isUnlocked || isEquipped}
                      onClick={() => equipSkin(skin.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isEquipped
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default"
                          : isUnlocked
                          ? "bg-[#007acc] hover:bg-[#0062a3] text-white"
                          : "bg-[#333333] text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      {isEquipped ? "Equipped" : isUnlocked ? "Equip" : "Locked"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: PETS & DESK PROPS */}
        {activeTab === "props" && (
          <div className="space-y-4 text-xs">
            {/* Desk accessories and props */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                <span>Desk Accessories & Props</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {COSMETIC_CATALOG.props.map((prop) => {
                  const isEquipped = storeState.equippedProps?.includes(prop.id);
                  const isUnlocked = storeState.isSupporter || storeState.unlockedItems.includes(prop.id);
                  return (
                    <div
                      key={prop.id}
                      className={`p-3 rounded-xl border flex flex-col justify-between ${
                        isEquipped
                          ? "bg-[#007acc]/15 border-[#007acc]"
                          : "bg-[#252526] border-[#333333]"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{prop.name}</span>
                          {prop.id === "coffee_machine" && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                          {prop.id === "bonsai" && <Sprout className="w-3.5 h-3.5 text-emerald-400" />}
                          {prop.id === "rgb_keyboard" && <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400">{prop.description}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#333333] flex items-center justify-end">
                        <button
                          type="button"
                          disabled={!isUnlocked}
                          onClick={() => toggleProp(prop.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isEquipped
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : isUnlocked
                              ? "bg-[#333333] hover:bg-[#3e3e42] text-slate-300"
                              : "bg-[#222222] text-slate-600 cursor-not-allowed"
                          }`}
                        >
                          {isEquipped ? "Enabled" : isUnlocked ? "Enable" : "Locked"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desk companions & pets */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-purple-400" />
                <span>Desk Companions & Pets</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {COSMETIC_CATALOG.pets.map((pet) => {
                  const isEquipped = storeState.equippedPet === pet.id;
                  const isUnlocked =
                    pet.tier === "free" ||
                    storeState.isSupporter ||
                    storeState.unlockedItems.includes(pet.id);
                  return (
                    <div
                      key={pet.id}
                      className={`p-3 rounded-xl border flex flex-col justify-between ${
                        isEquipped
                          ? "bg-[#007acc]/15 border-[#007acc]"
                          : "bg-[#252526] border-[#333333]"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{pet.name}</span>
                          <Badge
                            variant={pet.tier === "free" ? "secondary" : "primary"}
                            badgeSize="xs"
                          >
                            {pet.tier === "free" ? "Default" : "Supporter"}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-400">{pet.description}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#333333] flex items-center justify-end">
                        <button
                          type="button"
                          disabled={!isUnlocked || isEquipped}
                          onClick={() => equipPet(pet.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isEquipped
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default"
                              : isUnlocked
                              ? "bg-[#007acc] hover:bg-[#0062a3] text-white"
                              : "bg-[#222222] text-slate-600 cursor-not-allowed"
                          }`}
                        >
                          {isEquipped ? "Active" : isUnlocked ? "Select" : "Locked"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AMBIENT AUDIO */}
        {activeTab === "ambient" && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#252526] border border-[#333333] rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">Web Audio Ambient Soundscapes</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Synthesized directly in browser via Web Audio API (0 byte MP3, zero network bandwidth overhead).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={storeState.ambientVolume ?? 0.35}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    setAmbientSound(storeState.ambientSound, vol);
                    setAmbientVolume(vol);
                  }}
                  className="w-24 accent-[#007acc] cursor-pointer"
                />
                <span className="font-mono text-cyan-300 w-8">
                  {Math.round((storeState.ambientVolume ?? 0.35) * 100)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {COSMETIC_CATALOG.soundscapes.map((sound) => {
                const isActive = storeState.ambientSound === sound.id;
                return (
                  <div
                    key={sound.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                      isActive
                        ? "bg-[#007acc]/15 border-[#007acc] shadow-sm shadow-[#007acc]/10"
                        : "bg-[#252526] border-[#333333]"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{sound.name}</span>
                        {isActive && <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />}
                      </div>
                      <p className="text-slate-400 text-[11px]">{sound.description}</p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-[#333333] flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const nextType = isActive ? "none" : sound.id;
                          setAmbientSound(nextType);
                          if (nextType === "none") {
                            stopAmbient();
                          } else {
                            startAmbient(nextType, storeState.ambientVolume ?? 0.35);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
                            : "bg-[#007acc] hover:bg-[#0062a3] text-white"
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Square className="w-3 h-3 fill-rose-300" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-white" />
                            <span>Play Sound</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
