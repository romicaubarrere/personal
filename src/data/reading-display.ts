export const displayedCurrentReading = {
  title: 'Reina de sombras',
  author: 'Sarah J. Maas',
  updatedAt: '2026-08-27',
  updatedLabel: '27 de agosto de 2026',
  coverUrl: 'https://covers.openlibrary.org/b/isbn/9788410163744-L.jpg',
  coverAlt: 'Portada de Reina de sombras, de Sarah J. Maas'
} as const;

export const recentCoverByTitle: Record<string, { url: string; alt: string }> = {
  'Heredera De Fuego': {
    url: 'https://covers.openlibrary.org/b/isbn/9798890981561-L.jpg',
    alt: 'Portada de Heredera de fuego, de Sarah J. Maas'
  },
  'Crown of Midnight': {
    url: 'https://covers.openlibrary.org/b/isbn/9798890981554-L.jpg',
    alt: 'Portada de Crown of Midnight, de Sarah J. Maas'
  },
  'Trono De Cristal': {
    url: 'https://covers.openlibrary.org/b/isbn/9798890981547-L.jpg',
    alt: 'Portada de Trono de cristal, de Sarah J. Maas'
  },
  'Toda la verdad de mis mentiras': {
    url: 'https://covers.openlibrary.org/b/isbn/9788491291893-L.jpg',
    alt: 'Portada de Toda la verdad de mis mentiras, de Elísabet Benavent'
  },
  'Pissoteando mitos': {
    url: 'https://covers.openlibrary.org/b/isbn/9789878942872-L.jpg',
    alt: 'Portada de Pissoteando mitos, de Franco Pisso'
  }
};

export const visibleReadingLimit = 5 as const;
