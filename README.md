# MSEC — M. S. Engineering College (Bengaluru)

An ultra high-craft, interactive website skeleton for **M. S. Engineering College (MSEC)**, Bengaluru (ESTD 2002 · VTU Affiliated · NAAC Accredited · KCET: E127 · COMEDK: E076), engineered in **pure TypeScript** with architectural blueprint canvas shaders and skeleton wireframe cards.

---

## 📁 Project Structure

```text
MSEC/
├── index.html            # Main semantic HTML5 entry (Liquid Glass nav, skeleton sections)
├── style.css             # Apple HIG tokens, Liquid Glass blur, skeleton shimmer, responsive grid
├── tsconfig.json         # TypeScript configuration targeting ES2022
├── package.json          # Pure TypeScript build & development scripts
│
├── src/                  # Strictly-typed TypeScript source files
│   ├── main.ts           # Main orchestrator (Lenis scroll, WebGL loop, parallax, clock)
│   ├── canvasBlueprint.ts# Algorithmic CAD blueprint & schematic canvas generator
│   ├── webglLiquid.ts    # WebGL liquid ripple distortion engine (monochrome)
│   └── types.ts          # Core type definitions
│
└── dist/                 # Compiled JavaScript output (ES2022 modules)
    ├── main.js
    ├── canvasBlueprint.js
    ├── webglLiquid.js
    └── types.js
```

---

## 🚀 Key Features

1. **Pure TypeScript Engine**:
   - Zero Next.js or framework overhead.
   - Strictly typed, modular source in `src/`.
   - Compiles via `tsc` to modern ES2022 browser modules in `dist/`.

2. **Apple Human Interface Guidelines & Liquid Glass**:
   - Translucent frosted glass navigation with `backdrop-filter: blur(24px) saturate(180%)`.
   - Accessible touch targets (≥ 44px) and WCAG AAA contrast ratios.
   - Smooth fluid typography with semantic hierarchy.
   - Live Indian Standard Time (IST) Bengaluru clock.

3. **Architectural Blueprint & Schematic Canvas**:
   - Stripped of heavy colors and photographic clutter.
   - Algorithmic CAD schematics with 40px/200px coordinate grid lines, corner crosshairs (`+`), and aspect ratio stamps (`16:9`, `4:3`, `4:5`, `1:1`, `7:5`, `3:4`).
   - WebGL liquid ripple distortion reacting to pointer interaction and scroll velocity.

4. **Skeleton Wireframe Cards**:
   - Stripped of marketing fluff and dense paragraphs.
   - Animated shimmer bars (`.skeleton-line`) for structural rhythm testing.
   - Real college department mappings:
     - Flagship: B.E. Artificial Intelligence & Machine Learning (`16:9`)
     - B.E. Computer Science & Engineering (`4:3`)
     - B.E. Electronics & Communication Engineering (`4:5`)
     - B.E. Information Science & Engineering (`4:5`)
     - B.E. CSE — Cyber Security & Data Science (`1:1`)
     - B.E. Mechanical Engineering (`7:5`)
     - B.E. Civil Engineering (`4:5`)
     - 25-Acre Bengaluru Airport Campus Hero (`3:4`)

---

## 🛠️ Development & Build

### Compile TypeScript
```bash
npm run build
```

### Watch Mode
```bash
npm run watch
```

### Serve Locally
```bash
npm run serve
```
Or open `index.html` directly in any web browser or local static server.
