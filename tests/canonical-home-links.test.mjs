import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');

test('ninguna ruta pública enlaza la variante duplicada index.html de la portada', async () => {
  const routes = (await readdir(dist, { recursive: true })).filter((route) => route.endsWith('.html'));
  const duplicateHomeLink = /href="(?:(?:\.\.\/)*|\/personal\/)index\.html(?:[#?][^"]*)?"/;

  for (const route of routes) {
    const html = await readFile(join(dist, route), 'utf8');
    assert.doesNotMatch(html, duplicateHomeLink, route);
  }
});

test('las rutas españolas conservan sus fragmentos sobre la portada canónica', async () => {
  const expected = new Map([
    ['como-trabajo.html', ['/personal/', '/personal/#contacto']],
    ['comunidad-charlas.html', ['/personal/#charlas', '/personal/#contacto']],
    ['formacion.html', ['/personal/#sobre', '/personal/#contacto', '/personal/']],
    ['posts/por-que-hago-tantas-preguntas.html', ['/personal/#lecturas', '/personal/']],
    ['posts/cuando-puedas.html', ['/personal/#lecturas', '/personal/']]
  ]);

  for (const [route, hrefs] of expected) {
    const html = await readFile(join(dist, route), 'utf8');
    for (const href of hrefs) {
      assert.ok(html.includes(`href="${href}"`), `${route}: falta ${href}`);
    }
  }
});
