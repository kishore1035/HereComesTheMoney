'use client';

import React from 'react';

export const Marquee: React.FC = () => {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        <span>Learn</span>
        <span className="f">build</span>
        <span>Learn</span>
        <span className="f">build</span>
        <span>Learn</span>
        <span className="f">build</span>
        <span>Learn</span>
        <span className="f">build</span>
      </div>
    </div>
  );
};
