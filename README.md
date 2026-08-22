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

```bash
npm test
```

Los tests comprueban:

- Estructura básica de los documentos HTML.
- IDs únicos.
- Navegación interna y destinos existentes.
- Enlace entre la portada y el recorrido académico.
- Integridad de semestres, materias, proyectos y formación complementaria.
- Accesibilidad básica del menú móvil.
- Disponibilidad de las siete secciones en móvil.
- Sintaxis de los bloques JavaScript.

GitHub Actions usa un único pipeline. En cada pull request construye y prueba el
sitio; en `main`, además, publica exactamente el mismo `dist` que pasó las pruebas.
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

## Estructura

- `src/pages/`: rutas públicas generadas por Astro.
- `src/components/`: secciones de la portada y la isla React del libro.
- `src/layouts/`: estructura compartida del sitio y de las notas.
- `src/data/`: contenido estructurado de los casos de proyecto.
- `src/styles/`: estilos de portada, formación y notas.
- `public/`: assets servidos sin transformación.
- `astro.config.mjs`: salida estática, base `/personal` y rutas con formato `.html`.
- `tests/portfolio.test.mjs`: validaciones automáticas sin dependencias externas.
- `tests/astro-build.test.mjs`: paridad y rutas sobre la salida compilada.
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
