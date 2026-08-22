import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(join(repositoryRoot, 'index.html'), 'utf8');
const formationHtml = await readFile(join(repositoryRoot, 'formacion.html'), 'utf8');

function extractIds(source) {
  return [...source.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
}

test('los documentos HTML están completos y en español', () => {
  for (const source of [html, formationHtml]) {
    assert.match(source, /<!doctype html>/i);
    assert.match(source, /<html\s+lang="es">/i);
    assert.match(source, /<title>[^<]*Romina Caubarrere[^<]*<\/title>/i);
    assert.match(source, /<\/body>\s*<\/html>\s*$/i);
  }
});

test('todos los identificadores HTML son únicos', () => {
  for (const [filename, source] of [['index.html', html], ['formacion.html', formationHtml]]) {
    const ids = extractIds(source);
    assert.equal(new Set(ids).size, ids.length, `Hay IDs duplicados en ${filename}`);
  }
});

test('la navegación principal contiene las siete secciones esperadas', () => {
  const nav = html.match(/<nav\b[^>]*id="primary-nav"[^>]*>([\s\S]*?)<\/nav>/i);
  assert.ok(nav, 'No se encontró la navegación principal');

  const links = [...nav[1].matchAll(/href="(#[^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(links, [
    '#sobre',
    '#formacion',
    '#proyectos',
    '#charlas',
    '#comunidades',
    '#lecturas',
    '#contacto'
  ]);

  const ids = new Set(extractIds(html));
  for (const link of links) {
    assert.ok(ids.has(link.slice(1)), `Falta el destino interno ${link}`);
  }
});

test('la portada enlaza al recorrido académico completo', () => {
  assert.match(html, /<section\b[^>]*id="formacion"/i);
  assert.match(html, /href="formacion\.html"/i);
  assert.match(formationHtml, /href="index\.html#formacion"/i);
});

test('el recorrido académico conserva toda la información aprobada', () => {
  assert.equal((formationHtml.match(/<details\b/g) ?? []).length, 8);
  assert.equal((formationHtml.match(/<li>/g) ?? []).length, 45);
  assert.equal((formationHtml.match(/class="project-sheet"/g) ?? []).length, 4);
  assert.equal((formationHtml.match(/class="extra-note"/g) ?? []).length, 3);
});

test('el menú móvil expone estado y controles accesibles', () => {
  assert.match(
    html,
    /<button\b[^>]*id="navToggle"[^>]*aria-controls="primary-nav"[^>]*aria-expanded="false"/i
  );
  assert.match(html, /<nav\b[^>]*id="primary-nav"[^>]*aria-label=/i);
  assert.match(html, /toggle\.setAttribute\('aria-expanded',String\(open\)\)/);
  assert.match(html, /e\.key==='Escape'/);
  assert.doesNotMatch(html, /nav a:nth-child\(n\+4\)/);
});

test('los enlaces de navegación no dependen de hover', () => {
  assert.match(html, /nav\.open\{display:flex;\}/);
  assert.match(html, /nav a\{top:0;width:100%/);
});

test('todos los bloques JavaScript tienen sintaxis válida', () => {
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(
    (match) => match[1]
  );

  assert.ok(scripts.length > 0, 'No se encontraron bloques JavaScript');
  for (const [index, script] of scripts.entries()) {
    assert.doesNotThrow(
      () => new Function(script),
      `El bloque JavaScript ${index + 1} contiene un error de sintaxis`
    );
  }
});

test('la experiencia respeta la preferencia de movimiento reducido', () => {
  assert.match(html, /matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
  assert.match(html, /reducedMotionQuery\.addEventListener\('change',applyMotionPreference\)/);
  assert.match(html, /if\(reducedMotion\)\{stopParallax\(\);showReveals\(\);\}/);
  assert.match(html, /cancelAnimationFrame\(parallaxFrame\)/);
  assert.match(html, /if\(reducedMotion\)\{showReveals\(\);return;\}/);
  assert.match(
    html,
    /@media\(prefers-reduced-motion:reduce\)\{html\{scroll-behavior:auto;\}[\s\S]*?\.reveal\{opacity:1;transform:none;\}\}/
  );
});
