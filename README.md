# Portfolio de Romina Caubarrere

Portfolio personal de Romina Caubarrere, Project Manager en Uruguay.

## Estado

El sitio está en desarrollo. La identidad visual y las interacciones principales están implementadas, pero todavía existen textos y recursos placeholder que serán reemplazados antes de la publicación.

La migración incremental a Astro fue aprobada el 22 de agosto de 2026. Mientras
se completa WEB-086 a WEB-090, `main` continúa siendo la versión HTML estable.

## Ejecutar localmente

El sitio usa HTML, CSS y JavaScript nativos. No necesita instalación de dependencias ni un proceso de build.

```bash
npm run serve
```

Luego se puede abrir `http://localhost:4173`.

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

GitHub Actions ejecuta los tests automáticamente en cada push y pull request.

## Arquitectura y publicación

`main` contiene por ahora los archivos que publica GitHub Pages. La decisión
histórica de WEB-071 está en
[`docs/architecture-decision.md`](docs/architecture-decision.md) y el plan que la
reemplaza está en
[`docs/astro-migration-plan.md`](docs/astro-migration-plan.md).

No se incorpora React para contenido estático. Las interacciones se resuelven primero con APIs del navegador y deben conservar navegación, accesibilidad y responsive.

El sitio se publica solamente en español por ahora. La evaluación y las condiciones para reconsiderar una versión completa en inglés están en [`docs/language-strategy.md`](docs/language-strategy.md).

Los casos del estante comparten el orden y las reglas editoriales de [`docs/project-case-template.md`](docs/project-case-template.md). Los campos sin contenido se omiten y nunca se completan con métricas inventadas.

## Estructura

- `index.html`: portada y secciones principales del portfolio.
- `formacion.html`: recorrido UTEC, proyectos académicos y formación complementaria.
- `tests/portfolio.test.mjs`: validaciones automáticas sin dependencias externas.
- `.github/workflows/test.yml`: integración continua.
- `docs/architecture-decision.md`: decisión de arquitectura y flujo operativo.
- `docs/astro-migration-plan.md`: arquitectura Astro objetivo, contratos de paridad y rollback.
- `docs/language-strategy.md`: decisión de idioma y condiciones de reevaluación.
- `docs/project-case-template.md`: estructura, evidencia y reglas de privacidad de los casos.
- `docs/branching-strategy.md`: estrategia de ramas y flujo de integración.
