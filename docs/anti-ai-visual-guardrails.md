# Guardrails visuales: evitar una estética genérica de sitio generado por IA

Este documento complementa el [sistema visual](./visual-system.md). No busca prohibir recursos por moda ni convertir una preferencia estética en una regla universal. Registra qué señales Romina decidió evitar en **El estudio de Romi** porque contradicen la identidad del producto y cuáles sí tienen una justificación dentro de su lenguaje material.

## Principio

Una pieza nueva debe poder responder dos preguntas:

1. ¿Qué función cumple para la persona que recorre el portfolio?
2. ¿Por qué pertenece a este estudio y no podría haberse pegado sin cambios en cualquier landing genérica?

Si solo agrega “acabado”, “dinamismo” o “modernidad” sin una respuesta concreta, no entra por defecto.

## Señales que evitamos

### Copy y jerarquía

- guiones largos usados como muletilla editorial;
- emojis, sparkles, checkmarks o íconos decorativos usados para hacer que un bloque parezca más “amigable”;
- métricas enormes sin contexto ni evidencia;
- etiquetas repetidas como “01 / 02 / 03” cuando el orden ya está expresado por el contenido;
- testimonios, logos, pricing o social proof inventados;
- títulos grandilocuentes que no se puedan sostener con el contenido del sitio.

### Composición

- tres tarjetas idénticas en fila como solución automática a cualquier sección;
- bento grids sin una razón de contenido;
- bloques intercambiables que solo cambian ícono, título y dos líneas;
- barras laterales de color usadas como acento genérico;
- terminales falsas, dashboards decorativos o interfaces “tech” que no representan una herramienta real;
- contenedores redondeados y sombras uniformes aplicados por sistema sin relación con un material u objeto.

### Paleta y tipografía

- violeta/neón como atajo visual de “tecnología”;
- gradientes decorativos que no representan una superficie del estudio;
- incorporar una cuarta familia tipográfica para diferenciar una sección;
- reemplazar Fraunces, DM Sans o Caveat por una fuente de tendencia sin una decisión explícita de identidad.

Las tres familias aprobadas siguen siendo:

- **Fraunces** para títulos y voz editorial;
- **DM Sans** para lectura, navegación y datos;
- **Caveat** para anotaciones manuscritas breves.

La paleta compartida vive en `src/styles/brand-tokens.css`. Los colores locales solo se justifican cuando describen una pieza concreta, por ejemplo madera, papel, cinta, lana o un objeto físico.

## Recursos que sí usamos y por qué

### Sombras

El sitio usa muchas sombras. No son un efecto genérico que deba “limpiarse” por cantidad: sostienen la materialidad de papeles, carpetas, libros, post-its, cinta y objetos superpuestos. Antes de reducirlas globalmente hay que revisar qué profundidad comunica cada componente.

### Gradientes

Los gradientes existentes representan texturas o iluminación: ladrillo, madera, corcho, papel, lana, pliegues y sombras. No son un fondo abstracto para “hacerlo más interesante”. Un gradiente nuevo debe tener esa misma justificación.

### Rotaciones e imperfecciones

Las pequeñas rotaciones ayudan a construir la sensación de estudio habitado. En móvil se reducen cuando afectan lectura o espacio; con `prefers-reduced-motion` se elimina el movimiento, no la identidad.

### Microinteracciones

Una microinteracción debe orientar, confirmar una acción o reforzar una metáfora ya existente. No se agrega animación únicamente porque un bloque se vea estático.

## La barra lateral verde que originó WEB-095

La auditoría inicial detectó `border-left: 7px solid var(--green)` como la única señal cercana a una barra de acento genérica. En la implementación Astro vigente ese patrón ya no existe: las iteraciones posteriores resolvieron esas jerarquías mediante materiales, bordes propios de los objetos, cinta, carpetas y composición.

**Decisión:** no reintroducir una barra lateral gruesa de color como recurso genérico de jerarquía. Si una pieza necesita un borde porque representa una carpeta, hoja, lomo u objeto concreto, puede usarlo y debe poder explicar esa metáfora.

## Qué protegemos automáticamente

`tests/visual-guardrails.test.mjs` verifica lo que puede convertirse razonablemente en contrato:

- que el HTML publicado no contenga guiones largos;
- que no aparezcan sparkles/checkmarks decorativos aprobados como antipatrón;
- que las declaraciones de `font-family` no introduzcan una familia principal fuera de Fraunces, DM Sans y Caveat (además de fallbacks del sistema);
- que `brand-tokens.css` conserve las variables base de tipografía y paleta;
- que no reaparezca el patrón concreto de la barra lateral verde que originó el ticket.

El resto requiere revisión de diseño. Un test no puede decidir si una composición “parece IA” sin producir falsos positivos; para eso se usa esta guía, los checkpoints visuales y la revisión del producto en contexto.

## Checklist para componentes nuevos

Antes de integrar una pieza visual nueva:

- comprobar que usa primero tokens existentes;
- justificar cualquier nuevo color, fuente, radio o sombra;
- revisar desktop y móvil;
- revisar teclado y foco;
- revisar `prefers-reduced-motion` si hay movimiento;
- comprobar que la solución no recurre por defecto a tarjetas repetidas, numeración decorativa o acentos genéricos;
- si introduce una excepción deliberada a esta guía, documentar la decisión en el ticket o ADR correspondiente.

## Relación con arquitectura y QA

Estos guardrails son una restricción de producto, no una preferencia que se aplica al final. Por eso viven junto al sistema visual y tienen una parte automatizada en CI. La migración a Astro no cambia esta regla: un componente técnicamente reutilizable sigue teniendo que pertenecer a la identidad del estudio.
