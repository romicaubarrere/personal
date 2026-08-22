import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, join, normalize } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(repositoryRoot, 'dist');
const publicRoutes = (await readdir(dist, { recursive: true }))
  .filter((route) => route.endsWith('.html') && route !== '404.html')
  .sort();
const routeDocuments = new Map(
  await Promise.all(publicRoutes.map(async (route) => [route, await readFile(join(dist, route), 'utf8')]))
);
const homeStyles = await readFile(join(repositoryRoot, 'src', 'styles', 'home.css'), 'utf8');

function getAttribute(source, elementPattern, attribute) {
  const match = source.match(elementPattern);
  assert.ok(match, `No se encontró ${attribute}`);
  const value = match[0].match(new RegExp(`${attribute}="([^"]+)"`, 'i'));
  assert.ok(value, `No se encontró ${attribute} en ${match[0]}`);
  return value[1];
}

function headingLevels(source) {
  return [...source.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
}

function ids(source) {
  return new Set([...source.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
}

test('todas las rutas tienen títulos, descripciones, canonical y jerarquía coherentes', () => {
  const titles = new Set();
  const descriptions = new Set();

  for (const [route, source] of routeDocuments) {
    const title = source.match(/<title>([^<]+)<\/title>/i)?.[1];
    const description = getAttribute(source, /<meta\b[^>]*name="description"[^>]*>/i, 'content');
    const canonical = getAttribute(source, /<link\b[^>]*rel="canonical"[^>]*>/i, 'href');
    const levels = headingLevels(source);

    assert.match(title ?? '', /Romina Caubarrere/);
    assert.ok(description.length >= 80 && description.length <= 180, `${route} tiene una descripción fuera de rango`);
    const expectedCanonical = route === 'index.html'
      ? 'https://romicaubarrere.github.io/personal/'
      : `https://romicaubarrere.github.io/personal/${route}`;
    assert.equal(canonical, expectedCanonical);
    assert.equal(levels[0], 1, `${route} debe empezar con h1`);
    for (let index = 1; index < levels.length; index += 1) {
      assert.ok(levels[index] <= levels[index - 1] + 1, `${route} salta de h${levels[index - 1]} a h${levels[index]}`);
    }
    assert.ok(!titles.has(title), `${route} repite el título`);
    assert.ok(!descriptions.has(description), `${route} repite la descripción`);
    titles.add(title);
    descriptions.add(description);
  }
});

test('Open Graph y X describen cada ruta y reutilizan la tarjeta aprobada', () => {
  for (const [route, source] of routeDocuments) {
    const title = source.match(/<title>([^<]+)<\/title>/i)?.[1];
    const canonical = getAttribute(source, /<link\b[^>]*rel="canonical"[^>]*>/i, 'href');
    assert.equal(getAttribute(source, /<meta\b[^>]*property="og:title"[^>]*>/i, 'content'), title);
    assert.equal(getAttribute(source, /<meta\b[^>]*property="og:url"[^>]*>/i, 'content'), canonical);
    assert.equal(
      getAttribute(source, /<meta\b[^>]*property="og:image"[^>]*>/i, 'content'),
      'https://romicaubarrere.github.io/personal/social-preview.png'
    );
    assert.match(source, /<meta name="twitter:card" content="summary_large_image">/i);
    assert.match(source, /<meta name="twitter:image:alt" content="[^"<>]+">/i);
    assert.match(source, /<meta property="og:description" content="[^"<>]+">/i);
    assert.match(source, /<meta name="twitter:description" content="[^"<>]+">/i);
    if (route.startsWith('posts/')) assert.match(source, /<meta property="og:type" content="article">/i);
    else assert.match(source, /<meta property="og:type" content="website">/i);
  }
});

test('cada documento publica una única instancia de sus metadatos críticos', async () => {
  const fields = [
    ['title', /<title\b/gi],
    ['description', /<meta\b[^>]*name="description"/gi],
    ['canonical', /<link\b[^>]*rel="canonical"/gi],
    ['robots', /<meta\b[^>]*name="robots"/gi],
    ['viewport', /<meta\b[^>]*name="viewport"/gi],
    ['og:title', /<meta\b[^>]*property="og:title"/gi],
    ['og:description', /<meta\b[^>]*property="og:description"/gi],
    ['og:url', /<meta\b[^>]*property="og:url"/gi],
    ['og:image', /<meta\b[^>]*property="og:image"\s/gi],
    ['twitter:card', /<meta\b[^>]*name="twitter:card"/gi],
    ['twitter:title', /<meta\b[^>]*name="twitter:title"/gi],
    ['twitter:description', /<meta\b[^>]*name="twitter:description"/gi],
    ['twitter:image', /<meta\b[^>]*name="twitter:image"\s/gi]
  ];

  for (const route of [...publicRoutes, '404.html']) {
    const source = await readFile(join(dist, route), 'utf8');
    for (const [field, pattern] of fields) {
      assert.equal(
        (source.match(pattern) ?? []).length,
        1,
        `${route}: ${field} debe aparecer una sola vez`
      );
    }
  }
});

test('todas las rutas declaran una única identidad profesional verificada', () => {
  for (const [route, source] of routeDocuments) {
    const identityLinks = [...source.matchAll(/<link\b[^>]*rel="me"[^>]*href="([^"]+)"[^>]*>/gi)];
    assert.equal(identityLinks.length, 1, `${route} debe declarar una identidad`);
    assert.equal(identityLinks[0][1], 'https://www.linkedin.com/in/rominacaubarrere/');
    assert.doesNotMatch(identityLinks[0][0], /instagram|mailto:|placeholder/i);
  }
});

test('las notas publican datos estructurados específicos y sin datos no aprobados', () => {
  for (const route of [
    'posts/por-que-hago-tantas-preguntas.html',
    'posts/cuando-puedas.html'
  ]) {
    const source = routeDocuments.get(route);
    const jsonLd = source.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
    assert.ok(jsonLd, `${route} no contiene JSON-LD`);

    const article = JSON.parse(jsonLd[1]);
    const canonical = getAttribute(source, /<link\b[^>]*rel="canonical"[^>]*>/i, 'href');
    const description = getAttribute(source, /<meta\b[^>]*name="description"[^>]*>/i, 'content');
    const published = getAttribute(source, /<time\b[^>]*>/i, 'datetime');

    assert.equal(article['@context'], 'https://schema.org');
    assert.equal(article['@type'], 'BlogPosting');
    assert.equal(article.url, canonical);
    assert.equal(article.mainEntityOfPage, canonical);
    assert.equal(article.description, description);
    assert.equal(article.datePublished, published);
    assert.equal(article.inLanguage, 'es');
    assert.deepEqual(article.isPartOf, {
      '@id': 'https://romicaubarrere.github.io/personal/#website'
    });
    assert.deepEqual(article.author, {
      '@id': 'https://romicaubarrere.github.io/personal/#person',
      '@type': 'Person',
      name: 'Romina Caubarrere',
      url: 'https://romicaubarrere.github.io/personal/',
      sameAs: ['https://www.linkedin.com/in/rominacaubarrere/']
    });
    assert.equal('email' in article.author, false);
    assert.doesNotMatch(JSON.stringify(article), /instagram|placeholder/i);
  }
});

test('las páginas internas publican breadcrumbs estructurados y 404 queda excluida', async () => {
  for (const [route, source] of routeDocuments) {
    const structuredData = [...source.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi
    )].map((match) => JSON.parse(match[1]));
    const breadcrumbs = structuredData.filter((entry) => entry['@type'] === 'BreadcrumbList');

    if (route === 'index.html') {
      assert.equal(breadcrumbs.length, 0);
      continue;
    }

    const canonical = getAttribute(source, /<link\b[^>]*rel="canonical"[^>]*>/i, 'href');
    const title = source.match(/<title>([^<]+)<\/title>/i)?.[1]
      .replace(/\s+\|\s+Romina Caubarrere$/, '');
    assert.equal(breadcrumbs.length, 1, `${route} debe tener un solo breadcrumb`);
    assert.deepEqual(breadcrumbs[0].itemListElement, [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://romicaubarrere.github.io/personal/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: canonical
      }
    ]);
  }

  const notFound = await readFile(join(dist, '404.html'), 'utf8');
  assert.doesNotMatch(notFound, /"@type": "BreadcrumbList"/);
});

test('el feed RSS coincide con las notas publicadas y se anuncia en todas las rutas', async () => {
  const feed = await readFile(join(dist, 'feed.xml'), 'utf8');
  const items = [...feed.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1]);
  const postRoutes = publicRoutes.filter((route) => route.startsWith('posts/'));

  assert.equal(items.length, postRoutes.length);
  assert.match(feed, /<language>es-uy<\/language>/);
  for (const route of postRoutes) {
    const source = routeDocuments.get(route);
    const canonical = getAttribute(source, /<link\b[^>]*rel="canonical"[^>]*>/i, 'href');
    const description = getAttribute(source, /<meta\b[^>]*name="description"[^>]*>/i, 'content');
    assert.equal(items.filter((item) => item.includes(`<link>${canonical}</link>`)).length, 1);
    assert.ok(feed.includes(description.replaceAll('&', '&amp;')));
  }
  for (const source of routeDocuments.values()) {
    assert.match(source, /<link rel="alternate" type="application\/rss\+xml" title="Notas de Romina Caubarrere" href="\/personal\/feed\.xml">/i);
  }
});

