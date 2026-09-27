import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Syndicate, SyndicateContract } from '../types';
import { sounds } from '../utils/sound';
import { formatCash, formatCompactNumber } from '../utils/format';
import {
  Users,
  Shield,
  Landmark,
  FileText,
  PlusCircle,
  LogOut,
  Sparkles,
  Award,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
  TrendingUp,
  Cpu,
  Crosshair
} from 'lucide-react';

export const SyndicatesTab: React.FC = () => {
  const {
    profile,
    syndicates,
    joinSyndicate,
    leaveSyndicate,
    createSyndicate,
    depositSyndicateVault,
    withdrawSyndicateVault,
    completeContract,
    addToast
  } = useGame();

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newCorpName, setNewCorpName] = useState<string>('');
  const [newCorpTag, setNewCorpTag] = useState<string>('');

  const [vaultAmount, setVaultAmount] = useState<string>('');
  const [activeContractId, setActiveContractId] = useState<string | null>(null);
  const [contractTimeLeft, setContractTimeLeft] = useState<number>(0);

  const currentSyndicate = syndicates.find(s => s.id === profile.syndicateId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCorpName.trim() || !newCorpTag.trim()) {
      addToast('Missing Info', 'Provide corporate name and a 3-5 character ticker.', 'warning');
      return;
    }
    const success = createSyndicate(newCorpName.trim(), newCorpTag.trim());
    if (success) {
      setIsCreating(false);
      setNewCorpName('');
      setNewCorpTag('');
    }
  };

  const handleVaultDeposit = () => {
    const amt = parseInt(vaultAmount, 10);
    if (isNaN(amt) || amt <= 0) return;
    if (depositSyndicateVault(amt)) {
      setVaultAmount('');
    }
  };

  const handleVaultWithdraw = () => {
    const amt = parseInt(vaultAmount, 10);
    if (isNaN(amt) || amt <= 0) return;
    if (withdrawSyndicateVault(amt)) {
      setVaultAmount('');
    }
  };

  const handleStartContract = (contract: SyndicateContract) => {
    sounds.playClick();
    setActiveContractId(contract.id);
    setContractTimeLeft(contract.durationSeconds);
    addToast('Black-Ops Active', `Dispatched squad for "${contract.title}".`, 'info');

    const interval = setInterval(() => {
      setContractTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setActiveContractId(null);
          completeContract(contract.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Cyber Megacorp Factions Banner */}
      <div className="clip-cyber-corner bg-[#070c18] border border-[#00f0ff]/40 p-5 shadow-neon-cyan flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#fcee0a]" />
            <h2 className="font-display text-lg font-bold text-white tracking-wider">
              MEGACORP CLANS &amp; FACTION TREASURY VAULTS
            </h2>
          </div>
          <p className="mt-1 text-xs font-hud text-slate-300 max-w-2xl">
            Pledge allegiance to high-stakes cyber corporations or charter your own syndicate.
            Pool capital into shared war chests, unlock economic faction perks, and run black-ops bounties.
          </p>
        </div>

        {!currentSyndicate && (
          <button
            onClick={() => { sounds.playClick(); setIsCreating(!isCreating); }}
            className="flex items-center gap-2 px-4 py-2.5 clip-cyber-corner-sm bg-[#fcee0a] hover:bg-[#fcee0a]/90 text-black font-mono font-black text-xs uppercase tracking-wider transition shadow-neon-yellow"
          >
            <PlusCircle className="h-4 w-4" />
            <span>CHARTER NEW CLAN ($CRED 50k)</span>
          </button>
        )}
      </div>

      {/* Creation Modal / Form */}
      {isCreating && !currentSyndicate && (
        <div className="clip-cyber-corner bg-[#061022] border-2 border-[#fcee0a] p-5 shadow-neon-yellow animate-in fade-in duration-200">
          <h3 className="font-display font-black text-white text-sm tracking-wider">
            FILE MEGACORPORATE CHARTER // SYSTEM
          </h3>
          <p className="text-xs font-hud text-slate-300 mt-0.5">
            Incorporating grants you Chairman status with master governance over the group war chest.
          </p>

          <form onSubmit={handleCreate} className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div>
              <label className="block text-[10px] uppercase text-slate-400 mb-1">
                Corporation Name
              </label>
              <input
                type="text"
                placeholder="e.g. Arasaka Sovereign"
                value={newCorpName}
                onChange={(e) => setNewCorpName(e.target.value)}
                className="w-full bg-[#020408] border border-[#00f0ff]/40 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-slate-400 mb-1">
                Ticker Tag (2-5 Chars)
              </label>
              <input
                type="text"
                placeholder="e.g. ARA"
                maxLength={5}
                value={newCorpTag}
                onChange={(e) => setNewCorpTag(e.target.value.toUpperCase())}
                className="w-full bg-[#020408] border border-[#00f0ff]/40 px-3 py-2 text-xs text-[#fcee0a] uppercase focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 py-2 clip-cyber-corner-sm bg-[#fcee0a] text-black font-mono font-black text-xs uppercase tracking-wider transition shadow-neon-yellow"
              >
                INCORPORATE ($50,000)
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-2 clip-cyber-corner-sm bg-slate-800 text-slate-300 hover:text-white text-xs font-mono"
              >
                ABORT
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW A: Player is in a Syndicate */}
      {currentSyndicate ? (
        <div className="space-y-6">
          
          {/* Syndicate Overview Banner */}
          <div className="clip-cyber-corner bg-[#070c18] border border-[#fcee0a]/40 p-5 shadow-neon-yellow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 clip-cyber-corner bg-[#fcee0a]/20 border border-[#fcee0a] flex items-center justify-center font-display font-black text-[#fcee0a] text-lg shadow-neon-yellow">
                  {currentSyndicate.tag}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-display font-black text-white">{currentSyndicate.name}</h3>
                    <span className="font-mono text-xs text-[#fcee0a] bg-[#fcee0a]/10 border border-[#fcee0a]/30 px-2 py-0.5">
                      TIER {currentSyndicate.level}
                    </span>
                  </div>
                  <p className="text-xs font-hud text-slate-300 mt-0.5">{currentSyndicate.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono">
                  <div className="text-[10px] uppercase text-slate-400">Roster Rank</div>
                  <div className="text-xs font-black text-[#fcee0a] flex items-center gap-1 justify-end">
                    <Award className="h-3.5 w-3.5" />
                    {profile.syndicateRole.toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={leaveSyndicate}
                  className="flex items-center gap-1.5 px-3 py-1.5 clip-cyber-corner-sm bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-mono font-bold transition"
                >
                  <LogOut className="h-3.5 w-3.5" /> RESIGN
                </button>
              </div>
            </div>

            {/* Syndicate Metrics & Active Group Perks */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="bg-[#020408] p-3 border border-white/5">
                <div className="text-[9px] uppercase text-slate-500">Shared War Chest</div>
                <div className="text-sm sm:text-base font-black text-[#00f0ff] text-glow-cyan">
                  {formatCash(currentSyndicate.vaultBalance)}
                </div>
              </div>
              <div className="bg-[#020408] p-3 border border-white/5">
                <div className="text-[9px] uppercase text-slate-500">Faction Rep</div>
                <div className="text-sm sm:text-base font-black text-[#fcee0a]">
                  {formatCompactNumber(currentSyndicate.reputation)} REP
                </div>
              </div>
              <div className="bg-[#020408] p-3 border border-white/5">
                <div className="text-[9px] uppercase text-slate-500">Commercial Boost</div>
                <div className="text-sm sm:text-base font-black text-[#00ff66] flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{(currentSyndicate.perkBusinessBonus * 100).toFixed(0)}%
                </div>
              </div>
              <div className="bg-[#020408] p-3 border border-white/5">
                <div className="text-[9px] uppercase text-slate-500">Upkeep Subsidy</div>
                <div className="text-sm sm:text-base font-black text-[#9d4edd] flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  -{(currentSyndicate.perkMaintenanceDiscount * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          {/* Group Vault Management & Corporate Contracts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Vault Banking Module */}
            <div className="clip-cyber-corner bg-[#070c18] border border-[#00f0ff]/30 p-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#00f0ff]/20 pb-3">
                <div className="flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-[#00f0ff]" />
                  <h3 className="font-display font-bold text-white text-sm">WAR CHEST TERMINAL</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Cap: {profile.syndicateRole === 'Chairman' ? '$500k' : profile.syndicateRole === 'Executive' ? '$100k' : '$25k'}
                </span>
              </div>

              <div className="mt-4 space-y-3 font-mono">
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter credits..."
                    value={vaultAmount}
                    onChange={(e) => setVaultAmount(e.target.value)}
                    className="w-full bg-[#020408] border border-[#00f0ff]/30 px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-[#00f0ff]">
                    CRED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleVaultDeposit}
                    className="flex items-center justify-center gap-1.5 py-2 clip-cyber-corner-sm bg-[#00ff66] hover:bg-[#00ff66]/90 text-black font-black text-xs uppercase tracking-wider transition shadow-neon-green"
                  >
                    <ArrowDownLeft className="h-3.5 w-3.5" /> DEPOSIT
                  </button>
                  <button
                    onClick={handleVaultWithdraw}
                    className="flex items-center justify-center gap-1.5 py-2 clip-cyber-corner-sm bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black font-black text-xs uppercase tracking-wider transition shadow-neon-cyan"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" /> WITHDRAW
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="mt-5 border-t border-white/5 pt-3">
                <h4 className="text-xs font-display font-bold text-white mb-2">CLAN ROSTER &amp; DONORS</h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 font-mono">
                  {currentSyndicate.members.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 bg-[#020408] border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">
                          {member.name} {member.isPlayer && '(You)'}
                        </span>
                        <span className="text-[10px] text-[#fcee0a] bg-[#fcee0a]/10 px-1.5 py-0.2">
                          {member.role}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px]">
                        {formatCash(member.contribution)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Corporate Contracts System */}
            <div className="clip-cyber-corner bg-[#070c18] border border-[#fcee0a]/30 p-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#fcee0a]/20 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#fcee0a]" />
                  <h3 className="font-display font-bold text-white text-sm">BLACK-OPS CONTRACTS BOARD</h3>
                </div>
                <span className="text-[10px] font-mono text-[#00ff66] bg-[#00ff66]/10 px-2 py-0.5 border border-[#00ff66]/30">
                  BOUNTIES LIVE
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {currentSyndicate.contracts.length === 0 ? (
                  <div className="py-8 text-center text-xs font-mono text-slate-500">
                    No active corporate contracts available.
                  </div>
                ) : (
                  currentSyndicate.contracts.map(contract => {
                    const isExecutingThis = activeContractId === contract.id;
                    const isDone = contract.status === 'completed';

                    return (
                      <div
                        key={contract.id}
                        className="bg-[#020408] border border-white/5 p-3.5 space-y-2 clip-cyber-corner-sm"
                      >
                        <div className="flex items-center justify-between font-mono">
                          <span className="text-[10px] uppercase tracking-wider text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-0.5">
                            {contract.category}
                          </span>
                          <span className="text-xs font-black text-[#00ff66]">
                            +{formatCash(contract.rewardCredits)}
                          </span>
                        </div>

                        <h4 className="text-xs font-display font-bold text-white">{contract.title}</h4>
                        <p className="text-[11px] font-hud text-slate-400">{contract.description}</p>

                        <div className="flex items-center justify-between pt-1 text-xs font-mono">
                          <span className="text-[#fcee0a]">
                            +{contract.reputationReward} Syndicate Rep
                          </span>

                          {isDone ? (
                            <span className="text-[10px] text-[#00ff66] bg-[#00ff66]/10 px-2 py-0.5 border border-[#00ff66]/30">
                              ✓ EXECUTED
                            </span>
                          ) : isExecutingThis ? (
                            <span className="text-[10px] text-[#fcee0a] bg-[#fcee0a]/10 px-2 py-0.5 border border-[#fcee0a]/30 flex items-center gap-1">
                              <Clock className="h-3 w-3 animate-spin" /> RUNNING ({contractTimeLeft}s)
                            </span>
                          ) : (
                            <button
                              onClick={() => handleStartContract(contract)}
                              disabled={activeContractId !== null}
                              className={`px-3 py-1 clip-cyber-corner-sm text-xs font-mono font-black uppercase tracking-wider transition ${
                                activeContractId === null
                                  ? 'bg-[#fcee0a] hover:bg-[#fcee0a]/90 text-black shadow-neon-yellow cursor-pointer'
                                  : 'bg-slate-900 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              DISPATCH SQUAD
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* VIEW B: Browse and Join Existing Syndicates */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {syndicates.map(syn => (
            <div
              key={syn.id}
              className="clip-cyber-corner bg-[#070c18] border border-white/10 p-5 shadow-lg flex flex-col justify-between hover:border-[#00f0ff] transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 clip-cyber-corner-sm bg-[#00f0ff]/20 border border-[#00f0ff] flex items-center justify-center font-display font-black text-[#00f0ff] text-sm shadow-neon-cyan">
                    {syn.tag}
                  </div>
                  <span className="text-xs font-mono text-[#fcee0a] bg-[#fcee0a]/10 border border-[#fcee0a]/30 px-2 py-0.5 font-bold">
                    TIER {syn.level}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-display font-bold text-white">{syn.name}</h3>
                <p className="mt-1 text-xs font-hud text-slate-400 min-h-[40px]">{syn.description}</p>

                <div className="mt-4 space-y-2 border-t border-white/5 pt-3 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">War Chest:</span>
                    <span className="font-bold text-[#00f0ff]">
                      {formatCash(syn.vaultBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Commercial Boost:</span>
                    <span className="font-bold text-[#00ff66]">
                      +{(syn.perkBusinessBonus * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Upkeep Discount:</span>
                    <span className="font-bold text-[#9d4edd]">
                      -{(syn.perkMaintenanceDiscount * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Roster Capacity:</span>
                    <span className="text-slate-300">
                      {syn.members.length} / {syn.maxMembers} Members
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 font-mono">
                <button
                  onClick={() => joinSyndicate(syn.id)}
                  className="w-full py-2.5 clip-cyber-corner-sm bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black font-black text-xs uppercase tracking-wider transition shadow-neon-cyan"
                >
                  PLEDGE ALLEGIANCE (ASSOCIATE)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
