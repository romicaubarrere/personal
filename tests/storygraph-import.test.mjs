import assert from 'node:assert/strict';
import test from 'node:test';
import { makeCoverLabel, parseCsv, renderReadingModule, selectCurrentReading } from '../scripts/import-storygraph.mjs';

test('parseCsv soporta comas, comillas y saltos dentro de campos', () => {
  const rows = parseCsv('Title,Authors,Read Status,Review\n"Libro, uno","Autora ""A""",currently-reading,"línea 1\nlínea 2"\n');
  assert.deepEqual(rows[1], ['Libro, uno', 'Autora "A"', 'currently-reading', 'línea 1\nlínea 2']);
});

test('selectCurrentReading elige el currently-reading más recientemente activo', () => {
  const csv = [
    'Title,Authors,Read Status,Last Date Read,Date Added',
    'Libro viejo,Autora A,currently-reading,2026-08-01,2026-07-01',
    'Libro terminado,Autor B,read,2026-08-20,2026-08-02',
    'Libro actual,Autora C,currently-reading,2026-08-21,2026-08-03'
  ].join('\n');

  assert.deepEqual(selectCurrentReading(csv), {
    title: 'Libro actual',
    author: 'Autora C',
    status: 'currently-reading',
    lastRead: '2026-08-21',
    added: '2026-08-03'
  });
});

test('selectCurrentReading falla de forma explícita si no hay lectura actual', () => {
  const csv = 'Title,Authors,Read Status\nLibro,Autora,read\n';
  assert.throws(() => selectCurrentReading(csv), /currently-reading/);
});

test('renderReadingModule genera datos estáticos y etiqueta visual coherente', () => {
  const moduleText = renderReadingModule({ title: 'Reina de Sombras', author: 'Sarah J. Maas' }, '2026-08-22');
  assert.match(moduleText, /Reina de Sombras/);
  assert.match(moduleText, /Sarah J\. Maas/);
  assert.match(moduleText, /R · D · S/);
  assert.match(moduleText, /22 de agosto de 2026/);
  assert.equal(makeCoverLabel('Dune'), 'DUN');
});

test('normaliza las fechas con barras del export real para ordenar y agrupar', async () => {
  const { selectReadingHistory, calculateReadingStats } = await import('../scripts/import-storygraph.mjs');
  const csv = [
    'Title,Authors,Read Status,Last Date Read,Star Rating',
    'Más nuevo,Autora,read,2026/08/15,4',
    'Más viejo,Autor,read,2025/01/02,5'
  ].join('\n');
  const history = selectReadingHistory(csv);
  assert.equal(history[0].finishedAt, '2026-08-15');
  assert.deepEqual(calculateReadingStats(history).byYear, [
    { year: '2026', count: 1 },
    { year: '2025', count: 1 }
  ]);
});
