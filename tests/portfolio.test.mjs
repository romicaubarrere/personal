import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  BIRTH_DATE,
  EASTER_EVENT,
  SPECIAL_DATES,
  calculateAge,
  findSpecialDate,
  findSpecialDates,
  formatSpecialDateLabel,
  getEasterSunday,
  parseSimulatedDate,
  resolveSpecialDate
} from '../src/scripts/special-dates.js';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(repositoryRoot, 'dist');
const htmlDocument = await readFile(join(distRoot, 'index.html'), 'utf8');
const formationDocument = await readFile(join(distRoot, 'formacion.html'), 'utf8');
const workDocument = await readFile(join(distRoot, 'como-trabajo.html'), 'utf8');
const communityDocument = await readFile(join(distRoot, 'comunidad-charlas.html'), 'utf8');
const homeStyles = await readFile(join(repositoryRoot, 'src', 'styles', 'home.css'), 'utf8');
const homeScripts = await readFile(
  join(repositoryRoot, 'src', 'components', 'home', 'HomeScripts.astro'),
  'utf8'
);
const formationStyles = await readFile(join(repositoryRoot, 'src', 'styles', 'formation.css'), 'utf8');
const html = htmlDocument.replace(/<\/head>/i, `<style>${homeStyles}</style></head>`);
const formationHtml = formationDocument.replace(/<\/head>/i, `<style>${formationStyles}</style></head>`);
const workHtml = workDocument.replace(/<\/head>/i, `<style>${homeStyles}</style></head>`);
const communityHtml = communityDocument.replace(/<\/head>/i, `<style>${formationStyles}</style></head>`);
const favicon = await readFile(join(distRoot, 'favicon.svg'), 'utf8');
const socialPreview = await readFile(join(distRoot, 'social-preview.png'));
const socialPreviewSource = await readFile(join(distRoot, 'social-preview.svg'), 'utf8');
const crochetCheckpoint = await readFile(
  join(repositoryRoot, 'docs/checkpoints/WEB-004-crochet-comparison.html'),
  'utf8'
);
const readme = await readFile(join(repositoryRoot, 'README.md'), 'utf8');
const architectureDecision = await readFile(
  join(repositoryRoot, 'docs', 'architecture-decision.md'),
  'utf8'
);
const astroMigrationPlan = await readFile(
  join(repositoryRoot, 'docs', 'astro-migration-plan.md'),
  'utf8'
);
const firstPost = await readFile(join(distRoot, 'posts', 'por-que-hago-tantas-preguntas.html'), 'utf8');
const postStyles = await readFile(join(repositoryRoot, 'src', 'styles', 'post.css'), 'utf8');
const projectDataSource = await readFile(join(repositoryRoot, 'src', 'data', 'projects.ts'), 'utf8');
const projectIslandSource = await readFile(
  join(repositoryRoot, 'src', 'components', 'islands', 'ProjectBookcase.tsx'),
  'utf8'
);
const blogGuide = await readFile(join(repositoryRoot, 'docs', 'blog-guide.md'), 'utf8');
const languageStrategy = await readFile(
  join(repositoryRoot, 'docs', 'language-strategy.md'),
  'utf8'
);
const projectCaseTemplate = await readFile(
  join(repositoryRoot, 'docs', 'project-case-template.md'),
  'utf8'
);

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
  for (const source of [html, formationHtml, workHtml]) {
    assert.match(source, /<!doctype html>/i);
    assert.match(source, /<html\s+lang="es">/i);
    assert.match(source, /<title>[^<]*Romina Caubarrere[^<]*<\/title>/i);
    assert.match(source, /<\/body>\s*<\/html>\s*$/i);
  }
});

test('la decisión histórica queda preservada y el plan Astro la reemplaza', () => {
  assert.match(architectureDecision, /Estado: reemplazada por WEB-086/);
  assert.match(architectureDecision, /Se mantiene la arquitectura actual de HTML, CSS y JavaScript nativos/);
  assert.match(architectureDecision, /No se incorpora Astro ni React en esta etapa/);
  assert.match(architectureDecision, /astro-migration-plan\.md/);

  assert.match(astroMigrationPlan, /ADR 002: migrar el portfolio a Astro/);
  assert.match(astroMigrationPlan, /Estado: implementada, revisada e integrada en `main`/);
  assert.match(astroMigrationPlan, /Reemplaza: WEB-071 y ADR 001/);
  assert.match(astroMigrationPlan, /base: '\/personal'/);
  assert.match(astroMigrationPlan, /build\.format: 'file'/);
  assert.match(astroMigrationPlan, /React se hidratará solamente en el libro de proyectos/);
  assert.match(astroMigrationPlan, /84a7d9a/);
  assert.match(astroMigrationPlan, /por-que-hago-tantas-preguntas\.html/);
  assert.match(astroMigrationPlan, /cuando-puedas\.html/);

  assert.match(readme, /docs\/architecture-decision\.md/);
  assert.match(readme, /docs\/astro-migration-plan\.md/);
});

test('WEB-054 publica una estrategia multilingüe sin exagerar niveles', async () => {
  const english = await readFile(join(distRoot, 'en.html'), 'utf8');
  const portuguese = await readFile(join(distRoot, 'pt.html'), 'utf8');

  assert.match(languageStrategy, /Estado: español, inglés y portugués habilitados/);
  assert.match(languageStrategy, /habla español e inglés/);
  assert.match(languageStrategy, /Habla bastante portugués/);
  assert.match(languageStrategy, /Estudió italiano y ruso/);
  assert.match(languageStrategy, /No se publican niveles CEFR/);
  assert.match(readme, /docs\/language-strategy\.md/);
  assert.match(html, /<html\s+lang="es">/i);
  assert.match(english, /<html\s+lang="en">/i);
  assert.match(portuguese, /<html\s+lang="pt">/i);
  assert.match(html, /Hablo espa&ntilde;ol e ingl&eacute;s, bastante portugu&eacute;s/);
  assert.match(english, /I speak Spanish and English, and quite a bit of Portuguese/);
  assert.match(portuguese, /Falo espanhol e inglês, e bastante português/);
  for (const source of [html, english, portuguese]) {
    assert.match(source, /hreflang="es"/);
    assert.match(source, /hreflang="en"/);
    assert.match(source, /hreflang="pt"/);
    assert.match(source, /hreflang="x-default"/);
  }
});

test('WEB-054 publica rutas internas equivalentes en inglés y portugués', async () => {
  for (const route of ['como-trabajo.html', 'comunidad-charlas.html', 'formacion.html']) {
    const english = await readFile(join(distRoot, 'en', route), 'utf8');
    const portuguese = await readFile(join(distRoot, 'pt', route), 'utf8');
    for (const source of [english, portuguese]) {
      assert.match(source, /hreflang="es"/);
      assert.match(source, /hreflang="en"/);
      assert.match(source, /hreflang="pt"/);
      assert.match(source, /hreflang="x-default"/);
      assert.doesNotMatch(source, /próximamente|coming soon|em breve/i);
    }
    assert.match(english, /<html\s+lang="en">/i);
    assert.match(portuguese, /<html\s+lang="pt">/i);
  }
});

