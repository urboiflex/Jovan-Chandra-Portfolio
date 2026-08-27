import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('serves client-side project routes through the Vite entry point on Vercel', async () => {
  let config = {};
  try {
    config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  assert.deepEqual(config.rewrites, [
    { source: '/(.*)', destination: '/index.html' },
  ]);
});
