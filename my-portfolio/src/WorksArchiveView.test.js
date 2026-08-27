import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('renders an accessible synchronized archive with an abstract thumbnail rail', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const { default: WorksArchiveView } = await vite.ssrLoadModule('/src/WorksArchiveView.jsx');
    const projects = [
      {
        id: '01',
        title: 'Vouch Dashboard',
        category: 'Full Stack',
        desc: 'Merchant analytics with an AI assistant.',
        img: '/vouch.png',
        roles: 'Design and development',
        tools: ['JavaScript', 'R'],
      },
      {
        id: '02',
        title: 'Kicks & Co.',
        category: 'E-commerce',
        desc: 'Kicks & Co. is a premium sneaker storefront. Designed for focused browsing.',
        img: '/kicks.png',
        roles: 'Development',
        tools: ['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10', 'T11', 'T12'],
      },
    ];
    const markup = renderToStaticMarkup(React.createElement(WorksArchiveView, {
      projects,
      onBack: () => {},
      onProjectClick: () => {},
    }));

    assert.match(markup, /<h1[^>]*>Works<\/h1>/);
    assert.doesNotMatch(markup, /<section[^>]*data-detail-main/);
    assert.match(markup, /<div[^>]*class="works-archive__content"[^>]*data-detail-main/);
    assert.match(markup, /class="works-archive__back project-link group"[^>]*aria-label="Back"/);
    assert.equal((markup.match(/aria-label="Back"/g) ?? []).length, 2);
    assert.match(markup, /aria-label="Open Vouch Dashboard"/);
    assert.equal((markup.match(/data-works-thumbnail=/g) ?? []).length, 2);
    assert.equal((markup.match(/data-works-panel=/g) ?? []).length, 2);
    assert.match(markup, /Merchant analytics with an AI assistant/);
    assert.match(markup, /Kicks &amp; Co\. is a premium sneaker storefront\./);
    assert.doesNotMatch(markup, /Designed for focused browsing/);
    assert.match(markup, /JavaScript · R/);
    assert.match(markup, /T01 · T02 · T03 · T04 · T05 · T06 · T07 · T08 · T09 · T10 · and more…/);
    assert.doesNotMatch(markup, /T11|T12/);
    assert.doesNotMatch(markup, />\+<\/span>/);
    assert.equal((markup.match(/data-project-arrow=/g) ?? []).length, 2);
    const hiddenCursorTargets = markup.match(/<button[^>]*data-hide-project-cursor[^>]*>/g) ?? [];
    assert.equal(hiddenCursorTargets.length, projects.length);
    hiddenCursorTargets.forEach((target) => {
      assert.match(target, /class="works-archive__hero project-link"/);
    });
    assert.doesNotMatch(markup, /class="works-archive__thumbnail project-link"[^>]*data-hide-project-cursor/);
    assert.doesNotMatch(markup, /class="works-archive__mobile-project"[\s\S]*?<button[^>]*data-hide-project-cursor/);
    assert.equal((markup.match(/data-gsap-image=/g) ?? []).length, (markup.match(/<img/g) ?? []).length);
  } finally {
    await vite.close();
  }
});
