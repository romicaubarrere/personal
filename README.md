# Portfolio de Romina Caubarrere

Portfolio personal de Romina Caubarrere, Project Manager en Uruguay.

## Estado

El sitio usa Astro como generador estático. La identidad visual, el contenido y
las rutas históricas se conservaron durante la transición WEB-086 a WEB-090.

## Ejecutar localmente

El sitio se genera con Astro y requiere Node.js 22.12 o posterior.

```bash
npm ci
npm run dev
```

Para comprobar la salida estática de producción:

```bash
npm run build
```

Astro genera las cuatro rutas públicas dentro de `dist/` y conserva el formato
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

GitHub Actions ejecuta los tests automáticamente en cada push y pull request. Al
integrar cambios en `main`, el workflow de Pages compila Astro y publica `dist/`.

## Arquitectura y publicación

Astro genera un sitio completamente estático con base pública `/personal`. La
decisión histórica de WEB-071 está en
[`docs/architecture-decision.md`](docs/architecture-decision.md) y el plan que la
reemplaza está en
[`docs/astro-migration-plan.md`](docs/astro-migration-plan.md).

React se reserva para la isla interactiva del libro de proyectos. El contenido
estático y las interacciones pequeñas siguen usando Astro y APIs del navegador.

El sitio se publica solamente en español por ahora. La evaluación y las condiciones para reconsiderar una versión completa en inglés están en [`docs/language-strategy.md`](docs/language-strategy.md).

Los casos del estante comparten el orden y las reglas editoriales de [`docs/project-case-template.md`](docs/project-case-template.md). Los campos sin contenido se omiten y nunca se completan con métricas inventadas.

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
- `.github/workflows/test.yml`: integración continua.
- `.github/workflows/deploy-pages.yml`: build y publicación de `dist/` en GitHub Pages.
- `docs/architecture-decision.md`: decisión de arquitectura y flujo operativo.
- `docs/astro-migration-plan.md`: arquitectura Astro objetivo, contratos de paridad y rollback.
- `docs/language-strategy.md`: decisión de idioma y condiciones de reevaluación.
- `docs/project-case-template.md`: estructura, evidencia y reglas de privacidad de los casos.
- `docs/branching-strategy.md`: estrategia de ramas y flujo de integración.
