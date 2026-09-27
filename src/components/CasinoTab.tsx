import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';
import { formatCash, formatCompactNumber } from '../utils/format';
import {
  Dices,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

const SLOT_SYMBOLS = ['💎', '🍒', '⚡', '👑', '7️⃣'];

export const CasinoTab: React.FC = () => {
  const { profile, applyGamblingResult, addXP, addToast } = useGame();

  const [activeCasinoTab, setActiveCasinoTab] = useState<'slots' | 'hilow' | 'crash'>('slots');

  // ==========================================
  // LEVEL-BASED DYNAMIC CASINO WAGERING SYSTEM
  // Formula: Max Bet Cap = (Player Level * 5,000)
  // ==========================================
  const maxBetCap = Math.max(100, (profile.level || 1) * 5000);
  const playerCash = Math.floor(profile.cash);
  const maxAllowedWager = Math.max(10, Math.min(playerCash, maxBetCap));

  // Shared dynamic wager with intelligent initial clamping
  const [wager, setWager] = useState<number>(() => Math.min(100, maxAllowedWager));

  // Ensure wager stays within bounds if level or cash drops
  useEffect(() => {
    if (wager > maxAllowedWager) {
      setWager(Math.max(10, maxAllowedWager));
    }
  }, [maxAllowedWager, wager]);

  const handleSetPercentage = (pct: number) => {
    sounds.playClick();
    if (playerCash <= 0) {
      setWager(10);
      return;
    }
    const computed = Math.max(10, Math.floor(maxAllowedWager * pct));
    setWager(computed);
  };

  const renderWagerControls = (accentColor: 'fuchsia' | 'cyan' | 'emerald') => {
    const isFuchsia = accentColor === 'fuchsia';
    const isCyan = accentColor === 'cyan';

    const activeColorClass = isFuchsia
      ? 'border-fuchsia-400 text-fuchsia-300 bg-fuchsia-950/60'
      : isCyan
      ? 'border-cyan-400 text-cyan-300 bg-cyan-950/60'
      : 'border-emerald-400 text-emerald-300 bg-emerald-950/60';

    const sliderThumbClass = isFuchsia
      ? 'accent-fuchsia-500'
      : isCyan
      ? 'accent-cyan-500'
      : 'accent-emerald-500';

    return (
      <div className="glass-panel p-3.5 rounded-xl border border-gray-800 my-4 text-left">
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="text-[10px] font-orbitron text-gray-400 uppercase tracking-wider block">
              DYNAMIC LEVEL-BASED WAGER
            </span>
            <span className="text-xs font-mono text-gray-500">
              Level {profile.level} Cap: {formatCash(maxBetCap)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-gray-400">BET AMOUNT</span>
            <div className={`font-orbitron font-bold text-base ${isFuchsia ? 'text-fuchsia-400' : isCyan ? 'text-cyan-400' : 'text-emerald-400'}`}>
              {formatCash(wager)}
            </div>
          </div>
        </div>

        {/* Wager Slider */}
        <div className="my-2">
          <input
            id="wager-slider"
            type="range"
            min={10}
            max={Math.max(10, maxAllowedWager)}
            step={Math.max(10, Math.floor(maxAllowedWager / 100))}
            value={wager}
            onChange={(e) => setWager(Number(e.target.value))}
            className={`w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer ${sliderThumbClass}`}
          />
          <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
            <span>$10</span>
            <span>Max Cap: {formatCash(maxAllowedWager)}</span>
          </div>
        </div>

        {/* Percentage Selection Controls ([25%], [50%], [MAX]) */}
        <div className="flex gap-2 mt-2">
          <button
            id="btn-wager-25"
            type="button"
            onClick={() => handleSetPercentage(0.25)}
            className="flex-1 py-1.5 rounded-lg border border-gray-800 bg-gray-900/60 hover:border-gray-600 text-xs font-mono text-gray-300 font-bold transition"
          >
            25%
          </button>
          <button
            id="btn-wager-50"
            type="button"
            onClick={() => handleSetPercentage(0.50)}
            className="flex-1 py-1.5 rounded-lg border border-gray-800 bg-gray-900/60 hover:border-gray-600 text-xs font-mono text-gray-300 font-bold transition"
          >
            50%
          </button>
          <button
            id="btn-wager-max"
            type="button"
            onClick={() => handleSetPercentage(1.0)}
            className={`flex-1 py-1.5 rounded-lg border text-xs font-orbitron font-bold transition ${activeColorClass}`}
          >
            MAX
          </button>
        </div>
      </div>
    );
  };

  // ==========================================
  // 1. NEON SLOTS ENGINE
  // ==========================================
  const [reel1, setReel1] = useState<string>('💎');
  const [reel2, setReel2] = useState<string>('💎');
  const [reel3, setReel3] = useState<string>('💎');
  const [isSpinningSlots, setIsSpinningSlots] = useState<boolean>(false);
  const [slotMessage, setSlotMessage] = useState<string | null>(null);

  const handleSpinSlots = () => {
    if (isSpinningSlots) return;
    if (profile.cash < wager) {
      sounds.playError();
      addToast('Insufficient Credits', 'Not enough cash for this slot spin!', 'danger');
      return;
    }

    setIsSpinningSlots(true);
    setSlotMessage(null);
    sounds.playCardFlip();

    let spins = 0;
    const interval = setInterval(() => {
      setReel1(SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
      setReel2(SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
      setReel3(SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
      spins++;

      if (spins >= 10) {
        clearInterval(interval);
        const r1 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
        const r2 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
        const r3 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];

        setReel1(r1);
        setReel2(r2);
        setReel3(r3);
        setIsSpinningSlots(false);

        if (r1 === r2 && r2 === r3) {
          const win = wager * 10;
          sounds.playWin();
          applyGamblingResult(wager, win, 'Neon Slots [TRIPLE JACKPOT]');
          addXP(100);
          try { confetti(); } catch {}
          setSlotMessage(`JACKPOT TRIPLE! Won $${win.toLocaleString()} (+100 XP)`);
          addToast('JACKPOT TRIPLE!', `Won $${win.toLocaleString()} on Neon Slots!`, 'success', win);
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
          const win = wager * 2;
          sounds.playCash();
          applyGamblingResult(wager, win, 'Neon Slots [PAIR MATCH]');
          addXP(25);
          setSlotMessage(`PAIR MATCH! Won $${win.toLocaleString()} (+25 XP)`);
          addToast('Pair Match!', `Won $${win.toLocaleString()} on Neon Slots!`, 'success', win);
        } else {
          sounds.playError();
          applyGamblingResult(wager, 0, 'Neon Slots');
          setSlotMessage('No match. Better luck next spin!');
        }
      }
    }, 80);
  };

  // ==========================================
  // 2. HIGH-LOW CARDS ENGINE
  // ==========================================
  const [currentCard, setCurrentCard] = useState<number>(7);
  const [hiLowStreak, setHiLowStreak] = useState<number>(1.5);
  const [hiLowFeedback, setHiLowFeedback] = useState<string | null>(null);

  const getCardDisplay = (cardVal: number) => {
    if (cardVal === 1) return 'A';
    if (cardVal === 11) return 'J';
    if (cardVal === 12) return 'Q';
    if (cardVal === 13) return 'K';
    return String(cardVal);
  };

  const handleDrawCard = (prediction: 'higher' | 'lower') => {
    if (profile.cash < wager) {
      sounds.playError();
      addToast('Insufficient Credits', `Not enough credits for $${wager.toLocaleString()} High-Low wager!`, 'danger');
      return;
    }

    const nextCard = Math.floor(Math.random() * 13) + 1; // 1-13
    const won =
      (prediction === 'higher' && nextCard >= currentCard) ||
      (prediction === 'lower' && nextCard <= currentCard);

    setCurrentCard(nextCard);

    if (won) {
      const payout = Math.floor(wager * hiLowStreak);
      sounds.playCash();
      applyGamblingResult(wager, payout, `High-Low [${prediction.toUpperCase()} won at ${hiLowStreak}x]`);
      addXP(30);
      const nextStreak = parseFloat((hiLowStreak + 0.5).toFixed(1));
      setHiLowStreak(nextStreak);
      setHiLowFeedback(`CORRECT! Won $${payout.toLocaleString()}! Next Streak: ${nextStreak}x`);
      addToast('Card Won!', `Drawn ${getCardDisplay(nextCard)} - Won $${payout.toLocaleString()}!`, 'success', payout);
    } else {
      sounds.playError();
      applyGamblingResult(wager, 0, `High-Low [${prediction.toUpperCase()} lost]`);
      setHiLowStreak(1.5);
      setHiLowFeedback(`MISSED! Card was ${getCardDisplay(nextCard)}. Streak reset.`);
      addToast('Card Missed', `Card was ${getCardDisplay(nextCard)}. Wager lost.`, 'danger');
    }
  };

  // ==========================================
  // 3. MATRIX CRASH ENGINE
  // ==========================================
  const [crashActive, setCrashActive] = useState<boolean>(false);
  const [crashMult, setCrashMult] = useState<number>(1.0);
  const [crashStatus, setCrashStatus] = useState<'idle' | 'running' | 'crashed' | 'cashed'>('idle');
  const [recentCrashes, setRecentCrashes] = useState<number[]>([1.85, 2.40, 1.15, 4.50, 1.32, 7.80]);

  const crashIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const crashPointRef = useRef<number>(2.0);

  useEffect(() => {
    return () => {
      if (crashIntervalRef.current) clearInterval(crashIntervalRef.current);
    };
  }, []);

  const handleToggleCrash = () => {
    if (!crashActive) {
      // Start run
      if (profile.cash < wager) {
        sounds.playError();
        addToast('Insufficient Credits', 'Not enough liquid credits for Matrix Crash!', 'danger');
        return;
      }

      sounds.playCardFlip();
      setCrashActive(true);
      setCrashStatus('running');
      setCrashMult(1.0);

      // Determine crash point
      const cp = parseFloat((Math.random() * 4.5 + 1.15).toFixed(2));
      crashPointRef.current = cp;

      let cur = 1.0;
      crashIntervalRef.current = setInterval(() => {
        cur = parseFloat((cur + 0.05).toFixed(2));
        setCrashMult(cur);

        if (cur >= cp) {
          if (crashIntervalRef.current) clearInterval(crashIntervalRef.current);
          setCrashActive(false);
          setCrashStatus('crashed');
          sounds.playError();
          applyGamblingResult(wager, 0, `Matrix Crash [Collapsed at ${cp.toFixed(2)}x]`);
          setRecentCrashes(prev => [cp, ...prev.slice(0, 5)]);
          addToast('Matrix Crashed!', `Collapsed at ${cp.toFixed(2)}x. Lost $${wager.toLocaleString()}.`, 'danger');
        }
      }, 100);
    } else {
      // Cash out
      if (crashIntervalRef.current) clearInterval(crashIntervalRef.current);
      setCrashActive(false);
      setCrashStatus('cashed');
      const payout = Math.floor(wager * crashMult);
      sounds.playCash();
      applyGamblingResult(wager, payout, `Matrix Crash [Cashed out at ${crashMult.toFixed(2)}x]`);
      addXP(50);
      setRecentCrashes(prev => [crashMult, ...prev.slice(0, 5)]);
      try { confetti(); } catch {}
      addToast('Cashed Out!', `Secured $${payout.toLocaleString()} at ${crashMult.toFixed(2)}x!`, 'success', payout);
    }
  };

  return (
    <section id="tab-casino" className="w-full h-full p-4 sm:p-6 overflow-y-auto max-w-4xl mx-auto select-none">
      {/* CASINO SUBTABS HEADER */}
      <div className="flex gap-4 border-b border-gray-800 pb-3 mb-6 justify-center">
        <button
          id="casino-tab-slots"
          onClick={() => {
            sounds.playClick();
            setActiveCasinoTab('slots');
          }}
          className={`px-4 py-2 font-orbitron font-bold text-xs transition border-b-2 ${
            activeCasinoTab === 'slots'
              ? 'text-fuchsia-400 border-fuchsia-400'
              : 'text-gray-400 border-transparent hover:text-fuchsia-400'
          }`}
        >
          NEON SLOTS
        </button>
        <button
          id="casino-tab-hilow"
          onClick={() => {
            sounds.playClick();
            setActiveCasinoTab('hilow');
          }}
          className={`px-4 py-2 font-orbitron font-bold text-xs transition border-b-2 ${
            activeCasinoTab === 'hilow'
              ? 'text-cyan-400 border-cyan-400'
              : 'text-gray-400 border-transparent hover:text-cyan-400'
          }`}
        >
          HIGH-LOW CARDS
        </button>
        <button
          id="casino-tab-crash"
          onClick={() => {
            sounds.playClick();
            setActiveCasinoTab('crash');
          }}
          className={`px-4 py-2 font-orbitron font-bold text-xs transition border-b-2 ${
            activeCasinoTab === 'crash'
              ? 'text-emerald-400 border-emerald-400'
              : 'text-gray-400 border-transparent hover:text-emerald-400'
          }`}
        >
          MATRIX CRASH
        </button>
      </div>

      {/* CASINO GAME 1: NEON SLOTS */}
      {activeCasinoTab === 'slots' && (
        <div id="casino-game-slots" className="glass-card p-6 rounded-xl border border-fuchsia-500/30 text-center max-w-lg mx-auto">
          <h3 className="font-orbitron text-lg font-bold text-fuchsia-400 mb-2">CYBERNEON SLOTS</h3>
          <p className="text-xs text-gray-400 mb-4">Match 3 for 10x Jackpot, match 2 for 2x Payout.</p>

          <div className="flex justify-center gap-4 my-6">
            <div
              id="reel-1"
              className="slot-reel w-20 h-24 rounded-lg flex items-center justify-center text-4xl font-orbitron bg-black/60 border border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.3)] transition-transform"
            >
              {reel1}
            </div>
            <div
              id="reel-2"
              className="slot-reel w-20 h-24 rounded-lg flex items-center justify-center text-4xl font-orbitron bg-black/60 border border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.3)] transition-transform"
            >
              {reel2}
            </div>
            <div
              id="reel-3"
              className="slot-reel w-20 h-24 rounded-lg flex items-center justify-center text-4xl font-orbitron bg-black/60 border border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.3)] transition-transform"
            >
              {reel3}
            </div>
          </div>

          {/* DYNAMIC WAGER CONTROLS FOR SLOTS */}
          {renderWagerControls('fuchsia')}

          {slotMessage && (
            <div className="mb-4 text-xs font-orbitron text-yellow-300 animate-pulse">
              {slotMessage}
            </div>
          )}

          <button
            id="btn-spin-slots"
            onClick={handleSpinSlots}
            disabled={isSpinningSlots}
            className="w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 font-orbitron font-bold text-xs text-white rounded-lg transition-all shadow-[0_0_15px_rgba(217,70,239,0.4)]"
          >
            {isSpinningSlots ? 'SPINNING REELS...' : `SPIN REELS (${formatCash(wager)})`}
          </button>
        </div>
      )}

      {/* CASINO GAME 2: HIGH-LOW CARDS */}
      {activeCasinoTab === 'hilow' && (
        <div id="casino-game-hilow" className="glass-card p-6 rounded-xl border border-cyan-500/30 text-center max-w-lg mx-auto">
          <h3 className="font-orbitron text-lg font-bold text-cyan-400 mb-2">HOLOGRAPHIC HIGH-LOW</h3>
          <p className="text-xs text-gray-300 mb-4">Predict if the next card drawn is HIGHER or LOWER.</p>

          <div
            className="w-28 h-36 mx-auto my-4 glass-card border-2 border-cyan-400 rounded-xl flex items-center justify-center text-4xl font-bold font-orbitron text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] bg-cyan-950/40"
            id="hilow-card"
          >
            {getCardDisplay(currentCard)}
          </div>

          {hiLowFeedback && (
            <p className="text-xs font-mono text-cyan-300 my-2">{hiLowFeedback}</p>
          )}

          {/* DYNAMIC WAGER CONTROLS FOR HIGH-LOW */}
          {renderWagerControls('cyan')}

          <div className="flex justify-center gap-4 my-4">
            <button
              id="btn-hilow-higher"
              onClick={() => handleDrawCard('higher')}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 font-orbitron font-bold text-xs text-white rounded-lg transition shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            >
              HIGHER ▲
            </button>
            <button
              id="btn-hilow-lower"
              onClick={() => handleDrawCard('lower')}
              className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 font-orbitron font-bold text-xs text-white rounded-lg transition shadow-[0_0_12px_rgba(244,63,94,0.3)]"
            >
              LOWER ▼
            </button>
          </div>

          <div className="text-xs font-mono text-gray-300">
            WAGER: {formatCash(wager)} | POT MULTIPLIER:{' '}
            <span id="hilow-streak" className="text-cyan-400 font-bold">
              {hiLowStreak}x
            </span>
          </div>
        </div>
      )}

      {/* CASINO GAME 3: MATRIX CRASH */}
      {activeCasinoTab === 'crash' && (
        <div id="casino-game-crash" className="glass-card p-6 rounded-xl border border-emerald-500/30 text-center max-w-lg mx-auto">
          <h3 className="font-orbitron text-lg font-bold text-emerald-400 mb-2">MATRIX CRASH ENGINE</h3>
          <p className="text-xs text-gray-300 mb-4">Cash out before the live multiplier matrix collapses!</p>

          <div
            className={`text-5xl font-orbitron font-extrabold my-8 transition-colors ${
              crashStatus === 'crashed'
                ? 'text-rose-500 animate-pulse'
                : crashActive
                ? 'text-cyan-400'
                : 'text-emerald-400'
            }`}
            id="crash-multiplier"
          >
            {crashMult.toFixed(2)}x
          </div>

          {/* Recent crash multiplier tags */}
          <div className="flex items-center justify-center gap-2 mb-4 overflow-x-auto">
            <span className="text-[10px] text-gray-500 font-mono">HISTORY:</span>
            {recentCrashes.map((val, idx) => (
              <span
                key={idx}
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  val >= 2.0
                    ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/50'
                    : 'text-rose-400 border-rose-500/40 bg-rose-950/50'
                }`}
              >
                {val.toFixed(2)}x
              </span>
            ))}
          </div>

          {/* DYNAMIC WAGER CONTROLS FOR MATRIX CRASH */}
          {!crashActive && renderWagerControls('emerald')}

          <button
            id="btn-start-crash"
            onClick={handleToggleCrash}
            className={`w-full py-3 font-orbitron font-bold text-xs text-white rounded-lg transition-all ${
              crashActive
                ? 'bg-amber-600 hover:bg-amber-500 shadow-[0_0_20px_rgba(217,119,6,0.5)] animate-pulse'
                : crashStatus === 'crashed'
                ? 'bg-rose-700 hover:bg-rose-600'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            }`}
          >
            {crashActive
              ? `CASH OUT (${formatCash(Math.floor(wager * crashMult))})`
              : crashStatus === 'crashed'
              ? `CRASHED! RESTART RUN (${formatCash(wager)} WAGER)`
              : `START RUN (${formatCash(wager)} WAGER)`}
          </button>
        </div>
      )}
    </section>
  );
};
