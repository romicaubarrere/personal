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
      decisions: '<strong>Primero entender.</strong> Hicimos entrevistas semiestructuradas, relevamiento documental, mapas de empatía y arquetipos. Un formulario para convocar participantes reunió 13 registros. <strong>Después probar antes de construir.</strong> Convertí esos insumos en un prototipo interactivo en Lovable y lo iteramos con cooperativistas mediante entrevistas, mensajes y validaciones puntuales. El feedback llevó a simplificar flujos, reordenar funcionalidades y ajustar prioridades; una validación experta modificó partes clave del módulo de morosidad. <strong>Recién entonces cerrar alcance.</strong> Tradujimos la evidencia a requisitos y usamos MoSCoW para separar el MVP de lo que podía esperar. El prototipo fue una herramienta para aprender: no era el producto final.<br><br><strong>Ver el proceso.</strong> <a href="https://habitar-digit.lovable.app/" target="_blank" rel="noopener noreferrer">Abrir el prototipo en Lovable ↗</a> · <a href="https://drive.google.com/file/d/1_8D0SuFnFZ27Wx7roDScOcg9GWkIb_am/view" target="_blank" rel="noopener noreferrer">Ver la demostración funcional ↗</a><br><br>El video recorre la etapa de alta fidelidad usada para validar navegación, dashboards y módulos antes del desarrollo definitivo. Sirve para ver qué estábamos poniendo a prueba: jerarquía de información, recorridos por rol y comprensión de tareas cotidianas. Dejé fuera del portfolio las personas, entrevistas, mapas y otras piezas de research que contienen información de cooperativistas.',
      results: 'El prototipo dio paso a una plataforma funcional en staging y llegó a la defensa técnica final el 14 de agosto de 2026. El MVP integró gestión de usuarios y roles, cuotas y comprobantes, reservas, mantenimiento, comunicación y votaciones digitales. La calidad se trató como parte del producto: el proyecto cerró con 63 requisitos <em>must have</em>, 226 casos manuales y más de 2.700 pruebas automatizadas. Las validaciones pasaron de conversaciones sobre prototipos a ciclos formales de testing, rendimiento, seguridad y UAT sobre software funcionando.',
      learnings: 'Lo más valioso del proceso fue ver cuánto cambia una solución cuando deja de diseñarse desde supuestos y empieza a enfrentarse a personas reales. Prototipar temprano nos permitió equivocarnos barato; priorizar evitó que la complejidad técnica se comiera el problema de usuario; y adaptar la metodología a la disponibilidad real mantuvo el proyecto avanzando sin fingir un proceso ideal. También confirmé algo que después repetí durante todo el proyecto: una tecnología compleja solo aporta valor si para quien la usa sigue sintiéndose simple.'
    }
  }
];

const SECTION_TITLES = {
  es: ['Contexto', 'Desafío', 'Rol de Romina', 'Equipo y stakeholders', 'Decisiones y acciones', 'Resultados', 'Aprendizajes'],
  en: ['Context', 'Challenge', "Romina's role", 'Team and stakeholders', 'Decisions and actions', 'Outcomes', 'Learnings'],
  pt: ['Contexto', 'Desafio', 'Papel da Romina', 'Equipe e stakeholders', 'Decisões e ações', 'Resultados', 'Aprendizados']
} as const;

