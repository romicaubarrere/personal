# Rollback reproducible de GitHub Pages

## Cuándo usarlo

El rollback es una medida de incidente, no una forma alternativa de publicar cambios.
Se usa cuando producción tiene una regresión confirmada y existe un commit anterior de
`main` que fue estable. Antes de ejecutarlo, registrar el SHA defectuoso, el síntoma y
el último SHA estable conocido.

## Cómo ejecutarlo

1. Abrir **Actions → Rollback GitHub Pages → Run workflow**.
2. En `ref`, escribir el SHA completo, tag o rama que identifica la versión estable.
3. En `confirmation`, escribir exactamente `ROLLBACK`.
4. Ejecutar el workflow y esperar los tres jobs: `Validate rollback`,
   `Deploy rollback` y `Verify rollback`.

El workflow resuelve el ref a un SHA inmutable y exige que sea ancestro de `main`.
Después instala con lockfile, reconstruye Astro, ejecuta las pruebas estructurales y
E2E, publica exactamente ese `dist` y verifica el sitio real. El metadato
`build-commit` identifica el SHA desplegado y el verificador lo compara con la
revisión seleccionada.

Si `confirmation` no coincide, el job queda omitido. Si el ref no existe, no es un
commit de este repositorio o no pertenece al historial de `main`, la ejecución falla
antes de construir o desplegar.

## Recuperación posterior

El rollback no reescribe Git ni mueve `main`: reemplaza temporalmente la publicación.
Para recuperar la versión vigente, corregir la regresión mediante pull request y
mergear a `main`. El pipeline normal reconstruirá, probará, desplegará y verificará el
nuevo HEAD. Si el código ya estaba corregido en `main`, se puede ejecutar manualmente
**CI and GitHub Pages** desde `main` para volver a publicar su HEAD.

No cancelar un despliegue de producción para iniciar otro. Ambos workflows comparten
el grupo de concurrencia `portfolio-pages-production`, por lo que las publicaciones se
serializan y no pueden pisarse durante la operación.

