'use client';

import React from 'react';

export const FeaturedSection: React.FC = () => {
  return (
    <section className="featured" id="programmes">
      <div className="label-row">
        <span className="mono">Programme — 01/07 · Newest department</span>
        <span className="mono">B.Tech · 4 years</span>
      </div>

      <h2 aria-label="Artificial Intelligence and Data Science">
        <span className="ln" data-speed="0.05" aria-hidden="true">
          AI &amp; Data
        </span>
        <span className="ln it" data-speed="-0.05" aria-hidden="true">
          Science
        </span>
      </h2>

      <div className="wrap">
        <a href="#programmes" className="card" data-cursor="Explore">
          <div
            className="media"
            data-tex="0"
            role="img"
            aria-label="Abstract artwork: a neural network constellation"
          >
            <span className="tag">Dept. of AI &amp; DS</span>
            <span className="tag r">B.Tech</span>
          </div>
        </a>
      </div>

      <div className="grid info">
        <div className="fade">
          <span className="mono k">Degree</span>
          <span className="v">B.Tech</span>
        </div>
        <div className="fade">
          <span className="mono k">Duration</span>
          <span className="v">4 years</span>
        </div>
        <div className="fade">
          <span className="mono k">Admission</span>
          <span className="v">TNEA · Code 1309</span>
        </div>
        <p className="desc fade">
          Machine learning, statistics and large-scale data systems, taught
          through labs and projects from the first year. Graduates are prepared to
          build intelligent systems, not just use them.
        </p>
        <div className="go fade">
          <a className="link" href="#programmes">
            Department page <span className="arr">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
