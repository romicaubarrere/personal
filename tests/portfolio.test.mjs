import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(join(repositoryRoot, 'index.html'), 'utf8');
const formationHtml = await readFile(join(repositoryRoot, 'formacion.html'), 'utf8');
const favicon = await readFile(join(repositoryRoot, 'favicon.svg'), 'utf8');

function extractIds(source) {
  return [...source.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
}

function headingLevels(source) {
  return [...source.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
}

function relativeLuminance(hex) {
  const channels = hex.match(/[0-9a-f]{2}/gi).map((channel) => Number.parseInt(channel, 16) / 255);
  const linear = channels.map((channel) => (
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ));
  return (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2]);
}

function contrastRatio(foreground, background) {
  const values = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
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

test('ambas páginas permiten saltar al contenido principal', () => {
  for (const source of [html, formationHtml]) {
    assert.match(source, /<a\b[^>]*class="skip-link"[^>]*href="#main-content"/i);
    assert.match(source, /<main\b[^>]*id="main-content"[^>]*tabindex="-1"/i);
    assert.match(source, /:where\(a,button,summary,\[tabindex\]:not\(\[tabindex="-1"\]\)\):focus-visible/);
  }
});

test('el orden de encabezados no salta niveles', () => {
  for (const [filename, source] of [['index.html', html], ['formacion.html', formationHtml]]) {
    const levels = headingLevels(source);
    assert.equal(levels[0], 1, `${filename} debe comenzar con un h1`);
    for (let index = 1; index < levels.length; index += 1) {
      assert.ok(
        levels[index] <= levels[index - 1] + 1,
        `${filename} salta de h${levels[index - 1]} a h${levels[index]}`
      );
    }
  }
});

test('los SVG decorativos quedan fuera del árbol de accesibilidad', () => {
  const svgTags = [...html.matchAll(/<svg\b[^>]*>/gi)].map((match) => match[0]);
  assert.ok(svgTags.length > 0);
  for (const tag of svgTags) {
    assert.match(tag, /aria-hidden="true"/i);
    assert.match(tag, /focusable="false"/i);
  }
});

test('la paleta y los textos secundarios conservan contraste AA', () => {
  for (const source of [html, formationHtml]) {
    assert.match(source, /--green:#3c7549/);
    assert.match(source, /--sage:#657249/);
    assert.match(source, /--warm:#974629/);
  }
  assert.match(html, /\.patch:nth-child\(6n\+4\)\{background-color:var\(--rose\);color:var\(--ink\);\}/);
  assert.match(html, /\.patch \.cr\{font-size:12px;margin-top:4px;/);
  assert.match(html, /\.sticky small\{[^}]*color:#4a3a12/);

  const normalTextPairs = [
    ['#faf3e4', '#3c7549'],
    ['#faf3e4', '#657249'],
    ['#974629', '#faf3e4'],
    ['#974629', '#f1d3c8'],
    ['#241f18', '#cf7f6a'],
    ['#4a3a12', '#f6b9a6']
  ];
  for (const [foreground, background] of normalTextPairs) {
    assert.ok(
      contrastRatio(foreground, background) >= 4.5,
      `${foreground} sobre ${background} no alcanza contraste AA`
    );
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

test('el estante de proyectos se desplaza en una sola fila en móvil', () => {
  assert.match(
    html,
    /<div\b[^>]*class="shelf-scroll"[^>]*role="region"[^>]*aria-label="Estante de proyectos desplazable"[^>]*tabindex="0"/i
  );
  assert.match(html, /\.shelf-scroll\{overflow-x:auto;overscroll-behavior-inline:contain;scroll-snap-type:x proximity;touch-action:pan-x pan-y;/);
  assert.match(html, /-webkit-overflow-scrolling:touch/);
  assert.match(html, /\.books\{flex-wrap:nowrap;width:max-content;min-width:100%;\}/);
  assert.match(html, /\.spine\{flex:0 0 76px;scroll-snap-align:start;\}/);

  const projectTriggers = html.match(/<button\b[^>]*class="spine [^"]+"[^>]*type="button"/g) ?? [];
  assert.equal(projectTriggers.length, 5);
});

test('los proyectos usan botones semánticos con nombres accesibles', () => {
  const projectTriggers = [...html.matchAll(/<button\b([^>]*)class="spine [^"]+"([^>]*)>/g)];
  assert.equal(projectTriggers.length, 5);

  for (const trigger of projectTriggers) {
    const attributes = `${trigger[1]}${trigger[2]}`;
    assert.match(attributes, /type="button"/);
    assert.match(attributes, /aria-haspopup="dialog"/);
    assert.match(attributes, /aria-label="Abrir proyecto[^\"]+"/);
    assert.doesNotMatch(attributes, /role="button"|tabindex="0"/);
  }

  assert.match(html, /\.spine:focus-visible\{outline:3px solid var\(--gold\);outline-offset:3px;\}/);
  assert.doesNotMatch(html, /sp\.addEventListener\('keydown'/);
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
  const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => !/type="application\/ld\+json"/i.test(match[1]))
    .map((match) => match[2]);

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

test('la portada incluye metadatos SEO básicos válidos', () => {
  assert.match(html, /<title>Romina Caubarrere \| Project Manager de software<\/title>/i);
  assert.match(html, /<meta name="description" content="[^"]*Project Manager[^"]*">/i);
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/romicaubarrere\.github\.io\/personal\/">/i
  );
  assert.match(html, /<link rel="icon" type="image\/svg\+xml" href="favicon\.svg">/i);
  assert.match(favicon, /<svg\b[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/i);

  const jsonLd = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i
  );
  assert.ok(jsonLd, 'No se encontraron datos estructurados JSON-LD');

  const person = JSON.parse(jsonLd[1]);
  assert.equal(person['@context'], 'https://schema.org');
  assert.equal(person['@type'], 'Person');
  assert.equal(person.name, 'Romina Caubarrere');
  assert.equal(person.jobTitle, 'Project Manager de software');
  assert.equal(person.url, 'https://romicaubarrere.github.io/personal/');
});

test('el hero comunica el posicionamiento y ofrece las dos acciones principales', () => {
  assert.match(html, /Project Manager de software/);
  assert.match(
    html,
    /Conecto personas, producto y tecnolog&iacute;a para que proyectos complejos avancen y lleguen a resultados\./
  );
  assert.match(html, /class="hero-link primary" href="#proyectos">Ver proyectos<\/a>/);
  assert.match(html, /class="hero-link" href="#contacto">Contactarme<\/a>/);
});

test('el post-it del hero participa del layout y no usa posicionamiento parallax', () => {
  assert.match(html, /@media\(min-width:901px\)[\s\S]*?\.stickynote\{position:relative;/);
  assert.doesNotMatch(html, /class="stickynote parallax"/);
});

test('sobre mí reparte el recorrido en cuatro notas breves', () => {
  const notes = [...html.matchAll(/<article class="about-note reveal"/g)];

  assert.equal(notes.length, 4);
  assert.match(html, /<h3>Project Manager de software<\/h3>/);
  assert.match(html, /<h3>Rob&oacute;tica, Ceibal y UKG<\/h3>/);
  assert.match(html, /<h3>UTEC y habITar<\/h3>/);
  assert.match(html, /<h3>Women Techmakers y Chicas en Tecnolog&iacute;a<\/h3>/);
  assert.doesNotMatch(html, /Ac&aacute; va tu historia|Ac&aacute; va tu historia|La escribimos juntas|en tesis/i);
});
