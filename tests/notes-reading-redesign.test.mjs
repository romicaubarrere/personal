import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const home = await readFile(join(root, 'dist', 'index.html'), 'utf8');
const reading = await readFile(join(root, 'dist', 'lecturas.html'), 'utf8');
const display = await readFile(join(root, 'src', 'data', 'reading-display.ts'), 'utf8');

test('WEB-138 prioriza escritura antes que lectura en home y página completa', () => {
  assert.ok(home.indexOf('mis notas') < home.indexOf('leyendo ahora'));
  assert.ok(reading.indexOf('mis notas') < reading.indexOf('Leyendo ahora'));
  assert.match(home, /Lo que <em>escribo<\/em> y lo que leo/);
  assert.match(reading, /Primero escribo\. Después, <em>leo<\/em>/);
});

test('WEB-138 publica Reina de sombras como lectura actual', () => {
  assert.match(display, /title: 'Reina de sombras'/);
  assert.match(display, /author: 'Sarah J\. Maas'/);
  assert.match(home, /Reina de sombras/);
  assert.match(reading, /Reina de sombras/);
});

test('WEB-138 limita la muestra pública a cinco lecturas con portadas remotas', () => {
  assert.match(display, /visibleReadingLimit = 5/);
  assert.equal((reading.match(/class="reading-card"/g) ?? []).length, 5);
  assert.equal((reading.match(/covers\.openlibrary\.org\/b\/isbn\//g) ?? []).length, 6);
  for (const title of ['Heredera De Fuego', 'Crown of Midnight', 'Trono De Cristal', 'Toda la verdad de mis mentiras', 'Pissoteando mitos']) {
    assert.match(reading, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
});

test('WEB-138 retira export, fuente técnica y estadística anual de la interfaz', () => {
  assert.doesNotMatch(reading, /export personal|StoryGraph|reading:import|Por año|fecha de finalización/i);
  assert.doesNotMatch(home, /Abrir mi historial y estadísticas/);
  assert.match(reading, /Las cuentas del margen/);
});
