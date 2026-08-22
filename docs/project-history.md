# Historial del proyecto: El estudio de Romi

Este documento registra la evolución del portfolio personal de Romina Caubarrere como un proyecto de producto y software. No es una lista exhaustiva de commits: reúne los hitos que explican decisiones, cambios de alcance, problemas encontrados, validaciones y aprendizajes.

## El punto de partida

El proyecto comenzó una semana después de que Romina se recibiera como Licenciada en Tecnologías de la Información. El objetivo no era solamente tener un portfolio publicado: era construir una pieza que pudiera mostrar cosas que un CV tradicional no deja ver bien, como la forma de pensar un problema, priorizar, diseñar, gestionar, probar, corregir y operar un producto digital.

Por eso el propio portfolio se trabaja como producto. Tiene backlog, decisiones de alcance, sistema visual, arquitectura, QA, CI, despliegue, documentación y evolución basada en problemas encontrados durante el uso real.

## Responsabilidad de punta a punta

### Producto

Romina define qué problema intenta resolver cada cambio, qué entra en alcance, qué se posterga y cómo se traduce una observación en trabajo verificable. Las ideas no se incorporan automáticamente como features: pasan por decisiones de prioridad, coherencia con el producto y valor para quien recorre el portfolio.

### Dirección de diseño y UX

La identidad no se resolvió con una plantilla. Se construyó un lenguaje propio alrededor de la idea de estudio: libros, carpetas, papeles, crochet, cocina, plantas y objetos funcionan como recursos narrativos y de interacción. Parte del trabajo consistió también en detectar componentes que se sentían genéricos o con estética de sitio generado por IA, descartarlos o rediseñarlos y llevarlos nuevamente al sistema visual del portfolio.

### Gestión del proyecto

El trabajo se organiza en backlog y tickets pequeños. Los cambios significativos se aíslan en ramas, se revisan, se validan y recién después se integran. La documentación funciona como memoria de producto y arquitectura; Git conserva el detalle de implementación.

### QA y testing

La definición de terminado no es solamente que una pantalla se vea bien. Se verifican build, comportamiento funcional, responsive, navegación por teclado, foco, semántica, accesibilidad, movimiento reducido, enlaces, rutas, SEO y presupuestos de performance. Los problemas encontrados en uso real vuelven al ciclo como trabajo de producto.

### DevOps y entrega

El proyecto utiliza Git, ramas, pull requests, integración continua con GitHub Actions y publicación mediante GitHub Pages. El pipeline actúa como gate: una modificación que rompe contratos funcionales, accesibilidad, SEO o presupuestos técnicos no se considera lista para integrar.

## Cómo pasa una observación a producción

El flujo que fue tomando forma durante el proyecto es:

1. aparece una necesidad, una idea o un problema durante el uso real;
2. se determina si pertenece al producto y cuál es su alcance;
3. se convierte en ticket o tarea verificable;
4. se implementa de forma aislada cuando corresponde;
5. se prueba funcional y visualmente;
6. CI ejecuta los contratos automatizados;
7. si los checks pasan, el cambio se integra en `main`;
8. se despliega y vuelve a revisarse en contexto real;
9. si el cambio modifica significativamente el producto o el proceso, se registra en este historial.

No todos los cambios necesitan una entrada aquí. Los fixes menores quedan trazados en Git.

## Historial

### Agosto de 2026 · convertir el portfolio en producto

La primera etapa dejó de tratar el sitio como una landing estática y lo convirtió en un producto iterativo. Se definió una identidad visual propia alrededor del concepto de “estudio”, con materiales, libros, crochet, plantas y microinteracciones como parte del lenguaje del sitio.

El trabajo se organizó en tickets pequeños y verificables. Los cambios pasaron a desarrollarse en ramas específicas y a integrarse después de revisión, en lugar de acumular modificaciones sin trazabilidad.

Documentación relacionada:

- [Estrategia de branching](./branching-strategy.md)
- [Sistema visual](./visual-system.md)
- [Backlog](./backlog.md)

### Agosto de 2026 · construir una identidad y después cuestionarla

Una parte importante del diseño fue revisar críticamente lo ya construido. Cuando una sección se veía demasiado genérica, repetitiva o cercana a patrones visuales típicos de sitios generados automáticamente, se volvió a trabajar en lugar de conservarla solo porque funcionaba técnicamente.

Eso llevó a retirar numeración decorativa, unificar tokens visuales, integrar mejor el crochet y trasladar intereses personales como la cocina a recursos de interfaz sin convertir cada sección en un estilo distinto. El criterio pasó a ser que cada elemento debía poder explicar por qué pertenece a este portfolio.

Documentación relacionada:

- [Sistema visual](./visual-system.md)
- [Checkpoints visuales](./checkpoints/)

