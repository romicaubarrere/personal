# Pipeline de CI y publicación

## Objetivo

Evitar que un commit se publique mientras sus pruebas fallan y asegurar que el
artefacto revisado sea exactamente el artefacto desplegado.

## Único workflow

`.github/workflows/deploy-pages.yml` responde a dos caminos:

- **Pull request hacia `main`:** instala dependencias con `npm ci`, construye Astro
  una vez y ejecuta la suite sobre `dist`. No solicita permisos de Pages ni publica.
- **Push o ejecución manual en `main`:** realiza la misma validación, carga el
  `dist` ya probado como artifact de Pages, lo despliega y ejecuta el smoke test.

El pipeline no conserva un workflow de tests paralelo. Así se evita instalar y
construir dos veces para el mismo push, recibir resultados competidores o iniciar
un deploy antes de conocer el resultado de las pruebas.

## Garantías

- `deploy` depende de `validate`.
- `validate` construye una sola vez y luego ejecuta `node --test` sin reconstruir.
- `validate` prueba el mismo `dist` en Chromium de escritorio y móvil con Playwright.
- Si E2E falla, el reporte, las capturas y las trazas se conservan durante 7 días.
- El artifact se carga después de las pruebas y desde el mismo directorio `dist`.
- Los jobs de deploy no existen en pull requests.
- Cada job tiene timeout.
- La concurrencia cancela ejecuciones antiguas del mismo ref.
- Los permisos se asignan por job: lectura para validar; Pages e ID token solamente
  para desplegar.

## Operación

Antes de integrar, ejecutar localmente:

```bash
npm test
npm run test:e2e
```

En GitHub, el check estable que debe proteger `main` es `Validate build`. La
verificación posterior al deploy recorre las portadas en los tres idiomas, las
páginas principales y las notas; comprueba canonical, `hreflang`, sitemap,
feed, 404 y assets compilados. El build publica el SHA esperado en un metadato y
el smoke test lo compara con el commit del workflow. Los reintentos cubren la
propagación de Pages, pero la ejecución termina con error si el contrato sigue
sin cumplirse.

## Rollback de producción

`.github/workflows/rollback-pages.yml` permite seleccionar explícitamente un commit,
tag o rama del historial de `main`. Resuelve el ref a un SHA, reconstruye y prueba esa
revisión antes de desplegarla, y reutiliza el verificador de producción para confirmar
que Pages sirve exactamente el SHA elegido. El pipeline normal y el rollback comparten
un grupo de concurrencia para serializar toda escritura sobre producción.

La decisión operativa, ejecución y recuperación están documentadas en
[`docs/rollback-pages.md`](./rollback-pages.md).

Las versiones reproducibles, el lockfile, los scripts de instalación y los
SHA de las acciones se documentan en [Entorno y cadena de suministro](./supply-chain.md).
