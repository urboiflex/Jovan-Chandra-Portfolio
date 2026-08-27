import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

import {
  FEATURED_SLIDESHOW_DELAY_MS,
  FEATURED_SLIDESHOW_INTERVAL_MS,
  getFeaturedProjectBackground,
  getFeaturedProjectPhases,
  getFeaturedProjectsMotion,
} from './featuredProjects.js';

test('waits for intentional hover before advancing the project slideshow', () => {
  assert.equal(FEATURED_SLIDESHOW_DELAY_MS, 1500);
  assert.equal(FEATURED_SLIDESHOW_INTERVAL_MS, 1000);
});

test('crossfades from the previous slide to the next slide', async () => {
  const module = await import('./featuredProjects.js');

  assert.equal(typeof module.getNextFeaturedGalleryState, 'function');
  assert.deepEqual(
    module.getNextFeaturedGalleryState({ activeIndex: 0, previousIndex: null, transition: 0 }, 3),
    { activeIndex: 1, previousIndex: 0, transition: 1 },
  );
});

test('places a keyboard-accessible featured project gallery between About and Skills', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
    const markup = renderToStaticMarkup(React.createElement(App));
    const aboutIndex = markup.indexOf('data-scroll-section="About"');
    const projectsIndex = markup.indexOf('data-scroll-section="Projects"');
    const skillsIndex = markup.indexOf('data-scroll-section="Skills"');

    assert.ok(aboutIndex >= 0, 'About section is rendered');
    assert.ok(projectsIndex > aboutIndex, 'featured projects follow About');
    assert.ok(skillsIndex > projectsIndex, 'Skills follow featured projects');
    assert.equal((markup.match(/data-featured-project="true"/g) ?? []).length, 4);
    assert.equal((markup.match(/data-featured-project-trigger="true"/g) ?? []).length, 4);
    assert.match(markup, /Featured projects/i);
    assert.match(markup, /View Vouch AI-Assistant Dashboard/);
    assert.match(markup, /View Kicks &amp; Co\./);
    assert.match(markup, /View YUGEN Concept/);
    assert.match(markup, /View ONYX Gaming E-Commerce/);
    assert.doesNotMatch(markup, /EcoBro Mobile App/);
  } finally {
    await vite.close();
  }
});

test('presents highlighted technologies above an unlabeled project type for every featured project', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
    const markup = renderToStaticMarkup(React.createElement(App));

    assert.equal((markup.match(/data-featured-technologies="true"/g) ?? []).length, 4);
    assert.equal((markup.match(/data-featured-project-type="true"/g) ?? []).length, 4);
    assert.match(markup, /HTML · CSS · JavaScript · R/);
    assert.match(markup, /React\.js · GSAP · ASP\.NET · MySQL/);
    assert.match(markup, /Next\.js · GSAP · Lenis · Tailwind CSS/);
    assert.match(markup, /ASP\.NET · C# · PostgreSQL · AWS/);
    assert.equal((markup.match(/Full-stack Developer/g) ?? []).length >= 2, true);
    assert.match(markup, />Landing Page</);
    assert.doesNotMatch(markup, /Role:/);
    assert.doesNotMatch(markup, /Landing Page Developer/);
    assert.doesNotMatch(markup, /Hackathon Project/);
  } finally {
    await vite.close();
  }
});

test('defines ONYX as a one-month full-stack commerce project with all supplied screens', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const { PROJECTS_DATA } = await vite.ssrLoadModule('/src/projectData.js');
    const onyx = PROJECTS_DATA.find((project) => project.id === '04');

    assert.equal(onyx.title, 'ONYX Gaming E-Commerce');
    assert.equal(onyx.category, 'Full-Stack E-Commerce Developer');
    assert.equal(onyx.roles, 'Full-Stack E-Commerce Developer');
    assert.equal(onyx.duration, '1 month');
    assert.equal(onyx.gallery.length, 14);
    assert.deepEqual(onyx.featuredTools, ['ASP.NET', 'C#', 'PostgreSQL', 'AWS']);
    assert.ok(onyx.tools.includes('AWS S3'));
    assert.ok(onyx.tools.includes('AWS CloudFront'));
    assert.ok(onyx.tools.includes('AWS Lambda'));
    assert.ok(onyx.tools.includes('AWS CloudWatch'));
    assert.equal(onyx.githubUrl, 'https://github.com/pendetas/ONYX_VS2022');
    assert.ok(onyx.bgImg);
    assert.notEqual(onyx.bgImg, onyx.img);
    assert.equal(onyx.gallery[0], onyx.img);
    assert.ok(onyx.summary.trim().split(/\s+/).length <= 55);

    const image = await import('node:fs/promises').then(({ readFile }) => (
      readFile(new URL('./assets/onyx/01-home.png', import.meta.url))
    ));
    assert.equal(image.readUInt32BE(16), 1919);
    assert.equal(image.readUInt32BE(20), 927);
  } finally {
    await vite.close();
  }
});

