import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(repositoryRoot, 'dist');
const home = await readFile(join(distRoot, 'index.html'), 'utf8');
const analyticsSource = await readFile(join(repositoryRoot, 'src', 'scripts', 'analytics.js'), 'utf8');
const baseLayout = await readFile(join(repositoryRoot, 'src', 'layouts', 'BaseLayout.astro'), 'utf8');
const homeScripts = await readFile(
  join(repositoryRoot, 'src', 'components', 'home', 'HomeScripts.astro'),
  'utf8'
);
const contract = await readFile(join(repositoryRoot, 'docs', 'analytics-events.md'), 'utf8');
const outcomes = await readFile(join(repositoryRoot, 'docs', 'analytics-outcomes.md'), 'utf8');

const publishedEvents = [...new Set(
  [...home.matchAll(/data-analytics-event="([^"]+)"/g)].map((match) => match[1])
)].sort();
const documentedEvents = [...contract.matchAll(/\| `([a-z][a-z0-9_]+)` \|/g)]
  .map((match) => match[1])
  .sort();

test('los eventos publicados coinciden con el contrato de medición', () => {
  assert.deepEqual(publishedEvents, [
    'contact_cv_download',
    'contact_email_click',
    'contact_linkedin_click',
    'persistent_contact_click',
    'project_case_open',
    'view_projects_click'
  ]);
  assert.deepEqual(documentedEvents, publishedEvents);
});

test('los resultados profesionales tienen un registro manual sin datos personales', () => {
  assert.match(outcomes, /contacto_recibido/);
  assert.match(outcomes, /propuesta_proyecto/);
  assert.match(outcomes, /invitacion_charla/);
  assert.match(outcomes, /fecha,resultado,origen,estado,notas/);
  assert.match(outcomes, /No registrar nombres, emails/);
  assert.match(outcomes, /WEB-065/);
});

test('la capa de medición conserva un contrato neutral y evita datos personales', () => {
  assert.match(homeScripts, /import '\.\.\/\.\.\/scripts\/analytics\.js'/);
  assert.match(analyticsSource, /portfolio:analytics/);
  assert.match(analyticsSource, /target\.dispatchEvent\(new CustomEvent/);
  assert.match(analyticsSource, /path: pathname/);
  assert.match(analyticsSource, /target_kind: element\.tagName\.toLowerCase\(\)/);
  assert.doesNotMatch(analyticsSource, /fetch\(|sendBeacon|XMLHttpRequest|localStorage|sessionStorage|document\.cookie|identify\(/);
  assert.doesNotMatch(analyticsSource, /innerText|textContent|href|mailto/);
  assert.match(contract, /sin query string ni fragmento/);
});

test('Umami queda limitado a producción y recibe sólo el contrato permitido', () => {
  assert.match(baseLayout, /src="https:\/\/cloud\.umami\.is\/script\.js"/);
  assert.match(baseLayout, /data-website-id="2b78dc4e-aebb-447e-b1d4-948a411e6b81"/);
  assert.match(baseLayout, /data-domains="romicaubarrere\.github\.io"/);
  assert.match(baseLayout, /data-exclude-search="true"/);
  assert.match(baseLayout, /data-exclude-hash="true"/);
  assert.match(baseLayout, /data-do-not-track="true"/);
  assert.match(analyticsSource, /target\.umami\.track\(detail\.name/);
  assert.match(analyticsSource, /path: detail\.path/);
  assert.match(analyticsSource, /target_kind: detail\.target_kind/);
  assert.doesNotMatch(analyticsSource, /email|referrer|screen|title|hostname/);
});

test('los nombres inválidos no generan eventos', () => {
  assert.match(analyticsSource, /\^\[a-z\]\[a-z0-9\]\*\(\?:_\[a-z0-9\]\+\)\*\$/);
  assert.match(analyticsSource, /if \(!EVENT_NAME_PATTERN\.test\(name\)\) return null/);
  assert.match(analyticsSource, /if \(!detail\) return false/);
});
