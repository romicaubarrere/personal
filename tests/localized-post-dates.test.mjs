import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

const dist = new URL('../dist/', import.meta.url).pathname;

const localizedRoutes = [
  ['en/posts/why-do-i-ask-so-many-questions.html', '2026-08-22T04:08:07Z', 'August 2026'],
  ['pt/posts/por-que-faco-tantas-perguntas.html', '2026-08-22T04:08:07Z', 'agosto de 2026'],
  ['en/posts/when-you-can.html', '2026-08-22T05:55:05Z', 'August 2026'],
  ['pt/posts/quando-puder.html', '2026-08-22T05:55:05Z', 'agosto de 2026']
];

test('las traducciones conservan la fecha exacta de publicación de cada nota', async () => {
  for (const [route, dateTime, dateLabel] of localizedRoutes) {
    const html = await readFile(join(dist, route), 'utf8');
    const structuredDataSource = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1];

    assert.ok(structuredDataSource, `${route}: falta BlogPosting JSON-LD`);
    const structuredData = JSON.parse(structuredDataSource);

    assert.equal(structuredData.datePublished, dateTime, `${route}: JSON-LD perdió precisión`);
    assert.match(html, new RegExp(`<time datetime="${dateTime}">${dateLabel}<\\/time>`), `${route}: <time> no coincide`);
  }
});
