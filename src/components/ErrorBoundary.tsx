import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('APEX ENGINE ERROR INTERCEPTED:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('apex_economy_save_v2');
      localStorage.removeItem('apex_syndicates_save');
    } catch {}
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#040711] text-gray-100 flex items-center justify-center p-6 select-none font-mono">
          <div className="max-w-lg w-full glass-panel p-6 sm:p-8 rounded-xl border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-950/80 border border-red-500 flex items-center justify-center text-red-400">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="font-orbitron font-bold text-lg text-red-400 uppercase tracking-wide">
                  SYSTEM OVERRIDE DETECTED
                </h2>
                <p className="text-xs text-gray-400">
                  {this.props.fallbackTitle || 'Neural matrix encounter state anomaly'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-black/60 rounded-lg border border-gray-800 text-xs text-red-300 font-mono overflow-x-auto max-h-36 mb-6">
              {this.state.error?.message || 'Unknown runtime anomaly'}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto flex-1 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black font-orbitron font-bold text-xs rounded tracking-wider flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className="w-4 h-4" />
                REBOOT CONSOLE
              </button>
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-4 py-2.5 glass-panel text-red-400 hover:text-white border border-red-500/40 hover:border-red-500 font-orbitron font-bold text-xs rounded tracking-wider flex items-center justify-center gap-2 transition"
              >
                <RotateCcw className="w-4 h-4" />
                RESTORE DEFAULTS
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
