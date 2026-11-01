'use client';

import React from 'react';

const STATEMENT_WORDS: Array<{ text: string; isEm?: boolean }> = [
  { text: 'Part' },
  { text: 'of' },
  { text: 'the' },
  { text: 'KRS' },
  { text: 'Group' },
  { text: 'of' },
  { text: 'Institutions,' },
  { text: 'whose' },
  { text: 'roots' },
  { text: 'go' },
  { text: 'back' },
  { text: 'to' },
  { text: 'the' },
  { text: 'Indian' },
  { text: 'Institute' },
  { text: 'of' },
  { text: 'Technical' },
  { text: 'Education' },
  { text: 'in' },
  { text: '1947.' },
  { text: 'Founded' },
  { text: 'by' },
  { text: 'Prof.' },
  { text: 'K.' },
  { text: 'R.' },
  { text: 'Sundararajan,' },
  { text: 'MSEC' },
  { text: 'began' },
  { text: 'in' },
  { text: '2001' },
  { text: 'with' },
  { text: 'three' },
  { text: 'branches' },
  { text: 'and' },
  { text: 'has' },
  { text: 'grown' },
  { text: 'into' },
  { text: 'a' },
  { text: 'campus' },
  { text: 'for' },
  { text: 'seven,' },
  { text: 'built' },
  { text: 'on' },
  { text: 'one' },
  { text: 'idea:' },
  { text: 'engineering', isEm: true },
  { text: 'is' },
  { text: 'learned' },
  { text: 'by' },
  { text: 'building.' },
];

export const Statement: React.FC = () => {
  return (
    <section className="statement" id="about">
      <div className="grid">
        <span className="mono">(About the college)</span>
        <p className="reveal-words">
          {STATEMENT_WORDS.map((w, idx) => (
            <React.Fragment key={idx}>
              <span className="w">
                {w.isEm ? <em>{w.text}</em> : w.text}
              </span>{' '}
            </React.Fragment>
          ))}
        </p>

        <div className="sig fade">
          <div>
            <span className="mono">Founder</span>
            <br />
            <span style={{ fontSize: '14px' }}>Prof. K. R. Sundararajan</span>
          </div>
          <div>
            <span className="mono">Recognition</span>
            <br />
            <span style={{ fontSize: '14px' }}>
              AICTE · Anna University · NAAC · NBA (eligible programmes)
            </span>
          </div>
        </div>
      </div>

      <div className="grid stats">
        <div className="fade">
          <span className="big-n">2001</span>
          <span className="mono">Year founded</span>
        </div>
        <div className="fade">
          <span className="big-n">07</span>
          <span className="mono">UG branches</span>
        </div>
        <div className="fade">
          <span className="big-n">660</span>
          <span className="mono">Seats for 2026</span>
        </div>
        <div className="fade">
          <span className="big-n">1947</span>
          <span className="mono">KRS Group legacy</span>
        </div>
      </div>
    </section>
  );
};
