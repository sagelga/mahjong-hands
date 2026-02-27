# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite development server
npm run build     # Type-check (tsc) then build for production
npm run test      # Run Jest test suite
npm run lint      # Run ESLint
```

To run a single test file:
```bash
npx jest tests/validator.test.ts
```

## Architecture

This is a React 19 + TypeScript + Vite SPA for validating and building Mahjong hands. It is deployed to Cloudflare Pages via `wrangler.json`.

### Core Logic (`src/lib/`)

- **`tiles.ts`** — Defines `TileDef` and `Suit` types plus the `MAHJONG_TILES` constant. Tile IDs follow a convention: `c1`–`c9` (Characters/Wan), `d1`–`d9` (Dots/Tong), `b1`–`b9` (Bamboo/Tiao), `h1`–`h7` (Honors), `f1`–`f8` (Flowers/Seasons). Flower tiles have a max of 1; all others max 4.
- **`validator.ts`** — `validateHand(tiles)` returns a `ValidationResult`. Flowers are stripped before validation. Supports two win conditions: Standard (4 Sets + 1 Pair at 14 tiles) and 7 Pairs. Uses memoized recursive `canDecompose` to try every possible pair as the "head" and decompose the rest into sets (Pung/Chow). The memoization cache is cleared on each call to `validateHand`.
- **`comboDetector.ts`** — `detectPotentialCombos(tiles)` returns detected `PotentialCombo[]`. Scans for pairs/pungs/kongs (identical tiles) and chows (3 consecutive numbered tiles of same suit). Does not account for already-grouped tiles; the caller filters results against `comboGroups`.

### State & Hooks (`src/hooks/`)

- **`useComboGroups.ts`** — Provides three `useCallback` helpers:
  - `updateComboGroupsAfterRemoval` — adjusts `ComboGroup` indices and downgrades combo types (kong→pung→pair) when a tile is removed.
  - `updateComboGroupsAfterReorder` — adjusts indices when tiles are drag-reordered.
  - `calculateComboFormation` — computes tile arrays and indices when upgrading a combo type.

### App State (`src/App.tsx`)

All hand state is managed in `AppContent`:
- `selectedTiles`: ordered array of `TileDef` (position matters for index-based combo tracking)
- `comboGroups`: array of formed `ComboGroup` objects, each holding tile references and **position indices** into `selectedTiles`
- `potentialCombos`: derived via `useMemo` from `selectedTiles`, filtered to exclude already-grouped tiles
- `validation`: derived via `useMemo` from `selectedTiles`

Adding a tile calls `detectPotentialCombos` and shows `ComboSelector` if the new tile is part of a newly detectable combo.

### Routing

React Router v7 with routes: `/` (hand builder), `/rules`, `/glossary`, `/scoring`, `/strategy`, `/about`. The Layout component wraps all routes; `AppContent` renders only at `/`.

### Styling

- Modular vanilla CSS: each component has a co-located `.css` file (e.g. `MahjongHand.css`)
- Design system in `src/styles/`: `variables.css` (CSS custom properties), `base.css` (resets), `layout.css` (containers)
- Self-hosted Inter fonts in `public/fonts/` with `font-display: swap`
- Winning state toggled via `document.body.classList` (`is-winning` class)

### Testing

Tests live in `tests/`. Jest runs with `ts-jest` + `jsdom` (configured via `jest.config.cjs`). Both `src/` and `tests/` are in the roots. React component tests use `@testing-library/react`.
