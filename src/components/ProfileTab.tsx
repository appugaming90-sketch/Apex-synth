import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';
import { LEVEL_CONFIG } from '../data/levelConfig';
import { SyndicateLeaderboard } from './SyndicateLeaderboard';
import { formatCash, formatCompactNumber } from '../utils/format';
import {
  User,
  Shield,
  Award,
  Crown,
  TrendingUp,
  Coins,
  Check,
  Sparkles,
  Building,
  Key,
  Zap,
  Lock,
  Trophy,
  Eye,
  X,
  Radio
} from 'lucide-react';

interface ProfileTabProps {
  onOpenAuthModal?: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ onOpenAuthModal }) => {
  const {
    profile,
    computedNetWorth,
    totalHourlyIncome,
    hourlyUpkeep,
    netHourlyCashflow,
    currentRankData,
    requiredXP,
    depositBank,
    withdrawBank,
    setCustomTitle,
    addToast
  } = useGame();

  const bankSavings = profile.bankBalance ?? profile.bankSavings ?? 0;
  const [bankAmount, setBankAmount] = useState<number>(1000);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>(profile.username || 'Syndicate Agent');
  const [titleInput, setTitleInput] = useState<string>(profile.title || 'Rogue Operator');
  const [activeView, setActiveView] = useState<'dossier' | 'leaderboard'>('dossier');
  const [isSpectateSelfOpen, setIsSpectateSelfOpen] = useState<boolean>(false);

  const handleSaveProfile = () => {
    sounds.playClick();
    if (titleInput.trim()) {
      setCustomTitle(titleInput.trim());
    }
    setIsEditingProfile(false);
    addToast('Credentials Updated', 'Neural identity verified and synced to ledger.', 'success');
  };

  const handleDeposit = () => {
    if (bankAmount <= 0) return;
    if (profile.cash < bankAmount) {
      sounds.playError();
      addToast('Insufficient Cash', 'Not enough liquid credits for this bank deposit.', 'danger');
      return;
    }
    sounds.playCash();
    depositBank(bankAmount);
  };

  const handleWithdraw = () => {
    if (bankAmount <= 0) return;
    if (bankSavings < bankAmount) {
      sounds.playError();
      addToast('Insufficient Savings', 'Not enough funds in Swiss vault.', 'danger');
      return;
    }
    sounds.playCash();
    withdrawBank(bankAmount);
  };

  return (
    <section id="tab-profile" className="w-full h-full p-4 sm:p-6 overflow-y-auto max-w-3xl mx-auto select-none">
      {/* Subtab Navigation */}
      <div className="flex items-center gap-3 border-b border-gray-800 pb-3 mb-6">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveView('dossier');
          }}
          className={`px-4 py-2 font-orbitron font-bold text-xs transition border-b-2 ${
            activeView === 'dossier'
              ? 'text-cyan-400 border-cyan-400'
              : 'text-gray-400 border-transparent hover:text-cyan-400'
          }`}
        >
          MY DOSSIER
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            setActiveView('leaderboard');
          }}
          className={`px-4 py-2 font-orbitron font-bold text-xs transition border-b-2 flex items-center gap-1.5 ${
            activeView === 'leaderboard'
              ? 'text-amber-400 border-amber-400'
              : 'text-gray-400 border-transparent hover:text-amber-400'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          SYNDICATE LEADERBOARD
        </button>
      </div>

      {/* VIEW 1: SYNDICATE LEADERBOARD */}
      {activeView === 'leaderboard' && <SyndicateLeaderboard />}

      {/* VIEW 2: MY DOSSIER */}
      {activeView === 'dossier' && (
        <>
          {/* Profile Card matching exact HTML structure */}
          <div className="glass-panel p-6 rounded-xl border border-cyan-500/30 mb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 min-w-0">
              <div className="w-20 h-20 rounded-full border-2 border-cyan-400 bg-cyan-950 flex items-center justify-center font-orbitron text-2xl text-cyan-300 font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] shrink-0">
                APEX
              </div>
              <div className="text-center sm:text-left flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="font-orbitron text-2xl text-white font-bold truncate" id="profile-name">
                    {profile.username || 'Syndicate Agent'}
                  </h2>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="text-[11px] font-mono text-cyan-400 hover:text-white px-2 py-0.5 glass-panel rounded border border-cyan-500/30"
                  >
                    {isEditingProfile ? 'CANCEL' : 'EDIT'}
                  </button>
                </div>

                <p className="text-xs text-cyan-400 uppercase tracking-widest font-mono mt-0.5 truncate" id="profile-title">
                  Reputation: {profile.title || 'Rogue Operator'}
                </p>
                <p className="text-xs text-gray-400 font-mono mt-0.5" id="profile-level-display">
                  Level {profile.level} (XP: {profile.xp} / {requiredXP})
                </p>

                <div className="mt-2 text-xs text-gray-400 font-mono flex items-center justify-center sm:justify-start gap-2">
                  <span>Cloud Status:</span>
                  <span className="text-emerald-400 font-bold">SYNCHRONIZED</span>
                  {onOpenAuthModal && (
                    <button
                      onClick={onOpenAuthModal}
                      className="ml-2 text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <Key className="w-3 h-3" />
                      {profile.googleAuth?.isLinked ? 'Google Linked' : 'Link Google'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <button
                id="btn-open-spectate"
                onClick={() => {
                  sounds.playClick();
                  setIsSpectateSelfOpen(true);
                }}
                className="px-3.5 py-2 bg-fuchsia-600/30 hover:bg-fuchsia-600/50 border border-fuchsia-500/50 text-fuchsia-300 font-orbitron font-bold text-xs rounded-lg flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(217,70,239,0.25)]"
              >
                <Eye className="w-3.5 h-3.5" />
                VIEW PUBLIC PROFILE
              </button>
            </div>
          </div>

      {/* Profile Edit Form */}
      {isEditingProfile && (
        <div className="glass-panel p-4 rounded-xl border border-cyan-500/40 mb-6 space-y-3 animate-fadeIn">
          <div className="font-orbitron text-xs font-bold text-cyan-400 uppercase">
            UPDATE NEURAL IDENTITY
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-gray-400">AGENT ALIAS</label>
              <input
                type="text"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                maxLength={24}
                className="w-full mt-1 p-2 bg-gray-950 border border-gray-800 rounded text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-gray-400">RANK TITLE</label>
              <input
                type="text"
                value={titleInput}
                onChange={e => setTitleInput(e.target.value)}
                maxLength={30}
                className="w-full mt-1 p-2 bg-gray-950 border border-gray-800 rounded text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleSaveProfile}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-orbitron font-bold text-xs rounded tracking-wider transition"
          >
            SAVE IDENTITY
          </button>
        </div>
      )}

      {/* Rank & Level Progression Card */}
      <div className="glass-panel p-5 rounded-xl border border-cyan-500/40 mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg bg-cyan-950/80 border border-cyan-400 flex items-center justify-center font-orbitron font-bold text-cyan-300 text-xl shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              L{profile.level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-orbitron font-bold text-white text-base">
                  {currentRankData.title}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/40">
                  {currentRankData.perk}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Next Rank Progression Tier
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-orbitron font-bold text-cyan-400 text-sm">
              {profile.xp} / {requiredXP} XP
            </div>
            <div className="text-[10px] text-gray-400 font-mono">
              {Math.min(100, Math.round((profile.xp / Math.max(1, requiredXP)) * 100))}% Completed
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full h-3 bg-gray-950 rounded-full overflow-hidden border border-cyan-500/30 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (profile.xp / Math.max(1, requiredXP)) * 100)}%` }}
          />
        </div>

        {/* Rank Perks Hierarchy */}
        <div className="pt-2 border-t border-gray-800">
          <div className="text-[11px] font-orbitron font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Apex Syndicate Rank Perks
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {LEVEL_CONFIG.ranks.map(r => {
              const isUnlocked = profile.level >= r.minLevel;
              const isCurrent = currentRankData.title === r.title;
              return (
                <div
                  key={r.minLevel}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                    isCurrent
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : isUnlocked
                      ? 'bg-gray-900/40 border-emerald-500/30'
                      : 'bg-gray-950/40 border-gray-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {isUnlocked ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    )}
                    <div>
                      <div className="font-orbitron font-bold text-white text-[11px] flex items-center gap-1.5">
                        {r.title}
                        <span className="text-[10px] text-gray-400 font-mono font-normal">
                          (Lv. {r.minLevel})
                        </span>
                      </div>
                      <div className="text-[10px] text-cyan-400 font-mono">
                        {r.perk}
                      </div>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500 text-black font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Net Worth & Prestige Grid matching exact HTML IDs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-panel p-4 rounded-lg border border-emerald-500/30">
          <div className="text-xs text-gray-400 font-mono">Total Net Worth</div>
          <div className="font-orbitron text-lg sm:text-xl text-emerald-400 font-bold" id="profile-networth">
            {formatCash(computedNetWorth)}
          </div>
        </div>
        <div className="glass-panel p-4 rounded-lg border border-fuchsia-500/30">
          <div className="text-xs text-gray-400 font-mono">PRESTIGE MULTIPLIER</div>
          <div className="font-orbitron text-lg sm:text-xl text-amber-400 font-bold" id="profile-prestige">
            {(1.0 + (profile.prestige || 0) * 0.05).toFixed(1)}x ({profile.prestige || 0} Stars)
          </div>
        </div>
      </div>

      {/* Financial Ledger & Swiss Bank Section */}
      <div className="glass-panel p-5 rounded-xl border border-cyan-500/30 mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-cyan-400" />
            <h3 className="font-orbitron font-bold text-sm text-white">
              OFFSHORE SWISS CRYPTO VAULT
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            2.0% Hourly Yield
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="glass-panel p-3 rounded-lg border border-gray-800">
            <div className="text-gray-400">VAULT BALANCE:</div>
            <div className="font-orbitron text-base text-cyan-400 font-bold mt-1">
              {formatCash(bankSavings)}
            </div>
          </div>
          <div className="glass-panel p-3 rounded-lg border border-gray-800">
            <div className="text-gray-400">NET CASHFLOW:</div>
            <div className={`font-orbitron text-base font-bold mt-1 ${netHourlyCashflow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {(netHourlyCashflow >= 0 ? '+' : '')}{formatCash(netHourlyCashflow)}/hr
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <input
            type="number"
            min={100}
            max={profile.cash}
            value={bankAmount}
            onChange={e => setBankAmount(Math.max(0, parseInt(e.target.value) || 0))}
            className="flex-1 min-w-[140px] p-2 bg-gray-950 border border-gray-800 rounded font-orbitron text-xs text-white focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleDeposit}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-orbitron font-bold text-xs rounded tracking-wider transition"
          >
            DEPOSIT
          </button>
          <button
            onClick={handleWithdraw}
            className="px-4 py-2 glass-panel text-cyan-400 hover:text-white font-orbitron font-bold text-xs rounded tracking-wider border border-cyan-500/40 transition"
          >
            WITHDRAW
          </button>
        </div>
      </div>

      {/* Asset Portfolio Summary */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 space-y-2">
        <h4 className="font-orbitron font-bold text-xs text-gray-300">
          OPERATIONAL SYNDICATE ASSETS
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-center">
          <div className="glass-panel p-2 rounded">
            <div className="text-gray-400">Base Plots</div>
            <div className="font-orbitron text-white font-bold mt-0.5">
              {profile.baseBuildings?.length || 1}
            </div>
          </div>
          <div className="glass-panel p-2 rounded">
            <div className="text-gray-400">Businesses</div>
            <div className="font-orbitron text-emerald-400 font-bold mt-0.5">
              {Array.isArray(profile.ownedBusinesses) ? profile.ownedBusinesses.length : Object.keys(profile.ownedBusinesses || {}).length}
            </div>
          </div>
          <div className="glass-panel p-2 rounded">
            <div className="text-gray-400">Properties</div>
            <div className="font-orbitron text-fuchsia-400 font-bold mt-0.5">
              {(profile.ownedProperties || []).length}
            </div>
          </div>
          <div className="glass-panel p-2 rounded">
            <div className="text-gray-400">Motor Rigs</div>
            <div className="font-orbitron text-yellow-400 font-bold mt-0.5">
              {(profile.ownedVehicles || []).length}
            </div>
          </div>
        </div>
      </div>
        </>
      )}

      {/* SPECTATE PLAYER PUBLIC PROFILE MODAL */}
      {isSpectateSelfOpen && (
        <div
          id="spectate-modal"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="glass-card w-full max-w-md p-6 rounded-xl border border-fuchsia-500/50 shadow-[0_0_30px_rgba(217,70,239,0.25)] relative">
            <button
              id="btn-close-spectate"
              onClick={() => {
                sounds.playClick();
                setIsSpectateSelfOpen(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-between items-start border-b border-gray-800 pb-4 mb-4 pr-6">
              <div>
                <span className="text-[9px] font-orbitron text-fuchsia-400 uppercase tracking-widest flex items-center gap-1">
                  <Radio className="w-3 h-3 text-fuchsia-400 animate-pulse" />
                  [PUBLIC SPECTATE VIEW]
                </span>
                <h3 className="font-orbitron text-xl text-white font-bold mt-1" id="spec-name">
                  {profile.username || 'Syndicate Agent'}
                </h3>
                <div className="text-xs text-cyan-400 font-mono" id="spec-rank">
                  {profile.title || 'Rogue Operator'}
                </div>
              </div>
              <div
                className="px-3 py-1 bg-fuchsia-950 border border-fuchsia-400 rounded text-fuchsia-300 font-orbitron font-bold text-xs"
                id="spec-level"
              >
                Level {profile.level}
              </div>
            </div>

            {/* PUBLIC FLEX STATS (NO PRIVATE FINANCIAL CONTROLS) */}
            <div className="space-y-3 mb-6 font-mono text-xs">
              <div className="glass-panel p-3 rounded-lg flex justify-between items-center border border-gray-800">
                <span className="text-gray-400">Total Net Worth</span>
                <span className="font-orbitron text-emerald-400 font-bold text-sm" id="spec-networth">
                  {formatCash(computedNetWorth)}
                </span>
              </div>

              <div className="glass-panel p-3 rounded-lg flex justify-between items-center border border-gray-800">
                <span className="text-gray-400">Grid Spires &amp; Structures</span>
                <span className="font-orbitron text-cyan-400 font-bold text-sm" id="spec-buildings">
                  {profile.baseBuildings?.length || 1} / 64
                </span>
              </div>

              <div className="glass-panel p-3 rounded-lg flex justify-between items-center border border-gray-800">
                <span className="text-gray-400">Hard Currency Reserves</span>
                <span className="font-orbitron text-fuchsia-400 font-bold text-sm">
                  {formatCompactNumber(profile.gems ?? 10)} Gems
                </span>
              </div>

              <div className="glass-panel p-3 rounded-lg flex justify-between items-center border border-gray-800">
                <span className="text-gray-400">Prestige Multiplier</span>
                <span className="font-orbitron text-amber-400 font-bold text-sm">
                  {(1.0 + (profile.prestige || 0) * 0.05).toFixed(1)}x ({profile.prestige || 0} Stars)
                </span>
              </div>

              <div className="glass-panel p-3 rounded-lg flex justify-between items-center border border-gray-800">
                <span className="text-gray-400">Operative Standing</span>
                <span className="font-orbitron text-emerald-400 font-bold text-xs">
                  VERIFIED OPERATIVE
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setIsSpectateSelfOpen(false);
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 font-orbitron text-xs text-gray-200 rounded-lg transition"
            >
              CLOSE PROFILE
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
