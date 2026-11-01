'use client';

import React from 'react';

function renderSplitChars(text: string, lineIndex: number) {
  let charCount = 0;
  return text.split('').map((char, index) => {
    if (char === ' ') {
      return <React.Fragment key={index}> </React.Fragment>;
    }
    const delay = (0.15 + charCount * 0.035 + lineIndex * 0.12).toFixed(3);
    charCount++;
    return (
      <span key={index} className="ch" style={{ transitionDelay: `${delay}s` }}>
        {char}
      </span>
    );
  });
}

export const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-media" data-speed="-0.18">
        <div
          className="media"
          data-tex="7"
          role="img"
          aria-label="Campus photo placeholder: an arched facade at dusk"
        >
          <span className="tag">Kodambakkam campus</span>
          <span className="tag r">Chennai</span>
        </div>
      </div>

      <h1 aria-label="Engineering minds since 2001.">
        <span className="ln" data-speed="0.06" aria-hidden="true">
          {renderSplitChars('Engineering', 0)}
        </span>
        <span className="ln" data-speed="0.12" aria-hidden="true">
          {renderSplitChars('minds since', 1)}
        </span>
        <span className="ln it" data-speed="0.2" aria-hidden="true">
          {renderSplitChars('2001.', 2)}
        </span>
      </h1>

      <div className="grid hero-foot">
        <p className="lede fade">
          <b>Meenakshi Sundararajan Engineering College</b>: an autonomous
          institution in the heart of Chennai, affiliated to Anna University and
          approved by AICTE.
        </p>
        <div className="col fade">
          <span className="mono">Managed by</span>
          <br />
          <span className="mono" style={{ color: 'var(--ink)' }}>
            IIET Society
          </span>
        </div>
        <div className="col fade">
          <span className="mono">Admissions</span>
          <br />
          <span className="mono" style={{ color: 'var(--accent)' }}>
            2026 open · TNEA 1309
          </span>
        </div>
        <div className="scroll fade">
          <span className="mono">Scroll to explore</span>
          <span className="bar" />
        </div>
      </div>
    </section>
  );
};
