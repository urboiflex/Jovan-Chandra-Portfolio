import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('passes dynamic project position into the case study handoff', async () => {
  const source = await readFile(new URL('./App.jsx', import.meta.url), 'utf8');
  const caseStudyRender = source.match(/<ProjectCaseStudyView[\s\S]*?\/>/)?.[0] ?? '';

  assert.match(caseStudyRender, /currentProjectIndex=\{selectedProjectIndex\}/);
  assert.match(caseStudyRender, /projectCount=\{PROJECTS_DATA\.length\}/);
  assert.match(caseStudyRender, /onBack=\{handleCaseStudyBack\}/);
  assert.match(caseStudyRender, /onNext=\{handleNextCaseStudy\}/);
});
