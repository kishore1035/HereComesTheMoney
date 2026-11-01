'use client';

import React from 'react';

const CAMPUS_SERVICES = [
  {
    num: '01',
    title: 'Laboratories',
    desc: 'Department labs for computing, electronics, machines, structures and data. Open for projects beyond the syllabus.',
    tags: 'Hands-on · Projects',
  },
  {
    num: '02',
    title: 'Library',
    desc: 'A central library with print collections, journals and digital resources for every department.',
    tags: 'Books · E-journals',
  },
  {
    num: '03',
    title: (
      <>
        Sports &amp; <em>Auditorium</em>
      </>
    ),
    desc: 'Sports facilities and an auditorium for symposia, cultural events and guest lectures.',
    tags: 'Sports · Culture',
  },
  {
    num: '04',
    title: 'Hostel & Transport',
    desc: 'Residential options and college transport connecting students across Chennai.',
    tags: 'Hostel · Buses',
  },
];

export const CampusSection: React.FC = () => {
  return (
    <section className="services" id="campus">
      <div className="label-row">
        <span className="mono">(Campus life)</span>
        <span className="mono">Kodambakkam, Chennai</span>
      </div>
      <div className="grid">
        <h2 className="intro serif fade">
          A city campus, <span className="it">built for</span>
          <br />
          making things.
        </h2>
      </div>
      {CAMPUS_SERVICES.map((svc, idx) => (
        <div key={idx} className="svc" data-cursor="Tour">
          <div className="grid">
            <span className="mono n">{svc.num}</span>
            <h4>{svc.title}</h4>
            <p>{svc.desc}</p>
            <span className="mono tags">{svc.tags}</span>
          </div>
        </div>
      ))}
    </section>
  );
};
