'use client';

import React from 'react';

const NEWS_ITEMS = [
  {
    href: '#admissions',
    date: '2026',
    title: 'Admissions 2026 open: TNEA counselling code 1309',
    category: 'Admissions',
    type: 'Notice',
  },
  {
    href: '#news',
    date: 'Date',
    title: 'National-level technical symposium (sample event)',
    category: 'Event',
    type: 'Campus',
  },
  {
    href: '#news',
    date: 'Date',
    title: 'Campus recruitment drive results (sample notice)',
    category: 'Placements',
    type: 'Notice',
  },
];

export const NewsSection: React.FC = () => {
  return (
    <section className="journal" id="news">
      <div className="label-row">
        <span className="mono">(News &amp; events)</span>
        <span className="mono">Sample entries, replace with live updates</span>
      </div>

      {NEWS_ITEMS.map((item, idx) => (
        <a key={idx} href={item.href} className="post" data-cursor="Read">
          <div className="grid">
            <span className="mono d">{item.date}</span>
            <h5>{item.title}</h5>
            <span className="mono c">{item.category}</span>
            <span className="mono t">{item.type}</span>
          </div>
        </a>
      ))}
    </section>
  );
};
