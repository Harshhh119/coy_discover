'use client';

import React from 'react';
import { MutualMatch, Profile } from '@/types';
import { Sparkles, MessageCircle, MapPin, Heart, Flame } from 'lucide-react';

interface MatchesViewProps {
  matches: MutualMatch[];
  isLoading: boolean;
  onOpenChat: (profile: Profile) => void;
  onGoToDiscover: () => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  isLoading,
  onOpenChat,
  onGoToDiscover,
}) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mb-4" />
        <p className="text-xs text-slate-400">Loading your mutual matches...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-5 text-slate-500 shadow-xl shadow-rose-950/10">
          <Heart className="w-7 h-7 text-rose-500/50" />
        </div>
        <h3 className="text-lg font-bold text-slate-100 mb-2">No Matches Yet</h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          When someone you like on Discover likes you back, your mutual match will appear right here.
        </p>
        <button
          onClick={onGoToDiscover}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 active:scale-95 transition-all flex items-center gap-2"
        >
          <Flame className="w-4 h-4 fill-white" />
          <span>Start Swiping on Discover</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-md mx-auto px-4 py-4 pb-24 overflow-y-auto">
      {/* Title & Stats */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Mutual Matches</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {matches.length}
            </span>
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Both of you liked each other secretly.
          </p>
        </div>
      </div>

      {/* Matches Grid / List */}
      <div className="space-y-3">
        {matches.map((match) => (
          <div
            key={match.id}
            onClick={() => onOpenChat(match.profile)}
            className="w-full bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-rose-500/40 rounded-2xl p-3 flex items-center gap-3.5 transition-all cursor-pointer group shadow-md"
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-rose-500/30 shadow-md">
                <img
                  src={match.profile.photo}
                  alt={match.profile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center border-2 border-slate-950">
                <Heart className="w-2.5 h-2.5 fill-white" />
              </div>
            </div>

            {/* Match info */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <h4 className="font-bold text-sm text-slate-100 truncate group-hover:text-rose-300 transition-colors">
                  {match.profile.name}, {match.profile.age}
                </h4>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {new Date(match.matchedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate mb-1">
                <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                <span>{match.profile.city}</span>
                {match.profile.college && (
                  <>
                    <span>•</span>
                    <span className="truncate">{match.profile.college}</span>
                  </>
                )}
              </p>

              <p className="text-[11px] text-rose-200/80 truncate">
                {match.lastMessage || 'Start the conversation!'}
              </p>
            </div>

            {/* Chat Action Icon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenChat(match.profile);
              }}
              className="p-2.5 rounded-xl bg-slate-800/80 group-hover:bg-rose-600 text-slate-300 group-hover:text-white transition-all shrink-0"
              title="Open Chat"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
