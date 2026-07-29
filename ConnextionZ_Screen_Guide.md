# ConnextionZ — Screen & Component Guide

> A complete walkthrough of every screen in the ConnextionZ creator collaboration platform, with annotated component breakdowns.

---

## Design System

| Token | Value | Usage |
|---|---|---|
| `--background` | `#0c0c0f` | App shell |
| `--primary` / `--accent` | `#00AEEF` | Electric blue — CTAs, active states, score pills |
| `--foreground` | `#f2f2f7` | Body text |
| `--border` | `rgba(255,255,255,0.08)` | Subtle dividers |
| `--card` | `#16161a` | Sheet and card surfaces |
| Font | **Plus Jakarta Sans** (400–800) | All type |
| Radius | `1rem` (base) | Rounded-2xl on sheets |

---

## Auth Flow (`src/app/Auth.tsx`)

### Screen 1 — Get Started

```
┌─────────────────────────────┐
│                             │
│   [Logo: ConnextionZ]       │  ← Wordmark — "Connext·ion·Z" with "ion" in #00AEEF
│                             │
│   [Hero badge]              │  ← 10K+ subscribers glow badge
│   10K+ Creators             │     rgba(0,174,239,0.55) bg, blue border + glow
│   already collaborating     │
│                             │
│   [Tagline copy]            │
│   The home for creators…    │
│                             │
│  ┌─────────────────────┐    │
│  │  Get Started  →     │    │  ← Primary CTA (blue gradient)
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │  Sign In            │    │  ← Ghost secondary button
│  └─────────────────────┘    │
│                             │
└─────────────────────────────┘
```

**Distinct Components**
- `Logo` — brand wordmark with inline `#00AEEF` span for "ion"
- **10K+ badge** — glow-ring pill: `rgba(0,174,239,0.55)` bg, `boxShadow: 0 0 16px rgba(0,174,239,0.7)`, white dot indicator, white extrabold number
- **Hero copy block** — tagline + sub-tagline, centred
- **Primary button** — `linear-gradient(135deg, #00AEEF, #0077cc)` with blue glow shadow
- **Ghost button** — `rgba(0,60,130,0.25)` bg + `rgba(0,174,239,0.2)` border

---

### Screen 2 — Login

```
┌─────────────────────────────┐
│  ← Back    [Logo]           │
│                             │
│  Welcome back               │
│  Sign in to continue        │
│                             │
│  ┌─ Email ───────────────┐  │  ← Input: rgba(0,80,160,0.12) bg
│  └───────────────────────┘  │    rgba(0,174,239,0.18) border
│  ┌─ Password ────────────┐  │
│  └───────────────────────┘  │
│                             │
│  [Forgot Password?]         │  ← Subtle link
│                             │
│  ┌─────────────────────┐    │
│  │  Sign In  →         │    │  ← Blue gradient CTA
│  └─────────────────────┘    │
│                             │
│  ── or continue with ──     │
│  [G]  [Apple]  [TikTok]     │  ← Social buttons: ghost + rgba(0,174,239,0.2) border
│                             │
│  Don't have an account?     │
│  [Create Account]           │
└─────────────────────────────┘
```

**Distinct Components**
- **Back button** — top-left chevron with opacity-60
- **Input fields** — dark blue-tinted bg, electric blue border, white text, placeholder at 30% opacity
- **Forgot password link** — muted `#00AEEF` text
- **Social sign-in row** — icon + label ghost buttons (Google / Apple / TikTok)
- **Switch screen link** — bottom text with inline `#00AEEF` anchor

---

### Screen 3 — Create Account

