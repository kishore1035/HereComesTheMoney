'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import {
  createNoiseCanvas,
  generateArtworkCanvases,
  redrawArtworkCanvases,
} from '../lib/proceduralArt';
import { WebGLLiquidRenderer } from '../lib/webglLiquid';
import { MediaItem } from '../lib/types';

interface InteractiveSceneProps {
  isMenuOpen: boolean;
  onNavigateRef: React.MutableRefObject<((target: string | number) => void) | null>;
}

export const InteractiveScene: React.FC<InteractiveSceneProps> = ({
  isMenuOpen,
  onNavigateRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // 1. Noise grain texture setup
    const noiseCanvas = createNoiseCanvas();
    const noiseUrl = noiseCanvas.toDataURL();
    document.documentElement.style.setProperty('--noise', `url(${noiseUrl})`);

    // 2. Procedural textures
    const textureCanvases = generateArtworkCanvases(noiseCanvas);

    // 3. WebGL renderer setup
    const renderer = new WebGLLiquidRenderer(canvas);
    let glTexList: WebGLTexture[] = [];
    if (renderer.isOk) {
      glTexList = renderer.loadTextures(textureCanvases);
    }

    // 4. Media elements mapping
    const mediaElements = Array.from(
      document.querySelectorAll<HTMLElement>('.media')
    );

    const medias: MediaItem[] = mediaElements.map((el) => {
      const tex = +(el.dataset.tex || 0);
      return {
        el,
        tex,
        hover: 0,
        th: 0,
        mx: 0.5,
        my: 0.5,
        tmx: 0.5,
        tmy: 0.5,
        reveal: reduce ? 1 : 0,
        tr: reduce ? 1 : 0,
        glTex: renderer.isOk ? glTexList[tex] || null : null,
      };
    });

    // Fallback if WebGL is unavailable
    if (!renderer.isOk) {
      medias.forEach((m) => {
        if (textureCanvases[m.tex]) {
          m.el.style.backgroundImage = `url(${textureCanvases[m.tex].toDataURL('image/jpeg', 0.85)})`;
        }
      });
    }

    // Pointer events on media/cards
    const pointerHandlers: Array<{
      target: HTMLElement;
      enter: () => void;
      leave: () => void;
      move: (e: PointerEvent) => void;
    }> = [];

    medias.forEach((m) => {
      const host = (m.el.closest('.card') as HTMLElement) || m.el;
      const onEnter = () => {
        m.th = 1;
      };
      const onLeave = () => {
        m.th = 0;
      };
      const onMove = (e: PointerEvent) => {
        const r = m.el.getBoundingClientRect();
        m.tmx = (e.clientX - r.left) / r.width;
        m.tmy = 1 - (e.clientY - r.top) / r.height;
      };

      host.addEventListener('pointerenter', onEnter);
      host.addEventListener('pointerleave', onLeave);
      m.el.addEventListener('pointermove', onMove);

      pointerHandlers.push({
        target: host,
        enter: onEnter,
        leave: onLeave,
        move: onMove,
      });
    });

    // 5. IntersectionObserver for fade and media reveal
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const m = medias.find((item) => item.el === e.target);
            if (m) {
              m.tr = 1;
            } else {
              e.target.classList.add('in');
            }
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    medias.forEach((m) => io.observe(m.el));
    const fadeEls = document.querySelectorAll<HTMLElement>('.fade');
    fadeEls.forEach((el) => io.observe(el));

    // 6. Viewport resize & devicePixelRatio
    let dpr = 1;
    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // 7. Smooth scrolling with Lenis
    let lenis: Lenis | null = null;
    if (!reduce) {
      lenis = new Lenis({
        lerp: 0.085,
        smoothWheel: true,
        wheelMultiplier: 0.95,
      });
      lenisRef.current = lenis;
    }

    const scrollTo = (t: string | number) => {
      if (lenis) {
        lenis.scrollTo(t, { duration: 1.6, offset: t === 0 ? 0 : -20 });
      } else {
        if (t === 0 || t === '#top') {
          window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        } else if (typeof t === 'string') {
          const targetEl = document.querySelector<HTMLElement>(t);
          targetEl?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
        }
      }
    };
    onNavigateRef.current = scrollTo;

    // 8. Elements for animation loop
    const speedElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-speed]')
    );
    const marqueeTrack = document.querySelector<HTMLElement>('.marquee .track');
    const revealWordsContainer = document.querySelector<HTMLElement>('.reveal-words');
    const wordElements = revealWordsContainer
      ? Array.from(revealWordsContainer.querySelectorAll<HTMLElement>('.w'))
      : [];

    if (reduce) {
      wordElements.forEach((w) => w.classList.add('on'));
    }

    // 9. Frame render loop
    let mx = 0;
    let lastY = window.scrollY;
    let vel = 0;
    const startTime = performance.now();
    let rafId: number;

    const frame = (now: number) => {
      if (lenis) lenis.raf(now);

      const y = window.scrollY;
      const vh = window.innerHeight;
      const rawV = lenis ? lenis.velocity : y - lastY;
      lastY = y;
      vel = lerp(vel, Math.max(-60, Math.min(60, rawV)), 0.12);

      if (!reduce) {
        // Parallax
        speedElements.forEach((el) => {
          const parent = el.parentElement;
          if (!parent) return;
          const r = parent.getBoundingClientRect();
          const c = r.top + r.height / 2 - vh / 2;
          const speed = +(el.dataset.speed || 0);
          el.style.transform = `translate3d(0, ${(-c * speed).toFixed(2)}px, 0)`;
        });

        // Marquee drift + scroll velocity skew
        if (marqueeTrack) {
          mx -= 0.5 + Math.abs(vel) * 0.35;
          const half = marqueeTrack.scrollWidth / 2;
          if (-mx > half) mx += half;
          marqueeTrack.style.transform = `translate3d(${mx}px, 0, 0) skewX(${(-vel * 0.25).toFixed(2)}deg)`;
        }

        // Word reveal
        if (revealWordsContainer && wordElements.length > 0) {
          const r = revealWordsContainer.getBoundingClientRect();
          const p = (vh * 0.82 - r.top) / (r.height + vh * 0.25);
          const n = Math.floor(
            Math.max(0, Math.min(1, p)) * wordElements.length * 1.05
          );
          wordElements.forEach((w, i) => {
            w.classList.toggle('on', i < n);
          });
        }
      }

      // Render WebGL
      if (renderer.isOk) {
        const time = (now - startTime) / 1000;
        medias.forEach((m) => {
          m.hover = lerp(m.hover, m.th, 0.06);
          m.mx = lerp(m.mx, m.tmx, 0.1);
          m.my = lerp(m.my, m.tmy, 0.1);
          m.reveal = lerp(m.reveal, m.tr, 0.028);
          if (m.tr === 1 && m.reveal > 0.999) m.reveal = 1;
        });

        renderer.render(medias, time, vel, dpr);
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    // Font ready listener to redraw artworks
    const onFontsReady = () => {
      redrawArtworkCanvases(textureCanvases, noiseCanvas);
      if (renderer.isOk) {
        textureCanvases.forEach((c, idx) => {
          renderer.updateTexture(idx, c);
        });
      }
      requestAnimationFrame(() => {
        document.body.classList.add('loaded');
      });
    };

    if (document.fonts && document.fonts.ready) {
      Promise.race([
        document.fonts.ready,
        new Promise((r) => setTimeout(r, 1200)),
      ]).then(onFontsReady);
    } else {
      onFontsReady();
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      io.disconnect();
      pointerHandlers.forEach(({ target, enter, leave, move }) => {
        target.removeEventListener('pointerenter', enter);
        target.removeEventListener('pointerleave', leave);
        target.removeEventListener('pointermove', move as EventListener);
      });
      if (lenis) lenis.destroy();
      renderer.destroy();
    };
  }, [onNavigateRef]);

  // Handle Lenis pause/resume on menu open
  useEffect(() => {
    if (lenisRef.current) {
      if (isMenuOpen) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    }
  }, [isMenuOpen]);

  return (
    <>
      <canvas id="gl" ref={canvasRef} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
};
