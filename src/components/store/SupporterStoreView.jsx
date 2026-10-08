"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Coffee,
  Sparkles,
  ShieldCheck,
  Check,
  ExternalLink,
  ShoppingBag,
  Volume2,
  VolumeX,
  Key,
  X,
  Laptop,
  Play,
  Square,
  Gift,
  AlertCircle,
  Copy,
  ChevronRight,
  ChevronLeft,
  Lock,
  Search,
  Grid,
  Bot,
  Filter,
  LayoutGrid,
  Zap,
  Trophy,
  Palette,
} from "lucide-react";
import {
  COSMETIC_CATALOG,
  getSupporterState,
  unlockWithCode,
  equipSkin,
  equipPet,
  toggleProp,
  equipAura,
  equipTrophy,
  equipOfficeTheme,
  setAmbientSound,
  SUPPORTER_CHANGE_EVENT,
} from "@/lib/supporterStore";
import { startAmbient, stopAmbient, setAmbientVolume } from "@/lib/ambientAudio";
import { Item3DPreview } from "./Item3DRenderer";

// VietQR donation recipient info (MB Bank)
const VIETQR_CONFIG = {
  bankId: "MB",
  bankName: "MB Bank (Military Bank)",
  accountNo: "0968868862",
  template: "qr_only",
};

const DONATE_TIERS = [
  {
    id: "coffee",
    title: "Dev Coffee Fuel",
    amount: 20000,
    amountUsd: "$1",
    tag: "Popular",
    description: "Fuel developer energy for late-night coding and debugging sessions.",
  },
  {
    id: "lunch",
    title: "Lunch Encouragement",
    amount: 50000,
    amountUsd: "$2.5",
    tag: "Recommended",
    description: "Support server infrastructure and new feature development for AGMon.",
  },
  {
    id: "vip",
    title: "VIP Dev Buff Pack",
    amount: 100000,
    amountUsd: "$5",
    tag: "VIP Supporter",
    description: "Unlock all 1,000 3D isometric items, aura effects, and exclusive badges.",
  },
];

const ITEMS_PER_PAGE = 48;

