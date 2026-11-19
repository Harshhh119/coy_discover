# Coy SDE Intern Assignment: Discover Tab & Product Teardown

A standalone fullstack mobile-first application implementing the **"Discover"** swipe-based feature alongside Coy's existing experience, accompanied by a detailed product teardown and feature proposals.

---

"Discover" Tab Implementation](#part-b-discover-tab-implementation)
   - [Tech Stack](#tech-stack)
   - [Architecture & Core Privacy Guarantee](#architecture--core-privacy-guarantee)
   - [Key Features](#key-features)
   - [API Reference](#api-reference)
   - [Testing & Quality Assurance](#testing--quality-assurance)
   - [Getting Started](#getting-started)

---

"Discover" Tab Implementation

Built as a mobile-first standalone fullstack web application fulfilling all specifications from the Coy assignment.

### Tech Stack
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion (touch drag physics & spring animations), Lucide React, Canvas Confetti.
- **Backend:** Next.js Server Route Handlers (`/feed`, `/swipe`, `/matches`, `/api/reset`).
- **Data Layer:** Resilient file-backed persistent transactional store (`data/coy_db.json`) with an abstracted database service. Persists across page reloads and server restarts.
- **Testing:** Node.js native test runner (`node --test`) with 7 comprehensive unit and privacy tests.

---

### Architecture & Core Privacy Guarantee

```
┌────────────────────────────────────────────────────────┐
│                   Next.js Frontend                     │
│  - TabBar (Home [Blank Placeholder], Discover, Matches)│
│  - CardStack with Framer Motion drag gestures          │
│  - "It's a Match!" Celebration Modal + Confetti        │
│  - Interactive Chat Drawer with Icebreaker Suggestions │
└───────────────▲────────────────────────▲───────────────┘
                │ GET /feed              │ POST /swipe
                │ GET /matches           │
┌───────────────▼────────────────────────▼───────────────┐
│                   Backend API Handlers                 │
│  - app/feed/route.ts                                   │
│  - app/swipe/route.ts                                  │
│  - app/matches/route.ts                                │
└───────────────────────▲────────────────────────────────┘
                        │
┌───────────────────────▼────────────────────────────────┐
│               Database Service (db.ts)                 │
│  🔒 Privacy Sanitizer (Scrubs hasLikedUser)            │
│  🎯 Matching Engine (Evaluates double-blind condition) │
│  💾 Persistent Storage (data/coy_db.json)              │
└────────────────────────────────────────────────────────┘
```

#### 🔒 The Core Coy Privacy Guarantee
> *"Never reveal who has liked the user unless it is mutual; this is the core promise of Coy."*

- **Server-Side Sanitization:** The internal seed profiles have a `hasLikedUser: boolean` field in database storage. When `GET /feed` is queried, `db.sanitizeProfile()` **strictly destructures and strips** `hasLikedUser` before the JSON payload is dispatched.
- **Zero Client-Side Leakage:** Inspecting the network tab or Redux/React devtools reveals zero trace of who pre-liked the user.
- **Double-Blind Resolution:** A match is only created server-side inside `POST /swipe` when the incoming action is `'like'` AND the target user's internal `hasLikedUser` flag is true.

---

### Key Features
1. **32 Seeded Diverse Profiles:**
   - Realistic mock profiles featuring name, age, city, college, photography, witty bios, and interest tags.
   - 7 pre-seeded profiles have already liked the logged-in demo user (e.g., Rohan Mehta, Lucas Silva, Devansh Verma, Simran Gill, Ananya Roy, Siddharth Rao, Aditya Singhania, Vihaan Bhatia). Swiping right on any of them immediately triggers a mutual match!
2. **Smooth Swipe Experience:**
   - Mobile drag gestures powered by Framer Motion with natural card rotation, spring release, and threshold detection.
   - Clear visual feedback stamps: Green **LIKE** badge on right drag, Red **NOPE** badge on left drag.
   - Desktop buttons (Pass X, Like Heart, and arrow key navigation: `←` / `→`).
   - Cards that have been swiped on are removed permanently and never appear again.
3. **Empty State & Demo Reset:**
   - Celebratory empty state when the feed is exhausted.
   - "Reset Demo" button in the header and empty state to reload the 32 profiles for repeated evaluation.
4. **"It's a Match!" Screen:**
   - Multi-burst confetti celebration.
   - Overlapping profile avatars with glowing rings.
   - Direct shortcuts to "Send a Message" or "Keep Swiping".
5. **Matches View & Chat Simulator:**
   - Lists all mutual matches with timestamps.
   - Interactive sliding chat drawer with starter icebreakers tailored to the match's interests.

---

### API Reference

#### 1. `GET /feed`
Returns an array of sanitized profiles that the current user has not yet swiped on.
- **Response (200 OK):**
```json
[
  {
    "id": "coy_usr_01",
    "name": "Anya Sharma",
    "age": 22,
    "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb...",
    "bio": "Architecture student who lives on iced oat cortados...",
    "city": "San Francisco, CA",
    "college": "UC Berkeley",
    "interests": ["Architecture", "Film Photography", "Iced Matcha"]
  }
]
```
*(Notice: `hasLikedUser` is never present in this payload)*

#### 2. `POST /swipe`
Records a user's swipe decision on a profile.
- **Request Body:**
```json
{
  "profileId": "coy_usr_02",
  "action": "like"
}
```
- **Response (200 OK - Mutual Match):**
```json
{
  "success": true,
  "matched": true,
  "profile": {
    "id": "coy_usr_02",
    "name": "Rohan Mehta",
    "age": 23,
    "photo": "https://images.unsplash.com/photo-1506794778202...",
    "bio": "Software engineer by day, indie synth-pop producer...",
    "city": "Seattle, WA",
    "interests": ["Synthesizers", "Ramen", "Indie Rock"]
  }
}
```

#### 3. `GET /matches`
Returns the user's verified mutual matches.
- **Response (200 OK):**
```json
[
  {
    "id": "match_170000000",
    "profile": { ... },
    "matchedAt": "2026-11-19T07:30:00.000Z",
    "lastMessage": "You both liked each other! Say hello to Rohan."
  }
]
```

#### 4. `POST /api/reset`
Resets swipes and matches back to the initial demo state for testing.

---

### Testing & Quality Assurance

A dedicated automated test suite (`tests/backend.test.ts`) tests the matching logic and privacy constraints:
- `Feed returns seeded profiles initially (at least 30)`
- `CRITICAL PRIVACY TEST: Feed NEVER exposes hasLikedUser to client`
- `Swiping "like" on a profile that has NOT liked the user returns matched: false`
- `Swiping "like" on a profile that HAS pre-liked the user creates a mutual match`
- `Swiping "pass" on a profile that pre-liked the user does NOT create a match`
- `A swiped profile (like or pass) NEVER appears in the feed again`
- `Handles duplicate swipes idempotently without creating duplicate matches`

Run the test suite:
```bash
npm test
```

---

### Getting Started

#### Prerequisites
- Node.js 18+ (tested on Node 20 and Node 24)
- npm 9+

#### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Run automated tests
npm test

# 3. Start development server
npm run dev

# 4. Or build and start production server
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your mobile browser or desktop browser.
