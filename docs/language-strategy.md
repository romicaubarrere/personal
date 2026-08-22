# Decisión de idioma del portfolio

- Estado: no incorporar inglés en la versión actual
- Fecha: 22 de agosto de 2026
- Ticket: WEB-054

## Decisión

El portfolio se mantiene solamente en español durante la etapa actual. No se agrega una versión en inglés, un selector de idioma ni metadatos `hreflang` todavía.

El público definido en WEB-001 incluye oportunidades internacionales y remotas, por lo que una versión en inglés puede aportar valor. Sin embargo, hoy siguen pendientes secciones centrales, casos de proyecto, enlaces de contacto y la eliminación de placeholders. Traducir ahora duplicaría contenido que todavía cambia y aumentaría el riesgo de publicar versiones desalineadas.

## Costos evitados por ahora

- Mantener dos copias de cada sección, nota y metadato mientras el contenido base sigue cambiando.
- Duplicar QA de navegación, accesibilidad, responsive, SEO y enlaces.
- Revisar la voz personal en otro idioma antes de estabilizar el texto en español.
- Crear un selector que prometa una cobertura que el sitio todavía no puede ofrecer completa.

## Condiciones para reevaluar

La decisión se revisa cuando se cumplan estas condiciones:

1. La arquitectura de información y las secciones principales están terminadas.
2. Los casos de proyecto y la experiencia profesional tienen contenido aprobado.
3. No quedan placeholders visibles y los enlaces de contacto son definitivos.
4. Existe tiempo para traducir y revisar todas las páginas, no solamente la portada.

## Reglas si se incorpora más adelante

- La versión inglesa vive en rutas propias bajo `/en/`; no se mezclan idiomas dentro de una página.
- Se traducen todas las secciones, notas, navegación, textos alternativos, metadatos SEO, Open Graph y datos estructurados.
- Cada página define `lang`, canonical y `hreflang` para español, inglés y `x-default`.
- El selector usa un control accesible, indica el idioma de destino y conserva la sección equivalente cuando exista.
- Los IDs de secciones se relacionan mediante una tabla explícita para evitar rutas o anclas adivinadas.
- La voz en inglés se revisa como contenido propio; no se publica una traducción automática sin revisión.
- Las pruebas deben impedir páginas parciales, metadatos sin traducir y enlaces cruzados rotos.

## Qué cuenta como mezcla de idiomas

La interfaz, los títulos y el contenido editorial pertenecen a una sola versión. Nombres propios, marcas, cargos reconocibles como Project Manager y expresiones citadas dentro de una nota pueden conservar su forma original cuando traducirlas altere su significado.

## Consecuencia actual

Todas las páginas publicadas mantienen `lang="es"`. La ausencia de selector y `hreflang` es deliberada hasta que exista una versión inglesa completa. Esta decisión evita una experiencia incompleta y no impide agregar `/en/` más adelante sobre la arquitectura estática definida en WEB-071.