```
┌─────────────────────────────┐
│  ← Back    [Logo]           │
│                             │
│  Join ConnextionZ           │
│  Start collaborating today  │
│                             │
│  ┌─ Display Name ────────┐  │
│  └───────────────────────┘  │
│  ┌─ Username @───────────┐  │
│  └───────────────────────┘  │
│  ┌─ Email ───────────────┐  │
│  └───────────────────────┘  │
│  ┌─ Password ────────────┐  │
│  └───────────────────────┘  │
│                             │
│  ░░░░░░░░░░░░░░░  Weak      │  ← Password strength meter
│                             │
│  ☐ I agree to Terms…        │  ← Checkbox (blue check when ticked)
│                             │
│  ┌─────────────────────┐    │
│  │  Create Account  →  │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**Distinct Components**
- **Password strength meter** — 4-segment bar, colours: red (Weak) → amber (Good) → green (Strong)
- **Terms checkbox** — custom blue-filled box on tick
- **Four input fields** with distinct placeholder text

---

### Screen 4 — Forgot Password / Reset Sent

```
Forgot Password                Reset Sent
──────────────                 ──────────
[📧 envelope illustration]     [✅ success illustration]
Enter your email               Check your inbox
[Email input]                  We sent a link to…
[Send Reset Link]              [Open Email App]
← Back to Login               [Resend / Back]
```

**Distinct Components**
- **Illustration block** — large centred emoji/icon inside a rounded glassmorphism card
- **Two-state flow** — `forgotPassword` → `resetSent` on submit
- **Secondary action links** below the primary CTA

---

### Screens 5–7 — Onboarding (3 Steps)

#### Step 1: Categories

```
┌─────────────────────────────┐
│  Step 1 of 3  ●──○──○       │  ← Progress dots
│                             │
│  What do you create?        │
│  Pick your top categories   │
│                             │
│  [🎵 Music] [📹 Video]      │  ← 3-col grid of category chips
│  [📸 Photo] [💼 Brand]      │     Selected: purple bg + border
│  [🎮 Gaming] [🎙 Podcast]   │
│  [✨ Art] [📈 Business]     │
│                             │
│  ┌─────────────────────┐    │
│  │  Continue  →        │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

#### Step 2: Collab Types

```
Each collab type card has a unique coloured border:
┌──────────────────────────┐
│  🤝 Co-create content    │  ← border: #a855f7 (purple)
│  Work together on…       │
└──────────────────────────┘
┌──────────────────────────┐
│  💰 Brand Partnerships   │  ← border: #22c55e (green)
└──────────────────────────┘
┌──────────────────────────┐
│  🔴 Go Live Together     │  ← border: #ef4444 (red)
└──────────────────────────┘
```

#### Step 3: Presence Setup

```
┌─────────────────────────────┐
│  Set your collab presence   │
│                             │
│  [Avatar colour selector]   │  ← 6 colour swatches — tap to pick avatar colour
│                             │
│  ── Available for Collabs ──│  ← Toggle switch (blue when on)
│                             │
│  Response time:             │
│  [< 1hr] [Same day] [24hrs] │  ← Chip selector
│                             │
│  [Finish Setup →]           │
└─────────────────────────────┘
```

**Distinct Components (Onboarding-wide)**
- **Step progress dots** — 3 circles, active filled `#00AEEF`
- **Category chip grid** — 3-column, selected state uses `rgba(147,51,234,0.2)` (purple) bg + purple border
- **Collab type cards** — full-width with individual accent-colour left/top borders
- **Avatar colour swatches** — 6 circles, tap selects with white ring indicator
- **Toggle switch** — custom pill in blue when active
- **Response time chips** — horizontal chip row

---

## Main Feed (`src/app/App.tsx`)

### Full-Screen Video Feed

```
┌─────────────────────────────┐
│  Following    For You   [🔍]│  ← Top bar (transparent, blurred)
│              ━━━━━           │     "For You" has electric-blue underline
│                             │
│  [Full-screen video/image]  │  ← Unsplash thumbnail, bg-cover bg-center
│                             │
│               [Avatar + +]  │  ← Action Rail (right edge, bottom 1/3)
│               [♥ 284.7K]   │     Avatar → Like → Comment → Collab C →
│               [💬 4.8K]    │     Save → Share (airplane)
│               [C COLLAB]   │
│               [🔖 9.3K]    │
│               [✈ 12.4K]    │
│                             │
│  @zara.creates ✦ Open…     │  ← Video Info (bottom-left)
│  Caption text here…         │
│  #producer #musicmaker      │  ← Hashtags in #00AEEF
│  🎵 Original Sound — …    │  ← Scrolling audio ticker
│  ⭐ 4.9  Collab Score · 312 │  ← Collab rating pill
│                             │
│  ══════════════════════════ │  ← Bottom Nav (frosted)
│  🏠Feed  🔍Disc  ➕  📬  👤│
└─────────────────────────────┘
```

**Distinct Components**

