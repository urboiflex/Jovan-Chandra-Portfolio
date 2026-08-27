import React, { forwardRef } from 'react';

import portrait from './assets/anjay.jpeg';
import { SKILL_GROUPS } from './skills.js';
import SplitHoverText from './SplitHoverText.jsx';
import './InfoView.css';

const InfoView = forwardRef(function InfoView({ onBack }, titleRef) {
  return (
    <section className="info-view" aria-labelledby="info-page-title">
      <h1 ref={titleRef} id="info-page-title" className="info-view__title" tabIndex="-1">
        Info
      </h1>

      <button className="info-view__back group" type="button" onClick={onBack} data-detail-back>
        <SplitHoverText text="Back" height="15px" distance="14px" />
      </button>

      <main className="info-view__main" data-detail-main>
        <div className="info-view__portrait-column">
          <figure className="info-view__portrait-frame">
            <img src={portrait} alt="Jovan Richaldy Chandra" className="info-view__portrait" />
          </figure>
          <dl className="info-view__metadata">
            <div>
              <dt>Based in</dt>
              <dd>Indonesia, Jakarta</dd>
            </div>
            <div>
              <dt>Available for</dt>
              <dd>Freelance &amp; Collaborations</dd>
            </div>
          </dl>
        </div>

        <div className="info-view__content">
          <p className="info-view__eyebrow">About</p>
          <h2>Jovan Richaldy Chandra.</h2>
          <p className="info-view__role">
            Website Developer &amp; Information Technology Student, currently focuses on Website Development
          </p>
          <p className="info-view__description">
            I build websites that balance visual impact with clarity and usability. Every detail is shaped to attract
            attention, communicate effectively, and create a smooth experience for the people using it.
          </p>

          <div className="info-view__rule" aria-hidden="true" />

          <div className="info-view__skills" aria-label="Skills">
            {SKILL_GROUPS.map((group) => (
              <section className="info-view__skill-group" key={group.id}>
                <h3>{group.label}</h3>
                <ul>
                  {group.skills.map((skill) => <li key={skill.name}>{skill.name}</li>)}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>

      <footer className="info-view__footer" data-detail-footer>
        <a className="info-view__email-link" href="mailto:jovan.rc1212@gmail.com">jovan.rc1212@gmail.com</a>
      </footer>
    </section>
  );
});

export default InfoView;
