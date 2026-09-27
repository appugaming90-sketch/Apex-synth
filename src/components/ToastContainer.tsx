import React from 'react';
import { useGame } from '../context/GameContext';
import { formatCash } from '../utils/format';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X, Layers } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGame();

  if (toasts.length === 0) return null;

  // Show only the latest toast in a single stacked card to prevent screen overflow
  const currentToast = toasts[0];
  const stackedCount = toasts.length;

  let borderClass = 'border-[#00f0ff]/50 bg-[#040916] shadow-neon-cyan';
  let icon = <Info className="h-4 w-4 text-[#00f0ff]" />;

  if (currentToast.type === 'success') {
    borderClass = 'border-[#00ff66]/60 bg-[#02130e] shadow-neon-green';
    icon = <CheckCircle2 className="h-4 w-4 text-[#00ff66]" />;
  } else if (currentToast.type === 'danger') {
    borderClass = 'border-[#ff0055]/70 bg-[#16040b] shadow-neon-magenta';
    icon = <AlertCircle className="h-4 w-4 text-[#ff0055]" />;
  } else if (currentToast.type === 'warning') {
    borderClass = 'border-[#fcee0a]/60 bg-[#151202] shadow-neon-yellow';
    icon = <AlertTriangle className="h-4 w-4 text-[#fcee0a]" />;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full pointer-events-none px-4 sm:px-0 font-mono">
      <div className="relative pointer-events-auto">
        {/* Layered stack visual effect when multiple notifications arrive */}
        {stackedCount > 1 && (
          <>
            <div className="absolute -top-1.5 -left-1.5 -right-1.5 h-full rounded border border-cyan-500/20 bg-slate-900/60 -z-10" />
            {stackedCount > 2 && (
              <div className="absolute -top-3 -left-3 -right-3 h-full rounded border border-cyan-500/10 bg-slate-950/40 -z-20" />
            )}
          </>
        )}

        <div
          key={currentToast.id}
          className={`flex items-start gap-3 rounded-lg border p-3.5 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${borderClass}`}
        >
          <div className="mt-0.5 shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <h4 className="text-xs font-black text-white truncate tracking-wider uppercase">
                  {currentToast.title}
                </h4>
                {stackedCount > 1 && (
                  <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.2 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded flex items-center gap-1">
                    <Layers className="w-2.5 h-2.5" />
                    +{stackedCount - 1}
                  </span>
                )}
              </div>
              {currentToast.amount !== undefined && (
                <span className="font-mono-nums text-xs font-black text-[#fcee0a] text-glow-yellow shrink-0">
                  +{formatCash(currentToast.amount)}
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-slate-300 leading-snug">
              {currentToast.message}
            </p>
          </div>
          <button
            onClick={() => {
              // Clear current or all stacked toasts
              removeToast(currentToast.id);
            }}
            className="shrink-0 text-slate-400 hover:text-white transition p-0.5"
            title="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
