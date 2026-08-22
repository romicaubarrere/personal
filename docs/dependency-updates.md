# Actualizaciones de dependencias

- Ticket: WEB-131
- Estado: vigente

Dependabot revisa npm y GitHub Actions cada lunes. Las propuestas compatibles
`minor` y `patch` se agrupan por tipo para reducir ruido: producción, desarrollo
y Actions. Las actualizaciones mayores quedan separadas para que su impacto sea
visible. Los avisos de seguridad de npm se agrupan entre sí y no esperan a la
ejecución semanal.

El límite es de tres pull requests abiertos para versiones npm y dos para
GitHub Actions. GitHub no aplica ese límite a las actualizaciones de seguridad.

## Política de revisión

Cada pull request de Dependabot se trata como cualquier otro cambio de código:

1. Leer el changelog y revisar cambios incompatibles, especialmente en majors.
2. Confirmar que el lockfile sólo contiene los cambios esperados.
3. Esperar el pipeline completo: build de Astro, suite Node y Playwright en
   desktop y móvil.
4. Integrar únicamente con todos los checks obligatorios en verde.
5. No activar `auto-merge`; una persona revisa y decide cada integración.
6. Si un grupo falla, separar o excluir la dependencia conflictiva antes de
   volver a ejecutar, sin saltear pruebas.

Dependabot propone cambios; no publica ni integra directamente. La rama `main`
sigue siendo el único origen del despliegue de producción.
