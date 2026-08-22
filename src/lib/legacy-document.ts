export interface LegacyDocument {
  lang: string;
  head: string;
  body: string;
}

export function parseLegacyDocument(source: string): LegacyDocument {
  const html = source.match(/<html\b([^>]*)>([\s\S]*?)<\/html>/i);
  const head = source.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
  const body = source.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);

  if (!html || !head || !body) {
    throw new Error('El documento legacy no tiene html, head y body completos.');
  }

  const lang = html[1].match(/\blang=["']([^"']+)["']/i)?.[1] ?? 'es';

  return {
    lang,
    head: head[1].trim(),
    body: body[1].trim()
  };
}
