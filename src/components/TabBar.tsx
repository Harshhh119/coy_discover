'use client';

import React from 'react';
import { Home, Compass, Heart } from 'lucide-react';

interface TabBarProps {
  activeTab: 'home' | 'discover' | 'matches';
  setActiveTab: (tab: 'home' | 'discover' | 'matches') => void;
  matchesCount: number;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  setActiveTab,
  matchesCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/80 py-2 pb-5 sm:pb-3 max-w-md mx-auto">
      <div className="flex items-center justify-around px-6">
        {/* Placeholder Home Tab (Coy crush list placeholder) */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'home'
              ? 'text-rose-500 font-semibold'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px]">Home</span>
        </button>

        {/* Discover Tab (Core feature) */}
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center gap-1 transition-all relative ${
            activeTab === 'discover'
              ? 'text-rose-500 font-semibold'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <div className="relative">
            <Compass className={`w-5 h-5 ${activeTab === 'discover' ? 'text-rose-500' : ''}`} />
            {activeTab === 'discover' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-rose-500" />
            )}
          </div>
          <span className="text-[11px]">Discover</span>
        </button>

        {/* Matches Tab */}
        <button
          onClick={() => setActiveTab('matches')}
          className={`flex flex-col items-center gap-1 transition-all relative ${
            activeTab === 'matches'
              ? 'text-rose-500 font-semibold'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${activeTab === 'matches' ? 'text-rose-500 fill-rose-500' : ''}`} />
            {matchesCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-600 text-white">
                {matchesCount}
              </span>
            )}
          </div>
          <span className="text-[11px]">Matches</span>
        </button>
      </div>
    </nav>
  );
};
