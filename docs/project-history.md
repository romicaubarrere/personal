# Historial del proyecto: El estudio de Romi

Este documento registra la evolución del portfolio personal de Romina Caubarrere como un proyecto de producto y software. No es una lista exhaustiva de commits: reúne los hitos que explican decisiones, cambios de alcance, problemas encontrados y aprendizajes.

## Por qué existe

El proyecto comenzó una semana después de que Romina se recibiera como Licenciada en Tecnologías de la Información, con la intención de construir un portfolio que también funcionara como evidencia de cómo trabaja.

En este proyecto Romina lleva de punta a punta:

- producto y definición de alcance;
- dirección de diseño e identidad visual;
- gestión del proyecto y del backlog;
- QA, testing funcional, responsive y accesibilidad;
- decisiones de DevOps, ramas, integración y despliegue;
- contenido, navegación, SEO técnico y evolución multilenguaje.

## Historial

### Agosto de 2026 · convertir el portfolio en producto

La primera etapa dejó de tratar el sitio como una landing estática y lo convirtió en un producto iterativo. Se definió una identidad visual propia alrededor del concepto de “estudio”, con materiales, libros, crochet, plantas y microinteracciones como parte del lenguaje del sitio.

El trabajo se organizó en tickets pequeños y verificables. Los cambios pasaron a desarrollarse en ramas específicas y a integrarse después de revisión, en lugar de acumular modificaciones sin trazabilidad.

Documentación relacionada:

- [Estrategia de branching](./branching-strategy.md)
- [Sistema visual](./visual-system.md)
- [Backlog](./backlog.md)

### Agosto de 2026 · migración a Astro

Se decidió migrar la implementación base a Astro para que el portfolio pudiera crecer con una estructura mantenible, componentes reutilizables y rutas independientes sin perder la personalidad visual ya definida.

La migración se documentó antes de ejecutarse y se acompañó con decisiones de arquitectura explícitas.

Documentación relacionada:

- [Plan de migración a Astro](./astro-migration-plan.md)
- [Decisión de arquitectura](./architecture-decision.md)

### Agosto de 2026 · calidad como requisito de producto

La revisión dejó de limitarse a “se ve bien”. El proyecto incorporó verificaciones funcionales, responsive, navegación por teclado, manejo de foco, `prefers-reduced-motion` y correcciones específicas para el comportamiento de los libros y modales en móvil.

Los problemas encontrados durante el uso real se convierten en tickets y vuelven al ciclo de producto, diseño, implementación y validación.

### Agosto de 2026 · contenido, SEO y multilenguaje

El sitio evolucionó hacia una experiencia en español, inglés y portugués. También se trabajó la jerarquía de contenido, metadatos, enlaces internos, estados activos, sitemap, feed y SEO técnico.

La estrategia de idiomas quedó documentada para mantener consistencia a medida que se agreguen nuevas páginas y notas.

Documentación relacionada:

- [Estrategia de idiomas](./language-strategy.md)
- [Guía del blog](./blog-guide.md)

### Agosto de 2026 · medir sin convertir el sitio en un dashboard

Se definieron eventos de analytics para entender cómo se usa el portfolio sin alterar la experiencia visual. La medición se trata como una capa de producto y no como decoración.

Documentación relacionada:

- [Eventos de analytics](./analytics-events.md)

### Agosto de 2026 · el portfolio entra a su propio portfolio

El proyecto se incorporó al estante de “proyectos completos” como caso de estudio. El objetivo es que una persona pueda ver el resultado, entender qué roles asumió Romina y, si quiere profundizar, entrar directamente al repositorio y a esta documentación.

Esta decisión convierte el propio sitio en evidencia de proceso: el producto muestra trabajos anteriores y, al mismo tiempo, expone cómo fue pensado, diseñado, gestionado, probado y operado.

## Cómo seguir la evolución

- [Ver el repositorio](https://github.com/romicaubarrere/personal)
- [Explorar toda la documentación](https://github.com/romicaubarrere/personal/tree/main/docs)
- [Ver el historial de commits](https://github.com/romicaubarrere/personal/commits/main)
- [Abrir el portfolio publicado](https://romicaubarrere.github.io/personal/)

## Regla para mantener este historial

Agregar un nuevo bloque cuando ocurra un cambio que altere de forma significativa el producto, la arquitectura, la experiencia, la estrategia de calidad, el proceso de trabajo o el despliegue. Los fixes menores quedan en Git; este documento conserva las decisiones y aprendizajes que vale la pena contar como parte del caso de estudio.
