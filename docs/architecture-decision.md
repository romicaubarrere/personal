# ADR 001: mantener una arquitectura web estática

- Estado: reemplazada por WEB-086
- Fecha: 22 de agosto de 2026
- Ticket: WEB-071

> Esta decisión conserva el contexto que llevó a mantener HTML nativo en WEB-071,
> pero dejó de ser la arquitectura objetivo cuando Romina confirmó la migración a
> Astro el 22 de agosto de 2026. El plan vigente está documentado en
> [`astro-migration-plan.md`](astro-migration-plan.md).

## Contexto

El portfolio se publica como un sitio estático en GitHub Pages. Hoy contiene una portada, una página de formación, una nota y un conjunto acotado de interacciones en JavaScript: menú móvil, modal de proyectos, revelado de secciones y parallax.

La decisión pendiente era mantener HTML, CSS y JavaScript sin proceso de build o migrar a Astro con islas de React.

## Decisión

Se mantiene la arquitectura actual de HTML, CSS y JavaScript nativos. No se incorpora Astro ni React en esta etapa.

Esta alternativa responde mejor al estado real del sitio:

- GitHub Pages puede servir todos los archivos directamente, sin artefactos compilados ni configuración adicional.
- El repositorio no tiene dependencias de producción ni necesita una instalación para previsualizarse.
- Las interacciones existentes son locales y pequeñas. No requieren estado compartido, hidratación ni una biblioteca de componentes.
- El contenido todavía está creciendo, pero el volumen actual no justifica una capa de plantillas y build.
- Conservar el DOM y los estilos evita una migración que podría introducir regresiones en el estante, el modal accesible, el parallax y la identidad visual.

## Alternativas evaluadas

| Alternativa | Ventajas | Costos y riesgos actuales |
| --- | --- | --- |
| HTML, CSS y JavaScript nativos | Deploy directo, cero dependencias de producción, preview inmediato y menor superficie de fallas | Repetición de cabeceras y estilos entre páginas; la edición manual será menos cómoda si el blog crece mucho |
| Astro sin React | Componentes y layouts reutilizables, colecciones de contenido y generación estática | Agrega Node, dependencias, build, configuración de rutas base y una migración completa sin beneficio inmediato para tres páginas |
| Astro con islas de React | Facilita interfaces con estado complejo y componentes interactivos aislados | React no resuelve una necesidad actual; agrega JavaScript, hidratación y mantenimiento innecesarios |

## Organización acordada

- `index.html`: portada, secciones principales, estilos e interacciones propias de la portada.
- `formacion.html`: recorrido académico completo.
- `posts/`: notas publicadas como páginas HTML independientes.
- `tests/portfolio.test.mjs`: verificaciones de estructura, contenido, accesibilidad y sintaxis sin dependencias externas.
- `docs/`: decisiones operativas y de arquitectura.
- `.github/workflows/test.yml`: validación automática para pushes y pull requests.

Las páginas nuevas deben usar HTML semántico, conservar el enlace para saltar al contenido y cargar solo el JavaScript que necesiten. La interactividad se implementa primero con APIs del navegador. No se agrega React a una sección estática.

## Flujo operativo

1. Ejecutar `npm run serve` para servir el repositorio en `http://localhost:4173`.
2. Ejecutar `npm test` antes de abrir o actualizar un pull request.
3. Integrar a `main` mediante GitHub Flow y squash merge.
4. Publicar `main` directamente con GitHub Pages. No existe un directorio de build.

## Consecuencias

La publicación de WEB-072 no queda bloqueada por una migración ni por un pipeline nuevo. El costo es aceptar algo de repetición entre páginas mientras el sitio siga siendo pequeño.

La decisión debe revisarse si ocurre al menos una de estas condiciones:

- el blog crece hasta volver frecuente o riesgosa la edición manual de metadatos y layouts;
- aparecen cinco o más páginas con estructuras repetidas que deban mantenerse sincronizadas;
- se incorpora contenido proveniente de una fuente estructurada que necesite generación automática;
- las interacciones requieren estado compartido entre páginas o componentes reutilizables complejos.

Si se alcanza uno de esos umbrales, Astro debe evaluarse primero como generador estático sin React. Las islas se agregarán únicamente donde una interacción concreta justifique su costo.

## Verificación

La decisión conserva los comandos y el workflow existentes. Los tests automatizados comprueban tanto el sitio como la presencia y coherencia de este ADR, para que un cambio de arquitectura futuro actualice también la documentación y el flujo operativo.

## Restricciones de identidad que sobreviven a la arquitectura

Aunque este ADR fue reemplazado por la migración a Astro, una decisión de producto sigue vigente: cambiar de arquitectura no habilita a perder la identidad visual del portfolio. Los componentes nuevos deben respetar el [sistema visual](./visual-system.md) y los [guardrails contra patrones visuales genéricos](./anti-ai-visual-guardrails.md).

WEB-095 convierte parte de ese criterio en pruebas automatizadas. La arquitectura puede evolucionar; la exigencia de que cada pieza pertenezca al lenguaje de “El estudio de Romi” no cambia por usar HTML, Astro o una isla de React.