export default function SupporterStoreView({ hideHeader = false, onClose = null }) {
  // Navigation: 'all' | 'skins' | 'props' | 'pets' | 'auras' | 'trophies' | 'ambient' | 'donate'
  const [activeTab, setActiveTab] = useState("all");
  const [storeState, setStoreState] = useState(getSupporterState());
  const [selectedTier, setSelectedTier] = useState(DONATE_TIERS[0]);
  const [unlockCodeInput, setUnlockCodeInput] = useState("");
  const [unlockFeedback, setUnlockFeedback] = useState(null);
  const [copiedBank, setCopiedBank] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all"); // 'all' | 'free' | 'coffee' | 'lunch' | 'vip'
  const [gridDensity, setGridDensity] = useState("normal"); // 'normal' | 'dense'
  const [currentPage, setCurrentPage] = useState(1);
  const [playingAudio, setPlayingAudio] = useState(null);

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

  // Reset pagination when category, query, or tier changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, tierFilter]);

  // Unlock via activation code
  const handleUnlockCode = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const code = unlockCodeInput.trim() || "AGMON-COFFEE-VIP";

    const res = unlockWithCode(code);
    setUnlockFeedback(res);
    if (res.success) {
      setUnlockCodeInput("");
      setStoreState(res.state);
      setTimeout(() => setUnlockFeedback(null), 5000);
    }
  };

  // Quick unlock all for testing
  const handleQuickUnlockAll = () => {
    const res = unlockWithCode("AGMON-COFFEE-VIP");
    setUnlockFeedback(res);
    if (res.success) {
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
      item.id?.toLowerCase().includes(q) ||
      item.archetype?.toLowerCase().includes(q)
    );
  };

  // Filtered lists
  const filteredSkins = useMemo(
    () => (COSMETIC_CATALOG.skins || []).filter(matchesSearchAndTier),
    [searchQuery, tierFilter]
  );

  const filteredProps = useMemo(
    () => (COSMETIC_CATALOG.props || []).filter(matchesSearchAndTier),
    [searchQuery, tierFilter]
  );

  const filteredPets = useMemo(
    () => (COSMETIC_CATALOG.pets || []).filter(matchesSearchAndTier),
    [searchQuery, tierFilter]
  );

  const filteredAuras = useMemo(
    () => (COSMETIC_CATALOG.auras || []).filter(matchesSearchAndTier),
    [searchQuery, tierFilter]
  );

  const filteredTrophies = useMemo(
    () => (COSMETIC_CATALOG.trophies || []).filter(matchesSearchAndTier),
    [searchQuery, tierFilter]
  );

  const filteredThemes = useMemo(
    () => (COSMETIC_CATALOG.officeThemes || []).filter(matchesSearchAndTier),
    [searchQuery, tierFilter]
  );

  // Active items list based on current tab
  const activeItemsList = useMemo(() => {
    if (activeTab === "themes") return filteredThemes;
    if (activeTab === "skins") return filteredSkins;
    if (activeTab === "props") return filteredProps;
    if (activeTab === "pets") return filteredPets;
    if (activeTab === "auras") return filteredAuras;
    if (activeTab === "trophies") return filteredTrophies;
    if (activeTab === "all") {
      return [
        ...filteredThemes,
        ...filteredSkins,
        ...filteredProps,
        ...filteredPets,
        ...filteredAuras,
        ...filteredTrophies,
      ];
    }
    return [];
  }, [
    activeTab,
    filteredThemes,
    filteredSkins,
    filteredProps,
    filteredPets,
    filteredAuras,
    filteredTrophies,
  ]);

  // Pagination calculations
  const totalItemsCount = activeItemsList.length;
  const totalPages = Math.max(1, Math.ceil(totalItemsCount / ITEMS_PER_PAGE));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return activeItemsList.slice(start, start + ITEMS_PER_PAGE);
  }, [activeItemsList, currentPage]);

  // Sidebar navigation menu items
  const asideMenuItems = [
    {
      id: "all",
      label: "All Items",
      count: 1010,
      icon: Grid,
      desc: "10 Themes · 250 Skins · 350 Props · 200 Pets · 100 Auras · 100 Trophies",
    },
    {
      id: "themes",
      label: "Office Themes",
      count: (COSMETIC_CATALOG.officeThemes || []).length,
      icon: Palette,
      desc: "Virtual office floor styles, neon grids & wallpapers",
    },
    {
      id: "skins",
      label: "Agent Skins 3D",
      count: (COSMETIC_CATALOG.skins || []).length,
      icon: Bot,
      desc: "Cyborgs, mecha frames, and cyber armor",
    },
    {
      id: "props",
      label: "Tech Desk Props",
      count: (COSMETIC_CATALOG.props || []).length,
      icon: Laptop,
      desc: "Workstation gear, hardware, and servers",
    },
    {
      id: "pets",
      label: "Pets & Companions",
      count: (COSMETIC_CATALOG.pets || []).length,
      icon: Gift,
      desc: "Cyber pets & companion hover drones",
    },
    {
      id: "auras",
      label: "Auras & Effects",
      count: (COSMETIC_CATALOG.auras || []).length,
      icon: Sparkles,
      desc: "Energy rings & particle spectrums",
    },
    {
      id: "trophies",
      label: "Trophies & Badges",
      count: (COSMETIC_CATALOG.trophies || []).length,
      icon: Trophy,
      desc: "Commemorative awards, silicon wafers & medals",
    },
    {
      id: "ambient",
      label: "Ambient Soundscapes",
      count: (COSMETIC_CATALOG.soundscapes || []).length,
      icon: Volume2,
      desc: "Lo-Fi beats & focus background noise",
    },
    {
      id: "donate",
      label: "Supporter Vault (VietQR)",
      badge: "Buff Dev",
      icon: Coffee,
      desc: "Scan VietQR to unlock all VIP perks",
    },
  ];

  // Grid class based on density
  const gridClasses =
    gridDensity === "dense"
      ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 text-xs"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 text-xs";

  // Item equip helper
  const handleItemEquipToggle = (item) => {
    if (item.category === "themes") {
      equipOfficeTheme(item.id);
    } else if (item.category === "skins") {
      equipSkin(item.id);
    } else if (item.category === "props") {
      toggleProp(item.id);
    } else if (item.category === "pets") {
      equipPet(item.id);
    } else if (item.category === "auras") {
      equipAura(item.id);
    } else if (item.category === "trophies") {
      equipTrophy(item.id);
    }
  };

  const isItemEquipped = (item) => {
    if (item.category === "themes") return storeState.equippedOfficeTheme === item.id;
    if (item.category === "skins") return storeState.equippedSkin === item.id;
    if (item.category === "props") return storeState.equippedProps?.includes(item.id);
    if (item.category === "pets") return storeState.equippedPet === item.id;
    if (item.category === "auras") return storeState.equippedAura === item.id;
    if (item.category === "trophies") return storeState.equippedTrophy === item.id;
    return false;
  };

  const isItemUnlocked = (item) => {
    return (
      item.tier === "free" ||
      storeState.isSupporter ||
      storeState.unlockedItems.includes(item.id)
    );
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-[#141416] text-slate-300 overflow-hidden select-none">
      {/* ===================== ASIDE SIDEBAR MENU ===================== */}
      <aside
        data-testid="store-aside-menu"
        className="w-full md:w-64 lg:w-72 bg-[#18181c] border-b md:border-b-0 md:border-r border-[#26262b] flex flex-col shrink-0 h-auto md:h-full z-20 shadow-xl"
      >
        {/* Aside Header */}
        <div className="p-4 border-b border-[#26262b] flex items-center justify-between bg-[#151518]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/30 to-amber-600/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-sm">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">Supporter Store</h2>
              <p className="text-[11px] text-amber-400 font-mono">1,000 3D Items & Effects</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-[#25252a] text-slate-400 hover:text-white transition-colors"
              title="Close store"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Aside Search Box */}
        <div className="p-3 border-b border-[#26262b]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search across 1,000 items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 bg-[#202026] border border-[#33333d] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#007acc] transition-colors"
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
            Categories (1,000 Items)
          </div>
          {asideMenuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#007acc] text-white font-semibold shadow-md shadow-[#007acc]/20"
                    : "text-slate-300 hover:text-white hover:bg-[#202026]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <div>
                    <div className="leading-tight text-xs">{item.label}</div>
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
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white font-bold"
                        : "bg-[#25252d] text-slate-400 border border-[#33333d]"
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
              <Filter className="w-3 h-3 text-cyan-400" />
              <span>Filter by Tier</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {[
                { id: "all", label: "All" },
                { id: "free", label: "Free" },
                { id: "coffee", label: "Coffee (20k)" },
                { id: "lunch", label: "Lunch (50k)" },
                { id: "vip", label: "VIP (100k)" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTierFilter(t.id)}
                  className={`px-2 py-1 text-[10px] rounded-md border transition-colors cursor-pointer ${
                    tierFilter === t.id
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold shadow-sm"
                      : "bg-[#202026] text-slate-400 border-[#2f2f38] hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Demo Unlock Button */}
          {!storeState.isSupporter && (
            <div className="pt-3 px-2">
              <button
                type="button"
                onClick={handleQuickUnlockAll}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-sm"
                title="Unlock all 1,000 items instantly to preview"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Unlock all 1,000 items (VIP Demo)</span>
              </button>
            </div>
          )}
        </nav>

        {/* Aside Footer: Character Equipped Preview Widget */}
        <div className="p-3 border-t border-[#26262b] bg-[#121215] text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>Current Avatar</span>
            <span
              className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-bold ${
                storeState.isSupporter
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {storeState.isSupporter ? "VIP SUPPORTER" : "FREE AGENT"}
            </span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#1d1d23] border border-[#2b2b34] shadow-inner">
            <div className="w-14 h-14 rounded-lg bg-[#141418] border border-[#33333d] flex items-center justify-center shrink-0 overflow-hidden">
              <div className="scale-75">
                <Item3DPreview itemId={storeState.equippedSkin} className="w-20 h-20" />
              </div>
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="font-bold text-white text-xs truncate">
                {(COSMETIC_CATALOG.skins || []).find((s) => s.id === storeState.equippedSkin)?.name || "Classic Bot"}
              </div>
              <div className="text-[10px] text-purple-300 truncate flex items-center gap-1">
                <span>Theme:</span>
                <span className="font-semibold truncate">
                  {(COSMETIC_CATALOG.officeThemes || []).find((t) => t.id === storeState.equippedOfficeTheme)?.name || "Classic Slate"}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                <span>Pet:</span>
                <span className="text-pink-300 font-semibold truncate">
                  {(COSMETIC_CATALOG.pets || []).find((p) => p.id === storeState.equippedPet)?.name || "None selected"}
                </span>
              </div>
              <div className="text-[10px] text-cyan-400 truncate flex items-center gap-1">
                <span>Props:</span>
                <span className="font-bold">{storeState.equippedProps?.length || 0} equipped</span>
              </div>
              {storeState.equippedAura && storeState.equippedAura !== "none" && (
                <div className="text-[10px] text-amber-300 truncate flex items-center gap-1">
                  <span>Aura:</span>
                  <span className="font-semibold truncate">
                    {(COSMETIC_CATALOG.auras || []).find((a) => a.id === storeState.equippedAura)?.name || storeState.equippedAura}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* ===================== MAIN CONTENT AREA ===================== */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#18181c]">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#26262b] bg-[#151518] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#007acc]/20 text-cyan-300 border border-[#007acc]/40">
                CATALOG 1,010
              </span>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                {activeTab === "all" && <Grid className="w-4 h-4 text-cyan-400" />}
                {activeTab === "themes" && <Palette className="w-4 h-4 text-purple-400" />}
                {activeTab === "skins" && <Bot className="w-4 h-4 text-pink-400" />}
                {activeTab === "props" && <Laptop className="w-4 h-4 text-emerald-400" />}
                {activeTab === "pets" && <Gift className="w-4 h-4 text-purple-400" />}
                {activeTab === "auras" && <Sparkles className="w-4 h-4 text-amber-400" />}
                {activeTab === "trophies" && <Trophy className="w-4 h-4 text-yellow-400" />}
                {activeTab === "ambient" && <Volume2 className="w-4 h-4 text-cyan-400" />}
                {activeTab === "donate" && <Coffee className="w-4 h-4 text-amber-400" />}
                <span>
                  {activeTab === "all" && "All 1,010 Tech Items & 3D Effects"}
                  {activeTab === "themes" && "Office Themes & Wallpapers (10 Floor Styles)"}
                  {activeTab === "skins" && "Agent 3D Skins (250 Armor & Visor Models)"}
                  {activeTab === "props" && "Desk Props & Hardware (350 Devices & Rigs)"}
                  {activeTab === "pets" && "Pets & Cyber Companions (200 Pets & Drones)"}
                  {activeTab === "auras" && "Auras & Character Effects (100 Energy Spectrums)"}
                  {activeTab === "trophies" && "Trophies & Silicon Badges (100 3D Medals)"}
                  {activeTab === "ambient" && "Lo-Fi Ambient Audio (6 Soundscapes)"}
                  {activeTab === "donate" && "Buy Me a Coffee (VietQR Bank Transfer)"}
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === "all" && "Collection of 1,010 high-precision 3D isometric items: cast shadows, directional lighting, and microchip details."}
              {activeTab === "themes" && "Custom floor environments, neon gridlines, and ambient lighting for the 2D Virtual Office canvas."}
              {activeTab === "skins" && "Customize chibi robot avatars for AI programming agents on the visual canvas."}
              {activeTab === "props" && "Decorate workstations with dual displays, server racks, espresso machines, and cyber bonsai."}
              {activeTab === "pets" && "Companion robot pets and hover drones to keep you company during complex debugging sessions."}
              {activeTab === "auras" && "Plasma radiation effects, orbital rings, and radiant particles encircling your agent."}
              {activeTab === "trophies" && "Optical crystal blocks and silicon wafers commemorating open source development contributions."}
              {activeTab === "ambient" && "Procedural ambient synthetic soundscapes designed for deep programming focus."}
              {activeTab === "donate" && "Scan VietQR to unlock all VIP perks and support ongoing project development."}
            </p>
          </div>

          {/* Quick Toolbar: Density Toggle & Counter */}
          <div className="flex items-center gap-2.5">
            {/* View Mode Density Toggle */}
            <div className="flex items-center bg-[#202026] rounded-lg p-0.5 border border-[#2f2f38]">
              <button
                type="button"
                onClick={() => setGridDensity("normal")}
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  gridDensity === "normal"
                    ? "bg-[#007acc] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Standard grid layout (3-4 columns)"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setGridDensity("dense")}
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  gridDensity === "dense"
                    ? "bg-[#007acc] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Compact grid layout (5-6 columns)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="text-xs font-mono text-cyan-300 bg-[#202026] px-3 py-1 rounded-md border border-[#2f2f38]">
              {activeTab === "ambient"
                ? `${(COSMETIC_CATALOG.soundscapes || []).length} Audio Tracks`
                : activeTab === "donate"
                ? "3 Tiers"
                : `${totalItemsCount} Items`}
            </span>

            {activeTab !== "donate" && (
              <button
                onClick={() => setActiveTab("donate")}
                className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 rounded-md text-xs font-semibold cursor-pointer transition-all shadow-sm"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Buff Dev</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Category Tabs Bar */}
        <div className="px-6 py-2 bg-[#1b1b20] border-b border-[#26262b] flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          {[
            { id: "all", label: "All (1,010)", icon: Grid },
            { id: "themes", label: "Themes (10)", icon: Palette },
            { id: "skins", label: "Skins (250)", icon: Bot },
            { id: "props", label: "Props (350)", icon: Laptop },
            { id: "pets", label: "Pets (200)", icon: Gift },
            { id: "auras", label: "Auras (100)", icon: Sparkles },
            { id: "trophies", label: "Trophies (100)", icon: Trophy },
            { id: "ambient", label: "Ambient (6)", icon: Volume2 },
            { id: "donate", label: "VietQR Vault", icon: Coffee },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSel = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSel
                    ? "bg-[#007acc] text-white font-bold shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-[#25252e]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSel ? "text-white" : "text-slate-400"}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Catalog Grid View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* TAB: AMBIENT SOUNDSCAPES */}
            {activeTab === "ambient" && (
              <section className="space-y-4">
                <div className="border-b border-[#26262b] pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Procedural Focus Audio</h3>
                      <p className="text-xs text-slate-400">Relaxing background ambient soundscapes to reduce coding fatigue</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(COSMETIC_CATALOG.soundscapes || []).map((sound) => {
                    const isSelected = storeState.ambientSound === sound.id;
                    const isPlaying = playingAudio === sound.id;

                    return (
                      <div
                        key={sound.id}
                        className={`p-4 rounded-xl border transition-all bg-[#1c1c22] ${
                          isSelected
                            ? "border-amber-500/60 shadow-lg shadow-amber-950/20 ring-1 ring-amber-500/40"
                            : "border-[#2b2b35] hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-white text-sm">{sound.name}</h4>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              isSelected
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : "bg-[#25252e] text-slate-400"
                            }`}
                          >
                            {isSelected ? "EQUIPPED" : "READY"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4 min-h-[36px]">
                          {sound.description}
                        </p>

                        <div className="flex items-center gap-2 pt-2 border-t border-[#272730]">
                          <button
                            type="button"
                            onClick={() => {
                              if (isPlaying) {
                                stopAmbient();
                                setPlayingAudio(null);
                              } else {
                                startAmbient(sound.id, storeState.ambientVolume);
                                setPlayingAudio(sound.id);
                              }
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                              isPlaying
                                ? "bg-red-500/20 text-red-300 border border-red-500/40"
                                : "bg-[#252530] text-slate-200 hover:text-white border border-[#373745]"
                            }`}
                          >
                            {isPlaying ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            <span>{isPlaying ? "Stop" : "Preview"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setAmbientSound(sound.id);
                              if (sound.id !== "none") {
                                startAmbient(sound.id, storeState.ambientVolume);
                                setPlayingAudio(sound.id);
                              } else {
                                stopAmbient();
                                setPlayingAudio(null);
                              }
                            }}
                            disabled={isSelected}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 opacity-70"
                                : "bg-[#007acc] hover:bg-[#0088e0] text-white font-bold"
                            }`}
                          >
                            {isSelected ? "Active" : "Activate"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* TAB: DONATE VIETQR VAULT */}
            {activeTab === "donate" && (
              <section className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#222028] to-[#1a1a24] border border-amber-500/30 shadow-xl">
                  <div className="max-w-3xl space-y-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      VIETQR MB BANK
                    </span>
                    <h2 className="text-xl font-bold text-white">Supporter Vault - Fuel the Developers</h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      AGMon is built independently with high-quality open-source spirit.
                      Every donation via VietQR helps support server infrastructure, sustain development, and unlocks all 1,000 3D isometric items.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Tiers Selection */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-amber-400" />
                      <span>Choose Supporter Tier</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {DONATE_TIERS.map((tier) => {
                        const isSelected = selectedTier.id === tier.id;
                        return (
                          <div
                            key={tier.id}
                            onClick={() => setSelectedTier(tier)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                              isSelected
                                ? "bg-[#25222e] border-amber-500 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500"
                                : "bg-[#1c1c22] border-[#2c2c36] hover:border-slate-500"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                                  {tier.tag}
                                </span>
                                {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                              </div>
                              <h4 className="font-bold text-white text-sm">{tier.title}</h4>
                              <div className="text-lg font-bold text-amber-400 font-mono mt-1">
                                {tier.amount.toLocaleString("vi-VN")} VND
                              </div>
                              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                                {tier.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Activation Code Form */}
                    <div className="p-4 rounded-xl bg-[#1c1c22] border border-[#2b2b35] space-y-3">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-bold text-white">Have an activation key (Supporter Key)?</h4>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Enter your activation key or try the demo key <code className="text-cyan-300 bg-[#252530] px-1.5 py-0.5 rounded font-mono font-bold">AGMON-COFFEE-VIP</code> to unlock immediately.
                      </p>

                      <form onSubmit={handleUnlockCode} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. AGMON-COFFEE-VIP"
                          value={unlockCodeInput}
                          onChange={(e) => setUnlockCodeInput(e.target.value)}
                          className="flex-1 px-3 py-2 bg-[#141418] border border-[#33333d] rounded-lg text-xs text-white uppercase font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-lg cursor-pointer transition-all shadow-md"
                        >
                          Activate
                        </button>
                      </form>

                      {unlockFeedback && (
                        <div
                          className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                            unlockFeedback.success
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-red-500/20 text-red-300 border border-red-500/40"
                          }`}
                        >
                          {unlockFeedback.success ? (
                            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                          ) : (
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                          )}
                          <span>{unlockFeedback.message}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Dynamic VietQR Card */}
                  <div className="p-5 rounded-2xl bg-[#1c1c24] border border-amber-500/30 flex flex-col items-center justify-between text-center space-y-4 shadow-xl">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                        Scan to Transfer
                      </span>
                      <h4 className="text-base font-bold text-white">MB Bank (Military Bank)</h4>
                      <p className="text-xs text-slate-400">Open any banking app to scan this VietQR code</p>
                    </div>

                    {/* QR Code Container */}
                    <div className="p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                      <img
                        src={vietQrUrl}
                        alt="VietQR MB Bank Donation"
                        className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
                      />
                    </div>

                    {/* Account Info Box (No account name displayed per user instruction) */}
                    <div className="w-full space-y-2">
                      <div className="p-2.5 rounded-xl bg-[#141418] border border-[#2b2b35] flex items-center justify-between text-xs">
                        <span className="text-slate-400">Account Number:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-300 text-sm">{VIETQR_CONFIG.accountNo}</span>
                          <button
                            type="button"
                            onClick={handleCopyAccount}
                            className="p-1 rounded hover:bg-[#272733] text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Copy account number"
                          >
                            {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#141418] border border-[#2b2b35] flex items-center justify-between text-xs">
                        <span className="text-slate-400">Amount:</span>
                        <span className="font-mono font-bold text-emerald-400 text-sm">
                          {selectedTier.amount.toLocaleString("vi-VN")} VND
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* TAB: ITEM GRID (ALL, SKINS, PROPS, PETS, AURAS, TROPHIES) */}
            {activeTab !== "ambient" && activeTab !== "donate" && (
              <section className="space-y-4">
                {/* Items Grid */}
                <div className={gridClasses}>
                  {paginatedItems.map((item) => {
                    const isEquipped = isItemEquipped(item);
                    const isUnlocked = isItemUnlocked(item);

                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-2xl border flex flex-col justify-between transition-all group bg-[#1d1d22] hover:bg-[#22222a] ${
                          isEquipped
                            ? "border-[#007acc] shadow-lg shadow-[#007acc]/15 ring-1 ring-[#007acc]"
                            : "border-[#2c2c36] hover:border-cyan-500/50 hover:shadow-md hover:shadow-cyan-950/20"
                        }`}
                      >
                        {/* 3D Isometric Art Preview */}
                        <div className="mb-2.5">
                          <Item3DPreview item={item} />
                        </div>

                        {/* Title and details */}
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-white text-xs truncate">
                              {item.name}
                            </span>
                            <span
                              className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold border shrink-0 ${
                                item.tier === "free"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                  : item.tier === "vip"
                                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                                  : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              }`}
                            >
                              {item.tier}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        {/* Equip Action Bar */}
                        <div className="mt-3 pt-2.5 border-t border-[#2a2a34] flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">
                            {isEquipped ? "EQUIPPED" : isUnlocked ? "UNLOCKED" : "LOCKED"}
                          </span>

                          {isUnlocked ? (
                            <button
                              type="button"
                              onClick={() => handleItemEquipToggle(item)}
                              disabled={isEquipped && item.category !== "props"}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                isEquipped
                                  ? item.category === "props"
                                    ? "bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30"
                                    : "bg-[#007acc]/20 text-[#007acc] border border-[#007acc]/30 opacity-70 cursor-default"
                                  : "bg-[#007acc] hover:bg-[#0088e0] text-white shadow-sm"
                              }`}
                            >
                              {isEquipped
                                ? item.category === "props"
                                  ? "Remove"
                                  : "Equipped"
                                : item.category === "props"
                                ? "Place on Desk"
                                : item.category === "themes"
                                ? "Apply Floor"
                                : "Equip"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUnlockTier(item.tier)}
                              className="px-2.5 py-1 bg-[#252530] hover:bg-amber-500/20 hover:border-amber-500/40 border border-[#373748] text-amber-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Lock className="w-3 h-3 text-amber-400" />
                              <span>Unlock</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Empty State */}
                {paginatedItems.length === 0 && (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#202028] border border-[#33333f] flex items-center justify-center text-slate-500 mx-auto">
                      <Search className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-white">No matching items found</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      No items matched &quot;{searchQuery}&quot; or the selected filters.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setTierFilter("all");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#252530] border border-[#373746] text-xs text-slate-300 hover:text-white"
                    >
                      Clear filters
                    </button>
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pt-4 border-t border-[#26262b] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">
                      Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                      {Math.min(currentPage * ITEMS_PER_PAGE, totalItemsCount)} of {totalItemsCount} items
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-2.5 py-1.5 rounded-lg bg-[#202026] border border-[#2f2f38] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Prev</span>
                      </button>

                      {/* Numeric page buttons */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5 && currentPage > 3) {
                          pageNum = currentPage - 3 + i;
                          if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-colors ${
                              currentPage === pageNum
                                ? "bg-[#007acc] text-white"
                                : "bg-[#202026] text-slate-400 hover:text-white border border-[#2f2f38]"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="text-slate-500 px-1">...</span>
                      )}

                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-2.5 py-1.5 rounded-lg bg-[#202026] border border-[#2f2f38] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}