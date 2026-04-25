# Easy Triads

A drag-and-drop flashcard webapp for learning guitar triads. 36 movable triad shapes (Major / Minor / Diminished × 4 string sets × 3 inversions) rendered as interactive fretboard diagrams that users rearrange freely on a canvas.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**, **TypeScript**, **Tailwind v4**
- **@dnd-kit/core** — drag-and-drop
- **localStorage** — layout persists across reloads

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deploy to Vercel

The fastest path:

1. Push this directory to a GitHub repo (`gh repo create easy-triads --public --source . --push`).
2. Go to [vercel.com/new](https://vercel.com/new), import the repo — Vercel detects Next.js automatically.
3. Deploy. Assign a custom domain later under **Settings → Domains**.

Or deploy via CLI without GitHub:

```bash
npm i -g vercel
vercel            # preview deploy
vercel --prod     # production deploy
```

No environment variables or runtime config needed for this MVP — everything is static + client-side.

## Project structure

```
src/
  app/
    layout.tsx         # root layout + metadata
    page.tsx           # landing page (hosts the Board)
    globals.css
  components/
    board.tsx          # DndContext, library sidebar, droppable canvas, placed cards
    triad-card.tsx     # SVG fretboard renderer
  lib/
    triads.ts          # 36-card data (shape, inversion, fret offsets)
```

## Roadmap — v1 adds the paywall

v0 (this) is fully free and client-side. For v1:

- **Accounts + saved boards** → Supabase (auth + Postgres). Replace `localStorage` with a `boards` table keyed by user.
- **Checkout** → Stripe Checkout session; webhook flips a `paid` flag on the user row.
- **Paywall** → gate the full deck in `src/lib/triads.ts`; expose 6 cards free on `/`, full 36 on `/app` once `paid` is true.
- **Landing page** → add hero + pricing section above the board on `/`, keep the demo interactive.
