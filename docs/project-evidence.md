# Registro de evidencia: El estudio de Romi

Este documento complementa `project-history.md`. El historial cuenta la evolución; este registro conserva evidencia verificable para auditar cómo se toman decisiones, cómo se valida el producto y qué cambia entre versiones.

## Estado actual

Última actualización: 22 de agosto de 2026.

- Producto: portfolio personal tratado como producto digital iterativo.
- Arquitectura: Astro como base; React limitado a la isla interactiva del libro de proyectos.
- Producción: GitHub Pages desde `main`.
- Idiomas publicados: español, inglés y portugués.
- Calidad: build y suite automatizada como gate previo a integración.
- Accesibilidad: teclado, foco, semántica, `prefers-reduced-motion` y comportamiento responsive forman parte del contrato.
- Performance: existen presupuestos automatizados de transferencia, incluido un máximo de 86 KiB para CSS al momento de esta actualización.
- Gestión: backlog en Trello, trabajo por tickets, ramas y PRs para cambios significativos.

Este bloque debe actualizarse cuando cambie la arquitectura, el pipeline, los idiomas, la estrategia de QA o el modelo de despliegue.

## Baseline: de dónde partió y dónde está hoy

### Punto de partida

El objetivo inicial era construir un portfolio personal. La primera implementación todavía no tenía la estructura de producto que existe hoy: la identidad, arquitectura, contratos de calidad, documentación y proceso de entrega fueron apareciendo a medida que el sitio se usó, se cuestionó y se volvió a diseñar.

### Estado alcanzado

El proyecto hoy cuenta con identidad visual documentada, backlog, componentes y rutas en Astro, una isla React acotada, contenido multilenguaje, SEO técnico, analytics definidos, CI, publicación automatizada, tests de accesibilidad/navegación y presupuestos de performance.

La comparación no se usa para afirmar que el estado actual es definitivo. Sirve para mostrar qué capacidades se incorporaron y por qué.

## Registro de decisiones

Cada decisión relevante debería responder cuatro preguntas: qué problema había, qué alternativas existían, qué se decidió y qué consecuencia tuvo.

### Migrar a Astro

Problema: la estructura original empezaba a limitar el crecimiento del portfolio y la reutilización de páginas y componentes.

Decisión: migrar la base a Astro, conservar rutas históricas y limitar React a la interacción que realmente requería hidratación.

Trade-off: asumir una migración técnica y su validación a cambio de una estructura más mantenible.

Evidencia: `docs/astro-migration-plan.md` y `docs/architecture-decision.md`.

### Mantener tres libros cerrados y presentar el portfolio como caso vivo

Problema: incorporar el propio portfolio como un cuarto libro hacía pasar un proyecto todavía en evolución por un caso cerrado y rompía contratos existentes de la interfaz.

Decisión: conservar los tres libros como casos cerrados y presentar “El estudio de Romi” como proyecto vivo con acceso a historial, documentación y repositorio.

Consecuencia: el modelo de información refleja mejor el estado real del proyecto y los tests mantienen una distinción semántica útil.

### No aumentar el presupuesto de CSS para hacer pasar CI

Problema: al incorporar el caso vivo, el CSS total superó el presupuesto de 86 KiB.

Alternativas: subir el límite o reducir/reutilizar estilos.

Decisión: mantener el límite y simplificar la implementación.

Consecuencia: performance quedó tratada como restricción de producto y no como un gate que se modifica para aceptar cualquier cambio.

## Defectos relevantes

Este registro no duplica todos los bugs. Solo conserva defectos que cambiaron una decisión, un contrato o la estrategia de QA.

### Modal de proyectos en móvil

Detección: uso real desde celular.

Impacto: al abrir proyectos desde la home, la persona podía quedar atrapada en el modal sin una salida práctica para continuar navegando.

Respuesta: se revisó el comportamiento responsive, cierre y manejo de foco.

Prevención: los contratos automatizados de interacción y accesibilidad protegen el comportamiento esperado.

### Tests que asumían exactamente tres proyectos

Detección: CI durante la incorporación del portfolio como caso propio.

Impacto: seis verificaciones fallaron aunque el build de Astro era correcto.

Causa: los tests codificaban una decisión anterior del producto: tres proyectos cerrados.

Respuesta: primero se revisó qué contrato protegían. La solución final no fue cambiar ciegamente `3` por `4`, sino distinguir casos cerrados de proyecto vivo.

Aprendizaje: un test que falla frente a un cambio legítimo sigue aportando información sobre decisiones anteriores.

## Deuda técnica consciente

La deuda se registra solo cuando existe y se acepta deliberadamente. No se completa esta sección para aparentar que siempre hay deuda identificada.

### Regla

Cada deuda futura debe incluir: contexto, riesgo, motivo por el que no se resuelve ahora, condición que justificaría abordarla y evidencia relacionada.

### Margen del presupuesto CSS

La auditoría del 23 de agosto de 2026 midió 88.029 bytes de CSS compilado frente a un límite de 88.064 bytes. El build pasa, pero quedan sólo 35 bytes de margen. El riesgo está registrado en Trello y debe resolverse mediante optimización comprobable, sin aumentar el presupuesto para hacer pasar nuevos estilos.

### Paridad de las portadas localizadas

Las rutas internas ES/EN/PT están publicadas, pero las portadas EN/PT todavía usan una composición reducida frente a la portada española. El trabajo tiene un flujo activo y no se considera deuda desconocida ni se duplica en otro ticket.

Evidencia consolidada: [auditoría general del 23 de agosto de 2026](./general-audit-2026-08-23.md).

