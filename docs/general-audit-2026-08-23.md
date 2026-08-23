# Auditoría general del portfolio

- Fecha de corte: 23 de agosto de 2026
- Línea base auditada: `main` en `d354588a1c2a66c3edf92ac1f0b60fb76e8cc563`
- Producción: [romicaubarrere.github.io/personal](https://romicaubarrere.github.io/personal/)
- Repositorio: [romicaubarrere/personal](https://github.com/romicaubarrere/personal)
- Alcance: producto, contenido, experiencia, sistema visual, accesibilidad, responsive, idiomas, SEO, performance, arquitectura, QA, DevOps, privacidad, analítica, documentación y gestión

## Objetivo y método

Esta auditoría fija una fotografía comprobable del proyecto. No reemplaza el historial narrativo, Trello ni Git: los conecta. El estado se obtuvo de la rama `main`, la salida compilada, la suite automatizada, los workflows, la documentación vigente, los PR abiertos y el tablero de Trello. También se contrastó la implementación original `romi-estudio_1.html` con la arquitectura Astro actual.

La clasificación utilizada es:

- **Sólido:** implementado, documentado y protegido por evidencia suficiente.
- **Parcial:** existe una base funcional, pero falta alcance, paridad, decisión o verificación.
- **Pendiente:** no está implementado o depende de contenido, material o una decisión externa.
- **Riesgo:** funciona hoy, pero el margen o la evidencia disponible no alcanza para considerarlo estable a futuro.

Esta revisión no certifica conformidad universal con WCAG, compatibilidad con todos los navegadores ni resultados de negocio que todavía no fueron medidos.

## Resumen ejecutivo

El portfolio dejó de ser un único HTML experimental y hoy es un producto estático mantenible, publicado y con un proceso de entrega fuerte. La identidad del estudio sobrevivió a la migración: conserva papel, corcho, ladrillo, libros, lana, plantas, cocina y pequeñas imperfecciones, pero ahora esos recursos tienen tokens, componentes, reglas anti-IA y contratos de accesibilidad.

La base técnica es sólida: Astro genera 23 documentos HTML públicos, React se limita al libro interactivo, `main` tiene 235 commits en el clon auditado, la suite Node pasa 141/141 y CI prueba Chromium de escritorio y móvil antes de integrar o publicar. SEO, rutas, enlaces, semántica, foco, movimiento reducido, fechas especiales y presupuestos de transferencia tienen regresiones automatizadas.

El mayor riesgo técnico inmediato es el margen de CSS: 88.029 bytes sobre un máximo de 88.064, apenas 35 bytes disponibles. Los principales pendientes de producto no son fallas ocultas, sino decisiones o materiales conocidos: CV, paridad completa EN/PT, casos profesionales publicables, fotografías, tratamiento editorial de charlas incompletas, proveedor de analítica, dominio definitivo y material audiovisual de habITar.

## Línea base cuantitativa

| Indicador | Estado al corte | Evidencia |
| --- | ---: | --- |
| Commits en el historial clonado | 235 | `git rev-list --count HEAD` |
| Rutas HTML compiladas | 23 | build Astro |
| Pruebas Node | 141/141 | `node --test` |
| Suites E2E | 4 archivos | `e2e/` |
| Proyectos Playwright | Chromium desktop y Pixel 7 | `playwright.config.ts` |
| HTML compilado | 334.424 bytes | `dist/` |
| JavaScript compilado | 213.531 de 225.280 bytes | `tests/performance-assets.test.mjs` |
| CSS compilado | 88.029 de 88.064 bytes | `tests/performance-assets.test.mjs` |
| Asset social | PNG 1200 × 630, 37.276 bytes | build y test de performance |
| Idiomas publicados | ES, EN y PT | rutas, `hreflang` y metadatos |
| Workflows | deploy normal y rollback | `.github/workflows/` |

Las cifras son una fotografía fechada. No deben copiarse como métricas permanentes sin volver a calcularlas.

## Estado por dimensión

| Dimensión | Estado | Evaluación |
| --- | --- | --- |
| Producto y posicionamiento | Sólido | El sitio muestra la forma de pensar, gestionar, diseñar, probar y operar, no sólo una lista de cargos. |
| Contenido profesional | Parcial | habITar, Física Mente Posible y el caso vivo tienen evidencia; faltan casos eagerworks aprobados y material final de habITar. |
| Identidad visual | Sólido | Sistema artesanal, botánico y personal documentado; guardrails explícitos contra patrones genéricos de sitios generados por IA. |
| UX e interacción | Sólido | Navegación, libro, deep links, historial, modal, tacto, teclado y microinteracciones tienen contratos. |
| Accesibilidad | Sólido con alcance acotado | Hay semántica, foco, teclado, ARIA, contraste cubierto, reducción de movimiento y avisos de cambio de contexto; no existe certificación WCAG completa. |
| Responsive | Sólido en la matriz actual | Cobertura de 320 a 721 px, alturas reducidas, rotación y desktop/móvil Chromium. Falta una matriz Safari/Firefox formal. |
| Idiomas | Parcial | Las rutas internas y notas existen en ES/EN/PT; la home EN/PT sigue reducida frente a ES y el ticket de paridad está activo. |
| SEO técnico | Sólido | Canonical, `hreflang`, Open Graph, X, sitemap, RSS, datos estructurados, 404 y enlaces internos están cubiertos. El `robots.txt` raíz no es controlable desde Project Pages y está documentado. |
| Performance | Riesgo | Todos los presupuestos pasan, pero CSS está al 99,96 % del límite. No hay todavía baseline reproducible de Lighthouse o Core Web Vitals reales. |
| Arquitectura | Sólido | Astro estático, componentes de portada e isla React acotada. La decisión anterior permanece como ADR histórico reemplazado. |
| QA | Sólido | Build, 141 contratos Node, E2E, responsive, fechas, accesibilidad, SEO, supply chain y guardrails visuales. |
| CI/CD | Sólido | Artefacto único probado, permisos mínimos, concurrencia, evidencia de fallos, smoke test y rollback reconstruido desde un ref. |
| Privacidad | Sólido en el estado actual | Política ES/EN/PT, analítica sin terceros, sin formularios ni almacenamiento de datos personales. |
| Analítica | Parcial | Eventos locales y resultados manuales definidos; el spike seleccionó Umami Cloud Hobby por ser gratuito y admitir eventos personalizados. Falta crear el sitio y verificar la integración. |
| Documentación | Sólido con deriva puntual | La cobertura es amplia, pero se detectaron un enlace roto en QA y un backlog local desactualizado. |
| Operación y mantenimiento | Sólido | Cadencia mensual, disparadores extraordinarios, Definition of Done y trazabilidad documentadas. |

## Producto, contenido y evidencia

### Fortalezas

- La portada tiene un recorrido claro: posicionamiento, sobre Romina, proyectos, forma de trabajo, comunidad, lecturas y contacto.
- El portfolio se presenta como un caso vivo y abre repositorio, historial y documentación.
- Los casos usan una estructura común y omiten campos vacíos antes que inventar resultados.
- Las métricas profesionales se publican únicamente cuando tienen fuente verificable.
- Comunidades, eventos organizados y participaciones como oradora están diferenciados.
- La página de lecturas usa un export estático y explica su procedencia; no depende de scraping en runtime.
- Las notas tienen traducción, metadatos, RSS español y navegación equivalente.

### Pendientes conocidos

- **WEB-085 / WEB-051:** integrar el CV aprobado y habilitar la descarga y su evento.
- **WEB-012 / WEB-016:** completar al menos un caso profesional publicable de eagerworks, con privacidad y aprobación.
- **WEB-074:** terminar el relato y agregar únicamente video/capturas aprobados y anonimizados de habITar.
- **WEB-052:** seleccionar fotografías, definir recortes, textos alternativos y permisos.
- **WEB-009:** decidir si las nueve charlas con campos por confirmar siguen visibles.

No corresponde completar esos vacíos por inferencia.

## Identidad visual y evolución desde el HTML original

La comparación con `romi-estudio_1.html` confirma continuidad, no reemplazo de identidad:

- se conservaron los tokens base de papel, crema, tinta, verde, ladrillo, dorado y corcho;
- se conservaron Fraunces, DM Sans y Caveat con roles explícitos;
- sobrevivieron el estudio, los libros, papeles, pines, corcho, ladrillo, lana y rotaciones;
- la portada original tenía seis grandes secciones; la actual mantiene ese recorrido y suma el caso vivo y la forma de trabajo como bloques propios;
- la implementación monolítica se dividió en páginas, componentes, datos, estilos y contratos sin convertir la interfaz en una plantilla genérica;
- se retiraron numeración decorativa, barras de acento genéricas y composiciones que no podían justificar su pertenencia al estudio;
- cocina y crochet se integraron como capas del mismo sistema, no como estéticas competidoras.

### Riesgos visuales a vigilar

- No sumar una cuarta tipografía, gradientes abstractos, tarjetas idénticas o métricas gigantes sin evidencia.
- No reducir sombras o rotaciones globalmente: varias comunican materialidad y profundidad.
- No usar “parece IA” como único criterio; cada observación debe describir el patrón y su impacto.
- Cualquier optimización de CSS debe preservar materiales, responsive, foco y reducción de movimiento.

## Accesibilidad y responsive

### Cobertura existente

- skip links, landmarks y jerarquía de encabezados;
- IDs y referencias ARIA válidos;
- nombres accesibles en controles y enlaces;
- aviso en enlaces que abren otra pestaña;
- menú móvil con `aria-expanded`, cierre y foco;
- modal con diálogo, `inert`, restauración de foco, Escape, backdrop y controles visibles;
- SVG decorativos ocultos a tecnologías asistivas;
- foco visible y contraste AA cubierto por contratos;
- `prefers-reduced-motion` para parallax y microinteracciones;
- matriz responsive de 320, 375, 390, 430, 719, 720 y 721 px, además de alturas 469, 470 y 471 px;
- conservación de estado al rotar portrait/landscape.

### Límites de la evidencia

- Playwright automatiza Chromium desktop y móvil, no WebKit ni Firefox.
- No existe una auditoría manual completa con lector de pantalla registrada por combinación de sistema y navegador.
- El ticket WEB-063 debe conservar la revisión final real en Chrome, Safari y Firefox antes del cierre definitivo.

## SEO, descubrimiento e idiomas

### Estado sólido

- títulos y descripciones específicos;
- canonical únicos;
- Open Graph y X con asset 1200 × 630;
- clusters `hreflang` recíprocos ES/EN/PT;
- sitemap sin 404;
- 404 `noindex,follow` localizada por ruta;
- datos estructurados para identidad, artículos y breadcrumbs;
- enlaces internos y fragmentos validados sobre `dist`;
- RSS español con fechas completas y orden descendente.

### Límites y trabajo activo

- GitHub Project Pages publica bajo `/personal/`; el repositorio no controla `/robots.txt` en la raíz del host.
- La URL canónica propia del RSS se integró durante la auditoría mediante PR #166.
- EN/PT tienen rutas internas, pero sus portadas todavía no alcanzan la estructura completa de ES.

## Performance

### Presupuestos vigentes

| Recurso | Uso | Límite | Margen |
| --- | ---: | ---: | ---: |
| JavaScript | 213.531 B | 225.280 B | 11.749 B |
| CSS | 88.029 B | 88.064 B | 35 B |
| Mayor HTML (`index.html`) | 48.411 B | 102.400 B | 53.989 B |
| Recursos compartidos | 346.194 B | 512.000 B | 165.806 B |

### Hallazgo P1

El CSS pasa por sólo 35 bytes. Es un riesgo de entrega, no una falla actual. Se registró [PERF · Recuperar margen del presupuesto CSS](https://trello.com/c/7NOD5rsB). El criterio es optimizar duplicación o reglas no utilizadas con evidencia y preservar el sistema visual; aumentar el límite para ocultar el problema no es una solución.

### Pendiente de medición

No hay un baseline reproducible de Lighthouse, LCP, INP o CLS en producción. No se atribuyen valores ni calificaciones sin una ejecución fechada y comparable.

## Arquitectura y mantenibilidad

### Estado

- Astro 7 genera salida estática con base `/personal` y formato histórico `.html`.
- React queda reservado a `ProjectBookcase` y se hidrata con `client:idle`.
- Las interacciones pequeñas usan JavaScript del navegador.
- La portada está separada en componentes y los casos usan datos estructurados.
- Las rutas públicas se agrupan por idioma y reutilizan layouts.
- Node 22.19.0 y npm 11.9.0 están fijados junto al lockfile.

### Deuda consciente

- La home localizada usa una implementación reducida mientras el flujo de paridad está activo.
- El CSS necesita margen operativo.
- Hay información dinámica duplicada entre Trello y `docs/backlog.md`; este último debe funcionar como índice estable, no como espejo manual exhaustivo.

## QA y pruebas

La suite automatizada es extensa y expresa decisiones de producto, no sólo unidades de código. Cubre:

- build y rutas Astro;
- contenido, datos verificables y ausencia de placeholders;
- interacción de libro y modal;
- deep links e historial;
- responsive y fechas límite;
- teclado, foco, ARIA y movimiento reducido;
- enlaces, canonical, `hreflang`, datos estructurados, RSS, sitemap y 404;
- presupuestos de transferencia;
- privacidad y contrato de analítica;
- supply chain, Dependabot y trazabilidad;
- guardrails visuales anti-IA.

Hallazgo documental corregido en esta auditoría: `docs/qa-strategy.md` referenciaba `tests/performance.test.mjs`; el archivo real es `tests/performance-assets.test.mjs`.

### Lo que los tests no sustituyen

- revisión visual de una pieza nueva en contexto;
- evaluación editorial y de privacidad por Romina;
- prueba manual formal en Safari y Firefox;
- aprobación de fotografías, CV, capturas o métricas;
- observación de resultados reales del portfolio.

## DevOps, seguridad operativa y supply chain

### Fortalezas

- un único pipeline construye, prueba y publica el mismo `dist`;
- `Validate build` bloquea la integración si falla build, Node o Playwright;
- desktop y móvil se prueban en CI;
- reportes, trazas y capturas se guardan si E2E falla;
- permisos de Pages e ID token se limitan al deploy;
- la concurrencia cancela ejecuciones obsoletas y serializa escritura en producción;
- el smoke test comprueba el SHA publicado;
- rollback acepta un ref explícito, reconstruye, prueba y verifica antes de servirlo;
- las acciones externas están fijadas a commits completos;
- Dependabot revisa npm y GitHub Actions con agrupación y control humano.

### Límites

- GitHub Pages no ofrece la misma configuración de headers que un hosting controlado; cualquier requisito futuro de CSP o headers avanzados puede reabrir WEB-072.
- El dominio definitivo sigue siendo una decisión pendiente, aunque la URL de GitHub Pages ya funciona.
- No se declara una auditoría actual de vulnerabilidades de dependencias sin una fuente fechada; el control vigente es lockfile, CI y Dependabot.

## Privacidad y analítica

### Estado actual

- La política está publicada en ES, EN y PT.
- No hay cookies de analítica, terceros de medición ni almacenamiento local para tracking.
- Los eventos del navegador contienen nombre estable, path sin query/fragmento y tipo semántico; excluyen texto, destinos, email y contenido libre.
- Contactos, propuestas e invitaciones se registran manualmente y no se infieren de clics.

### Decisión pendiente

Plausible Cloud quedó descartado porque no ofrece un plan gratuito. Cloudflare Web Analytics también quedó descartado para WEB-062 porque, aunque es gratuito y orientado a privacidad, no admite eventos personalizados. El spike seleccionó el plan Hobby gratuito de Umami Cloud, que admite eventos y no usa cookies ni recopila datos personales. WEB-062 sigue parcial hasta crear el sitio en la región europea, confirmar la retención y verificar los eventos en producción.

## Documentación y trazabilidad

### Fortalezas

La documentación separa correctamente historia, evidencia, arquitectura, sistema visual, QA, CI/CD, rollback, supply chain, idiomas, analytics, fechas especiales, mantenimiento y plantillas de casos.

### Deriva detectada y corregida

- referencia inexistente a `tests/performance.test.mjs`;
- `docs/backlog.md` decía que el CV esperaba contenido, mientras Trello ya registra un PDF aprobado bloqueado por integración;
- el backlog local se presentaba como si fuera completo aunque Trello contiene el estado operativo real.

La regla resultante es: Trello conserva el estado dinámico; `docs/backlog.md` conserva un índice estable, decisiones y enlaces. Esta auditoría fija una fotografía fechada.

## Estado operativo de Trello y GitHub

Al iniciar la auditoría:

- `To-do`: 0 tarjetas;
- `Doing`: 5 tarjetas antes de registrar esta auditoría;
- Backlog: 9 tarjetas antes de registrar el riesgo de CSS;
- PR abiertos: #164 para el proceso de producto de habITar y #166 para el RSS canónico.

### En curso o bloqueado

- WEB-051 y WEB-085: CV y contacto;
- paridad completa EN/PT;
- WEB-062: proveedor de analítica;
- RSS canónico: integrado durante la auditoría mediante PR #166;
- WEB-074: PR #164 y material visual pendiente.

### Backlog dependiente de decisiones o material

- WEB-012 y WEB-016: casos profesionales;
- WEB-052: fotografías;
- WEB-063: revisión final cross-browser;
- WEB-072: dominio y cierre de publicación;
- WEB-065: back office de métricas;
- WEB-083: buzón de mejoras;
- WEB-009: tratamiento editorial de charlas incompletas;
- PERF: margen CSS.

## Hallazgos priorizados

| Prioridad | Hallazgo | Acción |
| --- | --- | --- |
| P0 | CV aprobado todavía fuera de `main` | Terminar WEB-085 y cerrar WEB-051 después de verificar descarga. |
| P0 | Casos profesionales y fotografías dependen de aprobación/material | Mantener bloqueados; no inventar ni publicar datos privados. |
| P1 | CSS con 35 bytes de margen | Optimizar sin aumentar el límite ni cambiar la estética. |
| P1 | Home EN/PT sin paridad completa | Continuar el flujo ya activo y agregar contrato de secciones. |
| P1 | Compatibilidad formal sólo automatizada en Chromium | Ejecutar WEB-063 en Chrome, Safari y Firefox al cierre. |
| P1 | habITar necesita material visual aprobado | Integrar primero el relato seguro; añadir multimedia después de aprobación. |
| P2 | Integración gratuita de analítica pendiente | Crear el sitio en Umami Cloud Hobby, confirmar retención y verificar eventos; no contratar planes pagos. |
| P2 | Documentación dinámica se había desalineado de Trello | Mantener índice estable y auditorías fechadas. |
| P2 | Sin baseline de Web Vitals en producción | Medir sólo cuando exista un método reproducible. |

## Roadmap recomendado

1. Terminar e integrar el PR #164 cuando sus checks y revisiones estén completos.
2. Integrar el CV aprobado y cerrar WEB-085/WEB-051.
3. Recuperar margen de CSS antes de sumar nuevas piezas visuales grandes.
4. Completar la paridad EN/PT sin degradar la home ES.
5. Resolver decisiones editoriales y materiales: fotografías, charlas y evidencia de habITar.
6. Ejecutar la revisión final cross-browser y de accesibilidad manual.
7. Hacer el spike de analítica gratis o muy económica y decidir proveedor/retención.
8. Reconciliar WEB-072 con el estado real de GitHub Pages y decidir dominio definitivo.
9. Abordar back office y buzón sólo después de resolver sus dependencias y privacidad.

## Criterio de cierre de esta auditoría

La auditoría queda cerrada cuando:

- este documento está en `main`;
- README, QA y backlog local enlazan el estado correcto;
- `project-history.md` registra el hito sin duplicar fixes menores;
- los hallazgos nuevos tienen ticket y no duplican flujos activos;
- Astro, Node, Playwright desktop/móvil y CI están verdes.

## Regla de mantenimiento

Crear una nueva auditoría fechada cuando cambie significativamente la arquitectura, el modelo de publicación, la estrategia de idiomas, el sistema visual, la calidad o el conjunto de riesgos. Las correcciones menores siguen en Git. Los estados de Trello no deben copiarse continuamente a Markdown: sólo se fija una fotografía cuando ayuda a explicar una decisión o una revisión integral.
