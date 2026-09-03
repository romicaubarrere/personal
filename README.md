# Portfolio de Romina Caubarrere

Portfolio personal de Romina Caubarrere, Project Manager en Uruguay.

## Estado

El sitio usa Astro como generador estático. La identidad visual, el contenido y
las rutas históricas se conservaron durante la transición WEB-086 a WEB-090.

## Ejecutar localmente

El sitio se genera con Astro y fija Node.js 22.19.0 y npm 11.9.0 para reproducir el entorno.

```bash
npm ci
npm run dev
```

Para comprobar la salida estática de producción:

```bash
npm run build
```

Astro genera las rutas públicas dentro de `dist/` y conserva el formato
`.html` usado por GitHub Pages.

Para revisar exactamente la salida de producción:

```bash
npm run preview
```

## Tests

El chequeo principal construye la salida de producción y ejecuta los contratos
Node sobre el código y los archivos compilados:

```bash
npm test
```

Las pruebas de interacción real se ejecutan con Playwright en Chromium, Firefox
y WebKit. La matriz incluye escritorio en los tres motores, Pixel 7 en Chromium
y iPhone 13 en WebKit:

```bash
npx playwright install chromium firefox webkit
npm run test:e2e
```

Entre ambas capas se comprueban:

- generación de rutas y recursos con Astro;
- contenido aprobado, datos verificables y guardrails editoriales;
- navegación, enlaces, idiomas, SEO técnico y datos estructurados;
- semántica, teclado, foco, ARIA y movimiento reducido;
- menú, libro de proyectos, modales y responsive en desktop y móvil;
- compatibilidad automatizada entre Chromium, Firefox y WebKit;
- presupuestos de transferencia, dependencias y cadena de suministro;
- workflows, artefacto publicado, rollback y smoke test de producción.

La cobertura y la Definition of Done completas se mantienen en
[`docs/qa-strategy.md`](docs/qa-strategy.md).

GitHub Actions usa un único pipeline. En cada pull request construye y prueba el
sitio con Node y Playwright; en `main`, además, publica exactamente el mismo `dist`
que pasó las pruebas. Después del deploy, el smoke test recorre todas las URLs del
sitemap y valida respuesta, idioma, canonical y SHA publicado para cada página.
Los pushes más nuevos cancelan ejecuciones obsoletas para reducir ruido y evitar
despliegues innecesarios. El contrato completo está en
[`docs/ci-cd.md`](docs/ci-cd.md).

## Arquitectura y publicación

Astro genera un sitio completamente estático con base pública `/personal`. La
decisión histórica de WEB-071 está en
[`docs/architecture-decision.md`](docs/architecture-decision.md) y el plan que la
reemplaza está en
[`docs/astro-migration-plan.md`](docs/astro-migration-plan.md).

React se reserva para la isla interactiva del libro de proyectos. El contenido
estático y las interacciones pequeñas siguen usando Astro y APIs del navegador.

El sitio se publica en español, inglés y portugués. La estrategia y las reglas para no exagerar niveles están en [`docs/language-strategy.md`](docs/language-strategy.md).

Los casos del estante comparten el orden y las reglas editoriales de [`docs/project-case-template.md`](docs/project-case-template.md). Los campos sin contenido se omiten y nunca se completan con métricas inventadas.

La separación entre comunidades, eventos organizados y participaciones como oradora está documentada en [`docs/community-events.md`](docs/community-events.md).

La identidad visual, los tokens compartidos y la regla que evita numeración decorativa están documentados en [`docs/visual-system.md`](docs/visual-system.md).

La estrategia de calidad, sus capas de verificación y la Definition of Done están documentadas en [`docs/qa-strategy.md`](docs/qa-strategy.md).

La fotografía integral de producto, diseño, contenido, calidad, operación, riesgos y pendientes está en [`docs/general-audit-2026-08-23.md`](docs/general-audit-2026-08-23.md).

La evolución narrativa, las decisiones y los aprendizajes del proyecto se mantienen en [`docs/project-history.md`](docs/project-history.md). La misma documentación está organizada como recorrido navegable en [Portfolio · Confluence](https://personal-romi.atlassian.net/wiki/spaces/PM/pages/1114277/Portfolio).

El mantenimiento editorial y técnico, su cadencia y los disparadores de revisión extraordinaria están documentados en [`docs/maintenance-plan.md`](docs/maintenance-plan.md).

## Estructura

- `src/pages/`: rutas públicas generadas por Astro.
- `src/components/`: secciones de la portada y la isla React del libro.
- `src/layouts/`: estructura compartida del sitio y de las notas.
- `src/data/`: contenido estructurado de los casos de proyecto.
- `src/styles/`: estilos de portada, formación y notas.
- `public/`: assets servidos sin transformación.
- `astro.config.mjs`: salida estática, base `/personal` y rutas con formato `.html`.
- `tests/`: contratos Node sobre fuentes, configuración y salida compilada.
- `e2e/`: recorridos Playwright para desktop, móvil, responsive y fechas especiales.
- `scripts/verify-production.mjs`: verificación posterior al deploy sobre las rutas del sitemap.
- `.github/workflows/deploy-pages.yml`: CI unificado, artefacto probado, publicación y verificación de GitHub Pages.
- `docs/architecture-decision.md`: decisión de arquitectura y flujo operativo.
- `docs/astro-migration-plan.md`: arquitectura Astro objetivo, contratos de paridad y rollback.
- `docs/language-strategy.md`: decisión de idioma y condiciones de reevaluación.
- `docs/project-case-template.md`: estructura, evidencia y reglas de privacidad de los casos.
- `docs/community-events.md`: formato visual y reglas de evidencia para comunidades, eventos y charlas.
- `docs/visual-system.md`: tokens, materiales, estados y reglas de identidad visual.
- `docs/branching-strategy.md`: estrategia de ramas y flujo de integración.
- `docs/special-dates.md`: calendario y URLs de simulación para revisar celebraciones fuera de fecha.
- `docs/analytics-events.md`: contrato neutral de eventos y límites de privacidad para una integración futura.
- `docs/ci-cd.md`: orden, permisos y garantías del pipeline de entrega.
- `docs/qa-strategy.md`: estrategia de QA, evidencia y Definition of Done.
- `docs/supply-chain.md`: entorno reproducible y controles de cadena de suministro.
- `docs/dependency-updates.md`: automatización y política de revisión de actualizaciones.
- `docs/reading-now.md`: fuente manual y decisión de integración para “Leyendo ahora”.
- `docs/delivery-traceability.md`: relación entre ticket, rama, PR, commit y despliegue.
- `docs/maintenance-plan.md`: frecuencia, responsables, checklist y flujo para mantener el portfolio vigente.
- `docs/general-audit-2026-08-23.md`: auditoría integral, evidencia, riesgos y roadmap al 23 de agosto de 2026.
- `docs/project-history.md`: historial vivo de producto, diseño, gestión, QA, DevOps, arquitectura y aprendizajes.
