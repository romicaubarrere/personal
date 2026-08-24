import type { ProjectBook } from './projects';

type Language = 'es' | 'en' | 'pt';

const ADDITIONAL_PROJECTS_ES: ProjectBook[] = [
  {
    id: 'javamoment',
    spineClass: 's1',
    spineLabel: 'JavaMoment',
    ariaLabel: 'Abrir proyecto: JavaMoment',
    bands: 2,
    tag: 'UTEC · 2022–2024',
    color: '#3c7549',
    title: 'JavaMoment',
    subtitle: 'un sistema que creció conmigo durante la carrera',
    summary: 'Proyecto académico de UTEC que evolucionó desde requerimientos y UML en 2022 hasta el Proyecto Final de Tecnólogo en 2024: un sistema para recolectar y gestionar datos de campo de la LTI.',
    sections: {
      context: 'JavaMoment aparece en mis entregas académicas desde 2022 y fue creciendo a medida que avanzaba la carrera. El problema era desarrollar y verificar un sistema informático para recolectar y gestionar datos de campo de la Licenciatura en Tecnologías de la Información.',
      challenge: 'La misma solución tuvo que incorporar progresivamente análisis, modelado, desarrollo, testing y persistencia de datos. En la etapa final también trabajamos con una base relacional, normalización, restricciones de integridad, procedimientos y un proceso ETL.',
      role: 'Formé parte del equipo de estudiantes durante las distintas etapas del proyecto. Mi nombre figura en la documentación de requerimientos y UML de 2022, en el Plan de Desarrollo de Software de 2023 y en la documentación técnica de base de datos del cierre de 2024.',
      team: 'Proyecto realizado en UTEC, sede Minas, con un equipo estudiantil que fue variando entre etapas. La documentación de 2024 registra a Gianluca Battistin, Gonzalo Ruiz, Federico Martinez y a mí.',
      results: 'El proyecto llegó al cierre del primer ciclo de la carrera como Proyecto Final de Tecnólogo. La documentación final cubre el diseño de la base operativa, relaciones, restricciones, secuencias, triggers y el proceso ETL hacia una base analítica.'
    }
  },
  {
    id: 'infraestructura-5bit',
    spineClass: 's5',
    spineLabel: 'Infraestructura 5bit',
    ariaLabel: 'Abrir proyecto: Infraestructura 5bit',
    bands: 1,
    tag: 'UTEC · infraestructura · 2023',
    color: '#cf7f6a',
    title: 'Proyecto de Infraestructura · 5bit',
    subtitle: 'redes, servidores, resiliencia y una entrega que hubo que sostener',
    summary: 'Proyecto integrador de tercer semestre: diseñamos la infraestructura de una universidad ficticia con múltiples sedes y una aplicación web Java Enterprise.',
    sections: {
      context: 'El Proyecto de Infraestructura del tercer semestre integraba infraestructura, programación y trabajo en equipo. El caso planteaba una institución educativa con seis sedes distribuidas por Uruguay y requería diseñar tanto la red como el entorno necesario para alojar una aplicación web.',
      challenge: 'La solución debía contemplar topología física y lógica, conectividad entre sedes, servidores, seguridad, alta disponibilidad y el aplicativo web. Durante el proyecto el equipo pasó de cinco integrantes a tres, así que también tuvimos que reorganizar el trabajo sin soltar la entrega.',
      role: 'Trabajé dentro del equipo 5bit en el modelado y documentación de una solución que combinaba infraestructura y software. El proyecto fue una de las experiencias que más me enseñó a entender dependencias técnicas y a reorganizar alcance y responsabilidades cuando cambia la capacidad real del equipo.',
      decisions: 'La implementación documentada incluyó VLAN, bonding, VRRP, DHCP, NAT, firewall, VPN y modelado en GNS3. Para el aplicativo se utilizó Java Enterprise Edition con MVC y JSF.',
      results: 'La entrega final reunió el diseño de datacenter y red, configuraciones reproducibles, diagramas, reglas de seguridad, demostraciones de conectividad y una aplicación para registro y gestión de personas y estudiantes.'
    }
  },
  {
    id: 'monopoly-mobile',
    spineClass: 's3',
    spineLabel: 'Juego mobile',
    ariaLabel: 'Abrir proyecto: juego mobile multijugador',
    bands: 2,
    tag: 'Producto propio · mobile · 2026',
    color: '#cf9a3f',
    title: 'Juego mobile de tablero uruguayo',
    subtitle: 'producto, reglas, UX y arquitectura avanzando en paralelo',
    summary: 'Proyecto personal en desarrollo: un juego mobile multijugador construido con Flutter/Dart y una arquitectura que separa dominio, contratos y backend.',
    sections: {
      context: 'Después de terminar la carrera empecé a construir un juego mobile de tablero con identidad uruguaya. Lo estoy tratando como un producto completo: research, alcance, reglas, UX/UI, arquitectura, QA, riesgos, métricas y documentación.',
      challenge: 'Un juego de reglas conocidas parece simple hasta que hay que convertir cada excepción en un contrato determinista, resolver multiplayer, reconexión, persistencia y mantener la experiencia entendible en una pantalla chica.',
      role: 'Es un proyecto propio. Llevo producto y coordinación cross-stream y trabajo también sobre diseño, QA governance, documentación y DevOps, mientras separo explícitamente ownership de Engine, UX y Backend para evitar mezclar decisiones.',
      decisions: 'El repositorio usa un cliente Flutter, un dominio de gameplay puro en Dart, contratos canónicos separados y un boundary de backend independiente del transporte. El nombre de desarrollo no está codificado en los paquetes para conservar la posibilidad de rebranding antes de una distribución externa.<br><br><a href="https://github.com/romicaubarrere/monopoly-mobile" target="_blank" rel="noopener noreferrer">Ver repositorio público ↗</a>',
      results: 'El proyecto está en desarrollo activo. Ya tiene workspace técnico, gates de Foundation y una separación explícita entre cliente, reglas de dominio, contratos y composición del backend; no lo presento como un producto terminado.'
    }
  },
  {
    id: 'portfolio',
    spineClass: 's4',
    spineLabel: 'El estudio de Romi',
    ariaLabel: 'Abrir proyecto: El estudio de Romi',
    bands: 1,
    tag: 'Producto propio · web · 2026',
    color: '#55603f',
    title: 'El estudio de Romi',
    subtitle: 'mi portfolio también es un proyecto',
    summary: 'Mi primer proyecto después de recibirme: producto, dirección de diseño, gestión, QA, testing y DevOps sobre el mismo portfolio que estás recorriendo.',
    sections: {
      context: 'Empecé este portfolio una semana después de recibirme como Licenciada en Tecnologías de la Información. No quería solamente publicar una web: quería usarla para practicar un ciclo de producto completo y dejar visible cómo evolucionó.',
      challenge: 'El desafío fue sostener una identidad propia mientras el sitio crecía, migrar la implementación a Astro sin perder comportamiento, mantener accesibilidad y responsive, y evitar que nuevas iteraciones introdujeran estética o copy genéricos.',
      role: 'Hago producto, dirección de diseño, gestión, QA y testing, DevOps, contenido y priorización. Cada problema que encuentro vuelve al backlog y cada cambio importante deja evidencia en Git o en la documentación.',
      decisions: 'La web usa Astro, una única isla React donde realmente aporta valor, GitHub Pages y un pipeline que compila, ejecuta pruebas de contrato y Playwright antes de integrar cambios. La historia del proyecto queda documentada en el propio repositorio.<br><br><a href="https://github.com/romicaubarrere/personal" target="_blank" rel="noopener noreferrer">Ver repositorio ↗</a>',
      results: 'El portfolio funciona como producto vivo y como caso de estudio: sus decisiones, tickets, pruebas, CI y evolución visual son parte de lo que muestra, no solamente infraestructura invisible.'
    }
  },
  {
    id: 'neruda-digital',
    spineClass: 's2',
    spineLabel: 'Neruda digital',
    ariaLabel: 'Abrir proyecto: presencia digital del Colegio y Liceo Pablo Neruda',
    bands: 1,
    tag: 'Web · contenidos · educación',
    color: '#8f4230',
    title: 'Colegio y Liceo Pablo Neruda · presencia digital',
    subtitle: 'sitio y contenidos para contar lo que pasa en el colegio',
    summary: 'Trabajo sobre la presencia digital del Colegio y Liceo Pablo Neruda de Atlántida: sitio web y contenidos de redes pensados para familias y comunidad educativa.',
    sections: {
      context: 'El Colegio y Liceo Pablo Neruda de Atlántida tiene una propuesta que va desde educación inicial hasta bachillerato. El trabajo digital necesita mostrar esa variedad sin convertir la comunicación en un catálogo frío de actividades.',
      challenge: 'La web y las redes hablan con familias actuales, familias que están evaluando el colegio y la propia comunidad. Cada pieza necesita ser clara, reconocible y suficientemente cercana para mostrar la experiencia cotidiana sin perder el objetivo de comunicación institucional.',
      role: 'Trabajo en la gestión de contenidos para Instagram y Facebook y en el sitio web. Planifico piezas, escribo y ajusto copies, organizo material de actividades y mantengo una línea de comunicación consistente entre formatos.',
      decisions: 'Priorizo material real del día a día y textos breves con intención de marketing, evitando una voz corporativa genérica. Para la web, la información central queda organizada alrededor de la propuesta educativa, niveles, actividades y contacto.<br><br><a href="https://www.pabloneruda.edu.uy/" target="_blank" rel="noopener noreferrer">Ver sitio público ↗</a>',
      results: 'El resultado es una presencia digital que permite recorrer la propuesta educativa y, en redes, sostener un registro continuo de actividades, talleres, salidas, deporte, laboratorio, inglés y vida cotidiana del colegio.'
    }
  }
];