test('los enlaces internos de las rutas compiladas resuelven a archivos y fragmentos existentes', async () => {
  const routesToCheck = [...publicRoutes, '404.html'];
  const sources = new Map(
    await Promise.all(routesToCheck.map(async (route) => [route, await readFile(join(dist, route), 'utf8')]))
  );

  for (const [route, source] of sources) {
    const links = [...source.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((match) => match[1]);
    assert.doesNotMatch(source, /<a\b[^>]*href="#"/i, `${route} contiene un enlace vacío`);

    for (const href of links) {
      if (/^(?:https?:|mailto:|tel:)/i.test(href)) continue;
      const [rawPath, fragment] = href.split('#');
      let targetRoute;
      if (!rawPath) targetRoute = route;
      else if (rawPath.startsWith('/personal/')) targetRoute = rawPath.slice('/personal/'.length);
      else targetRoute = normalize(join(dirname(route), rawPath));
      if (!targetRoute || targetRoute.endsWith('/')) targetRoute = join(targetRoute, 'index.html');

      await access(join(dist, targetRoute));
      if (fragment) {
        const targetSource = sources.get(targetRoute) ?? await readFile(join(dist, targetRoute), 'utf8');
        assert.ok(ids(targetSource).has(fragment), `${route}: falta el destino ${href}`);
      }
    }
  }
});

test('todos los recursos locales referenciados existen en la salida compilada', async () => {
  const routesToCheck = [...publicRoutes, '404.html'];
  for (const route of routesToCheck) {
    const source = await readFile(join(dist, route), 'utf8');
    const directResources = [
      ...source.matchAll(/<(?:img|script|source|video|audio|iframe)\b[^>]*\bsrc="([^"]+)"/gi),
      ...source.matchAll(/<link\b[^>]*\bhref="([^"]+)"/gi)
    ].map((match) => match[1]);
    const responsiveResources = [...source.matchAll(/\bsrcset="([^"]+)"/gi)]
      .flatMap((match) => match[1].split(','))
      .map((candidate) => candidate.trim().split(/\s+/)[0]);

    for (const reference of [...directResources, ...responsiveResources]) {
      if (/^(?:https?:|data:|blob:|\/\/)/i.test(reference)) continue;
      const rawPath = reference.split(/[?#]/)[0];
      if (!rawPath) continue;

      let target;
      if (rawPath.startsWith('/personal/')) target = rawPath.slice('/personal/'.length);
      else if (rawPath.startsWith('/')) target = rawPath.slice(1);
      else target = normalize(join(dirname(route), rawPath));

      await assert.doesNotReject(
        access(join(dist, target)),
        `${route}: falta el recurso local ${reference}`
      );
    }
  }
});

test('todos los enlaces tienen nombre accesible y los externos usan un contrato seguro', async () => {
  for (const route of [...publicRoutes, '404.html']) {
    const source = await readFile(join(dist, route), 'utf8');
    const links = [...source.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];

    for (const [, attributes, content] of links) {
      const href = attributes.match(/\bhref="([^"]+)"/i)?.[1];
      const ariaLabel = attributes.match(/\baria-label="([^"]+)"/i)?.[1];
      const visibleText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      assert.ok(href, `${route}: enlace sin destino`);
      assert.ok(ariaLabel?.trim() || visibleText, `${route}: ${href} no tiene nombre accesible`);
      assert.doesNotMatch(href, /^javascript:/i, `${route}: ${href} usa javascript:`);

      if (/^https?:/i.test(href)) {
        assert.match(href, /^https:\/\//i, `${route}: ${href} no usa HTTPS`);
      }

      if (/\btarget="_blank"/i.test(attributes)) {
        const rel = attributes.match(/\brel="([^"]+)"/i)?.[1].split(/\s+/) ?? [];
        assert.ok(rel.includes('noopener'), `${route}: ${href} debe usar noopener`);
        assert.ok(rel.includes('noreferrer'), `${route}: ${href} debe usar noreferrer`);
      }
    }
  }
});

