# Phase 3: Landing Page

## What was added
- `frontend/src/pages/LandingPage.jsx` — assembles all 12 sections from
  your spec, renders at `/`.
- `frontend/src/components/landing/` — 13 new components, one per
  section: `Navbar`, `Hero`, `NetworkBackground` (the animated
  case-correlation canvas behind the hero — the page's signature visual,
  echoing the product's own Relationship Graph feature), `PoweredBy`,
  `Features`, `HowItWorks`, `DashboardPreview`, `Architecture`,
  `TechStack`, `AgentCards`, `Metrics`, `About`, `Contact`, `Footer`.

## Routing changes (the only thing touched in existing files)
- `App.jsx` — restructured so `/` renders `LandingPage` standalone (no
  sidebar/header), while every other route renders inside the exact same
  dashboard shell as before (same `Sidebar`, `Header`, `CaseModal`, same
  JSX — just extracted into a `DashboardShell` component so it can be
  conditionally skipped for `/`). `Dashboard` now lives at `/dashboard`.
  **No dashboard page component was modified.**
- `Sidebar.jsx` — one line changed: the "Dashboard" nav link now points
  to `/dashboard` instead of `/`, so it keeps working. Nothing else in
  that file touched.
- `index.html` — added a static meta description for SEO (title was
  already set).
- Verified no other page has a hardcoded link back to `/` — everything
  else (`/cases`, `/ai-analysis`, `/report`, etc.) was already
  independent of the root route and needed no changes.

## Two honest substitutions from the literal spec
1. **"Flask" → "FastAPI"** everywhere it appeared (Powered By, Tech
   Stack, Architecture diagram). Your backend is FastAPI now (Phase 1) —
   copy claiming Flask would just be wrong.
2. **"Screenshots of my existing dashboard"** — I don't have a way to
   capture your live running app from this sandbox, so the "Live
   Dashboard Preview" section uses small illustrative CSS/SVG
   recreations inside the MacBook/tablet device frames instead of real
   screenshots — styled to match your actual color system and layout
   language, but not literal captures. If you want the real thing,
   screenshot your dashboard yourself and I can swap them in as actual
   `<img>` elements in `DashboardPreview.jsx`.

## One thing you need to fill in
`components/landing/Contact.jsx` has three empty constants at the top —
`GITHUB_URL`, `LINKEDIN_URL`, `EMAIL_ADDRESS`. I don't have your actual
profile links, so I left them empty rather than invent fake ones; the
buttons render disabled (grayed out, non-clickable) until you fill
these in. Two-minute fix:
```js
const GITHUB_URL = 'https://github.com/yourusername';
const LINKEDIN_URL = 'https://linkedin.com/in/yourusername';
const EMAIL_ADDRESS = 'you@example.com';
```

## Agent list updated to match reality
The spec's original "AI Agents" section listed 5 agents (Evidence
Processing, Case Similarity, Timeline Reconstruction, Pattern Discovery,
Recommendation). Since Phase 2 actually built a real 9-agent pipeline,
`AgentCards.jsx` and `HowItWorks.jsx` show all 9 real agents instead —
more accurate, and honestly more impressive than what the original copy
described.

## Design notes
Reused your existing design tokens exactly (background `#0D1016`, card
`#161B22`, gold `#C9902E`, teal `#3FA9A0`, red `#D15B5B`, IBM Plex
Sans/Mono) so the landing page and dashboard feel like one continuous
product rather than two different sites bolted together — no new fonts
or colors introduced.

## Verified without a running dev server
No network access in this sandbox means no `npm install`/`vite build`
here. What I did check:
- Every new/changed `.jsx` file parses cleanly (checked via TypeScript's
  JSX parser, which catches syntax errors independent of a full build).
- Grepped the whole frontend for any other file with a hardcoded link to
  `/` that Dashboard's move might have broken — found none.
- Confirmed `framer-motion@^11.11.0` (already in your `package.json`)
  supports `useInView`/`animate`, which `Metrics.jsx` uses for the
  counter animation.

**Your first real test:** `npm run dev`, visit `/` — you should land on
the new page instead of the dashboard. Click "Launch Platform" and
confirm it takes you to `/dashboard` with the exact same dashboard you
had before. If anything doesn't render or throws a console error, send
me the error and I'll fix it.
