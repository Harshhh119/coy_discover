'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { TabBar } from '@/components/TabBar';
import { CardStack } from '@/components/CardStack';
import { MatchesView } from '@/components/MatchesView';
import { HomeTab } from '@/components/HomeTab';
import { MatchModal } from '@/components/MatchModal';
import { ChatDrawer } from '@/components/ChatDrawer';
import { Profile, MutualMatch, SwipeAction, SwipeResponse } from '@/types';

export default function DiscoverApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'matches'>('discover');
  const [feed, setFeed] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<MutualMatch[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Modal / Drawer state
  const [celebrationMatch, setCelebrationMatch] = useState<Profile | null>(null);
  const [chatProfile, setChatProfile] = useState<Profile | null>(null);

  // 1. Fetch Feed from GET /feed
  const fetchFeed = useCallback(async () => {
    try {
      setIsLoadingFeed(true);
      const res = await fetch('/feed');
      if (res.ok) {
        const data: Profile[] = await res.json();
        setFeed(data);
      }
    } catch (err) {
      console.error('Failed to load feed:', err);
    } finally {
      setIsLoadingFeed(false);
    }
  }, []);

  // 2. Fetch Matches from GET /matches
  const fetchMatches = useCallback(async () => {
    try {
      setIsLoadingMatches(true);
      const res = await fetch('/matches');
      if (res.ok) {
        const data: MutualMatch[] = await res.json();
        setMatches(data);
      }
    } catch (err) {
      console.error('Failed to load matches:', err);
    } finally {
      setIsLoadingMatches(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    fetchMatches();
  }, [fetchFeed, fetchMatches]);

  // 3. Handle Swipe (POST /swipe)
  const handleSwipe = async (profileId: string, action: SwipeAction) => {
    // Optimistic UI update: remove from feed immediately
    const swipedProfile = feed.find((p) => p.id === profileId);
    setFeed((prev) => prev.filter((p) => p.id !== profileId));

    try {
      const res = await fetch('/swipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId, action }),
      });

      if (res.ok) {
        const data: SwipeResponse = await res.json();
        if (data.matched) {
          // Trigger the "It's a Match!" celebration screen
          const matchProfile = data.profile || swipedProfile;
          if (matchProfile) {
            setCelebrationMatch(matchProfile);
          }
          // Refresh matches list
          fetchMatches();
        }
      }
    } catch (err) {
      console.error('Failed to record swipe:', err);
    }
  };

  // 4. Handle Reset Demo (POST /api/reset)
  const handleResetDemo = async () => {
    try {
      setIsResetting(true);
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        await Promise.all([fetchFeed(), fetchMatches()]);
      }
    } catch (err) {
      console.error('Failed to reset demo:', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-slate-950 flex flex-col justify-between items-center relative overflow-hidden">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        matchesCount={matches.length}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
      />

      {/* Main Tab Content */}
      <div className="w-full flex-1 flex flex-col items-center justify-center">
        {activeTab === 'home' && (
          <HomeTab onGoToDiscover={() => setActiveTab('discover')} />
        )}

        {activeTab === 'discover' && (
          <CardStack
            profiles={feed}
            onSwipe={handleSwipe}
            isLoading={isLoadingFeed}
            onResetDemo={handleResetDemo}
            isResetting={isResetting}
            onGoToMatches={() => setActiveTab('matches')}
            matchesCount={matches.length}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesView
            matches={matches}
            isLoading={isLoadingMatches}
            onOpenChat={(profile) => setChatProfile(profile)}
            onGoToDiscover={() => setActiveTab('discover')}
          />
        )}
      </div>

      {/* Bottom Tab Bar */}
      <TabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        matchesCount={matches.length}
      />

      {/* "It's a Match!" Celebration Screen */}
      <MatchModal
        matchedProfile={celebrationMatch}
        onClose={() => setCelebrationMatch(null)}
        onOpenChat={(profile) => {
          setCelebrationMatch(null);
          setChatProfile(profile);
        }}
      />

      {/* Interactive Chat / Conversation Drawer */}
      <ChatDrawer
        profile={chatProfile}
        onClose={() => setChatProfile(null)}
      />
    </main>
  );
}
