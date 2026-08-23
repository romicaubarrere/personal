import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const robots = await readFile(new URL('../public/robots.txt', import.meta.url), 'utf8');
const verifier = await readFile(new URL('../scripts/verify-production.mjs', import.meta.url), 'utf8');
const docs = await readFile(new URL('../docs/seo-crawling.md', import.meta.url), 'utf8');

test('el robots del subpath anuncia el sitemap real sin sustituir al robots raíz', () => {
  assert.match(robots, /Allow: \/personal\//);
  assert.match(robots, /Sitemap: https:\/\/romicaubarrere\.github\.io\/personal\/sitemap\.xml/);
  assert.match(docs, /no controla el crawling del host completo/i);
  assert.match(docs, /no puede publicar ni afirmar control sobre `\/robots\.txt` en la raíz/i);
});

test('la verificación de producción comprueba URLs efectivas de crawling', () => {
  assert.match(verifier, /const sitemapUrl = new URL\('sitemap\.xml', base\)/);
  assert.match(verifier, /const sitemap = await fetchText\(sitemapUrl\)/);
  assert.match(verifier, /for \(const location of sitemapLocations\)/);
  assert.match(verifier, /fetchText\('robots\.txt'\)/);
  assert.match(verifier, /new URL\('\/robots\.txt', base\)/);
  assert.match(verifier, /response\.status === 404/);
  assert.match(verifier, /robots raíz no administrado desde este proyecto/);
});
