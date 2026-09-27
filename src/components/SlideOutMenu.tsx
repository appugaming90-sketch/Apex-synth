import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';
import { formatCash, formatCompactNumber } from '../utils/format';
import {
  X,
  User,
  Trophy,
  Crown,
  Building2,
  DollarSign,
  Zap,
  Package,
  Layers,
  Sparkles,
  Shield,
  ArrowRight,
  TrendingUp,
  Globe
} from 'lucide-react';
import { ItemRarity } from '../types';

const RARITY_COLORS: Record<ItemRarity, { border: string; text: string; bg: string }> = {
  common: { border: 'border-slate-600', text: 'text-slate-300', bg: 'bg-slate-900/60' },
  uncommon: { border: 'border-emerald-500', text: 'text-emerald-300', bg: 'bg-emerald-950/40' },
  rare: { border: 'border-cyan-500', text: 'text-cyan-300', bg: 'bg-cyan-950/40' },
  epic: { border: 'border-fuchsia-500', text: 'text-fuchsia-300', bg: 'bg-fuchsia-950/40' },
  legendary: { border: 'border-amber-400', text: 'text-amber-300', bg: 'bg-amber-950/40' },
  mythic: { border: 'border-rose-500', text: 'text-rose-300', bg: 'bg-rose-950/40' },
  exotic: { border: 'border-indigo-400', text: 'text-indigo-200', bg: 'bg-indigo-950/60' }
};

interface SlideOutMenuProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'leaderboard';
}

