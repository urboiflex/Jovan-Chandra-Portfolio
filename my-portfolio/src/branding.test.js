import assert from 'node:assert/strict';
import test from 'node:test';
import { access, readFile } from 'node:fs/promises';

test('presents Jovan Chandra branding in the browser tab and package metadata', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const packageLock = JSON.parse(await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'));

  assert.match(html, /<title>Jovan Chandra<\/title>/);
  assert.match(html, /href="\/jovan-chandra-logo\.png"/);
  assert.equal(packageJson.name, 'jovan-chandra-portfolio');
  assert.equal(packageLock.name, 'jovan-chandra-portfolio');
  assert.equal(packageLock.packages[''].name, 'jovan-chandra-portfolio');
  await access(new URL('../public/jovan-chandra-logo.png', import.meta.url));
});
