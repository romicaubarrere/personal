import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFile(join(root, path), 'utf8');
const config = await read('.github/dependabot.yml');
const policy = await read('docs/dependency-updates.md');

const ecosystemBlock = (name, nextName) => {
  const start = config.indexOf(`package-ecosystem: ${name}`);
  const end = nextName ? config.indexOf(`package-ecosystem: ${nextName}`, start) : config.length;
  assert.ok(start >= 0, `falta el ecosistema ${name}`);
  return config.slice(start, end);
};

test('WEB-131 cubre npm y GitHub Actions semanalmente', () => {
  assert.match(config, /^version: 2$/m);
  const npm = ecosystemBlock('npm', 'github-actions');
  const actions = ecosystemBlock('github-actions');
  for (const block of [npm, actions]) {
    assert.match(block, /directory: \/$/m);
    assert.match(block, /interval: weekly/);
    assert.match(block, /day: monday/);
    assert.match(block, /timezone: America\/Montevideo/);
  }
});

test('WEB-131 agrupa actualizaciones compatibles y limita el ruido', () => {
  const npm = ecosystemBlock('npm', 'github-actions');
  const actions = ecosystemBlock('github-actions');
  assert.match(npm, /open-pull-requests-limit: 3/);
  assert.match(actions, /open-pull-requests-limit: 2/);
  assert.match(npm, /production-compatible:[\s\S]*dependency-type: production/);
  assert.match(npm, /development-compatible:[\s\S]*dependency-type: development/);
  assert.match(npm, /npm-security:[\s\S]*applies-to: security-updates/);
  assert.match(actions, /actions-compatible:/);
  assert.equal((config.match(/- minor/g) ?? []).length, 3);
  assert.equal((config.match(/- patch/g) ?? []).length, 3);
});

test('WEB-131 documenta revisión humana y pipeline verde', () => {
  assert.match(policy, /todos los checks obligatorios en verde/);
  assert.match(policy, /No activar `auto-merge`/);
  assert.match(policy, /build de Astro, suite Node y Playwright/);
  assert.match(policy, /no publica ni integra directamente/);
});
