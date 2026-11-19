'use client';

import React from 'react';
import { Flame, Compass, Lock, Users, ShieldCheck } from 'lucide-react';

interface HomeTabProps {
  onGoToDiscover: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onGoToDiscover }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-sm mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-xl shadow-rose-950/20 relative">
        <Flame className="w-8 h-8 text-rose-500 fill-rose-500" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center">
          <Lock className="w-3 h-3 text-slate-400" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-100 mb-2">
        Coy Crush List
      </h2>
      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        This is the placeholder for Coy&apos;s original double-blind crush list experience (Phone OTP, Invite Link, Extra-Slots).
      </p>

      <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 mb-8 text-left space-y-3">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[12px] text-slate-300">
            <strong className="text-slate-100">Double-Blind Privacy:</strong> Crushes are strictly confidential. Nobody finds out unless it&apos;s mutual.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Users className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-[12px] text-slate-300">
            <strong className="text-slate-100">Assigned Task:</strong> Per specification, the &ldquo;Home&rdquo; tab is kept blank/placeholder, and the full swipe experience lives in the &ldquo;Discover&rdquo; tab.
          </p>
        </div>
      </div>

      <button
        onClick={onGoToDiscover}
        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-500 text-white font-semibold text-sm shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <Compass className="w-4 h-4" />
        <span>Open Discover Tab</span>
      </button>
    </div>
  );
};
