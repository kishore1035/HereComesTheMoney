'use client';

import React from 'react';

interface ProgrammeCardData {
  title: string;
  degree: string;
  num: string;
  tag: string;
  tex: number;
  label: string;
  className: string;
}

const PROGRAMMES: ProgrammeCardData[] = [
  {
    title: 'Computer Science',
    degree: 'B.E. CSE',
    num: '02 — Since 2001',
    tag: '120 seats',
    tex: 1,
    label: 'Artwork for Computer Science: a field of code glyphs',
    className: 'c1',
  },
  {
    title: 'Electronics & Comm.',
    degree: 'B.E. ECE',
    num: '03 — Since 2001',
    tag: '120 seats',
    tex: 2,
    label: 'Artwork for Electronics and Communication: oscilloscope waveforms',
    className: 'c2',
  },
  {
    title: 'Information Technology',
    degree: 'B.Tech IT',
    num: '04 — Since 2001',
    tag: 'Networks · Systems',
    tex: 6,
    label: 'Artwork for Information Technology: a network of nodes',
    className: 'c3',
  },
  {
    title: 'Electrical & Electronics',
    degree: 'B.E. EEE',
    num: '05',
    tag: 'Power · Control',
    tex: 3,
    label: 'Artwork for Electrical and Electronics: a coil and arc of current',
    className: 'c4',
  },
  {
    title: 'Mechanical',
    degree: 'B.E. Mech',
    num: '06',
    tag: 'Design · Manufacturing',
    tex: 4,
    label: 'Artwork for Mechanical Engineering: interlocking gears',
    className: 'c5',
  },
  {
    title: 'Civil',
    degree: 'B.E. Civil',
    num: '07',
    tag: 'Structures · Construction',
    tex: 5,
    label: 'Artwork for Civil Engineering: bridge arches over water',
    className: 'c6',
  },
];

export const WorkGrid: React.FC = () => {
  return (
    <section className="work">
      <div className="grid">
        {PROGRAMMES.map((prog, idx) => (
          <a
            key={idx}
            href="#programmes"
            className={`card ${prog.className} fade`}
            data-cursor="Explore"
          >
            <div
              className="media"
              data-tex={prog.tex}
              role="img"
              aria-label={prog.label}
            >
              <span className="tag">{prog.tag}</span>
            </div>
            <div className="cap">
              <h3>
                <span>{prog.title}</span>
              </h3>
              <span className="arr">→</span>
            </div>
            <div className="row2">
              <span className="mono">{prog.degree}</span>
              <span className="num">{prog.num}</span>
            </div>
          </a>
        ))}
        <div className="more fade">
          <a className="link" href="#admissions">
            Seat matrix &amp; eligibility <span className="arr">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
