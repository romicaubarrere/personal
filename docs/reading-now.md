# Leyendo ahora

- Tickets: WEB-080, WEB-140
- Fuente vigente: manual, regenerada automáticamente desde un export personal de StoryGraph
- Respaldo: edición manual de `src/data/reading.ts`
- Última actualización visible: 22 de agosto de 2026

El sitio sigue leyendo un único objeto local desde `src/data/reading.ts`. No consulta
servicios externos durante el build ni durante una visita, por lo que la portada no
depende de la disponibilidad de StoryGraph.

## Actualización desde StoryGraph

StoryGraph permite exportar los datos de la cuenta. Con el CSV descargado, ejecutar:

```sh
npm run reading:import -- ruta/al/storygraph-export.csv
```

El importador busca libros con estado `currently-reading`, elige el más recientemente
activo si hay más de uno y regenera título, autoría, fecha de actualización y la
etiqueta breve usada en la portada del libro. El CSV se usa localmente y no se sube
al repositorio. El importador tampoco descarga portadas ni replica contenido editorial
de StoryGraph.

Para reproducir una fecha concreta:

```sh
npm run reading:import -- ruta/al/storygraph-export.csv --date 2026-08-22
```

Después se revisa el diff generado, se ejecutan las pruebas y se versiona únicamente
`src/data/reading.ts` junto con cualquier cambio intencional del importador.

## Decisión sobre scraping y API

StoryGraph no ofrece hoy una API pública estable para esta integración: su API oficial
continúa anunciada a largo plazo. No se usa scraping, no se evade autenticación y no
se consulta StoryGraph desde el navegador. La automatización usa únicamente un export
solicitado por la propia persona titular de la cuenta.

Esto evita depender del HTML privado o cambiante de un tercero. Si StoryGraph publica
una API adecuada, podrá reemplazarse el paso de exportación sin cambiar el contrato
estático que consume la portada.