| Component | Location | Detail |
|---|---|---|
| `TopBar` | Fixed top | "Following" / "For You" tab toggle, search icon |
| `ActionRail` | Right rail | Avatar, Like ♥, Comment 💬, Collab C, Save 🔖, Share ✈ |
| `CollabButton` | Inside `ActionRail` | Blue circle "C" — 24-shard explosion + shockwave ring on tap, then reappear bounce |
| `VideoInfo` | Bottom-left overlay | Username, caption, hashtags, audio ticker, collab score pill |
| **Collab score pill** | Below audio line | `rgba(0,174,239,0.12)` bg, blue border, ⭐ score + collabs count |
| **Progress dots** | Right edge, centre | Vertical dot bar — active dot elongates and turns `#00AEEF` |
| **Pause indicator** | Screen centre | `||` icon in frosted circle, appears/disappears on tap |
| `BottomNav` | Fixed bottom | Home · Discover · ➕ (blue pill) · Inbox · Profile |
| `LiveBannerStrip` | Above bottom nav | Horizontal avatar row of live creators + dashed "Go Live" circle |

---

### Collab Sheet (bottom sheet)

```
┌─────────────────────────────┐
│  ─────  (drag handle)       │
│  Collaborate with           │
│  @zara.creates         [✕]  │
│                             │
│  COLLABORATION TYPE         │
│  [🎵][📹][🎙][📈]          │  ← 4-col icon grid
│  [📸][🎮][💼][✨]          │     Selected: blue bg + border
│                             │
│  MESSAGE                    │
│  [Hey @zara, I'd love…]     │  ← Textarea: dark glass bg
│                             │
│  BUDGET                     │
│  [<$500][500-2K][2K-10K]…  │  ← Pill chip selector
│                             │
│  TIMELINE                   │
│  [ASAP][1-2wk][1mo][3mo+]  │
│                             │
│  ┌─────────────────────┐    │
│  │  ✈ Send Collab Req  │    │  ← Blue gradient CTA → "✓ Request Sent!"
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**Distinct Components**
- **Drag handle** — short pill at top of every bottom sheet
- **Type icon grid** — 4×2, tap to select, blue highlight state
- **Textarea** — `rgba(255,255,255,0.05)` bg, glass border
- **Pill chip rows** — Budget + Timeline selectors with blue-fill active state
- **Send button** — disabled (grey) until type is selected; morphs to "✓ Request Sent!" with `AnimatePresence`

---

### Comment Sheet (bottom sheet)

```
┌─────────────────────────────┐
│  ─────                      │
│  4.8K comments         [✕]  │
│  ─────────────────────────  │
│  [Avatar] @beatsby.kai  2h  │  ← CommentRow: avatar, username, timestamp
│  This is everything 🔥      │    comment text, Reply link, ♥ like count
│             ♥ 842           │
│  ─────────────────────────  │
│  [Avatar] @sxundcloud   3h  │
│  Waiting for that Friday…   │
│                             │
│  ─────────────────────────  │
│  [Y] Add a comment…   [✈]  │  ← Input bar: "Y" avatar, text input, send arrow
└─────────────────────────────┘
```

**Distinct Components**
- `CommentRow` — avatar + username + time header, comment text, Reply button, heart like toggle
- **Input bar** — user avatar initial "Y" in blue gradient, transparent input, send icon activates when text present
- **Scrollable list** — auto-scrolls to new comment on submit

---

### Share Sheet (bottom sheet)

```
┌─────────────────────────────┐
│  ─────                      │
│  Share                      │
│  @zara.creates's video [✕]  │
│  ─────────────────────────  │
│                             │
│  [IG][𝕏][W][TK]            │  ← Platform 4-col grid
│  [👻][f][✈][r/]            │     Each: rounded-2xl with platform brand color
│                             │  ← Tap → ✓ check overlay animation
│  ─────────────────────────  │
│                             │
│  connexionz.app/v/1  [Copy] │  ← URL bar + Copy Link button
│                             │     "Copy" → "Copied!" with blue flash
└─────────────────────────────┘
```

**Distinct Components**
- **Platform icons** — 8 platforms, each `rounded-2xl` with true brand background colors
- **Check overlay** — `rgba(0,0,0,0.45)` layer + `<Check />` icon animates in on tap
- **Copy link bar** — URL display + pill button, turns "Copied!" for 2s

---

## Discover / Trending Sounds (`src/app/TrendingSounds.tsx`)

### Sounds List

```
┌─────────────────────────────┐
│  ← Discover                 │
│  Trending Sounds 🔥         │
│                             │
│  [All][Pop][Hip-Hop][EDM]…  │  ← Genre filter pills (horizontal scroll)
│  ─────────────────────────  │
│  #1  🏆  "Midnight Rush"    │  ← SoundRow: rank medal, title, artist
│       ↑ 284%  💾 Save       │    Growth % badge in green, saves count
│  ─────────────────────────  │
│  #2  "Golden Hour"          │
│  ─────────────────────────  │
│  …                          │
└─────────────────────────────┘
```

**Distinct Components**
- **Genre pills** — horizontal scrolling filter, active = filled blue
- `SoundRow` — rank number, medal emoji for top 3, title + artist, growth arrow + percentage, bookmark save button

---

### Sound Detail

```
┌─────────────────────────────┐
│  ← Back    "Midnight Rush"  │
│            by @nova.dj      │
│                             │
│  ≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋  │  ← Animated waveform (CSS bars)
│                             │
│  [▶ Play]  [💾 Save]       │
│  [↗ Share]  [+ Use Sound]  │
│                             │
│  284,700 uses · ↑ 284%     │
│  ─────────────────────────  │
│  Featured Videos (3 rows)   │  ← Horizontal thumbnail scroll rows
│                             │
│  All Videos (grid)          │  ← 3-col video grid
│                             │
│  ┌─────────────────────┐    │
│  │  Use This Sound  →  │    │  ← Sticky CTA
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**Distinct Components**
- **Waveform animation** — row of bars with alternating heights, CSS keyframe animation
- **Action row** — Play, Save, Share, Use Sound (4 icon-buttons)
- **Usage stats strip** — uses count + growth percentage
- **Featured rows** — horizontal scroll of 3 video thumbnails with creator overlay
- **3-col grid** — all videos using the sound
- **Sticky footer CTA** — "Use This Sound"

