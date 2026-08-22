export interface PublishedPost {
  slug: string;
  title: string;
  description: string;
  canonical: string;
  summary: string;
  dateTime: string;
  dateLabel: string;
}

export const publishedPosts: readonly PublishedPost[] = [
  {
    slug: 'por-que-hago-tantas-preguntas',
    title: '¿Por qué hago tantas preguntas? | Romina Caubarrere',
    description: 'Una nota personal sobre curiosidad, preguntas, rabbit holes y por qué sigo queriendo saber un poco más.',
    canonical: 'https://romicaubarrere.github.io/personal/posts/por-que-hago-tantas-preguntas.html',
    summary: 'Sobre preguntar por qué, caer en rabbit holes y tener una memoria especial para las cosas pelotudas.',
    dateTime: '2026-08-22T04:08:07Z',
    dateLabel: 'agosto 2026'
  },
  {
    slug: 'cuando-puedas',
    title: 'Cuando puedas (cuando en realidad necesito que sea hoy) | Romina Caubarrere',
    description: 'Una nota personal sobre comunicación, feedback y aprender a ser directa sin sentir que todo tiene que convertirse en un reclamo.',
    canonical: 'https://romicaubarrere.github.io/personal/posts/cuando-puedas.html',
    summary: 'Cuando en realidad necesito que sea hoy. Sobre feedback, mensajes de tres líneas y aprender a bancarme un poco la incomodidad.',
    dateTime: '2026-08-22T05:55:05Z',
    dateLabel: 'agosto 2026'
  }
];

export function getPublishedPost(slug: string): PublishedPost {
  const post = publishedPosts.find((candidate) => candidate.slug === slug);
  if (!post) throw new Error(`No existe la nota publicada: ${slug}`);
  return post;
}
