'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile } from '@/types';
import { Heart, MessageCircle, ArrowRight, Sparkles, X } from 'lucide-react';

interface MatchModalProps {
  matchedProfile: Profile | null;
  onClose: () => void;
  onOpenChat: (profile: Profile) => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  matchedProfile,
  onClose,
  onOpenChat,
}) => {
  useEffect(() => {
    if (matchedProfile) {
      // Trigger festive multi-burst confetti
      const count = 200;
      const defaults = {
        origin: { y: 0.6 },
        zIndex: 1000,
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#FF3366', '#FF5A79', '#FFD166'],
      });
      fire(0.2, {
        spread: 60,
        colors: ['#06D6A0', '#118AB2', '#FF3366'],
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [matchedProfile]);

  if (!matchedProfile) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-rose-500/30 p-6 text-center shadow-2xl shadow-rose-950/40 relative overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Celebratory badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Mutual Connection</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-rose-100 to-rose-400 bg-clip-text text-transparent mb-1 font-serif italic">
            It&apos;s a Match!
          </h2>

          <p className="text-xs text-slate-300 mb-6">
            You and <strong className="text-white">{matchedProfile.name}</strong> both liked each other.
          </p>

          {/* Overlapping profile avatars */}
          <div className="flex items-center justify-center -space-x-4 mb-7 relative py-2">
            {/* User Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-rose-500 to-pink-500 shadow-lg shadow-rose-500/20">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-950">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
                    alt="You"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Central Heart Badge */}
            <div className="z-10 w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center border-2 border-slate-950 shadow-md">
              <Heart className="w-4 h-4 fill-white" />
            </div>

            {/* Matched User Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-pink-500 to-rose-500 shadow-lg shadow-pink-500/20">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-950">
                  <img
                    src={matchedProfile.photo}
                    alt={matchedProfile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Icebreaker preview */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 mb-6 text-left">
            <span className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider block mb-1">
              Mutual Interests
            </span>
            <div className="flex flex-wrap gap-1">
              {matchedProfile.interests.slice(0, 3).map((interest) => (
                <span
                  key={interest}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800"
                >
                  #{interest}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => onOpenChat(matchedProfile)}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-500 text-white font-semibold text-sm shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send a Message</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-medium text-xs border border-slate-700/60 active:scale-[0.98] transition-all"
            >
              Keep Swiping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
