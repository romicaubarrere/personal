import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const config = await readFile(join(root, 'playwright.config.ts'), 'utf8');
const deploy = await readFile(join(root, '.github', 'workflows', 'deploy-pages.yml'), 'utf8');
const rollback = await readFile(join(root, '.github', 'workflows', 'rollback-pages.yml'), 'utf8');
const qa = await readFile(join(root, 'docs', 'qa-strategy.md'), 'utf8');

test('WEB-063 cubre los tres motores principales en escritorio', () => {
  assert.match(config, /desktop-chromium/);
  assert.match(config, /Desktop Chrome/);
  assert.match(config, /desktop-firefox/);
  assert.match(config, /Desktop Firefox/);
  assert.match(config, /desktop-webkit/);
  assert.match(config, /Desktop Safari/);
});

test('WEB-063 conserva cobertura móvil en Chromium y WebKit', () => {
  assert.match(config, /mobile-chromium/);
  assert.match(config, /Pixel 7/);
  assert.match(config, /mobile-webkit/);
  assert.match(config, /iPhone 13/);
});

test('CI y rollback instalan la misma matriz Playwright', () => {
  for (const workflow of [deploy, rollback]) {
    assert.match(workflow, /playwright install --with-deps chromium firefox webkit/);
    assert.match(workflow, /Test Chromium Firefox and WebKit/);
  }
});

test('la estrategia distingue WebKit de una validación manual en Safari real', () => {
  assert.match(qa, /Chromium, Firefox y WebKit/);
  assert.match(qa, /Safari real/);
  assert.match(qa, /hardware físico/);
});
