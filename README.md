# MSEC — Meenakshi Sundararajan Engineering College

An ultra high-craft, interactive website for **Meenakshi Sundararajan Engineering College (MSEC)**, converted from the original single-file HTML into **both TypeScript and Next.js (App Router)**.

---

## 📁 Project Structure

```text
MSEC/
├── index (2).html                # Original standalone HTML file
│
├── src/                          # Next.js App Router (React + TypeScript)
│   ├── app/
│   │   ├── layout.tsx            # Root layout with Google Fonts & metadata
│   │   ├── page.tsx              # Main homepage entry orchestrator
│   │   └── globals.css           # Design tokens, CSS variables, and responsive layout
│   ├── components/               # Modular, typed React components
│   │   ├── Navigation.tsx        # Difference-blend header with live Chennai IST clock
│   │   ├── OverlayMenu.tsx       # Curtain reveal navigation overlay
│   │   ├── CustomCursor.tsx      # Smooth lerped interactive cursor with hover states
│   │   ├── InteractiveScene.tsx  # Coordinates WebGL, Lenis, parallax & animation frames
│   │   ├── Hero.tsx              # Kinetic split-character typography & stats
│   │   ├── Statement.tsx         # Scroll-driven word opacity reveal & legacy facts
│   │   ├── FeaturedSection.tsx   # AI & Data Science department showcase
│   │   ├── Marquee.tsx           # Velocity-driven kinetic ticker ribbon
│   │   ├── WorkGrid.tsx          # 6 undergraduate engineering departments
│   │   ├── CampusSection.tsx     # Campus facilities list (Labs, Library, etc.)
│   │   ├── PlacementsSection.tsx # Recruiters grid & alumni quote
│   │   ├── NewsSection.tsx       # Inverted hover news/events posts
│   │   └── AdmissionsContact.tsx # Admissions info, direct contact & back-to-top
│   ├── lib/
│   │   ├── types.ts              # Data models, interfaces, and shader types
│   │   ├── proceduralArt.ts      # 8 procedural generative canvas artworks + grain
│   │   └── webglLiquid.ts        # Typed WebGL liquid distortion shader engine
│   └── hooks/
│       └── ...
│
├── typescript/                   # Standalone Pure TypeScript Version
│   ├── index.html                # Standalone HTML harness
│   ├── main.ts                   # Strictly-typed TypeScript conversion of index.html
│   ├── types.ts                  # Type definitions for WebGL, DOM, and textures
│   ├── tsconfig.json             # TypeScript configuration targeting ES2022
│   └── dist/                     # Compiled JavaScript output
│
├── package.json                  # Scripts & dependencies (Next.js 15, React 19, Lenis)
├── tsconfig.json                 # Next.js TypeScript configuration
└── next.config.mjs               # Next.js configuration
```

---

## 🚀 Features Preserved & Enhanced

1. **WebGL Liquid Distortion**:
   - Custom vertex and fragment shaders featuring chromatic aberration (RGB split), fluid ripples driven by pointer movement, and velocity-based shear.
   - Dynamic viewport & scissor clipping mapping exactly to DOM `.media` elements.
   - Automatic fallback to 2D canvas texture generation if WebGL is unsupported.

2. **Procedural Generative Canvas Artworks**:
   - 8 bespoke algorithmic artworks generated on `<canvas>` (Neural constellation, Code field, Waveforms, Coil & Arc, Gears, Bridge arches, Network globe, and Arched dusk facade).
   - Custom procedural grain and vignette shaders.
   - Font loading detection with automatic high-resolution redraw.

3. **Kinetic Typography & Micro-Interactions**:
   - Split-character hero headline with staggered cubic-bezier transitions.
   - Scroll-driven word opacity reveal in the college statement.
   - Velocity-responsive marquee that tilts and accelerates based on scroll speed.
   - Custom lerping cursor with contextual tooltips (`Explore`, `Tour`, `Read`).
   - Live Chennai clock synced to Indian Standard Time (`Asia/Kolkata`).

4. **Smooth Scrolling**:
   - Native integration with [Lenis](https://github.com/darkroomengineering/lenis) for inertial scroll physics.
   - Accessible reduced-motion fallback honoring `prefers-reduced-motion`.

---

## 🛠️ Getting Started

### 1. Next.js Application (Recommended)

Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

To create an optimized production build:
```bash
npm run build
npm start
```

### 2. Standalone TypeScript Version

To recompile the pure TypeScript code in `typescript/`:
```bash
npm run build:ts
```
The compiled files are placed in `typescript/dist/`. You can open `typescript/index.html` directly in your browser or serve it with any static HTTP server (e.g. `npx serve typescript`).
