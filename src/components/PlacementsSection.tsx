'use client';

import React from 'react';

const RECRUITER_LOGOS = [
  { className: 'l1', text: 'Recruiter' },
  { className: 'l2', text: 'RECRUITER' },
  { className: 'l3', text: 'recruiter' },
  { className: 'l4', text: 'Recruiter' },
  { className: 'l5', text: 'RECRUITER' },
  { className: 'l3', text: 'recruiter' },
  { className: 'l1', text: 'Recruiter' },
  { className: 'l5', text: 'RECRUITER' },
  { className: 'l2', text: 'RECRUITER' },
  { className: 'l4', text: 'Recruiter' },
];

export const PlacementsSection: React.FC = () => {
  return (
    <section className="clients" id="placements">
      <div className="label-row">
        <span className="mono">(Placements &amp; recruiters)</span>
        <span className="mono">Training &amp; Placement Cell</span>
      </div>

      <div className="logos">
        {RECRUITER_LOGOS.map((logo, idx) => (
          <div key={idx} className={logo.className}>
            {logo.text}
          </div>
        ))}
      </div>

      <p className="mono note">
        Placeholder: replace with the placement cell’s confirmed recruiter logos
        and figures.
      </p>

      <div className="grid quote">
        <blockquote className="fade">
          Placeholder for a real alumni or student quote about their time at MSEC
          and where it took them.
        </blockquote>
        <div className="who fade">
          <span className="mono" style={{ color: 'var(--ink)' }}>
            Alumni name
          </span>
          <span className="mono">Batch · Department · Company</span>
        </div>
      </div>
    </section>
  );
};
