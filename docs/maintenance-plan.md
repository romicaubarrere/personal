# Plan de mantenimiento del portfolio

- Ticket: WEB-073
- Responsable editorial y de producto: Romina Caubarrere
- Frecuencia base: revisión mensual
- Revisión extraordinaria: después de cambios relevantes de experiencia, formación, proyectos, charlas, CV, enlaces públicos o estructura del sitio

## Objetivo

Mantener el portfolio vigente sin convertir cada actualización menor en un rediseño. La regla operativa es separar contenido, calidad y publicación: primero se actualiza la fuente de verdad correspondiente, después se ejecutan las verificaciones y recién entonces se integra a `main`.

## Cadencia

### Revisión mensual

Una vez por mes se revisan, como mínimo:

- Experiencia profesional y textos que usan expresiones como “actualmente”, “en curso”, “hoy” o estados equivalentes.
- Formación, certificaciones y estados académicos.
- Proyectos publicados, resultados, métricas y enlaces de evidencia.
- Charlas, eventos, comunidades y apariciones.
- CV descargable y consistencia entre CV y portfolio.
- Contacto, LinkedIn y cualquier enlace externo visible.
- “Leyendo ahora” e historial de lecturas.
- Posts, RSS y metadatos de publicación.
- Fechas especiales y celebraciones configuradas.

### Revisión extraordinaria

No se espera a la revisión mensual cuando ocurre alguno de estos cambios:

- nuevo rol, cambio de empresa o cambio sustancial de responsabilidades;
- proyecto que pasa a producción o obtiene un resultado público verificable;
- nueva charla, evento o participación pública;
- nueva versión aprobada del CV;
- cambio de dominio, hosting, analítica o política de privacidad;
- enlace roto detectado en una ruta importante;
- dato público que deja de ser verdadero.

## Flujo de actualización

1. Crear o tomar el ticket correspondiente en Trello.
2. Trabajar en una rama exclusiva cuando el cambio modifica código, contenido versionado o configuración.
3. Actualizar la fuente de verdad antes que el HTML generado. Ejemplos: `src/data/`, documentación del caso, importador de StoryGraph o configuración compartida.
4. Ejecutar `npm test` y las pruebas E2E cuando el cambio afecta navegación, responsive, accesibilidad o interacción.
5. Revisar el diff para detectar placeholders, datos sensibles, texto duplicado y cambios no relacionados.
6. Abrir PR, esperar CI verde y respetar la protección de `main`.
7. Integrar y comprobar el resultado publicado cuando corresponda.
8. Cerrar el ticket con evidencia: PR, commit y verificación relevante.

## Checklist editorial

Antes de integrar una actualización de contenido:

- Confirmar que nombres, cargos, fechas y cifras siguen siendo correctos.
- No completar métricas, fechas o resultados por inferencia.
- Mantener anonimizados clientes, personas o datos internos cuando no exista autorización explícita.
- Revisar que no aparezcan textos de trabajo como “tu proyecto”, “borrador”, “pendiente”, “lo cambiás después” u otras instrucciones internas.
- Evitar duplicar la misma información en varias secciones si una sola fuente puede alimentarlas.
- Conservar el idioma correcto en ES, EN y PT cuando el contenido tenga versiones equivalentes.

## Checklist técnico

- `npm test` pasa completo.
- Las rutas nuevas o modificadas existen en `dist/` después del build.
- No hay errores de sintaxis ni de consola introducidos por el cambio.
- Los enlaces internos y externos relevantes siguen funcionando.
- La navegación por teclado y el foco siguen siendo utilizables.
- `prefers-reduced-motion` continúa respetado cuando se modifica una interacción.
- Responsive revisado cuando el cambio altera layout, texto largo, imágenes o componentes interactivos.
- No se agregan secretos, credenciales, exports personales ni archivos de trabajo al repositorio.

## Contenido sensible al tiempo

La revisión mensual debe buscar especialmente:

- estados académicos como “en curso”;
- referencias temporales como “actualmente”, “hoy” o “este año”;
- cargos y empresas;
- cifras acumulativas de proyectos;
- CV y enlaces de descarga;
- “Leyendo ahora”;
- fechas de posts y RSS;
- eventos futuros que ya hayan ocurrido;
- enlaces a servicios de terceros.

Cuando un dato temporal deja de ser cierto, se corrige o se oculta. No se mantiene por conservar simetría visual.

## Automatización existente

El mantenimiento se apoya en controles ya versionados:

- `tests/portfolio.test.mjs` protege estructura, contenido conocido, placeholders, accesibilidad y contratos editoriales.
- `tests/astro-build.test.mjs` valida rutas y salida compilada.
- Playwright cubre recorridos de desktop y móvil en CI.
- GitHub Actions construye y prueba cada PR antes de permitir la integración a `main`.
- Los imports de datos personales, como StoryGraph, generan archivos estáticos y no incorporan el export original al repositorio.

Estos controles reducen regresiones, pero no reemplazan la revisión editorial: una prueba puede verificar que existe un cargo, no que ese cargo siga siendo verdadero.

## Criterio de cierre de una revisión

Una revisión se considera completa cuando:

- no quedan datos conocidos como vencidos;
- no se detectan enlaces importantes rotos;
- CV y portfolio son consistentes;
- los checks automáticos están verdes;
- cualquier cambio realizado quedó versionado y trazado a un ticket;
- las secciones sin información vigente se ocultan antes que publicar placeholders o contenido inventado.