const PROJECT_TRANSLATIONS: Record<'en' | 'pt', Record<string, Partial<ProjectBook>>> = {
  en: {
    fisica: {
      ariaLabel: 'Open project: Física Mente Posible', tag: 'Science communication · awarded in the US', subtitle: 'sharing physics',
      summary: 'I co-founded this physics communication project, recognized in the United States.',
      sections: { context: 'A physics communication project I co-founded, recognized in the United States.', role: 'Co-founder.' }
    },
    pmi: {
      spineLabel: 'PMI Partnerships VP', ariaLabel: 'Open project: PMI Partnerships VP', tag: 'Partnerships · community', subtitle: 'Partnerships VP',
      summary: 'Partnerships Vice President of the PMI Nuevo Cuyo Young Project Leaders Club.',
      sections: { context: 'PMI Nuevo Cuyo Young Project Leaders Club.', role: 'Partnerships Vice President.' }
    },
    habitar: {
      ariaLabel: 'Open project: habITar', tag: 'Product · UX · management · quality', subtitle: 'from an everyday problem to a real product',
      summary: 'I led research, prototyping and project management, as well as manual testing: from research with cooperative members and a Lovable prototype to a functional, verifiable MVP.',
      sections: {
        context: 'habITar began with a problem we knew firsthand: a housing cooperative managed payments, bookings, decisions and communication across WhatsApp, spreadsheets and paper records. The project started in August 2025 as the final project for UTEC’s Information Technology degree and evolved over 46 weeks from discovery and prototyping into a functional platform.',
        challenge: 'Digitizing forms was not enough. We needed to understand how people of different ages, responsibilities and levels of technical confidence worked, respect cooperative governance and decide which problems were worth solving first. Interview availability was also limited: that risk materialized and required us to combine interviews, asynchronous questions, contextual observation and rapid validation without presenting assumptions as evidence.',
        role: 'I led research, documentation and prototyping, as well as project management, product definition and prioritization, and manual testing. During the product stage I built the complete interaction structure, flows and views in Lovable and coordinated their validation. I also worked on the backlog, risks and quality criteria. The work was interdisciplinary: product decisions were discussed with the team, cooperative members, specialists and tutors.',
        team: 'I worked with Diego Furiati and Alejandro Hernández in a three-person team with shared responsibilities. Diego’s strongest area was development and Alejandro’s was infrastructure and systems; all three of us contributed to functional and technical decisions, documentation and testing. The cooperative was both client and source of validation, while academic tutoring added another layer of review.',
        decisions: '<strong>Understand first.</strong> We conducted semi-structured interviews, document analysis, empathy maps and archetypes. A participant recruitment form collected 13 responses. <strong>Then test before building.</strong> I turned those inputs into an interactive Lovable prototype and we iterated it with cooperative members through interviews, messages and targeted validation. Feedback simplified flows, reordered features and changed priorities; an expert review changed key parts of the arrears module. <strong>Only then close the scope.</strong> We translated the evidence into requirements and used MoSCoW to separate the MVP from what could wait. The prototype was a learning tool, not the final product.<br><br><strong>See the process.</strong> <a href="https://habitar-digit.lovable.app/" target="_blank" rel="noopener noreferrer">Open the Lovable prototype ↗</a> · <a href="https://drive.google.com/file/d/1_8D0SuFnFZ27Wx7roDScOcg9GWkIb_am/view" target="_blank" rel="noopener noreferrer">Watch the functional demo ↗</a><br><br>The video covers the high-fidelity stage used to validate navigation, dashboards and modules before final development. It shows what we were testing: information hierarchy, role-based journeys and understanding of everyday tasks. I excluded people, interviews, maps and other research artifacts containing cooperative members’ information from the portfolio.',
        results: 'The prototype became a functional staging platform and reached its final technical defense on August 14, 2026. The MVP included users and roles, fees and receipts, bookings, maintenance, communication and digital voting. Quality was treated as part of the product: the project closed with 63 <em>must have</em> requirements, 226 manual test cases and more than 2,700 automated tests. Validation evolved from prototype conversations into formal testing, performance, security and UAT cycles on working software.',
        learnings: 'The most valuable part of the process was seeing how much a solution changes when it stops being designed from assumptions and meets real people. Early prototyping let us fail cheaply; prioritization kept technical complexity from swallowing the user problem; and adapting the method to real availability kept the project moving without pretending the process was ideal. It also confirmed something I repeated throughout the project: complex technology only creates value when it still feels simple to the person using it.'
      }
    }
  },
  pt: {
    fisica: {
      ariaLabel: 'Abrir projeto: Física Mente Posible', tag: 'Divulgação científica · premiado nos EUA', subtitle: 'divulgar a física',
      summary: 'Cofundei este projeto de divulgação da física, reconhecido nos Estados Unidos.',
      sections: { context: 'Um projeto de divulgação da física que cofundei, reconhecido nos Estados Unidos.', role: 'Cofundadora.' }
    },
    pmi: {
      spineLabel: 'VP de Parcerias PMI', ariaLabel: 'Abrir projeto: VP de Parcerias PMI', tag: 'Parcerias · comunidade', subtitle: 'VP de Parcerias',
      summary: 'Vice-presidente de Parcerias do Clube de Jovens Líderes de Projetos do PMI Nuevo Cuyo.',
      sections: { context: 'Clube de Jovens Líderes de Projetos do PMI Nuevo Cuyo.', role: 'Vice-presidente de Parcerias.' }
    },
    habitar: {
      ariaLabel: 'Abrir projeto: habITar', tag: 'Produto · UX · gestão · qualidade', subtitle: 'de um problema cotidiano a um produto real',
      summary: 'Liderei pesquisa, prototipagem e gestão do projeto, além dos testes manuais: da pesquisa com cooperativistas e do protótipo no Lovable a um MVP funcional e verificável.',
      sections: {
        context: 'O habITar nasceu de um problema que conhecíamos de perto: uma cooperativa habitacional gerenciava pagamentos, reservas, decisões e comunicação entre WhatsApp, planilhas e registros em papel. O projeto começou em agosto de 2025 como trabalho final da graduação em Tecnologia da Informação da UTEC e evoluiu durante 46 semanas, da descoberta e prototipagem até uma plataforma funcional.',
        challenge: 'Não bastava digitalizar formulários. Era preciso entender como trabalham pessoas com diferentes idades, responsabilidades e níveis de familiaridade tecnológica, respeitar a governança cooperativa e decidir quais problemas valia a pena resolver primeiro. A disponibilidade para entrevistas também foi limitada: esse risco se concretizou e nos levou a combinar entrevistas, consultas assíncronas, observação contextual e validações rápidas sem apresentar suposições como evidência.',
        role: 'Liderei a pesquisa, a documentação e a prototipagem, além da gestão do projeto, definição e priorização do produto e testes manuais. Na etapa de produto, construí no Lovable toda a estrutura de interação, fluxos e telas e coordenei sua validação. Também trabalhei no backlog, nos riscos e nos critérios de qualidade. O trabalho foi interdisciplinar: as decisões de produto eram discutidas com a equipe, cooperativistas, especialistas e tutores.',
        team: 'Trabalhei com Diego Furiati e Alejandro Hernández em uma equipe de três pessoas com responsabilidades compartilhadas. Diego teve sua maior força em desenvolvimento e Alejandro em infraestrutura e sistemas; todos participamos das decisões funcionais e técnicas, documentação e testes. A cooperativa foi cliente e fonte de validação, e as tutorias acadêmicas funcionaram como outra instância de revisão.',
        decisions: '<strong>Primeiro entender.</strong> Fizemos entrevistas semiestruturadas, levantamento documental, mapas de empatia e arquétipos. Um formulário para recrutar participantes reuniu 13 respostas. <strong>Depois testar antes de construir.</strong> Transformei esses insumos em um protótipo interativo no Lovable e o iteramos com cooperativistas por meio de entrevistas, mensagens e validações pontuais. O feedback simplificou fluxos, reordenou funcionalidades e ajustou prioridades; uma revisão especializada mudou partes essenciais do módulo de inadimplência. <strong>Só então fechar o escopo.</strong> Traduzimos as evidências em requisitos e usamos MoSCoW para separar o MVP do que poderia esperar. O protótipo era uma ferramenta para aprender, não o produto final.<br><br><strong>Ver o processo.</strong> <a href="https://habitar-digit.lovable.app/" target="_blank" rel="noopener noreferrer">Abrir o protótipo no Lovable ↗</a> · <a href="https://drive.google.com/file/d/1_8D0SuFnFZ27Wx7roDScOcg9GWkIb_am/view" target="_blank" rel="noopener noreferrer">Ver a demonstração funcional ↗</a><br><br>O vídeo percorre a etapa de alta fidelidade usada para validar navegação, dashboards e módulos antes do desenvolvimento definitivo. Ele mostra o que estávamos testando: hierarquia de informação, jornadas por papel e compreensão das tarefas cotidianas. Deixei fora do portfólio pessoas, entrevistas, mapas e outros materiais de pesquisa que contêm informações de cooperativistas.',
        results: 'O protótipo deu lugar a uma plataforma funcional em staging e chegou à defesa técnica final em 14 de agosto de 2026. O MVP integrou gestão de usuários e papéis, cotas e comprovantes, reservas, manutenção, comunicação e votações digitais. A qualidade foi tratada como parte do produto: o projeto terminou com 63 requisitos <em>must have</em>, 226 casos manuais e mais de 2.700 testes automatizados. As validações evoluíram de conversas sobre protótipos para ciclos formais de testes, desempenho, segurança e UAT sobre software funcionando.',
        learnings: 'O mais valioso do processo foi ver o quanto uma solução muda quando deixa de ser desenhada a partir de suposições e encontra pessoas reais. Prototipar cedo permitiu errar barato; priorizar impediu que a complexidade técnica engolisse o problema do usuário; e adaptar a metodologia à disponibilidade real manteve o projeto avançando sem fingir um processo ideal. Também confirmei algo que repeti durante todo o projeto: uma tecnologia complexa só gera valor quando continua parecendo simples para quem a usa.'
      }
    }
  }
};

export function projectsFor(lang: 'es' | 'en' | 'pt' = 'es'): ProjectBook[] {
  if (lang === 'es') return PROJECTS;
  return PROJECTS.map((project) => ({ ...project, ...PROJECT_TRANSLATIONS[lang][project.id] }));
}

export function pagesFor(project: ProjectBook, lang: 'es' | 'en' | 'pt' = 'es'): ProjectPage[] {
  const pages: ProjectPage[] = [
    { kind: 'cover', title: project.title, subtitle: project.subtitle }
  ];

  for (const [index, definition] of PROJECT_SECTION_ORDER.entries()) {
    const html = project.sections[definition.key];
    if (html) pages.push({ kind: 'content', title: SECTION_TITLES[lang][index], html });
  }

  return pages;
}

export function projectById(id: string | null, lang: 'es' | 'en' | 'pt' = 'es'): ProjectBook | undefined {
  return projectsFor(lang).find((project) => project.id === id);
}
