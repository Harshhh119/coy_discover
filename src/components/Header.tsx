'use client';

import React from 'react';
import { Flame, Sparkles, RotateCcw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'discover' | 'matches';
  setActiveTab: (tab: 'home' | 'discover' | 'matches') => void;
  matchesCount: number;
  onResetDemo: () => void;
  isResetting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  matchesCount,
  onResetDemo,
  isResetting,
}) => {
  return (
    <header className="w-full max-w-md mx-auto px-4 py-3 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Coy Logo */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
          <Flame className="w-5 h-5 text-white fill-white" />
        </div>
        <div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-rose-100 to-rose-400 bg-clip-text text-transparent">
            coy
          </span>
          <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
            Discover
          </span>
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="flex items-center gap-2">
        {/* Reset Demo button for reviewers */}
        <button
          onClick={onResetDemo}
          disabled={isResetting}
          title="Reset Demo (restores all mock profiles)"
          className="p-2 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-all border border-slate-800 text-xs flex items-center gap-1 active:scale-95 disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          <span className="text-[11px] hidden sm:inline">Reset</span>
        </button>

        {/* Matches Quick Pill */}
        <button
          onClick={() => setActiveTab('matches')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
            activeTab === 'matches'
              ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/25'
              : 'bg-slate-900/90 text-slate-200 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>Matches</span>
          {matchesCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse">
              {matchesCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
