import type { APIRoute } from 'astro';
import { publishedPosts } from '../data/posts';

export const prerender = true;

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = () => {
  const items = publishedPosts.map((post) => `    <item>
      <title>${escapeXml(post.title.replace(/\s+\|\s+Romina Caubarrere$/, ''))}</title>
      <link>${post.canonical}</link>
      <guid isPermaLink="true">${post.canonical}</guid>
      <description>${escapeXml(post.description)}</description>
      <dc:creator>Romina Caubarrere</dc:creator>
      <dc:date>${post.dateTime}</dc:date>
    </item>`).join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Notas de Romina Caubarrere</title>
    <link>https://romicaubarrere.github.io/personal/</link>
    <description>Notas sobre trabajo, curiosidad, comunicación y tecnología.</description>
    <language>es-uy</language>
${items}
  </channel>
</rss>
`,
    { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } }
  );
};