### Agosto de 2026 · migración a Astro

Se decidió migrar la implementación base a Astro para que el portfolio pudiera crecer con una estructura mantenible, componentes reutilizables y rutas independientes sin perder la personalidad visual ya definida.

La decisión es también un ejemplo de cambio de criterio técnico: una arquitectura anterior quedó documentada como decisión histórica y luego fue reemplazada cuando las necesidades del producto justificaron la migración. React quedó acotado a la interacción que realmente lo necesitaba, en lugar de convertir todo el sitio en una aplicación cliente.

Documentación relacionada:

- [Plan de migración a Astro](./astro-migration-plan.md)
- [Decisión de arquitectura](./architecture-decision.md)

### Agosto de 2026 · calidad como requisito de producto

La revisión dejó de limitarse a “se ve bien”. El proyecto incorporó verificaciones funcionales, responsive, navegación por teclado, manejo de foco, `prefers-reduced-motion`, semántica, enlaces internos y externos, rutas públicas y correcciones específicas para el comportamiento de los libros y modales en móvil.

Un caso concreto apareció al abrir los proyectos desde la home en celular: el modal podía dejar a la persona atrapada, sin una forma práctica de cerrar o continuar navegando. El problema observado en uso real volvió al ciclo, se corrigió y quedó cubierto por contratos automatizados relacionados con interacción y accesibilidad.

Documentación relacionada:

- [Estrategia de QA y Definition of Done](./qa-strategy.md)

### Agosto de 2026 · los tests también son documentación

La suite automatizada pasó a expresar contratos del producto. No comprueba solamente funciones aisladas: protege estructura de Astro, rutas públicas, comportamiento de proyectos, accesibilidad, navegación, SEO, recursos locales, enlaces seguros, movimiento reducido y presupuestos de transferencia.

Durante la incorporación del propio portfolio como caso de estudio, varios tests fallaron porque asumían que el estante tenía exactamente tres proyectos. Esa falla fue útil: mostró que los tests estaban protegiendo una decisión anterior. En lugar de modificar el contrato sin pensar, se distinguieron los tres casos cerrados del nuevo caso vivo. Después aparecieron dos controles adicionales: seguridad de enlaces externos y presupuesto de CSS. La implementación se ajustó hasta recuperar la suite completa, que cerró en 93/93 verificaciones antes de integrar el cambio.

### Agosto de 2026 · performance como restricción de diseño

El pipeline incluye presupuestos explícitos de transferencia. Esto significa que una mejora visual no puede crecer indefinidamente a costa del peso del sitio. Al agregar el caso vivo, el CSS superó el presupuesto de 86 KiB. En lugar de aumentar el límite para hacer pasar CI, se simplificó la implementación y se reutilizaron estilos existentes.

Ese episodio consolidó una regla: los límites técnicos forman parte del diseño del producto, no son una validación posterior.

### Agosto de 2026 · el estado del trabajo también se vuelve auditable

Después de varias integraciones consecutivas, Trello y GitHub llegaron a mostrar estados distintos para algunos tickets. Se definió un límite de tres tickets de entrega en curso, una revisión de duplicados y dependencias antes de reclamar y un cierre que exige PR, commit, CI y publicación. Así, Done deja de ser una intención y pasa a representar evidencia comprobable.

Documentación relacionada:

- [Trazabilidad de entrega](./delivery-traceability.md)

### Agosto de 2026 · contenido, SEO y multilenguaje

El sitio evolucionó hacia una experiencia en español, inglés y portugués. También se trabajó la jerarquía de contenido, metadatos, enlaces internos, estados activos, sitemap, feed y SEO técnico.

La estrategia de idiomas quedó documentada para mantener consistencia a medida que se agreguen nuevas páginas y notas. La traducción no se trató como un selector decorativo: las rutas equivalentes y el contenido publicado forman parte del contrato del sitio.

Documentación relacionada:

- [Estrategia de idiomas](./language-strategy.md)
- [Guía del blog](./blog-guide.md)

### Agosto de 2026 · medir sin convertir el sitio en un dashboard

Se definieron eventos de analytics para entender cómo se usa el portfolio sin alterar la experiencia visual. La medición se trata como una capa de producto y no como decoración.

Documentación relacionada:

- [Eventos de analytics](./analytics-events.md)

### Agosto de 2026 · el portfolio entra a su propio portfolio

El proyecto se incorporó al recorrido de proyectos como un caso vivo. Los libros existentes siguen representando proyectos cerrados; “El estudio de Romi” muestra un producto que todavía evoluciona y cuyo proceso puede inspeccionarse.

El objetivo es que una persona pueda ver el resultado, entender qué responsabilidades asumió Romina y, si quiere profundizar, entrar directamente al repositorio y a esta documentación. El propio sitio pasa así a ser evidencia de proceso: muestra trabajos anteriores y, al mismo tiempo, expone cómo fue pensado, diseñado, gestionado, probado y operado.

