import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { VEHICLES_CATALOG, REAL_ESTATE_CATALOG, BUSINESSES_CATALOG, BUSINESS_CATALOG } from '../data/initialData';
import { sounds } from '../utils/sound';
import { formatCash, formatCompactNumber } from '../utils/format';
import {
  Shield,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
  Car,
  Home,
  Building2,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Cpu,
  Layers,
  Activity,
  Terminal,
  Radio,
  Crosshair
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const {
    profile,
    computedNetWorth,
    totalHourlyIncome,
    totalHourlyMaintenance,
    netHourlyCashflow,
    cycleCountdown,
    depositBank,
    withdrawBank,
    collectAllBusinesses,
    setActiveTab,
    addToast
  } = useGame();

  const [bankAmount, setBankAmount] = useState<string>('');
  const [bankMode, setBankMode] = useState<'deposit' | 'withdraw'>('deposit');

  // Find active vehicle & primary property
  const activeVehicle = VEHICLES_CATALOG.find(v => v.id === profile.activeVehicleId);
  const primaryProperty = REAL_ESTATE_CATALOG.find(p => p.id === profile.primaryPropertyId);

  // Total pending business revenue
  const totalPendingDividends = (Object.values(profile.ownedBusinesses) as { unclaimedRevenue: number }[]).reduce(
    (acc, b) => acc + (b.unclaimedRevenue || 0),
    0
  );

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(bankAmount, 10);
    if (isNaN(val) || val <= 0) {
      addToast('Invalid Amount', 'Enter a valid positive number.', 'warning');
      return;
    }
    if (bankMode === 'deposit') {
      depositBank(val);
    } else {
      withdrawBank(val);
    }
    setBankAmount('');
  };

  const handleCollectAll = () => {
    collectAllBusinesses();
  };

  // Asset breakdown math for the HUD meters
  let vehicleVal = 0;
  profile.ownedVehicles.forEach(vId => {
    const v = VEHICLES_CATALOG.find(i => i.id === vId);
    if (v) vehicleVal += v.price;
  });

  let propertyVal = 0;
  profile.ownedProperties.forEach(pId => {
    const p = REAL_ESTATE_CATALOG.find(i => i.id === pId);
    if (p) propertyVal += p.price;
  });

  let businessVal = 0;
  Object.entries(profile.ownedBusinesses).forEach(([bId, bizData]) => {
    const data = bizData as { level: number; unclaimedRevenue: number };
    const struct = BUSINESS_CATALOG.find(i => i.id === bId);
    if (struct && data.level > 0) {
      businessVal += struct.buyPrice * Math.pow(1.5, data.level - 1);
    } else {
      const b = BUSINESSES_CATALOG.find(i => i.id === bId);
      if (b && data.level > 0) {
        businessVal += b.basePrice * Math.pow(1.5, data.level - 1);
      }
    }
  });

  const totalCalculated = Math.max(1, computedNetWorth);
  const cashPct = Math.round((profile.cash / totalCalculated) * 100);
  const bankPct = Math.round((profile.bankBalance / totalCalculated) * 100);
  const fleetPct = Math.round((vehicleVal / totalCalculated) * 100);
  const propPct = Math.round((propertyVal / totalCalculated) * 100);
  const bizPct = Math.round((businessVal / totalCalculated) * 100);

  return (
    <div className="space-y-6">
      
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP CYBER COMMAND HERO: AUDITED NET WORTH & CYCLE TELEMETRY */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative clip-cyber-corner bg-[#070c18] border border-[#00f0ff]/40 p-5 sm:p-6 shadow-neon-cyan overflow-hidden">
        
        {/* Holographic grid background & corner crosshairs */}
        <div className="absolute top-2 right-2 text-[#00f0ff]/40 font-mono text-[10px] flex items-center gap-1">
          <Crosshair className="h-3 w-3" />
          <span>CYBER.NODE // SECTOR-07</span>
        </div>
        <div className="absolute bottom-2 left-2 text-[#fcee0a]/30 font-mono text-[9px]">
          [ SYS.INTEGRITY: 100% ]
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          
          {/* Main Net Worth Metric */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-[#fcee0a] animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest text-[#fcee0a] uppercase">
                // NET FINANCIAL POSITION
              </span>
              <span className="px-2 py-0.2 text-[9px] font-mono text-[#00ff66] bg-[#00ff66]/10 border border-[#00ff66]/30">
                AUDIT CERTIFIED
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white text-glow-yellow">
                {formatCash(computedNetWorth)}
              </h1>
              <div className="flex items-center gap-1 px-2.5 py-1 clip-cyber-corner-sm bg-[#00ff66]/15 border border-[#00ff66]/40 text-[#00ff66] text-xs font-mono font-bold">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>{(netHourlyCashflow >= 0 ? '+' : '')}{formatCash(netHourlyCashflow)}/hr</span>
              </div>
            </div>

            <p className="text-xs font-hud text-slate-300 max-w-xl leading-relaxed">
              Consolidated net assets across neural chip liquidity, central reserve vault, motor fleet title deeds, residential megastructures, and compounding autonomous business ventures.
            </p>

            {/* Asset Allocation Segmented Bar */}
            <div className="pt-2 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>PORTFOLIO ALLOCATION DIVERSITY</span>
                <span className="text-[#00f0ff]">
                  CASH {cashPct}% • VAULT {bankPct}% • FLEET {fleetPct}% • RE {propPct}% • BIZ {bizPct}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 border border-[#00f0ff]/30 flex overflow-hidden">
                <div style={{ width: `${cashPct}%` }} className="bg-[#fcee0a] shadow-neon-yellow" title="Liquid Cash" />
                <div style={{ width: `${bankPct}%` }} className="bg-[#00f0ff] shadow-neon-cyan" title="Bank Vault" />
                <div style={{ width: `${fleetPct}%` }} className="bg-[#ff0055] shadow-neon-magenta" title="Motor Fleet" />
                <div style={{ width: `${propPct}%` }} className="bg-[#9d4edd]" title="Real Estate" />
                <div style={{ width: `${bizPct}%` }} className="bg-[#00ff66] shadow-neon-green" title="Businesses" />
              </div>
            </div>
          </div>

          {/* Economic Cycle Heartbeat & Pulse */}
          <div className="flex flex-col justify-between p-4 clip-cyber-corner-sm bg-[#050812] border border-[#00f0ff]/25 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-mono font-bold text-[#00f0ff] flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#00f0ff] animate-spin" />
                CYCLE HEARTBEAT
              </span>
              <span className="text-xs font-mono-nums font-black text-[#fcee0a] text-glow-yellow">
                T-{cycleCountdown}s
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Commercial Yield:</span>
                <span className="text-[#00ff66] font-bold">+{formatCash(totalHourlyIncome)}/hr</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Maintenance &amp; Taxes:</span>
                <span className="text-[#ff0055] font-bold">-{formatCash(totalHourlyMaintenance)}/hr</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 pt-1 border-t border-white/5">
                <span className="text-slate-400">Bank Interest Yield:</span>
                <span className="text-[#00f0ff] font-bold">+2.50% APY</span>
              </div>
            </div>

            {/* Sweep All Dividends Button */}
            <button
              id="btn-collect-all-overview"
              onClick={handleCollectAll}
              disabled={totalPendingDividends < 1}
              className={`w-full py-2.5 clip-cyber-corner-sm flex items-center justify-center gap-2 text-xs font-mono font-black uppercase tracking-wider transition ${
                totalPendingDividends >= 1
                  ? 'bg-[#00ff66] hover:bg-[#00ff66]/90 text-black shadow-neon-green cursor-pointer'
                  : 'bg-slate-900 text-slate-500 border border-white/5 cursor-not-allowed'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>SWEEP DIVIDENDS ({formatCash(totalPendingDividends)})</span>
            </button>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. MAIN GRID: CYBER BANK TERMINAL & ACTIVE SHOWCASE HUD */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Central Reserve Bank Cyber-Terminal */}
        <div className="clip-cyber-corner bg-[#070c18] border border-[#00f0ff]/30 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#00f0ff]/20 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[#00f0ff]" />
              <h3 className="font-display font-bold text-white text-sm tracking-wider">
                CENTRAL RESERVE MAINFRAME
              </h3>
            </div>
            <span className="px-1.5 py-0.5 text-[9px] font-mono text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/30">
              FDIC-X SECURED
            </span>
          </div>

          <div className="space-y-3">
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 bg-[#040711] p-1 border border-white/10">
              <button
                onClick={() => { sounds.playClick(); setBankMode('deposit'); }}
                className={`py-2 text-xs font-mono font-bold tracking-wider transition clip-cyber-corner-sm ${
                  bankMode === 'deposit'
                    ? 'bg-[#00ff66] text-black shadow-neon-green'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ▼ DEPOSIT VAULT
              </button>
              <button
                onClick={() => { sounds.playClick(); setBankMode('withdraw'); }}
                className={`py-2 text-xs font-mono font-bold tracking-wider transition clip-cyber-corner-sm ${
                  bankMode === 'withdraw'
                    ? 'bg-[#00f0ff] text-black shadow-neon-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ▲ WITHDRAW CHIP
              </button>
            </div>

            <form onSubmit={handleBankSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
                  Transfer Amount ($CRED)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter credits..."
                    value={bankAmount}
                    onChange={(e) => setBankAmount(e.target.value)}
                    className="w-full rounded-none bg-[#03060d] border border-[#00f0ff]/30 px-3 py-2 text-sm font-mono-nums font-bold text-white focus:outline-none focus:border-[#00f0ff] shadow-inner"
                  />
                  <span className="absolute right-3 top-2.5 font-mono text-xs text-[#00f0ff]">
                    CRED
                  </span>
                </div>
              </div>

              {/* Quick Transfer Chips */}
              <div className="grid grid-cols-4 gap-1.5">
                {[500, 2500, 10000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => { sounds.playClick(); setBankAmount(val.toString()); }}
                    className="py-1 bg-[#040711] border border-white/10 hover:border-[#00f0ff] text-[10px] font-mono text-slate-300 hover:text-[#00f0ff] transition"
                  >
                    +${val}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setBankAmount(bankMode === 'deposit' ? profile.cash.toString() : profile.bankBalance.toString());
                  }}
                  className="py-1 bg-[#040711] border border-[#fcee0a]/30 hover:border-[#fcee0a] text-[10px] font-mono text-[#fcee0a] transition"
                >
                  MAX
                </button>
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 clip-cyber-corner-sm text-xs font-mono font-black uppercase tracking-wider transition ${
                  bankMode === 'deposit'
                    ? 'bg-[#00ff66] hover:bg-[#00ff66]/90 text-black shadow-neon-green cursor-pointer'
                    : 'bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black shadow-neon-cyan cursor-pointer'
                }`}
              >
                EXECUTE {bankMode === 'deposit' ? 'VAULT DEPOSIT' : 'CHIP WITHDRAWAL'}
              </button>
            </form>

            <div className="text-[11px] font-mono text-slate-400 bg-[#040711] p-2.5 border border-white/5 space-y-1">
              <div className="flex justify-between">
                <span>Checking Chip Balance:</span>
                <span className="text-[#fcee0a] font-bold">{formatCash(profile.cash)}</span>
              </div>
              <div className="flex justify-between">
                <span>Vault Reserve Balance:</span>
                <span className="text-[#00f0ff] font-bold">{formatCash(profile.bankBalance)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Fleet & Primary Real Estate Deeds Showcase */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Active Vehicle & Primary Property Twin Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Active Vehicle Deed */}
            <div className="clip-cyber-corner bg-[#070c18] border border-[#ff0055]/30 p-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-mono text-[#ff0055] font-bold flex items-center gap-1">
                    <Car className="h-3.5 w-3.5 text-[#ff0055]" /> ACTIVE GROUND RIG
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 border border-emerald-800">
                    DISPATCHED
                  </span>
                </div>

                {activeVehicle ? (
                  <div className="mt-3 space-y-2">
                    <h4 className="font-display font-bold text-white text-base">
                      {activeVehicle.name}
                    </h4>
                    <p className="text-xs text-slate-400 min-h-[36px]">
                      {activeVehicle.description}
                    </p>
                    <div className="grid grid-cols-3 gap-2 bg-[#040711] p-2 border border-white/5 text-center text-xs font-mono">
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase">Top Velocity</div>
                        <div className="font-bold text-white">{activeVehicle.topSpeed} km/h</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase">Prestige</div>
                        <div className="font-bold text-[#fcee0a]">+{activeVehicle.prestige}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase">Upkeep Sink</div>
                        <div className="font-bold text-[#ff0055]">${activeVehicle.maintenancePerHour}/hr</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 py-6 text-center text-xs font-mono text-slate-500">
                    No active combat / street vehicle dispatched.
                  </div>
                )}
              </div>

              <div className="mt-4 pt-2 border-t border-white/5">
                <button
                  onClick={() => setActiveTab('market')}
                  className="w-full py-1.5 clip-cyber-corner-sm bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono font-bold text-slate-200 hover:text-white transition flex items-center justify-center gap-1"
                >
                  <span>BROWSE MOTOR SHOWROOM</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Primary Real Estate Title */}
            <div className="clip-cyber-corner bg-[#070c18] border border-[#9d4edd]/30 p-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-mono text-[#9d4edd] font-bold flex items-center gap-1">
                    <Home className="h-3.5 w-3.5 text-[#9d4edd]" /> RESIDENTIAL BASE
                  </span>
                  <span className="text-[9px] font-mono text-purple-400 bg-purple-950/60 px-1.5 py-0.2 border border-purple-800">
                    PRIMARY TITLE
                  </span>
                </div>

                {primaryProperty ? (
                  <div className="mt-3 space-y-2">
                    <h4 className="font-display font-bold text-white text-base">
                      {primaryProperty.name}
                    </h4>
                    <p className="text-xs text-slate-400 min-h-[36px]">
                      {primaryProperty.description}
                    </p>
                    <div className="grid grid-cols-3 gap-2 bg-[#040711] p-2 border border-white/5 text-center text-xs font-mono">
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase">Storage</div>
                        <div className="font-bold text-white">{primaryProperty.storageSlots} slots</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase">Prestige</div>
                        <div className="font-bold text-[#fcee0a]">+{primaryProperty.prestige}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase">Luxury Tax</div>
                        <div className="font-bold text-[#ff0055]">${primaryProperty.luxuryTaxPerHour}/hr</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 py-6 text-center text-xs font-mono text-slate-500">
                    No residential deed recorded. Living on the street grid.
                  </div>
                )}
              </div>

              <div className="mt-4 pt-2 border-t border-white/5">
                <button
                  onClick={() => setActiveTab('market')}
                  className="w-full py-1.5 clip-cyber-corner-sm bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono font-bold text-slate-200 hover:text-white transition flex items-center justify-center gap-1"
                >
                  <span>BROWSE MEGASTRUCTURE TITLES</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>

          </div>

          {/* Quick Action Operations Tray */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setActiveTab('jobs')}
              className="p-3 clip-cyber-corner-sm bg-[#040813] border border-[#00f0ff]/20 hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 transition group text-left"
            >
              <div className="text-[9px] font-mono text-[#00f0ff] uppercase">// MINIGAMES</div>
              <div className="text-xs font-display font-bold text-white group-hover:text-[#00f0ff]">
                RUN GIG OPS
              </div>
            </button>

            <button
              onClick={() => setActiveTab('market')}
              className="p-3 clip-cyber-corner-sm bg-[#040813] border border-[#fcee0a]/20 hover:border-[#fcee0a] hover:bg-[#fcee0a]/10 transition group text-left"
            >
              <div className="text-[9px] font-mono text-[#fcee0a] uppercase">// ACQUISITIONS</div>
              <div className="text-xs font-display font-bold text-white group-hover:text-[#fcee0a]">
                BLACK MARKET
              </div>
            </button>

            <button
              onClick={() => setActiveTab('casino')}
              className="p-3 clip-cyber-corner-sm bg-[#040813] border border-[#ff0055]/20 hover:border-[#ff0055] hover:bg-[#ff0055]/10 transition group text-left"
            >
              <div className="text-[9px] font-mono text-[#ff0055] uppercase">// PROVABLY FAIR</div>
              <div className="text-xs font-display font-bold text-white group-hover:text-[#ff0055]">
                NEON CASINO
              </div>
            </button>

            <button
              onClick={() => setActiveTab('syndicates')}
              className="p-3 clip-cyber-corner-sm bg-[#040813] border border-[#00ff66]/20 hover:border-[#00ff66] hover:bg-[#00ff66]/10 transition group text-left"
            >
              <div className="text-[9px] font-mono text-[#00ff66] uppercase">// FACTION WAR</div>
              <div className="text-xs font-display font-bold text-white group-hover:text-[#00ff66]">
                MEGACORP CLANS
              </div>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
