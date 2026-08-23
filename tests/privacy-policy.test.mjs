import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('..', import.meta.url).pathname;

test('la política se publica en los tres idiomas y declara el estado real', async () => {
  const routes = ['privacidad.html', 'en/privacy.html', 'pt/privacidade.html'];
  for (const route of routes) {
    const page = await readFile(join(root, 'dist', route), 'utf8');
    assert.match(page, /Umami Cloud/);
    assert.match(page, /https:\/\/umami\.is\/privacy/);
    assert.match(page, /gratuito|free Hobby|gratuito Hobby/);
    assert.match(page, /rominacaubarrere@gmail\.com/);
    assert.match(page, /(?:23 (?:de )?agosto (?:de )?2026|August 23, 2026)/i);
  }
  const es = await readFile(join(root, 'dist', routes[0]), 'utf8');
  assert.match(es, /La analítica externa todavía no está activa/);
  assert.match(es, /no envía eventos ni datos de navegación/);
});

test('las tres portadas enlazan su política localizada', async () => {
  const expected = new Map([
    ['index.html', '/personal/privacidad.html'],
    ['en.html', '/personal/en/privacy.html'],
    ['pt.html', '/personal/pt/privacidade.html']
  ]);
  for (const [route, href] of expected) {
    const page = await readFile(join(root, 'dist', route), 'utf8');
    assert.match(page, new RegExp(`href="${href}"`));
  }
});

test('todas las rutas públicas dejan la política al alcance desde el footer', async () => {
  const { readdir } = await import('node:fs/promises');
  const routes = (await readdir(join(root, 'dist'), { recursive: true })).filter((route) => route.endsWith('.html'));
  for (const route of routes) {
    const page = await readFile(join(root, 'dist', route), 'utf8');
    if (/\/(?:privacy|privacidade)\.html$/.test(route) || route === 'privacidad.html') continue;
    const expected = route.startsWith('en/') || route === 'en.html'
      ? /href="[^"]*privacy\.html"/
      : route.startsWith('pt/') || route === 'pt.html'
        ? /href="[^"]*privacidade\.html"/
        : /href="[^"]*privacidad\.html"/;
    assert.match(page.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? '', expected, route);
  }
});
