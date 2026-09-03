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
const smoke = await readFile(join(root, 'e2e', 'cross-browser-smoke.spec.ts'), 'utf8');

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

test('Chromium mantiene regresión completa y los otros motores usan smoke focalizado', () => {
  assert.match(config, /const fullSuite = \/\.\*\\\.spec\\\.ts\//);
  assert.match(config, /const crossBrowserSmoke = \/cross-browser-smoke\\\.spec\\\.ts\//);
  assert.match(config, /desktop-chromium', testMatch: fullSuite/);
  assert.match(config, /mobile-chromium', testMatch: fullSuite/);
  assert.match(config, /desktop-firefox', testMatch: crossBrowserSmoke/);
  assert.match(config, /desktop-webkit', testMatch: crossBrowserSmoke/);
  assert.match(config, /mobile-webkit', testMatch: crossBrowserSmoke/);
  for (const contract of ['rutas principales', 'idioma y navegación', 'proyecto abre y cierra', 'reduced motion']) {
    assert.match(smoke, new RegExp(contract));
  }
});

test('CI y rollback instalan la misma matriz Playwright', () => {
  for (const workflow of [deploy, rollback]) {
    assert.match(workflow, /playwright install --with-deps chromium firefox webkit/);
    assert.match(workflow, /Test Chromium Firefox and WebKit/);
  }
});

test('la estrategia distingue cobertura automatizada de validación manual real', () => {
  assert.match(qa, /regresión completa de interacción se ejecuta en Chromium/i);
  assert.match(qa, /Firefox y WebKit ejecutan un smoke cross-browser/i);
  assert.match(qa, /Safari real/);
  assert.match(qa, /hardware físico/);
});