const EXTRA_TRANSLATIONS: Record<'en' | 'pt', Record<string, Partial<ProjectBook>>> = {
  en: {
    javamoment: {
      ariaLabel: 'Open project: JavaMoment', tag: 'UTEC · 2022–2024', subtitle: 'a system that grew with me through university',
      summary: 'A UTEC academic project that evolved from requirements and UML in 2022 to the final Technologist project in 2024: a system for collecting and managing field data for the IT degree.',
      sections: {
        context: 'JavaMoment appears in my academic deliverables from 2022 onward and grew as I moved through the degree. The problem was to develop and verify an information system for collecting and managing field data for UTEC’s Information Technology degree.',
        challenge: 'The same solution progressively incorporated analysis, modeling, development, testing and data persistence. In the final stage we also worked with a relational database, normalization, integrity constraints, procedures and an ETL process.',
        role: 'I was part of the student team across the different stages. My name is present in the 2022 requirements and UML documentation, the 2023 Software Development Plan and the 2024 database technical documentation.',
        team: 'A UTEC Minas academic project with a student team that changed between stages. The 2024 documentation lists Gianluca Battistin, Gonzalo Ruiz, Federico Martinez and me.',
        results: 'The project reached the end of the first degree cycle as the final Technologist project. Its final documentation covers the operational database design, relationships, constraints, sequences, triggers and an ETL process into an analytical database.'
      }
    },
    'infraestructura-5bit': {
      spineLabel: '5bit Infrastructure', ariaLabel: 'Open project: 5bit Infrastructure', tag: 'UTEC · infrastructure · 2023',
      title: 'Infrastructure Project · 5bit', subtitle: 'networks, servers, resilience and a delivery we had to sustain',
      summary: 'Third-semester integrative project: we designed infrastructure for a fictional multi-campus university and a Java Enterprise web application.',
      sections: {
        context: 'The third-semester Infrastructure Project combined infrastructure, programming and teamwork. The scenario involved an educational institution with six campuses across Uruguay and required both a network design and the environment for a web application.',
        challenge: 'The solution had to cover physical and logical topology, inter-campus connectivity, servers, security, high availability and the web application. During the project the team went from five people to three, so we also had to reorganize the work without dropping the delivery.',
        role: 'I worked within team 5bit on modeling and documenting a solution that combined infrastructure and software. It taught me to understand technical dependencies and to reorganize scope and responsibilities when real team capacity changes.',
        decisions: 'The documented implementation included VLANs, bonding, VRRP, DHCP, NAT, firewall, VPN and GNS3 modeling. The application used Java Enterprise Edition with MVC and JSF.',
        results: 'The final delivery brought together datacenter and network design, reproducible configurations, diagrams, security rules, connectivity demonstrations and an application for registering and managing people and students.'
      }
    },
    'monopoly-mobile': {
      spineLabel: 'Mobile game', ariaLabel: 'Open project: multiplayer mobile board game', tag: 'Own product · mobile · 2026',
      title: 'Uruguayan mobile board game', subtitle: 'product, rules, UX and architecture moving in parallel',
      summary: 'Personal project in active development: a multiplayer mobile game built with Flutter/Dart and an architecture separating domain, canonical contracts and backend.',
      sections: {
        context: 'After finishing my degree I started building a mobile board game with a Uruguayan identity. I am treating it as a complete product: research, scope, rules, UX/UI, architecture, QA, risks, metrics and documentation.',
        challenge: 'A familiar ruleset looks simple until every exception must become a deterministic contract, multiplayer and reconnection need to work, state must persist and the experience still has to make sense on a small screen.',
        role: 'It is my own project. I own product and cross-stream coordination and also work on design, QA governance, documentation and DevOps, while keeping explicit ownership boundaries for Engine, UX and Backend.',
        decisions: 'The repository uses a Flutter client, a pure-Dart gameplay domain, separate canonical contracts and a transport-neutral backend boundary. The development product name is not encoded in package identifiers so rebranding remains possible before external distribution.<br><br><a href="https://github.com/romicaubarrere/monopoly-mobile" target="_blank" rel="noopener noreferrer">View public repository ↗</a>',
        results: 'The project is under active development. It already has a technical workspace, Foundation gates and explicit separation between client, domain rules, contracts and backend composition; I do not present it as a finished product.'
      }
    },
    portfolio: {
      spineLabel: "Romi's studio", ariaLabel: "Open project: Romi's studio", tag: 'Own product · web · 2026', title: "Romi's studio", subtitle: 'my portfolio is also a project',
      summary: 'My first project after graduating: product, design direction, management, QA, testing and DevOps on the same portfolio you are browsing.',
      sections: {
        context: 'I started this portfolio one week after graduating in Information Technology. I did not only want to publish a website: I wanted to use it to practice a complete product cycle and keep its evolution visible.',
        challenge: 'The challenge has been preserving a distinct identity as the site grows, migrating the implementation to Astro without losing behavior, maintaining accessibility and responsive layouts, and preventing new iterations from introducing generic visuals or copy.',
        role: 'I handle product, design direction, management, QA and testing, DevOps, content and prioritization. Every problem I find returns to the backlog and every important change leaves evidence in Git or documentation.',
        decisions: 'The site uses Astro, one React island where it actually adds value, GitHub Pages and a pipeline that builds, runs contract tests and Playwright before changes are integrated. The project history lives in the repository itself.<br><br><a href="https://github.com/romicaubarrere/personal" target="_blank" rel="noopener noreferrer">View repository ↗</a>',
        results: 'The portfolio works as a living product and a case study: its decisions, tickets, tests, CI and visual evolution are part of what it shows, not just invisible infrastructure.'
      }
    },
    'neruda-digital': {
      spineLabel: 'Neruda digital', ariaLabel: 'Open project: Colegio y Liceo Pablo Neruda digital presence', tag: 'Web · content · education',
      title: 'Colegio y Liceo Pablo Neruda · digital presence', subtitle: 'website and content to show everyday school life',
      summary: 'I work on the digital presence of Colegio y Liceo Pablo Neruda in Atlántida: its website and social content for families and the school community.',
      sections: {
        context: 'Colegio y Liceo Pablo Neruda in Atlántida offers education from early childhood through high school. Its digital presence needs to show that variety without turning communication into a cold catalog of activities.',
        challenge: 'The website and social channels speak to current families, prospective families and the school community. Each piece must be clear, recognizable and close enough to everyday life while still serving institutional communication goals.',
        role: 'I work on Instagram and Facebook content management and on the website. I plan pieces, write and refine copy, organize activity material and keep communication consistent across formats.',
        decisions: 'I prioritize real everyday material and short marketing-aware copy, avoiding a generic corporate voice. On the website, core information is organized around the educational proposal, levels, activities and contact.<br><br><a href="https://www.pabloneruda.edu.uy/" target="_blank" rel="noopener noreferrer">View public website ↗</a>',
        results: 'The result is a digital presence where families can browse the educational proposal while social channels maintain an ongoing record of activities, workshops, trips, sports, laboratory work, English and everyday school life.'
      }
    }
  },
  pt: {
    javamoment: {
      ariaLabel: 'Abrir projeto: JavaMoment', tag: 'UTEC · 2022–2024', subtitle: 'um sistema que cresceu comigo durante a graduação',
      summary: 'Projeto acadêmico da UTEC que evoluiu de requisitos e UML em 2022 até o Projeto Final de Tecnólogo em 2024: um sistema para coletar e gerenciar dados de campo da graduação em TI.',
      sections: {
        context: 'JavaMoment aparece nas minhas entregas acadêmicas desde 2022 e foi crescendo conforme eu avançava na graduação. O problema era desenvolver e verificar um sistema informático para coletar e gerenciar dados de campo da graduação em Tecnologia da Informação.',
        challenge: 'A mesma solução incorporou progressivamente análise, modelagem, desenvolvimento, testes e persistência de dados. Na etapa final também trabalhamos com banco relacional, normalização, restrições de integridade, procedimentos e um processo ETL.',
        role: 'Fiz parte da equipe de estudantes nas diferentes etapas. Meu nome aparece na documentação de requisitos e UML de 2022, no Plano de Desenvolvimento de Software de 2023 e na documentação técnica de banco de dados de 2024.',
        team: 'Projeto da UTEC, sede Minas, com uma equipe estudantil que mudou entre etapas. A documentação de 2024 registra Gianluca Battistin, Gonzalo Ruiz, Federico Martinez e eu.',
        results: 'O projeto chegou ao final do primeiro ciclo da graduação como Projeto Final de Tecnólogo. A documentação final cobre banco operacional, relacionamentos, restrições, sequências, triggers e o processo ETL para uma base analítica.'
      }
    },
    'infraestructura-5bit': {
      spineLabel: 'Infraestrutura 5bit', ariaLabel: 'Abrir projeto: Infraestrutura 5bit', tag: 'UTEC · infraestrutura · 2023', title: 'Projeto de Infraestrutura · 5bit',
      subtitle: 'redes, servidores, resiliência e uma entrega que precisou ser sustentada',
      summary: 'Projeto integrador do terceiro semestre: desenhamos a infraestrutura de uma universidade fictícia com vários campi e uma aplicação web Java Enterprise.',
      sections: {
        context: 'O Projeto de Infraestrutura do terceiro semestre integrava infraestrutura, programação e trabalho em equipe. O caso propunha uma instituição educacional com seis sedes no Uruguai e exigia desenhar a rede e o ambiente para uma aplicação web.',
        challenge: 'A solução precisava contemplar topologia física e lógica, conectividade entre sedes, servidores, segurança, alta disponibilidade e a aplicação web. Durante o projeto a equipe passou de cinco integrantes para três, então também tivemos que reorganizar o trabalho sem abandonar a entrega.',
        role: 'Trabalhei na equipe 5bit no modelado e documentação de uma solução que combinava infraestrutura e software. Foi uma experiência importante para entender dependências técnicas e reorganizar escopo e responsabilidades quando a capacidade real da equipe muda.',
        decisions: 'A implementação documentada incluiu VLAN, bonding, VRRP, DHCP, NAT, firewall, VPN e modelado no GNS3. A aplicação utilizou Java Enterprise Edition com MVC e JSF.',
        results: 'A entrega final reuniu desenho de datacenter e rede, configurações reproduzíveis, diagramas, regras de segurança, demonstrações de conectividade e uma aplicação para cadastro e gestão de pessoas e estudantes.'
      }
    },
    'monopoly-mobile': {
      spineLabel: 'Jogo mobile', ariaLabel: 'Abrir projeto: jogo mobile multiplayer', tag: 'Produto próprio · mobile · 2026', title: 'Jogo mobile de tabuleiro uruguaio',
      subtitle: 'produto, regras, UX e arquitetura avançando em paralelo',
      summary: 'Projeto pessoal em desenvolvimento: um jogo mobile multiplayer em Flutter/Dart com arquitetura que separa domínio, contratos canônicos e backend.',
      sections: {
        context: 'Depois de terminar a graduação comecei a construir um jogo mobile de tabuleiro com identidade uruguaia. Estou tratando o trabalho como produto completo: pesquisa, escopo, regras, UX/UI, arquitetura, QA, riscos, métricas e documentação.',
        challenge: 'Um conjunto de regras conhecido parece simples até que cada exceção precisa virar um contrato determinístico, multiplayer e reconexão precisam funcionar, o estado precisa persistir e a experiência ainda deve ser clara em uma tela pequena.',
        role: 'É um projeto próprio. Sou responsável por produto e coordenação cross-stream e também trabalho em design, governança de QA, documentação e DevOps, mantendo ownership explícito de Engine, UX e Backend.',
        decisions: 'O repositório usa cliente Flutter, domínio de gameplay puro em Dart, contratos canônicos separados e um boundary de backend independente de transporte. O nome de desenvolvimento não está nos identificadores dos pacotes para manter a possibilidade de rebranding.<br><br><a href="https://github.com/romicaubarrere/monopoly-mobile" target="_blank" rel="noopener noreferrer">Ver repositório público ↗</a>',
        results: 'O projeto está em desenvolvimento ativo. Já conta com workspace técnico, gates de Foundation e separação explícita entre cliente, regras de domínio, contratos e composição do backend; não o apresento como produto finalizado.'
      }
    },
    portfolio: {
      spineLabel: 'O estúdio da Romi', ariaLabel: 'Abrir projeto: O estúdio da Romi', tag: 'Produto próprio · web · 2026', title: 'O estúdio da Romi', subtitle: 'meu portfólio também é um projeto',
      summary: 'Meu primeiro projeto depois de me formar: produto, direção de design, gestão, QA, testes e DevOps no mesmo portfólio que você está navegando.',
      sections: {
        context: 'Comecei este portfólio uma semana depois de me formar em Tecnologia da Informação. Não queria apenas publicar um site: queria usá-lo para praticar um ciclo de produto completo e deixar sua evolução visível.',
        challenge: 'O desafio é manter uma identidade própria enquanto o site cresce, migrar a implementação para Astro sem perder comportamento, manter acessibilidade e responsividade e evitar que novas iterações introduzam visual ou texto genérico.',
        role: 'Faço produto, direção de design, gestão, QA e testes, DevOps, conteúdo e priorização. Cada problema volta ao backlog e cada mudança importante deixa evidência no Git ou na documentação.',
        decisions: 'O site usa Astro, uma única ilha React onde realmente agrega valor, GitHub Pages e um pipeline que compila, executa testes de contrato e Playwright antes de integrar mudanças. A história do projeto fica no próprio repositório.<br><br><a href="https://github.com/romicaubarrere/personal" target="_blank" rel="noopener noreferrer">Ver repositório ↗</a>',
        results: 'O portfólio funciona como produto vivo e como estudo de caso: decisões, tickets, testes, CI e evolução visual também fazem parte do que ele mostra.'
      }
    },
    'neruda-digital': {
      spineLabel: 'Neruda digital', ariaLabel: 'Abrir projeto: presença digital do Colegio y Liceo Pablo Neruda', tag: 'Web · conteúdo · educação', title: 'Colegio y Liceo Pablo Neruda · presença digital',
      subtitle: 'site e conteúdo para mostrar o cotidiano do colégio',
      summary: 'Trabalho na presença digital do Colegio y Liceo Pablo Neruda de Atlántida: site e conteúdo para redes voltado às famílias e à comunidade educativa.',
      sections: {
        context: 'O Colegio y Liceo Pablo Neruda de Atlántida oferece educação desde a etapa inicial até o ensino médio. O trabalho digital precisa mostrar essa variedade sem transformar a comunicação em um catálogo frio de atividades.',
        challenge: 'O site e as redes falam com famílias atuais, famílias que avaliam o colégio e a própria comunidade. Cada peça precisa ser clara, reconhecível e próxima do cotidiano sem perder o objetivo institucional.',
        role: 'Trabalho na gestão de conteúdo para Instagram e Facebook e no site. Planejo peças, escrevo e ajusto textos, organizo material das atividades e mantenho uma linha de comunicação consistente entre formatos.',
        decisions: 'Priorizo material real do cotidiano e textos breves com intenção de marketing, evitando uma voz corporativa genérica. No site, a informação central fica organizada em torno da proposta educativa, níveis, atividades e contato.<br><br><a href="https://www.pabloneruda.edu.uy/" target="_blank" rel="noopener noreferrer">Ver site público ↗</a>',
        results: 'O resultado é uma presença digital que permite percorrer a proposta educativa e, nas redes, manter um registro contínuo de atividades, oficinas, saídas, esporte, laboratório, inglês e vida cotidiana do colégio.'
      }
    }
  }
};

