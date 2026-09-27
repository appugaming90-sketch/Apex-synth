import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { CAREER_TIERS, CAREER_CONTRACTS } from '../data/initialData';
import { JobTier, CareerContract } from '../types';
import { sounds } from '../utils/sound';
import { formatCash } from '../utils/format';
import {
  Briefcase,
  Zap,
  TrendingUp,
  Cpu,
  Clock,
  Coins,
  CheckCircle2,
  Lock,
  Flame,
  Award,
  ShieldAlert,
  Play,
  ShieldCheck
} from 'lucide-react';

export const CareersTab: React.FC = () => {
  const { profile, computedNetWorth, completeJobShift, addToast } = useGame();

  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [contractCooldowns, setContractCooldowns] = useState<Record<string, number>>({});
  const [activeMinigameJob, setActiveMinigameJob] = useState<JobTier | null>(null);
  const [minigameTimer, setMinigameTimer] = useState<number>(5);
  const [clickCount, setClickCount] = useState<number>(0);

  // Cooldown countdown loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCooldowns(prev => {
        const next: Record<string, number> = {};
        let changed = false;
        Object.keys(prev).forEach(key => {
          if (prev[key] > 1) {
            next[key] = prev[key] - 1;
            changed = true;
          } else if (prev[key] === 1) {
            changed = true;
          }
        });
        return changed ? next : prev;
      });

      setContractCooldowns(prev => {
        const next: Record<string, number> = {};
        let changed = false;
        Object.keys(prev).forEach(key => {
          if (prev[key] > 1) {
            next[key] = prev[key] - 1;
            changed = true;
          } else if (prev[key] === 1) {
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleExecuteContract = (contract: CareerContract) => {
    if (contractCooldowns[contract.id]) return;

    sounds.playCash();
    profile.cash += contract.reward;
    profile.xp += Math.max(5, Math.floor(contract.reward * 0.1));
    setContractCooldowns(prev => ({ ...prev, [contract.id]: contract.cooldown }));
    addToast(
      'Contract Executed',
      `+${contract.reward} credits transferred for ${contract.name}! (${contract.cooldown}s cooldown)`,
      'success'
    );
  };

  // Quick Minigame timer
  useEffect(() => {
    if (!activeMinigameJob) return;

    if (minigameTimer <= 0) {
      // Finish minigame shift
      sounds.playCash();
      const bonusMultiplier = clickCount >= 10 ? 1.5 : 1.0;
      const actualPayout = Math.floor(activeMinigameJob.basePayout * bonusMultiplier);
      completeJobShift(activeMinigameJob.id, bonusMultiplier);
      addToast(
        'Shift Completed!',
        `Earned +$${actualPayout.toLocaleString()} and +${activeMinigameJob.xpReward} XP!`,
        'success'
      );
      setCooldowns(prev => ({ ...prev, [activeMinigameJob.id]: activeMinigameJob.cooldownSeconds }));
      setActiveMinigameJob(null);
      return;
    }

    const t = setTimeout(() => setMinigameTimer(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [activeMinigameJob, minigameTimer, clickCount, completeJobShift, addToast]);

  const handleExecuteShift = (job: JobTier) => {
    if (cooldowns[job.id]) return;

    const energyCost = 10;
    if (profile.energy < energyCost) {
      sounds.playError();
      addToast('Energy Depleted', 'Rest or recharge your neural cyberware to run shifts.', 'danger');
      return;
    }

    sounds.playCash();
    completeJobShift(job.id, 1.0);
    setCooldowns(prev => ({ ...prev, [job.id]: job.cooldownSeconds }));
    addToast(
      'Contract Executed',
      `+$${job.basePayout.toLocaleString()} credits transferred & +${job.xpReward} XP awarded.`,
      'success'
    );
  };

  const handleStartMinigame = (job: JobTier) => {
    if (cooldowns[job.id]) return;
    const energyCost = 10;
    if (profile.energy < energyCost) {
      sounds.playError();
      addToast('Energy Depleted', 'Not enough neural energy to engage shift matrix.', 'danger');
      return;
    }

    sounds.playClick();
    setActiveMinigameJob(job);
    setMinigameTimer(5);
    setClickCount(0);
  };

  return (
    <section id="tab-careers" className="w-full h-full p-4 sm:p-6 overflow-y-auto max-w-4xl mx-auto select-none">
      {/* Energy & Stats Bar */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-orbitron text-xl text-cyan-400 font-bold mb-1">
            GIG CONTRACTS & SHIFTS
          </h2>
          <p className="text-xs text-gray-400 font-mono">
            Execute precision operations, data deliveries, and algorithmic arbitrage to acquire liquid capital.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-[10px] text-gray-400 font-mono">NEURAL ENERGY</div>
              <div className="font-orbitron font-bold text-sm text-yellow-400">
                {profile.energy} / {profile.maxEnergy}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-[10px] text-gray-400 font-mono">PLAYER LEVEL</div>
              <div className="font-orbitron font-bold text-sm text-cyan-400">
                L{profile.level} ({profile.xp} XP)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Shift Minigame Modal Overlay */}
      {activeMinigameJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-xl border border-cyan-500/50 text-center space-y-4">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              OVERCLOCK SHIFT IN PROGRESS
            </div>
            <h3 className="font-orbitron text-xl font-bold text-white">
              {activeMinigameJob.name}
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              Tap rapidly to overclock your shift efficiency and score a 1.5x bonus!
            </p>

            <div className="text-5xl font-orbitron font-black text-cyan-400 my-4 animate-pulse">
              {minigameTimer}s
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setClickCount(prev => prev + 1);
              }}
              className="w-full py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-orbitron font-black text-lg rounded-xl tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95 transition-transform"
            >
              PULSE MATRIX ({clickCount})
            </button>

            <div className="text-xs text-emerald-400 font-mono">
              {clickCount >= 10 ? '🔥 OVERCLOCK 1.5X UNLOCKED!' : `Target: ${10 - clickCount} more pulses for 1.5x payout`}
            </div>
          </div>
        </div>
      )}

      {/* 4 Active Career Contracts (Part 2) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-orbitron text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            HIGH-FREQUENCY CAREER CONTRACTS
          </h3>
          <span className="text-[10px] font-mono text-cyan-400">INSTANT DISPATCH</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CAREER_CONTRACTS.map(contract => {
            const cd = contractCooldowns[contract.id] || 0;
            const isOnCooldown = cd > 0;

            return (
              <div
                key={contract.id}
                className={`glass-panel p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isOnCooldown
                    ? 'border-gray-800 bg-gray-950/60'
                    : 'border-cyan-500/30 hover:border-cyan-400 bg-cyan-950/10 shadow-[0_0_12px_rgba(6,182,212,0.1)]'
                }`}
              >
                <div className="min-w-0">
                  <div className="font-orbitron font-bold text-xs sm:text-sm text-white truncate">
                    {contract.name}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-2 mt-0.5">
                    <span>+{formatCash(contract.reward)}</span>
                    <span className="text-gray-500">&bull;</span>
                    <span className="text-gray-400">{contract.cooldown}s CD</span>
                  </div>
                </div>

                <button
                  disabled={isOnCooldown}
                  onClick={() => handleExecuteContract(contract)}
                  className={`px-3 py-1.5 rounded-lg font-orbitron font-bold text-xs tracking-wider shrink-0 transition flex items-center gap-1 ${
                    isOnCooldown
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  }`}
                >
                  {isOnCooldown ? (
                    <>
                      <Clock className="w-3 h-3 animate-spin" />
                      {cd}S
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-black" />
                      RUN
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Careers List Container matching exact id="careers-list" */}
      <div id="careers-list" className="space-y-4">
        {CAREER_TIERS.map(job => {
          const isLockedByXp = profile.xp < job.requiredXp;
          const isLockedByWealth = computedNetWorth < job.requiredNetWorth;
          const isLocked = isLockedByXp || isLockedByWealth;
          const cd = cooldowns[job.id] || 0;
          const isOnCooldown = cd > 0;

          return (
            <div
              key={job.id}
              className={`glass-panel p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isLocked
                  ? 'border-gray-800 opacity-60'
                  : isOnCooldown
                  ? 'border-cyan-500/20'
                  : 'border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
              }`}
            >
              <div className="flex items-start space-x-3.5 min-w-0">
                <div className="w-11 h-11 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                  {job.type === 'courier' ? (
                    <Zap className="w-5 h-5" />
                  ) : job.type === 'broker' ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <Cpu className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-orbitron font-bold text-sm text-white">
                      {job.name}
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.5 bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono rounded uppercase">
                      {job.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] font-mono">
                    <span className="text-emerald-400 font-bold font-orbitron">
                      +{formatCash(job.basePayout)} Credits
                    </span>
                    <span className="text-cyan-400">
                      +{job.xpReward} XP
                    </span>
                    <span className="text-yellow-400">
                      -10 Energy
                    </span>
                    {job.cooldownSeconds > 0 && (
                      <span className="text-gray-500">
                        {job.cooldownSeconds}s Cooldown
                      </span>
                    )}
                  </div>
                  {isLocked && (
                    <div className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {isLockedByXp ? `Requires ${job.requiredXp} XP` : `Requires ${formatCash(job.requiredNetWorth)} Net Worth`}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => handleExecuteShift(job)}
                  disabled={isLocked || isOnCooldown || profile.energy < 10}
                  className="flex-1 sm:flex-none px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:pointer-events-none text-black font-orbitron font-bold text-xs rounded-lg tracking-wider transition flex items-center justify-center gap-1.5"
                >
                  {isOnCooldown ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>{cd}S COOLDOWN</span>
                    </>
                  ) : (
                    <>
                      <Coins className="w-3.5 h-3.5" />
                      <span>EXECUTE SHIFT</span>
                    </>
                  )}
                </button>

                {!isLocked && !isOnCooldown && (
                  <button
                    onClick={() => handleStartMinigame(job)}
                    className="px-3 py-2 glass-panel text-xs font-orbitron text-yellow-400 hover:text-white rounded-lg border border-yellow-500/40"
                    title="Engage Overclock Minigame for 1.5x payout"
                  >
                    ⚡ OVERCLOCK
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
