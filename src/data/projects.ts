export const PROJECT_SECTION_ORDER = [
  { key: 'context', title: 'Contexto' },
  { key: 'challenge', title: 'Desafío' },
  { key: 'role', title: 'Rol de Romina' },
  { key: 'team', title: 'Equipo y stakeholders' },
  { key: 'decisions', title: 'Decisiones y acciones' },
  { key: 'evidence', title: 'Ver el proceso' },
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
    tag: 'Producto · UX · gestión · calidad',
    color: '#55603f',
    title: 'habITar',
    subtitle: 'de un problema cotidiano a un producto real',
    summary: 'Lideré relevamiento, prototipado y gestión del proyecto, además del testing manual: del research con cooperativistas y el prototipo en Lovable a un MVP funcional y verificable.',
    sections: {
      context: 'habITar nació de un problema que conocíamos de cerca: una cooperativa de vivienda gestionaba pagos, reservas, decisiones y comunicación entre WhatsApp, planillas y registros en papel. El proyecto empezó en agosto de 2025 como trabajo final de la Licenciatura en Tecnologías de la Información de UTEC y evolucionó durante 46 semanas desde discovery y prototipado hasta una plataforma funcional.',
      challenge: 'No alcanzaba con digitalizar formularios. Había que entender cómo trabajan personas con edades, responsabilidades y niveles de familiaridad tecnológica muy distintos, respetar la gobernanza cooperativa y decidir qué problemas valía la pena resolver primero. La disponibilidad para entrevistas también fue limitada: ese riesgo se materializó y nos obligó a combinar entrevistas, consultas asincrónicas, observación contextual y validaciones rápidas sin presentar las suposiciones como evidencia.',
      role: 'Lideré el relevamiento, la documentación y el prototipado, además de la gestión del proyecto, la definición y priorización del producto y el testing manual. En la etapa de producto construí en Lovable la estructura completa de interacción, flujos y vistas y coordiné su validación. También trabajé en backlog, riesgos y criterios de calidad. El trabajo fue interdisciplinario: las decisiones de producto se discutían con el equipo, los cooperativistas, especialistas y tutores.',
      team: 'Trabajé con Diego Furiati y Alejandro Hernández en un equipo de tres personas con responsabilidades compartidas. Diego tuvo su mayor fortaleza en desarrollo y Alejandro en infraestructura y sistemas; los tres participamos en decisiones funcionales, técnicas, documentación y pruebas. La cooperativa fue cliente y fuente de validación, y las tutorías académicas funcionaron como otra instancia de revisión.',
      decisions: '<strong>Primero entender.</strong> Hicimos entrevistas semiestructuradas, relevamiento documental, mapas de empatía y arquetipos. Un formulario para convocar participantes reunió 13 registros. <strong>Después probar antes de construir.</strong> Convertí esos insumos en un prototipo interactivo en Lovable y lo iteramos con cooperativistas mediante entrevistas, mensajes y validaciones puntuales. El feedback llevó a simplificar flujos, reordenar funcionalidades y ajustar prioridades; una validación experta modificó partes clave del módulo de morosidad. <strong>Recién entonces cerrar alcance.</strong> Tradujimos la evidencia a requerimientos y usamos MoSCoW para separar el MVP de lo que podía esperar. El prototipo fue una herramienta para aprender: no era el producto final.',
      evidence: '<strong>Prototipo interactivo.</strong> <a href="https://habitar-digit.lovable.app/" target="_blank" rel="noopener noreferrer">Abrir la versión de Lovable ↗</a><br><br><strong>Demo del prototipo.</strong> <a href="https://drive.google.com/file/d/1_8D0SuFnFZ27Wx7roDScOcg9GWkIb_am/view" target="_blank" rel="noopener noreferrer">Ver la demostración funcional ↗</a><br><br>El video recorre la etapa de alta fidelidad usada para validar navegación, dashboards y módulos antes del desarrollo definitivo. Lo importante al mirarlo no es tomar esas pantallas como el producto final, sino ver qué estábamos poniendo a prueba: jerarquía de información, recorridos por rol y comprensión de tareas cotidianas. Dejé fuera del portfolio las personas, entrevistas, mapas y otras piezas de research que contienen información de cooperativistas.',
      results: 'El prototipo dio paso a una plataforma funcional en staging y llegó a la defensa técnica final el 14 de agosto de 2026. El MVP integró gestión de usuarios y roles, cuotas y comprobantes, reservas, mantenimiento, comunicación y votaciones digitales. La calidad se trató como parte del producto: el proyecto cerró con 63 requisitos <em>must have</em>, 226 casos manuales y más de 2.700 pruebas automatizadas. Las validaciones pasaron de conversaciones sobre prototipos a ciclos formales de testing, rendimiento, seguridad y UAT sobre software funcionando.',
      learnings: 'Lo más valioso del proceso fue ver cuánto cambia una solución cuando deja de diseñarse desde supuestos y empieza a enfrentarse a personas reales. Prototipar temprano nos permitió equivocarnos barato; priorizar evitó que la complejidad técnica se comiera el problema de usuario; y adaptar la metodología a la disponibilidad real mantuvo el proyecto avanzando sin fingir un proceso ideal. También confirmé algo que después repetí durante todo el proyecto: una tecnología compleja solo aporta valor si para quien la usa sigue sintiéndose simple.'
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