test('WEB-054 traduce íntegramente las notas y conecta cada idioma equivalente', async () => {
  const routes = [
    ['en/posts/why-do-i-ask-so-many-questions.html', 'en', /Why do I ask so many <em>questions<\/em>/, /I simply like knowing things/],
    ['pt/posts/por-que-faco-tantas-perguntas.html', 'pt', /Por que faço tantas <em>perguntas<\/em>/, /Eu simplesmente gosto de saber/],
    ['en/posts/when-you-can.html', 'en', /When you <em>can<\/em>/, /Being direct does not mean being rude/],
    ['pt/posts/quando-puder.html', 'pt', /Quando <em>puder<\/em>/, /Ser direta não significa ser mal-educada/]
  ];
  for (const [route, lang, heading, signature] of routes) {
    const source = await readFile(join(distRoot, route), 'utf8');
    assert.match(source, new RegExp(`<html\\s+lang="${lang}">`, 'i'));
    assert.match(source, heading);
    assert.match(source, signature);
    assert.match(source, /hreflang="es"/);
    assert.match(source, /hreflang="en"/);
    assert.match(source, /hreflang="pt"/);
    assert.match(source, /hreflang="x-default"/);
    const article = JSON.parse(source.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i)[1]);
    assert.equal(article.inLanguage, lang);
  }
});

test('el blog publica una nota real con estructura reutilizable y accesible', () => {
  assert.match(firstPost, /<title>¿Por qué hago tantas preguntas\? \| Romina Caubarrere<\/title>/);
  assert.match(firstPost, /<meta name="description" content="[^"]+">/);
  assert.match(firstPost, /<meta name="author" content="Romina Caubarrere">/);
  assert.match(firstPost, /<link rel="canonical" href="https:\/\/romicaubarrere\.github\.io\/personal\/posts\/por-que-hago-tantas-preguntas\.html">/);
  assert.match(firstPost, /<link rel="stylesheet" href="\/personal\/_astro\/[^"?]+\.css">/);
  assert.doesNotMatch(firstPost, /<style>/);
  assert.match(firstPost, /<a class="skip-link" href="#main-content">Saltar al contenido<\/a>/);
  assert.match(firstPost, /<main class="cork" id="main-content" tabindex="-1">/);
  assert.match(firstPost, /<p class="summary">[^<]+<\/p>/);
  assert.match(firstPost, /<time datetime="2026-08">agosto 2026<\/time>/);
  assert.ok((firstPost.match(/<p(?:\s|>)/g) ?? []).length >= 40);
  assert.match(postStyles, /@media\(max-width:600px\)/);
  assert.match(postStyles, /:focus-visible/);
  assert.match(html, /href="posts\/por-que-hago-tantas-preguntas\.html"/);
  assert.match(html, /Publicado &middot; agosto 2026/);
  assert.match(html, /class="sticky-desc">Sobre preguntar por qu&eacute;/);
  assert.match(blogGuide, /Audiencia y temas/);
  assert.match(blogGuide, /PostLayout\.astro/);
  assert.match(blogGuide, /No se publican textos de muestra/);
});

test('todos los identificadores HTML son únicos', () => {
  for (const [filename, source] of [['index.html', html], ['formacion.html', formationHtml], ['como-trabajo.html', workHtml], ['comunidad-charlas.html', communityHtml]]) {
    const ids = extractIds(source);
    assert.equal(new Set(ids).size, ids.length, `Hay IDs duplicados en ${filename}`);
  }
});

test('las páginas permiten saltar al contenido principal', () => {
  for (const source of [html, formationHtml, workHtml, communityHtml]) {
    assert.match(source, /<a\b[^>]*class="skip-link"[^>]*href="#main-content"/i);
    assert.match(source, /<main\b[^>]*id="main-content"[^>]*tabindex="-1"/i);
    assert.match(source, /:where\(a,button,summary,\[tabindex\]:not\(\[tabindex="-1"\]\)\):focus-visible/);
  }
});

