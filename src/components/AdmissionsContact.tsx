'use client';

import React from 'react';

interface AdmissionsContactProps {
  onBackToTop: () => void;
}

export const AdmissionsContact: React.FC<AdmissionsContactProps> = ({
  onBackToTop,
}) => {
  return (
    <section className="contact" id="admissions">
      <div
        className="label-row"
        style={{ borderTop: 0, paddingTop: 0 }}
      >
        <span className="mono">(Admissions 2026)</span>
        <span className="mono">Through TNEA · Anna University guidelines</span>
      </div>

      <h2 className="big" aria-label="Begin here.">
        <span className="ln" data-speed="0.04" aria-hidden="true">
          Begin your
        </span>
        <span className="ln" data-speed="-0.06" aria-hidden="true">
          story here.
        </span>
      </h2>

      <div className="grid">
        <a className="mail" href="mailto:principal@msec.edu.in">
          principal@msec.edu.in <span className="arr">→</span>
        </a>
        <div className="addr">
          <span className="mono">Address</span>
          <p>
            363, Arcot Road, Kodambakkam
            <br />
            Chennai, Tamil Nadu 600024
          </p>
        </div>
        <div className="addr2">
          <span className="mono">Phone · TNEA</span>
          <p>
            044-2480 1636
            <br />
            Counselling code 1309
          </p>
        </div>
      </div>

      <footer>
        <span className="mono">
          © 2026 Meenakshi Sundararajan Engineering College
        </span>
        <span className="mono">KRS Group of Institutions · IIET Society</span>
        <div className="soc">
          <a href="#top">Mandatory disclosure</a>
          <a href="#top">NIRF</a>
          <a href="#top">Grievance</a>
        </div>
        <button className="totop mono" id="totop" onClick={onBackToTop}>
          Back to top ↑
        </button>
      </footer>
    </section>
  );
};
