import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';
import { Volume2, VolumeX, Shield, Database, Menu, Crown } from 'lucide-react';
import { SlideOutMenu } from './SlideOutMenu';
import { formatCash, formatCompactNumber, formatPerSec } from '../utils/format';

interface HeaderProps {
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth }) => {
  const {
    profile,
    setActiveTab,
    totalHourlyIncome,
    currentRankData,
    timedCrateReady,
    timedCrateCountdown,
    claimTimedCrate,
    isSlideOutOpen,
    setIsSlideOutOpen,
    masteryCrownsCount
  } = useGame();

  const [isMuted, setIsMuted] = useState(() => sounds.isMuted);

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  // Cashflow rate per second
  const perSecond = (totalHourlyIncome / 3600).toFixed(2);
  const expPercent = Math.round((profile.expMultiplier || 1.0) * 100);
  const incPercent = Math.round((profile.incMultiplier || 1.0) * 100);

  return (
    <header className="w-full glass-panel z-20 px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between border-b border-cyan-500/30">
      {/* Brand / Player Level */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => {
            sounds.playClick();
            setIsSlideOutOpen(true);
          }}
          className="px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-400 flex flex-col items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.3)] hover:scale-105 transition-transform"
          id="hud-level"
          title="Open Profile Dossier"
        >
          <span className="text-[9px] font-orbitron text-gray-400 uppercase tracking-widest">RANK</span>
          <span className="font-orbitron font-extrabold text-cyan-300 text-xs" id="hud-level-text">
            Level {profile.level}
          </span>
        </button>
        <div>
          <h1 className="font-orbitron font-black text-sm tracking-widest text-cyan-400 uppercase flex items-center gap-2">
            APEX ECONOMY <span className="text-[10px] text-fuchsia-400 font-normal">[V3.0]</span>
          </h1>
          <p className="text-xs text-gray-300 font-medium flex items-center gap-1.5" id="hud-rank">
            <span>{currentRankData.title}</span>
            <span className="text-gray-500">&bull;</span>
            <span className="text-cyan-400 font-mono text-[10px]">{currentRankData.perk}</span>
          </p>
        </div>
      </div>

      {/* Currency and XP Info */}
      <div className="flex items-center space-x-3 sm:space-x-5 my-1 sm:my-0">
        {/* Soft Currency ($CREDITS) */}
        <div className="flex items-center space-x-2">
          <span className="text-emerald-400 font-bold text-xl">$</span>
          <div>
            <div className="font-orbitron font-bold text-emerald-400 text-sm" id="hud-credits">
              {formatCash(profile.cash)}
            </div>
            <div className="text-[10px] text-emerald-500/90 font-mono" id="hud-rate">
              +{formatCash(totalHourlyIncome)}/hr ({formatPerSec(totalHourlyIncome / 3600)})
            </div>
          </div>
        </div>

        {/* Hard Currency (Apex Gems & Multipliers) */}
        <div className="flex items-center space-x-2">
          <span className="text-fuchsia-400 font-bold text-xl">💎</span>
          <div>
            <div className="font-orbitron font-bold text-fuchsia-400 text-sm" id="hud-gems">
              {formatCompactNumber(profile.gems ?? 10)} Gems
            </div>
            <div className="text-[10px] text-fuchsia-400/90 font-mono font-bold tracking-tight" id="hud-boosts-summary">
              EXP: {expPercent}% | INC: {incPercent}%
            </div>
          </div>
        </div>

        {/* Mastery Crowns Badge */}
        {masteryCrownsCount > 0 && (
          <button
            onClick={() => {
              sounds.playClick();
              setIsSlideOutOpen(true);
            }}
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-yellow-950/60 border border-yellow-500/50 text-yellow-300 shadow-[0_0_10px_rgba(251,191,36,0.25)] hover:bg-yellow-900/60 transition"
            title="Mastery Crowns (+50% Property Boost)"
          >
            <Crown className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-orbitron text-xs font-bold">{masteryCrownsCount}</span>
          </button>
        )}

        {/* Timed Silent Crate Drop Widget */}
        <div className="flex items-center">
          {timedCrateReady ? (
            <button
              id="hud-timed-crate"
              onClick={() => claimTimedCrate()}
              className="px-2.5 py-1 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-orbitron font-bold text-[11px] animate-bounce shadow-[0_0_10px_rgba(217,70,239,0.5)] flex items-center gap-1.5"
              title="Claim Silent Crate Drop!"
            >
              <span>📦</span>
              <span className="hidden sm:inline">CLAIM CRATE!</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('inventory')}
              className="px-2 py-1 rounded border border-gray-800 bg-gray-900/60 text-[10px] font-mono text-gray-400 hover:border-cyan-500/40 flex items-center gap-1 transition"
              title="Open Inventory / Gear Rig"
            >
              <span>📦</span>
              <span className="text-cyan-400 font-bold">{timedCrateCountdown}s</span>
            </button>
          )}
        </div>

        {/* Quick Utility Toggles & 3-Bar Slide-out Menu Trigger (☰) */}
        <div className="flex items-center space-x-2 pl-2 border-l border-cyan-500/20">
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded glass-panel-interactive text-cyan-400 hover:text-white text-xs"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-gray-500" /> : <Volume2 className="w-3.5 h-3.5 text-yellow-400" />}
          </button>
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="hidden sm:block p-1.5 rounded glass-panel-interactive text-cyan-400 hover:text-white text-xs"
              title="Cloud Sync / Auth"
            >
              <Database className="w-3.5 h-3.5" />
            </button>
          )}

          {/* 3-BAR RIGHT SLIDE-OUT MENU TRIGGER (☰) */}
          <button
            id="btn-slideout-menu"
            onClick={() => {
              sounds.playClick();
              setIsSlideOutOpen(true);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 hover:text-white shadow-[0_0_12px_rgba(6,182,212,0.3)] transition flex items-center gap-1.5"
            title="Profile & Global Leaderboard (☰)"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden md:inline font-orbitron text-xs font-bold">MENU</span>
          </button>
        </div>
      </div>

      {/* Modern Slide-out Drawer */}
      <SlideOutMenu isOpen={isSlideOutOpen} onClose={() => setIsSlideOutOpen(false)} />
    </header>
  );
};
