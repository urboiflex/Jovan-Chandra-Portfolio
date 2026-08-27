import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('renders Jovan’s completed profile details and interactive controls', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const { default: InfoView } = await vite.ssrLoadModule('/src/InfoView.jsx');
    const markup = renderToStaticMarkup(React.createElement(InfoView, { onBack: () => {} }));

    assert.match(markup, /Jovan Richaldy Chandra/);
    assert.match(markup, /Website Developer &amp; Information Technology Student/);
    assert.match(markup, /Indonesia, Jakarta/);
    assert.match(markup, /Freelance &amp; Collaborations/);
    assert.match(markup, /aria-label="Back"/);
    assert.match(markup, /class="info-view__email-link"/);
    assert.doesNotMatch(markup, /Portfolio \/ 2026|Coming soon/);
  } finally {
    await vite.close();
  }
});
