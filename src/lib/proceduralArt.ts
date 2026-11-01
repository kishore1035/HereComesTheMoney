export const TEXTURE_SIZES: ReadonlyArray<[number, number]> = [
  [2000, 1050], // 0 AI & DS
  [1400, 1050], // 1 CSE
  [1000, 1250], // 2 ECE
  [1150, 1150], // 3 EEE
  [1000, 1250], // 4 Mech
  [1400, 1000], // 5 Civil
  [1000, 1250], // 6 IT
  [1000, 1300], // 7 Hero
];

export function createSeededRandom(seed: number = 7) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

export function createNoiseCanvas(): HTMLCanvasElement {
  const nc = document.createElement('canvas');
  nc.width = nc.height = 160;
  const ctx = nc.getContext('2d');
  if (ctx) {
    const d = ctx.createImageData(160, 160);
    for (let i = 0; i < d.data.length; i += 4) {
      const v = Math.random() * 255;
      d.data[i] = v;
      d.data[i + 1] = v;
      d.data[i + 2] = v;
      d.data[i + 3] = 255;
    }
    ctx.putImageData(d, 0, 0);
  }
  return nc;
}

export function applyGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  noiseCanvas: HTMLCanvasElement
) {
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.globalCompositeOperation = 'overlay';
  const pattern = ctx.createPattern(noiseCanvas, 'repeat');
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.restore();
}