const FISICA_ENRICHMENT: Record<Language, Partial<ProjectBook>> = {
  es: {
    summary: 'Cofundé Física Mente Posible en 2019 dentro del programa Quiero ser Científica. El objetivo fue divulgar distintas ramas de la física en un lenguaje accesible y despertar vocaciones científicas; el equipo obtuvo el segundo premio a nivel nacional.',
    sections: {
      context: 'Física Mente Posible nació en 2019 a partir de Quiero ser Científica, una iniciativa de OWSD Uruguay con apoyo de Plan Ceibal y la Embajada de Estados Unidos. El equipo surgió del interés común por distintas ramas de la física.',
      challenge: 'Queríamos hablar de física clásica, moderna, cuántica y contemporánea sin volver el contenido inaccesible para quienes recién se acercaban al tema.',
      role: 'Fui cofundadora del proyecto y parte del equipo que definió su enfoque de divulgación.',
      decisions: 'Priorizamos lenguaje ameno y accesible, cubrimos distintas áreas de la física y sumamos entrevistas con personas del ámbito científico y académico para acercar investigaciones y proyectos al público.',
      results: 'El proyecto recibió el segundo premio a nivel nacional dentro del programa Quiero ser Científica.'
    }
  },
  en: {
    summary: 'I co-founded Física Mente Posible in 2019 through the Quiero ser Científica program. We aimed to explain different areas of physics in accessible language and spark scientific vocations; the team won second prize nationally.',
    sections: {
      context: 'Física Mente Posible began in 2019 through Quiero ser Científica, an OWSD Uruguay initiative supported by Plan Ceibal and the US Embassy. The team came together around a shared interest in different branches of physics.',
      challenge: 'We wanted to talk about classical, modern, quantum and contemporary physics without making the content inaccessible to people approaching the subject for the first time.',
      role: 'I co-founded the project and helped define its science-communication approach.',
      decisions: 'We prioritized approachable language, covered multiple areas of physics and added interviews with people from scientific and academic fields to bring research and projects closer to the public.',
      results: 'The project received second prize nationally within the Quiero ser Científica program.'
    }
  },
  pt: {
    summary: 'Cofundei Física Mente Posible em 2019 dentro do programa Quiero ser Científica. O objetivo foi divulgar diferentes áreas da física em linguagem acessível e despertar vocações científicas; a equipe recebeu o segundo prêmio nacional.',
    sections: {
      context: 'Física Mente Posible nasceu em 2019 a partir do Quiero ser Científica, iniciativa da OWSD Uruguay com apoio do Plan Ceibal e da Embaixada dos Estados Unidos. A equipe surgiu do interesse comum por diferentes áreas da física.',
      challenge: 'Queríamos falar de física clássica, moderna, quântica e contemporânea sem tornar o conteúdo inacessível para quem estava se aproximando do tema.',
      role: 'Fui cofundadora do projeto e parte da equipe que definiu sua abordagem de divulgação científica.',
      decisions: 'Priorizamos linguagem simples e acessível, cobrimos diferentes áreas da física e incluímos entrevistas com pessoas dos meios científico e acadêmico para aproximar pesquisas e projetos do público.',
      results: 'O projeto recebeu o segundo prêmio em nível nacional dentro do programa Quiero ser Científica.'
    }
  }
};

export function completeProjectsFor(baseProjects: ProjectBook[], lang: Language): ProjectBook[] {
  const enrichedBase = baseProjects.map((project) => {
    if (project.id !== 'fisica') return project;
    return { ...project, ...FISICA_ENRICHMENT[lang] };
  });

  const additions = lang === 'es'
    ? ADDITIONAL_PROJECTS_ES
    : ADDITIONAL_PROJECTS_ES.map((project) => ({ ...project, ...EXTRA_TRANSLATIONS[lang][project.id] }));

  return [...enrichedBase, ...additions];
}
