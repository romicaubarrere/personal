import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const formation = await readFile(join(root, 'dist', 'formacion.html'), 'utf8');
const scope = await readFile(join(root, 'docs', 'current-work-public-scope.md'), 'utf8');

function currentRoleBlock(source) {
  const match = source.match(/<article class="job-card reveal"[^>]*>[\s\S]*?<span class="job-org">eagerworks<\/span>[\s\S]*?<\/article>/i);
  assert.ok(match, 'No se encontró la experiencia actual de eagerworks');
  return match[0];
}

test('el trabajo actual usa únicamente responsabilidades públicas del rol', () => {
  const role = currentRoleBlock(formation);
  assert.match(role, /Project Manager/);
  assert.match(role, /equipos de desarrollo/);
  assert.match(role, /team leads/);
  assert.match(role, /stakeholders/);
  assert.match(role, /planificaci(?:ó|&oacute;)n/);
  assert.match(role, /ceremonias (?:á|&aacute;)giles/);
  assert.match(role, /entregas/);
  assert.match(role, /riesgos/);
});

test('el portfolio no convierte clientes o material interno en evidencia personal', () => {
  const role = currentRoleBlock(formation);
  for (const forbidden of [
    /Sweat Connect/i,
    /Veo Casas/i,
    /BODYROK/i,
    /MindBody/i,
    /roadmap/i,
    /Figma/i,
    /Slack/i,
    /Jira/i,
    /arquitectura/i,
    /credencial/i
  ]) assert.doesNotMatch(role, forbidden);
});

test('la política de publicación documenta evidencia y límites explícitos', () => {
  assert.match(scope, /evidencia pública revisada nuevamente el 3 de septiembre de 2026/i);
  assert.match(scope, /eagerworks\.com\/careers\/project-manager/);
  assert.match(scope, /Sí se puede publicar/);
  assert.match(scope, /No se publica sin evidencia o autorización explícita/);
  assert.match(scope, /Nombres de clientes asociados personalmente a Romina/);
  assert.match(scope, /Roadmaps, backlog, métricas de producto/);
  assert.match(scope, /Capturas de diseños, Figma, Slack, Jira/);
  assert.match(scope, /evidencia pública que vincule a Romina con ese caso o una autorización explícita/);
});
