# Leyendo ahora

- Ticket: WEB-080
- Fuente vigente: manual
- Última actualización: 22 de agosto de 2026

El libro actual vive en `src/data/reading.ts`. Para actualizarlo se cambian el
título, la autora y la fecha en un único objeto; la portada no consulta servicios
externos durante el build ni durante una visita.

## Decisión sobre StoryGraph

StoryGraph no ofrece hoy una API pública estable para esta integración: su API
oficial continúa anunciada a largo plazo. No se usa scraping, no se evita la
autenticación y no se consulta StoryGraph desde el navegador. La fuente manual
es deliberadamente el respaldo estable hasta que exista una API oficial apta
para este caso.

Esta decisión evita que el contenido desaparezca por cambios de HTML, límites
de acceso o fallos de un tercero. Si StoryGraph publica una API adecuada, la
integración se evaluará en otro ticket sin retirar primero la fuente manual.
