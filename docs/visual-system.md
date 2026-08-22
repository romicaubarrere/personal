# Sistema visual de El estudio de Romi

## Dirección

El sitio debe sentirse como un estudio habitado: papeles, carpetas, corcho,
lana, madera, etiquetas y objetos con pequeñas imperfecciones. La composición
puede ser ordenada, pero no debe parecer una plantilla genérica ni una grilla de
tarjetas intercambiables.

La lista de señales que se evitan deliberadamente y qué parte de ese criterio
queda protegida por CI está en [Guardrails visuales: evitar una estética genérica de sitio generado por IA](./anti-ai-visual-guardrails.md).

## Tokens

Los valores compartidos viven en `src/styles/brand-tokens.css`. Allí se mantiene
la paleta, las tres familias tipográficas, los materiales base y las decisiones
reutilizables de foco y sombra. Las hojas de cada página consumen esos tokens y
solo declaran variables locales cuando describen una pieza concreta.

- Fraunces: títulos y voz editorial.
- DM Sans: lectura, navegación y datos.
- Caveat: anotaciones manuscritas breves, nunca párrafos completos.
- Verde oscuro y ladrillo: superficies principales.
- Crema, papel y corcho: superficies físicas y contenido.
- Dorado: foco, cinta y acentos; no se usa como decoración gratuita.

## Componentes y estados

Los enlaces y controles deben tener foco visible, área táctil suficiente y un
estado reconocible sin depender solo del color. Las tarjetas pueden rotar unos
grados y proyectar sombra para conservar su materialidad; en móvil se reduce la
rotación para sostener la lectura. `prefers-reduced-motion` elimina movimiento,
pero no la identidad visual.

## Secuencias

No se usan indicadores decorativos `01`, `02`, `03`. Cuando el orden ya está
expresado por el contenido, se usan señales editoriales orgánicas sin valor
semántico. Los números se conservan únicamente cuando son información real,
como “Semestre 3”, una fecha o el código comprobable de un proyecto.

## Regla de evolución

Antes de sumar un nuevo color, fuente, radio o sombra se revisan los tokens
existentes. Una pieza nueva debe poder explicar qué objeto del estudio representa
y cómo se comporta en desktop, móvil, teclado y movimiento reducido.
