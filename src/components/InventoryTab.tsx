import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';
import { InventoryItem, ItemRarity, ItemType } from '../types';
import {
  Shield,
  Zap,
  Sparkles,
  Percent,
  TrendingUp,
  Package,
  Layers,
  ChevronRight,
  Filter,
  ArrowUpRight,
  Info
} from 'lucide-react';

const RARITY_COLORS: Record<ItemRarity, { border: string; text: string; bg: string; glow: string }> = {
  common: {
    border: 'border-slate-600',
    text: 'text-slate-300',
    bg: 'bg-slate-900/60',
    glow: 'shadow-none'
  },
  uncommon: {
    border: 'border-emerald-500',
    text: 'text-emerald-300',
    bg: 'bg-emerald-950/40',
    glow: 'shadow-[0_0_10px_rgba(16,185,129,0.2)]'
  },
  rare: {
    border: 'border-cyan-500',
    text: 'text-cyan-300',
    bg: 'bg-cyan-950/40',
    glow: 'shadow-[0_0_12px_rgba(6,182,212,0.25)]'
  },
  epic: {
    border: 'border-fuchsia-500',
    text: 'text-fuchsia-300',
    bg: 'bg-fuchsia-950/40',
    glow: 'shadow-[0_0_15px_rgba(217,70,239,0.3)]'
  },
  legendary: {
    border: 'border-amber-400',
    text: 'text-amber-300',
    bg: 'bg-amber-950/40',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.35)]'
  },
  mythic: {
    border: 'border-rose-500',
    text: 'text-rose-300',
    bg: 'bg-rose-950/40',
    glow: 'shadow-[0_0_25px_rgba(244,63,94,0.4)]'
  },
  exotic: {
    border: 'border-indigo-400',
    text: 'text-indigo-200',
    bg: 'bg-gradient-to-br from-purple-950/60 via-indigo-950/60 to-cyan-950/60',
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.5)]'
  }
};

