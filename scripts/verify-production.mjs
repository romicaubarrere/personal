const baseUrl = process.env.PAGE_URL;
const expectedSha = process.env.EXPECTED_SHA;
const attempts = Number(process.env.SMOKE_ATTEMPTS ?? 6);
const delayMs = Number(process.env.SMOKE_DELAY_MS ?? 10_000);

if (!baseUrl || !expectedSha) throw new Error('PAGE_URL y EXPECTED_SHA son obligatorios');

const base = new URL(baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);

function assertIncludes(source, expected, label) {
  if (!source.includes(expected)) throw new Error(`${label}: falta ${expected}`);
}

async function fetchText(path) {
  const url = new URL(path, base);
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`${url.href}: HTTP ${response.status}`);
  return response.text();
}

async function verifyRootRobots() {
  const url = new URL('/robots.txt', base);
  const response = await fetch(url, { redirect: 'follow' });

  if (response.status === 404) {
    console.warn(`robots raíz no administrado desde este proyecto: ${url.href} devuelve HTTP 404`);
    return;
  }

  if (!response.ok) throw new Error(`${url.href}: HTTP ${response.status}`);

  const body = await response.text();
  if (!body.includes('https://romicaubarrere.github.io/personal/sitemap.xml')) {
    console.warn(`robots raíz existente sin referencia al sitemap del portfolio: ${url.href}`);
  }
}

async function verify() {
  const sitemapUrl = new URL('sitemap.xml', base);
  const sitemap = await fetchText(sitemapUrl);
  assertIncludes(sitemap, '<urlset', 'sitemap');

  const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]));
  if (sitemapLocations.length === 0) throw new Error('sitemap: no contiene URLs publicadas');
  if (new Set(sitemapLocations.map((location) => location.href)).size !== sitemapLocations.length) {
    throw new Error('sitemap: contiene URLs duplicadas');
  }

  let home = '';
  for (const location of sitemapLocations) {
    if (location.origin !== base.origin || !location.pathname.startsWith(base.pathname)) {
      throw new Error(`sitemap: URL fuera del portfolio ${location.href}`);
    }

    const body = await fetchText(location);
    const isHtmlPage = location.href === base.href || location.pathname.endsWith('.html');
    if (!isHtmlPage) continue;

    const relativePath = location.pathname.slice(base.pathname.length);
    const lang = relativePath === 'en.html' || relativePath.startsWith('en/')
      ? 'en'
      : relativePath === 'pt.html' || relativePath.startsWith('pt/')
        ? 'pt'
        : 'es';
    const label = relativePath || 'portada';
    assertIncludes(body, `<html lang="${lang}">`, label);
    assertIncludes(body, `<link rel="canonical" href="${location.href}">`, label);
    assertIncludes(body, `<meta name="build-commit" content="${expectedSha}">`, label);
    if (location.href === base.href) home = body;
  }
  if (!home) throw new Error('sitemap: falta la portada canónica');

  for (const language of ['es', 'en', 'pt', 'x-default']) {
    assertIncludes(home, `hreflang="${language}"`, 'portada');
  }
  assertIncludes(sitemap, 'como-trabajo.html', 'sitemap');

  const projectRobots = await fetchText('robots.txt');
  assertIncludes(projectRobots, 'Allow: /personal/', 'robots del proyecto');
  assertIncludes(projectRobots, `Sitemap: ${sitemapUrl.href}`, 'robots del proyecto');
  await verifyRootRobots();

  const feed = await fetchText('feed.xml');
  assertIncludes(feed, '<rss', 'feed');
  assertIncludes(feed, '<channel>', 'feed');

  const notFound = await fetchText('404.html');
  assertIncludes(notFound, 'content="noindex,follow"', '404');

  const assets = [...home.matchAll(/(?:src|href)="([^"]*\/_astro\/[^"]+)"/g)].map((match) => match[1]);
  if (assets.length === 0) throw new Error('portada: no se encontraron assets compilados');
  for (const asset of new Set(assets)) {
    const response = await fetch(new URL(asset, base), { redirect: 'follow' });
    if (!response.ok) throw new Error(`asset ${asset}: HTTP ${response.status}`);
  }
}

let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    await verify();
    console.log(`Producción verificada en ${base.href} para ${expectedSha}`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    if (attempt < attempts) {
      console.warn(`Intento ${attempt}/${attempts} falló: ${error.message}. Reintentando…`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

throw lastError;
