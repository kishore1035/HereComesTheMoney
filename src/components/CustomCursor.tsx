'use client';

import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState('View');
  const [isBig, setIsBig] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let tx = cx;
    let ty = cy;
    let rafId: number;

    const onPointerMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      setIsActive(true);
    };

    const onPointerLeave = () => {
      setIsActive(false);
    };

    const attachCursorHoverListeners = () => {
      const targets = document.querySelectorAll<HTMLElement>('[data-cursor]');
      targets.forEach((target) => {
        target.addEventListener('pointerenter', () => {
          const label = target.dataset.cursor || 'View';
          setCursorText(label);
          setIsBig(true);
        });
        target.addEventListener('pointerleave', () => {
          setIsBig(false);
        });
      });
    };

    const loop = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onPointerMove);
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    attachCursorHoverListeners();
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`cursor ${isActive ? 'on' : ''} ${isBig ? 'big' : ''}`}
      aria-hidden="true"
    >
      <b>{cursorText}</b>
    </div>
  );
};
