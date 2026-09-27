import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';
import { formatCash, formatCompactNumber } from '../utils/format';
import {
  fetchSyndicateLeaderboard,
  LeaderboardPlayer,
  LeaderboardCategory
} from '../data/leaderboardData';
import {
  Trophy,
  Crown,
  Medal,
  Coins,
  Sparkles,
  Search,
  RefreshCw,
  Eye,
  Shield,
  Zap,
  X,
  Building,
  Radio
} from 'lucide-react';

export const SyndicateLeaderboard: React.FC = () => {
  const { profile, computedNetWorth } = useGame();

  const [category, setCategory] = useState<LeaderboardCategory>('netWorth');
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpectatePlayer, setSelectedSpectatePlayer] = useState<LeaderboardPlayer | null>(null);

  // Fetch leaderboard data when category changes
  const loadLeaderboard = async (cat: LeaderboardCategory) => {
    setIsLoading(true);
    try {
      const data = await fetchSyndicateLeaderboard(cat);
      setPlayers(data);
    } catch (err) {
      console.error('Failed to fetch syndicate leaderboard', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard(category);
  }, [category]);

  // Merge the user into the leaderboard display based on current metrics
  const playerBuildingCount = profile.baseBuildings?.length || 1;
  const playerGems = profile.gems ?? 10;

  const currentPlayerAsEntry: LeaderboardPlayer = useMemo(() => ({
    id: 'current_user',
    username: `${profile.username || 'Syndicate Agent'} (YOU)`,
    rankTitle: profile.title || 'Street Hustler',
    level: profile.level || 1,
    netWorth: computedNetWorth,
    gems: playerGems,
    buildingsCount: playerBuildingCount,
    clout: profile.prestige || 0,
    badge: '⚡ Operative',
    isOnline: true,
    avatarChar: 'Ω'
  }), [profile, computedNetWorth, playerBuildingCount, playerGems]);

  // Combined and sorted list including current player
  const sortedList = useMemo(() => {
    const combined = [...players, currentPlayerAsEntry];

    combined.sort((a, b) => {
      if (category === 'netWorth') return b.netWorth - a.netWorth;
      if (category === 'level') return b.level - a.level;
      if (category === 'gems') return b.gems - a.gems;
      if (category === 'buildings') return b.buildingsCount - a.buildingsCount;
      return b.netWorth - a.netWorth;
    });

    if (!searchQuery.trim()) return combined;

    const q = searchQuery.toLowerCase();
    return combined.filter(
      p =>
        p.username.toLowerCase().includes(q) ||
        p.rankTitle.toLowerCase().includes(q) ||
        p.badge.toLowerCase().includes(q)
    );
  }, [players, currentPlayerAsEntry, category, searchQuery]);

  // Current user's rank position in the whole list
  const userRankIndex = useMemo(() => {
    const idx = sortedList.findIndex(p => p.id === 'current_user');
    return idx >= 0 ? idx + 1 : null;
  }, [sortedList]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER & TELEMETRY */}
      <div className="glass-panel p-5 rounded-xl border border-cyan-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-orbitron text-lg font-bold text-cyan-300 uppercase tracking-wide">
              SYNDICATE GLOBAL LEADERBOARD
            </h3>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Real-time decentralized telemetry ledger ranking top syndicate operatives across all megacity sectors.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <div className="text-[10px] text-gray-400 font-mono uppercase">YOUR GLOBAL RANK</div>
            <div className="font-orbitron font-extrabold text-amber-400 text-lg">
              #{userRankIndex || '--'}
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              loadLeaderboard(category);
            }}
            disabled={isLoading}
            className="px-3.5 py-2 glass-panel hover:border-cyan-400 text-cyan-300 text-xs font-mono rounded-lg flex items-center gap-1.5 transition border border-cyan-500/30 disabled:opacity-50"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>SYNC</span>
          </button>
        </div>
      </div>

      {/* CATEGORY SELECTOR PILLS */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              setCategory('netWorth');
            }}
            className={`px-3 py-1.5 font-orbitron font-bold text-xs rounded-lg transition border flex items-center gap-1.5 ${
              category === 'netWorth'
                ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'border-gray-800 text-gray-400 hover:text-white glass-panel'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            TOTAL NET WORTH
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setCategory('level');
            }}
            className={`px-3 py-1.5 font-orbitron font-bold text-xs rounded-lg transition border flex items-center gap-1.5 ${
              category === 'level'
                ? 'bg-cyan-600/30 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'border-gray-800 text-gray-400 hover:text-white glass-panel'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            TOP LEVEL
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setCategory('gems');
            }}
            className={`px-3 py-1.5 font-orbitron font-bold text-xs rounded-lg transition border flex items-center gap-1.5 ${
              category === 'gems'
                ? 'bg-fuchsia-600/30 border-fuchsia-400 text-fuchsia-300 shadow-[0_0_12px_rgba(217,70,239,0.3)]'
                : 'border-gray-800 text-gray-400 hover:text-white glass-panel'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            APEX GEMS
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setCategory('buildings');
            }}
            className={`px-3 py-1.5 font-orbitron font-bold text-xs rounded-lg transition border flex items-center gap-1.5 ${
              category === 'buildings'
                ? 'bg-amber-600/30 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'border-gray-800 text-gray-400 hover:text-white glass-panel'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            BUILT SPIRES
          </button>
        </div>

        {/* SEARCH BOX */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search operative..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-950/80 border border-gray-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
      </div>

      {/* TOP PODIUM (Top 3 Players Spotlight) */}
      {!searchQuery && sortedList.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Rank 2 (Silver) */}
          <div
            onClick={() => {
              sounds.playClick();
              setSelectedSpectatePlayer(sortedList[1]);
            }}
            className="glass-panel p-4 rounded-xl border border-slate-400/40 relative cursor-pointer hover:border-slate-300 transition group flex flex-col justify-between order-2 md:order-1"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-orbitron font-extrabold text-sm text-slate-300 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-500/40 flex items-center gap-1">
                <Medal className="w-3.5 h-3.5 text-slate-300" /> #2 SILVER
              </span>
              <span className="text-[10px] font-mono text-cyan-400">{sortedList[1].badge}</span>
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-white text-sm group-hover:text-cyan-300 transition">
                {sortedList[1].username}
              </h4>
              <p className="text-[11px] font-mono text-gray-400">{sortedList[1].rankTitle} • Lv.{sortedList[1].level}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-800 flex justify-between items-center text-xs font-mono">
              <span className="text-gray-400">Net Worth:</span>
              <span className="font-orbitron font-bold text-emerald-400">
                {formatCash(sortedList[1].netWorth)}
              </span>
            </div>
          </div>

          {/* Rank 1 (Gold / Crown) */}
          <div
            onClick={() => {
              sounds.playClick();
              setSelectedSpectatePlayer(sortedList[0]);
            }}
            className="glass-panel p-4 rounded-xl border border-amber-400/60 bg-gradient-to-b from-amber-950/30 to-transparent relative cursor-pointer hover:border-amber-300 transition group flex flex-col justify-between shadow-[0_0_20px_rgba(245,158,11,0.15)] order-1 md:order-2"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-orbitron font-extrabold text-sm text-amber-300 px-2.5 py-0.5 rounded bg-amber-950/80 border border-amber-400/60 flex items-center gap-1">
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400" /> #1 SOVEREIGN
              </span>
              <span className="text-[10px] font-mono text-amber-300">{sortedList[0].badge}</span>
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-white text-base group-hover:text-amber-300 transition">
                {sortedList[0].username}
              </h4>
              <p className="text-xs font-mono text-amber-400/90">{sortedList[0].rankTitle} • Lv.{sortedList[0].level}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-500/20 flex justify-between items-center text-xs font-mono">
              <span className="text-gray-300">Net Worth:</span>
              <span className="font-orbitron font-extrabold text-emerald-400 text-sm">
                {formatCash(sortedList[0].netWorth)}
              </span>
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div
            onClick={() => {
              sounds.playClick();
              setSelectedSpectatePlayer(sortedList[2]);
            }}
            className="glass-panel p-4 rounded-xl border border-amber-700/40 relative cursor-pointer hover:border-amber-600 transition group flex flex-col justify-between order-3"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-orbitron font-extrabold text-sm text-amber-600 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-700/40 flex items-center gap-1">
                <Medal className="w-3.5 h-3.5 text-amber-600" /> #3 BRONZE
              </span>
              <span className="text-[10px] font-mono text-cyan-400">{sortedList[2].badge}</span>
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-white text-sm group-hover:text-cyan-300 transition">
                {sortedList[2].username}
              </h4>
              <p className="text-[11px] font-mono text-gray-400">{sortedList[2].rankTitle} • Lv.{sortedList[2].level}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-800 flex justify-between items-center text-xs font-mono">
              <span className="text-gray-400">Net Worth:</span>
              <span className="font-orbitron font-bold text-emerald-400">
                {formatCash(sortedList[2].netWorth)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FULL RANKINGS TABLE */}
      <div className="glass-panel rounded-xl border border-cyan-500/30 overflow-hidden">
        <div className="p-3 bg-gray-950/60 border-b border-gray-800 flex items-center justify-between text-[11px] font-mono text-gray-400">
          <div className="flex items-center gap-3">
            <span className="w-8 text-center">RANK</span>
            <span>OPERATIVE</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">LEVEL</span>
            <span className="hidden sm:inline">GEMS</span>
            <span className="w-24 text-right">
              {category === 'netWorth'
                ? 'NET WORTH'
                : category === 'level'
                ? 'LEVEL'
                : category === 'gems'
                ? 'GEMS'
                : 'SPIRES'}
            </span>
            <span className="w-16 text-right">ACTION</span>
          </div>
        </div>

        <div className="divide-y divide-gray-800/60 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center font-mono text-xs text-cyan-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Syncing with global syndicate satellite ledger...
            </div>
          ) : sortedList.length === 0 ? (
            <div className="p-8 text-center font-mono text-xs text-gray-500">
              No operative matches your search parameters.
            </div>
          ) : (
            sortedList.map((p, idx) => {
              const rank = idx + 1;
              const isCurrentUser = p.id === 'current_user';

              return (
                <div
                  key={p.id}
                  className={`p-3 flex items-center justify-between transition-colors text-xs font-mono ${
                    isCurrentUser
                      ? 'bg-cyan-950/50 border-l-4 border-cyan-400'
                      : 'hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-8 text-center font-orbitron font-bold text-xs ${
                        rank === 1
                          ? 'text-amber-400'
                          : rank === 2
                          ? 'text-slate-300'
                          : rank === 3
                          ? 'text-amber-600'
                          : 'text-gray-500'
                      }`}
                    >
                      #{rank}
                    </span>

                    <div className="w-8 h-8 rounded-full border border-cyan-500/40 bg-cyan-950/80 flex items-center justify-center text-cyan-300 font-orbitron font-bold text-xs shrink-0">
                      {p.avatarChar}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className={`font-orbitron font-bold truncate ${
                            isCurrentUser ? 'text-cyan-300' : 'text-white'
                          }`}
                        >
                          {p.username}
                        </span>
                        {p.isOnline && (
                          <span
                            className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"
                            title="Operative Online"
                          />
                        )}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate flex items-center gap-1.5">
                        <span>{p.rankTitle}</span>
                        <span>•</span>
                        <span className="text-gray-500">{p.badge}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <span className="hidden sm:inline text-gray-300">Lv.{p.level}</span>
                    <span className="hidden sm:inline text-fuchsia-400">{formatCompactNumber(p.gems)} 💎</span>

                    <span className="w-24 text-right font-orbitron font-bold">
                      {category === 'netWorth' ? (
                        <span className="text-emerald-400">{formatCash(p.netWorth)}</span>
                      ) : category === 'level' ? (
                        <span className="text-cyan-400">Level {p.level}</span>
                      ) : category === 'gems' ? (
                        <span className="text-fuchsia-400">{formatCompactNumber(p.gems)} 💎</span>
                      ) : (
                        <span className="text-amber-400">{p.buildingsCount} Spires</span>
                      )}
                    </span>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        setSelectedSpectatePlayer(p);
                      }}
                      className="px-2.5 py-1 glass-panel hover:border-cyan-400 text-cyan-400 text-[11px] rounded transition flex items-center gap-1"
                      title="Spectate public profile"
                    >
                      <Eye className="w-3 h-3" />
                      <span className="hidden md:inline">SPECTATE</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SPECTATE PUBLIC PROFILE MODAL */}
      {selectedSpectatePlayer && (
        <div
          id="spectate-modal"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="glass-card w-full max-w-md p-6 rounded-xl border border-fuchsia-500/50 shadow-[0_0_30px_rgba(217,70,239,0.25)] relative">
            <button
              id="btn-close-spectate"
              onClick={() => {
                sounds.playClick();
                setSelectedSpectatePlayer(null);
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
                  {selectedSpectatePlayer.username}
                </h3>
                <div className="text-xs text-cyan-400 font-mono" id="spec-rank">
                  {selectedSpectatePlayer.rankTitle}
                </div>
              </div>
              <div
                className="px-3 py-1 bg-fuchsia-950 border border-fuchsia-400 rounded text-fuchsia-300 font-orbitron font-bold text-xs"
                id="spec-level"
              >
                Level {selectedSpectatePlayer.level}
              </div>
            </div>

            {/* PUBLIC FLEX STATS (NO PRIVATE FINANCIAL CONTROLS) */}
            <div className="space-y-3 mb-6 font-mono text-xs">
              <div className="glass-panel p-3 rounded-lg flex justify-between items-center border border-gray-800">
                <span className="text-gray-400">Total Net Worth</span>
                <span className="font-orbitron text-emerald-400 font-bold text-sm" id="spec-networth">
                  {formatCash(selectedSpectatePlayer.netWorth)}
                </span>
              </div>

              <div className="glass-panel p-3 rounded-lg flex justify-between items-center border border-gray-800">
                <span className="text-gray-400">Grid Spires &amp; Structures</span>
                <span className="font-orbitron text-cyan-400 font-bold text-sm" id="spec-buildings">
                  {selectedSpectatePlayer.buildingsCount} / 64
                </span>
              </div>

              <div className="glass-panel p-3 rounded-lg flex justify-between items-center border border-gray-800">
                <span className="text-gray-400">Hard Currency Reserves</span>
                <span className="font-orbitron text-fuchsia-400 font-bold text-sm">
                  {formatCompactNumber(selectedSpectatePlayer.gems)} Gems
                </span>
              </div>

              <div className="glass-panel p-3 rounded-lg flex justify-between items-center border border-gray-800">
                <span className="text-gray-400">Syndicate Prestige / Clout</span>
                <span className="font-orbitron text-amber-400 font-bold text-sm">
                  {selectedSpectatePlayer.clout} Stars
                </span>
              </div>

              <div className="glass-panel p-3 rounded-lg flex justify-between items-center border border-gray-800">
                <span className="text-gray-400">Unlocked Syndicate Badge</span>
                <span className="font-orbitron text-fuchsia-300 font-bold text-xs">
                  {selectedSpectatePlayer.badge}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setSelectedSpectatePlayer(null);
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 font-orbitron text-xs text-gray-200 rounded-lg transition"
            >
              CLOSE PROFILE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
