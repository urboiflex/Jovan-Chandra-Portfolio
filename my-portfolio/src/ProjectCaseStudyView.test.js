import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('presents an opened project as a website case study rather than an art portfolio entry', async () => {
  const vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });

  try {
    const { default: ProjectCaseStudyView } = await vite.ssrLoadModule('/src/ProjectCaseStudyView.jsx');
    const project = {
      id: '02',
      title: 'Kicks & Co. Website',
      category: 'E-commerce website',
      summary: 'A premium storefront with a complete purchasing flow.',
      desc: 'Luxury-inspired sneaker shopping.',
      img: '/home.png',
      gallery: ['/home.png', '/shop.png', '/checkout.png'],
      roles: 'Design and development',
      duration: '3 weeks',
      tools: ['GSAP', 'C#', 'MySQL'],
      githubUrl: 'https://github.com/example/kicks',
    };
    const nextProject = { id: '01', title: 'Vouch Dashboard' };
    const markup = renderToStaticMarkup(React.createElement(ProjectCaseStudyView, {
      project,
      nextProject,
      currentProjectIndex: 0,
      projectCount: 2,
      onBack: () => {},
      onNext: () => {},
    }));

    assert.match(markup, /Website case study/);
    assert.match(markup, /Overview/);
    assert.match(markup, /Selected screens/);
    assert.match(markup, /Technology/);
    assert.match(markup, /Design and development/);
    assert.match(markup, /href="https:\/\/github\.com\/example\/kicks"/);
    assert.equal((markup.match(/data-case-study-screen=/g) ?? []).length, 3);
    assert.equal((markup.match(/data-screen-milestone=/g) ?? []).length, 3);
    assert.equal((markup.match(/data-case-image=/g) ?? []).length, 1);
    assert.match(markup, /aria-label="Selected screen milestones"/);
    assert.match(markup, /data-milestone-progress=/);
    assert.match(markup, /data-screen-milestone="1"[^>]*>[\s\S]*?01 \/ 03[\s\S]*?<\/button>/);
    assert.doesNotMatch(markup, /Opening|Explore|Details|Decision|Complete/);
    assert.doesNotMatch(markup, /<figcaption>|Desktop|case-study__browser/);
    assert.match(markup, /data-case-handoff=/);
    assert.match(markup, /data-handoff-progress=/);
    assert.doesNotMatch(markup, /Scroll to continue/);
    assert.match(markup, /class="case-study__handoff-milestones"[^>]*>[\s\S]*01 \/ 02[\s\S]*02 \/ 02/);
    assert.match(markup, /data-handoff-title[^>]*>Vouch Dashboard<\/span>/);
    assert.match(markup, /data-handoff-invert=/);
    assert.match(markup, /aria-label="Continue to Vouch Dashboard"/);
    assert.equal((markup.match(/data-case-study-screen=/g) ?? []).length, 3);
    assert.equal((markup.match(/data-case-image-frame=/g) ?? []).length, 0);
    assert.equal((markup.match(/data-case-screen-image=/g) ?? []).length, 3);
    assert.match(markup, /class="case-study__back project-link group"[^>]*aria-label="Back to Works"/);
    assert.match(markup, /aria-label="Back"/);

    const finalMarkup = renderToStaticMarkup(React.createElement(ProjectCaseStudyView, {
      project,
      nextProject: null,
      currentProjectIndex: 1,
      projectCount: 2,
      onBack: () => {},
      onNext: () => {},
    }));

    assert.match(finalMarkup, /02 \/ 02/);
    assert.match(finalMarkup, />WORKS</);
    assert.match(finalMarkup, /aria-label="Return to Works"/);

    const yugenMarkup = renderToStaticMarkup(React.createElement(ProjectCaseStudyView, {
      project: {
        id: '03',
        title: 'YUGEN Concept',
        category: 'Full-stack Developer',
        summary: 'A Japanese fine-dining concept.',
        desc: 'An immersive restaurant experience.',
        img: '/yugen-hero.png',
        gallery: Array.from({ length: 7 }, (_, index) => `/yugen-${index + 1}.png`),
        roles: 'Full-stack Developer',
        duration: 'Concept project',
        tools: ['Next.js', 'React', 'GSAP'],
        visitUrl: 'https://yugen-restaurant.vercel.app/',
      },
      nextProject: null,
      currentProjectIndex: 2,
      projectCount: 3,
      onBack: () => {},
      onNext: () => {},
    }));

    assert.match(yugenMarkup, /href="https:\/\/yugen-restaurant\.vercel\.app\/"/);
    assert.match(yugenMarkup, /Live site ↗/);
    assert.equal((yugenMarkup.match(/data-case-study-screen=/g) ?? []).length, 7);
  } finally {
    await vite.close();
  }
});
