# Portfolio de Romina Caubarrere

Portfolio personal de Romina Caubarrere, Project Manager en Uruguay.

## Estado

El sitio está en desarrollo. La identidad visual y las interacciones principales están implementadas, pero todavía existen textos y recursos placeholder que serán reemplazados antes de la publicación.

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

`main` contiene directamente los archivos que publica GitHub Pages. La decisión de mantener una arquitectura estática, sus costos y los umbrales para reconsiderar Astro están documentados en [`docs/architecture-decision.md`](docs/architecture-decision.md).

No se incorpora React para contenido estático. Las interacciones se resuelven primero con APIs del navegador y deben conservar navegación, accesibilidad y responsive.

## Estructura

- `index.html`: portada y secciones principales del portfolio.
- `formacion.html`: recorrido UTEC, proyectos académicos y formación complementaria.
- `tests/portfolio.test.mjs`: validaciones automáticas sin dependencias externas.
- `.github/workflows/test.yml`: integración continua.
- `docs/architecture-decision.md`: decisión de arquitectura y flujo operativo.
- `docs/branching-strategy.md`: estrategia de ramas y flujo de integración.
