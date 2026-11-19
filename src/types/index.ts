export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  city: string;
  college?: string;
  interests: string[];
}

export interface InternalProfile extends Profile {
  hasLikedUser: boolean; // Internal flag only: whether this seeded profile pre-liked the demo user
}

export type SwipeAction = 'like' | 'pass';

export interface SwipeRecord {
  id: string;
  userId: string;
  profileId: string;
  action: SwipeAction;
  timestamp: string;
}

export interface MatchRecord {
  id: string;
  userId: string;
  profileId: string;
  matchedAt: string;
}

export interface MutualMatch {
  id: string;
  profile: Profile;
  matchedAt: string;
  lastMessage?: string;
}

export interface SwipeRequest {
  profileId: string;
  action: SwipeAction;
}

export interface SwipeResponse {
  success: boolean;
  matched: boolean;
  profile?: Profile;
  message?: string;
}
