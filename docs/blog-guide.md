# Guía para las notas del portfolio

## Audiencia y temas

Las notas están dirigidas a personas que llegan al portfolio por el trabajo de Romina y quieren conocer cómo piensa, trabaja y aprende. Pueden combinar experiencia profesional y voz personal, siempre que exista un vínculo claro con su forma de mirar el mundo.

Los ejes iniciales son:

- preguntas, curiosidad y descubrimiento de necesidades;
- aprendizajes de gestión y producto;
- tecnología, comunidades y charlas;
- intereses personales cuando ayudan a mostrar una mirada o aprendizaje propio.

No se publican textos de muestra. Cada nota debe estar terminada y aprobada por Romina.

## Plantilla reutilizable

1. Copiar una nota existente dentro de `src/pages/posts/` y renombrarla con un slug estable.
2. Mantener `PostLayout.astro`; el diseño y la estructura compartida no se copian ni se editan para cada publicación.
3. Actualizar las propiedades `title`, `description`, `canonical`, `summary`, `dateTime` y `dateLabel`.
4. Actualizar el título visible dentro del slot `heading`.
5. Reemplazar solamente el contenido que se entrega al layout. `PostLayout.astro` conserva `main-content`, el enlace de salto, autora, favicon y navegación de regreso.
6. Agregar una tarjeta al componente `src/components/home/Reads.astro` con estado Publicado, fecha, título, resumen y enlace permanente.
7. Ejecutar `npm test` y revisar la nota compilada en móvil antes de abrir el pull request.

## Campos obligatorios

- Título.
- Fecha de publicación.
- Resumen breve.
- Contenido completo.
- URL canónica permanente.
- Meta description y autora.
- Acceso desde la portada.

La primera publicación es `posts/por-que-hago-tantas-preguntas.html`, una nota sobre curiosidad, preguntas y la relación entre esa forma de pensar y el trabajo de Romina.