test('todas las páginas conservan landmarks, controles e imágenes semánticas', async () => {
  for (const route of [...publicRoutes, '404.html']) {
    const source = await readFile(join(dist, route), 'utf8');
    assert.equal((source.match(/<main\b/gi) ?? []).length, 1, `${route}: debe tener un main`);
    assert.equal((source.match(/<h1\b/gi) ?? []).length, 1, `${route}: debe tener un h1`);
    assert.match(
      source,
      /<a\b[^>]*class="skip-link"[^>]*href="#main-content"[^>]*>/i,
      `${route}: falta el enlace para saltar al contenido`
    );
    assert.match(
      source,
      /<main\b[^>]*id="main-content"[^>]*tabindex="-1"[^>]*>/i,
      `${route}: el contenido principal debe recibir foco`
    );

    for (const image of source.match(/<img\b[^>]*>/gi) ?? []) {
      assert.match(image, /\balt="[^"]*"/i, `${route}: imagen sin alt`);
    }

    for (const [, attributes, content] of source.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
      const ariaLabel = attributes.match(/\baria-label="([^"]+)"/i)?.[1];
      const ariaLabelledBy = attributes.match(/\baria-labelledby="([^"]+)"/i)?.[1];
      const visibleText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      assert.match(attributes, /\btype="(?:button|submit|reset)"/i, `${route}: botón sin tipo`);
      assert.ok(
        ariaLabel?.trim() || ariaLabelledBy?.trim() || visibleText,
        `${route}: botón sin nombre accesible`
      );
    }
  }
});

