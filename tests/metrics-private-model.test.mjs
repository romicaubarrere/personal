import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const model = await readFile(join(root, 'docs', 'metrics-private-model.md'), 'utf8');
const events = await readFile(join(root, 'docs', 'analytics-events.md'), 'utf8');
const outcomes = await readFile(join(root, 'docs', 'analytics-outcomes.md'), 'utf8');

test('WEB-065 evita presentar una ruta estática como back office privado', () => {
  assert.match(model, /No se construye ni publica una ruta privada dentro de GitHub Pages/);
  assert.match(model, /no es autenticación/);
  assert.match(model, /Umami Cloud/);
  assert.match(model, /Registro manual de outcomes/);
});

test('WEB-065 cubre las cinco métricas con fuentes explícitas', () => {
  for (const metric of [
    'Contactos recibidos',
    'Propuestas de proyectos',
    'Invitaciones a charlas',
    'Aperturas de casos de proyecto',
    'Descargas del CV'
  ]) assert.match(model, new RegExp(metric));

  for (const eventName of ['project_case_open', 'contact_cv_download']) {
    assert.match(model, new RegExp(eventName));
    assert.match(events, new RegExp(eventName));
  }

  for (const outcome of ['contacto_recibido', 'propuesta_proyecto', 'invitacion_charla']) {
    assert.match(outcomes, new RegExp(outcome));
  }
});

test('WEB-065 mantiene outcomes reales fuera del repositorio y sin datos personales', () => {
  assert.match(model, /El registro real de outcomes no se commitea/);
  assert.match(outcomes, /El archivo real con outcomes se mantiene privado y no se commitea/);
  assert.match(outcomes, /No registrar nombres, emails, tel&eacute;fonos, mensajes completos, empresas ni informaci&oacute;n confidencial/);
  assert.match(model, /No se usa `umami\.identify\(\)`/);
  assert.match(model, /no requieren almacenar nombres, emails, empresas o mensajes/);
});
