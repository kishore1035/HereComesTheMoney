'use client';

import React, { useEffect, useState } from 'react';

interface NavigationProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onNavigate: (href: string) => void;
  activeSection: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  isMenuOpen,
  onToggleMenu,
  onNavigate,
  activeSection,
}) => {
  const [chennaiTime, setChennaiTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Kolkata',
        }).format(new Date());
        setChennaiTime(`Chennai ${timeStr}`);
      } catch {
        setChennaiTime('Chennai');
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavigate(href);
  };

  return (
    <header className="nav">
      <a
        href="#top"
        className="wordmark"
        aria-label="MSEC, home"
        onClick={(e) => handleLinkClick(e, '#top')}
      >
        MSEC<sup>Est. 2001</sup>
      </a>

      <ul>
        <li>
          <a
            href="#about"
            className={activeSection === '#about' ? 'cur' : ''}
            onClick={(e) => handleLinkClick(e, '#about')}
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#programmes"
            className={activeSection === '#programmes' ? 'cur' : ''}
            onClick={(e) => handleLinkClick(e, '#programmes')}
          >
            Programmes
          </a>
        </li>
        <li>
          <a
            href="#campus"
            className={activeSection === '#campus' ? 'cur' : ''}
            onClick={(e) => handleLinkClick(e, '#campus')}
          >
            Campus
          </a>
        </li>
        <li>
          <a
            href="#news"
            className={activeSection === '#news' ? 'cur' : ''}
            onClick={(e) => handleLinkClick(e, '#news')}
          >
            News
          </a>
        </li>
        <li>
          <a
            href="#admissions"
            className={activeSection === '#admissions' ? 'cur' : ''}
            onClick={(e) => handleLinkClick(e, '#admissions')}
          >
            Admissions
          </a>
        </li>
      </ul>

      <div className="meta">
        <span className="mono" id="clock">
          {chennaiTime || 'Chennai —'}
        </span>
        <button
          className="menu-btn"
          aria-expanded={isMenuOpen}
          aria-controls="overlay"
          onClick={onToggleMenu}
        >
          {isMenuOpen ? 'Close ' : 'Menu '}
          <i />
        </button>
      </div>
    </header>
  );
};