## Decisiones de alcance que también cuentan

Parte del trabajo de producto está en decidir qué no hacer. Durante la evolución se preservaron contenidos y diseños ya aprobados cuando un ticket no justificaba modificarlos, se separaron migraciones técnicas de cambios visuales para reducir riesgo y se evitó presentar como terminadas piezas que todavía estaban en evolución.

También se mantuvo una distinción entre evidencia verificable y afirmaciones decorativas: las métricas se publican cuando pueden sostenerse con el repositorio, CI o documentación. Si una cifra no puede comprobarse, no se usa para hacer que el caso parezca más importante.

## Evidencia navegable

El caso está pensado para que las afirmaciones puedan comprobarse:

- [Repositorio](https://github.com/romicaubarrere/personal): implementación y estructura actual.
- [Historial de commits](https://github.com/romicaubarrere/personal/commits/main): evolución técnica y fixes.
- [Documentación](https://github.com/romicaubarrere/personal/tree/main/docs): arquitectura, producto, diseño, idiomas, analytics y proceso.
- [Backlog](./backlog.md): trabajo identificado y alcance.
- [Estrategia de branching](./branching-strategy.md): forma de integración.
- [Sistema visual](./visual-system.md): criterios de identidad.
- [Plan de migración a Astro](./astro-migration-plan.md): cambio de arquitectura.
- [Checkpoints visuales](./checkpoints/): evidencia de revisiones de interfaz.
- [Portfolio publicado](https://romicaubarrere.github.io/personal/): resultado en producción.

## Métricas que vale la pena seguir

Este historial no congela números que cambian continuamente. Cuando sea útil presentar métricas del proyecto, deben obtenerse de evidencia actual y fechada. Las más representativas son:

- tickets terminados y trabajo pendiente;
- pull requests integrados;
- cantidad y alcance de verificaciones automatizadas;
- rutas públicas e idiomas soportados;
- incidentes o defectos encontrados después de una integración y cómo se cerraron;
- presupuestos de JavaScript, CSS y recursos compartidos;
- evolución de accesibilidad, SEO y performance cuando exista una medición comparable.

## Qué aprendí hasta ahora

Este proyecto reforzó varias decisiones de trabajo:

- una interfaz puede funcionar y aun así no pertenecer al producto visualmente;
- probar en el dispositivo y contexto reales descubre problemas que una revisión de escritorio no muestra;
- un test que falla por un cambio legítimo no debe actualizarse automáticamente: primero hay que entender qué decisión estaba protegiendo;
- documentar una decisión permite cambiarla después sin borrar por qué existió;
- performance, accesibilidad y SEO son restricciones de producto, no tareas de limpieza para el final;
- separar tickets y ramas reduce el riesgo de que una mejora arrastre cambios que no pertenecen a su alcance.

## Qué haría distinto si empezara de nuevo

Definiría antes el sistema visual y sus tokens para reducir iteraciones sobre componentes que después hubo que unificar. También establecería desde las primeras versiones los contratos de responsive y accesibilidad que hoy protege CI, especialmente para interacciones complejas como los libros y modales.

La migración de arquitectura también habría sido más barata si la estructura de contenido hubiese nacido modular. Aun así, conservar las decisiones anteriores permite mostrar algo más útil que una historia perfecta: cómo el producto cambió cuando apareció mejor información.

## Próximos capítulos

El caso seguirá creciendo solo cuando haya evidencia nueva que valga la pena contar. Algunos capítulos posibles son nuevas decisiones de arquitectura, cambios relevantes en el proceso de entrega, resultados de medición reales, incidentes que modifiquen la estrategia de QA o una evolución sustancial del producto y su identidad.

No se agregan hitos para inflar el historial. Se agregan cuando cambian la manera de entender, construir, validar u operar el producto.

## Cómo seguir la evolución

- [Ver el repositorio](https://github.com/romicaubarrere/personal)
- [Explorar toda la documentación](https://github.com/romicaubarrere/personal/tree/main/docs)
- [Ver el historial de commits](https://github.com/romicaubarrere/personal/commits/main)
- [Abrir el portfolio publicado](https://romicaubarrere.github.io/personal/)

## Regla para mantener este historial

Agregar un nuevo bloque cuando ocurra un cambio que altere de forma significativa el producto, la arquitectura, la experiencia, la estrategia de calidad, el proceso de trabajo o el despliegue. Cada entrada debería explicar, cuando corresponda, el contexto, la decisión, la evidencia y qué cambió como consecuencia. Los fixes menores quedan en Git; este documento conserva las decisiones y aprendizajes que vale la pena contar como parte del caso de estudio.
