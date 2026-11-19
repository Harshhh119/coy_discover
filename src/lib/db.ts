import fs from 'fs';
import path from 'path';
import type { InternalProfile, Profile, SwipeRecord, MatchRecord, MutualMatch, SwipeAction } from '../types/index.ts';
import { SEED_PROFILES } from '../data/seedProfiles.ts';

export const CURRENT_USER_ID = 'user_coy_me';

interface DatabaseSchema {
  profiles: InternalProfile[];
  swipes: SwipeRecord[];
  matches: MatchRecord[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'coy_db.json');

// In-memory cache + file sync
class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    this.ensureDirectory();

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.profiles && parsed.swipes && parsed.matches) {
          return parsed;
        }
      } catch (err) {
        console.error('Failed to read database file, initializing fresh database:', err);
      }
    }

    // Default initialized state
    const initialData: DatabaseSchema = {
      profiles: [...SEED_PROFILES],
      swipes: [],
      matches: [],
    };

    this.saveToDisk(initialData);
    return initialData;
  }

  private saveToDisk(dataToSave: DatabaseSchema) {
    try {
      this.ensureDirectory();
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // Strip internal fields (e.g. hasLikedUser) to maintain Coy's core privacy guarantee
  public sanitizeProfile(profile: InternalProfile): Profile {
    // Explicitly destructure out hasLikedUser
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hasLikedUser, ...publicProfile } = profile;
    return publicProfile;
  }

  public getFeed(userId: string = CURRENT_USER_ID): Profile[] {
    const swipedProfileIds = new Set(
      this.data.swipes
        .filter((s) => s.userId === userId)
        .map((s) => s.profileId)
    );

    // Return only profiles that have not been swiped yet, strictly sanitized
    return this.data.profiles
      .filter((p) => !swipedProfileIds.has(p.id))
      .map((p) => this.sanitizeProfile(p));
  }

  public recordSwipe(
    profileId: string,
    action: SwipeAction,
    userId: string = CURRENT_USER_ID
  ): { success: boolean; matched: boolean; profile?: Profile; message?: string } {
    const profile = this.data.profiles.find((p) => p.id === profileId);

    if (!profile) {
      return { success: false, matched: false, message: 'Profile not found' };
    }

    // Check if user already swiped on this profile (idempotency)
    const existingSwipe = this.data.swipes.find(
      (s) => s.userId === userId && s.profileId === profileId
    );

    if (existingSwipe) {
      const isAlreadyMatched = this.data.matches.some(
        (m) => m.userId === userId && m.profileId === profileId
      );
      return {
        success: true,
        matched: isAlreadyMatched,
        profile: isAlreadyMatched ? this.sanitizeProfile(profile) : undefined,
        message: 'Profile already swiped',
      };
    }

    // 1. Record the swipe
    const newSwipe: SwipeRecord = {
      id: `swipe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      profileId,
      action,
      timestamp: new Date().toISOString(),
    };
    this.data.swipes.push(newSwipe);

    // 2. Matching logic: A match happens ONLY when both users have liked each other
    let isMatch = false;
    if (action === 'like' && profile.hasLikedUser) {
      isMatch = true;

      // Add to matches if not already present
      const alreadyMatched = this.data.matches.some(
        (m) => m.userId === userId && m.profileId === profileId
      );

      if (!alreadyMatched) {
        const newMatch: MatchRecord = {
          id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          userId,
          profileId,
          matchedAt: new Date().toISOString(),
        };
        this.data.matches.push(newMatch);
      }
    }

    // Persist changes
    this.saveToDisk(this.data);

    return {
      success: true,
      matched: isMatch,
      profile: isMatch ? this.sanitizeProfile(profile) : undefined,
    };
  }

  public getMatches(userId: string = CURRENT_USER_ID): MutualMatch[] {
    const userMatches = this.data.matches.filter((m) => m.userId === userId);
    const results: MutualMatch[] = [];

    for (const match of userMatches) {
      const profile = this.data.profiles.find((p) => p.id === match.profileId);
      if (profile) {
        results.push({
          id: match.id,
          profile: this.sanitizeProfile(profile),
          matchedAt: match.matchedAt,
          lastMessage: `You both liked each other! Say hello to ${profile.name.split(' ')[0]}.`,
        });
      }
    }

    return results.sort((a, b) => new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime());
  }

  public resetDemo(): { success: boolean; message: string } {
    this.data = {
      profiles: [...SEED_PROFILES],
      swipes: [],
      matches: [],
    };
    this.saveToDisk(this.data);
    return { success: true, message: 'Database reset to initial demo state' };
  }
}

// Singleton database instance
export const db = new DatabaseService();
