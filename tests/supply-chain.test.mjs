import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFile(join(root, path), 'utf8');
const packageJson = JSON.parse(await read('package.json'));
const lockfile = JSON.parse(await read('package-lock.json'));
const nvmrc = (await read('.nvmrc')).trim();
const npmrc = await read('.npmrc');
const workflows = [
  await read('.github/workflows/deploy-pages.yml'),
  await read('.github/workflows/rollback-pages.yml')
];
const documentation = await read('docs/supply-chain.md');

test('WEB-130 fija Node y npm en desarrollo y entrega', () => {
  assert.equal(nvmrc, '22.19.0');
  assert.equal(packageJson.engines.node, '22.19.0');
  assert.equal(packageJson.engines.npm, '11.9.0');
  assert.equal(packageJson.packageManager, 'npm@11.9.0');
  assert.match(npmrc, /^engine-strict=true$/m);
  assert.match(npmrc, /^ignore-scripts=true$/m);
  for (const workflow of workflows) {
    assert.match(workflow, /node-version: 22\.19\.0/);
    assert.match(workflow, /npm@11\.9\.0/);
    assert.match(workflow, /npm ci --ignore-scripts/);
  }
});

test('WEB-130 fija todas las acciones externas a commits completos', () => {
  for (const workflow of workflows) {
    const actions = [...workflow.matchAll(/^\s*uses:\s*([^\s]+).*$/gm)].map((match) => match[1]);
    assert.ok(actions.length > 0);
    for (const action of actions) assert.match(action, /^[^@]+@[0-9a-f]{40}$/);
  }
});

test('WEB-130 conserva hashes de integridad y operación documentada', () => {
  assert.equal(lockfile.lockfileVersion, 3);
  const registryPackages = Object.entries(lockfile.packages)
    .filter(([path, value]) => path && value.resolved?.startsWith('https://registry.npmjs.org/'));
  assert.ok(registryPackages.length > 0);
  for (const [path, value] of registryPackages) {
    assert.ok(value.integrity, `${path} debe conservar integrity`);
  }
  assert.match(documentation, /SHA completo/);
  assert.match(documentation, /no automatiza su integración/);
});
