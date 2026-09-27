import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { REAL_ESTATE_CATALOG, BUSINESS_CATALOG } from '../data/initialData';
import { CHEST_TIERS } from '../data/itemsCatalog';
import { BusinessTier, InventoryItem } from '../types';
import { sounds } from '../utils/sound';
import { formatCash, formatCompactNumber, formatPerSec } from '../utils/format';
import confetti from 'canvas-confetti';
import {
  Building2,
  Home,
  DollarSign,
  Search,
  CheckCircle2,
  Coins,
  ArrowUpCircle,
  Sparkles,
  Package,
  Shield,
  Layers,
  X,
  ArrowRight
} from 'lucide-react';

export const MarketplaceTab: React.FC = () => {
  const {
    profile,
    buyProperty,
    setPrimaryProperty,
    buyBusiness,
    upgradeBusiness,
    upgradeAllBusinesses,
    collectBusinessRevenue,
    collectAllBusinesses,
    exchangeGemsForCredits,
    buyExpBoost,
    buyIncBoost,
    addGems,
    addToast,
    openCrate,
    equipItem,
    useConsumable,
    setActiveTab
  } = useGame();

  const [activeSubtab, setActiveSubtab] = useState<'biz' | 'housing' | 'boosts' | 'gems' | 'chests'>('biz');
  const [bizSearch, setBizSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'ALL' | BusinessTier>('ALL');
  const [multiplier, setMultiplier] = useState<'x1' | 'x10' | 'x25' | 'MAX'>('x1');
  const [unboxedReward, setUnboxedReward] = useState<InventoryItem | null>(null);
  const [isOpeningCrate, setIsOpeningCrate] = useState<boolean>(false);

  const expMult = profile.expMultiplier || 1.0;
  const incMult = profile.incMultiplier || 1.0;
  const expLevel = Math.min(15, Math.max(1, Math.round(((expMult - 1.0) / 0.1) + 1)));
  const incLevel = Math.min(20, Math.max(1, Math.round(((incMult - 1.0) / 0.1) + 1)));
  const expPercent = Math.round(expMult * 100);
  const incPercent = Math.round(incMult * 100);
  const expProgress = Math.min(100, Math.max(6.66, (expLevel / 15) * 100));
  const incProgress = Math.min(100, Math.max(5, (incLevel / 20) * 100));

  // Filtered businesses
  const filteredBusinesses = useMemo(() => {
    return BUSINESS_CATALOG.filter(biz => {
      if (tierFilter !== 'ALL' && biz.tier !== tierFilter) return false;
      if (bizSearch) {
        const query = bizSearch.toLowerCase();
        return (
          biz.name.toLowerCase().includes(query) ||
          biz.tier.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [bizSearch, tierFilter]);

  // Handle buying gems / vault crates
  const handleClaimVaultCrate = (gemCost: number, creditReward: number) => {
    exchangeGemsForCredits(gemCost, creditReward);
  };

  const handleClaimFreeGems = (amount: number, packName: string) => {
    addGems(amount, packName);
  };

  return (
    <section id="tab-market" className="w-full h-full p-4 sm:p-6 overflow-y-auto max-w-6xl mx-auto select-none">
      {/* Subtab Navigation */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 border-b border-gray-800 pb-3 mb-6">
        <button
          id="subtab-biz-btn"
          onClick={() => {
            sounds.playClick();
            setActiveSubtab('biz');
          }}
          className={`px-4 py-2 font-orbitron font-bold text-xs sm:text-sm transition-all border-b-2 ${
            activeSubtab === 'biz'
              ? 'text-cyan-400 border-cyan-400'
              : 'text-gray-400 border-transparent hover:text-cyan-400'
          }`}
        >
          BUSINESSES (50+)
        </button>
        <button
          id="subtab-housing-btn"
          onClick={() => {
            sounds.playClick();
            setActiveSubtab('housing');
          }}
          className={`px-4 py-2 font-orbitron font-bold text-xs sm:text-sm transition-all border-b-2 ${
            activeSubtab === 'housing'
              ? 'text-cyan-400 border-cyan-400'
              : 'text-gray-400 border-transparent hover:text-cyan-400'
          }`}
        >
          MANSIONS & REAL ESTATE
        </button>
        <button
          id="subtab-boosts-btn"
          onClick={() => {
            sounds.playClick();
            setActiveSubtab('boosts');
          }}
          className={`px-4 py-2 font-orbitron font-bold text-xs sm:text-sm transition-all border-b-2 ${
            activeSubtab === 'boosts'
              ? 'text-fuchsia-400 border-fuchsia-400'
              : 'text-gray-400 border-transparent hover:text-fuchsia-400'
          }`}
        >
          GEM BOOST LAB (UPGRADES)
        </button>
        <button
          id="subtab-vault-btn"
          onClick={() => {
            sounds.playClick();
            setActiveSubtab('gems');
          }}
          className={`px-4 py-2 font-orbitron font-bold text-xs sm:text-sm transition-all border-b-2 ${
            activeSubtab === 'gems'
              ? 'text-emerald-400 border-emerald-400'
              : 'text-gray-400 border-transparent hover:text-emerald-400'
          }`}
        >
          NEXUS VAULT ($USD)
        </button>
        <button
          id="subtab-chests-btn"
          onClick={() => {
            sounds.playClick();
            setActiveSubtab('chests');
          }}
          className={`px-4 py-2 font-orbitron font-bold text-xs sm:text-sm transition-all border-b-2 flex items-center gap-1.5 ${
            activeSubtab === 'chests'
              ? 'text-amber-400 border-amber-400'
              : 'text-gray-400 border-transparent hover:text-amber-400'
          }`}
        >
          <span>📦</span>
          <span>DECRYPTION DEPOT</span>
        </button>
      </div>

      {/* Subtab: Businesses */}
      {activeSubtab === 'biz' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-3 rounded-lg border border-cyan-500/20">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search businesses, syndicates, categories..."
                value={bizSearch}
                onChange={e => setBizSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-950 border border-gray-800 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Tier Filters */}
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-orbitron">
              {(['ALL', 'STREET', 'RETAIL', 'COMMERCIAL', 'ENTERTAINMENT', 'CORPORATE', 'SYNDICATE_APEX'] as const).map(tier => (
                <button
                  key={tier}
                  onClick={() => {
                    sounds.playClick();
                    setTierFilter(tier as any);
                  }}
                  className={`px-2.5 py-1 rounded transition ${
                    tierFilter === tier
                      ? 'bg-cyan-600 text-black font-bold'
                      : 'glass-panel text-gray-400 hover:text-white'
                  }`}
                >
                  {tier === 'SYNDICATE_APEX' ? 'APEX' : tier}
                </button>
              ))}
            </div>

            {/* Bulk Multiplier Toggle [x1] | [x10] | [x25] | [MAX] */}
            <div className="flex items-center gap-1 bg-gray-950/80 p-1 rounded-lg border border-cyan-500/30 text-xs font-orbitron">
              <span className="text-[10px] text-gray-400 px-1 font-mono uppercase">BUY:</span>
              {(['x1', 'x10', 'x25', 'MAX'] as const).map(m => (
                <button
                  key={m}
                  id={`btn-multiplier-${m}`}
                  onClick={() => {
                    sounds.playClick();
                    setMultiplier(m);
                  }}
                  className={`px-2.5 py-1 rounded font-bold transition-all text-xs ${
                    multiplier === m
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Action Buttons: UPGRADE ALL & HARVEST ALL */}
            <div className="flex items-center gap-2">
              <button
                id="btn-upgrade-all"
                onClick={() => {
                  sounds.playCash();
                  upgradeAllBusinesses();
                }}
                className="px-3.5 py-1.5 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-500 text-black font-orbitron font-extrabold text-xs rounded tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.35)] transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                UPGRADE ALL
              </button>

              <button
                onClick={() => {
                  sounds.playCash();
                  collectAllBusinesses();
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-orbitron font-bold text-xs rounded tracking-wider flex items-center gap-1.5 transition"
              >
                <Coins className="w-3.5 h-3.5" />
                HARVEST ALL
              </button>
            </div>
          </div>

          {/* Catalog List Container */}
          <div id="market-catalog-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBusinesses.map(biz => {
              const record = profile.ownedBusinesses[biz.id];
              const isOwned = Boolean(record && record.level > 0);
              const level = record?.level || 0;
              const cost = biz.cost || biz.buyPrice || 10;
              const hourly = biz.hourlyIncome || biz.hourlyYield || 0;
              const canAffordBuy = profile.cash >= cost;
              const uncollected = record?.unclaimedRevenue || 0;
              const isMastery = level >= 100;
              const isMax = level >= 100;
              const currentYield = isOwned
                ? Math.floor(hourly * Math.pow(1.12, Math.min(100, level) - 1) * (isMastery ? 1.5 : 1.0))
                : hourly;
              const perSecondYield = currentYield / 3600;

              // Bulk Multiplier calculation per card (1.22x exponential scaling)
              const remainingToMax = Math.max(0, 100 - level);
              const targetLevelStep = (() => {
                if (isMax || remainingToMax === 0) return 0;
                if (multiplier === 'x1') return 1;
                if (multiplier === 'x10') return Math.min(10, remainingToMax);
                if (multiplier === 'x25') return Math.min(25, remainingToMax);
                // MAX: afford as many as possible with available cash
                let affordable = 0;
                let runningCost = 0;
                for (let i = 0; i < remainingToMax; i++) {
                  const step = Math.round(cost * Math.pow(1.22, level + i));
                  if (profile.cash < runningCost + step) break;
                  runningCost += step;
                  affordable++;
                }
                return Math.max(1, affordable);
              })();

              let bulkUpgradeCost = 0;
              for (let i = 0; i < targetLevelStep; i++) {
                bulkUpgradeCost += Math.round(cost * Math.pow(1.22, level + i));
              }
              const canAffordUpgrade = profile.cash >= bulkUpgradeCost;
              const minLvl = biz.minPlayerLevel || 1;

              return (
                <div
                  key={biz.id}
                  className={`glass-panel p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isMastery
                      ? 'border-yellow-500/60 bg-gradient-to-br from-yellow-950/20 via-gray-950 to-gray-950 shadow-[0_0_20px_rgba(251,191,36,0.25)]'
                      : isOwned
                      ? 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'border-cyan-500/30 hover:border-cyan-400'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isMastery
                            ? 'bg-yellow-950 border border-yellow-400 text-yellow-300'
                            : 'bg-cyan-950 border border-cyan-500/40 text-cyan-400'
                        }`}>
                          {isMastery ? <span className="text-base">👑</span> : <Building2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="font-orbitron font-bold text-sm text-white line-clamp-1">
                            {biz.name}
                          </h4>
                          <div className="text-[10px] font-mono text-cyan-400 uppercase">
                            {biz.tier} &bull; LEVEL {minLvl}+
                          </div>
                        </div>
                      </div>
                      {isOwned && (
                        <span className={`px-2 py-0.5 font-orbitron font-bold text-[10px] rounded border flex items-center gap-1 ${
                          isMastery
                            ? 'bg-yellow-950/80 border-yellow-400 text-yellow-300'
                            : 'bg-emerald-950 border-emerald-500 text-emerald-400'
                        }`}>
                          {isMastery ? '👑 Level 100' : `Level ${level}/100`}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="glass-panel p-2.5 rounded-lg border border-gray-800 space-y-1 text-xs mb-3 font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cashflow Yield:</span>
                        <span className={`font-bold font-orbitron ${isMastery ? 'text-yellow-400' : 'text-emerald-400'}`}>
                          +{formatCash(currentYield)}/hr ({formatPerSec(perSecondYield)})
                        </span>
                      </div>
                      {isMastery && (
                        <div className="text-[10px] text-yellow-400 font-mono font-bold flex items-center gap-1">
                          <span>👑 MASTERY CROWN: +50% Global Revenue Boost</span>
                        </div>
                      )}
                      {isOwned && uncollected > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Pending Yield:</span>
                          <span className="text-yellow-400 font-bold font-orbitron">
                            {formatCash(uncollected)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2 border-t border-gray-800">
                    {!isOwned ? (
                      <button
                        onClick={() => {
                          sounds.playCash();
                          buyBusiness(biz.id);
                        }}
                        disabled={!canAffordBuy || profile.level < minLvl}
                        className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:pointer-events-none text-black font-orbitron font-bold text-xs rounded tracking-wider flex items-center justify-center gap-1.5 transition"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        {profile.level < minLvl
                          ? `REQUIRES LEVEL ${minLvl}`
                          : `ACQUIRE (${formatCash(cost)})`}
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {uncollected > 0 ? (
                          <button
                            onClick={() => {
                              sounds.playCash();
                              collectBusinessRevenue(biz.id);
                            }}
                            className="py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-orbitron font-bold text-[11px] rounded tracking-wider flex items-center justify-center gap-1 transition"
                          >
                            <Coins className="w-3 h-3" />
                            COLLECT ({formatCash(uncollected)})
                          </button>
                        ) : (
                          <div className="py-1.5 bg-gray-900 border border-gray-800 text-gray-500 font-orbitron font-bold text-[11px] rounded text-center flex items-center justify-center">
                            GENERATING...
                          </div>
                        )}

                        <button
                          onClick={() => {
                            sounds.playCash();
                            upgradeBusiness(biz.id, targetLevelStep);
                          }}
                          disabled={!canAffordUpgrade || isMax}
                          className={`py-1.5 border font-orbitron font-bold text-[11px] rounded tracking-wider flex items-center justify-center gap-1 transition ${
                            isMax
                              ? 'bg-yellow-950/60 border-yellow-500/60 text-yellow-300 cursor-default'
                              : 'bg-cyan-600/30 hover:bg-cyan-600/50 border-cyan-500/50 disabled:opacity-40 disabled:pointer-events-none text-cyan-300'
                          }`}
                        >
                          <ArrowUpCircle className="w-3 h-3" />
                          {isMax
                            ? '👑 MAX 100'
                            : multiplier === 'x1'
                            ? `LVL ${level + 1} (${formatCash(bulkUpgradeCost)})`
                            : `+${targetLevelStep} LVLS (${formatCash(bulkUpgradeCost)})`}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab: Mansions & Homes */}
      {activeSubtab === 'housing' && (
        <div id="market-catalog-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REAL_ESTATE_CATALOG.map(prop => {
            const isOwned = profile.ownedProperties.includes(prop.id);
            const isPrimary = profile.primaryPropertyId === prop.id;
            const canAfford = profile.cash >= prop.price;

            return (
              <div
                key={prop.id}
                className={`glass-panel p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isPrimary
                    ? 'border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.2)]'
                    : isOwned
                    ? 'border-emerald-500/40'
                    : 'border-cyan-500/30 hover:border-cyan-400'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-lg bg-fuchsia-950/80 border border-fuchsia-500/40 flex items-center justify-center text-fuchsia-400 shrink-0">
                        <Home className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-orbitron font-bold text-sm text-white line-clamp-1">
                          {prop.name}
                        </h4>
                        <div className="text-[10px] font-mono text-fuchsia-400 uppercase">
                          {prop.district} &bull; {prop.category}
                        </div>
                      </div>
                    </div>
                    {isPrimary && (
                      <span className="px-2 py-0.5 bg-fuchsia-950 border border-fuchsia-500 text-fuchsia-400 font-orbitron font-bold text-[10px] rounded">
                        PRIMARY
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mb-3 font-mono line-clamp-2">
                    {prop.description}
                  </p>

                  <div className="glass-panel p-2.5 rounded-lg border border-gray-800 space-y-1 text-xs mb-3 font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Prestige Bonus:</span>
                      <span className="text-fuchsia-400 font-bold font-orbitron">
                        +{prop.prestige} Clout
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Hourly Tax:</span>
                      <span className="text-red-400 font-bold font-mono">
                        -${prop.luxuryTaxPerHour}/hr
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-800">
                  {!isOwned ? (
                    <button
                      onClick={() => {
                        sounds.playCash();
                        buyProperty(prop.id);
                      }}
                      disabled={!canAfford}
                      className="w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-40 disabled:pointer-events-none text-white font-orbitron font-bold text-xs rounded tracking-wider flex items-center justify-center gap-1.5 transition"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      PURCHASE DEED ({formatCash(prop.price)})
                    </button>
                  ) : !isPrimary ? (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setPrimaryProperty(prop.id);
                      }}
                      className="w-full py-2 bg-fuchsia-600/30 hover:bg-fuchsia-600/50 border border-fuchsia-500/50 text-fuchsia-300 font-orbitron font-bold text-xs rounded tracking-wider flex items-center justify-center gap-1.5 transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      SET AS PRIMARY HQ
                    </button>
                  ) : (
                    <div className="w-full py-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-orbitron font-bold text-xs rounded text-center">
                      CURRENT RESIDENCE
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subtab: Gem Boost Lab (Upgrades) */}
      {activeSubtab === 'boosts' && (
        <div id="subtab-boosts-content" className="space-y-6">
          <div className="glass-panel p-5 rounded-xl border border-fuchsia-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-orbitron text-lg font-bold text-fuchsia-400 flex items-center gap-2">
                💎 GEM BOOST LAB &amp; OVERCLOCKS
              </h3>
              <p className="text-xs text-gray-300 font-mono mt-1 max-w-xl">
                Synthesize Apex Gems into permanent neural multipliers and global yield overclocks to supercharge your syndicate growth.
              </p>
            </div>
            <div className="glass-panel px-4 py-3 rounded-xl border border-fuchsia-500/50 text-center">
              <div className="text-[10px] text-gray-400 font-mono">AVAILABLE GEMS</div>
              <div className="font-orbitron text-xl font-bold text-fuchsia-400">
                {formatCompactNumber(profile.gems ?? 10)} 💎
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="boosts-catalog-grid">
            {/* EXP BOOST CARD */}
            <div className="glass-panel p-6 rounded-xl border border-fuchsia-500/40 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-orbitron font-bold text-base text-fuchsia-400">NEURAL EXP MULTIPLIER</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Increases all gained Experience (XP) across active time, construction, and careers.
                    </p>
                  </div>
                  <span
                    className="text-xs font-mono bg-fuchsia-950/80 text-fuchsia-300 px-2.5 py-1 rounded border border-fuchsia-500/30 shrink-0 ml-2"
                    id="exp-boost-level"
                  >
                    Level {expLevel} / 15
                  </span>
                </div>

                <div className="w-full bg-gray-900 rounded-full h-2.5 mb-4 overflow-hidden border border-gray-800">
                  <div
                    id="exp-boost-bar"
                    className="bg-fuchsia-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(217,70,239,0.6)]"
                    style={{ width: `${expProgress}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs font-mono text-gray-300 mb-6">
                  <span>
                    Status:{' '}
                    <strong id="exp-boost-status" className="text-fuchsia-400">
                      Current: {expPercent}% | Max Cap: 250%
                    </strong>
                  </span>
                </div>
              </div>

              <button
                id="btn-buy-exp-boost"
                onClick={() => buyExpBoost()}
                disabled={expMult >= 2.5 || (profile.gems ?? 0) < 10}
                className="w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-40 disabled:pointer-events-none text-white font-orbitron font-bold text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(217,70,239,0.3)] flex items-center justify-center gap-2"
              >
                <span>💎</span>
                {expMult >= 2.5 ? 'MAX LEVEL REACHED (250%)' : 'UPGRADE FOR 10 GEMS (+10% EXP)'}
              </button>
            </div>

            {/* INCOME BOOST CARD */}
            <div className="glass-panel p-6 rounded-xl border border-cyan-500/40 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-orbitron font-bold text-base text-cyan-400">GLOBAL INCOME OVERCLOCK</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Boosts passive revenue yield generated across all built business structures.
                    </p>
                  </div>
                  <span
                    className="text-xs font-mono bg-cyan-950/80 text-cyan-300 px-2.5 py-1 rounded border border-cyan-500/30 shrink-0 ml-2"
                    id="inc-boost-level"
                  >
                    Level {incLevel} / 20
                  </span>
                </div>

                <div className="w-full bg-gray-900 rounded-full h-2.5 mb-4 overflow-hidden border border-gray-800">
                  <div
                    id="inc-boost-bar"
                    className="bg-cyan-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                    style={{ width: `${incProgress}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs font-mono text-gray-300 mb-6">
                  <span>
                    Status:{' '}
                    <strong id="inc-boost-status" className="text-cyan-400">
                      Current: {incPercent}% | Max Cap: 300%
                    </strong>
                  </span>
                </div>
              </div>

              <button
                id="btn-buy-inc-boost"
                onClick={() => buyIncBoost()}
                disabled={incMult >= 3.0 || (profile.gems ?? 0) < 15}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:pointer-events-none text-white font-orbitron font-bold text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
              >
                <span>💎</span>
                {incMult >= 3.0 ? 'MAX LEVEL REACHED (300%)' : 'UPGRADE FOR 15 GEMS (+10% INCOME)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtab: Nexus Vault ($USD / Apex Gems) */}
      {activeSubtab === 'gems' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-xl border border-fuchsia-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-orbitron text-lg font-bold text-fuchsia-400 flex items-center gap-2">
                💎 NEXUS HARD CURRENCY VAULT
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-1 max-w-xl">
                Apex Gems are high-grade cryptographic tokens used for instant wire conversions, blueprint unlocks, and syndicate fast-tracks.
              </p>
            </div>
            <div className="glass-panel px-4 py-3 rounded-xl border border-fuchsia-500/50 text-center">
              <div className="text-[10px] text-gray-400 font-mono">YOUR BALANCE</div>
              <div className="font-orbitron text-xl font-bold text-fuchsia-400">
                {formatCompactNumber(profile.gems ?? 10)} GEMS
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-orbitron font-bold text-sm text-cyan-400">ACQUIRE APEX GEMS PACKS</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Initiate Pouch', gems: 50, priceUSD: '$4.99', badge: 'STARTER' },
                { name: 'Operative Cache', gems: 150, priceUSD: '$12.99', badge: 'POPULAR' },
                { name: 'Syndicate Vault', gems: 500, priceUSD: '$34.99', badge: 'BEST VALUE' },
                { name: 'Apex Sovereign', gems: 2000, priceUSD: '$99.99', badge: 'VIP' }
              ].map(pack => (
                <div key={pack.name} className="glass-panel p-4 rounded-xl border border-fuchsia-500/30 hover:border-fuchsia-400 flex flex-col justify-between transition-all">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-orbitron font-bold text-fuchsia-400">{pack.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-fuchsia-950 border border-fuchsia-500/40 text-fuchsia-300 font-mono rounded">
                        {pack.badge}
                      </span>
                    </div>
                    <div className="text-2xl font-orbitron font-bold text-white my-3 flex items-center gap-1.5">
                      <span>💎</span> +{pack.gems}
                    </div>
                  </div>
                  <button
                    onClick={() => handleClaimFreeGems(pack.gems, pack.name)}
                    className="w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-orbitron font-bold text-xs rounded tracking-wider transition"
                  >
                    SECURE ({pack.priceUSD})
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-orbitron font-bold text-sm text-emerald-400">INSTANT WIRE CONVERSION (GEMS TO CREDITS)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { gemCost: 5, credits: 50000, title: 'Black Market Wire' },
                { gemCost: 25, credits: 350000, title: 'Syndicate Off-Shore Transfer' },
                { gemCost: 100, credits: 2000000, title: 'Megacorp Liquidity Injection' }
              ].map(wire => (
                <div key={wire.title} className="glass-panel p-4 rounded-xl border border-emerald-500/30 hover:border-emerald-400 flex flex-col justify-between transition-all">
                  <div>
                    <div className="font-orbitron font-bold text-sm text-white mb-1">{wire.title}</div>
                    <div className="text-xs font-mono text-gray-400 mb-3">Instant wire to your liquid cash account</div>
                    <div className="text-xl font-orbitron font-bold text-emerald-400 my-2">
                      +{formatCash(wire.credits)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleClaimVaultCrate(wire.gemCost, wire.credits)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-orbitron font-bold text-xs rounded tracking-wider flex items-center justify-center gap-1.5 transition"
                  >
                    <span>💎 {wire.gemCost} GEMS</span> &rarr; CONVERT
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab: Chest Shop / Decryption Depot */}
      {activeSubtab === 'chests' && (
        <div className="space-y-6">
          <div className="glass-panel p-4 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-orbitron text-amber-400 uppercase tracking-widest block">
                QUANTUM LOOT NETWORK
              </span>
              <h3 className="font-orbitron text-lg font-bold text-white mt-0.5">
                BLACK-MARKET DECRYPTION COFFERS
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-1">
                Crack encrypted caches to obtain 4x Perks, 2x Items, and rare companion Cyber-Pets.
              </p>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('inventory');
              }}
              className="px-4 py-2 bg-cyan-950 border border-cyan-400/50 hover:bg-cyan-900 text-cyan-300 font-orbitron font-bold text-xs rounded-lg transition flex items-center gap-2"
            >
              <span>🎒</span>
              <span>VIEW INVENTORY ({profile.inventory?.length || 0})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CHEST_TIERS.map(chest => {
              const hasCash = !chest.costCash || profile.cash >= chest.costCash;
              const hasGems = !chest.costGems || (profile.gems ?? 10) >= chest.costGems;
              const canAfford = hasCash && hasGems;

              return (
                <div
                  key={chest.id}
                  className="glass-card p-5 rounded-xl border border-gray-800 hover:border-amber-400/50 flex flex-col justify-between transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-4xl">{chest.icon}</span>
                      <span className="text-[9px] font-orbitron font-bold px-2 py-0.5 rounded border border-amber-500/40 text-amber-300 bg-amber-950/40">
                        {chest.badge}
                      </span>
                    </div>

                    <h4 className="font-orbitron font-bold text-sm text-white mt-1">
                      {chest.name}
                    </h4>

                    <p className="text-xs text-gray-400 mt-1 min-h-[36px]">
                      {chest.description}
                    </p>

                    {/* Drop Rates Table */}
                    <div className="my-3 p-2.5 rounded-lg bg-black/40 border border-gray-800 text-[11px] font-mono">
                      <div className="text-[9px] font-orbitron text-gray-400 uppercase tracking-wider mb-1.5 flex justify-between">
                        <span>ODDS SPECTRUM</span>
                        {chest.petChance > 0 && (
                          <span className="text-fuchsia-400 font-bold">
                            🐾 {Math.round(chest.petChance * 100)}% PET CHANCE
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-400">
                        {Object.entries(chest.dropRates).map(([rarity, rate]) => (
                          <div key={rarity} className="flex justify-between capitalize">
                            <span>{rarity}:</span>
                            <span className="text-cyan-300 font-bold">{Math.round(rate * 100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-800">
                    <div className="flex justify-between items-center mb-2 font-mono text-xs">
                      <span className="text-gray-400">DECRYPT PRICE:</span>
                      <span className="font-orbitron font-bold text-emerald-400">
                        {chest.costCash && formatCash(chest.costCash)}
                        {chest.costCash && chest.costGems && ' + '}
                        {chest.costGems && `💎 ${chest.costGems} GEMS`}
                      </span>
                    </div>

                    <button
                      disabled={!canAfford || isOpeningCrate}
                      onClick={() => {
                        const item = openCrate(chest.id);
                        if (item) {
                          try { confetti(); } catch {}
                          setUnboxedReward(item);
                        }
                      }}
                      className={`w-full py-2.5 rounded-lg font-orbitron font-bold text-xs transition shadow-lg ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'DECRYPT COFFER' : 'INSUFFICIENT FUNDS'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* UNBOXED REWARD MODAL */}
      {unboxedReward && (
        <div
          id="unboxed-reward-modal"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="glass-card w-full max-w-md p-6 rounded-2xl border-2 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.35)] relative text-center">
            <button
              onClick={() => {
                sounds.playClick();
                setUnboxedReward(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-orbitron text-amber-400 uppercase tracking-widest block mb-1">
              🎉 COFFER DECRYPTED!
            </span>
            <h3 className="font-orbitron text-xl font-black text-white">
              NEW REQUISITION ACQUIRED
            </h3>

            <div className="my-6">
              <div className="text-6xl my-3 animate-bounce">
                {unboxedReward.icon}
              </div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-orbitron font-bold uppercase tracking-wider mb-2 border border-amber-400/60 bg-amber-950/60 text-amber-300">
                {unboxedReward.rarity} • {unboxedReward.type}
              </div>
              <h4 className="font-orbitron text-lg font-bold text-white">
                {unboxedReward.name}
              </h4>
              <p className="text-xs text-gray-300 mt-1 max-w-xs mx-auto">
                {unboxedReward.description}
              </p>
            </div>

            {/* Stat Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {unboxedReward.stats.incomeMultiplierBonus && (
                <span className="text-xs font-mono px-2.5 py-1 rounded border border-emerald-500/40 text-emerald-300 bg-emerald-950/40 font-bold">
                  +{Math.round(unboxedReward.stats.incomeMultiplierBonus * 100)}% INCOME
                </span>
              )}
              {unboxedReward.stats.xpBonus && (
                <span className="text-xs font-mono px-2.5 py-1 rounded border border-cyan-500/40 text-cyan-300 bg-cyan-950/40 font-bold">
                  +{Math.round(unboxedReward.stats.xpBonus * 100)}% EXP
                </span>
              )}
              {unboxedReward.stats.luckBonus && (
                <span className="text-xs font-mono px-2.5 py-1 rounded border border-fuchsia-500/40 text-fuchsia-300 bg-fuchsia-950/40 font-bold">
                  +{Math.round(unboxedReward.stats.luckBonus * 100)}% LUCK
                </span>
              )}
              {unboxedReward.stats.costDiscount && (
                <span className="text-xs font-mono px-2.5 py-1 rounded border border-amber-500/40 text-amber-300 bg-amber-950/40 font-bold">
                  -{Math.round(unboxedReward.stats.costDiscount * 100)}% COSTS
                </span>
              )}
            </div>

            <div className="flex gap-3">
              {unboxedReward.type === 'consumable' ? (
                <button
                  onClick={() => {
                    useConsumable(unboxedReward.instanceId);
                    setUnboxedReward(null);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-orbitron font-bold text-xs rounded-lg transition shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  USE ITEM NOW
                </button>
              ) : (
                <button
                  onClick={() => {
                    equipItem(unboxedReward.instanceId, unboxedReward.type as 'perk' | 'item' | 'pet');
                    setUnboxedReward(null);
                    setActiveTab('inventory');
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-orbitron font-bold text-xs rounded-lg transition shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  EQUIP TO RIG NOW
                </button>
              )}
              <button
                onClick={() => setUnboxedReward(null)}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-orbitron font-bold text-xs rounded-lg transition"
              >
                KEEP IN VAULT
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
