# MSEC — Standalone TypeScript Version

This is the standalone, pure TypeScript implementation of the Meenakshi Sundararajan Engineering College (MSEC) website.

## 📁 Files Included

- `index.html`: The HTML shell referencing the compiled script and CSS.
- `style.css`: All styles, responsive design, and CSS variables.
- `main.ts`: The complete, strongly typed DOM & WebGL interactive runtime.
- `types.ts`: TypeScript definitions for textures, uniforms, and Lenis.
- `tsconfig.json`: TypeScript configuration (targeting ES2022).
- `dist/`: Pre-compiled JavaScript output (`dist/main.js`).

## 🚀 How to Run

1. **Directly in Browser**:
   Open `index.html` in your browser (or use a local HTTP server such as `npx serve .` or VS Code Live Server for full WebGL texture loading).

2. **Recompile TypeScript**:
   If you make changes to `main.ts`:
   ```bash
   npx tsc
   ```