test('los landmarks de navegación y sus estados activos son inequívocos', async () => {
  const validCurrentValues = new Set(['page', 'step', 'location', 'date', 'time', 'true']);

  for (const route of [...publicRoutes, '404.html']) {
    const source = await readFile(join(dist, route), 'utf8');
    const navigationLabels = new Set();

    for (const nav of source.match(/<nav\b[\s\S]*?<\/nav>/gi) ?? []) {
      const openingTag = nav.match(/<nav\b[^>]*>/i)?.[0] ?? '';
      const ariaLabel = openingTag.match(/\baria-label="([^"]+)"/i)?.[1];
      const ariaLabelledBy = openingTag.match(/\baria-labelledby="([^"]+)"/i)?.[1];
      const accessibleName = ariaLabel ?? ariaLabelledBy;

      assert.ok(accessibleName?.trim(), `${route}: nav sin nombre accesible`);
      assert.ok(!navigationLabels.has(accessibleName), `${route}: nav repite el nombre ${accessibleName}`);
      navigationLabels.add(accessibleName);

      if (ariaLabelledBy) {
        assert.ok(ids(source).has(ariaLabelledBy), `${route}: falta #${ariaLabelledBy} para nombrar la navegación`);
      }

      const currentValues = [...nav.matchAll(/\baria-current="([^"]+)"/gi)].map((match) => match[1]);
      assert.ok(currentValues.length <= 1, `${route}: una navegación expone más de un destino activo`);
      for (const value of currentValues) {
        assert.ok(validCurrentValues.has(value), `${route}: aria-current="${value}" no es válido`);
      }

      if (/<a\b[^>]*href="#[^"]+"/i.test(nav)) {
        assert.match(source, /setAttribute\('aria-current','location'\)/, `${route}: falta anunciar la sección activa`);
        assert.match(source, /removeAttribute\('aria-current'\)/, `${route}: falta limpiar la sección anterior`);
      }
    }

    for (const button of source.match(/<button\b[^>]*\baria-controls="[^"]+"[^>]*>/gi) ?? []) {
      const target = button.match(/\baria-controls="([^"]+)"/i)?.[1];
      assert.ok(target && ids(source).has(target), `${route}: aria-controls apunta a un destino inexistente`);
      assert.match(button, /\baria-expanded="(?:true|false)"/i, `${route}: control desplegable sin estado inicial`);
    }
  }
});

test('los identificadores y las referencias ARIA resuelven sin ambigüedad', async () => {
  for (const route of [...publicRoutes, '404.html']) {
    const source = await readFile(join(dist, route), 'utf8');
    const documentIds = [...source.matchAll(/\sid="([^"]+)"/gi)].map((match) => match[1]);
    const uniqueIds = new Set(documentIds);

    assert.equal(uniqueIds.size, documentIds.length, `${route}: contiene identificadores duplicados`);

    for (const attribute of ['aria-controls', 'aria-describedby', 'aria-labelledby']) {
      for (const match of source.matchAll(new RegExp(`\\b${attribute}="([^"]+)"`, 'gi'))) {
        for (const reference of match[1].trim().split(/\s+/)) {
          assert.ok(uniqueIds.has(reference), `${route}: ${attribute} apunta a #${reference}, que no existe`);
        }
      }
    }

    for (const match of source.matchAll(/<label\b[^>]*\bfor="([^"]+)"[^>]*>/gi)) {
      assert.ok(uniqueIds.has(match[1]), `${route}: label[for] apunta a #${match[1]}, que no existe`);
    }
  }
});

