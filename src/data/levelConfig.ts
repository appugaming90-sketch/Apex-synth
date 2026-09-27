/* ==========================================================================
   APEX ECONOMY ENGINE - ADVANCED LEVEL & XP SYSTEM
   ========================================================================== */

export interface PlayerRank {
  minLevel: number;
  title: string;
  perk: string;
  bonus: number;
}

export interface LevelConfig {
  baseXP: number;
  exponent: number;
  ranks: PlayerRank[];
}

// 1. LEVEL CONFIGURATION & RANKS
export const LEVEL_CONFIG: LevelConfig = {
  baseXP: 100,
  exponent: 1.4,
  ranks: [
    { minLevel: 1,  title: "Street Hustler",       perk: "Base Level",               bonus: 1.0 },
    { minLevel: 5,  title: "District Operator",    perk: "+5% Global Revenue",       bonus: 1.05 },
    { minLevel: 10, title: "Syndicate Broker",     perk: "+10% Career Rewards",      bonus: 1.10 },
    { minLevel: 20, title: "Corporate Executive",  perk: "-10% Build Costs",         bonus: 1.15 },
    { minLevel: 35, title: "Apex Tycoon",          perk: "+25% Global Revenue",       bonus: 1.25 },
    { minLevel: 50, title: "Syndicate Sovereign", perk: "Prestige Unlocked (+100%)", bonus: 2.0 }
  ]
};

// 2. XP CALCULATION HELPERS
export function getRequiredXP(level: number): number {
  return Math.floor(LEVEL_CONFIG.baseXP * Math.pow(level, LEVEL_CONFIG.exponent));
}

export function getRankData(level: number): PlayerRank {
  let currentRank = LEVEL_CONFIG.ranks[0];
  for (const rank of LEVEL_CONFIG.ranks) {
    if (level >= rank.minLevel) {
      currentRank = rank;
    }
  }
  return currentRank;
}

// Cumulative XP calculation helper for total progression tracking
export function getTotalXP(level: number, currentXp: number): number {
  let total = currentXp;
  for (let l = 1; l < level; l++) {
    total += getRequiredXP(l);
  }
  return total;
}

// 4. LEVEL-UP NOTIFICATION TOAST
export function showLevelUpNotification(level: number, title: string, gems: number): void {
  if (typeof document === 'undefined') return;

  const toast = document.createElement('div');
  toast.className = 'fixed top-16 left-1/2 -translate-x-1/2 z-50 glass-panel px-6 py-4 rounded-xl border border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.5)] flex flex-col items-center animate-bounce';
  toast.innerHTML = `
    <div class="font-orbitron font-black text-xl text-cyan-400 tracking-wider">LEVEL UP! [Lvl ${level}]</div>
    <div class="text-xs text-fuchsia-400 font-bold uppercase tracking-widest mt-1">${title}</div>
    <div class="text-[11px] text-gray-300 mt-2 flex items-center gap-2">
      <span>REWARD:</span>
      <span class="text-fuchsia-400 font-bold">💎 +${gems} GEMS</span>
    </div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}
