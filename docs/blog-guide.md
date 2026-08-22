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

1. Copiar una nota existente dentro de `posts/` y renombrarla con un slug estable.
2. Mantener el enlace a `post.css`; el diseño compartido no se copia ni se edita para cada publicación.
3. Actualizar `title`, description, author, canonical y favicon en `head`.
4. Actualizar el título visible, el resumen y el elemento `time` con un `datetime` válido.
5. Reemplazar el contenido de `article` y conservar `main-content`, el enlace de salto y el enlace de regreso.
6. Agregar una tarjeta al bloque “mis notas” de `index.html` con estado Publicado, fecha, título, resumen y enlace permanente.
7. Ejecutar `npm test` y revisar la nota en móvil antes de abrir el pull request.

## Campos obligatorios

- Título.
- Fecha de publicación.
- Resumen breve.
- Contenido completo.
- URL canónica permanente.
- Meta description y autora.
- Acceso desde la portada.

La primera publicación es `posts/por-que-hago-tantas-preguntas.html`, una nota sobre curiosidad, preguntas y la relación entre esa forma de pensar y el trabajo de Romina.
