# Estrategia de idiomas del portfolio

- Estado: español, inglés y portugués habilitados
- Fecha de la decisión vigente: 22 de agosto de 2026
- Ticket: WEB-054

## Decisión vigente

Romina decidió reemplazar la estrategia anterior, que postergaba la localización. El portfolio mantiene español como versión principal y publica portadas reales en inglés y portugués mediante rutas estáticas propias.

El selector ES / EN / PT es un control accesible, identifica el idioma activo y enlaza documentos existentes. Las tres portadas declaran `lang`, canonical, locale social y relaciones `hreflang`, incluido `x-default` hacia español.

## Perfil lingüístico aprobado

- Romina habla español e inglés.
- Habla bastante portugués.
- Estudió italiano y ruso porque le gustan mucho los idiomas.
- No se publican niveles CEFR, certificaciones ni afirmaciones de fluidez no confirmadas.

## Cobertura inicial

Las portadas en inglés y portugués ofrecen una presentación profesional completa y contacto directo sin botones decorativos ni bloques mezclados. La portada española incorpora el perfil lingüístico dentro del bloque personal.

Las páginas internas extensas siguen en español durante esta primera entrega. Su localización se hará por rutas equivalentes y con revisión editorial propia; el selector no promete alternativas internas inexistentes.

## Reglas de mantenimiento

- No mezclar texto de interfaz entre idiomas, salvo nombres propios, marcas y cargos cuyo uso natural se conserva.
- Mantener las tres portadas alineadas cuando cambien posicionamiento, experiencia o contacto.
- Conservar español como `x-default`.
- Traducir metadatos, textos accesibles y datos estructurados cuando se agregue una ruta localizada.
- No publicar traducciones automáticas sin revisión de voz y significado.
- Proteger rutas, selector, `hreflang`, sitemap y perfil lingüístico mediante pruebas.
