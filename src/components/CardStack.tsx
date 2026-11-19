'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Profile, SwipeAction } from '@/types';
import { ProfileCard } from './ProfileCard';
import { X, Heart, Sparkles, RotateCcw, Flame } from 'lucide-react';

interface CardStackProps {
  profiles: Profile[];
  onSwipe: (profileId: string, action: SwipeAction) => void;
  isLoading: boolean;
  onResetDemo: () => void;
  isResetting: boolean;
  onGoToMatches: () => void;
  matchesCount: number;
}

export const CardStack: React.FC<CardStackProps> = ({
  profiles,
  onSwipe,
  isLoading,
  onResetDemo,
  isResetting,
  onGoToMatches,
  matchesCount,
}) => {
  const [exitDirection, setExitDirection] = useState<SwipeAction | null>(null);

  // Active top profile
  const currentProfile = profiles.length > 0 ? profiles[0] : null;
  const nextProfile = profiles.length > 1 ? profiles[1] : null;

  const handleCardSwipe = useCallback(
    (action: SwipeAction) => {
      if (!currentProfile) return;
      setExitDirection(action);

      // Trigger swipe action on parent
      setTimeout(() => {
        onSwipe(currentProfile.id, action);
        setExitDirection(null);
      }, 200);
    },
    [currentProfile, onSwipe]
  );

  // Desktop keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentProfile) return;
      if (e.key === 'ArrowRight') {
        handleCardSwipe('like');
      } else if (e.key === 'ArrowLeft') {
        handleCardSwipe('pass');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProfile, handleCardSwipe]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-full border-3 border-rose-500 border-t-transparent animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Curating your Discover feed...</p>
      </div>
    );
  }

  // Clear Empty State when all profiles have been swiped
  if (!currentProfile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center max-w-sm mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-xl shadow-rose-950/20 relative"
        >
          <Sparkles className="w-9 h-9 text-rose-500" />
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shadow-md">
            ✓
          </div>
        </motion.div>

        <h3 className="text-2xl font-extrabold text-slate-100 mb-2">
          You&apos;re All Caught Up! ✨
        </h3>

        <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
          You have reviewed all available profiles in your area. Any mutual likes have been added to your Matches tab!
        </p>

        {matchesCount > 0 && (
          <div className="w-full bg-rose-500/10 border border-rose-500/25 rounded-2xl p-4 mb-6 text-center">
            <span className="text-xs text-rose-300">You discovered</span>
            <div className="text-2xl font-black text-white my-0.5">
              {matchesCount} Mutual {matchesCount === 1 ? 'Match' : 'Matches'}
            </div>
            <button
              onClick={onGoToMatches}
              className="mt-2 text-xs font-bold text-rose-400 hover:text-rose-300 underline underline-offset-4"
            >
              View your matches →
            </button>
          </div>
        )}

        <div className="w-full space-y-2.5">
          <button
            onClick={onResetDemo}
            disabled={isResetting}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo Feed (Reload Profiles)</span>
          </button>

          <p className="text-[11px] text-slate-500">
            Resets swiped profiles and inbound likes for evaluation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-between w-full max-w-sm mx-auto px-4 py-2 pb-24">
      {/* Feed Counter / Remaining */}
      <div className="w-full flex items-center justify-between text-[11px] text-slate-400 px-2 mb-2">
        <span className="flex items-center gap-1 font-medium">
          <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>{profiles.length} profiles remaining</span>
        </span>
        <span className="text-slate-500 hidden sm:inline">
          Use ← / → arrows or drag
        </span>
      </div>

      {/* Card Arena */}
      <div className="relative w-full aspect-[3/4.2] max-h-[580px]">
        {/* Next Card underneath (gives depth) */}
        {nextProfile && (
          <ProfileCard
            key={nextProfile.id}
            profile={nextProfile}
            isTopCard={false}
            onSwipe={() => {}}
          />
        )}

        {/* Current Top Card with exit animation */}
        <AnimatePresence>
          {currentProfile && (
            <motion.div
              key={currentProfile.id}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                x: exitDirection === 'like' ? 450 : exitDirection === 'pass' ? -450 : 0,
                opacity: 0,
                rotate: exitDirection === 'like' ? 25 : exitDirection === 'pass' ? -25 : 0,
                transition: { duration: 0.25, ease: 'easeOut' },
              }}
              className="absolute inset-0"
            >
              <ProfileCard
                profile={currentProfile}
                isTopCard={true}
                onSwipe={handleCardSwipe}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop / Touch Action Control Buttons */}
      <div className="w-full flex items-center justify-center gap-6 mt-4">
        {/* Pass Button (Red X) */}
        <button
          onClick={() => handleCardSwipe('pass')}
          className="w-14 h-14 rounded-full bg-slate-900/90 border border-slate-800 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/50 hover:text-rose-400 active:scale-90 transition-all flex items-center justify-center shadow-lg shadow-black/40 group"
          aria-label="Pass"
        >
          <X className="w-7 h-7 group-hover:scale-110 transition-transform" />
        </button>

        {/* Like Button (Green / Pink Heart) */}
        <button
          onClick={() => handleCardSwipe('like')}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white hover:brightness-110 active:scale-90 transition-all flex items-center justify-center shadow-xl shadow-rose-600/30 group animate-pulse hover:animate-none"
          aria-label="Like"
        >
          <Heart className="w-8 h-8 fill-white group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};
