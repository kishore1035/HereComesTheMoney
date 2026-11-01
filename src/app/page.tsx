'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navigation } from '../components/Navigation';
import { OverlayMenu } from '../components/OverlayMenu';
import { CustomCursor } from '../components/CustomCursor';
import { InteractiveScene } from '../components/InteractiveScene';
import { Hero } from '../components/Hero';
import { Statement } from '../components/Statement';
import { FeaturedSection } from '../components/FeaturedSection';
import { Marquee } from '../components/Marquee';
import { WorkGrid } from '../components/WorkGrid';
import { CampusSection } from '../components/CampusSection';
import { PlacementsSection } from '../components/PlacementsSection';
import { NewsSection } from '../components/NewsSection';
import { AdmissionsContact } from '../components/AdmissionsContact';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#about');
  const onNavigateRef = useRef<((target: string | number) => void) | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => {
      const next = !prev;
      document.body.classList.toggle('menu-open', next);
      return next;
    });
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.classList.remove('menu-open');
  };

  const handleNavigate = (href: string) => {
    closeMenu();
    setActiveSection(href);
    if (onNavigateRef.current) {
      onNavigateRef.current(href === '#top' ? 0 : href);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <InteractiveScene
        isMenuOpen={isMenuOpen}
        onNavigateRef={onNavigateRef}
      />
      <CustomCursor />

      <Navigation
        isMenuOpen={isMenuOpen}
        onToggleMenu={toggleMenu}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      <OverlayMenu
        isOpen={isMenuOpen}
        onNavigate={handleNavigate}
      />

      <main id="top">
        <Hero />
        <Statement />
        <FeaturedSection />
        <Marquee />
        <WorkGrid />
        <CampusSection />
        <PlacementsSection />
        <NewsSection />
        <AdmissionsContact onBackToTop={() => handleNavigate('#top')} />
      </main>
    </>
  );
}
