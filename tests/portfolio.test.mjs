import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(join(repositoryRoot, 'index.html'), 'utf8');
const formationHtml = await readFile(join(repositoryRoot, 'formacion.html'), 'utf8');
const favicon = await readFile(join(repositoryRoot, 'favicon.svg'), 'utf8');
const socialPreview = await readFile(join(repositoryRoot, 'social-preview.png'));
const socialPreviewSource = await readFile(join(repositoryRoot, 'social-preview.svg'), 'utf8');
const readme = await readFile(join(repositoryRoot, 'README.md'), 'utf8');
const architectureDecision = await readFile(
  join(repositoryRoot, 'docs', 'architecture-decision.md'),
  'utf8'
);
const firstPost = await readFile(
  join(repositoryRoot, 'posts', 'por-que-hago-tantas-preguntas.html'),
  'utf8'
);
const postStyles = await readFile(join(repositoryRoot, 'posts', 'post.css'), 'utf8');
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
  for (const source of [html, formationHtml]) {
    assert.match(source, /<!doctype html>/i);
    assert.match(source, /<html\s+lang="es">/i);
    assert.match(source, /<title>[^<]*Romina Caubarrere[^<]*<\/title>/i);
    assert.match(source, /<\/body>\s*<\/html>\s*$/i);
  }
});

test('la arquitectura estática y su flujo operativo quedan documentados', () => {
  assert.match(architectureDecision, /Estado: aceptada/);
  assert.match(architectureDecision, /Se mantiene la arquitectura actual de HTML, CSS y JavaScript nativos/);
  assert.match(architectureDecision, /No se incorpora Astro ni React en esta etapa/);
  assert.match(architectureDecision, /Publicar `main` directamente con GitHub Pages/);
  assert.match(architectureDecision, /Astro debe evaluarse primero como generador estático sin React/);
  assert.match(readme, /No necesita instalación de dependencias ni un proceso de build/);
  assert.match(readme, /docs\/architecture-decision\.md/);
});

test('la decisión de publicar solo en español queda explícita y es consistente', () => {
  assert.match(languageStrategy, /Estado: no incorporar inglés en la versión actual/);
  assert.match(languageStrategy, /El portfolio se mantiene solamente en español/);
  assert.match(languageStrategy, /La versión inglesa vive en rutas propias bajo `\/en\/`/);
  assert.match(languageStrategy, /no se mezclan idiomas dentro de una página/);
  assert.match(languageStrategy, /selector usa un control accesible/);
  assert.match(languageStrategy, /todas las páginas, no solamente la portada/);
  assert.match(readme, /docs\/language-strategy\.md/);

  for (const source of [html, formationHtml, firstPost]) {
    assert.match(source, /<html\s+lang="es">/i);
    assert.doesNotMatch(source, /hreflang=|language-selector|id="language-selector"/i);
  }
});

