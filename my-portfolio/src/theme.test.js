import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('defines the approved light theme tokens', async () => {
  const css = await readFile(new URL('./index.css', import.meta.url), 'utf8');

  assert.match(css, /--color-bg:\s*#f5f5f2/i);
  assert.match(css, /--color-surface:\s*#ffffff/i);
  assert.match(css, /--color-text:\s*#0b0b0b/i);
  assert.match(css, /--color-text-secondary:\s*#5e5e5a/i);
  assert.match(css, /--color-text-muted:\s*#767672/i);
  assert.match(css, /--color-border:\s*rgba\(11,\s*11,\s*11,\s*0\.16\)/i);
});

test('removes legacy red accents and dark section surfaces', async () => {
  const [app, accordion, css] = await Promise.all([
    readFile(new URL('./App.jsx', import.meta.url), 'utf8'),
    readFile(new URL('./SkillsAccordion.jsx', import.meta.url), 'utf8'),
    readFile(new URL('./index.css', import.meta.url), 'utf8'),
  ]);
  const lightThemeSources = `${app}\n${accordion}\n${css}`;

  assert.doesNotMatch(lightThemeSources, /(?:red-(?:[1-9]00)|#(?:dc2626|ef4444|f43f5e|e11d48))/i);
  assert.doesNotMatch(app, /bg-\[#(?:111111|0a0a0a)\]/i);
});

test('renders the application on the approved light shell', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
    const markup = renderToStaticMarkup(React.createElement(App));
    assert.match(markup, /bg-\[#f5f5f2\]/i);
    assert.match(markup, /text-\[#0b0b0b\]/i);
  } finally {
    await vite.close();
  }
});
