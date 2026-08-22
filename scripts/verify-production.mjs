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
  const pages = [
    ['', 'lang="es"', 'https://romicaubarrere.github.io/personal/'],
    ['en.html', 'lang="en"', 'https://romicaubarrere.github.io/personal/en.html'],
    ['pt.html', 'lang="pt"', 'https://romicaubarrere.github.io/personal/pt.html'],
    ['como-trabajo.html', 'lang="es"', 'https://romicaubarrere.github.io/personal/como-trabajo.html'],
    ['formacion.html', 'lang="es"', 'https://romicaubarrere.github.io/personal/formacion.html'],
    ['comunidad-charlas.html', 'lang="es"', 'https://romicaubarrere.github.io/personal/comunidad-charlas.html'],
    ['posts/por-que-hago-tantas-preguntas.html', 'lang="es"', 'https://romicaubarrere.github.io/personal/posts/por-que-hago-tantas-preguntas.html'],
    ['posts/cuando-puedas.html', 'lang="es"', 'https://romicaubarrere.github.io/personal/posts/cuando-puedas.html']
  ];

  let home = '';
  for (const [path, lang, canonical] of pages) {
    const body = await fetchText(path);
    assertIncludes(body, `<html ${lang}>`, path || 'portada');
    assertIncludes(body, `<link rel="canonical" href="${canonical}">`, path || 'portada');
    if (!path) home = body;
  }

  for (const language of ['es', 'en', 'pt', 'x-default']) {
    assertIncludes(home, `hreflang="${language}"`, 'portada');
  }
  assertIncludes(home, `<meta name="build-commit" content="${expectedSha}">`, 'commit publicado');

  const sitemapUrl = 'https://romicaubarrere.github.io/personal/sitemap.xml';
  const sitemap = await fetchText('sitemap.xml');
  assertIncludes(sitemap, '<urlset', 'sitemap');
  assertIncludes(sitemap, 'como-trabajo.html', 'sitemap');

  const projectRobots = await fetchText('robots.txt');
  assertIncludes(projectRobots, 'Allow: /personal/', 'robots del proyecto');
  assertIncludes(projectRobots, `Sitemap: ${sitemapUrl}`, 'robots del proyecto');
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