test('el menú adaptable conserva estado, cierre y foco accesibles', async () => {
  for (const route of [...publicRoutes, '404.html']) {
    const source = await readFile(join(dist, route), 'utf8');
    if (!/<button\b[^>]*class="nav-toggle"/i.test(source)) continue;

    assert.match(source, /nav\.classList\.toggle\('open',open\)/, `${route}: el menú no sincroniza su estado visual`);
    assert.match(source, /setAttribute\('aria-expanded',String\(open\)\)/, `${route}: el menú no anuncia su estado`);
    assert.match(source, /nav\.inert=mobileMenuQuery\.matches && !open/, `${route}: el menú móvil cerrado sigue siendo interactivo`);
    assert.match(source, /if\(e\.target\.closest\('a'\)\) setOpen\(false\)/, `${route}: el menú no cierra al navegar`);
    assert.match(source, /e\.key==='Escape'/, `${route}: el menú no responde a Escape`);
    assert.match(source, /setOpen\(false\); toggle\.focus\(\)/, `${route}: Escape no devuelve el foco`);
    assert.match(source, /document\.addEventListener\('pointerdown'/, `${route}: el menú no cierra al pulsar fuera`);
    assert.match(source, /mobileMenuQuery\.addEventListener\('change',syncMenu\)/, `${route}: el menú no se reinicia al cambiar de viewport`);
  }
});

test('la navegación expone la sección activa y el contacto publica solo destinos verificados', () => {
  const home = routeDocuments.get('index.html');
  assert.match(home, /setAttribute\('aria-current','location'\)/);
  assert.match(home, /classList\.toggle\('is-active',active\)/);
  assert.match(homeStyles, /nav a\.is-active/);
  assert.doesNotMatch(home, /<a\b[^>]*href="#"/i);
  assert.equal((home.match(/class="ltag is-pending" aria-disabled="true"/g) ?? []).length, 1);
  assert.match(home, /href="mailto:rominacaubarrere@gmail\.com"/);
  assert.match(home, /aria-label="Enviar un email a Romina Caubarrere"/);
  assert.match(home, /data-analytics-event="contact_email_click"/);
  assert.match(home, /href="https:\/\/www\.linkedin\.com\/in\/rominacaubarrere\/"/);
  assert.match(home, /rel="me noopener noreferrer"/);
  assert.match(home, /aria-label="LinkedIn de Romina Caubarrere \(abre en una nueva pesta&ntilde;a\)"/);
  assert.match(home, /data-analytics-event="contact_linkedin_click"/);
  assert.doesNotMatch(home, />Instagram<\/span>/);
  assert.match(home, /El CV est&aacute; pendiente de publicaci&oacute;n\./);
});

test('robots, sitemap y 404 quedan listos para GitHub Pages', async () => {
  const robots = await readFile(join(dist, 'robots.txt'), 'utf8');
  const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
  const notFound = await readFile(join(dist, '404.html'), 'utf8');

  assert.match(robots, /^User-agent: \*/m);
  assert.match(robots, /^Allow: \/personal\/$/m);
  assert.match(robots, /Sitemap: https:\/\/romicaubarrere\.github\.io\/personal\/sitemap\.xml/);
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const routeCanonicals = publicRoutes.map((route) => getAttribute(
    routeDocuments.get(route),
    /<link\b[^>]*rel="canonical"[^>]*>/i,
    'href'
  ));
  assert.deepEqual([...sitemapUrls].sort(), [...routeCanonicals].sort());
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length);
  assert.doesNotMatch(sitemap, /404\.html/);
  assert.match(notFound, /<title>Página no encontrada \| Romina Caubarrere<\/title>/i);
  assert.match(notFound, /<meta name="robots" content="noindex,follow">/i);
  assert.match(notFound, /href="index\.html"/i);
});

test('ninguna ruta genera referencias pegadas o duplicadas a /personal', () => {
  for (const [route, source] of routeDocuments) {
    assert.doesNotMatch(source, /\/personal(?:favicon|microinteractions|social-preview|_astro)/, route);
    assert.doesNotMatch(source, /\/personal\/personal\//, route);
  }
});
