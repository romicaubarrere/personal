# Entorno y cadena de suministro

- Ticket: WEB-130
- Estado: vigente

## Entorno reproducible

El proyecto fija Node.js `22.19.0` y npm `11.9.0` en `package.json`, `.nvmrc` y
los workflows de entrega. CI activa explícitamente esa versión de npm antes de
instalar dependencias.

Para reproducir el entorno local:

```bash
nvm use
npm install --global --ignore-scripts npm@11.9.0
npm ci --ignore-scripts
npm test
```

CI comprueba explícitamente las versiones raíz y mantiene `engine-strict`
activo. Los metadatos de dependencias transitivas se conservan exactamente como
los publica el registro: fijar el entorno del proyecto no implica reescribir
los contratos de terceros. El lockfile v3 es obligatorio y `npm ci` falla si
`package.json` y `package-lock.json` no coinciden.

## Controles de suministro

- Las dependencias se instalan desde el lockfile y conservan sus hashes de integridad.
- Los scripts de instalación de terceros quedan deshabilitados durante CI.
- Las GitHub Actions se referencian por SHA completo; el comentario de versión mantiene legible el origen de cada pin.
- Los permisos del workflow permanecen vacíos por defecto y se habilitan por job solamente cuando son necesarios.
- Los cambios de versiones pasan por pull request, build, suite Node y E2E.

## Actualización

No se cambia un SHA o una versión solamente porque exista una release nueva.
Primero se revisa la fuente oficial, se actualiza el pin y se deja que el
pipeline completo valide el cambio. WEB-131 automatiza la propuesta de esas
actualizaciones; no automatiza su integración.