export const InventoryTab: React.FC = () => {
  const {
    inventory,
    equipment,
    equippedStats,
    equipItem,
    unequipItem,
    useConsumable,
    setActiveTab,
    timedCrateReady,
    timedCrateCountdown,
    claimTimedCrate
  } = useGame();

  const [typeFilter, setTypeFilter] = useState<'all' | ItemType>('all');
  const [rarityFilter, setRarityFilter] = useState<'all' | ItemRarity>('all');
  const [inspectItem, setInspectItem] = useState<InventoryItem | null>(null);

  // Filtered storage items
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (rarityFilter !== 'all' && item.rarity !== rarityFilter) return false;
      return true;
    });
  }, [inventory, typeFilter, rarityFilter]);

  const renderItemStats = (item: InventoryItem) => {
    const stats = item.stats;
    const badges: { label: string; value: string; color: string }[] = [];

    if (stats.incomeMultiplierBonus) {
      badges.push({
        label: 'INCOME',
        value: `+${Math.round(stats.incomeMultiplierBonus * 100)}%`,
        color: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30'
      });
    }
    if (stats.xpBonus) {
      badges.push({
        label: 'EXP',
        value: `+${Math.round(stats.xpBonus * 100)}%`,
        color: 'text-cyan-400 bg-cyan-950/50 border-cyan-500/30'
      });
    }
    if (stats.luckBonus) {
      badges.push({
        label: 'LUCK',
        value: `+${Math.round(stats.luckBonus * 100)}%`,
        color: 'text-fuchsia-400 bg-fuchsia-950/50 border-fuchsia-500/30'
      });
    }
    if (stats.costDiscount) {
      badges.push({
        label: 'DISCOUNT',
        value: `-${Math.round(stats.costDiscount * 100)}%`,
        color: 'text-amber-400 bg-amber-950/50 border-amber-500/30'
      });
    }

    return (
      <div className="flex flex-wrap gap-1.5 mt-1">
        {badges.map((b, i) => (
          <span
            key={i}
            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${b.color} font-bold`}
          >
            {b.label} {b.value}
          </span>
        ))}
      </div>
    );
  };

  return (
    <section id="tab-inventory" className="w-full h-full p-4 sm:p-6 overflow-y-auto max-w-5xl mx-auto select-none">
      {/* HEADER TITLE & STAT MULTIPLIERS OVERVIEW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎒</span>
            <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-white tracking-wide">
              OPERATIVE INVENTORY &amp; RIG
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Equip 4x Perks, 2x Items, and 1x Cyber-Pet to amplify syndicate output.
          </p>
        </div>

        {/* Timed Silent Crate Banner or Marketplace Shortcut */}
        <div className="flex items-center gap-2">
          {timedCrateReady ? (
            <button
              id="btn-claim-timed-crate"
              onClick={() => claimTimedCrate()}
              className="px-3.5 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-orbitron font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(217,70,239,0.5)] animate-bounce"
            >
              <span>📦</span>
              <span>CLAIM FREE CRATE!</span>
            </button>
          ) : (
            <div className="px-3 py-1.5 rounded-lg border border-gray-800 bg-gray-900/60 text-[11px] font-mono text-gray-400 flex items-center gap-1.5">
              <span>📦 Free Crate in:</span>
              <span className="text-cyan-400 font-bold">{timedCrateCountdown}s</span>
            </div>
          )}

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('market');
            }}
            className="px-3 py-2 rounded-lg border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 font-orbitron text-xs font-bold transition flex items-center gap-1"
          >
            <span>DECRYPTION DEPOT</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ACTIVE GEAR STAT MULTIPLIERS BANNER */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="glass-panel p-3 rounded-xl border border-emerald-500/30 text-center">
          <div className="text-[10px] font-orbitron text-gray-400 tracking-wider">REVENUE MULTIPLIER</div>
          <div className="text-lg font-orbitron font-bold text-emerald-400 mt-1">
            +{Math.round(equippedStats.totalIncomeBonus * 100)}%
          </div>
          <div className="text-[10px] font-mono text-gray-500">Commercial &amp; Base</div>
        </div>

        <div className="glass-panel p-3 rounded-xl border border-cyan-500/30 text-center">
          <div className="text-[10px] font-orbitron text-gray-400 tracking-wider">EXP MULTIPLIER</div>
          <div className="text-lg font-orbitron font-bold text-cyan-400 mt-1">
            +{Math.round(equippedStats.totalXpBonus * 100)}%
          </div>
          <div className="text-[10px] font-mono text-gray-500">Jobs &amp; Active Time</div>
        </div>

        <div className="glass-panel p-3 rounded-xl border border-fuchsia-500/30 text-center">
          <div className="text-[10px] font-orbitron text-gray-400 tracking-wider">LUCK ATTUNEMENT</div>
          <div className="text-lg font-orbitron font-bold text-fuchsia-400 mt-1">
            +{Math.round(equippedStats.totalLuckBonus * 100)}%
          </div>
          <div className="text-[10px] font-mono text-gray-500">Crate Drops &amp; Gambling</div>
        </div>

        <div className="glass-panel p-3 rounded-xl border border-amber-500/30 text-center">
          <div className="text-[10px] font-orbitron text-gray-400 tracking-wider">UPGRADE DISCOUNT</div>
          <div className="text-lg font-orbitron font-bold text-amber-400 mt-1">
            -{Math.round(equippedStats.totalCostDiscount * 100)}%
          </div>
          <div className="text-[10px] font-mono text-gray-500">Blueprints &amp; Spire Levels</div>
        </div>
      </div>

      {/* 7 ACTIVE EQUIPMENT RIG SLOTS */}
      <div className="mb-8">
        <h3 className="text-xs font-orbitron font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          ACTIVE RIG SLOTS (7 SLOTS LOADED)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {/* 4x PERK SLOTS (Slots 1-4) */}
          {(equipment.perks || [null, null, null, null]).map((perk, idx) => {
            const conf = perk ? RARITY_COLORS[perk.rarity] : null;
            return (
              <div
                key={`perk-${idx}`}
                className={`p-3 rounded-xl border flex flex-col justify-between min-h-[140px] md:col-span-1 transition ${
                  perk
                    ? `${conf?.border} ${conf?.bg} ${conf?.glow}`
                    : 'border-dashed border-gray-800 bg-gray-950/40 text-gray-600'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-orbitron uppercase text-gray-400">
                      PERK {idx + 1}
                    </span>
                    {perk && (
                      <span className={`text-[8px] font-mono uppercase font-bold px-1 rounded border ${conf?.border} ${conf?.text}`}>
                        {perk.rarity}
                      </span>
                    )}
                  </div>
                  {perk ? (
                    <div>
                      <div className="text-2xl my-1">{perk.icon}</div>
                      <div className="font-orbitron font-bold text-xs text-white truncate" title={perk.name}>
                        {perk.name}
                      </div>
                      {renderItemStats(perk)}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center py-4 text-gray-600">
                      <span className="text-xl opacity-30">⚡</span>
                      <span className="text-[10px] font-mono mt-1">EMPTY PERK</span>
                    </div>
                  )}
                </div>

                {perk && (
                  <button
                    onClick={() => unequipItem('perk', idx)}
                    className="w-full mt-2 py-1 text-[10px] font-mono font-bold text-gray-400 hover:text-rose-300 hover:bg-rose-950/50 border border-gray-800 rounded transition"
                  >
                    UNEQUIP
                  </button>
                )}
              </div>
            );
          })}

          {/* 2x RELIC ITEM SLOTS (Slots 5-6) */}
          {(equipment.items || [null, null]).map((item, idx) => {
            const conf = item ? RARITY_COLORS[item.rarity] : null;
            return (
              <div
                key={`item-${idx}`}
                className={`p-3 rounded-xl border flex flex-col justify-between min-h-[140px] md:col-span-1 transition ${
                  item
                    ? `${conf?.border} ${conf?.bg} ${conf?.glow}`
                    : 'border-dashed border-gray-800 bg-gray-950/40 text-gray-600'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-orbitron uppercase text-gray-400">
                      ITEM {idx + 1}
                    </span>
                    {item && (
                      <span className={`text-[8px] font-mono uppercase font-bold px-1 rounded border ${conf?.border} ${conf?.text}`}>
                        {item.rarity}
                      </span>
                    )}
                  </div>
                  {item ? (
                    <div>
                      <div className="text-2xl my-1">{item.icon}</div>
                      <div className="font-orbitron font-bold text-xs text-white truncate" title={item.name}>
                        {item.name}
                      </div>
                      {renderItemStats(item)}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center py-4 text-gray-600">
                      <span className="text-xl opacity-30">🔮</span>
                      <span className="text-[10px] font-mono mt-1">EMPTY RELIC</span>
                    </div>
                  )}
                </div>

                {item && (
                  <button
                    onClick={() => unequipItem('item', idx)}
                    className="w-full mt-2 py-1 text-[10px] font-mono font-bold text-gray-400 hover:text-rose-300 hover:bg-rose-950/50 border border-gray-800 rounded transition"
                  >
                    UNEQUIP
                  </button>
                )}
              </div>
            );
          })}

          {/* 1x CYBER-PET COMPANION SLOT (Slot 7) */}
          {(() => {
            const pet = equipment.pet;
            const conf = pet ? RARITY_COLORS[pet.rarity] : null;
            return (
              <div
                className={`p-3 rounded-xl border flex flex-col justify-between min-h-[140px] md:col-span-1 transition ${
                  pet
                    ? `${conf?.border} ${conf?.bg} ${conf?.glow}`
                    : 'border-dashed border-gray-800 bg-gray-950/40 text-gray-600'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-orbitron uppercase text-fuchsia-400">
                      🐾 CYBER-PET
                    </span>
                    {pet && (
                      <span className={`text-[8px] font-mono uppercase font-bold px-1 rounded border ${conf?.border} ${conf?.text}`}>
                        {pet.rarity}
                      </span>
                    )}
                  </div>
                  {pet ? (
                    <div>
                      <div className="text-2xl my-1 animate-pulse">{pet.icon}</div>
                      <div className="font-orbitron font-bold text-xs text-white truncate" title={pet.name}>
                        {pet.name}
                      </div>
                      {renderItemStats(pet)}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center py-4 text-gray-600">
                      <span className="text-xl opacity-30">🐾</span>
                      <span className="text-[10px] font-mono mt-1 text-center">NO PET EQUIPPED</span>
                    </div>
                  )}
                </div>

                {pet && (
                  <button
                    onClick={() => unequipItem('pet')}
                    className="w-full mt-2 py-1 text-[10px] font-mono font-bold text-gray-400 hover:text-rose-300 hover:bg-rose-950/50 border border-gray-800 rounded transition"
                  >
                    UNEQUIP
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* STORAGE VAULT GRID */}
      <div>
        {/* FILTERS TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-orbitron font-bold text-gray-200 uppercase tracking-wider">
              STORAGE VAULT ({inventory.length} ITEMS)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Type filter */}
            <div className="flex rounded-lg border border-gray-800 bg-gray-900/60 p-0.5">
              {(['all', 'perk', 'item', 'pet'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 rounded text-[10px] font-orbitron font-bold uppercase transition ${
                    typeFilter === t
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t === 'all' ? 'ALL TYPES' : `${t}S`}
                </button>
              ))}
            </div>

            {/* Rarity filter */}
            <div className="flex rounded-lg border border-gray-800 bg-gray-900/60 p-0.5">
              {(['all', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'exotic'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRarityFilter(r)}
                  className={`px-2 py-1 rounded text-[9px] font-mono uppercase transition ${
                    rarityFilter === r
                      ? 'bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-500/40 font-bold'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ITEMS GRID */}
        {filteredInventory.length === 0 ? (
          <div className="glass-panel p-10 rounded-xl border border-gray-800 text-center">
            <span className="text-3xl block mb-2 opacity-40">📦</span>
            <h4 className="font-orbitron text-sm font-bold text-gray-300">NO ITEMS FOUND IN VAULT</h4>
            <p className="text-xs text-gray-500 font-mono mt-1 max-w-sm mx-auto">
              Decrypt crates in the Decryption Depot or claim timed crates to acquire Cyber-Pets, Perks, and Relics.
            </p>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('market');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron text-xs font-bold transition shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              VISIT DECRYPTION DEPOT
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredInventory.map((item) => {
              const conf = RARITY_COLORS[item.rarity];
              return (
                <div
                  key={item.instanceId}
                  className={`p-3.5 rounded-xl border transition-all hover:scale-[1.02] flex flex-col justify-between ${conf.border} ${conf.bg} ${conf.glow}`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-3xl">{item.icon}</span>
                      <div className="text-right">
                        <span className={`text-[9px] font-orbitron font-bold uppercase px-1.5 py-0.5 rounded border ${conf.border} ${conf.text}`}>
                          {item.rarity}
                        </span>
                        <div className="text-[9px] font-mono text-gray-400 uppercase mt-1">
                          {item.type}
                        </div>
                      </div>
                    </div>

                    <h4 className="font-orbitron font-bold text-xs text-white mt-2 truncate" title={item.name}>
                      {item.name}
                    </h4>

                    <p className="text-[11px] text-gray-400 line-clamp-2 my-1">
                      {item.description}
                    </p>

                    {renderItemStats(item)}
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-800/80">
                    {item.type === 'consumable' ? (
                      <button
                        onClick={() => useConsumable(item.instanceId)}
                        className="w-full py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-orbitron text-xs font-bold transition shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                      >
                        CONSUME NOW
                      </button>
                    ) : (
                      <button
                        onClick={() => equipItem(item.instanceId, item.type as 'perk' | 'item' | 'pet')}
                        className="w-full py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-orbitron text-xs font-bold transition shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                      >
                        EQUIP TO RIG
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
