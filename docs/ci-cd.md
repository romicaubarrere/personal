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
```

En GitHub, el check estable que debe proteger `main` es `Validate build`. La
verificación posterior al deploy comprueba que la portada responde, conserva la
URL canónica y referencia assets compilados de Astro.

La ampliación del smoke test y el rollback seleccionable se implementan en
WEB-128 y WEB-129 respectivamente.
