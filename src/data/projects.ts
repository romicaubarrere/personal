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
      role: 'Cofundadora.'
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
      role: 'Vicepresidenta de Alianzas.'
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
    id: 'personal',
    spineClass: 's1',
    spineLabel: 'El estudio de Romi',
    ariaLabel: 'Abrir proyecto: El estudio de Romi',
    bands: 2,
    tag: 'Producto · diseño · QA · DevOps',
    color: '#3f7d4e',
    title: 'El estudio de Romi',
    subtitle: 'mi primer proyecto post-UTEC',
    summary: 'Mi portfolio también es un producto: lo empecé una semana después de recibirme y estoy llevando producto, diseño, gestión, testing y DevOps de punta a punta.',
    sections: {
      context: 'Empecé este portfolio una semana después de recibirme como Licenciada en Tecnologías de la Información. Quería que el primer proyecto de esta nueva etapa no fuera una plantilla para mostrar trabajos anteriores, sino un producto propio que también demostrara cómo pienso y cómo trabajo.',
      challenge: 'El desafío es construir una experiencia que se sienta realmente mía y que, al mismo tiempo, funcione como software mantenible: responsive, accesible, traducible, verificable y fácil de seguir evolucionando. Cada decisión visual tiene que convivir con requisitos de producto, navegación, contenido, calidad y operación.',
      role: 'Estoy llevando el proyecto de punta a punta: definición de producto, dirección de diseño, priorización y gestión del backlog, QA y testing, y decisiones de DevOps. Reviso el resultado visual y funcional, convierto hallazgos en tickets y uso cada iteración para acercar el producto a una identidad propia, no a una estética genérica.',
      decisions: 'Migré la base a Astro, organicé los cambios por tickets y ramas, incorporé verificaciones automatizadas, accesibilidad y <em>prefers-reduced-motion</em>, documentación técnica, soporte en español, inglés y portugués, SEO técnico y un sistema de microinteracciones que forma parte de la identidad del sitio.',
      results: 'El proyecto ya funciona como portfolio y como evidencia de proceso. El código, las decisiones y la evolución están disponibles para revisar: <a href="https://github.com/romicaubarrere/personal" target="_blank" rel="noreferrer">ver repositorio</a> · <a href="https://github.com/romicaubarrere/personal/blob/main/docs/project-history.md" target="_blank" rel="noreferrer">ver historial del proyecto</a> · <a href="https://github.com/romicaubarrere/personal/tree/main/docs" target="_blank" rel="noreferrer">entrar a la documentación</a>.',
      learnings: 'Me gusta que este sea mi primer proyecto después de graduarme porque junta áreas que normalmente aparecen separadas: producto, diseño, gestión, calidad y operación. No lo estoy tratando como una pieza terminada: el historial queda abierto para registrar decisiones, problemas, cambios y aprendizajes a medida que el producto crece.'
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
