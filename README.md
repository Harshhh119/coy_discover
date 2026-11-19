# Coy SDE Intern Assignment: Discover Tab & Product Teardown

A standalone fullstack mobile-first application implementing the **"Discover"** swipe-based feature alongside Coy's existing experience, accompanied by a detailed product teardown and feature proposals.

---

## Table of Contents
1. [Part A: Product Teardown & Core Feature Proposals](#part-a-product-teardown--core-feature-proposals)
   - [Overview of Coy's Core Mechanism](#overview-of-coys-core-mechanism)
   - [Feature Proposal 1: Circle Hint (Privacy-Preserving Proximity Indicator)](#feature-proposal-1-circle-hint-privacy-preserving-proximity-indicator)
   - [Feature Proposal 2: Mutual Icebreaker Unlock (Graduated Post-Match Protocol)](#feature-proposal-2-mutual-icebreaker-unlock-graduated-post-match-protocol)
2. [Part B: "Discover" Tab Implementation](#part-b-discover-tab-implementation)
   - [Tech Stack](#tech-stack)
   - [Architecture & Core Privacy Guarantee](#architecture--core-privacy-guarantee)
   - [Key Features](#key-features)
   - [API Reference](#api-reference)
   - [Testing & Quality Assurance](#testing--quality-assurance)
   - [Getting Started](#getting-started)

---

## Part A: Product Teardown & Core Feature Proposals

### Overview of Coy's Core Mechanism
Coy (`app.getcoy.com`) is a double-blind crush-matching web app designed to eliminate the social fear of rejection. Users add up to 3 crushes by phone number or email. Recipients receive an anonymous notification stating that someone in their life has a crush on them. If and only if both individuals add each other, a mutual match is revealed. If either party never adds the other, zero identities are ever exposed.

Key consumer touchpoints explored:
- **Phone OTP Login:** Frictionless identity verification tying accounts directly to phone contacts.
- **Adding a Crush:** Inputting phone/email with immediate feedback on remaining crush slots.
- **Email Verification:** Security measure for notifications, backup recovery, and fraud deterrence.
- **Invite Links:** Viral distribution mechanism allowing users to invite their social circle to Coy.
- **Extra-Slots Screen:** Scarcity mechanism (3 default slots) encouraging referrals or micro-purchases to prevent spamming.

---

### Feature Proposal 1: "Circle Hint" (Privacy-Preserving Social Proximity Indicator)

#### 1. The Problem It Solves
The single largest drop-off in Coy's user journey occurs at the anonymous notification stage. When an off-platform crush receives an SMS/WhatsApp saying *"Someone has a crush on you on Coy"*, two friction points arise:
1. **Spam skepticism:** In an era of rampant phishing, generic anonymous links look like spam.
2. **Analysis paralysis & Slot Scarcity:** A recipient with 300+ contacts and only 3 slots will hesitate to guess blindly or create an account, fearing they will waste their slots or that the sender isn't someone they know.

#### 2. The Feature
When adding a crush, the sender can optionally select **one verified broad circle tag** from their shared context (e.g., *"We go to the same college: UC Berkeley"*, *"From Stanford Class of '24"*, or *"Met at Hackathon"*). 
The notification sent to the recipient includes this tag:
> *"Someone from UC Berkeley has a secret crush on you on Coy! See if you feel the same way."*

#### 3. Why It Is Required
- **Increases Notification-to-Registration Conversion:** Transforms a suspicious cold message into an intriguing, relevant social signal.
- **Guides Meaningful Slot Allocation:** Gives the recipient enough bounded context to use their 3 crush slots meaningfully without knowing *who* added them.

#### 4. Privacy Edge Cases & Mitigation
- **Deanonymization via Small Groups:** If a circle has only 2 or 3 people, attaching the tag immediately identifies the sender.
- **Mitigation (k-Anonymity Threshold):** Tags are only permitted for verified cohorts with **at least 25 registered members** ($k \ge 25$). For individual or tiny clubs, circle tags are disabled.

---

### Feature Proposal 2: "Mutual Icebreaker Unlock" (Graduated Post-Match Protocol)

#### 1. The Problem It Solves
In double-blind apps, the moment of a match triggers acute **vulnerability shock**. Both users know that they secretly added each other, which can lead to social paralysis (*"Now what do I say?"*, *"What if they only added me as a joke?"*). Leaving users stranded with raw phone numbers or social links often leads to frozen conversations and ghosting.

#### 2. The Feature
Upon a mutual match, Coy initiates an **ephemeral 48-hour icebreaker channel** inside the web app before prompting for phone/Instagram exchange:
1. **Blind Micro-Prompts:** Both users answer 3 lighthearted prompts (e.g., *"Our ideal first hangout: A) Rooftop coffee, B) Speakeasy jazz, C) Night drive"*). Answers are revealed simultaneously once both answer.
2. **Graduated Contact Reveal:** A single-click mutual consent button: *"Share Instagram / WhatsApp"*. Both users must press it for external contact details to be revealed.

#### 3. Why It Is Required
- **Converts Mutual Matches into Real Dates:** Replaces awkward silence with low-stakes playful momentum.
- **Safety & Harassment Protection:** Protects users from premature off-platform contact sharing before mutual comfort is established.

#### 4. Privacy Edge Cases & Mitigation
- **Unilateral Exits & Safety:** Either user can discreetly unmatch or report at any time during the 48-hour window without alerting the other user to an aggressive block.

---

## Part B: "Discover" Tab Implementation

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
