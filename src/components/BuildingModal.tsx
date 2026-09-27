import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { BaseBuilding, BuildingType } from '../types';
import { BUILDING_BLUEPRINTS } from '../data/buildingBlueprints';
import { BUSINESS_CATALOG, RESIDENTIAL_CATALOG } from '../data/initialData';
import { sounds } from '../utils/sound';
import { formatCash, formatCompactNumber, formatPerSec } from '../utils/format';
import {
  Shield,
  Dices,
  Factory,
  Sparkles,
  Cpu,
  Crosshair,
  Clock,
  Coins,
  CheckCircle2,
  Flame,
  ArrowUpCircle,
  X,
  Building2,
  Store
} from 'lucide-react';

interface BuildingModalProps {
  selectedPlot: { x: number; y: number } | null;
  selectedBuilding: BaseBuilding | null;
  onClose: () => void;
}

const ICONS: Record<string, React.FC<{ className?: string }>> = {
  safehouse: Shield,
  casino: Dices,
  factory: Factory,
  nightclub: Sparkles,
  crypto_rig: Cpu,
  defense_turret: Crosshair
};

export const BuildingModal: React.FC<BuildingModalProps> = ({
  selectedPlot,
  selectedBuilding,
  onClose
}) => {
  const {
    profile,
    constructBuilding,
    upgradeBaseBuilding,
    rushFinishUpgrade,
    collectBuildingRevenue,
    setActiveTab
  } = useGame();

  const [now, setNow] = useState(Date.now());
  const [constructCategory, setConstructCategory] = useState<'market' | 'blueprints' | 'businesses'>('market');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const safehouse = (profile.baseBuildings || []).find(b => b.type === 'safehouse');
  const safehouseLevel = safehouse ? safehouse.level : 1;

  // If no plot or building selected, return null
  if (!selectedPlot && !selectedBuilding) {
    return null;
  }

  // 1. Manage existing building modal
  if (selectedBuilding) {
    const bp = BUILDING_BLUEPRINTS.find(b => b.type === selectedBuilding.type);
    const nextBonus = bp?.bonusesByLevel.find(lvl => lvl.level === selectedBuilding.level + 1);
    const currentBonus = bp?.bonusesByLevel.find(lvl => lvl.level === selectedBuilding.level);

    let remainingSeconds = 0;
    let progressPercent = 0;
    if (selectedBuilding.isUpgrading && selectedBuilding.upgradeStartTime && selectedBuilding.upgradeDurationSeconds) {
      const elapsed = Math.floor((now - selectedBuilding.upgradeStartTime) / 1000);
      remainingSeconds = Math.max(0, selectedBuilding.upgradeDurationSeconds - elapsed);
      progressPercent = Math.min(100, Math.floor((elapsed / selectedBuilding.upgradeDurationSeconds) * 100));
    }

    const canAffordUpgrade = nextBonus ? profile.cash >= nextBonus.upgradeCost : false;
    const isMaxLevel = bp ? selectedBuilding.level >= bp.maxLevel : false;
    const IconComp = ICONS[selectedBuilding.type] || Shield;

    return (
      <div id="build-modal" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="glass-panel w-full max-w-lg p-6 rounded-xl border border-cyan-500/40 max-h-[90vh] flex flex-col">
          
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500 flex items-center justify-center text-cyan-400">
                <IconComp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-orbitron text-lg text-cyan-400 font-bold" id="modal-title">
                  {selectedBuilding.name}
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Level {selectedBuilding.level} &bull; Sector [{selectedBuilding.x}, {selectedBuilding.y}]
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="my-4 space-y-4 overflow-y-auto max-h-[60vh] pr-1">
            {/* Building Stats */}
            <div className="glass-panel p-4 rounded-lg space-y-2 border border-cyan-500/20">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Yield per Hour</span>
                <span className="font-orbitron text-emerald-400 font-bold">
                  +{formatCash(currentBonus?.revenuePerHour || bp?.baseRevenuePerHour || 0)}/hr
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Uncollected Revenue</span>
                <span className="font-orbitron text-yellow-400 font-bold">
                  {formatCash(selectedBuilding.uncollectedRevenue || 0)}
                </span>
              </div>
              {currentBonus?.perkDescription && (
                <p className="text-xs text-gray-300 font-mono pt-2 border-t border-gray-800">
                  {currentBonus.perkDescription}
                </p>
              )}
            </div>

            {/* Collect Revenue Button */}
            {selectedBuilding.uncollectedRevenue > 0 && (
              <button
                onClick={() => {
                  sounds.playCash();
                  collectBuildingRevenue(selectedBuilding.id);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-orbitron font-bold text-xs rounded-lg tracking-wider flex items-center justify-center gap-2"
              >
                <Coins className="w-4 h-4" />
                COLLECT {formatCash(selectedBuilding.uncollectedRevenue)}
              </button>
            )}

            {/* Structure-specific quick shortcuts */}
            {selectedBuilding.type === 'casino' && (
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('casino');
                }}
                className="w-full py-2.5 bg-fuchsia-600/30 hover:bg-fuchsia-600/50 border border-fuchsia-500/50 text-fuchsia-300 font-orbitron font-bold text-xs rounded-lg tracking-wider flex items-center justify-center gap-2"
              >
                <Dices className="w-4 h-4" />
                VISIT HIGH-ROLLER CASINO
              </button>
            )}

            {/* Upgrade Status Section */}
            {selectedBuilding.isUpgrading ? (
              <div className="glass-panel p-4 rounded-lg border border-yellow-500/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-orbitron text-yellow-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 animate-spin" />
                    UPGRADING TO LEVEL {selectedBuilding.level + 1}
                  </span>
                  <span>{remainingSeconds}s</span>
                </div>
                <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-yellow-500/30">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <button
                  onClick={() => rushFinishUpgrade(selectedBuilding.id)}
                  className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-orbitron font-bold text-xs rounded-lg tracking-wider flex items-center justify-center gap-2"
                >
                  <Flame className="w-4 h-4" />
                  RUSH COMPLETE NOW
                </button>
              </div>
            ) : isMaxLevel ? (
              <div className="glass-panel p-4 rounded-lg border border-cyan-500/20 text-center">
                <span className="font-orbitron text-yellow-400 font-bold text-xs flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  MAX LEVEL REACHED
                </span>
              </div>
            ) : nextBonus ? (
              <div className="glass-panel p-4 rounded-lg border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-orbitron text-gray-300">
                  <span>Upgrade to Level {nextBonus.level}</span>
                  <span className="text-emerald-400 font-bold">{formatCash(nextBonus.upgradeCost)}</span>
                </div>
                <p className="text-xs text-gray-400 font-mono">
                  {nextBonus.perkDescription}
                </p>
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                  <span>Build time: {nextBonus.upgradeTimeSeconds}s</span>
                  <span>Yield boost: +{formatCash(nextBonus.revenuePerHour - (currentBonus?.revenuePerHour || 0))}/hr</span>
                </div>
                <button
                  onClick={() => {
                    sounds.playClick();
                    upgradeBaseBuilding(selectedBuilding.id);
                  }}
                  disabled={!canAffordUpgrade}
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:pointer-events-none text-black font-orbitron font-bold text-xs rounded-lg tracking-wider flex items-center justify-center gap-2"
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  {canAffordUpgrade ? `UPGRADE (${formatCash(nextBonus.upgradeCost)})` : `NEED ${formatCash(nextBonus.upgradeCost)}`}
                </button>
              </div>
            ) : (() => {
              const catalogBiz = BUSINESS_CATALOG.find(b => b.id === selectedBuilding.type || b.id === selectedBuilding.id);
              const catalogRes = RESIDENTIAL_CATALOG.find(r => r.id === selectedBuilding.type || r.id === selectedBuilding.id);
              const currentLvl = selectedBuilding.level || 1;
              const isMaxLvl = currentLvl >= 100;
              const nextLvl = currentLvl + 1;
              const baseCost = (selectedBuilding as any).cost || catalogBiz?.cost || catalogBiz?.buyPrice || catalogRes?.cost || 100;
              const upgradeCost = Math.round(baseCost * Math.pow(1.22, currentLvl));
              const canAfford = profile.cash >= upgradeCost;
              const currentIncome = (selectedBuilding as any).income !== undefined ? (selectedBuilding as any).income : (catalogBiz?.income || 2);
              const nextIncome = Math.round(currentIncome * 1.03 * (nextLvl === 100 ? 1.5 : 1.0));

              if (isMaxLvl) {
                return (
                  <div className="glass-panel p-4 rounded-xl border border-yellow-500/50 bg-gradient-to-r from-yellow-950/40 via-amber-950/20 to-gray-900 text-center space-y-2">
                    <div className="text-3xl animate-bounce">👑</div>
                    <div className="font-orbitron font-extrabold text-sm text-yellow-300">
                      MASTERY CROWN UNLOCKED (LEVEL 100 MAX)
                    </div>
                    <p className="text-xs text-yellow-200/80 font-mono">
                      Apex property mastery achieved! +50% global revenue boost is actively compounding.
                    </p>
                  </div>
                );
              }

              return (
                <div className="glass-panel p-4 rounded-lg border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-orbitron text-gray-300">
                    <span className="flex items-center gap-1.5">
                      <span>Upgrade to Level {nextLvl} / 100</span>
                      {nextLvl === 100 && (
                        <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 text-[9px] font-bold">
                          👑 AWARDS CROWN
                        </span>
                      )}
                    </span>
                    <span className="text-emerald-400 font-bold">{formatCash(upgradeCost)}</span>
                  </div>

                  {/* Progress to Level 100 */}
                  <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden border border-gray-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 via-yellow-400 to-amber-500 transition-all duration-300"
                      style={{ width: `${Math.min(100, currentLvl)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span>Exponential scale (1.22x)</span>
                    <span className="text-emerald-400">Yield: {formatPerSec(currentIncome)} &rarr; {formatPerSec(nextIncome)}</span>
                  </div>

                  {/* Visual Milestones tag */}
                  <div className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-500/20">
                    {currentLvl < 25 && "Next Stage: Level 25 (Stepped Architecture & Antennas)"}
                    {currentLvl >= 25 && currentLvl < 50 && "Next Stage: Level 50 (Helipad Tower & Radar)"}
                    {currentLvl >= 50 && currentLvl < 75 && "Next Stage: Level 75 (Sky-Piercing Pinnacle Spire)"}
                    {currentLvl >= 75 && currentLvl < 100 && "Next Stage: Level 100 (👑 Mastery Crown +50% Global Boost!)"}
                  </div>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      upgradeBaseBuilding(selectedBuilding.id);
                    }}
                    disabled={!canAfford}
                    className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:pointer-events-none text-black font-orbitron font-bold text-xs rounded-lg tracking-wider flex items-center justify-center gap-2"
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    {canAfford ? `UPGRADE (${formatCash(upgradeCost)})` : `NEED ${formatCash(upgradeCost)}`}
                  </button>
                </div>
              );
            })()}
          </div>

          <button
            id="btn-close-modal"
            onClick={onClose}
            className="mt-2 w-full py-2 glass-panel text-xs font-orbitron text-gray-400 hover:text-white rounded border border-cyan-500/30"
          >
            CLOSE
          </button>
        </div>
      </div>
    );
  }

  // 2. Select Structure to Construct (matching exact user HTML specification)
  const constructibleBlueprints = BUILDING_BLUEPRINTS.filter(b => b.type !== 'safehouse');

  const quickCatalogItems = [
    ...BUSINESS_CATALOG.slice(0, 10),
    ...RESIDENTIAL_CATALOG.slice(0, 5)
  ];

  const filteredBusinesses = BUSINESS_CATALOG.filter(b => {
    if (selectedTier === 'ALL') return true;
    return b.tier === selectedTier;
  });

  return (
    <div id="build-modal" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg p-6 rounded-xl border border-cyan-500/40 max-h-[90vh] flex flex-col">
        <h3 className="font-orbitron text-lg text-cyan-400 font-bold mb-1" id="modal-title">
          SELECT STRUCTURE TO CONSTRUCT
        </h3>
        
        <p className="text-xs text-gray-400 mb-3 font-mono">
          Target Coordinate: Grid [{selectedPlot?.x}, {selectedPlot?.y}] &bull; Player Level {profile.level}
        </p>

        {/* Category Switcher Tabs */}
        <div className="flex border-b border-gray-800 mb-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setConstructCategory('market')}
            className={`pb-2 px-3 font-orbitron text-xs font-bold transition border-b-2 flex items-center gap-1.5 shrink-0 ${
              constructCategory === 'market'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            CATALOG ({quickCatalogItems.length})
          </button>
          <button
            onClick={() => setConstructCategory('blueprints')}
            className={`pb-2 px-3 font-orbitron text-xs font-bold transition border-b-2 flex items-center gap-1.5 shrink-0 ${
              constructCategory === 'blueprints'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            BASE FACILITIES ({constructibleBlueprints.length})
          </button>
          <button
            onClick={() => setConstructCategory('businesses')}
            className={`pb-2 px-3 font-orbitron text-xs font-bold transition border-b-2 flex items-center gap-1.5 shrink-0 ${
              constructCategory === 'businesses'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            ALL ENTERPRISES ({BUSINESS_CATALOG.length})
          </button>
        </div>

        {constructCategory === 'businesses' && (
          <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 text-[10px] font-orbitron">
            {(['ALL', 'STREET', 'RETAIL', 'COMMERCIAL', 'ENTERTAINMENT', 'CORPORATE', 'SYNDICATE_APEX'] as const).map(tier => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-2 py-0.5 rounded transition shrink-0 ${
                  selectedTier === tier
                    ? 'bg-cyan-600 text-black font-bold'
                    : 'bg-gray-900 text-gray-400 hover:text-white'
                }`}
              >
                {tier === 'SYNDICATE_APEX' ? 'APEX' : tier}
              </button>
            ))}
          </div>
        )}

        <div id="modal-options" className="overflow-y-auto space-y-2.5 pr-2 max-h-[50vh]">
          {constructCategory === 'market' ? (
            quickCatalogItems.map(item => {
              const cost = item.cost || (item as any).buyPrice || (item as any).price || 10;
              const canAfford = profile.cash >= cost;
              const isLocked = (item as any).minPlayerLevel && profile.level < (item as any).minPlayerLevel;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!isLocked && canAfford && selectedPlot) {
                      sounds.playCash();
                      const success = constructBuilding(item.id, selectedPlot.x, selectedPlot.y);
                      if (success) onClose();
                    }
                  }}
                  className={`glass-panel-interactive p-3 rounded-lg flex items-center justify-between cursor-pointer border transition-all ${
                    isLocked
                      ? 'border-gray-800 opacity-60 pointer-events-none'
                      : canAfford
                      ? 'border-cyan-500/30 hover:border-cyan-400'
                      : 'border-red-900/30 opacity-70'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-orbitron font-bold text-xs text-cyan-400 truncate">{item.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      {(item as any).income ? `+$${(item as any).income}/s` : `+${(item as any).prestige || 10} Clout`}
                      {isLocked && <span className="text-red-400 ml-2">Req Lv. {(item as any).minPlayerLevel}</span>}
                    </div>
                  </div>
                  <button
                    disabled={isLocked || !canAfford}
                    className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:pointer-events-none font-orbitron font-bold text-[10px] text-white rounded shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                  >
                    {formatCash(cost)}
                  </button>
                </div>
              );
            })
          ) : constructCategory === 'blueprints' ? (
            constructibleBlueprints.map(blueprint => {
              const IconComp = ICONS[blueprint.type] || Shield;
              const isLocked = safehouseLevel < blueprint.requiredSafehouseLevel;
              const canAfford = profile.cash >= blueprint.baseCost;

              return (
                <div
                  key={blueprint.type}
                  className={`glass-panel p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                    isLocked
                      ? 'border-gray-800 opacity-60'
                      : 'border-cyan-500/30 hover:border-cyan-400'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-orbitron font-bold text-sm text-white truncate">
                        {blueprint.name}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono truncate">
                        +{formatCash(blueprint.baseRevenuePerHour)}/hr &bull; {blueprint.category}
                      </div>
                      {isLocked && (
                        <div className="text-[10px] text-red-400 font-mono">
                          Requires Safehouse HQ L{blueprint.requiredSafehouseLevel}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-xs font-orbitron font-bold text-emerald-400 mb-1">
                      {formatCash(blueprint.baseCost)}
                    </div>
                    <button
                      onClick={() => {
                        if (selectedPlot) {
                          sounds.playCash();
                          const success = constructBuilding(blueprint.type, selectedPlot.x, selectedPlot.y);
                          if (success) onClose();
                        }
                      }}
                      disabled={isLocked || !canAfford}
                      className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:pointer-events-none text-black font-orbitron font-bold text-[11px] rounded tracking-wide transition"
                    >
                      BUILD
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            filteredBusinesses.map(biz => {
              const cost = biz.cost || biz.buyPrice || 10;
              const hourly = biz.hourlyIncome || biz.hourlyYield || 0;
              const perSec = biz.income !== undefined ? biz.income : hourly / 3600;
              const isLocked = biz.minPlayerLevel && profile.level < biz.minPlayerLevel;
              const canAfford = profile.cash >= cost;

              return (
                <div
                  key={biz.id}
                  className={`glass-panel p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                    isLocked
                      ? 'border-gray-800 opacity-60'
                      : 'border-cyan-500/30 hover:border-cyan-400'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-lg border flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        borderColor: biz.color || '#06b6d4',
                        color: biz.color || '#06b6d4'
                      }}
                    >
                      <Store className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-orbitron font-bold text-sm text-white truncate">
                        {biz.name}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono truncate">
                        +{formatCash(hourly)}/hr ({formatPerSec(perSec)}) &bull; {biz.tier}
                      </div>
                      {isLocked && (
                        <div className="text-[10px] text-red-400 font-mono">
                          Requires Level {biz.minPlayerLevel}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-xs font-orbitron font-bold text-emerald-400 mb-1">
                      {formatCash(cost)}
                    </div>
                    <button
                      onClick={() => {
                        if (selectedPlot) {
                          sounds.playCash();
                          const success = constructBuilding(biz.id, selectedPlot.x, selectedPlot.y);
                          if (success) onClose();
                        }
                      }}
                      disabled={Boolean(isLocked || !canAfford)}
                      className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:pointer-events-none text-black font-orbitron font-bold text-[11px] rounded tracking-wide transition"
                    >
                      BUILD
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          id="btn-close-modal"
          onClick={onClose}
          className="mt-4 w-full py-2 glass-panel text-xs font-orbitron text-gray-400 hover:text-white rounded border border-cyan-500/30"
        >
          CANCEL
        </button>
      </div>
    </div>
  );
};