---

### Video Viewer (inside Sound Detail)

```
┌─────────────────────────────┐
│                             │
│  [Full-screen video frame]  │
│                             │
│               [♥ Like]      │  ← Minimal right rail
│               [C Collab]    │
│               [✈ Share]    │
│                             │
│  @milo.visuals              │  ← Creator overlay
│  Golden hour was NOT…       │
│  [Open Profile]             │
└─────────────────────────────┘
```

---

## Go Live (`src/app/LiveStream.tsx`)

### Go Live Setup

```
┌─────────────────────────────┐
│  ✕ Cancel   Go Live         │
│                             │
│  ┌─────────────────────┐    │
│  │  [Camera preview]   │    │  ← Simulated camera frame
│  │  🎙 📹 ─────── flip │    │     with mic/cam toggle icons
│  └─────────────────────┘    │
│                             │
│  ┌─ Stream title ────────┐  │  ← Title input
│  └───────────────────────┘  │
│                             │
│  Category:                  │
│  [🎵 Music][📸 Photo][🎮]   │  ← Category chip grid
│                             │
│  ┌──────────────────────┐   │
│  │ 💡 Collab Note       │   │  ← Info card (blue tinted)
│  │ Viewers can request  │   │
│  │ to collaborate live  │   │
│  └──────────────────────┘   │
│                             │
│  ┌─────────────────────┐    │
│  │  🔴 Go Live!        │    │  ← Red gradient CTA
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**Distinct Components**
- **Camera preview frame** — simulated with dark gradient, mic/cam toggle icons, flip button
- **Title input** — character count indicator
- **Collab note card** — blue glassmorphism info card explaining the feature
- **Go Live CTA** — red gradient (`#ef4444`) button

---

### Creator Live View

```
┌─────────────────────────────┐
│  🔴 LIVE  👁 1,284   ✕ End │  ← LiveBadge: pulsing red pill + viewer count
│                             │
│  [Background feed video]    │
│                             │
│  ┌──────────────────────┐   │
│  │  🎵 nova.dj wants    │   │  ← CollabBanner (slides in from top)
│  │  to collab live!     │   │     with Accept / Decline buttons
│  │  [Accept] [Decline]  │   │
│  └──────────────────────┘   │
│                             │
│  🎙 📹                      │  ← Mic + cam toggle buttons (bottom left)
│                             │
│  ┌──────────────────────┐   │  ← ChatPanel (right side)
│  │  beatsby.kai: 🔥🔥  │   │     Scrolling messages with gradient fade
│  │  rave.rx: omg!!     │   │     + send input at bottom
│  │  [send message…]  ✈ │   │
│  └──────────────────────┘   │
│                             │
│  🎉 Collab Live!            │  ← CelebrationOverlay (full-screen, animated)
└─────────────────────────────┘
```

