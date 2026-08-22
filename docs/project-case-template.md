# Plantilla para casos de proyecto

Estado: aprobada para la primera versión del portfolio.

## Para qué sirve

La plantilla ordena todos los casos con la misma lógica. El objetivo no es enumerar tareas, sino mostrar cómo Romina entendió una situación, tomó decisiones y llevó el trabajo hacia un resultado.

## Orden de la información

1. **Contexto.** Qué era el proyecto, para quién y en qué momento ocurrió. El período o la duración se integran acá cuando ayudan a entender el caso.
2. **Desafío.** Qué problema concreto había que resolver y qué restricciones importaban.
3. **Rol de Romina.** De qué se hizo cargo y qué quedaba fuera de su responsabilidad.
4. **Equipo y stakeholders.** Con quién trabajó, cómo se repartieron las responsabilidades y qué partes deben quedar anónimas.
5. **Decisiones y acciones.** Qué alternativas se evaluaron, qué se decidió y por qué. Metodologías y herramientas aparecen dentro de este relato solamente cuando explican una decisión o una forma de coordinar.
6. **Resultados.** Qué cambió, qué se entregó y qué evidencia existe. No se inventan métricas: se usan cifras solo cuando son verificables y aportan contexto.
7. **Aprendizajes.** Qué aprendió Romina y qué haría igual o distinto en un proyecto similar.

## Evidencia y datos complementarios

- La evidencia visual o enlazada se incorpora junto al resultado que respalda. Puede ser una captura, una demo, un video, un gráfico, un documento o un enlace.
- Antes de publicar una evidencia se confirma que exista permiso y que no exponga datos personales, credenciales o información interna.
- Industria, tipo de proyecto, período y composición del equipo pueden aparecer en la portada o en Contexto si ayudan a escanear el caso.
- Las métricas deben indicar qué miden y de dónde salen. Si no existe una cifra confiable, se describe un resultado observable sin convertirlo en un porcentaje inventado.

## Privacidad y anonimización

- Si el cliente o la organización no pueden nombrarse, se usa una descripción útil, por ejemplo “plataforma B2B para logística”, sin dejar pistas innecesarias.
- Se pueden generalizar fechas, volúmenes o composición del equipo cuando el dato exacto sea confidencial.
- Anonimizar no significa volver el caso vago: el desafío, las decisiones de Romina y el resultado deben seguir entendiéndose.
- Nunca se publican nombres de usuarios, accesos, datos de producción, secretos ni capturas sin autorización.

## Uso en el sitio

`makeBookCase` recibe la portada y un objeto `sections`. Las claves aceptadas son `context`, `challenge`, `role`, `team`, `decisions`, `results` y `learnings`.

El render recorre siempre ese orden. Los campos vacíos no generan páginas, por lo que un caso puede crecer a medida que se valida contenido sin mostrar títulos vacíos ni romper el libro.

En móvil se conserva una página visible por vez. En escritorio se mantiene el pliego. El contenido de cada página debe ser breve, escaneable y comprensible sin depender de hover.
