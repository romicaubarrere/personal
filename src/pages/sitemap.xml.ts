import type { APIRoute } from 'astro';

export const prerender = true;

const siteOrigin = 'https://romicaubarrere.github.io';
const basePath = '/personal';
const pageModules = import.meta.glob('./**/*.astro');

function routeFromPage(page: string) {
  const relativePath = page.slice(2).replace(/\.astro$/, '.html');
  return relativePath === 'index.html' ? `${basePath}/` : `${basePath}/${relativePath}`;
}

export const GET: APIRoute = () => {
  const routes = Object.keys(pageModules)
    .filter((page) => page !== './404.astro')
    .map(routeFromPage)
    .sort((left, right) => left.localeCompare(right, 'es'));

  const entries = routes
    .map((route) => `  <url>\n    <loc>${siteOrigin}${route}</loc>\n  </url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
};
