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

test('la página de lecturas conserva la lectura real actual y no inventa historial', () => {
  assert.match(readingPage, /Reina de Sombras/);
  assert.match(readingPage, /Sarah J\. Maas/);
  assert.match(readingPage, /Todavía no publico estadísticas|Todav(?:&iacute;|í)a no publico estad(?:&iacute;|í)sticas/);
  assert.match(readingPage, /El historial espera el archivo completo/);
  assert.match(readingData, /export const readingHistory = \[\] as const/);
  assert.match(readingData, /export const readingStats = null/);
  assert.doesNotMatch(readingPage, /<strong>0<\/strong>/);
});

test('la página explica la procedencia y evita scraping runtime', () => {
  assert.match(readingPage, /export personal de StoryGraph/);
  assert.match(readingPage, /npm run reading:import/);
  assert.match(readingPage, /No hay scraping/);
  assert.doesNotMatch(readingPage, /fetch\(|iframe/i);
  assert.match(readingPage, /prefers-reduced-motion:reduce/);
});
