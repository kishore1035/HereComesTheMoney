'use client';

import React from 'react';

interface OverlayMenuProps {
  isOpen: boolean;
  onNavigate: (href: string) => void;
}

export const OverlayMenu: React.FC<OverlayMenuProps> = ({ isOpen, onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavigate(href);
  };

  return (
    <nav className="overlay" id="overlay" aria-label="Main">
      <ol>
        <li>
          <a href="#about" onClick={(e) => handleLinkClick(e, '#about')}>
            <span>01</span>About
          </a>
        </li>
        <li>
          <a href="#programmes" onClick={(e) => handleLinkClick(e, '#programmes')}>
            <span>02</span>Programmes
          </a>
        </li>
        <li>
          <a href="#campus" onClick={(e) => handleLinkClick(e, '#campus')}>
            <span>03</span>Campus
          </a>
        </li>
        <li>
          <a href="#news" onClick={(e) => handleLinkClick(e, '#news')}>
            <span>04</span>News
          </a>
        </li>
        <li>
          <a href="#admissions" onClick={(e) => handleLinkClick(e, '#admissions')}>
            <span>05</span>Admissions
          </a>
        </li>
      </ol>
      <div className="foot mono">
        <span>principal@msec.edu.in</span>
        <span>044-2480 1636</span>
        <span>TNEA Code 1309</span>
      </div>
    </nav>
  );
};
