import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
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
  assert.match(workflow, /contents: read/);
  assert.match(workflow, /pages: write/);
  assert.match(workflow, /id-token: write/);
  assert.match(workflow, /uses: withastro\/action@v6/);
  assert.match(workflow, /uses: actions\/deploy-pages@v5/);
});

test('Pages verifica la publicación real después del deploy', () => {
  assert.match(workflow, /verify:\n\s+needs: deploy/);
  assert.match(workflow, /PAGE_URL: \$\{\{ needs\.deploy\.outputs\.page_url \}\}/);
  assert.match(workflow, /curl --fail --location --retry 6 --retry-delay 10 --retry-all-errors/);
  assert.match(workflow, /<html lang="es">/);
  assert.match(workflow, /https:\/\/romicaubarrere\.github\.io\/personal\//);
  assert.match(workflow, /\/personal\/_astro\//);
});