export const SlideOutMenu: React.FC<SlideOutMenuProps> = ({
  isOpen,
  onClose,
  initialTab = 'profile'
}) => {
  const {
    profile,
    computedNetWorth,
    currentRankData,
    requiredXP,
    equipment,
    leaderboards,
    setActiveTab,
    masteryCrownsCount,
    builtSpiresCount
  } = useGame();

  const [activeTab, setActiveTabState] = useState<'profile' | 'leaderboard'>(initialTab);
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  if (!isOpen) return null;

  // Leaderboard ranking list
  const filteredLeaderboard = (leaderboards || []).filter(entry => {
    if (selectedRegion === 'ALL') return true;
    return entry.region === selectedRegion;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Right-side Glassmorphism Drawer */}
      <div className="relative w-full sm:w-[480px] max-w-full h-full bg-gray-950/95 backdrop-blur-2xl border-l border-cyan-500/40 shadow-[-15px_0_40px_rgba(0,0,0,0.85)] flex flex-col z-10 transition-transform duration-300 transform translate-x-0">
        
        {/* TOP BAR / TABS SWITCHER */}
        <div className="p-4 border-b border-gray-800/80 bg-gray-900/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-950 border border-gray-800">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTabState('profile');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-orbitron font-bold transition flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              PROFILE
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTabState('leaderboard');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-orbitron font-bold transition flex items-center gap-1.5 ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              LEADERBOARD
            </button>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 border border-transparent hover:border-gray-700 transition"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DRAWER CONTENT CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          
          {/* ==================================================== */}
          {/* TAB 1: PROFILE DOSSIER & STATS                       */}
          {/* ==================================================== */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              
              {/* Operative Identity Card */}
              <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center space-x-3.5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-900 to-gray-900 border-2 border-cyan-400 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    {profile.avatarId === 'operative' ? '🕶️' : '👑'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-orbitron font-extrabold text-base text-white tracking-wide">
                        {profile.username || 'APEX_OPERATIVE'}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/50 text-[10px] font-orbitron font-bold text-cyan-300">
                        Level {profile.level}
                      </span>
                    </div>
                    <p className="text-xs text-cyan-400 font-mono mt-0.5">
                      {currentRankData.title} &bull; {profile.region || 'Americas'}
                    </p>
                    <div className="mt-2 w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-800">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.floor((profile.xp / requiredXP) * 100))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-1">
                      <span>XP: {formatCompactNumber(profile.xp)} / {formatCompactNumber(requiredXP)}</span>
                      <span className="text-emerald-400">+1 XP/s (Active Play)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Key Stat Metric Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Level Display */}
                <div className="glass-panel p-3.5 rounded-xl border border-gray-800 hover:border-cyan-500/40 transition">
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <span className="font-orbitron text-[10px] uppercase">RANK LEVEL</span>
                    <Shield className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="font-orbitron font-extrabold text-lg text-cyan-300 mt-1">
                    Level {profile.level}
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5 truncate">
                    {currentRankData.title}
                  </div>
                </div>

                {/* Net Worth */}
                <div className="glass-panel p-3.5 rounded-xl border border-gray-800 hover:border-emerald-500/40 transition">
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <span className="font-orbitron text-[10px] uppercase">NET WORTH</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-orbitron font-extrabold text-lg text-emerald-400 mt-1">
                    {formatCash(computedNetWorth)}
                  </div>
                  <div className="text-[10px] text-emerald-500/80 font-mono mt-0.5">
                    Liquid + Asset Valuation
                  </div>
                </div>

                {/* Built Spires */}
                <div className="glass-panel p-3.5 rounded-xl border border-gray-800 hover:border-amber-500/40 transition">
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <span className="font-orbitron text-[10px] uppercase">BUILT SPIRES</span>
                    <Building2 className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-orbitron font-extrabold text-lg text-amber-300 mt-1">
                    {builtSpiresCount} Structures
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                    City Grid Footprint
                  </div>
                </div>

                {/* Mastery Crowns */}
                <div className="glass-panel p-3.5 rounded-xl border border-yellow-500/40 bg-gradient-to-br from-yellow-950/20 to-gray-900 hover:border-yellow-400 transition">
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <span className="font-orbitron text-[10px] uppercase text-yellow-400">MASTERY CROWNS</span>
                    <Crown className="w-4 h-4 text-yellow-400 animate-pulse" />
                  </div>
                  <div className="font-orbitron font-extrabold text-lg text-yellow-300 mt-1 flex items-center gap-1.5">
                    <span>👑 {masteryCrownsCount}</span>
                    <span className="text-xs text-yellow-400/80 font-normal">MAX LVL</span>
                  </div>
                  <div className="text-[10px] text-yellow-400/70 font-mono mt-0.5">
                    +50% Global Boost / Prop
                  </div>
                </div>
              </div>

              {/* EQUIPPED RIG: 7 SLOTS (4 PERKS, 2 ITEMS, 1 PET) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-orbitron font-bold text-xs text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    EQUIPPED RIG (7 SLOTS)
                  </h4>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onClose();
                      setActiveTab('inventory');
                    }}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>Manage</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 4x Perk Slots */}
                <div className="grid grid-cols-2 gap-2">
                  {(equipment.perks || [null, null, null, null]).map((perk, idx) => {
                    const conf = perk ? RARITY_COLORS[perk.rarity] : null;
                    return (
                      <div
                        key={`perk-${idx}`}
                        className={`p-2.5 rounded-lg border flex items-center space-x-2.5 ${
                          perk
                            ? `${conf?.border} ${conf?.bg}`
                            : 'border-dashed border-gray-800 bg-gray-900/40 text-gray-600'
                        }`}
                      >
                        <div className="text-xl">{perk ? perk.icon : '⚡'}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] font-mono text-gray-500 uppercase">
                            PERK #{idx + 1}
                          </div>
                          <div className="text-xs font-orbitron font-bold text-white truncate">
                            {perk ? perk.name : 'Empty Slot'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 2x Relic Item Slots */}
                <div className="grid grid-cols-2 gap-2">
                  {(equipment.items || [null, null]).map((item, idx) => {
                    const conf = item ? RARITY_COLORS[item.rarity] : null;
                    return (
                      <div
                        key={`item-${idx}`}
                        className={`p-2.5 rounded-lg border flex items-center space-x-2.5 ${
                          item
                            ? `${conf?.border} ${conf?.bg}`
                            : 'border-dashed border-gray-800 bg-gray-900/40 text-gray-600'
                        }`}
                      >
                        <div className="text-xl">{item ? item.icon : '🔮'}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] font-mono text-gray-500 uppercase">
                            RELIC #{idx + 1}
                          </div>
                          <div className="text-xs font-orbitron font-bold text-white truncate">
                            {item ? item.name : 'Empty Slot'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 1x Active Pet Slot */}
                {(() => {
                  const pet = equipment.pet;
                  const conf = pet ? RARITY_COLORS[pet.rarity] : null;
                  return (
                    <div
                      className={`p-3 rounded-xl border flex items-center space-x-3.5 ${
                        pet
                          ? `${conf?.border} ${conf?.bg} shadow-[0_0_15px_rgba(217,70,239,0.2)]`
                          : 'border-dashed border-gray-800 bg-gray-900/40 text-gray-600'
                      }`}
                    >
                      <div className="text-3xl animate-pulse">{pet ? pet.icon : '🐾'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-orbitron uppercase text-fuchsia-400 font-bold">
                            ACTIVE PET COMPANION
                          </span>
                          {pet && (
                            <span className={`text-[8px] font-mono uppercase px-1.5 py-0.2 rounded border ${conf?.border} ${conf?.text} font-bold`}>
                              {pet.rarity}
                            </span>
                          )}
                        </div>
                        <div className="font-orbitron font-extrabold text-sm text-white truncate mt-0.5">
                          {pet ? pet.name : 'No Companion Active'}
                        </div>
                        <p className="text-[11px] font-mono text-gray-400 truncate mt-0.5">
                          {pet ? pet.description : 'Equip Dog, Shiba Inu, Shadow Wolf, Fire Phoenix, or Titanic Golden Dragon'}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Bottom Quick Action */}
              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                  setActiveTab('inventory');
                }}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-orbitron font-bold text-xs uppercase tracking-wider transition shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                OPEN FULL INVENTORY &amp; VAULT
              </button>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: GLOBAL LEADERBOARD RANKING                     */}
          {/* ==================================================== */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-4">
              
              {/* Region Filters */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-orbitron text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  GLOBAL FINANCIAL STANDINGS
                </span>
                <div className="flex gap-1">
                  {['ALL', 'Americas', 'Eurozone', 'Asia-Pacific'].map(reg => (
                    <button
                      key={reg}
                      onClick={() => setSelectedRegion(reg)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                        selectedRegion === reg
                          ? 'bg-amber-400 text-black font-bold'
                          : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
                      }`}
                    >
                      {reg === 'Asia-Pacific' ? 'APAC' : reg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Player Current Rank Highlight Banner */}
              <div className="glass-panel p-3.5 rounded-xl border border-cyan-400/50 bg-gradient-to-r from-cyan-950/40 via-gray-900 to-gray-950 flex items-center justify-between shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <div className="flex items-center space-x-3">
                  <div className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 font-orbitron font-extrabold text-xs border border-cyan-400/40">
                    YOU
                  </div>
                  <div>
                    <div className="font-orbitron font-bold text-xs text-white">
                      {profile.username || 'APEX_OPERATIVE'}
                    </div>
                    <div className="text-[10px] font-mono text-cyan-400">
                      Level {profile.level} &bull; {currentRankData.title}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-orbitron font-bold text-sm text-emerald-400">
                    {formatCash(computedNetWorth)}
                  </div>
                  <div className="text-[10px] font-mono text-gray-400">
                    👑 {masteryCrownsCount} Crowns
                  </div>
                </div>
              </div>

              {/* Leaderboard Table List */}
              <div className="space-y-2">
                {filteredLeaderboard.map((entry, index) => {
                  const isTop3 = index < 3;
                  const rankBadgeColor =
                    index === 0
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                      : index === 1
                      ? 'bg-slate-300/20 text-slate-200 border-slate-300/50'
                      : index === 2
                      ? 'bg-amber-700/20 text-amber-400 border-amber-700/50'
                      : 'bg-gray-900 text-gray-400 border-gray-800';

                  return (
                    <div
                      key={entry.id || index}
                      className={`p-3 rounded-xl border flex items-center justify-between transition ${
                        isTop3
                          ? 'border-amber-500/30 bg-gray-900/60'
                          : 'border-gray-800/80 bg-gray-950/50 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-orbitron font-bold text-xs border ${rankBadgeColor}`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-orbitron font-bold text-xs text-white">
                              {entry.name}
                            </span>
                            {entry.syndicateTag && (
                              <span className="px-1 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-[9px] font-mono text-cyan-300">
                                [{entry.syndicateTag}]
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-gray-400">
                            Level {entry.level || 50} &bull; {entry.region}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-orbitron font-bold text-xs text-emerald-400">
                          {formatCash(entry.netWorth)}
                        </div>
                        <div className="text-[9px] font-mono text-gray-500">
                          +{formatCash(entry.businessIncomePerHour || 0)}/hr
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
