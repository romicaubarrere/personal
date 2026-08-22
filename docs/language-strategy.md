# Estrategia de idiomas del portfolio

- Estado: español, inglés y portugués habilitados
- Fecha de la decisión vigente: 22 de agosto de 2026
- Ticket: WEB-054

## Decisión vigente

Romina decidió reemplazar la estrategia anterior, que postergaba la localización. El portfolio mantiene español como versión principal y publica rutas reales en inglés y portugués mediante documentos estáticos propios.

El selector ES / EN / PT es un control accesible, identifica el idioma activo y conserva la página equivalente cuando existe. Las familias localizadas declaran `lang`, canonical, locale social y relaciones `hreflang`, incluido `x-default` hacia español.

## Perfil lingüístico aprobado

- Romina habla español e inglés.
- Habla bastante portugués.
- Estudió italiano y ruso porque le gustan mucho los idiomas.
- No se publican niveles CEFR, certificaciones ni afirmaciones de fluidez no confirmadas.

## Cobertura vigente

Las portadas en español, inglés y portugués ofrecen una presentación profesional completa y contacto directo. La portada española incorpora el perfil lingüístico dentro del bloque personal.

También están localizadas las páginas de Cómo trabajo, Comunidad y charlas, Formación y las notas publicadas. Cada familia conserva una ruta equivalente por idioma y permite cambiar entre ES / EN / PT sin volver innecesariamente a la portada.

## Reglas de mantenimiento

- No mezclar texto de interfaz entre idiomas, salvo nombres propios, marcas y cargos cuyo uso natural se conserva.
- Mantener alineadas las tres versiones cuando cambien posicionamiento, experiencia, contacto o contenido compartido.
- Conservar español como `x-default`.
- Traducir metadatos, textos accesibles y datos estructurados cuando se agregue una ruta localizada.
- No publicar traducciones automáticas sin revisión de voz y significado.
- Proteger rutas, selector, `hreflang`, sitemap y perfil lingüístico mediante pruebas.