**Distinct Components**
- `LiveBadge` — pulsing red dot + "LIVE" text + eye icon + viewer count
- `CollabBanner` — slide-in card from top with Accept/Decline, auto-cycles every ~18s
- `ChatPanel` — real-time scrolling messages, gradient fade at top, send input
- **Mic/Cam toggles** — icon buttons, opacity change when off
- `CelebrationOverlay` — full-screen teal/blue gradient with "🎉 Collab Live!" text

---

### Viewer Live View

```
┌─────────────────────────────┐
│  🔴 LIVE  1,284  [Creator]  │  ← Live badge + creator name/avatar
│                             │
│  [Full-screen live bg]      │
│                             │
│               [♥ Like]      │  ← Floating hearts animate up on like
│               [C Collab]    │  ← Same 24-shard explosion collab button
│               [✈ Share]    │
│                             │
│  HYPERSONIC studio…         │  ← Stream title (bottom left)
│  @nova.dj                   │
│                             │
│  [chat messages…]           │  ← Chat overlay (bottom, scrolls up)
│  [Type a message…]    ✈     │  ← Chat input bar
│                             │
│  ┌── Collab Type Picker ──┐  │  ← CollabTypePicker sheet slides up
│  │  [🎵][📹][🎙][📈][✨] │     when collab button tapped
│  │  [Send Collab Request] │
│  └────────────────────────┘  │
└─────────────────────────────┘
```

**Distinct Components**
- `FloatingHearts` — staggered heart particles float upward from like button
- `LiveCollabBtn` — same `SHARDS` explosion as main feed collab button
- `CollabTypePicker` — 5-icon row sheet, Send Request CTA
- **Chat overlay** — semi-transparent, gradient-faded, real-time messages

---

### Live Banner Strip (Feed)

```
┌─────────────────────────────┐
│  [◎ Go Live] [🔴 nova.dj]  │  ← Horizontal avatar strip above BottomNav
│  [🔴 zara.c] [🔴 ren.film] │     Live ring: rotating gradient border
└─────────────────────────────┘
```

**Distinct Components**
- **Dashed "Go Live" circle** — plus icon, dashed border, tap → `GoLiveSetup`
- **Live avatar rings** — pulsing/rotating gradient border around creator avatars
- Horizontal scroll when many live creators

---

## Inbox (`src/app/Inbox.tsx`)

### Collab Requests Tab

```
┌─────────────────────────────┐
│  ← Inbox                   │
│  [Collab Requests 3][Msgs]  │  ← Tab bar with badge counts
│  ────────────────────────── │     Active tab: blue underline
│                             │
│  ┌──────────────────────┐   │
│  │ ━━━━━━━━━━━━━━━━━━━━ │   │  ← RequestCard top accent strip (creator colour)
│  │ [Avatar] nova.dj  ✓ │   │    Avatar, username, verified badge
│  │ 🎵 Music collab     │   │    Category pill in accent colour
│  │ ⭐4.8 · 52 mutual   │   │    Collab score + mutual collabs
│  │ "Hey! I've been a   │   │    Message preview (expandable)
│  │  fan of your work…" │   │
│  │ [Read more]         │   │    Read more / Show less toggle
│  │ [$500-2K][2wk][🌐]  │   │    Budget / Timeline / Remote pills
│  │ [Ignore] [Accept ✓] │   │    Action buttons
│  └──────────────────────┘   │
│                             │
│  [Empty state: ⚡ All done!] │  ← Shows when all requests handled
└─────────────────────────────┘
```

**Distinct Components**
- **Tab bar** — two tabs, animated blue underline tracks active tab, badge pills show counts
- `RequestCard` — coloured top strip, avatar + verified badge, category emoji pill, ⭐ score, expandable message, meta pills (budget/timeline/remote), Accept + Ignore buttons
- **Accept animation** — card dismisses, `CelebrationOverlay` fires
- **Ignore animation** — card slides left with scale-out exit
- `CelebrationOverlay` — 30 confetti particles + 🚀 emoji + pulse ring, 2.8s auto-dismiss
- **Empty state** — ⚡ icon + "All requests handled!" copy

---

### Messages Tab

