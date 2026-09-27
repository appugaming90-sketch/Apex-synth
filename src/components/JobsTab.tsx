import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { CAREER_TIERS } from '../data/initialData';
import { JobTier, JobType } from '../types';
import { sounds } from '../utils/sound';
import { formatCash } from '../utils/format';
import {
  Zap,
  Radio,
  Lock,
  Play,
  RotateCcw,
  Crosshair,
  TrendingUp,
  Cpu,
  ShieldAlert,
  Clock,
  Terminal,
  Activity,
  CheckCircle2
} from 'lucide-react';

export const JobsTab: React.FC = () => {
  const { profile, computedNetWorth, completeJobShift, addToast, requiredXP, currentRankData } = useGame();
  
  const [selectedJob, setSelectedJob] = useState<JobTier>(CAREER_TIERS[0]);
  const [activeType, setActiveType] = useState<JobType>('courier');
  const [cooldowns, setCooldowns] = useState<{ [jobId: string]: number }>({});
  const [shiftStreak, setShiftStreak] = useState<number>(0);

  // Minigame States
  const [isShiftActive, setIsShiftActive] = useState<boolean>(false);
  const [gameTimeLeft, setGameTimeLeft] = useState<number>(10);
  
  // Courier minigame: Waypoint Nodes
  const [waypoints, setWaypoints] = useState<{ id: number; x: number; y: number; clicked: boolean }[]>([]);
  const [currentWaypointIdx, setCurrentWaypointIdx] = useState<number>(0);

  // Broker minigame: Price Ticker & Arbitrage
  const [brokerPrice, setBrokerPrice] = useState<number>(100);
  const [brokerBoughtAt, setBrokerBoughtAt] = useState<number | null>(null);
  const [brokerHistory, setBrokerHistory] = useState<number[]>([100]);

  // Tech Dev minigame: Sequence Pattern
  const [techSequence, setTechSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState<boolean>(false);
  const TECH_BUTTONS = ['AUTH_MODULE', 'CRYPTO_HASH', 'QUANT_MODEL', 'CACHE_SYNC'];

  // Cooldown timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCooldowns(prev => {
        const next: { [key: string]: number } = {};
        let changed = false;
        Object.keys(prev).forEach(k => {
          if (prev[k] > 1) {
            next[k] = prev[k] - 1;
            changed = true;
          } else if (prev[k] === 1) {
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Minigame Countdown
  useEffect(() => {
    if (!isShiftActive) return;

    if (gameTimeLeft <= 0) {
      handleMinigameTimeout();
      return;
    }

    const timer = setTimeout(() => {
      setGameTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isShiftActive, gameTimeLeft]);

  // Broker Price Fluctuations during minigame
  useEffect(() => {
    if (!isShiftActive || selectedJob.type !== 'broker') return;

    const interval = setInterval(() => {
      setBrokerPrice(prev => {
        const delta = (Math.random() - 0.48) * 12;
        const newPrice = Math.max(50, Math.min(180, Math.round(prev + delta)));
        setBrokerHistory(h => [...h.slice(-12), newPrice]);
        return newPrice;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isShiftActive, selectedJob.type]);

  const startShift = (job: JobTier) => {
    if (cooldowns[job.id] && cooldowns[job.id] > 0) {
      addToast('On Cooldown', `Recharging cyber deck. ${cooldowns[job.id]}s remaining.`, 'warning');
      return;
    }

    if (profile.xp < job.requiredXp || computedNetWorth < job.requiredNetWorth) {
      addToast('Requirements Unmet', 'Meet XP and Net Worth requirements to run this op.', 'danger');
      return;
    }

    sounds.playClick();
    setSelectedJob(job);
    setIsShiftActive(true);

    if (job.type === 'courier') {
      setGameTimeLeft(8);
      const pts = Array.from({ length: 4 }).map((_, i) => ({
        id: i,
        x: Math.floor(Math.random() * 70) + 15,
        y: Math.floor(Math.random() * 60) + 20,
        clicked: false
      }));
      setWaypoints(pts);
      setCurrentWaypointIdx(0);
    } else if (job.type === 'broker') {
      setGameTimeLeft(10);
      setBrokerPrice(100);
      setBrokerBoughtAt(null);
      setBrokerHistory([100]);
    } else if (job.type === 'tech') {
      setGameTimeLeft(12);
      const seq = Array.from({ length: 4 }).map(() => Math.floor(Math.random() * 4));
      setTechSequence(seq);
      setPlayerSequence([]);
      setIsShowingSequence(true);
      setTimeout(() => {
        setIsShowingSequence(false);
      }, 2000);
    }
  };

  const finishShiftSuccessfully = (performanceBonus: number) => {
    setIsShiftActive(false);
    setCooldowns(prev => ({ ...prev, [selectedJob.id]: selectedJob.cooldownSeconds }));
    
    const newStreak = shiftStreak + 1;
    setShiftStreak(newStreak);
    const streakBonus = 1 + (newStreak * 0.05);
    const totalRatio = performanceBonus * streakBonus;

    completeJobShift(selectedJob.id, totalRatio);
  };

  const handleMinigameTimeout = () => {
    setIsShiftActive(false);
    sounds.playLoss();
    setShiftStreak(0);
    addToast('Op Failed', 'Mission timer expired! Neural connection severed.', 'danger');
  };

  const handleWaypointClick = (index: number) => {
    if (index !== currentWaypointIdx) return;
    sounds.playCoin();
    const updated = [...waypoints];
    updated[index].clicked = true;
    setWaypoints(updated);

    if (index + 1 >= waypoints.length) {
      const timeRemainingBonus = 1 + (gameTimeLeft / 10) * 0.4;
      finishShiftSuccessfully(timeRemainingBonus);
    } else {
      setCurrentWaypointIdx(index + 1);
    }
  };

  const handleBrokerBuy = () => {
    if (brokerBoughtAt !== null) return;
    sounds.playClick();
    setBrokerBoughtAt(brokerPrice);
    addToast('Order Executed', `Bought at $CRED ${brokerPrice}`, 'info');
  };

  const handleBrokerSell = () => {
    if (brokerBoughtAt === null) return;
    const profitRatio = brokerPrice / brokerBoughtAt;
    if (profitRatio > 1) {
      sounds.playWin();
      finishShiftSuccessfully(profitRatio);
    } else {
      sounds.playLoss();
      finishShiftSuccessfully(Math.max(0.4, profitRatio));
    }
  };

  const handleTechInput = (btnIndex: number) => {
    if (isShowingSequence) return;
    sounds.playClick();
    const nextSeq = [...playerSequence, btnIndex];
    setPlayerSequence(nextSeq);

    const step = nextSeq.length - 1;
    if (techSequence[step] !== btnIndex) {
      sounds.playLoss();
      addToast('ICE Alarm Triggered!', 'Incorrect encryption sequence compiled.', 'danger');
      setPlayerSequence([]);
      return;
    }

    if (nextSeq.length === techSequence.length) {
      sounds.playWin();
      finishShiftSuccessfully(1.35);
    }
  };

  const currentTiers = CAREER_TIERS.filter(j => j.type === activeType);

  return (
    <div className="space-y-6">
      
      {/* Top Cyber Mission Briefing Banner */}
      <div className="clip-cyber-corner bg-[#070c18] border border-[#00f0ff]/40 p-5 shadow-neon-cyan flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-[#00f0ff] animate-pulse" />
            <h2 className="font-display text-lg font-bold text-white tracking-wider">
              CYBER GIG OPERATIONS &amp; CONTRACT MISSIONS
            </h2>
          </div>
          <p className="mt-1 text-xs font-hud text-slate-300 max-w-2xl">
            Execute tactical gig runs to earn immediate $CRED chip payouts and Neural XP.
            Maintain unbroken mission streaks for compounding performance multipliers.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#03060d] border border-[#00f0ff]/30 clip-cyber-corner-sm px-4 py-2.5">
          <div>
            <div className="text-[9px] uppercase font-mono text-slate-400">Streak Combo</div>
            <div className="font-mono-nums text-base font-black text-[#fcee0a] flex items-center gap-1.5 text-glow-yellow">
              <Zap className="h-4 w-4 text-[#fcee0a]" />
              {shiftStreak} OP{shiftStreak !== 1 ? 'S' : ''} ({shiftStreak > 0 ? `+${shiftStreak * 5}%` : '1.0x'})
            </div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <div className="text-[9px] uppercase font-mono text-slate-400">Cyber Rank &amp; Tier</div>
            <div className="font-mono-nums text-sm font-bold text-[#00ff66] flex items-center gap-1.5">
              <span>LVL {profile.level}</span>
              <span className="text-white/40">&bull;</span>
              <span className="text-cyan-300 font-mono text-xs">{profile.xp}/{requiredXP} XP</span>
            </div>
            <div className="text-[10px] text-cyan-400 font-mono">
              {currentRankData.title}
            </div>
          </div>
        </div>
      </div>

      {/* Career Discipline Tabs */}
      <div className="flex items-center gap-2 border-b border-[#00f0ff]/20 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => { sounds.playClick(); setActiveType('courier'); }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold tracking-wider clip-cyber-corner-sm transition ${
            activeType === 'courier'
              ? 'bg-[#00f0ff] text-black shadow-neon-cyan font-black'
              : 'text-slate-400 hover:text-white bg-[#070c18] border border-white/5'
          }`}
        >
          <Crosshair className="h-3.5 w-3.5" />
          <span>// 01. DRONE SMUGGLING</span>
        </button>

        <button
          onClick={() => { sounds.playClick(); setActiveType('broker'); }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold tracking-wider clip-cyber-corner-sm transition ${
            activeType === 'broker'
              ? 'bg-[#fcee0a] text-black shadow-neon-yellow font-black'
              : 'text-slate-400 hover:text-white bg-[#070c18] border border-white/5'
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span>// 02. PRICE ARBITRAGE MATRIX</span>
        </button>

        <button
          onClick={() => { sounds.playClick(); setActiveType('tech'); }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold tracking-wider clip-cyber-corner-sm transition ${
            activeType === 'tech'
              ? 'bg-[#ff0055] text-white shadow-neon-magenta font-black'
              : 'text-slate-400 hover:text-white bg-[#070c18] border border-white/5'
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>// 03. NEURAL ICE BREACH</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* INTERACTIVE MINIGAME HUD MODAL / STAGE */}
      {/* ------------------------------------------------------------------ */}
      {isShiftActive && (
        <div className="clip-cyber-corner bg-[#040813] border-2 border-[#00f0ff] p-6 shadow-neon-cyan animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-[#00f0ff]/30 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff0055] animate-ping" />
              <h3 className="font-display font-black text-white text-base tracking-wider text-glow-cyan">
                {selectedJob.title.toUpperCase()} // ACTIVE MISSION RUN
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#fcee0a]">
              <Clock className="h-4 w-4 animate-spin text-[#fcee0a]" />
              <span>TIMER: 00:{gameTimeLeft.toString().padStart(2, '0')}</span>
            </div>
          </div>

          {/* GAME 1: COURIER RADAR WAYPOINTS */}
          {selectedJob.type === 'courier' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span>INTERCEPT RADAR WAYPOINTS IN SEQUENTIAL ORDER (1 → 4):</span>
                <span className="text-[#00f0ff] font-bold">NEXT TARGET: NODE #{currentWaypointIdx + 1}</span>
              </div>

              {/* Radar Grid Field */}
              <div className="relative h-64 w-full bg-[#020408] border border-[#00f0ff]/40 overflow-hidden bg-cyber-grid">
                {/* Radar sweep line */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00f0ff]/10 to-transparent pointer-events-none animate-pulse" />
                
                {/* Center crosshair */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-[#00f0ff]/20 pointer-events-none" />
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#00f0ff]/20 pointer-events-none" />

                {waypoints.map((wp, idx) => {
                  const isCurrent = idx === currentWaypointIdx;
                  return (
                    <button
                      key={wp.id}
                      onClick={() => handleWaypointClick(idx)}
                      disabled={wp.clicked || !isCurrent}
                      style={{ top: `${wp.y}%`, left: `${wp.x}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 h-10 w-10 clip-cyber-corner-sm flex items-center justify-center font-mono font-black text-xs transition-all ${
                        wp.clicked
                          ? 'bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66]'
                          : isCurrent
                          ? 'bg-[#fcee0a] text-black border-2 border-white shadow-neon-yellow scale-110 cursor-pointer animate-bounce'
                          : 'bg-[#0a1424] border border-white/20 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {wp.clicked ? '✓' : idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* GAME 2: BROKER PRICE ARBITRAGE */}
          {selectedJob.type === 'broker' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">BUY AT DIP, SELL AT PEAK BEFORE EXPIRY:</span>
                <span className="text-[#fcee0a] font-bold">
                  {brokerBoughtAt ? `BOUGHT AT: $CRED ${brokerBoughtAt}` : 'POSITION: FLAT'}
                </span>
              </div>

              {/* Price Graph Simulation */}
              <div className="h-44 bg-[#020408] border border-[#fcee0a]/40 p-3 flex flex-col justify-between">
                <div className="flex items-baseline justify-between">
                  <div className="font-mono-nums text-4xl font-black text-white text-glow-yellow">
                    $CRED {brokerPrice}
                  </div>
                  {brokerBoughtAt && (
                    <div className={`font-mono font-bold text-sm ${brokerPrice >= brokerBoughtAt ? 'text-[#00ff66]' : 'text-[#ff0055]'}`}>
                      {brokerPrice >= brokerBoughtAt ? '+' : ''}{(((brokerPrice - brokerBoughtAt) / brokerBoughtAt) * 100).toFixed(1)}% PnL
                    </div>
                  )}
                </div>

                {/* Simulated Candlestick Bar Strip */}
                <div className="h-20 flex items-end gap-2 pt-2 border-b border-white/10">
                  {brokerHistory.map((p, i) => {
                    const hHeight = Math.max(10, Math.min(100, Math.floor(((p - 50) / 130) * 100)));
                    const isUp = i > 0 ? p >= brokerHistory[i - 1] : true;
                    return (
                      <div
                        key={i}
                        style={{ height: `${hHeight}%` }}
                        className={`flex-1 transition-all duration-300 ${isUp ? 'bg-[#00ff66] shadow-neon-green' : 'bg-[#ff0055]'}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Buy / Sell Action Controls */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleBrokerBuy}
                  disabled={brokerBoughtAt !== null}
                  className={`py-3 clip-cyber-corner-sm font-mono font-black text-xs uppercase tracking-wider transition ${
                    brokerBoughtAt === null
                      ? 'bg-[#00ff66] hover:bg-[#00ff66]/90 text-black shadow-neon-green cursor-pointer'
                      : 'bg-slate-900 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  BUY LONG POSITION ($CRED {brokerPrice})
                </button>
                <button
                  onClick={handleBrokerSell}
                  disabled={brokerBoughtAt === null}
                  className={`py-3 clip-cyber-corner-sm font-mono font-black text-xs uppercase tracking-wider transition ${
                    brokerBoughtAt !== null
                      ? 'bg-[#ff0055] hover:bg-[#ff0055]/90 text-white shadow-neon-magenta cursor-pointer'
                      : 'bg-slate-900 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  DUMP &amp; CLOSE ORDER
                </button>
              </div>
            </div>
          )}

          {/* GAME 3: TECH ICE-BREAKER SEQUENCE */}
          {selectedJob.type === 'tech' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">
                  {isShowingSequence ? 'MEMORIZE NEURAL ENCRYPTION PATTERN...' : 'ENTER CIPHER SEQUENCE KEYPAD:'}
                </span>
                <span className="text-[#ff0055] font-bold">
                  PROGRESS: {playerSequence.length} / {techSequence.length}
                </span>
              </div>

              {/* Memory Flash Display */}
              <div className="p-4 bg-[#020408] border border-[#ff0055]/40 text-center font-mono">
                {isShowingSequence ? (
                  <div className="flex items-center justify-center gap-2">
                    {techSequence.map((step, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-[#ff0055] text-white font-black text-xs clip-cyber-corner-sm shadow-neon-magenta animate-pulse"
                      >
                        {TECH_BUTTONS[step]}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    {techSequence.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-8 w-12 clip-cyber-corner-sm border flex items-center justify-center text-xs font-bold ${
                          idx < playerSequence.length
                            ? 'bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66]'
                            : 'border-white/20 text-slate-600'
                        }`}
                      >
                        {idx < playerSequence.length ? 'OK' : '•'}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 4 Interactive Code Keypad Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TECH_BUTTONS.map((label, idx) => (
                  <button
                    key={label}
                    onClick={() => handleTechInput(idx)}
                    disabled={isShowingSequence}
                    className="py-3 clip-cyber-corner-sm bg-[#081226] border border-[#00f0ff]/30 hover:border-[#00f0ff] hover:bg-[#00f0ff]/20 text-[#00f0ff] font-mono text-xs font-bold transition shadow-sm"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
            <button
              onClick={() => setIsShiftActive(false)}
              className="px-4 py-1.5 clip-cyber-corner-sm bg-rose-950/40 border border-rose-800 text-rose-300 font-mono text-xs"
            >
              ABORT OPERATION
            </button>
          </div>
        </div>
      )}

      {/* Career Tier Catalog List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {currentTiers.map(job => {
          const isLocked = profile.xp < job.requiredXp || computedNetWorth < job.requiredNetWorth;
          const currentCooldown = cooldowns[job.id] || 0;
          const onCooldown = currentCooldown > 0;

          return (
            <div
              key={job.id}
              className={`clip-cyber-corner bg-[#070c18] p-5 border flex flex-col justify-between transition-all ${
                isLocked
                  ? 'border-white/5 opacity-60'
                  : 'border-[#00f0ff]/30 hover:border-[#00f0ff] shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-0.5 border border-[#00f0ff]/20">
                    CLEARANCE TIER // {job.name.toUpperCase()}
                  </span>
                  {isLocked && (
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 border border-rose-800 flex items-center gap-1">
                      <Lock className="h-3 w-3" /> LOCKED
                    </span>
                  )}
                </div>

                <h3 className="mt-2.5 text-base font-display font-bold text-white">
                  {job.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400 min-h-[36px]">
                  {job.description}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 bg-[#03060d] p-2.5 border border-white/5 font-mono text-xs">
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase">Base Payout</div>
                    <div className="font-bold text-[#00ff66]">
                      +{formatCash(job.basePayout)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase">Neural XP</div>
                    <div className="font-bold text-[#fcee0a]">
                      +{job.xpReward} XP
                    </div>
                  </div>
                </div>

                {isLocked && (
                  <div className="mt-3 text-[10px] font-mono text-rose-400 bg-rose-950/30 p-2 border border-rose-900/40 space-y-0.5">
                    <div>Req. XP: {job.requiredXp} (Current: {profile.xp})</div>
                    <div>Req. Net Worth: {formatCash(job.requiredNetWorth)}</div>
                  </div>
                )}
              </div>

              <div className="mt-5">
                <button
                  onClick={() => startShift(job)}
                  disabled={isLocked || onCooldown || isShiftActive}
                  className={`w-full py-2.5 clip-cyber-corner-sm text-xs font-mono font-black uppercase tracking-wider transition ${
                    isLocked || isShiftActive
                      ? 'bg-slate-900 text-slate-500 border border-white/5 cursor-not-allowed'
                      : onCooldown
                      ? 'bg-amber-950/40 border border-amber-800/40 text-amber-400 cursor-wait'
                      : 'bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black shadow-neon-cyan cursor-pointer'
                  }`}
                >
                  {onCooldown
                    ? `COOLING DOWN (${currentCooldown}S)`
                    : isLocked
                    ? 'CLEARANCE DENIED'
                    : 'INITIALIZE OPERATION RUN'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
