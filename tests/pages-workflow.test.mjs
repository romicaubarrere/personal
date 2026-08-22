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
const rollbackWorkflow = await readFile(
  join(repositoryRoot, '.github', 'workflows', 'rollback-pages.yml'),
  'utf8'
);
const productionVerifier = await readFile(
  join(repositoryRoot, 'scripts', 'verify-production.mjs'),
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
  assert.match(workflow, /cancel-in-progress: \$\{\{ github\.event_name == 'pull_request' \}\}/);
  assert.equal((workflow.match(/npm run build/g) ?? []).length, 1);
});

test('el repositorio usa un único pipeline y no conserva un workflow de tests competidor', async () => {
  await assert.rejects(access(join(repositoryRoot, '.github', 'workflows', 'test.yml')));
});

test('Pages verifica la publicación real después del deploy', () => {
  assert.match(workflow, /verify:[\s\S]*?needs: deploy/);
  assert.match(
    workflow,
    /verify:[\s\S]*?uses: actions\/checkout@v7[\s\S]*?run: node scripts\/verify-production\.mjs/
  );
  assert.match(workflow, /PAGE_URL: \$\{\{ needs\.deploy\.outputs\.page_url \}\}/);
  assert.match(workflow, /PUBLIC_BUILD_SHA: \$\{\{ github\.sha \}\}/);
  assert.match(workflow, /EXPECTED_SHA: \$\{\{ github\.sha \}\}/);
  assert.match(workflow, /run: node scripts\/verify-production\.mjs/);
  for (const route of ['en.html', 'pt.html', 'como-trabajo.html', 'formacion.html', 'comunidad-charlas.html', 'sitemap.xml', 'feed.xml', '404.html']) {
    assert.match(productionVerifier, new RegExp(route.replace('.', '\\.')));
  }
  assert.match(productionVerifier, /posts\/por-que-hago-tantas-preguntas\.html/);
  assert.match(productionVerifier, /hreflang/);
  assert.match(productionVerifier, /build-commit/);
  assert.match(productionVerifier, /_astro/);
  assert.match(productionVerifier, /attempts/);
});

test('WEB-129 reconstruye, prueba y verifica un ref estable antes del rollback', () => {
  assert.match(rollbackWorkflow, /workflow_dispatch:[\s\S]*?ref:/);
  assert.match(rollbackWorkflow, /confirmation == 'ROLLBACK'/);
  assert.match(rollbackWorkflow, /git rev-parse --verify 'HEAD\^\{commit\}'/);
  assert.match(rollbackWorkflow, /git merge-base --is-ancestor/);
  assert.match(
    rollbackWorkflow,
    /PUBLIC_BUILD_SHA: \$\{\{ steps\.revision\.outputs\.selected_sha \}\}/
  );
  assert.match(rollbackWorkflow, /run: node --test/);
  assert.match(rollbackWorkflow, /run: npm run test:e2e/);
  assert.match(rollbackWorkflow, /uses: actions\/upload-pages-artifact@v5\.0\.0/);
  assert.match(
    rollbackWorkflow,
    /EXPECTED_SHA: \$\{\{ needs\.validate\.outputs\.selected_sha \}\}/
  );
  assert.match(rollbackWorkflow, /run: node scripts\/verify-production\.mjs/);
});

test('WEB-129 serializa el deploy normal y el rollback sobre Pages', () => {
  assert.match(workflow, /group: .*portfolio-pages-production/);
  assert.match(rollbackWorkflow, /group: portfolio-pages-production/);
  assert.match(rollbackWorkflow, /cancel-in-progress: false/);
});