```
┌─────────────────────────────┐
│  ← Inbox                   │
│  [Collab Req][Messages 2]   │
│  ────────────────────────── │
│  ┌──────────────────────┐   │
│  │ [Avatar] nova.dj  🟢 │   │  ← ConvoRow: avatar, green online dot
│  │ [C] Hey! Loved your  │   │    C collab badge (came from request)
│  │ just now     2        │   │    time + unread count badge
│  └──────────────────────┘   │
│  ┌──────────────────────┐   │
│  │ [Avatar] zara.creates│   │
│  │ Are you free next…   │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
```

**Distinct Components**
- `ConvoRow` — avatar, online dot (green), name, last message preview (bold if unread), time, unread badge
- **Collab badge "C"** — small circle icon on conversations that originated from a collab request

---

### DM Thread

```
┌─────────────────────────────┐
│  ← [Avatar] nova.dj  🟢    │  ← Thread header with back, avatar, name, online
│                  📞 📹 ⋮   │    Phone / video / more icons
│  ────────────────────────── │
│                             │
│             [me: Hey! 🎵]  │  ← My message: right-aligned, blue gradient bubble
│             ✓✓ Read        │    Read receipt
│                             │
│  [nova.dj: I saw your       │  ← Their message: left-aligned, dark surface bubble
│   latest track drop…]       │
│                             │
│  ────────────────────────── │
│  [😊] [Type message…]  [✈] │  ← Input: emoji, text, send arrow
└─────────────────────────────┘
```

**Distinct Components**
- **Thread header** — back button, avatar, name, online indicator, call icons
- **My bubbles** — right-aligned, `linear-gradient(135deg, #00AEEF, #0077cc)`
- **Their bubbles** — left-aligned, `rgba(255,255,255,0.08)` surface
- **Read receipts** — `✓✓` under sent messages in muted text
- **Message input** — emoji button, text field, send arrow (Enter key also sends)

---

## Settings / Profile (`src/app/Settings.tsx → SettingsScreen`)

```
┌─────────────────────────────┐
│  ← Settings                 │
│                             │
│  [Avatar]  @username     →  │  ← Profile card — taps through to Edit Profile
│  ⭐ 4.8 · 312 collabs       │
│                             │
│  Appearance                 │
│  ─ 🌙 Dark Mode      [on]  │  ← Theme switch
│                             │
│  Account                    │  ← Section header
│  ─ Edit Profile          →  │  ← Row with right chevron + current value
│  ─ Change Password       →  │
│  ─ Notification Prefs    →  │
│  ─ Privacy Settings Public→ │
│                             │
│  Creator                    │
│  ─ Collab Preferences    →  │
│  ─ Response Time  <4 hrs →  │
│  ─ Portfolio          3  →  │
│  ─ Analytics             →  │
│                             │
│  Support                    │
│  ─ Help Center           →  │
│  ─ Report a Problem      →  │
│  ─ Terms of Service      →  │
│  ─ Privacy Policy        →  │
│                             │
│  ─ Log Out               →  │
│  ─ Delete Profile        →  │  ← Red destructive row
└─────────────────────────────┘
```

