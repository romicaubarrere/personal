import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateReadingStats,
  makeCoverLabel,
  parseCsv,
  renderReadingModule,
  selectCurrentReading,
  selectReadingHistory
} from '../scripts/import-storygraph.mjs';

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

test('selectReadingHistory usa solo filas terminadas y conserva únicamente datos presentes', () => {
  const csv = [
    'Title,Authors,Read Status,Last Date Read,Star Rating',
    'Leyendo ahora,Autora A,currently-reading,2026-08-22,',
    'Terminado nuevo,Autor B,read,2026-08-20,4.5',
    'Terminado sin nota,Autora C,finished,2025-04-03,',
    'Pendiente,Autor D,to-read,,5'
  ].join('\n');

  assert.deepEqual(selectReadingHistory(csv), [
    { title: 'Terminado nuevo', author: 'Autor B', finishedAt: '2026-08-20', rating: 4.5 },
    { title: 'Terminado sin nota', author: 'Autora C', finishedAt: '2025-04-03' }
  ]);
});

test('calculateReadingStats deriva totales, promedio y distribución anual', () => {
  const history = [
    { title: 'A', author: 'AA', finishedAt: '2026-08-20', rating: 4.5 },
    { title: 'B', author: 'BB', finishedAt: '2026-01-02', rating: 3.5 },
    { title: 'C', author: 'CC', finishedAt: '2025-05-01' }
  ];

  assert.deepEqual(calculateReadingStats(history), {
    totalFinished: 3,
    ratedCount: 2,
    averageRating: 4,
    byYear: [
      { year: '2026', count: 2 },
      { year: '2025', count: 1 }
    ]
  });
  assert.equal(calculateReadingStats([]), null);
});

test('renderReadingModule genera datos estáticos, historial y estadísticas', () => {
  const history = [{ title: 'Libro', author: 'Autora', finishedAt: '2026-08-20', rating: 5 }];
  const moduleText = renderReadingModule({ title: 'Reina de Sombras', author: 'Sarah J. Maas' }, '2026-08-22', history);
  assert.match(moduleText, /Reina de Sombras/);
  assert.match(moduleText, /Sarah J\. Maas/);
  assert.match(moduleText, /R · D · S/);
  assert.match(moduleText, /22 de agosto de 2026/);
  assert.match(moduleText, /readingHistory/);
  assert.match(moduleText, /"totalFinished": 1/);
  assert.equal(makeCoverLabel('Dune'), 'DUN');
});
