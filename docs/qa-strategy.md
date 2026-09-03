# Estrategia de QA y Definition of Done

- Ticket: WEB-125
- Estado: vigente
- Alcance: portfolio `romicaubarrere/personal`

## Objetivo

La calidad del portfolio se valida como parte del producto. Una modificación no
está terminada solamente porque compila o se ve bien: debe conservar los
contratos funcionales, editoriales, técnicos y de experiencia que ya existen.

Esta guía describe el proceso actual. No agrega herramientas ni métricas que el
repositorio no use.

## Capas de verificación

| Capa | Qué protege | Evidencia actual |
| --- | --- | --- |
| Build | Rutas estáticas, integración Astro y assets públicos | `npm run build`, `tests/astro-build.test.mjs` |
| Contenido | Textos aprobados, datos verificables, estructura académica y casos | `tests/portfolio.test.mjs` |
| Navegación | Rutas, fragmentos, estados activos y enlaces seguros | `tests/seo-navigation.test.mjs` |
| Accesibilidad | Semántica, teclado, foco, ARIA y movimiento reducido | `tests/portfolio.test.mjs`, `tests/seo-navigation.test.mjs` |
| Responsive e interacción | Menú móvil, libros, modales, tacto y alturas reducidas | regresión completa Playwright en Desktop Chrome + Pixel 7 |
| Compatibilidad de motores | Carga, navegación, diálogo de proyecto y reduced motion entre motores | smoke Playwright en Firefox y WebKit |
| SEO técnico | Títulos, canonical, Open Graph, sitemap, robots y 404 | `tests/seo-navigation.test.mjs` |
| Performance | Presupuestos de transferencia y peso de recursos críticos | `tests/performance-assets.test.mjs` |
| Entrega | Validación previa, artefacto único y smoke test posterior | `.github/workflows/deploy-pages.yml`, `docs/ci-cd.md` |

La regresión completa de interacción se ejecuta en Chromium tanto en escritorio
como en móvil. Firefox y WebKit ejecutan un smoke cross-browser focalizado en
rutas principales, idioma/navegación, apertura y cierre del diálogo de proyecto
y movimiento reducido. Esta división evita convertir diferencias de timing o
gestos sintéticos del runner en falsos defectos, sin renunciar a detectar
regresiones reales de motor.

La matriz usa Desktop Chrome, Desktop Firefox, Desktop Safari vía WebKit, Pixel 7
vía Chromium e iPhone 13 vía WebKit. WebKit mejora la detección de problemas
compatibles con Safari, pero no se presenta como sustituto de una prueba manual
en Safari real o en hardware físico.

Los tests automatizados expresan contratos, pero no sustituyen la revisión en
contexto cuando un cambio afecta diseño, responsive o interacción. Un defecto
observado durante el uso real vuelve al backlog y, cuando es posible, suma una
prueba de regresión.

## Flujo de validación

1. Definir el problema y los criterios de aceptación del ticket.
2. Aislar el cambio en una rama cuando corresponde.
3. Revisar el diff para evitar modificaciones fuera de alcance.
4. Ejecutar `npm test`, que construye la salida de producción y corre la suite.
5. Ejecutar `npm run test:e2e` sobre la matriz Playwright aplicable.
6. Revisar manualmente los comportamientos visuales o interactivos afectados.
7. Abrir el pull request con resumen y evidencia de verificación.
8. Integrar solamente cuando las validaciones pasan.
9. Confirmar la publicación y revisar el cambio en su contexto real.
10. Registrar en el historial solo los hitos que cambian el producto o el proceso.

## Definition of Done

Un ticket se considera terminado cuando cumple todo lo aplicable:

- el alcance y los criterios de aceptación están resueltos;
- no se inventaron datos, métricas, enlaces ni contenido;
- el diseño y los textos aprobados se preservaron salvo cambio explícito;
- las rutas y enlaces modificados resuelven correctamente;
- teclado, foco, semántica y movimiento reducido no regresionan;
- desktop y móvil conservan una navegación utilizable;
- la regresión completa aplicable pasa en Chromium y los recorridos críticos pasan el smoke de Firefox y WebKit;
- se agregó una regresión cuando el cambio corrige un defecto reproducible;
- `npm test` finaliza sin fallas;
- el pull request explica qué cambió y cómo se verificó;
- el cambio está integrado en `main` y la publicación fue confirmada;
- el ticket queda cerrado, no solamente implementado.

Si falta contenido aprobado, acceso o una decisión de producto, el ticket queda
bloqueado o vuelve al backlog: no se completa el vacío por intuición.

## Mantenimiento

Actualizar esta guía cuando cambie una capa de validación, el pipeline, el
contrato de publicación o la Definition of Done. Las cifras variables, como el
número total de pruebas, se consultan en la ejecución actual y no se fijan aquí.