test('does not enlarge selected-screen images beyond their native resolution', async () => {
  const styles = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('./ProjectCaseStudyView.css', import.meta.url), 'utf8')
  ));
  const screenImageRule = styles.match(/\.case-study__screen img\s*\{([^}]*)\}/)?.[1] ?? '';

  assert.match(screenImageRule, /width:\s*auto/);
  assert.match(screenImageRule, /max-width:\s*100%/);
});

test('defines YUGEN as a landing page with the supplied eight-screen gallery and separate ambient background', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const { PROJECTS_DATA } = await vite.ssrLoadModule('/src/projectData.js');
    assert.ok(PROJECTS_DATA, 'project data is available to its consumers');
    const yugen = PROJECTS_DATA.find((project) => project.id === '03');

    assert.equal(yugen.category, 'Landing Page');
    assert.equal(yugen.roles, 'Landing Page Developer');
    assert.equal(yugen.gallery.length, 8);
    assert.notEqual(yugen.bgImg, yugen.img);
    assert.deepEqual(yugen.featuredTools, ['Next.js', 'GSAP', 'Lenis', 'Tailwind CSS']);
  } finally {
    await vite.close();
  }
});

test('animates a focused or hovered featured title underline from left to right', async () => {
  const styles = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('./FeaturedProjectsSection.css', import.meta.url), 'utf8')
  ));

  assert.match(styles, /featured-projects__title-text::after[\s\S]*transform:\s*scaleX\(0\)/);
  assert.match(styles, /featured-projects__title-link:hover[\s\S]*featured-projects__title-text::after[\s\S]*transform:\s*scaleX\(1\)/);
  assert.match(styles, /featured-projects__title-link:focus-visible[\s\S]*featured-projects__title-text::after[\s\S]*transform:\s*scaleX\(1\)/);
});

test('uses a straight-edged, spaced takeover without border-radius animation', async () => {
  const componentSource = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('./FeaturedProjectsSection.jsx', import.meta.url), 'utf8')
  ));
  const styles = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('./FeaturedProjectsSection.css', import.meta.url), 'utf8')
  ));

  assert.doesNotMatch(componentSource, /borderTopLeftRadius|borderTopRightRadius/);
  assert.match(componentSource, /--featured-takeover-distance/);
  assert.match(styles, /--featured-project-gap:\s*clamp\(8rem,\s*18svh,\s*14rem\)/);
  assert.match(styles, /border-radius:\s*0/);
});

test('keeps ambient backgrounds independent from the hover slideshow', () => {
  assert.equal(getFeaturedProjectBackground({ img: 'project.png', bgImg: 'ambient.png' }), 'ambient.png');
  assert.equal(getFeaturedProjectBackground({ img: 'project.png' }), 'project.png');
});

test('keeps scroll-resized project layers inexpensive to repaint', async () => {
  const componentSource = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('./FeaturedProjectsSection.jsx', import.meta.url), 'utf8')
  ));
  const styles = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('./FeaturedProjectsSection.css', import.meta.url), 'utf8')
  ));

  assert.doesNotMatch(styles, /featured-projects__backdrop[\s\S]{0,180}filter:/);
  assert.match(styles, /featured-projects__pane[\s\S]{0,500}contain:\s*layout paint/);
  assert.match(componentSource, /FEATURED_SLIDESHOW_DELAY_MS/);
  assert.match(componentSource, /FEATURED_SLIDESHOW_INTERVAL_MS/);
});

