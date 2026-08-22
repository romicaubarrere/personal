# Sistema visual de El estudio de Romi

Este documento fija las decisiones compartidas del portfolio para que cada página se sienta parte del mismo estudio sin volverse una plantilla rígida.

## Identidad

- El sitio se construye como un espacio físico y vivido: papeles, carpetas, corcho, madera, cinta, tejido y objetos de cocina.
- La composición puede ser imperfecta y artesanal, pero la lectura, el contraste y la navegación siempre deben ser claras.
- Cada página puede elegir una metáfora propia. Debe conservar la paleta, la tipografía y el comportamiento de los controles.
- Se evita la estética de dashboard, las tarjetas SaaS genéricas y los adornos que no cuentan nada personal.

## Tokens compartidos

La fuente de verdad es `src/styles/tokens.css`.

- `--cream`, `--paper`, `--paper2` y `--paper-light`: superficies de papel.
- `--ink` y `--ink-soft`: texto principal y secundario.
- `--green-dark`, `--green` y `--green-deep`: fondos, títulos y estados activos.
- `--gold`, `--warm`, `--brick` y `--rose`: acentos cálidos.
- `--serif`: títulos editoriales; `--sans`: lectura e interfaz; `--hand`: notas personales breves.
- `--radius-paper`, `--radius-control`, `--shadow-paper`, `--motion-fast` y `--focus-ring`: forma y comportamiento comunes.

## Números y señales visuales

No se usan secuencias decorativas como 01, 02 o 03 para simular orden o llenar una ficha. Los recorridos se marcan con trazos manuales, pestañas, títulos o cambios de material.

Los números se conservan cuando son información: fechas, años, métricas, nombres de semestres y códigos reales de proyectos.

## Estados y movimiento

- Todo control interactivo debe tener estados de hover, foco visible y activación equivalentes.
- El foco usa `--focus-ring` y no depende solo de un cambio de color.
- Las microinteracciones deben ser breves y reforzar la metáfora física: levantar un papel, mover una pestaña o subrayar una etiqueta.
- `prefers-reduced-motion` debe eliminar desplazamientos y rotaciones sin ocultar contenido.

## Responsive

- Desktop y móvil conservan materiales, paleta y jerarquía; móvil no es una versión visualmente neutra.
- Las composiciones de dos columnas se apilan sin alterar el orden de lectura.
- Los controles táctiles mantienen un área cómoda y no dependen del hover.
- Las decoraciones nunca deben producir desborde horizontal ni tapar texto.

## Revisión antes de publicar

- Comprobar contraste y foco con teclado.
- Revisar que no reaparezca numeración decorativa.
- Comparar desktop y móvil para confirmar la misma identidad.
- Probar movimiento reducido.
- Confirmar que cualquier número visible aporta información real.
