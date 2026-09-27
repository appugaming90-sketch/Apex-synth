import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { VEHICLES_CATALOG, REAL_ESTATE_CATALOG } from '../data/initialData';
import { formatCash } from '../utils/format';
import { Trophy, Medal, Search, Flame, Award, Users, Crosshair, Car, Home, Crown } from 'lucide-react';

export const LeaderboardTab: React.FC = () => {
  const { leaderboard, profile, computedNetWorth } = useGame();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'netWorth' | 'level' | 'prestige'>('netWorth');

  // Showcase asset resolution for player
  const playerVehicleName = profile.showcaseVehicleId
    ? VEHICLES_CATALOG.find(v => v.id === profile.showcaseVehicleId)?.name
    : undefined;
  const playerPropertyName = profile.showcasePropertyId
    ? REAL_ESTATE_CATALOG.find(p => p.id === profile.showcasePropertyId)?.name
    : undefined;

  // Insert or update current player into leaderboard list for real-time positioning
  const mergedList = [...leaderboard];
  const playerIdx = mergedList.findIndex(e => e.id === profile.id);
  const playerEntry = {
    id: profile.id,
    name: profile.username,
    username: profile.username,
    netWorth: computedNetWorth,
    level: profile.level,
    syndicateTag: profile.syndicateId ? 'CYBER' : undefined,
    prestige: profile.prestige,
    avatarFrame: profile.avatarFrame,
    showcaseVehicleName: playerVehicleName,
    showcasePropertyName: playerPropertyName,
    rank: 0,
    isPlayer: true
  };

  if (playerIdx >= 0) {
    mergedList[playerIdx] = { ...mergedList[playerIdx], ...playerEntry };
  } else {
    mergedList.push(playerEntry as any);
  }

  // Sort
  mergedList.sort((a, b) => {
    if (sortBy === 'netWorth') return b.netWorth - a.netWorth;
    if (sortBy === 'level') return (b.level || 1) - (a.level || 1);
    return (b.prestige || 0) - (a.prestige || 0);
  });

  // Assign calculated rank numbers
  const ranked = mergedList.map((entry, idx) => ({
    ...entry,
    rank: idx + 1
  }));

  const filtered = ranked.filter(e => {
    const name = e.name || e.username || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.syndicateTag && e.syndicateTag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.showcaseVehicleName && e.showcaseVehicleName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.showcasePropertyName && e.showcasePropertyName.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const top3 = ranked.slice(0, 3);
  const currentPlayerRank = ranked.find(e => e.isPlayer);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="clip-cyber-corner bg-[#070c18] border border-[#00f0ff]/40 p-5 shadow-neon-cyan flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#fcee0a]" />
            <h2 className="font-display text-lg font-bold text-white tracking-wider">
              NET RANKINGS MATRIX // APEX TYCOON LADDER
            </h2>
          </div>
          <p className="mt-1 text-xs font-hud text-slate-300 max-w-2xl">
            Live competitive player rankings across global net worth, neural level, and prestige tiers.
            Equip Flex Assets from your Profile Hub to showcase your fleet &amp; deeds on the global stage.
          </p>
        </div>

        {currentPlayerRank && (
          <div className="bg-[#020408] border border-[#fcee0a]/50 clip-cyber-corner-sm px-4 py-2 text-right font-mono">
            <div className="text-[10px] text-slate-400 uppercase">Your Ladder Placement</div>
            <div className="text-base font-black text-[#fcee0a] text-glow-yellow">
              RANK #{currentPlayerRank.rank} GLOBAL
            </div>
          </div>
        )}
      </div>

      {/* Top 3 Cyber Podium */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {top3.map((entry, idx) => {
          const isGold = idx === 0;
          const isSilver = idx === 1;
          const isBronze = idx === 2;

          return (
            <div
              key={entry.id}
              className={`relative clip-cyber-corner bg-[#070c18] p-5 border text-center flex flex-col justify-between shadow-xl transition-all ${
                isGold
                  ? 'border-[#fcee0a] shadow-neon-yellow scale-105 z-10'
                  : isSilver
                  ? 'border-[#00f0ff]/70 shadow-neon-cyan'
                  : 'border-[#ff0055]/70 shadow-neon-magenta'
              }`}
            >
              <div>
                <div className="flex justify-center">
                  <div className={`h-12 w-12 clip-cyber-corner flex items-center justify-center font-display font-black text-lg ${
                    isGold
                      ? 'bg-[#fcee0a] text-black shadow-neon-yellow'
                      : isSilver
                      ? 'bg-[#00f0ff] text-black shadow-neon-cyan'
                      : 'bg-[#ff0055] text-white shadow-neon-magenta'
                  }`}>
                    #{entry.rank}
                  </div>
                </div>

                <h3 className="mt-3 text-base font-display font-black text-white flex items-center justify-center gap-1.5">
                  <span>{entry.name || entry.username}</span>
                  {entry.isPlayer && (
                    <span className="text-[10px] font-mono text-[#00ff66] bg-[#00ff66]/20 px-1.5 py-0.2 border border-[#00ff66]/40">
                      YOU
                    </span>
                  )}
                </h3>

                {entry.syndicateTag && (
                  <div className="mt-0.5 text-xs font-mono text-[#00f0ff]">
                    [{entry.syndicateTag}]
                  </div>
                )}

                {/* Top 3 Flex Assets Badges */}
                {(entry.showcaseVehicleName || entry.showcasePropertyName) && (
                  <div className="mt-2.5 flex flex-col items-center gap-1 text-[10px] font-mono">
                    {entry.showcaseVehicleName && (
                      <span className="flex items-center gap-1 text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-0.5 border border-[#00f0ff]/30 rounded-sm">
                        <Car className="h-3 w-3" />
                        {entry.showcaseVehicleName}
                      </span>
                    )}
                    {entry.showcasePropertyName && (
                      <span className="flex items-center gap-1 text-[#fcee0a] bg-[#fcee0a]/10 px-2 py-0.5 border border-[#fcee0a]/30 rounded-sm">
                        <Home className="h-3 w-3" />
                        {entry.showcasePropertyName}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-4 font-mono">
                  <div className="text-[10px] uppercase text-slate-400">Total Net Worth</div>
                  <div className="text-base sm:text-lg font-black text-white text-glow-yellow">
                    {formatCash(entry.netWorth)}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-around text-xs font-mono text-slate-300">
                <span>LVL {entry.level || 1}</span>
                <span>•</span>
                <span className="text-[#fcee0a]">★ {entry.prestige || 15}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#00f0ff]" />
          <input
            type="text"
            placeholder="Search handle, clan, or flex asset..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#020408] border border-[#00f0ff]/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00f0ff]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          <span className="text-slate-400 text-[10px] uppercase mr-1">Sort Metric:</span>
          {(['netWorth', 'level', 'prestige'] as const).map(key => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`px-3 py-1.5 clip-cyber-corner-sm text-xs font-bold uppercase transition ${
                sortBy === key
                  ? 'bg-[#00f0ff] text-black shadow-neon-cyan font-black'
                  : 'bg-[#070c18] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {key === 'netWorth' ? 'Net Worth' : key === 'level' ? 'Level' : 'Prestige'}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table Matrix */}
      <div className="clip-cyber-corner bg-[#070c18] border border-[#00f0ff]/20 overflow-x-auto shadow-lg font-mono">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead className="border-b border-[#00f0ff]/20 bg-[#020408] text-[10px] uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Operative Handle</th>
              <th className="px-4 py-3">Clan / Faction</th>
              <th className="px-4 py-3">Showcase Flex Assets</th>
              <th className="px-4 py-3 text-right">Net Worth</th>
              <th className="px-4 py-3 text-center">Neural Tier</th>
              <th className="px-4 py-3 text-right">Prestige</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(entry => {
              const isMe = entry.isPlayer;
              return (
                <tr
                  key={entry.id}
                  className={`transition ${
                    isMe
                      ? 'bg-[#00f0ff]/10 text-white font-bold border-l-2 border-l-[#00f0ff]'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <td className="px-4 py-3 font-mono font-bold">
                    <span className={`px-2 py-0.5 clip-cyber-corner-sm ${
                      entry.rank === 1
                        ? 'bg-[#fcee0a] text-black font-black'
                        : entry.rank === 2
                        ? 'bg-[#00f0ff] text-black font-black'
                        : entry.rank === 3
                        ? 'bg-[#ff0055] text-white font-black'
                        : 'text-slate-400'
                    }`}>
                      #{entry.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                    <span>{entry.name || entry.username}</span>
                    {isMe && (
                      <span className="text-[9px] font-mono text-[#00ff66] bg-[#00ff66]/20 px-1 py-0.2 border border-[#00ff66]/30">
                        YOU
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#00f0ff]">
                    {entry.syndicateTag ? `[${entry.syndicateTag}]` : '—'}
                  </td>

                  {/* Public Flex Showcase Assets Column */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {entry.showcaseVehicleName ? (
                        <span className="flex items-center gap-1 text-[#00f0ff] bg-[#00f0ff]/10 px-1.5 py-0.5 border border-[#00f0ff]/30 text-[10px] rounded-sm font-normal">
                          <Car className="h-3 w-3" />
                          {entry.showcaseVehicleName}
                        </span>
                      ) : null}

                      {entry.showcasePropertyName ? (
                        <span className="flex items-center gap-1 text-[#fcee0a] bg-[#fcee0a]/10 px-1.5 py-0.5 border border-[#fcee0a]/30 text-[10px] rounded-sm font-normal">
                          <Home className="h-3 w-3" />
                          {entry.showcasePropertyName}
                        </span>
                      ) : null}

                      {!entry.showcaseVehicleName && !entry.showcasePropertyName && (
                        <span className="text-slate-500 text-[10px]">—</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right font-black text-white text-glow-yellow">
                    {formatCash(entry.netWorth)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-[#020408] border border-white/10 px-2 py-0.5 text-slate-300">
                      LVL {entry.level || 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-[#fcee0a] font-bold">
                    ★ {entry.prestige || 15}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
