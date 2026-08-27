import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

import * as editorialHeroConfig from './editorialHero.js';

test('renders the approved editorial hero contract in the application', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
    const markup = renderToStaticMarkup(React.createElement(App));

    assert.match(markup, /<h1[^>]*>Jovan Chandra<\/h1>/);
    assert.match(markup, />AVAILABLE FOR FREELANCE</);
    assert.match(markup, />I design digital experiences that make complex ideas feel clear\.</);
    assert.equal((markup.match(/editorial-hero__letter/g) ?? []).length, 12);
    assert.equal((markup.match(/data-hero-animate/g) ?? []).length, 5);
    assert.deepEqual(
      [...markup.matchAll(/class="editorial-hero__service">([^<]+)<\/li>/g)].map((match) => match[1]),
      ['WEB DESIGN', 'E-COMMERCE', 'PRODUCT'],
    );
  } finally {
    await vite.close();
  }
});

test('returns a deterministic static mode for reduced motion', () => {
  assert.equal(typeof editorialHeroConfig.getEditorialHeroMotion, 'function');
  assert.deepEqual(editorialHeroConfig.getEditorialHeroMotion(true), {
    letterDuration: 0,
    letterStagger: 0,
    metadataDuration: 0,
    enableScrollMotion: false,
  });
});

test('returns restrained full-motion timing', () => {
  assert.equal(typeof editorialHeroConfig.getEditorialHeroMotion, 'function');
  assert.deepEqual(editorialHeroConfig.getEditorialHeroMotion(false), {
    letterDuration: 0.9,
    letterStagger: 0.055,
    metadataDuration: 0.75,
    enableScrollMotion: true,
  });
});