test('el orden de encabezados no salta niveles', () => {
  for (const [filename, source] of [['index.html', html], ['formacion.html', formationHtml], ['como-trabajo.html', workHtml], ['comunidad-charlas.html', communityHtml]]) {
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
  for (const source of [html, formationHtml, communityHtml]) {
    assert.match(source, /--green:#3c7549/);
    assert.match(source, /--sage:#657249/);
    assert.match(source, /--warm:#974629/);
  }
  assert.match(html, /\.patch:nth-child\(6n\+4\)\{background-color:var\(--rose\);color:var\(--ink\);\}/);
  assert.match(html, /\.patch \.cr\{font-size:12px;margin-top:4px;/);
  assert.match(html, /\.sticky small\{[^}]*color:#4a3a12/);
  assert.match(html, /\.scrollhint\{[^}]*opacity:\.85/);
  assert.match(html, /\.shelfhint\{[^}]*rgba\(250,243,228,\.7\)/);
  assert.match(html, /\.patches h2 em\{font-style:italic;color:#f3d18c;\}/);

  const normalTextPairs = [
    ['#faf3e4', '#3c7549'],
    ['#faf3e4', '#657249'],
    ['#974629', '#faf3e4'],
    ['#974629', '#f1d3c8'],
    ['#241f18', '#cf7f6a'],
    ['#4a3a12', '#f6b9a6'],
    ['#f3d18c', '#55603f']
  ];
  for (const [foreground, background] of normalTextPairs) {
    assert.ok(
      contrastRatio(foreground, background) >= 4.5,
      `${foreground} sobre ${background} no alcanza contraste AA`
    );
  }
});

test('la navegación principal refleja el recorrido aprobado de la portada', () => {
  const nav = html.match(/<nav\b[^>]*id="primary-nav"[^>]*>([\s\S]*?)<\/nav>/i);
  assert.ok(nav, 'No se encontró la navegación principal');

  const links = [...nav[1].matchAll(/href="(#[^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(links, [
    '#sobre',
    '#proyectos',
    '#forma-de-trabajo',
    '#charlas',
    '#lecturas',
    '#contacto'
  ]);

  const ids = new Set(extractIds(html));
  for (const link of links) {
    assert.ok(ids.has(link.slice(1)), `Falta el destino interno ${link}`);
  }
});

test('las secciones de la portada siguen el orden aprobado', () => {
  const sectionOrder = [
    'top',
    'sobre',
    'proyectos',
    'forma-de-trabajo',
    'charlas',
    'lecturas',
    'contacto'
  ];
  const positions = sectionOrder.map((id) => html.indexOf(`id="${id}"`));

  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.match(html, /section\[id\],header\[id\]\{scroll-margin-top:64px;\}/);
  assert.match(html, /nav\{top:60px;[^}]*bottom:10px;[^}]*overflow:auto;/);
});

test('la portada enlaza al recorrido académico completo', () => {
  assert.match(html, /<section\b[^>]*id="sobre"/i);
  assert.match(html, /href="formacion\.html#experiencia"/i);
  assert.match(formationHtml, /href="index\.html#sobre"/i);
  assert.doesNotMatch(html, /id="experiencia"|id="formacion"/i);
});

test('WEB-121 permite fijar las notas de Sobre mí con mouse, tacto y teclado', () => {
  const about = html.match(/<section\b[^>]*id="sobre"[^>]*>([\s\S]*?)<\/section>/i);
  assert.ok(about, 'No se encontró la sección Sobre mí');
  assert.equal((about[1].match(/class="note-pin(?: green)?" type="button"/g) ?? []).length, 2);
  assert.equal((about[1].match(/aria-pressed="false"/g) ?? []).length, 2);
  assert.match(about[1], /id="note-pin-status" aria-live="polite"/);
  assert.match(html, /note\.classList\.toggle\('is-pinned',pinned\)/);
  assert.match(html, /pin\.setAttribute\('aria-pressed',String\(pinned\)\)/);
  assert.match(html, /\.about-note\.reveal\.in\.is-pinned\{transform:translateY\(-4px\) rotate\(0deg\);/);
  assert.match(html, /\.note-pin\{[^}]*width:44px;height:44px;/);
  assert.match(html, /\.note-pin:focus-visible\{outline:3px solid var\(--cream\)/);
  assert.match(html, /@media\(prefers-reduced-motion:reduce\)\{html\{scroll-behavior:auto;\}\*\{animation:none!important;transition-duration:\.001ms!important;\}/);
});

test('WEB-050 concentra los intereses personales cerca del final', () => {
  const personalBlock = html.match(/<section class="reads" id="lecturas">([\s\S]*?)<\/section>/i);
  assert.ok(personalBlock, 'No se encontr\u00f3 el bloque personal de lecturas');

  for (const interest of [/Fantasy \+ romantasy/i, /planta/i, /crochet/i, /cocin/i]) {
    assert.match(personalBlock[1], interest);
  }

  const beforePersonalBlock = html.slice(0, html.indexOf('<section class="reads" id="lecturas">'));
  assert.doesNotMatch(beforePersonalBlock, /plantas, crochet, cocina|hablar de plantas y libros/i);
  assert.ok(html.indexOf('id="lecturas"') > html.indexOf('id="proyectos"'));
  assert.ok(html.indexOf('id="lecturas"') > html.indexOf('id="sobre"'));
  assert.doesNotMatch(personalBlock[1], /borrador|tu romantasy|lo cambi\u00e1s cuando quieras/i);
});

test('la experiencia profesional es cronológica, verificable y separa la mentoría', () => {
  const section = formationHtml.match(/<section\b[^>]*class="experience"[^>]*id="experiencia"[^>]*>([\s\S]*?)<\/section>/i);
  assert.ok(section, 'No se encontró la sección Experiencia');
  assert.match(section[1], /<ol class="experience-list" aria-label="Experiencia laboral en orden cronol&oacute;gico inverso">/);

  const jobs = section[1].match(/<article class="job-card reveal"/g) ?? [];
  assert.equal(jobs.length, 4);
  for (const expected of [
    ['Project Manager', 'eagerworks', 'diciembre 2025'],
    ['Associate Product Manager', 'UKG', 'octubre 2024'],
    ['Project Manager Trainee', 'Plan Ceibal', 'junio 2023'],
    ['Docente de rob&oacute;tica y programaci&oacute;n', 'Elemental Ciencias de la Computaci&oacute;n', 'octubre 2022']
  ]) {
    for (const text of expected) assert.match(section[1], new RegExp(text));
  }

  assert.match(section[1], /Proyectos de software/);
  assert.match(section[1], /Producto digital y experiencia del empleado/);
  assert.match(section[1], /Iniciativas tecnol&oacute;gicas/);
  assert.match(section[1], /Educaci&oacute;n tecnol&oacute;gica/);
  assert.match(section[1], /class="experience-mentoring reveal" aria-label="Desarrollo profesional separado de la experiencia laboral"/);
  assert.match(section[1], /Programa de Mentoring PMI 2026/);
  assert.match(section[1], /no un cargo laboral/);
  assert.match(section[1], /class="experience-ledger"/);
  assert.match(section[1], /class="experience-thread" aria-hidden="true"/);
  assert.equal((section[1].match(/class="stitch-marker" aria-hidden="true"/g) ?? []).length, 4);
  assert.doesNotMatch(section[1], /\d+\s*%/);

  const experienceIndex = formationHtml.indexOf('id="experiencia"');
  assert.ok(experienceIndex < formationHtml.indexOf('id="utec"'));
  assert.match(html, /@media\(max-width:760px\)\{[\s\S]*?\.job-card\{display:block;/);
});

test('T8 publica comunidad y el registro completo de charlas sin inventar campos', () => {
  assert.match(html, /href="comunidad-charlas\.html"/);
  assert.match(communityHtml, /<h1>Comunidad y charlas, <em>sin mezclar los papeles<\/em><\/h1>/);
  assert.match(communityHtml, /id="comunidades"/);
  assert.match(communityHtml, /id="comunidad-en-accion"/);
  assert.match(communityHtml, /id="registro-charlas"/);
  assert.equal((communityHtml.match(/class="extra-note"/g) ?? []).length, 6);
  assert.equal((communityHtml.match(/class="project-sheet"/g) ?? []).length, 18);
  for (const event of [
    'Presentación de habITar',
    'Break the Pattern',
    'Explorando diferentes roles en tecnología',
    'End-to-End: Ser mujer en un rol tech',
    'Foro de Mujeres Emprendedoras',
    'Lanzamiento de las Tertulias',
    'IMPacto, Impulsando Más Proyectos',
    'Mujeres en ciencia y tecnología',
    'Charla de ciberseguridad',
    'Gala de clausura LPF Hackathon'
  ]) assert.match(communityHtml, new RegExp(event));
  assert.match(communityHtml, /Fecha por confirmar/);
  assert.match(communityHtml, /No relleno esos huecos por intuici&oacute;n/);
  assert.match(communityHtml, /5 eventos organizados/);
  assert.match(communityHtml, /Innovación Financiera: Inversión y Tecnología Event/);
  assert.match(communityHtml, /IWD 2025 Photo Sharing and Community Engagement/);
  assert.match(communityHtml, /CX: Poniendo a las personas en el centro/);
  assert.match(communityHtml, /Break the Pattern: Challenging Stereotypes in IT/);
  assert.match(communityHtml, /Datos en acción: análisis y automatizaciones/);
  assert.match(communityHtml, /figuran como organizaci&oacute;n propia en el registro/);
  assert.match(communityHtml, /8 mar 2025/);
  assert.match(communityHtml, /30 jul 2026/);
});

test('la forma de trabajo presenta cuatro momentos concretos', () => {
  const section = workHtml.match(/<section\b[^>]*class="workflow"[^>]*id="forma-de-trabajo"[^>]*>([\s\S]*?)<\/section>/i);
  assert.ok(section, 'No se encontró la sección Forma de trabajo');
  assert.match(section[1], /<ol class="workflow-grid">/);

  const steps = section[1].match(/<li class="workflow-step reveal"/g) ?? [];
  assert.equal(steps.length, 4);
  for (const heading of [
    'Entender antes de ordenar',
    'Convertirlo en un plan',
    'Sostener el trabajo',
    'Mirar qu&eacute; pas&oacute; y ajustar'
  ]) {
    assert.match(section[1], new RegExp(`<h3>${heading}<\\/h3>`));
  }

  assert.match(section[1], /Refino los requisitos/);
  assert.match(section[1], /Gestiono tres proyectos en simult&aacute;neo/);
  assert.match(section[1], /Queremos m&eacute;tricas/);
  assert.doesNotMatch(section[1], /Se&ntilde;al concreta|workflow-signal/);
  assert.match(workHtml, /\.workflow-grid\{list-style:none;display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.doesNotMatch(section[1], /Trello|Jira|Slack|Scrum|Kanban/i);
  assert.match(workHtml, /\.workflow-inner\{[^}]*background:repeating-linear-gradient/);
  assert.match(workHtml, /@media\(max-width:760px\)\{[\s\S]*?\.workflow-grid\{grid-template-columns:1fr;/);
});

test('lo que hago presenta cinco encargos como problema y resultado sin rótulos repetidos', () => {
  const section = workHtml.match(/<section\b[^>]*class="offers"[^>]*id="lo-que-hago"[^>]*>([\s\S]*?)<\/section>/i);
  assert.ok(section, 'No se encontró la sección Lo que hago');
  assert.match(section[1], /<h2>Lo que <em>hago<\/em><\/h2>/);

  const cards = section[1].match(/<article class="offer-card reveal"/g) ?? [];
  assert.equal(cards.length, 5);
  for (const heading of [
    'Gesti&oacute;n de proyectos de software',
    'Definici&oacute;n y refinamiento de producto',
    'Charlas, talleres y moderaci&oacute;n',
    'Planificaci&oacute;n de eventos',
    'Contenido para redes'
  ]) {
    assert.match(section[1], new RegExp(`<h3>${heading}<\\/h3>`));
  }

  assert.match(section[1], /Me llaman cuando hay algo valioso en marcha/);
  assert.equal((section[1].match(/class="offer-problem"/g) ?? []).length, 5);
  assert.equal((section[1].match(/class="offer-outcome"/g) ?? []).length, 5);
  assert.doesNotMatch(section[1], /Punto de partida|Resultado/);
  const cardBodies = section[1].match(/<article class="offer-card reveal"[\s\S]*?<\/article>/gi) ?? [];
  assert.equal(cardBodies.filter((card) => /<p>Si\s/i.test(card)).length, 0);
  assert.match(section[1], /Hay un proyecto de software abierto en demasiados frentes/);
  assert.match(section[1], /La necesidad es real, pero llega como una idea suelta/);
  assert.match(section[1], /<a class="offers-link" href="index\.html#contacto">Hablemos de tu idea/);
  assert.doesNotMatch(section[1], /fractional|freelance/i);
  assert.match(workHtml, /\.offers-grid\{display:grid;grid-template-columns:repeat\(12,minmax\(0,1fr\)\)/);
  assert.match(workHtml, /\.offer-card:nth-child\(5\)\{grid-column:3\/span 8;/);
  assert.match(workHtml, /@media\(max-width:760px\)\{[\s\S]*?grid-column:span 12;/);
});

test('WEB-122 convierte Cómo trabajo en una carpeta de proyecto propia', () => {
  assert.match(workHtml, /<main class="work-page-kitchen" id="main-content"/);
  assert.match(workHtml, /<ol class="work-page-index" aria-label="&Iacute;ndice de C&oacute;mo trabajo">/);
  const index = workHtml.match(/<ol class="work-page-index"[\s\S]*?<\/ol>/)?.[0] ?? '';
  assert.equal((index.match(/href="#[^"]+"/g) ?? []).length, 3);
  assert.match(workHtml, /\.work-page-hero-inner\{[^}]*border-left:16px solid var\(--brick\)/);
  assert.match(workHtml, /\.strengths\{[^}]*background-color:var\(--cork\);border-top:12px solid/);
  assert.match(workHtml, /\.workflow-step:nth-child\(even\)\{translate:0 34px;/);
  assert.match(workHtml, /\.offers \.hd\{[^}]*background:var\(--green-dark\);/);
  assert.match(workHtml, /\.work-page-index a:hover,\.work-page-index a:focus-visible,\.work-page-index a\.is-active\{translate:6px 0;/);
  assert.match(workHtml, /prefers-reduced-motion:reduce/);
});

test('T4 aplica la pasada anti-IA a workflow y lo que hago', () => {
  const workflow = workHtml.match(/<section\b[^>]*class="workflow"[^>]*>([\s\S]*?)<\/section>/i)?.[1] ?? '';
  const offers = workHtml.match(/<section\b[^>]*class="offers"[^>]*>([\s\S]*?)<\/section>/i)?.[1] ?? '';

  assert.doesNotMatch(`${workflow}${offers}`, /&mdash;|—/);
  assert.doesNotMatch(workflow, /Se&ntilde;al concreta|responde[^.]+, habilita[^.]+, (?:y )?muestra/i);
  assert.doesNotMatch(offers, /Punto de partida|Resultado/);
  const offerCards = offers.match(/<article class="offer-card reveal"[\s\S]*?<\/article>/gi) ?? [];
  assert.equal(offerCards.filter((card) => /<p[^>]*>Si\s/i.test(card)).length, 0);
  assert.match(workflow, /Queremos m&eacute;tricas/);
  assert.match(workflow, /tres proyectos en simult&aacute;neo/);
  assert.match(offers, /El encuentro est&aacute; en una nota o en un chat/);
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
  assert.match(projectIslandSource, /const \[isMobile, setIsMobile\] = useState\(true\)/);
  assert.match(projectIslandSource, /tabIndex=\{isMobile \? 0 : -1\}/);

  const projectTriggers = html.match(/<button\b[^>]*class="spine [^"]+"[^>]*type="button"/g) ?? [];
  assert.equal(projectTriggers.length, 3);
});

test('los proyectos usan botones semánticos con nombres accesibles', () => {
  const projectTriggers = [...html.matchAll(/<button\b([^>]*)class="spine [^"]+"([^>]*)>/g)];
  assert.equal(projectTriggers.length, 3);

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

test('los proyectos muestran información esencial sin depender de hover', () => {
  const summaries = html.match(/<article class="project-summary"[\s\S]*?<\/article>/g) ?? [];
  assert.equal(summaries.length, 3);

  for (const summary of summaries) {
    assert.match(summary, /<span class="tag">[^<]+<\/span>/);
    assert.match(summary, /<h3>[^<]+<\/h3>/);
    assert.match(summary, /<p>[^<]+<\/p>/);
    assert.match(summary, /class="project-brief"/);
    assert.match(summary, /data-book="[^"]+"/);
    assert.match(summary, /aria-haspopup="dialog"/);
    assert.match(summary, /aria-label="Abrir caso de proyecto: [^"]+"/);
  }

  assert.match(html, /<ul class="project-summaries" aria-label="Resumen de proyectos">/);
  assert.match(html, /\.project-summaries\{[^}]*display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(html, /@media\(max-width:760px\)\{[\s\S]*?\.project-summaries\{grid-template-columns:1fr;/);
  assert.match(projectIslandSource, /PROJECTS\.filter\(\(book\) => book\.summary\)\.map/);
  assert.match(projectIslandSource, /onClick=\{\(event\) => openBook\(book, event\.currentTarget\)\}/);
  assert.equal((projectDataSource.match(/^\s+summary: /gm) ?? []).length, 3);
  assert.doesNotMatch(html, /\.pcard\{|\.spine:hover \.pcard/);
});

test('los casos de proyecto comparten una plantilla ordenada y omiten campos vacíos', () => {
  const expectedOrder = [
    'Contexto',
    'Desafío',
    'Rol de Romina',
    'Equipo y stakeholders',
    'Decisiones y acciones',
    'Resultados',
    'Aprendizajes'
  ];

  const sectionTitles = [...projectDataSource.matchAll(/\{ key: '[^']+', title: '([^']+)' \}/g)]
    .map((match) => match[1]);
  assert.deepEqual(sectionTitles, expectedOrder);

  const projectIds = [...projectDataSource.matchAll(/^\s+id: '([^']+)'/gm)]
    .map((match) => match[1]);
  assert.deepEqual(projectIds, ['fisica', 'pmi', 'habitar']);
  assert.equal(new Set(projectIds).size, 3);
  assert.match(projectDataSource, /for \(const definition of PROJECT_SECTION_ORDER\)/);
  assert.match(projectDataSource, /if \(html\) pages\.push\(\{ kind: 'content', title: definition\.title, html \}\)/);
  assert.doesNotMatch(projectDataSource, /Contá|Qué hiciste vos|Cómo terminó|pendiente|placeholder/i);

  const habitar = projectDataSource.match(/id: 'habitar',[\s\S]*?\n\s+\}\n\];/);
  assert.ok(habitar, 'El caso habITar debe estar publicado en el estante');
  const habitarContent = habitar[0];
  assert.match(habitarContent, /46 semanas/);
  assert.match(habitarContent, /gestión del proyecto, la definición y priorización del producto y el testing manual/);
  assert.match(habitarContent, /Diego Furiati/);
  assert.match(habitarContent, /Alejandro Hernández/);
  assert.match(habitarContent, /63 requisitos/);
  assert.match(habitarContent, /14 de agosto de 2026/);
  assert.match(habitarContent, /226 casos manuales/);
  assert.match(habitarContent, /2\.700 pruebas automatizadas/);
  assert.doesNotMatch(habitarContent, /COVIMA|Elena Quinteros|35 familias/);
  assert.match(html, /data-book="habitar"[^>]*aria-label="Abrir proyecto: habITar"/);

  assert.match(projectCaseTemplate, /Contexto[\s\S]*Desafío[\s\S]*Rol de Romina[\s\S]*Equipo y stakeholders[\s\S]*Decisiones y acciones[\s\S]*Resultados[\s\S]*Aprendizajes/);
  assert.match(projectCaseTemplate, /No se inventan métricas/);
  assert.match(projectCaseTemplate, /anonimizar/i);
  assert.match(projectCaseTemplate, /campos vacíos no generan páginas/);
  assert.match(projectCaseTemplate, /Metodologías y herramientas/);
  assert.match(projectCaseTemplate, /evidencia visual o enlazada/i);
});

test('WEB-053 no publica instrucciones ni contenido de muestra', () => {
  for (const source of [html, projectDataSource]) {
    assert.doesNotMatch(source, /tu foto ac[aá]|tu proyecto|tu romantasy|lo cambi[aá]s cuando quieras/i);
    assert.doesNotMatch(source, /Cont[aá] qu[eé]|Qu[eé] hiciste vos|Sumamos el resto|Otro proyecto, otra historia/i);
  }
  assert.match(html, /class="portrait-mark" aria-hidden="true"/);
  assert.match(html, /Fantasy \+ romantasy/);
  assert.doesNotMatch(html, /<small>Borrador<\/small>/);
});

test('el modal de proyectos gestiona el foco como un diálogo accesible', () => {
  assert.match(
    html,
    /<div class="bookmodal" id="bookmodal" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="bookDialogTitle" inert="" tabindex="-1">/
  );
  assert.match(html, /<h2 class="sr-only" id="bookDialogTitle">Proyecto<\/h2>/);
  assert.match(projectIslandSource, /lastFocusRef\.current = trigger \?\?/);
  assert.match(projectIslandSource, /`Proyecto: \$\{project\.title\}`/);
  assert.match(projectIslandSource, /document\.body\.classList\.toggle\('modal-open', isOpen\)/);
  assert.match(projectIslandSource, /document\.body\.classList\.remove\('modal-open'\)/);
  assert.match(projectIslandSource, /element\.inert = isOpen/);
  assert.match(projectIslandSource, /inert=\{isOpen \? undefined : true\}/);
  assert.match(projectIslandSource, /closeRef\.current\?\.focus\(\{ preventScroll: true \}\)/);
  assert.match(projectIslandSource, /else if \(event\.key === 'Tab'\)/);
  assert.match(projectIslandSource, /event\.shiftKey && \(document\.activeElement === first \|\| !modal\.contains\(document\.activeElement\)\)/);
  assert.match(projectIslandSource, /lastFocus\.focus\(\{ preventScroll: true \}\)/);
  assert.match(projectIslandSource, /if \(event\.key === 'Escape'\) closeBook\(\)/);
  assert.match(html, /body\.modal-open\{overflow:hidden;\}/);
});

test('cada proyecto puede abrirse y recorrerse desde una URL compartible', () => {
  const projectKeys = [...html.matchAll(/class="spine [^"]+"[^>]*data-book="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(projectKeys).size, projectKeys.length);
  assert.equal(projectKeys.length, 3);
  assert.match(projectIslandSource, /#project=\$\{encodeURIComponent\(projectId\)\}&page=\$\{page\}/);
  assert.match(projectIslandSource, /new URLSearchParams\(window\.location\.hash\.slice\(1\)\)/);
  assert.match(projectIslandSource, /window\.history\.replaceState/);
  assert.match(projectIslandSource, /window\.history\.pushState/);
  assert.match(projectIslandSource, /window\.addEventListener\('popstate', syncProjectFromUrl\)/);
  assert.match(projectIslandSource, /window\.addEventListener\('hashchange', syncProjectFromUrl\)/);
  assert.match(projectIslandSource, /syncProjectFromUrl\(\);/);
});

test('el libro muestra una sola página por vez en móvil y conserva el pliego en escritorio', () => {
  assert.match(
    html,
    /@media\(max-width:720px\)\{[\s\S]*?\.bookframe\{width:min\(82vw,360px\);\}[\s\S]*?\.pg-left\{display:none;\}[\s\S]*?\.leaf\{display:none!important;\}/
  );
  assert.match(html, /\.bookmodal\{padding:64px 18px 58px;overflow-x:hidden;overflow-y:auto;\}/);
  assert.match(html, /\.bm-nav\.prev\{left:-18px;\}/);
  assert.match(html, /\.bm-nav\.next\{right:-18px;\}/);
  assert.match(projectIslandSource, /window\.matchMedia\('\(max-width: 720px\)'\)/);
  assert.match(projectIslandSource, /const delta = direction === 'next' \? 1 : -1/);
  assert.match(projectIslandSource, /const visibleLeftIndex = turn === 'prev'/);
  assert.match(projectIslandSource, /const visibleRightIndex = turn === 'next'/);
  assert.match(projectIslandSource, /const previousDisabled = isMobile \? pageIndex <= 0 : spread <= 0/);
  assert.match(projectIslandSource, /const nextDisabled = isMobile \? pageIndex \+ 1 >= pages\.length : spread \+ 1 >= spreadCount/);
  assert.match(projectIslandSource, /isMobile \? `\$\{pageIndex \+ 1\} \/ \$\{pages\.length\}`/);
});

test('el recorrido académico conserva toda la información aprobada', () => {
  assert.equal((formationHtml.match(/<details\b/g) ?? []).length, 8);
  assert.equal((formationHtml.match(/<li>/g) ?? []).length, 45);
  assert.equal((formationHtml.match(/class="project-sheet"/g) ?? []).length, 4);
  assert.equal((formationHtml.match(/class="extra-note"/g) ?? []).length, 3);
});


test('formación continúa la metáfora visual de la carpeta del estudio', () => {
  assert.match(formationHtml, /class="open-folder"/);
  assert.match(formationHtml, /class="folder-pages"/);
  assert.match(formationHtml, /class="study-binder"/);
  assert.match(formationHtml, /class="binder-rings" aria-hidden="true"/);
  assert.match(formationHtml, /class="credentials-pocket"/);
  assert.match(formationHtml, /class="desk-fern left"/);
  assert.match(formationHtml, /class="desk-fern right"/);
  assert.match(formationHtml, /@media\(max-width:1000px\)/);
  assert.match(formationHtml, /@media\(max-width:760px\)/);
  assert.match(formationHtml, /@media\(max-width:430px\)/);
  assert.match(formationHtml, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(formationHtml, /hero\.style\.setProperty\('--light-x'/);
  assert.match(formationHtml, /new IntersectionObserver/);
  assert.doesNotMatch(formationHtml, /topbar nav a:not\(:last-child\)\{display:none;/);
});
test('el menú móvil expone estado y controles accesibles', () => {
  assert.match(
    html,
    /<button\b[^>]*id="navToggle"[^>]*aria-controls="primary-nav"[^>]*aria-expanded="false"/i
  );
  assert.match(html, /<nav\b[^>]*id="primary-nav"[^>]*aria-label=/i);
  assert.match(html, /toggle\.setAttribute\('aria-expanded',String\(open\)\)/);
  assert.match(html, /nav\.inert=mobileMenuQuery\.matches && !open/);
  assert.match(html, /mobileMenuQuery\.addEventListener\('change',syncMenu\)/);
  assert.match(html, /e\.key==='Escape'/);
  assert.doesNotMatch(html, /nav a:nth-child\(n\+4\)/);
});

test('los enlaces de navegación no dependen de hover', () => {
  assert.match(html, /nav\.open\{display:flex;\}/);
  assert.match(html, /nav a\{top:0;width:100%/);
});

test('el contacto persistente es accesible, táctil y deja preparado su evento de analítica', () => {
  assert.match(
    html,
    /<a class="contact-tab" href="#contacto" aria-label="Ir a las opciones de contacto" data-analytics-event="persistent_contact_click">Hablemos<\/a>/
  );
  assert.match(html, /\.contact-tab\{position:fixed;/);
  assert.match(html, /bottom:max\(16px,env\(safe-area-inset-bottom\)\)/);
  assert.match(html, /min-height:48px/);
  assert.match(html, /\.contact-tab:focus-visible\{outline:3px solid var\(--cream\)/);
  assert.match(html, /@media\(max-width:760px\)[\s\S]*?\.contact-tab\{[^}]*min-height:46px/);
});

test('las microinteracciones orientan con mouse, teclado y tacto sin sumar JavaScript', () => {
  const section = html.match(
    /\/\* ---------- MICROINTERACCIONES DEL ESTUDIO ---------- \*\/([\s\S]*?)\/\* ---------- CTA DE CONTACTO PERSISTENTE ---------- \*\//
  );
  assert.ok(section, 'No se encontró la capa de microinteracciones');
  const css = section[1];

  assert.match(css, /@media\(hover:hover\) and \(pointer:fine\)/);
  assert.match(css, /\.spine:hover\{translate:0 -38px;transform:rotate\(-3deg\);\}/);
  assert.match(css, /\.spine:focus-visible\{translate:0 -30px;transform:rotate\(-2deg\);\}/);
  assert.match(css, /\.open-folder:focus-visible\{background:var\(--green-deep\);translate:0 -3px;/);
  assert.match(css, /\.bm-nav:not\(:disabled\):focus-visible,\.bm-close:focus-visible\{background:var\(--gold\);/);
  assert.match(css, /\.bm-nav:not\(:disabled\):active,\.bm-close:active\{translate:0 1px;scale:\.98;/);
  assert.match(css, /\.bookmodal\.open \.bookframe\{animation:book-settle/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)\{[\s\S]*?animation:none!important;[\s\S]*?translate:0 0!important;scale:1!important;/);

  assert.ok((html.match(/<script\b/g) ?? []).length >= 3);
  assert.doesNotMatch(css, /addEventListener|requestAnimationFrame|setTimeout/);
});

test('todos los bloques JavaScript tienen sintaxis válida', () => {
  const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => !/type="application\/ld\+json"/i.test(match[1]))
    .filter((match) => !/type="module"|\bsrc=/i.test(match[1]))
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

test('el parallax solo renderiza cuando hay cambios y se pausa fuera de contexto', () => {
  assert.match(html, /matchMedia\('\(max-width: 760px\)'\)/);
  assert.match(html, /return !reducedMotion && !mobileParallaxQuery\.matches && !document\.hidden/);
  assert.match(html, /window\.addEventListener\('scroll',scheduleParallax,\{passive:true\}\)/);
  assert.match(html, /document\.addEventListener\('visibilitychange'/);
  assert.match(html, /if\(document\.hidden\) stopParallax\(\); else scheduleParallax\(\);/);
  assert.match(html, /mobileParallaxQuery\.addEventListener\('change',applyMobileParallax\)/);
  assert.match(html, /function refreshParallaxBases\(\)/);
  assert.doesNotMatch(html, /requestAnimationFrame\(frame\)/);
  assert.doesNotMatch(html, /function frame\(\)/);
});

test('el parallax conserva las rotaciones y limpia solo su propio desplazamiento', () => {
  assert.match(
    html,
    /\.parallax\{translate:var\(--parallax-x,0px\) var\(--parallax-y,0px\);will-change:translate;\}/
  );
  assert.match(html, /el\.style\.setProperty\('--parallax-x',tx\+'px'\)/);
  assert.match(html, /el\.style\.setProperty\('--parallax-y',ty\+'px'\)/);
  assert.match(html, /el\.style\.removeProperty\('--parallax-x'\)/);
  assert.match(html, /el\.style\.removeProperty\('--parallax-y'\)/);
  assert.match(html, /Number\.isFinite\(e\.clientX\)\?e\.clientX:window\.innerWidth\/2/);
  assert.match(html, /Number\.isFinite\(e\.clientY\)\?e\.clientY:window\.innerHeight\/2/);
  assert.match(html, /if\(!Number\.isFinite\(tx\)\|\|!Number\.isFinite\(ty\)\) return/);

  const parallaxScript = html.match(
    /\/\/ parallax por scroll y mouse[\s\S]*?function showReveals\(\)/
  );
  assert.ok(parallaxScript, 'No se encontró el bloque de parallax');
  assert.doesNotMatch(parallaxScript[0], /style\.transform|removeProperty\('transform'\)/);

  assert.match(html, /\.photo-tack\{[^}]*transform:rotate\(6deg\)/);
  assert.match(html, /\.stickynote\{[^}]*transform:rotate\(-3deg\)/);
  assert.match(html, /refreshParallaxBases\(\);\s*if\(parallaxCanRun\(\)\) scheduleParallax\(\)/);
  assert.match(html, /scheduleParallax\(\);\s*\n\s*\(function\(\)\{/);
});

test('la portada incluye metadatos SEO básicos válidos', () => {
  assert.match(html, /<title>Romina Caubarrere \| Project Manager de software<\/title>/i);
  assert.match(html, /<meta name="description" content="[^"]*Project Manager[^"]*">/i);
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/romicaubarrere\.github\.io\/personal\/">/i
  );
  assert.match(html, /<link rel="icon" type="image\/svg\+xml" href="\/personal\/favicon\.svg">/i);
  assert.match(favicon, /<svg\b[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/i);

  const jsonLd = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i
  );
  assert.ok(jsonLd, 'No se encontraron datos estructurados JSON-LD');

  const structuredData = JSON.parse(jsonLd[1]);
  assert.equal(structuredData['@context'], 'https://schema.org');
  assert.equal(structuredData['@graph'].length, 3);
  const person = structuredData['@graph'].find((entity) => entity['@type'] === 'Person');
  const profile = structuredData['@graph'].find((entity) => entity['@type'] === 'ProfilePage');
  const website = structuredData['@graph'].find((entity) => entity['@type'] === 'WebSite');
  assert.equal(person['@type'], 'Person');
  assert.equal(person['@id'], 'https://romicaubarrere.github.io/personal/#person');
  assert.equal(person.name, 'Romina Caubarrere');
  assert.equal(person.jobTitle, 'Project Manager de software');
  assert.equal(person.url, 'https://romicaubarrere.github.io/personal/');
  assert.deepEqual(person.sameAs, [
    'https://www.linkedin.com/in/rominacaubarrere/'
  ]);
  assert.equal(website['@id'], 'https://romicaubarrere.github.io/personal/#website');
  assert.equal(website.url, 'https://romicaubarrere.github.io/personal/');
  assert.equal(profile['@id'], 'https://romicaubarrere.github.io/personal/#profile');
  assert.deepEqual(profile.mainEntity, { '@id': person['@id'] });
  assert.deepEqual(profile.isPartOf, { '@id': website['@id'] });
  assert.equal(profile.url, 'https://romicaubarrere.github.io/personal/');
  assert.equal('email' in person, false);
  assert.doesNotMatch(JSON.stringify(structuredData), /instagram|placeholder|email/i);
});

test('la vista previa social tiene metadatos completos y una imagen de 1200 por 630', () => {
  const title = 'Romina Caubarrere | Project Manager de software';
  const description = 'Conecto personas, producto y tecnología para que proyectos complejos avancen y lleguen a resultados.';
  const imageUrl = 'https://romicaubarrere.github.io/personal/social-preview.png';

  assert.match(html, new RegExp(`<meta property="og:title" content="${title.replace('|', '\\|')}">`));
  assert.match(html, new RegExp(`<meta property="og:description" content="${description}">`));
  assert.match(html, new RegExp(`<meta property="og:image" content="${imageUrl.replaceAll('/', '\\/')}">`));
  assert.match(html, /<meta property="og:image:type" content="image\/png">/);
  assert.match(html, /<meta property="og:image:width" content="1200">/);
  assert.match(html, /<meta property="og:image:height" content="630">/);
  assert.match(html, /<meta property="og:image:alt" content="[^"]+">/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
  assert.match(html, /<meta name="twitter:image" content="https:\/\/romicaubarrere\.github\.io\/personal\/social-preview\.png">/);

  assert.equal(socialPreview.subarray(1, 4).toString('ascii'), 'PNG');
  assert.equal(socialPreview.readUInt32BE(16), 1200);
  assert.equal(socialPreview.readUInt32BE(20), 630);
  assert.match(socialPreviewSource, /#22432c/i);
  assert.match(socialPreviewSource, /Romina Caubarrere/);
  assert.match(socialPreviewSource, /Project Manager de software/);
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

test('las cuatro fortalezas forman una sola muestra de crochet sin numeración', () => {
  assert.equal((workHtml.match(/<div class="strengths-sampler reveal"/g) ?? []).length, 1);
  assert.match(workHtml, /<ul class="strengths-list">/);
  assert.equal((workHtml.match(/<li class="strength-row">/g) ?? []).length, 4);
  assert.equal((workHtml.match(/<button class="crochet-loop" type="button" aria-label="Destacar [^"]+" aria-pressed="false"><\/button>/g) ?? []).length, 4);
  assert.match(workHtml, /<button class="yarn-ball" type="button" aria-label="Hacer rodar el ovillo de crochet" aria-describedby="crochet-status"><\/button>/);
  assert.match(workHtml, /id="crochet-status" aria-live="polite"/);
  assert.match(workHtml, /<span class="yarn-play-note" aria-hidden="true">toc&aacute; el ovillo/);
  assert.match(workHtml, /Orden en la complejidad/);
  assert.match(workHtml, /Conversaciones que destraban/);
  assert.match(workHtml, /Criterio de producto/);
  assert.match(workHtml, /Base t&eacute;cnica y calidad/);
  assert.doesNotMatch(workHtml, /strength-proof/);
  assert.doesNotMatch(workHtml, /strengths-grid|strength-card|counter-reset:strength|counter\(strength\)/);
  assert.match(workHtml, /\.strength-row\.is-threaded \.crochet-loop\{transform:rotate\(15deg\) scale\(1\.1\);/);
  assert.match(workHtml, /\.strengths-sampler:hover \.yarn-ball\{transform:translate\(-4px,3px\) rotate\(16deg\);\}/);
  assert.match(workHtml, /@keyframes yarn-ball-play/);
  assert.match(workHtml, /yarnBall\.addEventListener\('click',playYarn\)/);
  assert.match(workHtml, /button\.setAttribute\('aria-pressed','true'\)/);
  assert.match(workHtml, /row\.classList\.add\('is-threaded'\)/);
  assert.match(workHtml, /\.crochet-loop:focus-visible\{outline:3px solid var\(--gold\)/);
  assert.match(workHtml, /@media\(prefers-reduced-motion:reduce\)\{[\s\S]*?\.strength-row\.is-threaded \.crochet-loop,[\s\S]*?transform:none;/);
  assert.doesNotMatch(workHtml, /class="strength[^\"]*(progress|meter|percentage)/i);
});

test('Cómo trabajo suma una capa de cocina coherente y microinteracciones accesibles', () => {
  assert.match(workHtml, /<main class="work-page-kitchen" id="main-content"/);
  assert.match(workHtml, /<nav class="work-page-nav" id="primary-nav"/);
  assert.match(workHtml, /<div class="kitchen-tools" aria-hidden="true">/);
  assert.equal((workHtml.match(/class="kitchen-utensil kitchen-(?:spoon|whisk)"/g) ?? []).length, 2);
  assert.match(workHtml, /<span class="kitchen-recipe-label">mise en place del proyecto<\/span>/);
  assert.match(workHtml, /class="offers-link kitchen-start" href="#fortalezas"/);
  assert.match(workHtml, /\.work-page-kitchen \.strengths-kicker\{color:var\(--gold\)\}/);
  assert.match(workHtml, /\.kitchen-start span\{display:inline-block;margin-left:\.45rem;/);
  assert.match(workHtml, /\.work-page-nav a:is\(:hover,:focus-visible,:active\)::after\{transform:scaleX\(1\);?\}/);
  assert.match(workHtml, /\.work-page-hero:has\(\.kitchen-start:is\(:hover,:focus-visible,:active\)\) \.kitchen-spoon/);
  assert.match(workHtml, /@media\(prefers-reduced-motion:reduce\)\{[\s\S]*?\.kitchen-start:is\(:hover,:focus-visible,:active\)[\s\S]*?\.work-page-kitchen \.workflow-step:hover\{transform:none;?\}/);
});

test('el post-it del hero participa del layout y no usa posicionamiento parallax', () => {
  assert.match(html, /@media\(min-width:901px\)[\s\S]*?\.stickynote\{position:relative;/);
  assert.doesNotMatch(html, /class="stickynote parallax"/);
});

test('la edad se calcula desde el 13 de mayo de 2003 en hora de Montevideo', () => {
  assert.deepEqual(BIRTH_DATE, { year: 2003, month: 5, day: 13 });
  assert.equal(calculateAge({ year: 2027, month: 5, day: 12 }), 23);
  assert.equal(calculateAge({ year: 2027, month: 5, day: 13 }), 24);
  assert.equal(calculateAge({ year: 2027, month: 5, day: 14 }), 24);
  assert.match(html, /Tengo <span data-age>23<\/span> a&ntilde;os/);
  assert.match(homeScripts, /import '\.\.\/\.\.\/scripts\/special-dates\.js'/);
});

test('cumpleaños, Halloween y las cinco fechas patrias están definidas sin sustituciones', () => {
  assert.deepEqual(
    SPECIAL_DATES.map(({ id, month, day }) => [id, month, day]),
    [
      ['new-year', 1, 1],
      ['birthday', 5, 13],
      ['halloween', 10, 31],
      ['patriotic-04-19', 4, 19],
      ['patriotic-05-18', 5, 18],
      ['patriotic-06-19', 6, 19],
      ['patriotic-07-18', 7, 18],
      ['patriotic-08-25', 8, 25],
      ['hearts-december', 12, 1],
      ['christmas', 12, 25]
    ]
  );
  assert.equal(findSpecialDate({ year: 2026, month: 5, day: 13 })?.kind, 'birthday');
  assert.equal(findSpecialDate({ year: 2026, month: 10, day: 31 })?.kind, 'halloween');
  assert.equal(findSpecialDate({ year: 2026, month: 10, day: 30 }), null);
});

test('la simulación revisa cada celebración sin cambiar la fecha del dispositivo', () => {
  const actualDate = { year: 2026, month: 8, day: 22 };
  for (const specialDate of SPECIAL_DATES) {
    const resolution = resolveSpecialDate({
      actualDate,
      search: `?celebration=${specialDate.id}`
    });
    assert.equal(resolution.event?.id, specialDate.id);
    assert.equal(resolution.date, actualDate);
    assert.equal(resolution.isPreview, true);
  }

  assert.equal(
    formatSpecialDateLabel(SPECIAL_DATES.find(({ id }) => id === 'patriotic-04-19'), 23, true),
    'Vista previa · Fecha patria · 19/04'
  );

  assert.deepEqual(parseSimulatedDate('2027-05-13'), { year: 2027, month: 5, day: 13 });
  assert.equal(parseSimulatedDate('2027-02-30'), null);
  assert.equal(resolveSpecialDate({ actualDate, search: '?date=2027-05-13' }).event?.id, 'birthday');
  assert.equal(resolveSpecialDate({ actualDate, search: '?preview=birthday' }).event?.id, 'birthday');
  assert.equal(resolveSpecialDate({ actualDate, hash: '#birthday-preview' }).event?.id, 'birthday');
  assert.equal(resolveSpecialDate({ actualDate, search: '?special=christmas' }).event?.id, 'christmas');
  assert.equal(resolveSpecialDate({ actualDate, search: '?celebration=unknown' }).event, null);
});

test('Pascuas se calcula para cada año y dura únicamente el domingo correspondiente', () => {
  assert.equal(EASTER_EVENT.id, 'easter');
  assert.deepEqual(getEasterSunday(2026), { year: 2026, month: 4, day: 5 });
  assert.deepEqual(getEasterSunday(2027), { year: 2027, month: 3, day: 28 });
  assert.equal(findSpecialDate({ year: 2026, month: 4, day: 5 })?.id, 'easter');
  assert.equal(findSpecialDate({ year: 2026, month: 4, day: 4 }), null);
  assert.equal(findSpecialDate({ year: 2026, month: 4, day: 6 }), null);
  assert.equal(
    resolveSpecialDate({ actualDate: { year: 2026, month: 1, day: 1 }, search: '?celebration=easter' }).event?.day,
    5
  );
});

test('si Pascuas coincide con una fecha patria se conservan ambas celebraciones', () => {
  assert.deepEqual(getEasterSunday(2071), { year: 2071, month: 4, day: 19 });
  assert.deepEqual(
    findSpecialDates({ year: 2071, month: 4, day: 19 }).map(({ id }) => id),
    ['patriotic-04-19', 'easter']
  );
  assert.deepEqual(
    resolveSpecialDate({ actualDate: { year: 2071, month: 4, day: 19 } }).events.map(({ id }) => id),
    ['patriotic-04-19', 'easter']
  );
});

test('WEB-083 incorpora las cuatro celebraciones aprobadas y su simulación', () => {
  const expected = [
    ['new-year', 1, 1],
    ['hearts-december', 12, 1],
    ['christmas', 12, 25]
  ];
  for (const [id, month, day] of expected) {
    const event = SPECIAL_DATES.find((candidate) => candidate.id === id);
    assert.deepEqual([event?.id, event?.month, event?.day], [id, month, day]);
  }

  const actualDate = { year: 2026, month: 8, day: 22 };
  for (const id of ['new-year', 'easter', 'hearts-december', 'christmas']) {
    assert.equal(resolveSpecialDate({ actualDate, search: `?celebration=${id}` }).event?.id, id);
  }
});

test('las celebraciones mantienen el lenguaje visual del estudio y son responsivas', () => {
  assert.match(html, /class="birthday-garland"/);
  assert.match(html, /class="crochet-web"/);
  assert.match(html, /class="crochet-pumpkin"/);
  assert.match(html, /class="patriotic-ribbon"/);
  assert.match(html, /celebration--seasonal \.birthday-decor/);
  assert.match(html, /@media\(max-width:760px\)\{[\s\S]*?\.birthday-garland/);
  assert.match(html, /@media\(prefers-reduced-motion:reduce\)\{html\{scroll-behavior:auto;\}\*\{animation:none!important;/);
  assert.match(html, /role="status" aria-live="polite" hidden/);
});

test('T6 deja una bio breve y deriva el recorrido completo a su página', () => {
  const notes = [...html.matchAll(/<article class="about-note reveal"/g)];

  assert.equal(notes.length, 2);
  assert.match(html, /<h3>Project Manager de software<\/h3>/);
  assert.match(html, /<h3>De la rob&oacute;tica a producto<\/h3>/);
  assert.match(html, /Abrir mi recorrido completo/);
  assert.doesNotMatch(html, /<ol class="experience-list"|id="formacion"/);
  assert.doesNotMatch(html, /Acá va tu historia|Ac&aacute; va tu historia|La escribimos juntas|en tesis/i);
});

test('WEB-100 mantiene nombres, cifras y términos editoriales consistentes', () => {
  assert.match(html, /<a href="#sobre">Mi mundo<\/a>/);
  assert.match(html, /Un vistazo a <em>mi mundo<\/em>/);
  assert.doesNotMatch(html, /requerimientos/i);
  assert.match(formationHtml, /63 requisitos must have/);
  assert.match(formationHtml, /m&aacute;s de 2\.700 pruebas automatizadas/);
  assert.doesNotMatch(formationHtml, /m&aacute;s de 2700 pruebas automatizadas/);
  assert.doesNotMatch(formationHtml, /<span class="state">en curso<\/span><h3>OPI 2\.0<\/h3>/);
  assert.match(formationHtml, /An&aacute;lisis de Requerimientos y Modelado/);
});