export function applyVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  alpha = 0.55
) {
  const g = ctx.createRadialGradient(
    width / 2,
    height / 2,
    height * 0.25,
    width / 2,
    height / 2,
    height * 0.8
  );
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, `rgba(0,0,0,${alpha})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
}

export type ArtGenerator = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rnd: () => number
) => void;

export const ART_GENERATORS: ArtGenerator[] = [
  // 0 AI & DS — neural constellation
  (ctx, width, height, rnd) => {
    let g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, '#0a0f1c');
    g.addColorStop(1, '#1c1430');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    const layers = [5, 9, 12, 9, 4];
    const pts: [number, number, number][] = [];
    layers.forEach((n, l) => {
      const lx = width * (0.18 + l * 0.16);
      for (let i = 0; i < n; i++) {
        pts.push([
          lx,
          height * (0.5 + (i - (n - 1) / 2) * (0.7 / Math.max(...layers))),
          l,
        ]);
      }
    });

    ctx.lineWidth = 1;
    pts.forEach((a) =>
      pts.forEach((b) => {
        if (b[2] === a[2] + 1 && rnd() < 0.55) {
          ctx.strokeStyle = `rgba(${rnd() < 0.15 ? '200,85,61' : '237,230,216'},${
            0.08 + rnd() * 0.25
          })`;
          ctx.beginPath();
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
          ctx.stroke();
        }
      })
    );

    pts.forEach(([px, py], i) => {
      g = ctx.createRadialGradient(px, py, 0, px, py, 40);
      g.addColorStop(0, 'rgba(200,85,61,.5)');
      g.addColorStop(1, 'rgba(200,85,61,0)');
      ctx.fillStyle = g;
      ctx.fillRect(px - 40, py - 40, 80, 80);

      ctx.fillStyle = i % 7 ? '#ede6d8' : '#c8553d';
      ctx.beginPath();
      ctx.arc(px, py, i % 7 ? 6 : 10, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = `rgba(237,230,216,${rnd() * 0.35})`;
      ctx.fillRect(rnd() * width, rnd() * height, 1.5, 1.5);
    }

    ctx.fillStyle = 'rgba(237,230,216,.5)';
    ctx.font = '22px "JetBrains Mono", monospace';
    ctx.fillText('y = σ(Wx + b)', width * 0.06, height * 0.92);
    applyVignette(ctx, width, height, 0.5);
  },

  // 1 CSE — code glyph field
  (ctx, width, height, rnd) => {
    ctx.fillStyle = '#0f1210';
    ctx.fillRect(0, 0, width, height);

    const glyphs = '{}[]()<>/=;01λ#*+&|'.split('');
    ctx.font = '26px "JetBrains Mono", monospace';

    for (let r = 0; r < height / 34; r++) {
      for (let c = 0; c < width / 22; c++) {
        const d = Math.hypot(c * 22 - width * 0.62, r * 34 - height * 0.48) / width;
        if (rnd() < 0.6 - d * 0.4) {
          ctx.fillStyle = `rgba(${d < 0.18 ? '200,85,61' : '237,230,216'},${Math.max(
            0.05,
            0.6 - d
          )})`;
          ctx.fillText(glyphs[Math.floor(rnd() * glyphs.length)], c * 22, r * 34);
        }
      }
    }

    ctx.fillStyle = '#ede6d8';
    ctx.font = 'italic 360px "Instrument Serif", serif';
    ctx.fillText('{ }', width * 0.08, height * 0.7);
    applyVignette(ctx, width, height, 0.5);
  },

  // 2 ECE — waveforms
  (ctx, width, height) => {
    ctx.fillStyle = '#071612';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(120,200,170,.12)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    const waves: [number, string, number, number][] = [
      [0.3, '#ede6d8', 0.012, 90],
      [0.5, '#c8553d', 0.03, 60],
      [0.7, '#7fd1b0', 0.007, 140],
    ];

    waves.forEach(([y, c, f, a], k) => {
      ctx.strokeStyle = c;
      ctx.lineWidth = 4;
      ctx.shadowColor = c;
      ctx.shadowBlur = 24;
      ctx.beginPath();
      for (let i = 0; i <= width; i += 4) {
        const v =
          k === 1
            ? (Math.sin(i * f) > 0 ? 1 : -1) * a * 0.6
            : Math.sin(i * f) * a * Math.exp(-Math.pow((i - width / 2) / width, 2) * 2);
        if (i === 0) ctx.moveTo(i, height * y + v);
        else ctx.lineTo(i, height * y + v);
      }
      ctx.stroke();
    });

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(237,230,216,.5)';
    ctx.font = '20px "JetBrains Mono", monospace';
    ctx.fillText('CH1 2V/div   CH2 50mV/div', width * 0.06, height * 0.95);
    applyVignette(ctx, width, height, 0.45);
  },

  // 3 EEE — coil + arc
  (ctx, width, height, rnd) => {
    let g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, '#1a1408');
    g.addColorStop(1, '#3b2a0c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    const cx = width * 0.5;
    for (let i = 0; i < 26; i++) {
      const y = height * 0.22 + i * height * 0.022;
      ctx.strokeStyle = `rgba(214,150,70,${0.5 + 0.5 * Math.sin(i * 0.4)})`;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.ellipse(cx, y, width * 0.22, height * 0.03, 0, 0, Math.PI);
      ctx.stroke();
    }

    ctx.fillStyle = '#2b2318';
    ctx.fillRect(cx - width * 0.04, height * 0.15, width * 0.08, height * 0.66);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(180,200,255,.9)';
    ctx.shadowColor = '#9fb4ff';
    ctx.shadowBlur = 40;
    ctx.lineWidth = 3;

    for (let k = 0; k < 3; k++) {
      let px = cx;
      let py = height * 0.13;
      ctx.beginPath();
      ctx.moveTo(px, py);
      while (py > 0) {
        px += (rnd() - 0.5) * 90;
        py -= 30 + rnd() * 30;
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();

    g = ctx.createRadialGradient(cx, height * 0.13, 0, cx, height * 0.13, width * 0.4);
    g.addColorStop(0, 'rgba(160,180,255,.5)');
    g.addColorStop(1, 'rgba(160,180,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    applyVignette(ctx, width, height, 0.5);
  },

  // 4 Mech — gears
  (ctx, width, height) => {
    ctx.fillStyle = '#18191b';
    ctx.fillRect(0, 0, width, height);

    const drawGear = (
      cx: number,
      cy: number,
      r: number,
      teeth: number,
      col: string,
      rot: number
    ) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      for (let i = 0; i < teeth * 2; i++) {
        const a = rot + (i * Math.PI) / teeth;
        const rr = i % 2 ? r : r * 1.12;
        ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#18191b';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.28, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(0,0,0,.4)';
      ctx.lineWidth = r * 0.08;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2);
      ctx.stroke();
    };

    drawGear(width * 0.38, height * 0.45, width * 0.26, 18, '#9a9690', 0);
    drawGear(width * 0.78, height * 0.78, width * 0.17, 12, '#c8553d', 0.2);
    drawGear(width * 0.8, height * 0.2, width * 0.12, 10, '#5d5a55', 0.1);

    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, 'rgba(255,255,255,.12)');
    g.addColorStop(1, 'rgba(0,0,0,.3)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    applyVignette(ctx, width, height, 0.5);
  },

  // 5 Civil — bridge arches
  (ctx, width, height, rnd) => {
    const g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, '#cdb79a');
    g.addColorStop(0.55, '#8a6f58');
    g.addColorStop(0.6, '#2a2420');
    g.addColorStop(1, '#14110f');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    const deck = height * 0.42;
    const base = height * 0.6;
    const n = 4;
    const span = width / n;

    ctx.fillStyle = '#2b2521';
    ctx.fillRect(0, deck - 24, width, 24);

    for (let i = 0; i < n; i++) {
      const ax = i * span;
      ctx.beginPath();
      ctx.moveTo(ax, base);
      ctx.lineTo(ax, deck);
      ctx.lineTo(ax + span, deck);
      ctx.lineTo(ax + span, base);
      ctx.lineTo(ax + span - span * 0.08, base);
      ctx.quadraticCurveTo(ax + span / 2, deck - height * 0.02, ax + span * 0.08, base);
      ctx.closePath();
      ctx.fill();
    }

    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.scale(1, -1);
    ctx.translate(0, -base * 2);
    for (let i = 0; i < n; i++) {
      const ax = i * span;
      ctx.beginPath();
      ctx.moveTo(ax, base);
      ctx.lineTo(ax, deck);
      ctx.lineTo(ax + span, deck);
      ctx.lineTo(ax + span, base);
      ctx.lineTo(ax + span - span * 0.08, base);
      ctx.quadraticCurveTo(ax + span / 2, deck - height * 0.02, ax + span * 0.08, base);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    ctx.strokeStyle = 'rgba(237,230,216,.2)';
    for (let i = 0; i < 30; i++) {
      const y = base + 10 + i * i * 0.5;
      ctx.beginPath();
      ctx.moveTo(rnd() * width * 0.3, y);
      ctx.lineTo(width * 0.4 + rnd() * width * 0.6, y);
      ctx.stroke();
    }

    applyVignette(ctx, width, height, 0.4);
  },

  // 6 IT — network globe
  (ctx, width, height, rnd) => {
    const g = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      height * 0.7
    );
    g.addColorStop(0, '#14202c');
    g.addColorStop(1, '#06090d');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height * 0.48;
    const r = width * 0.36;

    ctx.strokeStyle = 'rgba(237,230,216,.25)';
    ctx.lineWidth = 1.5;

    for (let i = 1; i < 8; i++) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * Math.sin((i * Math.PI) / 8), r, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * Math.sin((i * Math.PI) / 8) * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let i = -3; i <= 3; i++) {
      const yy = cy + (i * r) / 4;
      const rr = Math.sqrt(Math.max(0, r * r - Math.pow((i * r) / 4, 2)));
      ctx.beginPath();
      ctx.ellipse(cx, yy, rr, rr * 0.12, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    const nodes: [number, number][] = Array.from({ length: 18 }, () => {
      const a = rnd() * 7;
      const b = (rnd() - 0.5) * 2.6;
      return [
        cx + Math.cos(a) * r * Math.cos(b / 2) * 0.95,
        cy + Math.sin(b / 2) * r * 0.95,
      ];
    });

    ctx.strokeStyle = 'rgba(200,85,61,.7)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 14; i++) {
      const a = nodes[i];
      const b = nodes[(i * 5 + 3) % 18];
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 120, b[0], b[1]);
      ctx.stroke();
    }

    nodes.forEach(([px, py]) => {
      ctx.fillStyle = '#ede6d8';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    applyVignette(ctx, width, height, 0.4);
  },

  // 7 Hero — arched facade at dusk
  (ctx, width, height) => {
    let g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, '#1b1d3a');
    g.addColorStop(0.6, '#b0603e');
    g.addColorStop(1, '#e2a66b');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    const top = height * 0.3;
    ctx.fillStyle = '#1a1512';
    ctx.fillRect(0, top, width, height - top);

    const cols = 4;
    const cw = width / cols;
    for (let row = 0; row < 3; row++) {
      for (let c = 0; c < cols; c++) {
        const ax = c * cw + cw * 0.18;
        const aw = cw * 0.64;
        const ay = top + height * 0.06 + row * height * 0.22;
        const ah = height * 0.16;

        g = ctx.createLinearGradient(0, ay, 0, ay + ah);
        g.addColorStop(0, '#f2c58a');
        g.addColorStop(1, '#d07d47');
        ctx.fillStyle = (row + c) % 3 ? g : '#3a2a20';

        ctx.beginPath();
        ctx.moveTo(ax, ay + ah);
        ctx.lineTo(ax, ay + aw / 2);
        ctx.arc(ax + aw / 2, ay + aw / 2, aw / 2, Math.PI, 0);
        ctx.lineTo(ax + aw, ay + ah);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.fillStyle = 'rgba(0,0,0,.35)';
    ctx.fillRect(0, top, width, 8);
    applyVignette(ctx, width, height, 0.5);
  },
];

export function generateArtworkCanvases(
  noiseCanvas: HTMLCanvasElement
): HTMLCanvasElement[] {
  const rnd = createSeededRandom(7);
  return ART_GENERATORS.map((fn, i) => {
    const [w, h] = TEXTURE_SIZES[i];
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      fn(ctx, w, h, rnd);
      applyGrain(ctx, w, h, noiseCanvas);
    }
    return canvas;
  });
}

export function redrawArtworkCanvases(
  textures: HTMLCanvasElement[],
  noiseCanvas: HTMLCanvasElement
): void {
  const rnd = createSeededRandom(7);
  ART_GENERATORS.forEach((fn, i) => {
    const [w, h] = TEXTURE_SIZES[i];
    const canvas = textures[i];
    if (!canvas) return;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, w, h);
      fn(ctx, w, h, rnd);
      applyGrain(ctx, w, h, noiseCanvas);
    }
  });
}
