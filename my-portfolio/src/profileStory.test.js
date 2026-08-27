import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

import { getProfileStoryMotion } from './profileStory.js';

test('renders a distant portrait behind restrained profile copy and exposes useful profile facts', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
    const markup = renderToStaticMarkup(React.createElement(App));
    const stageIndex = markup.indexOf('class="profile-story__stage"');
    const portraitIndex = markup.indexOf('data-profile-portrait');
    const storyIndex = markup.indexOf('data-profile-story');

    assert.ok(portraitIndex < stageIndex, 'portrait stays outside the pinned text stage');
    assert.ok(portraitIndex >= 0, 'profile portrait is rendered');
    assert.ok(storyIndex > portraitIndex, 'foreground story follows the background portrait in document order');
    assert.equal((markup.match(/data-profile-line="true"/g) ?? []).length, 4);
    assert.match(markup, /As a <em class="profile-story__accent">creative developer<\/em>,/);
    assert.match(markup, /I build thoughtful digital/);
    assert.match(markup, /experiences where design meets/);
    assert.match(markup, /practical technology\./);
    assert.doesNotMatch(markup, /01 \/ PROFILE/);
    assert.match(markup, />Indonesia</);
    assert.match(markup, /Web, Product &amp; Automation/);
    assert.match(markup, /English, Indonesian/);
    assert.match(markup, /Open for freelance/);
    assert.match(markup, /alt="Jovan Chandra"/);
  } finally {
    await vite.close();
  }
});

test('disables the cinematic sequence for reduced motion', () => {
  assert.deepEqual(getProfileStoryMotion(true), {
    enableScrollMotion: false,
    pinStage: false,
    textDuration: 0,
    textDelay: 0,
    lineStagger: 0,
    textTravel: 0,
    portraitTravel: 0,
    scrub: false,
    portraitScrub: false,
    portraitOpacity: 1,
  });
});

test('keeps the story in natural flow while the portrait follows scroll without lag', () => {
  const motion = getProfileStoryMotion(false);

  assert.deepEqual(motion, {
    enableScrollMotion: true,
    pinStage: false,
    textDuration: 0.72,
    textDelay: 0,
    lineStagger: 0.12,
    textTravel: 0,
    portraitTravel: -16,
    textStart: 'top 88%',
    textEnd: 'top -18%',
    textEase: 'power2.inOut',
    scrub: true,
    portraitScrub: true,
    portraitOpacity: 1,
  });
  assert.equal(motion.pinStage, false);
  assert.equal(motion.textDelay, 0);
  assert.equal(motion.textStart, 'top 88%');
  assert.equal(motion.textEnd, 'top -18%');
  assert.equal(motion.textEase, 'power2.inOut');
  assert.ok(motion.lineStagger > 0);
  assert.equal(motion.textTravel, 0);
  assert.equal(motion.portraitScrub, true);
});
