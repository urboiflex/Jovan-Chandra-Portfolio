import React, { forwardRef } from 'react';

import SplitHoverText from './SplitHoverText.jsx';
import './ContactView.css';

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jovan-richaldy/' },
  { label: 'GitHub', href: 'https://github.com/urboiflex' },
  { label: 'Instagram', href: 'https://www.instagram.com/jovanrichaldy/?hl=en' },
];

const ContactView = forwardRef(function ContactView({ onBack }, titleRef) {
  return (
    <section className="contact-view" aria-labelledby="contact-page-title">
      <h1 ref={titleRef} id="contact-page-title" className="contact-view__title" tabIndex="-1">
        Contact
      </h1>

      <button className="contact-view__back group" type="button" onClick={onBack} data-detail-back>
        <SplitHoverText text="Back" height="15px" distance="14px" />
      </button>

      <main className="contact-view__main" data-detail-main>
        <div className="contact-view__intro">
          <p className="contact-view__availability">
            Open for select projects
          </p>

          <h2>Bring me the rough idea.</h2>

          <p className="contact-view__description">
            A half-formed thought is enough. Tell me what you’re making, what it should achieve, and where you need help.
          </p>
        </div>

        <a
          className="contact-view__email"
          href="mailto:jovan.rc1212@gmail.com"
          aria-label="Email Jovan Richaldy Chandra"
        >
          <span>jovan.rc1212@gmail.com</span>
          <span className="contact-view__email-arrow" aria-hidden="true">↗</span>
        </a>

        <div className="contact-view__context">
          <span>In your message</span>
          <p>Goal · Scope · Timeline</p>
        </div>

        <dl className="contact-view__facts">
          <div className="contact-view__fact contact-view__fact--fit">
            <dt>Good fit</dt>
            <dd>
              <span>Websites</span>
              <span>Landing pages</span>
              <span>Frontend builds</span>
              <span>Mobile development</span>
              <span>Creative collaborations</span>
            </dd>
          </div>
          <div className="contact-view__fact">
            <dt>Based in</dt>
            <dd>Jakarta, Indonesia</dd>
          </div>
          <div className="contact-view__fact">
            <dt>Reply</dt>
            <dd>Usually 1–2 days</dd>
          </div>
        </dl>
      </main>

      <footer className="contact-view__footer" data-detail-footer>
        <nav aria-label="Social links">
          {SOCIAL_LINKS.map((link) => (
            <a
              className="contact-view__social group"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              key={link.label}
            >
              <SplitHoverText text={link.label} height="15px" distance="14px" />
            </a>
          ))}
        </nav>
        <p>Jakarta · GMT+7</p>
      </footer>
    </section>
  );
});

export default ContactView;
