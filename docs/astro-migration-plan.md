# ADR 002: migrar el portfolio a Astro de forma incremental

- Estado: implementada, revisada e integrada en `main`
- Fecha: 22 de agosto de 2026
- Ticket: WEB-086
- Reemplaza: WEB-071 y ADR 001 como arquitectura objetivo

## Decisión

El portfolio se migrará a Astro como generador estático. La identidad visual, el
contenido aprobado, las rutas públicas y las interacciones actuales son contratos
de compatibilidad: la migración cambia la forma de construir y mantener el sitio,
no su apariencia ni su narrativa.

Astro será responsable de layouts, componentes, rutas, metadatos y generación de
archivos estáticos. React se hidratará solamente en el libro de proyectos, donde
existe estado de navegación, historial y foco. El menú, el reveal y el parallax
seguirán usando APIs del navegador porque no necesitan una biblioteca de estado.

## Línea base que debe conservarse

### Rutas públicas

- `/personal/` y `/personal/index.html`: portada.
- `/personal/formacion.html`: recorrido académico.
- `/personal/posts/por-que-hago-tantas-preguntas.html`: primera nota.
- `/personal/posts/cuando-puedas.html`: segunda nota.
- `/personal/favicon.svg`, `/personal/social-preview.png` y
  `/personal/social-preview.svg`: assets públicos ya referenciados.

Astro usará `build.format: 'file'` para conservar las extensiones `.html` y
`base: '/personal'` para que los assets compilados funcionen en GitHub Pages.

### Contenido y estructura

- Los textos, IDs de secciones, anchors, orden narrativo y enlaces existentes.
- Cinco casos de proyecto con sus páginas y la plantilla editorial aprobada.
- Ocho semestres, 45 materias, cuatro proyectos académicos y tres formaciones
  complementarias.
- Metadatos SEO, canonical, Open Graph, Twitter Card y JSON-LD.

### Interacciones

- Menú móvil con estado accesible y cierre mediante Escape.
- Libro de proyectos con enlaces `#project` y `page`, historial del navegador,
  navegación de una página en móvil y pliego en escritorio.
- Diálogo accesible con captura y restauración del foco.
- Parallax que conserva las rotaciones y se pausa cuando no corresponde.
- Reveal al entrar en viewport.
- Mouse, teclado y touch sin depender de hover.
- `prefers-reduced-motion` para desactivar movimiento no esencial.
- Microinteracciones materiales y ambientaciones por fechas ya integradas.

## Secuencia de migración

1. **WEB-086, completado:** fijar esta línea base, documentar decisiones y preparar pruebas
   de paridad.
2. **WEB-087, completado:** incorporar Astro, el layout compartido y las cuatro rutas
   públicas sin cambios visuales.
3. **WEB-088, completado:** separar la portada en componentes mantenibles y extraer datos
   repetidos.
4. **WEB-089, completado:** migrar el libro a una isla de React y modularizar el resto de las
   interacciones.
5. **WEB-090, completado:** publicar `dist`, adaptar CI y pruebas, retirar el legado y hacer
   el corte final después de la revisión de Romina.

Cada ticket debe dejar un sitio compilable. No se aceptan pasos intermedios que
rompan una ruta pública o dependan de que otro ticket incompleto llegue a `main`.

## Pruebas de paridad

Las pruebas construyen el sitio y validan el HTML generado en `dist`. La paridad
se verifica por contratos observables, no por igualdad byte a byte, porque Astro
puede normalizar espacios o atributos sin alterar el resultado.

Como mínimo se validarán:

- presencia y orden de secciones;
- IDs únicos y destinos internos existentes;
- cantidades de contenido estructurado;
- metadatos y rutas canónicas;
- sintaxis de scripts y contratos del libro;
- accesibilidad del menú y del diálogo;
- comportamiento responsive y movimiento reducido;
- producción de todas las rutas y assets en `dist`.

## Estrategia de rollback

El último estado estable previo a la integración es el commit `84a7d9a` de `main`.
La transición se desarrollará en una rama dedicada y no reemplazará la
publicación actual hasta que build, pruebas, GitHub Pages y revisión visual estén
aprobados. Si el corte falla, GitHub Pages puede volver temporalmente al último
workflow que publica los archivos HTML de `main` mientras se corrige la rama de
migración.

## Consecuencias

La migración agrega dependencias y un paso de build, pero elimina la edición
manual de cabeceras y estructuras repetidas, permite componentes mantenibles y
prepara el blog para crecer. El costo se controla evitando hidratar contenido
estático y preservando una salida completamente estática para GitHub Pages.

## Corte de publicación

Antes de integrar la rama, en `Settings > Pages > Build and deployment` se debe
elegir `GitHub Actions` como fuente. A partir de ese momento,
`.github/workflows/deploy-pages.yml` construye y prueba una sola vez. En pull
requests se detiene después de la validación; en `main` carga y publica exactamente
ese mismo `dist`, y después verifica la URL pública. La URL y la base `/personal`
no cambian.
