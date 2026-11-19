'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Profile, SwipeAction } from '@/types';
import { MapPin, GraduationCap, Info, Heart, X, Sparkles } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
  isTopCard: boolean;
  onSwipe: (action: SwipeAction) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isTopCard,
  onSwipe,
}) => {
  const [showFullDetails, setShowFullDetails] = useState(false);

  // Motion values for gesture tracking
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-18, 18]);

  // Dynamic feedback badge opacities
  const likeOpacity = useTransform(x, [25, 120], [0, 1]);
  const likeScale = useTransform(x, [25, 120], [0.8, 1.05]);

  const nopeOpacity = useTransform(x, [-120, -25], [1, 0]);
  const nopeScale = useTransform(x, [-120, -25], [1.05, 0.8]);

  // Card shadow / border glow based on swipe direction
  const borderOpacity = useTransform(x, [-120, 0, 120], [0.8, 0, 0.8]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 100;
    const velocityThreshold = 400;

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      onSwipe('like');
    } else if (
      info.offset.x < -swipeThreshold ||
      info.velocity.x < -velocityThreshold
    ) {
      onSwipe('pass');
    }
  };

  if (!isTopCard) {
    // Render background card stacked beneath
    return (
      <div className="absolute inset-0 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-2xl scale-[0.95] translate-y-3 opacity-60 pointer-events-none select-none transition-transform duration-300">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${profile.photo})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-6 left-5 right-5 text-left">
            <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              {profile.name}, <span className="text-slate-300 font-medium">{profile.age}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {profile.city}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      style={{
        x,
        rotate,
        cursor: 'grab',
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className="absolute inset-0 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl touch-none select-none transition-shadow"
    >
      {/* Photo background */}
      <div
        className="w-full h-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${profile.photo})` }}
      >
        {/* Visual feedback badge: LIKE (Green Stamp on Right Drag) */}
        <motion.div
          style={{ opacity: likeOpacity, scale: likeScale }}
          className="absolute top-8 left-6 z-30 pointer-events-none border-4 border-emerald-400 text-emerald-400 font-extrabold text-2xl tracking-wider px-4 py-1.5 rounded-2xl rotate-[-15deg] shadow-lg shadow-emerald-500/30 uppercase bg-slate-950/40 backdrop-blur-sm flex items-center gap-1.5"
        >
          <Heart className="w-6 h-6 fill-emerald-400" />
          <span>LIKE</span>
        </motion.div>

        {/* Visual feedback badge: NOPE / PASS (Red Stamp on Left Drag) */}
        <motion.div
          style={{ opacity: nopeOpacity, scale: nopeScale }}
          className="absolute top-8 right-6 z-30 pointer-events-none border-4 border-rose-500 text-rose-500 font-extrabold text-2xl tracking-wider px-4 py-1.5 rounded-2xl rotate-[15deg] shadow-lg shadow-rose-500/30 uppercase bg-slate-950/40 backdrop-blur-sm flex items-center gap-1.5"
        >
          <X className="w-6 h-6" />
          <span>NOPE</span>
        </motion.div>

        {/* Top subtle vignette */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

        {/* Gradient dark overlay for text readability */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            showFullDetails
              ? 'from-slate-950 via-slate-950/95 to-slate-950/60'
              : 'from-slate-950 via-slate-950/60 to-transparent'
          } transition-all duration-300 pointer-events-none`}
        />

        {/* Card Content Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end text-left z-20">
          {/* Header row: Name, Age, Info button */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-2 drop-shadow-md">
              <span>{profile.name}</span>
              <span className="text-xl sm:text-2xl font-light text-slate-300">
                {profile.age}
              </span>
            </h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFullDetails(!showFullDetails);
              }}
              className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 backdrop-blur-md transition-all active:scale-95"
              aria-label="Toggle profile details"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Location & College badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-slate-300">
            <span className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800/80">
              <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
              <span>{profile.city}</span>
            </span>

            {profile.college && (
              <span className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800/80">
                <GraduationCap className="w-3 h-3 text-indigo-400 shrink-0" />
                <span>{profile.college}</span>
              </span>
            )}
          </div>

          {/* Bio text */}
          <p
            className={`text-xs sm:text-sm text-slate-200 leading-relaxed font-normal ${
              showFullDetails ? 'line-clamp-none' : 'line-clamp-2'
            } transition-all drop-shadow-sm`}
          >
            {profile.bio}
          </p>

          {/* Interests Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {profile.interests.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-800/80 text-rose-200 border border-slate-700/50 backdrop-blur-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Discreet double-blind notice at bottom */}
          <div className="mt-3.5 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Double-blind encrypted
            </span>
            <span>Only revealed if mutual</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
