import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

import {
  PROJECT_MODAL_SLIDE_INTERVAL_MS,
  getAdjacentProjectId,
  getProjectVisitUrl,
  preloadProjectGallery,
} from './projectModal.js';

const projects = [
  { id: '01', githubUrl: 'https://github.com/example/one' },
  { id: '02', visitUrl: 'https://example.com/two', githubUrl: 'https://github.com/example/two' },
];

test('cycles through modal projects in both directions', () => {
  assert.equal(getAdjacentProjectId(projects, '01', 1), '02');
  assert.equal(getAdjacentProjectId(projects, '02', 1), '01');
  assert.equal(getAdjacentProjectId(projects, '01', -1), '02');
});

test('prefers a live visit URL and falls back to GitHub', () => {
  assert.equal(getProjectVisitUrl(projects[1]), 'https://example.com/two');
  assert.equal(getProjectVisitUrl(projects[0]), 'https://github.com/example/one');
  assert.equal(PROJECT_MODAL_SLIDE_INTERVAL_MS, 2500);
});

test('preloads every slideshow image before playback begins', async () => {
  const requestedSources = [];
  const createImage = () => ({
    set src(value) {
      requestedSources.push(value);
      queueMicrotask(() => this.onload());
    },
  });

  await preloadProjectGallery(['/one.png', '/two.png'], createImage);
  assert.deepEqual(requestedSources, ['/one.png', '/two.png']);
});

test('renders an accessible project showcase with gallery, metadata, visit, and navigation', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const { default: ProjectShowcaseModal } = await vite.ssrLoadModule('/src/ProjectShowcaseModal.jsx');
    const project = {
      id: '01',
      title: 'Vouch AI-Assistant Dashboard',
      category: 'Hackathon Project / Full Stack',
      roles: 'Front-end / Back-end',
      summary: 'A useful analytics dashboard.',
      modalSummary: 'A shorter project introduction.',
      tools: ['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10', 'T11', 'T12'],
      gallery: ['/one.png', '/two.png'],
      img: '/fallback.png',
      bgImg: '/background.png',
      githubUrl: 'https://github.com/example/vouch',
    };
    const markup = renderToStaticMarkup(React.createElement(ProjectShowcaseModal, {
      project,
      projects: [project],
      onClose: () => {},
      onSelectProject: () => {},
    }));

    assert.match(markup, /role="dialog"/);
    assert.match(markup, /aria-modal="true"/);
    assert.match(markup, /Vouch AI-Assistant Dashboard/);
    assert.match(markup, /A shorter project introduction\./);
    assert.doesNotMatch(markup, /A useful analytics dashboard\./);
    assert.match(markup, /T01, T02, T03, T04, T05, T06, T07, T08, T09, T10, and more…/);
    assert.doesNotMatch(markup, /T11|T12/);
    assert.match(markup, /Hackathon Project \/ Full Stack/);
    assert.match(markup, /Front-end \/ Back-end/);
    assert.match(markup, /href="https:\/\/github\.com\/example\/vouch"/);
    assert.equal((markup.match(/data-project-modal-slide="true"/g) ?? []).length, 2);
    assert.match(markup, /aria-label="Previous project"/);
    assert.match(markup, /aria-label="Next project"/);
    assert.match(markup, /aria-label="Close project details"/);
  } finally {
    await vite.close();
  }
});

test('uses only simple modal fades and overlapping slideshow crossfades', async () => {
  const source = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('./ProjectShowcaseModal.jsx', import.meta.url), 'utf8')
  ));

  assert.match(source, /previousSlideRef/);
  assert.match(source, /preloadProjectGallery/);
  assert.match(source, /window\.gsap\.fromTo\(rootRef\.current/);
  assert.match(source, /window\.gsap\.to\(rootRef\.current/);
  assert.doesNotMatch(source, /clipPath/);
  assert.doesNotMatch(source, /filter: 'blur/);
  assert.doesNotMatch(source, /scale: 0\./);
  assert.doesNotMatch(source, /x: direction/);
  assert.match(source, /ArrowLeft/);
  assert.match(source, /ArrowRight/);
  assert.match(source, /Escape/);
});

test('removes the custom circular cursor and keeps the native pointer', async () => {
  const source = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('./App.jsx', import.meta.url), 'utf8')
  ));

  assert.doesNotMatch(source, /const CustomCursor/);
  assert.doesNotMatch(source, /<CustomCursor/);
  assert.doesNotMatch(source, /stepCursorFollower/);
});

test('opens the showcase from Home while Works uses dedicated case-study routes', async () => {
  const source = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('./App.jsx', import.meta.url), 'utf8')
  ));

  assert.match(source, /import ProjectShowcaseModal from '\.\/ProjectShowcaseModal\.jsx'/);
  assert.match(source, /const handleProjectOpen = \(id\) =>/);
  assert.equal((source.match(/onProjectClick=\{handleProjectOpen\}/g) ?? []).length, 1);
  assert.match(source, /onProjectClick=\{handleWorkProjectOpen\}/);
  assert.match(source, /<ProjectShowcaseModal/);
  assert.match(source, /onSelectProject=\{setSelectedProjectId\}/);
});