test('centers a compact three-by-two foreground inside the animated project background', async () => {
  const componentStyles = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('./FeaturedProjectsSection.css', import.meta.url), 'utf8')
  ));
  const globalStyles = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('./index.css', import.meta.url), 'utf8')
  ));
  const componentSource = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('./FeaturedProjectsSection.jsx', import.meta.url), 'utf8')
  ));

  assert.match(componentStyles, /width:\s*min\(820px,\s*52vw,\s*102svh,\s*100%\)/);
  assert.match(componentStyles, /aspect-ratio:\s*3\s*\/\s*2/);
  assert.match(componentStyles, /featured-projects__foreground--active/);
  assert.match(componentStyles, /featured-projects__foreground--previous/);
  const legacyBackdropRules = [...globalStyles.matchAll(/\.featured-projects__backdrop\s*\{([^}]*)\}/g)];
  legacyBackdropRules.forEach(([, rule]) => assert.doesNotMatch(rule, /filter:/));
  assert.match(componentSource, /featured-projects__foreground--active/);
  assert.match(componentSource, /featured-projects__foreground--previous/);
});

test('keeps the project image aligned to its full foreground frame', async () => {
  const componentStyles = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('./FeaturedProjectsSection.css', import.meta.url), 'utf8')
  ));
  const foregroundRule = componentStyles.match(
    /\.featured-projects \.featured-projects__foreground\s*\{([^}]*)\}/,
  )?.[1] ?? '';

  assert.match(foregroundRule, /transform:\s*none/);
});

test('crops project screenshots inside the reference-style foreground frame', async () => {
  const componentStyles = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('./FeaturedProjectsSection.css', import.meta.url), 'utf8')
  ));
  const foregroundRule = componentStyles.match(
    /\.featured-projects \.featured-projects__foreground\s*\{([^}]*)\}/,
  )?.[1] ?? '';

  assert.match(foregroundRule, /object-fit:\s*cover/);
});

test('keeps the grain texture static and compositor-friendly', async () => {
  const globalStyles = await import('node:fs/promises').then(({ readFile }) => (
    readFile(new URL('./index.css', import.meta.url), 'utf8')
  ));
  const grainRule = globalStyles.match(/\.grain-overlay\s*\{([\s\S]*?)\}/)?.[1] ?? '';

  assert.match(grainRule, /inset:\s*0/);
  assert.doesNotMatch(grainRule, /mix-blend-mode/);
  assert.doesNotMatch(grainRule, /animation:/);
});

test('uses the measured reference dimensions in one unpinned section timeline', () => {
  assert.deepEqual(getFeaturedProjectsMotion(false, false), {
    enableSpatialMotion: true,
    pin: false,
    scrub: true,
    expandedHeight: 72,
    restingHeight: 28,
    expandedWidth: 60,
    restingWidth: 48,
    rowPadding: 0,
    topPadding: 0,
    useWidthCycle: true,
    sectionStart: 'top bottom',
    sectionEnd: 'bottom top',
  });
});

test('keeps expanded height while width returns to its resting size', () => {
  const phases = getFeaturedProjectPhases(3, getFeaturedProjectsMotion(false, false));

  assert.equal(phases.length, 3);
  for (const phase of phases) {
    assert.ok(phase.heightEnd > phase.heightStart);
    assert.ok(phase.widthGrowEnd > phase.heightStart);
    assert.ok(phase.widthShrinkStart > phase.widthGrowEnd);
    assert.ok(phase.widthShrinkEnd > phase.widthShrinkStart);
  }
});

test('uses the measured stacked mobile geometry', () => {
  assert.deepEqual(getFeaturedProjectsMotion(false, true), {
    enableSpatialMotion: true,
    pin: false,
    scrub: true,
    expandedHeight: 50,
    restingHeight: 25,
    expandedWidth: 100,
    restingWidth: 100,
    rowPadding: 20,
    topPadding: 0,
    useWidthCycle: false,
    sectionStart: 'top bottom',
    sectionEnd: 'bottom top',
  });
});

test('keeps every project readable when reduced motion is requested', () => {
  assert.deepEqual(getFeaturedProjectsMotion(true, false), {
    enableSpatialMotion: false,
    pin: false,
    scrub: false,
    expandedHeight: 28,
    restingHeight: 28,
    expandedWidth: 100,
    restingWidth: 100,
    rowPadding: 0,
    topPadding: 0,
    useWidthCycle: false,
    sectionStart: null,
    sectionEnd: null,
  });
});
