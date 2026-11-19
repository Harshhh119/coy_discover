import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../src/lib/db.ts';
import { SEED_PROFILES } from '../src/data/seedProfiles.ts';

describe('Coy Discover Backend Logic & Privacy Tests', () => {
  beforeEach(() => {
    db.resetDemo();
  });

  test('Feed returns seeded profiles initially (at least 30)', () => {
    const feed = db.getFeed();
    assert.ok(feed.length >= 30, `Expected at least 30 profiles, got ${feed.length}`);
    const first = feed[0];
    assert.ok(first.id, 'id is missing');
    assert.ok(first.name, 'name is missing');
    assert.ok(first.age, 'age is missing');
    assert.ok(first.photo, 'photo is missing');
    assert.ok(first.bio, 'bio is missing');
    assert.ok(first.city, 'city is missing');
    assert.ok(Array.isArray(first.interests), 'interests is missing or not array');
  });

  test('CRITICAL PRIVACY TEST: Feed NEVER exposes hasLikedUser to client', () => {
    const feed = db.getFeed();
    for (const profile of feed) {
      assert.strictEqual(
        (profile as any).hasLikedUser,
        undefined,
        `Privacy leak! Profile ${profile.name} exposed hasLikedUser`
      );
    }
  });

  test('Swiping "like" on a profile that has NOT liked the user returns matched: false', () => {
    const target = SEED_PROFILES.find((p) => !p.hasLikedUser)!;
    const result = db.recordSwipe(target.id, 'like');

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.matched, false);
    assert.strictEqual(result.profile, undefined);

    // Verify it is not in matches list
    const matches = db.getMatches();
    assert.strictEqual(matches.some((m) => m.profile.id === target.id), false);
  });

  test('Swiping "like" on a profile that HAS pre-liked the user creates a mutual match', () => {
    const target = SEED_PROFILES.find((p) => p.hasLikedUser)!;
    const result = db.recordSwipe(target.id, 'like');

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.matched, true);
    assert.ok(result.profile, 'Expected profile to be returned on match');
    assert.strictEqual(result.profile?.id, target.id);
    assert.strictEqual(result.profile?.name, target.name);
    // Crucial: returned profile must also have hasLikedUser scrubbed
    assert.strictEqual((result.profile as any)?.hasLikedUser, undefined);

    // Verify it appears in GET /matches
    const matches = db.getMatches();
    assert.strictEqual(matches.length, 1);
    assert.strictEqual(matches[0].profile.id, target.id);
  });

  test('Swiping "pass" on a profile that pre-liked the user does NOT create a match', () => {
    const target = SEED_PROFILES.find((p) => p.hasLikedUser)!;
    const result = db.recordSwipe(target.id, 'pass');

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.matched, false);

    const matches = db.getMatches();
    assert.strictEqual(matches.length, 0);
  });

  test('A swiped profile (like or pass) NEVER appears in the feed again', () => {
    const initialFeed = db.getFeed();
    const firstProfile = initialFeed[0];
    const secondProfile = initialFeed[1];

    db.recordSwipe(firstProfile.id, 'like');
    db.recordSwipe(secondProfile.id, 'pass');

    const updatedFeed = db.getFeed();
    assert.strictEqual(updatedFeed.length, initialFeed.length - 2);
    assert.strictEqual(updatedFeed.some((p) => p.id === firstProfile.id), false);
    assert.strictEqual(updatedFeed.some((p) => p.id === secondProfile.id), false);
  });

  test('Handles duplicate swipes idempotently without creating duplicate matches', () => {
    const target = SEED_PROFILES.find((p) => p.hasLikedUser)!;

    // First swipe
    const firstResult = db.recordSwipe(target.id, 'like');
    assert.strictEqual(firstResult.matched, true);

    // Second swipe (e.g. duplicate network request or re-click)
    const secondResult = db.recordSwipe(target.id, 'like');
    assert.strictEqual(secondResult.success, true);
    assert.strictEqual(secondResult.matched, true);

    // Matches array should have exactly 1 record, never duplicates
    const matches = db.getMatches();
    assert.strictEqual(matches.filter((m) => m.profile.id === target.id).length, 1);
  });
});
