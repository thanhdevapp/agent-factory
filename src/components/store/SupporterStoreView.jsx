"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Lock,
  Search,
  Grid,
  Bot,
  Layers,
  Filter,
} from "lucide-react";
import { Button, Input, Badge } from "@/components/ui";
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
import { SkinPreview, PetPreview, PropPreview } from "./ItemPreviewArt";

// VietQR donation recipient info (MB Bank)
const VIETQR_CONFIG = {
  bankId: "MB",
  bankName: "MB Bank (Military Commercial Joint Stock Bank)",
  accountNo: "0968868862",
  template: "qr_only",
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

export default function SupporterStoreView({ hideHeader = false, onClose = null }) {
  // Default to 'all' so users immediately see the 100 items on open!
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'skins' | 'props' | 'pets' | 'ambient' | 'donate'
  const [storeState, setStoreState] = useState(getSupporterState());
  const [selectedTier, setSelectedTier] = useState(DONATE_TIERS[0]);
  const [unlockCodeInput, setUnlockCodeInput] = useState("");
  const [unlockFeedback, setUnlockFeedback] = useState(null);
  const [copiedBank, setCopiedBank] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all"); // 'all' | 'free' | 'coffee' | 'meal' | 'vip'

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

  // Jump to donation tab with specific tier selected
  const handleUnlockTier = (tierId) => {
    const mapped =
      tierId === "lunch" || tierId === "meal"
        ? "lunch"
        : tierId === "vip"
        ? "vip"
        : "coffee";
    const tier = DONATE_TIERS.find((t) => t.id === mapped) || DONATE_TIERS[0];
    setSelectedTier(tier);
    setActiveTab("donate");
  };

  // VietQR image generator URL
  const vietQrUrl = `https://img.vietqr.io/image/${VIETQR_CONFIG.bankId}-${VIETQR_CONFIG.accountNo}-${VIETQR_CONFIG.template}.png?amount=${selectedTier.amount}&addInfo=AGMON%20${selectedTier.id.toUpperCase()}`;

  // Filter items
  const matchesSearchAndTier = (item) => {
    if (tierFilter !== "all") {
      const itemTier = item.tier === "lunch" ? "meal" : item.tier;
      const targetTier = tierFilter === "lunch" ? "meal" : tierFilter;
      if (itemTier !== targetTier) return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.id?.toLowerCase().includes(q)
    );
  };

  const filteredSkins = useMemo(
    () => COSMETIC_CATALOG.skins.filter(matchesSearchAndTier),
    [searchQuery, tierFilter]
  );

  const filteredProps = useMemo(
    () => COSMETIC_CATALOG.props.filter(matchesSearchAndTier),
    [searchQuery, tierFilter]
  );

  const filteredPets = useMemo(
    () => COSMETIC_CATALOG.pets.filter(matchesSearchAndTier),
    [searchQuery, tierFilter]
  );

  const totalFilteredCount = useMemo(() => {
    if (activeTab === "skins") return filteredSkins.length;
    if (activeTab === "props") return filteredProps.length;
    if (activeTab === "pets") return filteredPets.length;
    if (activeTab === "ambient") return COSMETIC_CATALOG.soundscapes.length;
    if (activeTab === "all") return filteredSkins.length + filteredProps.length + filteredPets.length;
    return 0;
  }, [activeTab, filteredSkins, filteredProps, filteredPets]);

  // Sidebar navigation menu items
  const asideMenuItems = [
    {
      id: "all",
      label: "All Items",
      count: COSMETIC_CATALOG.skins.length + COSMETIC_CATALOG.props.length + COSMETIC_CATALOG.pets.length,
      icon: Grid,
      desc: "Full vault catalog",
    },
    {
      id: "skins",
      label: "Agent Skins",
      count: COSMETIC_CATALOG.skins.length,
      icon: Bot,
      desc: "Character outfits & visors",
    },
    {
      id: "props",
      label: "Tech Desk Props",
      count: COSMETIC_CATALOG.props.length,
      icon: Laptop,
      desc: "Workstation gear & tech",
    },
    {
      id: "pets",
      label: "Pets & Companions",
      count: COSMETIC_CATALOG.pets.length,
      icon: Gift,
      desc: "Office animals & drones",
    },
    {
      id: "ambient",
      label: "Ambient Sound",
      count: COSMETIC_CATALOG.soundscapes.length,
      icon: Volume2,
      desc: "Lo-Fi & background audio",
    },
    {
      id: "donate",
      label: "Supporter Vault (VietQR)",
      badge: "Buff Dev",
      icon: Coffee,
      desc: "VietQR & Bank Transfer",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-[#181818] text-slate-300 overflow-hidden select-none">
      {/* ===================== ASIDE SIDEBAR MENU ===================== */}
      <aside
        data-testid="store-aside-menu"
        className="w-full md:w-64 lg:w-72 bg-[#1b1b1c] border-b md:border-b-0 md:border-r border-[#2d2d30] flex flex-col shrink-0 h-auto md:h-full z-20"
      >
        {/* Aside Header */}
        <div className="p-4 border-b border-[#2d2d30] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">Supporter Store</h2>
              <p className="text-[11px] text-slate-400">100 Tech Items & Effects</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-[#252526] text-slate-400 hover:text-white"
              title="Close Store"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Aside Search Box */}
        <div className="p-3 border-b border-[#2d2d30]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 100 items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 bg-[#252526] border border-[#3e3e42] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#007acc]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Aside Category Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
          <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Categories
          </div>
          {asideMenuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#007acc] text-white font-semibold shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-[#252526]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <div>
                    <div className="leading-tight">{item.label}</div>
                    <div
                      className={`text-[10px] ${
                        isActive ? "text-cyan-100" : "text-slate-500"
                      } line-clamp-1`}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#252526] text-slate-400 border border-[#333333]"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Tier Filter Chips */}
          <div className="pt-3 px-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Filter By Tier</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {[
                { id: "all", label: "All" },
                { id: "free", label: "Free" },
                { id: "coffee", label: "20k ₫" },
                { id: "lunch", label: "50k ₫" },
                { id: "vip", label: "VIP" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTierFilter(t.id)}
                  className={`px-2 py-0.5 text-[10px] rounded border transition-colors cursor-pointer ${
                    tierFilter === t.id
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-semibold"
                      : "bg-[#252526] text-slate-400 border-[#333333] hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Aside Footer: Character Equipped Preview Widget */}
        <div className="p-3 border-t border-[#2d2d30] bg-[#161617] text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>Equipped Character</span>
            <span
              className={`font-mono text-[9px] px-1 rounded ${
                storeState.isSupporter
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {storeState.isSupporter ? "VIP SUPPORTER" : "FREE AGENT"}
            </span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg bg-[#202022] border border-[#2d2d30]">
            <div className="w-12 h-12 rounded bg-[#181818] border border-[#333333] flex items-center justify-center shrink-0 overflow-hidden">
              <div className="scale-75">
                <SkinPreview skinId={storeState.equippedSkin} />
              </div>
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="font-bold text-white text-xs truncate">
                {COSMETIC_CATALOG.skins.find((s) => s.id === storeState.equippedSkin)?.name || "Classic Bot"}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Pet: {COSMETIC_CATALOG.pets.find((p) => p.id === storeState.equippedPet)?.name || "None"}
              </div>
              <div className="text-[10px] text-cyan-400 truncate">
                Props: {storeState.equippedProps?.length || 0} active
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ===================== MAIN CONTENT AREA ===================== */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#1e1e1e]">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#2d2d30] bg-[#1a1a1a] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              {activeTab === "all" && <Grid className="w-4 h-4 text-cyan-400" />}
              {activeTab === "skins" && <Bot className="w-4 h-4 text-pink-400" />}
              {activeTab === "props" && <Laptop className="w-4 h-4 text-emerald-400" />}
              {activeTab === "pets" && <Gift className="w-4 h-4 text-purple-400" />}
              {activeTab === "ambient" && <Volume2 className="w-4 h-4 text-amber-400" />}
              {activeTab === "donate" && <Coffee className="w-4 h-4 text-amber-400" />}
              <span>
                {activeTab === "all" && "All Items & Character Effects (100 Items)"}
                {activeTab === "skins" && "Agent Skins (30 Outfits)"}
                {activeTab === "props" && "Desk Props & Gadgets (50 Props)"}
                {activeTab === "pets" && "Pets & Companions (20 Companions)"}
                {activeTab === "ambient" && "Ambient Audio Soundscapes"}
                {activeTab === "donate" && "Buy Me a Coffee (VietQR Recipient)"}
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeTab === "all" && "Browse the full collection of skins, tech props, and companion pets"}
              {activeTab === "skins" && "Customize your AI agents on the visual workstation office canvas"}
              {activeTab === "props" && "Place computers, espresso machines, and neon devices on desks"}
              {activeTab === "pets" && "Keep cozy cats, loyal dogs, and drones beside agent workstations"}
              {activeTab === "ambient" && "Enhance focus with web audio soundscapes generated in real-time"}
              {activeTab === "donate" && "Scan via VietQR to support continuous AGMon open-source development"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 bg-[#252526] px-2.5 py-1 rounded-md border border-[#333333]">
              Showing {totalFilteredCount} items
            </span>
            {activeTab !== "donate" && (
              <button
                onClick={() => setActiveTab("donate")}
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-md text-xs font-semibold cursor-pointer transition-colors"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Buff Dev</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Catalog Grid View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* TAB: ALL ITEMS OR SKINS */}
            {(activeTab === "all" || activeTab === "skins") && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Agent Skins ({filteredSkins.length})</span>
                  </h3>
                  {activeTab === "all" && (
                    <button
                      onClick={() => setActiveTab("skins")}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>View All Skins</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 text-xs">
                  {filteredSkins.map((skin) => {
                    const isEquipped = storeState.equippedSkin === skin.id;
                    const isUnlocked =
                      skin.tier === "free" ||
                      storeState.isSupporter ||
                      storeState.unlockedItems.includes(skin.id);

                    const unlockTier =
                      skin.tier === "meal" || skin.tier === "lunch"
                        ? "lunch"
                        : skin.tier === "vip"
                        ? "vip"
                        : "coffee";
                    const unlockPrice =
                      skin.tier === "meal" || skin.tier === "lunch"
                        ? "50k ₫"
                        : skin.tier === "vip"
                        ? "100k ₫"
                        : skin.tier === "free"
                        ? "Free"
                        : "20k ₫";

                    return (
                      <div
                        key={skin.id}
                        className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                          isEquipped
                            ? "bg-[#007acc]/15 border-[#007acc] shadow-sm shadow-[#007acc]/10"
                            : "bg-[#252526] border-[#333333] hover:border-slate-500"
                        }`}
                      >
                        {/* Visual SVG Artwork Preview with Character Mock */}
                        <div className="mb-2.5">
                          <SkinPreview skinId={skin.id} />
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs truncate">
                              {skin.name}
                            </span>
                            <span
                              className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                                skin.tier === "free"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                  : skin.tier === "vip"
                                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                                  : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              }`}
                            >
                              {skin.tier}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                            {skin.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#333333] flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 uppercase font-mono">
                            {isEquipped ? "IN USE" : isUnlocked ? "OWNED" : "LOCKED"}
                          </span>

                          {isUnlocked ? (
                            <button
                              type="button"
                              onClick={() => equipSkin(skin.id)}
                              disabled={isEquipped}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                isEquipped
                                  ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default"
                                  : "bg-[#007acc] hover:bg-[#0062a3] text-white"
                              }`}
                            >
                              {isEquipped ? "Equipped" : "Equip"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUnlockTier(unlockTier)}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
                              title={`Donate ${unlockPrice} to unlock ${skin.name}`}
                            >
                              <Lock className="w-3 h-3" />
                              <span>Unlock ({unlockPrice})</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* TAB: ALL ITEMS OR TECH PROPS */}
            {(activeTab === "all" || activeTab === "props") && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tech Desk Props ({filteredProps.length})</span>
                  </h3>
                  {activeTab === "all" && (
                    <button
                      onClick={() => setActiveTab("props")}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>View All Props</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 text-xs">
                  {filteredProps.map((prop) => {
                    const isEquipped = storeState.equippedProps?.includes(prop.id);
                    const isUnlocked =
                      prop.tier === "free" ||
                      storeState.isSupporter ||
                      storeState.unlockedItems.includes(prop.id);

                    const unlockTier =
                      prop.tier === "meal" || prop.tier === "lunch"
                        ? "lunch"
                        : prop.tier === "vip"
                        ? "vip"
                        : "coffee";
                    const unlockPrice =
                      prop.tier === "meal" || prop.tier === "lunch"
                        ? "50k ₫"
                        : prop.tier === "vip"
                        ? "100k ₫"
                        : prop.tier === "free"
                        ? "Free"
                        : "20k ₫";

                    return (
                      <div
                        key={prop.id}
                        className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                          isEquipped
                            ? "bg-[#007acc]/15 border-[#007acc] shadow-sm shadow-[#007acc]/10"
                            : "bg-[#252526] border-[#333333] hover:border-slate-500"
                        }`}
                      >
                        {/* Visual Artwork with Character Mock Preview */}
                        <div className="mb-2.5">
                          <PropPreview propId={prop.id} />
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs truncate">
                              {prop.name}
                            </span>
                            <span
                              className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                                prop.tier === "free"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                  : prop.tier === "vip"
                                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                                  : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              }`}
                            >
                              {prop.tier}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                            {prop.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#333333] flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 uppercase font-mono">
                            {isEquipped ? "ACTIVE" : isUnlocked ? "OWNED" : "LOCKED"}
                          </span>

                          {isUnlocked ? (
                            <button
                              type="button"
                              onClick={() => toggleProp(prop.id)}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                isEquipped
                                  ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/40"
                                  : "bg-[#2d2d30] hover:bg-[#3e3e42] text-white"
                              }`}
                            >
                              {isEquipped ? "Remove" : "Place on Desk"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUnlockTier(unlockTier)}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
                              title={`Donate ${unlockPrice} to unlock ${prop.name}`}
                            >
                              <Lock className="w-3 h-3" />
                              <span>Unlock ({unlockPrice})</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* TAB: ALL ITEMS OR PETS */}
            {(activeTab === "all" || activeTab === "pets") && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-purple-400" />
                    <span>Pets & Companions ({filteredPets.length})</span>
                  </h3>
                  {activeTab === "all" && (
                    <button
                      onClick={() => setActiveTab("pets")}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>View All Pets</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 text-xs">
                  {filteredPets.map((pet) => {
                    const isEquipped = storeState.equippedPet === pet.id;
                    const isUnlocked =
                      pet.tier === "free" ||
                      storeState.isSupporter ||
                      storeState.unlockedItems.includes(pet.id);

                    const unlockTier =
                      pet.tier === "meal" || pet.tier === "lunch"
                        ? "lunch"
                        : pet.tier === "vip"
                        ? "vip"
                        : "coffee";
                    const unlockPrice =
                      pet.tier === "meal" || pet.tier === "lunch"
                        ? "50k ₫"
                        : pet.tier === "vip"
                        ? "100k ₫"
                        : pet.tier === "free"
                        ? "Free"
                        : "20k ₫";

                    return (
                      <div
                        key={pet.id}
                        className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                          isEquipped
                            ? "bg-[#007acc]/15 border-[#007acc] shadow-sm shadow-[#007acc]/10"
                            : "bg-[#252526] border-[#333333] hover:border-slate-500"
                        }`}
                      >
                        {/* Visual Artwork with Character Mock Preview */}
                        <div className="mb-2.5">
                          <PetPreview petId={pet.id} />
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs truncate">
                              {pet.name}
                            </span>
                            <span
                              className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                                pet.tier === "free"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                  : pet.tier === "vip"
                                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                                  : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              }`}
                            >
                              {pet.tier}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                            {pet.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#333333] flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 uppercase font-mono">
                            {isEquipped ? "EQUIPPED" : isUnlocked ? "OWNED" : "LOCKED"}
                          </span>

                          {isUnlocked ? (
                            <button
                              type="button"
                              onClick={() => equipPet(pet.id)}
                              disabled={isEquipped}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                isEquipped
                                  ? "bg-purple-600/30 text-purple-300 border border-purple-500/40 cursor-default"
                                  : "bg-[#007acc] hover:bg-[#0062a3] text-white"
                              }`}
                            >
                              {isEquipped ? "Equipped" : "Equip Pet"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUnlockTier(unlockTier)}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
                              title={`Donate ${unlockPrice} to unlock ${pet.name}`}
                            >
                              <Lock className="w-3 h-3" />
                              <span>Unlock ({unlockPrice})</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* TAB: AMBIENT SOUNDSCAPES */}
            {activeTab === "ambient" && (
              <div className="space-y-4 text-xs">
                {/* Volume Controller Card */}
                <div className="p-4 bg-[#252526] border border-[#333333] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                      <span>Web Audio Ambient Soundscapes</span>
                    </h4>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Synthesized procedural relaxation background soundscapes for deep programming focus.
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#1e1e1e] px-3 py-2 rounded-lg border border-[#333333]">
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={storeState.ambientVolume ?? 0.35}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setAmbientVolume(v);
                        setAmbientSound(storeState.ambientSound, v);
                      }}
                      className="w-28 accent-[#007acc] cursor-pointer"
                    />
                    <Volume2 className="w-3.5 h-3.5 text-slate-300" />
                    <span className="font-mono text-cyan-300 text-xs w-8 text-right">
                      {Math.round((storeState.ambientVolume ?? 0.35) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Soundscapes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {COSMETIC_CATALOG.soundscapes.map((sound) => {
                    const isActive = storeState.ambientSound === sound.id;
                    return (
                      <div
                        key={sound.id}
                        className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                          isActive
                            ? "bg-cyan-950/20 border-cyan-500 shadow-md shadow-cyan-900/10"
                            : "bg-[#252526] border-[#333333] hover:border-slate-500"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-sm">{sound.name}</span>
                            {isActive && <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />}
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed">{sound.description}</p>
                        </div>

                        <div className="mt-4 pt-2.5 border-t border-[#333333] flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              if (isActive) {
                                stopAmbient();
                                setAmbientSound("none");
                              } else {
                                startAmbient(sound.id, storeState.ambientVolume);
                                setAmbientSound(sound.id);
                              }
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              isActive
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
                                : "bg-[#007acc] hover:bg-[#0062a3] text-white"
                            }`}
                          >
                            {isActive ? (
                              <>
                                <Square className="w-3 h-3 fill-rose-300" />
                                <span>Stop Audio</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 fill-white" />
                                <span>Play Soundscape</span>
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

            {/* TAB: VIETQR SUPPORTER VAULT */}
            {activeTab === "donate" && (
              <div className="space-y-4 text-xs">
                {/* Donor Tier Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {DONATE_TIERS.map((tier) => {
                    const isSelected = selectedTier.id === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTier(tier)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
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

                {/* VietQR Code & Banking Details (clean qr_only, no account name) */}
                <div className="bg-[#1e1e1e] border border-[#333333] rounded-xl p-5 flex flex-col sm:flex-row gap-6 items-center">
                  {/* Clean QR Image */}
                  <div className="bg-white p-3 rounded-xl shrink-0 shadow-xl flex flex-col items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={vietQrUrl}
                      alt="VietQR donation code"
                      className="w-44 h-44 object-contain"
                      loading="lazy"
                    />
                    <span className="text-[9px] font-bold text-slate-700 tracking-wider uppercase mt-2">
                      Scan with Banking App
                    </span>
                  </div>

                  {/* Bank Details */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-emerald-400" />
                      <span className="font-bold text-white text-sm">
                        Support via VietQR / Bank Transfer
                      </span>
                    </div>

                    <div className="bg-[#252526] p-3 rounded-lg border border-[#333333] space-y-2 font-mono text-xs">
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
                            {copiedBank ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
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

                    {/* External Donation Links */}
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

                {/* Voucher / Supporter Key Activation Box */}
                <div className="bg-[#252526] border border-[#333333] rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white flex items-center gap-2 text-xs">
                      <Key className="w-4 h-4 text-amber-400" />
                      <span>Redeem Supporter Key / Unlock Code</span>
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
                      className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
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

          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="px-6 py-3 border-t border-[#2d2d30] bg-[#161617] flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Free Software Guarantee</span>
            </span>
            <span className="hidden sm:inline text-slate-500 text-[11px]">
              - 100% of AGMon core engineering features remain completely free
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            AGMon v0.4.0 Supporter Vault
          </span>
        </div>
      </main>
    </div>
  );
}