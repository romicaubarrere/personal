import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const notFoundSource = await readFile(new URL('../src/pages/404.astro', import.meta.url), 'utf8');

test('la 404 conserva las raíces abreviadas de inglés y portugués', () => {
  assert.match(notFoundSource, /relativePath === 'en'/);
  assert.match(notFoundSource, /relativePath === 'pt'/);
  assert.match(notFoundSource, /relativePath\.startsWith\('en\/'\)/);
  assert.match(notFoundSource, /relativePath\.startsWith\('pt\/'\)/);
});
