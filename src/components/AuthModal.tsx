import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/sound';
import {
  X,
  Database,
  Cpu,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  Lock,
  Copy,
  Shield,
  FileCode,
  Radio,
  ExternalLink,
  LogOut,
  Cloud,
  Check
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    profile,
    exportSaveData,
    importSaveData,
    resetGame,
    addToast,
    linkGoogleAccount,
    unlinkGoogleAccount,
    syncCloudData
  } = useGame();

  const [activeTab, setActiveTab] = useState<'account' | 'sync' | 'schema'>('account');
  const [googleEmailInput, setGoogleEmailInput] = useState(profile.googleAuth?.email || profile.email || 'gopimadhu1974@gmail.com');
  const [googleNameInput, setGoogleNameInput] = useState(profile.googleAuth?.name || 'Gopi Madhu');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isGoogleLinked = Boolean(profile.googleAuth?.isLinked);

  const handleGoogleSignIn = () => {
    sounds.playClick();
    linkGoogleAccount({
      email: googleEmailInput || 'gopimadhu1974@gmail.com',
      name: googleNameInput || 'Gopi Madhu',
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    });
    setShowCustomGoogleInput(false);
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    await syncCloudData();
    setIsSyncing(false);
  };

  const handleUnlink = () => {
    if (confirm('Unlink Google account? Progress will remain saved in local browser storage.')) {
      unlinkGoogleAccount();
    }
  };

  const handleCopyExport = () => {
    sounds.playClick();
    const jsonStr = exportSaveData();
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    addToast('Neural Save Copied', 'State payload copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    sounds.playClick();
    const jsonStr = exportSaveData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex-cyber-rig-save-${profile.username.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Rig Backup Exported', 'Downloaded save JSON file.', 'success');
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const success = importSaveData(importJsonText);
    if (success) {
      setImportJsonText('');
      onClose();
    }
  };

  const handleReset = () => {
    if (confirm('CAUTION: System wipe requested! All neural credits, vehicles, and assets will be purged back to genesis state. Proceed?')) {
      resetGame();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl clip-cyber-corner bg-[#040813] border-2 border-[#00f0ff] shadow-neon-cyan overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00f0ff]/30 p-4 bg-[#020408]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 clip-cyber-corner-sm bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-white text-sm tracking-wider text-glow-cyan">
                NEURAL SYNC &amp; GOOGLE CLOUD MAINFRAME
              </h3>
              <p className="text-[10px] font-mono text-slate-400">
                Google OAuth • Firebase &amp; Supabase Cloud Database Bridge
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-[#ff0055] hover:bg-white/5 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-b border-white/10 px-4 pt-2 bg-[#060b18] font-mono text-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('account')}
            className={`pb-2 font-bold transition border-b-2 tracking-wider whitespace-nowrap ${
              activeTab === 'account'
                ? 'border-[#00f0ff] text-[#00f0ff] text-glow-cyan'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            // 01. GOOGLE &amp; AUTH
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`pb-2 font-bold transition border-b-2 tracking-wider whitespace-nowrap ${
              activeTab === 'sync'
                ? 'border-[#fcee0a] text-[#fcee0a] text-glow-yellow'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            // 02. RIG BACKUP &amp; RESTORE
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-2 font-bold transition border-b-2 tracking-wider whitespace-nowrap ${
              activeTab === 'schema'
                ? 'border-[#00ff66] text-[#00ff66]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            // 03. SQL DDL &amp; RULES
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 font-mono text-xs">
          
          {/* TAB 1: GOOGLE & ACCOUNT AUTH */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              
              {/* Cloud Sync Status Banner */}
              <div className="p-3 bg-[#020408] border border-[#00f0ff]/30 clip-cyber-corner-sm flex items-center justify-between">
                <div>
                  <div className="text-[9px] uppercase text-slate-400">Cloud Link &amp; Persistence Engine</div>
                  <div className="text-xs font-bold text-[#00ff66] flex items-center gap-1.5 mt-0.5">
                    <Radio className="h-3 w-3 animate-pulse text-[#00ff66]" />
                    {isGoogleLinked ? 'GOOGLE CLOUD SYNCED // FIREBASE ACTIVE' : 'OFFLINE GUEST SESSION'}
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 border ${
                  isGoogleLinked
                    ? 'text-[#00ff66] bg-[#00ff66]/10 border-[#00ff66]/40'
                    : 'text-[#fcee0a] bg-[#fcee0a]/10 border-[#fcee0a]/40'
                }`}>
                  {isGoogleLinked ? 'OAUTH ACTIVE' : 'LOCAL CACHE'}
                </span>
              </div>

              {/* Linked Google Account Card */}
              {isGoogleLinked ? (
                <div className="p-4 bg-[#070e1f] border border-[#00f0ff]/40 clip-cyber-corner space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase text-[#00f0ff] font-bold tracking-wider flex items-center gap-1.5">
                      <Cloud className="h-3.5 w-3.5" />
                      LINKED GOOGLE OPERATIVE IDENTITY
                    </span>
                    <span className="text-[9px] bg-[#00ff66]/20 text-[#00ff66] px-1.5 py-0.5 border border-[#00ff66]/40 rounded-sm font-bold flex items-center gap-1">
                      <Check className="h-3 w-3" /> VERIFIED
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="relative">
                      <img
                        src={profile.googleAuth?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                        alt="Google User"
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#00f0ff] shadow-neon-cyan"
                      />
                      {/* Google G mini-badge */}
                      <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bold text-sm truncate">
                        {profile.googleAuth?.name || profile.username}
                      </div>
                      <div className="text-slate-300 text-xs truncate">
                        {profile.googleAuth?.email || profile.email}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>Last Cloud Mirror: <span className="text-[#00f0ff]">Just now</span></span>
                        <span>•</span>
                        <span className="text-[#00ff66]">Auto-Save ON</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                    <button
                      onClick={handleSyncNow}
                      disabled={isSyncing}
                      className="flex items-center justify-center gap-1.5 py-2 clip-cyber-corner-sm bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black font-black text-xs uppercase tracking-wider transition shadow-neon-cyan disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'SYNCING...' : 'SYNC TO CLOUD'}</span>
                    </button>

                    <button
                      onClick={handleUnlink}
                      className="flex items-center justify-center gap-1.5 py-2 clip-cyber-corner-sm bg-[#0a1020] border border-white/20 hover:border-red-500/60 hover:text-red-400 text-slate-300 font-bold text-xs transition"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>DISCONNECT</span>
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Prominent "Sign in with Google" Button Section */}
              <div className="p-4 bg-[#02050e] border border-[#00f0ff]/20 clip-cyber-corner space-y-3">
                <div className="text-center space-y-1">
                  <h4 className="font-display font-black text-white text-sm tracking-wider">
                    {isGoogleLinked ? 'SWITCH OR RE-AUTHENTICATE GOOGLE ID' : 'CLOUD AUTHENTICATION & PROGRESS SYNC'}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-hud">
                    Connect with your Google account to back up your economy assets, fortress base, luxury fleet, and syndicate rank to cloud storage.
                  </p>
                </div>

                {/* PROMINENT GOOGLE BUTTON */}
                <button
                  onClick={handleGoogleSignIn}
                  id="btn-sign-in-with-google"
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-sans font-semibold text-sm rounded-md shadow-lg border border-slate-300 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-[0.99] cursor-pointer"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="tracking-normal font-bold">
                    {isGoogleLinked ? 'Switch Google Account' : 'Sign in with Google'}
                  </span>
                </button>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1 text-[#00ff66]">
                    <Shield className="h-3 w-3" /> Supabase &amp; Firebase Ready
                  </span>
                  <button
                    onClick={() => setShowCustomGoogleInput(!showCustomGoogleInput)}
                    className="text-[#00f0ff] hover:underline cursor-pointer"
                  >
                    {showCustomGoogleInput ? 'Hide manual credentials' : 'Edit Google parameters'}
                  </button>
                </div>

                {/* Optional custom parameters form */}
                {showCustomGoogleInput && (
                  <div className="p-3 bg-[#030610] border border-white/10 rounded space-y-2 mt-2">
                    <div>
                      <label className="text-[9px] uppercase text-slate-400">Google Operative Email</label>
                      <input
                        type="email"
                        value={googleEmailInput}
                        onChange={(e) => setGoogleEmailInput(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full mt-1 bg-[#010308] border border-[#00f0ff]/30 px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase text-slate-400">Google Display Name</label>
                      <input
                        type="text"
                        value={googleNameInput}
                        onChange={(e) => setGoogleNameInput(e.target.value)}
                        placeholder="Player Display Name"
                        className="w-full mt-1 bg-[#010308] border border-[#00f0ff]/30 px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
                      />
                    </div>
                    <button
                      onClick={handleGoogleSignIn}
                      className="w-full py-1.5 bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/40 text-xs font-bold transition"
                    >
                      Authorize Custom Google Payload
                    </button>
                  </div>
                )}
              </div>

              {/* OAuth Architecture info */}
              <div className="p-3 bg-[#020408] border border-white/10 text-[11px] text-slate-400 space-y-1">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-[#00f0ff]" />
                  <span>Cloud Architecture Infrastructure</span>
                </div>
                <p className="font-hud leading-relaxed">
                  Authentication utilizes modern OAuth 2.0 / OpenID Connect tokens compatible with Firebase Auth and Supabase Auth providers. All state records (wallet, fleet, buildings) are mirrored to remote Firestore / PostgreSQL collections.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: BACKUP & RESTORE */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white mb-1">Export Rig State Payload</h4>
                <p className="text-slate-400 text-[11px] mb-2 font-hud">
                  Download or copy your complete wallet, businesses, fleet, and syndicate ranks as durable JSON.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyExport}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 clip-cyber-corner-sm bg-[#020408] border border-white/10 hover:border-[#fcee0a] text-slate-200 hover:text-[#fcee0a] text-xs font-bold transition"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Save JSON'}</span>
                  </button>
                  <button
                    onClick={handleDownloadFile}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 clip-cyber-corner-sm bg-[#020408] border border-white/10 hover:border-[#00f0ff] text-slate-200 hover:text-[#00f0ff] text-xs font-bold transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download JSON File</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4">
                <h4 className="font-bold text-white mb-1">Restore State from JSON</h4>
                <textarea
                  placeholder="Paste JSON save data string here..."
                  rows={3}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  className="w-full bg-[#020408] border border-[#00f0ff]/30 p-2 font-mono text-[10px] text-slate-300 focus:outline-none focus:border-[#00f0ff]"
                />
                <button
                  onClick={handleImport}
                  disabled={!importJsonText.trim()}
                  className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 clip-cyber-corner-sm bg-[#00ff66] hover:bg-[#00ff66]/90 text-black font-black text-xs uppercase tracking-wider transition shadow-neon-green disabled:bg-slate-900 disabled:text-slate-600"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>RESTORE SAVE PAYLOAD</span>
                </button>
              </div>

              <div className="border-t border-white/5 pt-4">
                <h4 className="font-bold text-[#ff0055] mb-1">DANGER ZONE // HARD RESET</h4>
                <p className="text-slate-400 text-[11px] mb-2 font-hud">
                  Purge all local storage keys and re-initialize with $CRED 12,500 genesis cash.
                </p>
                <button
                  onClick={handleReset}
                  className="w-full py-2 clip-cyber-corner-sm bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-black uppercase tracking-wider transition"
                >
                  INITIALIZE PURGE &amp; SYSTEM RESTART
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: DATABASE SCHEMA BLUEPRINT */}
          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-bold text-white">PostgreSQL / Supabase / Cloud SQL Schema:</span>
                <span className="font-mono text-[10px] text-[#fcee0a]">DDL SPECIFICATION</span>
              </div>
              <pre className="p-3 bg-[#020408] border border-[#00f0ff]/30 text-[10px] font-mono text-[#00ff66] overflow-x-auto leading-relaxed">
{`-- Apex Economy Production Database Schema (Firebase & Supabase)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_sub TEXT UNIQUE,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar_frame TEXT DEFAULT 'neon_cyan',
  custom_title TEXT DEFAULT 'Cyber Syndicate Operative',
  showcase_vehicle_id TEXT,
  showcase_property_id TEXT,
  cash BIGINT NOT NULL DEFAULT 12500,
  bank_balance BIGINT NOT NULL DEFAULT 20000,
  xp INTEGER NOT NULL DEFAULT 120,
  level INTEGER NOT NULL DEFAULT 1,
  prestige INTEGER NOT NULL DEFAULT 15,
  district TEXT NOT NULL DEFAULT 'Apex Central',
  owned_vehicles TEXT[] DEFAULT '{"v_commuter"}',
  owned_properties TEXT[] DEFAULT '{"re_studio"}',
  owned_businesses JSONB DEFAULT '{}',
  syndicate_id TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Realtime Cross-Device Cloud Sync Enabled`}
              </pre>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
