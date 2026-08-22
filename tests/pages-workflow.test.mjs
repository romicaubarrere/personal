import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const workflow = await readFile(
  join(repositoryRoot, '.github', 'workflows', 'deploy-pages.yml'),
  'utf8'
);

test('Pages compila y publica Astro desde main con permisos mínimos', () => {
  assert.match(workflow, /push:\n\s+branches: \[main\]/);
  assert.match(workflow, /pull_request:\n\s+branches: \[main\]/);
  assert.match(workflow, /permissions: \{\}/);
  assert.match(workflow, /contents: read/);
  assert.match(workflow, /pages: write/);
  assert.match(workflow, /id-token: write/);
  assert.match(workflow, /run: npm ci/);
  assert.match(workflow, /run: npm run build/);
  assert.match(workflow, /run: node --test/);
  assert.match(workflow, /run: npx playwright install --with-deps chromium/);
  assert.match(workflow, /run: npm run test:e2e/);
  assert.match(workflow, /if: failure\(\)/);
  assert.match(workflow, /uses: actions\/upload-artifact@v4/);
  assert.match(workflow, /uses: actions\/upload-pages-artifact@v5\.0\.0/);
  assert.match(workflow, /uses: actions\/deploy-pages@v5/);
  assert.match(workflow, /if: github\.event_name != 'pull_request' && github\.ref == 'refs\/heads\/main'/);
  assert.match(workflow, /needs: validate/);
  assert.match(workflow, /cancel-in-progress: true/);
  assert.equal((workflow.match(/npm run build/g) ?? []).length, 1);
});

test('el repositorio usa un único pipeline y no conserva un workflow de tests competidor', async () => {
  await assert.rejects(access(join(repositoryRoot, '.github', 'workflows', 'test.yml')));
});

test('Pages verifica la publicación real después del deploy', () => {
  assert.match(workflow, /verify:[\s\S]*?needs: deploy/);
  assert.match(workflow, /PAGE_URL: \$\{\{ needs\.deploy\.outputs\.page_url \}\}/);
  assert.match(workflow, /curl --fail --location --retry 6 --retry-delay 10 --retry-all-errors/);
  assert.match(workflow, /<html lang="es">/);
  assert.match(workflow, /https:\/\/romicaubarrere\.github\.io\/personal\//);
  assert.match(workflow, /\/personal\/_astro\//);
});
