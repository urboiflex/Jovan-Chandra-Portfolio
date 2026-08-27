import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('renders a direct, accessible path for starting a project conversation', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const { default: ContactView } = await vite.ssrLoadModule('/src/ContactView.jsx');
    const markup = renderToStaticMarkup(React.createElement(ContactView, { onBack: () => {} }));

    assert.match(markup, /Bring me the/);
    assert.match(markup, /rough idea/);
    assert.match(markup, /jovan\.rc1212@gmail\.com/);
    assert.match(markup, /Jakarta, Indonesia/);
    assert.match(markup, /Usually 1–2 days/);
    assert.match(markup, /Websites/);
    assert.match(markup, /Landing pages/);
    assert.match(markup, /Frontend builds/);
    assert.match(markup, /Mobile development/);
    assert.match(markup, /Creative collaborations/);
    assert.match(markup, /In your message/);
    assert.match(markup, /Goal · Scope · Timeline/);
    assert.doesNotMatch(markup, /Useful context/);
    assert.doesNotMatch(markup, /<em>/);
    assert.match(markup, /aria-label="Back"/);
    assert.match(markup, /aria-label="Email Jovan Richaldy Chandra"/);
    assert.match(markup, /data-detail-main="true"/);
    assert.match(markup, /data-detail-back="true"/);
    assert.match(markup, /data-detail-footer="true"/);
  } finally {
    await vite.close();
  }
});