## Backlog descartado o postergado

Producto también implica decidir qué no construir.

Se registrarán aquí únicamente decisiones explícitas de descarte o postergación que afecten el rumbo del producto. Una idea que simplemente todavía no fue tomada no cuenta como decisión descartada.

Ejemplos de criterio ya aplicado:

- no mezclar una migración técnica con cambios visuales que no pertenecen al ticket;
- no modificar contenido aprobado solo porque se está trabajando cerca de esa sección;
- no publicar métricas que no puedan verificarse;
- no convertir cada interés personal en un sistema visual independiente si rompe la coherencia del portfolio.

## Criterios de aceptación y trazabilidad

Para tickets representativos, la evidencia ideal es:

`problema → ticket → criterios de aceptación → rama/commit → PR → CI → producción → revisión`

No todos los tickets necesitan documentarse aquí. Se priorizan los que muestran una decisión de producto, un riesgo técnico, un defecto significativo o una mejora del proceso.

## Incidentes y postmortems

Un incidente se registra cuando un problema llega a producción o afecta de forma material el uso del sitio. Cada entrada debe contener:

- impacto observable;
- cómo se detectó;
- causa raíz conocida o hipótesis claramente marcada;
- corrección;
- acción preventiva;
- evidencia.

No se inventan incidentes retrospectivamente. Si no existe evidencia suficiente, no se crea una entrada.

## Performance histórica

Las mediciones se registran con fecha y método para que puedan compararse.

Baseline verificable actual:

- presupuesto JavaScript: máximo 220 KiB;
- presupuesto CSS: máximo 86 KiB;
- recursos compartidos: máximo 500 KiB;
- cada documento HTML: máximo 100 KiB;
- sin source maps publicados;
- sin CV descargable hasta contar con una versión aprobada.

Fuente: `tests/performance-assets.test.mjs`.

Las métricas de Lighthouse o Core Web Vitals solo se incorporarán cuando exista una medición reproducible y fechada.

## Accesibilidad

La accesibilidad se documenta como evolución de producto, no como una certificación genérica.

Actualmente la suite protege, entre otros contratos:

- navegación por teclado;
- foco visible y manejo de foco en diálogos;
- landmarks y referencias ARIA;
- nombres accesibles de controles y enlaces;
- SVG decorativos fuera del árbol de accesibilidad;
- contraste de textos y paleta donde está cubierto por tests;
- `prefers-reduced-motion`;
- menú adaptable y modal de proyectos.

Cada nuevo problema relevante debería registrarse como: problema → criterio afectado → solución → prueba preventiva.

## Compatibilidad real

No se afirmará compatibilidad universal sin una matriz de prueba verificable.

Sí existe evidencia de revisión responsive y de problemas detectados desde móvil real. A futuro, cuando se ejecute una matriz formal, este bloque deberá registrar dispositivo/navegador, viewport, fecha, resultado y ticket asociado si hubo defecto.

## Sistema de diseño

La evolución visual se registra cuando cambia una regla del sistema, no por cada ajuste de píxeles.

Decisiones ya relevantes:

- construir una identidad alrededor del “estudio” en vez de una plantilla genérica;
- retirar recursos que se percibían como patrones genéricos de sitios generados por IA;
- centralizar tokens visuales;
- integrar crochet y cocina como recursos coherentes con el mismo sistema en lugar de crear micrositios visuales separados;
- respetar `prefers-reduced-motion` en microinteracciones.

Evidencia: `docs/visual-system.md` y `docs/checkpoints/`.

## Evolución multilenguaje

El soporte de idiomas implica más que traducir strings. La evidencia debe considerar rutas equivalentes, contenido completo, metadatos, `hreflang`, navegación y mantenimiento de paridad.

Estado actual: español, inglés y portugués publicados. Italiano y ruso no se presentan como idiomas publicados del sitio.

Evidencia: `docs/language-strategy.md` y tests de rutas multilenguaje.

## Feedback de usuarios

El feedback se registra cuando genera una decisión. Formato recomendado:

`observación → contexto → interpretación → decisión → ticket/evidencia`

No se atribuyen frases a usuarios si no fueron registradas. Una observación propia durante uso real se identifica como tal.

## Releases significativos

Este no es un changelog de cada commit. Una release narrativa se crea cuando cambia sustancialmente la capacidad del producto.

Hitos reconocibles hasta ahora:

- primera etapa: portfolio como sitio personal;
- identidad del “estudio” y sistema visual propio;
- migración estructural a Astro;
- incorporación de calidad automatizada, accesibilidad y performance como gates;
- publicación multilenguaje;
- incorporación del propio portfolio como caso de estudio vivo.

No se asignan números de versión retrospectivos sin una convención de releases definida.

## Métricas de delivery

Métricas candidatas, siempre calculadas desde evidencia y con fecha:

- tickets completados;
- PRs integrados;
- tiempo ticket → producción cuando pueda medirse de forma consistente;
- ejecuciones de CI exitosas/fallidas;
- regresiones detectadas antes y después del deploy;
- cantidad y tipo de contratos automatizados.

No se congelan aquí cifras dinámicas sin indicar fecha y fuente.

## Regla de mantenimiento

`project-history.md` responde “¿cómo evolucionó el producto?”.

`project-evidence.md` responde “¿cómo puedo comprobarlo?”.

Un hito importante puede aparecer en ambos, pero con distinto propósito. El historial conserva la narrativa y el aprendizaje; este documento conserva estado, evidencia, trade-offs, defectos, métricas y trazabilidad.
