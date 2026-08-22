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

test('la portada enlaza la página completa de lecturas', () => {
  assert.match(home, /href="lecturas\.html">Abrir mi historial y estad(?:&iacute;|í)sticas/);
});

test('la página vuelve a la portada canónica sin index.html', () => {
  assert.match(readingPage, /class="reading-back" href="\/personal\/#lecturas"/);
  assert.doesNotMatch(readingPage, /href="(?:\/personal\/)?index\.html#/);
});

test('la página publica únicamente el historial y las estadísticas del export real', () => {
  assert.match(readingPage, /La Guerra del Arte/);
  assert.match(readingPage, /Steven Pressfield, David Alpuche, Shawn Coyne/);
  assert.match(readingPage, /112/);
  assert.match(readingPage, /94/);
  assert.match(readingPage, /4\.19/);
  assert.match(readingData, /export const readingHistory = \[/);
  assert.match(readingData, /"totalFinished": 112/);
  assert.match(readingData, /"ratedCount": 94/);
  assert.match(readingData, /"averageRating": 4\.19/);
  assert.doesNotMatch(readingPage, /Todavía no publico estadísticas|El historial espera el archivo completo/);
});

test('el historial conserva la grafía editorial verificada sin mojibake', () => {
  assert.match(readingPage, /Quédense en la trinchera y luego corran/);
  assert.match(readingData, /Quédense en la trinchera y luego corran/);
  assert.doesNotMatch(readingPage, /Quйdense/);
  assert.doesNotMatch(readingData, /Quйdense/);
});

test('la página explica la procedencia y evita scraping runtime', () => {
  assert.match(readingPage, /export personal de StoryGraph/);
  assert.match(readingPage, /npm run reading:import/);
  assert.match(readingPage, /No hay scraping/);
  assert.doesNotMatch(readingPage, /fetch\(|iframe/i);
  assert.match(readingPage, /prefers-reduced-motion:reduce/);
});