test('el blog publica una nota real con estructura reutilizable y accesible', () => {
  assert.match(firstPost, /<title>¿Por qué hago tantas preguntas\? \| Romina Caubarrere<\/title>/);
  assert.match(firstPost, /<meta name="description" content="[^"]+">/);
  assert.match(firstPost, /<meta name="author" content="Romina Caubarrere">/);
  assert.match(firstPost, /<link rel="canonical" href="https:\/\/romicaubarrere\.github\.io\/personal\/posts\/por-que-hago-tantas-preguntas\.html">/);
  assert.match(firstPost, /<link rel="stylesheet" href="post\.css">/);
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
  assert.match(blogGuide, /Mantener el enlace a `post\.css`/);
  assert.match(blogGuide, /No se publican textos de muestra/);
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

test('la experiencia profesional es cronológica, verificable y separa la mentoría', () => {
  const section = html.match(/<section\b[^>]*class="experience"[^>]*id="experiencia"[^>]*>([\s\S]*?)<\/section>/i);
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
  assert.doesNotMatch(section[1], /\d+\s*%/);

  const experienceIndex = html.indexOf('id="experiencia"');
  assert.ok(experienceIndex < html.indexOf('id="formacion"'));
  assert.ok(experienceIndex < html.indexOf('id="charlas"'));
  assert.ok(experienceIndex < html.indexOf('id="comunidades"'));
  assert.match(html, /@media\(max-width:760px\)\{[\s\S]*?\.experience-list\{grid-template-columns:1fr;\}/);
});

test('la forma de trabajo presenta cinco etapas concretas y responsivas', () => {
  const section = html.match(/<section\b[^>]*class="workflow"[^>]*id="forma-de-trabajo"[^>]*>([\s\S]*?)<\/section>/i);
  assert.ok(section, 'No se encontró la sección Forma de trabajo');
  assert.match(section[1], /<ol class="workflow-grid">/);

  const steps = section[1].match(/<li class="workflow-step reveal"/g) ?? [];
  assert.equal(steps.length, 5);
  for (const heading of [
    'Entender el problema',
    'Definir alcance, prioridades y plan',
    'Coordinar personas y decisiones',
    'Cuidar calidad, cambios y riesgos',
    'Medir, decidir y aprender'
  ]) {
    assert.match(section[1], new RegExp(`<h3>${heading}<\\/h3>`));
  }

  assert.match(section[1], /Refino los requerimientos/);
  assert.match(section[1], /Gestiono tres proyectos en simult&aacute;neo/);
  assert.match(section[1], /queremos m&eacute;tricas/);
  assert.equal((section[1].match(/class="workflow-signal"/g) ?? []).length, 5);
  assert.doesNotMatch(section[1], /Trello|Jira|Slack|Scrum|Kanban/i);
  assert.match(html, /@media\(max-width:1000px\)\{\.workflow-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\);/);
  assert.match(html, /@media\(max-width:620px\)\{[\s\S]*?\.workflow-grid\{grid-template-columns:1fr;/);
});

test('lo que hago explica cinco formas de colaboración y conduce a contacto', () => {
  const section = html.match(/<section\b[^>]*class="offers"[^>]*id="lo-que-hago"[^>]*>([\s\S]*?)<\/section>/i);
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

  assert.equal((section[1].match(/Qu&eacute; resuelvo/g) ?? []).length, 5);
  assert.equal((section[1].match(/C&oacute;mo colaboro/g) ?? []).length, 5);
  assert.match(section[1], /<a class="offers-link" href="#contacto">Hablemos de tu idea/);
  assert.doesNotMatch(section[1], /fractional|freelance/i);
  assert.match(html, /@media\(max-width:900px\)\{\.offers-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\);/);
  assert.match(html, /@media\(max-width:620px\)\{[\s\S]*?\.offers-grid\{grid-template-columns:1fr;/);
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

test('los casos de proyecto comparten una plantilla ordenada y omiten campos vacíos', () => {
  const model = html.match(/var CASE_PAGE_ORDER = [\s\S]*?\n  var BOOKS = [\s\S]*?\n  };\n\n  \(function\(\)\{/);
  assert.ok(model, 'No se encontró el modelo reutilizable de casos');

  const context = {};
  runInNewContext(model[0].replace(/\n\n  \(function\(\)\{$/, ''), context);
  const expectedOrder = [
    'Contexto',
    'Desafío',
    'Rol de Romina',
    'Equipo y stakeholders',
    'Decisiones y acciones',
    'Resultados',
    'Aprendizajes'
  ];

  assert.deepEqual(
    Array.from(context.CASE_PAGE_ORDER, (definition) => definition.title),
    expectedOrder
  );
  assert.equal(Object.keys(context.BOOKS).length, 5);
  for (const book of Object.values(context.BOOKS)) {
    assert.equal(book.pages[0].cover, true);
    const headings = Array.from(book.pages.slice(1), (page) => page.h);
    const positions = headings.map((heading) => expectedOrder.indexOf(heading));
    assert.ok(positions.every((position) => position >= 0));
    assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
    assert.ok(book.pages.every((page) => page.cover || page.html));
  }

  const partial = context.makeBookCase({
    title: 'Caso de prueba',
    subtitle: 'sin campos vacíos',
    tag: 'Prueba',
    color: '#000000',
    sections: {context: 'Contexto visible', challenge: '', role: 'Rol visible'}
  });
  assert.deepEqual(
    Array.from(partial.pages, (page) => page.cover ? 'Portada' : page.h),
    ['Portada', 'Contexto', 'Rol de Romina']
  );

  const habitar = context.BOOKS.habitar;
  assert.ok(habitar, 'El caso habITar debe estar publicado en el estante');
  assert.deepEqual(
    Array.from(habitar.pages.slice(1), (page) => page.h),
    expectedOrder
  );
  const habitarContent = Array.from(habitar.pages, (page) => page.html ?? '').join(' ');
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

test('el modal de proyectos gestiona el foco como un diálogo accesible', () => {
  assert.match(
    html,
    /<div class="bookmodal" id="bookmodal" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="bookDialogTitle" tabindex="-1">/
  );
  assert.match(html, /<h2 class="sr-only" id="bookDialogTitle">Proyecto<\/h2>/);
  assert.match(html, /lastFocus=trigger\|\|document\.activeElement/);
  assert.match(html, /dialogTitle\.textContent='Proyecto: '\+b\.pages\[0\]\.title/);
  assert.match(html, /document\.body\.classList\.add\('modal-open'\)/);
  assert.match(html, /document\.body\.classList\.remove\('modal-open'\)/);
  assert.match(html, /setBackgroundInert\(true\)/);
  assert.match(html, /setBackgroundInert\(false\)/);
  assert.match(html, /closeButton\.focus\(\{preventScroll:true\}\)/);
  assert.match(html, /else if\(e\.key==='Tab'\)/);
  assert.match(html, /e\.shiftKey && \(document\.activeElement===first \|\| !modal\.contains\(document\.activeElement\)\)/);
  assert.match(html, /lastFocus\.focus\(\{preventScroll:true\}\)/);
  assert.match(html, /if\(e\.key==='Escape'\) closeBook\(\)/);
  assert.match(html, /body\.modal-open\{overflow:hidden;\}/);
});

test('cada proyecto puede abrirse y recorrerse desde una URL compartible', () => {
  const projectKeys = [...html.matchAll(/data-book="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(projectKeys).size, projectKeys.length);
  assert.equal(projectKeys.length, 5);
  assert.match(html, /'#project='\+encodeURIComponent\(key\)\+'&page='\+index/);
  assert.match(html, /new URLSearchParams\(window\.location\.hash\.slice\(1\)\)/);
  assert.match(html, /window\.history\[mode\|\|'replaceState'\]/);
  assert.match(html, /updateProjectUrl\('pushState'\)/);
  assert.match(html, /window\.addEventListener\('popstate',syncProjectFromUrl\)/);
  assert.match(html, /window\.addEventListener\('hashchange',syncProjectFromUrl\)/);
  assert.match(html, /syncProjectFromUrl\(\);/);
});

test('el libro muestra una sola página por vez en móvil y conserva el pliego en escritorio', () => {
  assert.match(
    html,
    /@media\(max-width:720px\)\{[\s\S]*?\.bookframe\{width:min\(82vw,360px\);\}[\s\S]*?\.pg-left\{display:none;\}[\s\S]*?\.leaf\{display:none!important;\}/
  );
  assert.match(html, /\.bookmodal\{padding:64px 18px 58px;overflow-x:hidden;overflow-y:auto;\}/);
  assert.match(html, /\.bm-nav\.prev\{left:-18px;\}/);
  assert.match(html, /\.bm-nav\.next\{right:-18px;\}/);
  assert.match(html, /window\.matchMedia \? window\.matchMedia\('\(max-width: 720px\)'\)/);
  assert.match(html, /pgR\.innerHTML=pageHTML\(pages\[pageIndex\]\)/);
  assert.match(html, /pnum\.textContent=\(pageIndex\+1\)\+' \/ '\+pageCount/);
  assert.match(html, /pageIndex\+=1; render\(\); updateProjectUrl\(\); return;/);
  assert.match(html, /pageIndex-=1; render\(\); updateProjectUrl\(\); return;/);
  assert.match(html, /pgL\.innerHTML=pageHTML\(pages\[spread\*2\]\)/);
  assert.match(html, /pgR\.innerHTML=pageHTML\(pages\[spread\*2\+1\]\)/);
  assert.match(html, /prevButton\.disabled=isMobileBook\(\) \? pageIndex<=0 : spread<=0/);
  assert.match(html, /nextButton\.disabled=isMobileBook\(\) \? pageIndex\+1>=pageCount/);
});

test('el recorrido académico conserva toda la información aprobada', () => {
  assert.equal((formationHtml.match(/<details\b/g) ?? []).length, 8);
  assert.equal((formationHtml.match(/<li>/g) ?? []).length, 45);
  assert.equal((formationHtml.match(/class="project-sheet"/g) ?? []).length, 4);
  assert.equal((formationHtml.match(/class="extra-note"/g) ?? []).length, 3);
});


test('formación se presenta como una carpeta del estudio y no como una grilla genérica', () => {
  assert.match(formationHtml, /--folder:#c9a66f;--folder-dark:#9d7548;--folder-edge:#7a5634/);
  assert.match(formationHtml, /<svg class="desk-vine"[^>]*aria-hidden="true"[^>]*focusable="false"/);
  assert.match(formationHtml, /<svg class="desk-plant"[^>]*aria-hidden="true"[^>]*focusable="false"/);
  assert.match(formationHtml, /\.hero-inner\{[\s\S]*?background:var\(--folder\)[\s\S]*?transform:rotate\(-\.35deg\)/);
  assert.match(formationHtml, /\.semesters::before\{[\s\S]*?repeating-radial-gradient/);
  assert.match(formationHtml, /\.semester,\.semester:nth-child\(n\),\.semester\[open\]\{background:transparent;box-shadow:none;transform:none/);
  assert.match(formationHtml, /\.project-sheet:nth-child\(4\)\{width:96%;margin:-7px 0 0 1%;transform:rotate\(\.55deg\)/);
  assert.match(formationHtml, /\.extra-row::before\{[\s\S]*?clip-path:polygon/);
  assert.match(formationHtml, /@media\(max-width:700px\)\{[\s\S]*?\.topbar a\{display:block!important;/);
  assert.match(formationHtml, /@media\(prefers-reduced-motion:reduce\)\{[\s\S]*?transition:none!important/);
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

test('las cuatro fortalezas usan evidencia concreta y aparecen después del hero', () => {
  assert.match(html, /<\/header>\s*<section class="strengths" id="fortalezas"/);
  assert.equal((html.match(/<article class="strength-card reveal"/g) ?? []).length, 4);
  assert.match(html, /Gesti&oacute;n de proyectos de software/);
  assert.match(html, /Comunicaci&oacute;n y alineaci&oacute;n/);
  assert.match(html, /Producto, requerimientos y m&eacute;tricas/);
  assert.match(html, /Criterio t&eacute;cnico y calidad/);
  assert.match(html, /tres proyectos en simult&aacute;neo/);
  assert.doesNotMatch(html, /class="strength[^\"]*(progress|meter|percentage)/i);
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
  assert.doesNotMatch(html, /Acá va tu historia|Ac&aacute; va tu historia|La escribimos juntas|en tesis/i);
});
