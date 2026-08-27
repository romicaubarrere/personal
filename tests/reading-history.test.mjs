import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const home = await readFile(join(dist, 'index.html'), 'utf8');
const readingPage = await readFile(join(dist, 'lecturas.html'), 'utf8');
const readingData = await readFile(join(root, 'src', 'data', 'reading.ts'), 'utf8');
const readingDisplay = await readFile(join(root, 'src', 'data', 'reading-display.ts'), 'utf8');

test('la portada enlaza la muestra editorial de lecturas', () => {
  assert.match(home, /href="lecturas\.html"[^>]*>Ver mis últimas lecturas/);
});

test('la página vuelve a la portada canónica sin index.html', () => {
  assert.match(readingPage, /class="reading-back" href="\/personal\/#lecturas"/);
  assert.doesNotMatch(readingPage, /href="(?:\/personal\/)?index\.html#/);
});

test('la página conserva las estadísticas reales pero limita la muestra a cinco libros', () => {
  assert.match(readingPage, /Reina de sombras/);
  assert.match(readingPage, /Sarah J\. Maas/);
  assert.match(readingPage, /112/);
  assert.match(readingPage, /94/);
  assert.match(readingPage, /4\.19/);
  assert.equal((readingPage.match(/class="reading-card"/g) ?? []).length, 5);
  assert.match(readingData, /export const readingHistory = \[/);
  assert.match(readingData, /"totalFinished": 112/);
  assert.match(readingData, /"ratedCount": 94/);
  assert.match(readingData, /"averageRating": 4\.19/);
  assert.match(readingDisplay, /visibleReadingLimit = 5/);
});

test('las cinco lecturas visibles conservan la grafía editorial verificada', () => {
  for (const title of ['Heredera De Fuego', 'Crown of Midnight', 'Trono De Cristal', 'Toda la verdad de mis mentiras', 'Pissoteando mitos']) {
    assert.match(readingPage, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
  assert.doesNotMatch(readingPage, /Quйdense/);
  assert.doesNotMatch(readingData, /Quйdense/);
});

test('la página retira procedencia técnica y agrupación anual de la interfaz', () => {
  assert.doesNotMatch(readingPage, /export personal de StoryGraph|npm run reading:import|No hay scraping|Por año|fecha de finalización/i);
  assert.doesNotMatch(readingPage, /fetch\(|iframe/i);
  assert.match(readingPage, /prefers-reduced-motion:reduce/);
});
