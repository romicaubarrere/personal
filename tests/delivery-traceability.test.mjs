import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFile(join(root, path), 'utf8');
const documentation = await read('docs/delivery-traceability.md');
const pullRequestTemplate = await read('.github/pull_request_template.md');

test('WEB-132 limita WIP y evita reclamar trabajo duplicado o bloqueado', () => {
  assert.match(documentation, /máximo tres tickets de entrega en `Doing`/);
  assert.match(documentation, /suite de QA no consumen ese límite/);
  assert.match(documentation, /ramas y pull requests abiertos/);
  assert.match(documentation, /documentar cualquier bloqueo o excepción explícita/);
  assert.match(documentation, /Una tarjeta bloqueada conserva su estado/);
});

test('WEB-132 exige trazabilidad y evidencia de cierre', () => {
  for (const artifact of ['tarjeta', 'rama', 'pull request', 'commit', 'despliegue']) {
    assert.match(documentation.toLowerCase(), new RegExp(artifact));
  }
  assert.match(documentation, /SHA final integrado/);
  assert.match(documentation, /cantidad de pruebas/);
  assert.match(documentation, /URL pública verificada/);
  assert.match(documentation, /ramas remotas integradas se eliminan/);
  assert.match(documentation, /no se eliminan como\s+parte de una limpieza general/);
});

test('WEB-132 incorpora el contrato en la plantilla de pull request', () => {
  assert.match(pullRequestTemplate, /URL de la tarjeta/);
  assert.match(pullRequestTemplate, /otro ticket, rama o PR activo/);
  assert.match(pullRequestTemplate, /Commit integrado/);
  assert.match(pullRequestTemplate, /Pruebas: resultado y cantidad/);
  assert.match(pullRequestTemplate, /URL desplegada/);
  assert.match(pullRequestTemplate, /eliminar la rama remota/);
});
