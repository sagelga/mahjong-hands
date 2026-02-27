# 🀄 Mahjong Hands Validator

[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

A premium, high-performance web application designed for validating and analyzing Mahjong hands. Built with a stunning "Midnight Black" aesthetic featuring green gradient highlights, this tool provides real-time feedback, intelligent grouping, and extensive educational resources for Mahjong players of all levels.

![Mahjong Hands Hero](/Users/kumamon/.gemini/antigravity/brain/e9691f59-52ee-4f6e-8df3-ca1762f22743/mahjong_hands_hero_1772127226582.png)

## ✨ Features

- 🏎️ **Real-Time Validation**: Instantly checks if your hand is a valid winning combination.
- 🧩 **Intelligent Grouping**: Automatically identifies and highlights **Pungs**, **Kongs**, and **Chows**, with smart collision resolution.
- 🛠️ **Interactive Tile Management**: Seamlessly add, remove, and reorder tiles.
- 🔍 **Logic Engine**: Supports standard 4-Set + 1-Pair wins and the elusive 7-Pairs win condition.
- 🌓 **Midnight Black Theme**: A sleek, premium dark mode design optimized for visibility, complemented by signature green gradients.
- 📱 **Fully Responsive**: Optimized for desktop precision and mobile accessibility. Popups and tooltips adjust smartly on mobile devices to prevent obstructing melded elements.
- 🌸 **Flower Tracking**: Dedicated counter for decorative flower tiles.
- ⚡ **Performance First**: Self-hosted fonts, efficient React hooks memoization, and optimized SVG assets for lightning-fast load times.

## � Multi-Page Educational Experience

Mahjong Hands isn't just a validator—it's a comprehensive learning platform:

- **Hand Builder** (`/`): The core interactive playground for testing out hand combinations.
- **Rules** (`/rules`): A comprehensive primer for new players detailing basic gameplay.
- **Glossary** (`/glossary`): A detailed visual guide to all Mahjong tiles and terms.
- **Scoring Guide** (`/scoring`): Understand the complex Fan system and how hands are valued.
- **Strategy Guide** (`/strategy`): Tips, waits (tenpai patterns), and mastery principles to level up your game.
- **About** (`/about`): Learn about the mission behind the Mahjong Hand Builder.

## �🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sagelga/mahjong-hands.git
   cd mahjong-hands
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 🛠️ Tech Stack

- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [React Router](https://reactrouter.com/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **State & Logic**: Custom Hooks (`useComboGroups`) + Memoized Validation Logic
- **Interactions**: [@dnd-kit](https://dnd-kit.com/) for drag-and-drop support
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Modular Vanilla CSS with design tokens, layout components, and scoped styles
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com/)

## 📂 Project Structure

```text
src/
├── components/      # React components with local styles (.tsx + .css)
│   ├── MahjongHand.tsx
│   ├── TileKeyboard.tsx
│   ├── StrategyGuide.tsx
│   └── ...
├── hooks/           # Custom React hooks
│   └── useComboGroups.ts # Logic for managing tile formations
├── styles/          # Design system core
│   ├── variables.css     # Design tokens (colors, spacing, etc.)
│   ├── base.css          # Resets and global styles
│   └── layout.css        # Core layout containers
├── lib/             # Core business logic
│   ├── validator.ts      # Winning hand algorithm
│   ├── comboDetector.ts  # Set/Group detection logic
│   └── tiles.ts          # Tile definitions & metadata
├── assets/          # Static resources
│   └── tiles/           # Optimized Mahjong tile SVGs
└── index.css        # Global entry point for styles
```

## 🧪 Development Workflow

- `npm run dev` - Start development server
- `npm run build` - Create production-ready bundle
- `npm run test` - Run Jest test suite
- `npm run lint` - Run ESLint for code quality

## ⚡ Performance Optimizations

### Font Self-Hosting
To minimize First Contentful Paint (FCP), the project uses self-hosted **Inter** fonts. This eliminates the render-blocking effects of external CDNs and allows for fine-grained control over font loading strategies.

- **Preload**: Critical font weights are preloaded.
- **Display**: `font-display: swap` ensures immediate text availability.

### Memory & State Management
Utilizes React's `useMemo` and `useCallback` effectively to prevent unnecessary recalculations of the hand logic and potential combo states whenever the user adds or removes a tile, leading to seamless interactions even with complex hand setups.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Developed with ❤️ for the Mahjong Community
</p>
