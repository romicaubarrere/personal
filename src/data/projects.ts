export const PROJECT_SECTION_ORDER = [
  { key: 'context', title: 'Contexto' },
  { key: 'challenge', title: 'Desafío' },
  { key: 'role', title: 'Rol de Romina' },
  { key: 'team', title: 'Equipo y stakeholders' },
  { key: 'decisions', title: 'Decisiones y acciones' },
  { key: 'results', title: 'Resultados' },
  { key: 'learnings', title: 'Aprendizajes' }
] as const;

export type ProjectSectionKey = (typeof PROJECT_SECTION_ORDER)[number]['key'];

export interface ProjectBook {
  id: string;
  spineClass: string;
  spineLabel: string;
  ariaLabel: string;
  bands: 1 | 2;
  tag: string;
  color: string;
  title: string;
  subtitle: string;
  summary?: string;
  sections: Partial<Record<ProjectSectionKey, string>>;
}

export interface CoverPage {
  kind: 'cover';
  title: string;
  subtitle: string;
}

export interface ContentPage {
  kind: 'content';
  title: string;
  html: string;
}

export type ProjectPage = CoverPage | ContentPage;

export const PROJECTS: ProjectBook[] = [
  {
    id: 'eagerworks',
    spineClass: 's1',
    spineLabel: 'eagerworks',
    ariaLabel: 'Abrir proyecto: eagerworks',
    bands: 2,
    tag: 'Gestión · software',
    color: '#3f7d4e',
    title: 'eagerworks',
    subtitle: 'un proyecto real',
    summary: 'Un proyecto real de gestión de software. El caso está en preparación y el libro conserva su estructura para completarlo con evidencia verificable.',
    sections: {
      context: '<em>Contá qué era: el producto, el equipo y el desafío que había.</em>',
      role: '<em>Qué hiciste vos como PM: cómo coordinaste, qué decisiones tomaste.</em>',
      results: '<em>Cómo terminó. Un número o un momento concreto vale oro.</em>'
    }
  },
  {
    id: 'fisica',
    spineClass: 's2',
    spineLabel: 'Física Mente Posible',
    ariaLabel: 'Abrir proyecto: Física Mente Posible',
    bands: 1,
    tag: 'Divulgación · premiado en EEUU',
    color: '#8f4230',
    title: 'Física Mente Posible',
    subtitle: 'divulgar la física',
    summary: 'Cofundé este proyecto de divulgación de Física, reconocido en Estados Unidos.',
    sections: {
      context: 'Un proyecto de divulgación de Física que cofundé, reconocido en Estados Unidos.',
      role: 'Cofundadora. <em>Contá qué parte llevaste: contenidos, difusión, equipo.</em>',
      results: '<em>El reconocimiento en EEUU y lo que significó para vos.</em>'
    }
  },
  {
    id: 'pmi',
    spineClass: 's3',
    spineLabel: 'VP Alianzas PMI',
    ariaLabel: 'Abrir proyecto: VP Alianzas PMI',
    bands: 2,
    tag: 'Alianzas · comunidad',
    color: '#cf9a3f',
    title: 'Club Jóvenes Líderes PMI',
    subtitle: 'VP de Alianzas',
    summary: 'Vicepresidenta de Alianzas del Club de Jóvenes Líderes de Proyectos de PMI Nuevo Cuyo.',
    sections: {
      context: 'Club de Jóvenes Líderes de Proyectos de PMI Nuevo Cuyo.',
      role: 'Vicepresidenta de Alianzas. <em>Contá qué alianzas armaste.</em>',
      results: '<em>Qué lograron juntos.</em>'
    }
  },
  {
    id: 'habitar',
    spineClass: 's4',
    spineLabel: 'habITar',
    ariaLabel: 'Abrir proyecto: habITar',
    bands: 1,
    tag: 'Producto · gestión · calidad',
    color: '#55603f',
    title: 'habITar',
    subtitle: 'proyecto final de UTEC',
    summary: 'Gestioné el proyecto, la definición de producto y el testing manual: 63 requisitos must have, 226 casos manuales y más de 2.700 pruebas automatizadas.',
    sections: {
      context: 'Proyecto final de la Licenciatura en Tecnologías de la Información de UTEC. Durante 46 semanas, un equipo de tres personas desarrolló una plataforma para centralizar la gestión económica, administrativa y comunitaria de una cooperativa de vivienda uruguaya.',
      challenge: 'La información y los procesos se repartían entre canales informales y registros manuales. Eso hacía difícil seguir pagos, decisiones y tareas. A la vez, el equipo tenía que cubrir un MVP amplio mientras sus integrantes trabajaban y la disponibilidad de las personas usuarias era limitada.',
      role: 'Me ocupé de la gestión del proyecto, la definición y priorización del producto y el testing manual. Organicé el backlog, llevé la matriz de riesgos, coordiné las validaciones y convertí 63 requisitos <em>must have</em> en un alcance verificable.',
      team: 'Trabajé con Diego Furiati en desarrollo y Alejandro Hernández en infraestructura y ciberseguridad. El equipo registró 2.466 horas de trabajo. Nos organizamos en sprints quincenales, con encuentros tres veces por semana y seguimiento asincrónico.',
      decisions: 'Adaptamos Scrum a la disponibilidad real: mantuvimos revisiones internas por sprint y concentramos la participación de la cooperativa en hitos con valor tangible. Priorizamos el MVP con MoSCoW y definimos una estrategia de calidad que combinó pruebas manuales, automatizadas, de rendimiento y de seguridad.',
      results: 'Llegamos a la defensa técnica final el 14 de agosto de 2026 con una versión funcional que integraba cuotas y morosidad, mantenimiento, reservas, eventos, comunicados y votaciones. La validación incluyó 226 casos manuales, más de 2.700 pruebas automatizadas y seis suites.',
      learnings: 'El proyecto confirmó que adaptar el método no es aflojarlo: es sostener sus objetivos con una dinámica que el equipo y las personas usuarias puedan mantener. También dejó una regla clara: una tecnología compleja solo aporta valor si la experiencia sigue siendo simple.'
    }
  },
  {
    id: 'p5',
    spineClass: 's5',
    spineLabel: 'tu proyecto',
    ariaLabel: 'Abrir proyecto pendiente 2',
    bands: 2,
    tag: 'Sumamos',
    color: '#7a3450',
    title: 'Y otro más',
    subtitle: 'hay lugar de sobra',
    sections: {
      context: '<em>Otro proyecto, otra historia. Lo llenamos juntas.</em>'
    }
  }
];

export function pagesFor(project: ProjectBook): ProjectPage[] {
  const pages: ProjectPage[] = [
    { kind: 'cover', title: project.title, subtitle: project.subtitle }
  ];

  for (const definition of PROJECT_SECTION_ORDER) {
    const html = project.sections[definition.key];
    if (html) pages.push({ kind: 'content', title: definition.title, html });
  }

  return pages;
}

export function projectById(id: string | null): ProjectBook | undefined {
  return PROJECTS.find((project) => project.id === id);
}