**Distinct Components**
- **Profile card** — avatar (user's chosen colour), @username, email, collab score pill; the whole card is the Edit Profile tap target
- **Section labels** — uppercase muted category separators
- **Row items** — full-width tap targets with a right chevron and, where useful, the current value inline
- **Destructive rows** — Log Out and Delete Profile in `#ef4444` red
- **`SavedPill`** — transient "Preferences saved" toast; preference screens write on every tap rather than behind a Save button

### Destination screens (`src/app/SettingsPages.tsx`)

Every row above pushes onto a route stack rendered over the list (`x: "100%" → 0`,
spring damping 34). Back pops one level, so cross-links return to where you came from.

| Route | Screen | What it does |
|---|---|---|
| `editProfile` | Edit Profile | Avatar colour, display name, @username, bio, location, website; validates and persists via `updateProfile` |
| `changePassword` | Change Password | Current + new + confirm with a live requirements checklist; provider-only accounts get a "Set a Password" variant |
| `notifications` | Notification Preferences | Collaboration / Activity / Discovery toggles, email digest cadence, quiet hours |
| `privacy` | Privacy Settings | Private account, who-can-message, who-can-collab, visibility toggles, discoverability |
| `collabPreferences` | Collab Preferences | Open-to-collab, collab types, typical budget, categories, auto-screening + minimum Collab Score |
| `responseTime` | Response Time | Single-select with a live preview of how the profile will read |
| `portfolio` | Portfolio | Add / remove / feature work, with an empty state |
| `analytics` | Analytics | Four stat tiles, a single-series weekly views bar chart, ranked collab-request types, funnel |
| `helpCenter` | Help Center | Searchable FAQ accordion, cross-links to Report a Problem and the legal docs |
| `reportProblem` | Report a Problem | Topic choice, description, contact email, submitted confirmation |
| `terms` / `privacyPolicy` | Legal | Sectioned prose rendered from a `LegalDoc` shape |

**Persistence** — profile fields live on the `Account` in `auth-store.ts`; everything
else is per-account in `settings-store.ts`. Onboarding seeds both, so a new user's
Settings opens already reflecting their picks.

---

### Delete Profile Modal

```
Step 1 — Warning                 Step 2 — Confirm
─────────────────                ───────────────
[⚠️ Warning illustration]        [Type "DELETE"]
This will permanently            ┌─ Type DELETE ──┐
delete your account…             └────────────────┘
                                 ┌──────────────┐
[Keep Account]                   │ ⚠ Confirm    │  ← Enabled only when text matches
[Delete Profile →]               └──────────────┘
                                 [Cancel]
```

**Distinct Components**
- **Backdrop blur** — `rgba(0,0,0,0.7)` + `backdropFilter: blur(6px)` overlay
- **Two-step flow** — confirmation requires typing "DELETE"
- **Gated CTA** — Delete button is disabled/grey until text matches exactly
- `AnimatePresence` slide-in from bottom

---

## Animation Inventory

| Animation | Trigger | Technique |
|---|---|---|
| Feed swipe | Scroll / swipe / arrow key | `motion.div` spring slide Y |
| Collab button explosion | Tap | 24 `motion.div` shards radiate out + shockwave ring |
| Collab button reappear | After gone phase | Scale spring `[0, 1.35, 1]` |
| Sheet slide-in | Open action | `y: "100%" → 0`, spring damping 34 |
| Screen slide-in | Nav switch | `x: "100%" → 0`, spring damping 34 |
| Settings push | Tap a settings row | `SubPage` slides in over the list, spring damping 34 |
| Feed tab underline | For You ↔ Following | `layoutId="feed-tab-underline"` shared layout |
| Saved pill | Change a preference | Spring scale + rise, auto-dismiss after 1.4s |
| Pause indicator | Tap feed | Scale + opacity fade in/out |
| Like heart pop | Tap like | `scale: [1, 1.35, 1]` |
| Floating hearts (Live) | Tap live like | Staggered upward translate + opacity |
| Confetti (Inbox accept) | Accept request | 30 particles, random directions, `y` keyframes |
| Collab banner | Live collab request | Slide in from top, auto-dismiss |
| Nav active dot | Switch tab | `layoutId="nav-dot"` shared layout |
| Share check overlay | Tap platform | Scale in from 0 |
| Audio ticker | Always | `x: [0, -60, 0]` infinite loop |
| Waveform (Sounds) | Always | CSS `@keyframes` staggered bar heights |

---

## File Map

```
src/
├── app/
│   ├── App.tsx          Main feed, routing, all sheets, BottomNav, session
│   ├── Auth.tsx         AuthFlow — Get Started, Login, Create Account, reset, Onboarding
│   ├── auth-store.ts    Accounts, session, profile, password reset & change (prototype stub)
│   ├── Settings.tsx     SettingsScreen (list + route stack), DeleteProfileModal
│   ├── SettingsPages.tsx  The 12 settings destinations + the route table
│   ├── settings-ui.tsx  SubPage shell, Group/Row/ToggleRow/ChoiceRow, Field, tokens
│   ├── settings-store.ts  Per-account preferences (notifications, privacy, collab, portfolio)
│   ├── TrendingSounds.tsx  Discover tab, SoundDetail, VideoViewer
│   ├── LiveStream.tsx   GoLiveSetup, CreatorLiveView, ViewerLiveView, LiveBannerStrip
│   └── Inbox.tsx        InboxScreen, RequestCard, DMThread, CelebrationOverlay
├── styles/
│   ├── fonts.css        Google Fonts import (Plus Jakarta Sans)
│   ├── theme.css        CSS variables + @theme inline Tailwind mappings
│   └── index.css        Tailwind base + border/outline layer rules
```
