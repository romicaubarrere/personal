# Estrategia de branches

## Modelo elegido

El repositorio usa **GitHub Flow**. `main` representa en todo momento la versión estable y potencialmente publicable del portfolio. Cada cambio se desarrolla en una rama corta y se integra mediante pull request.

No se utiliza una rama permanente `develop`. Para un portfolio mantenido principalmente por una persona, agregaría coordinación y merges sin aportar una separación útil.

## Ramas

Todas las ramas parten de `main` actualizado y se relacionan con un ticket de Trello.

| Tipo | Formato | Ejemplo |
| --- | --- | --- |
| Funcionalidad | `feat/WEB-xxx-descripcion` | `feat/WEB-012-casos-proyecto` |
| Corrección | `fix/WEB-xxx-descripcion` | `fix/WEB-020-menu-mobile` |
| Documentación o contenido | `docs/WEB-xxx-descripcion` | `docs/WEB-006-bio-profesional` |
| Mantenimiento | `chore/WEB-xxx-descripcion` | `chore/WEB-070-configurar-github` |
| Tests | `test/WEB-xxx-descripcion` | `test/WEB-063-navegacion` |

Las ramas deben resolver un objetivo concreto y eliminarse después del merge.

## Flujo de trabajo

1. Tomar un ticket del backlog y confirmar sus criterios de aceptación.
2. Actualizar `main` y crear una rama con el identificador del ticket.
3. Implementar cambios pequeños y verificables.
4. Ejecutar `npm test` antes de publicar la rama.
5. Abrir un pull request hacia `main` usando `WEB-xxx` en el título.
6. Confirmar que GitHub Actions termina correctamente.
7. Revisar los criterios de aceptación y el impacto visual, responsive y accesible cuando corresponda.
8. Integrar con **Squash and merge**.
9. Eliminar la rama y actualizar el ticket de Trello.

## Commits

Se usan mensajes breves y descriptivos con estos prefijos:

- `feat:` nueva funcionalidad.
- `fix:` corrección.
- `docs:` contenido o documentación.
- `test:` tests.
- `chore:` configuración o mantenimiento.

Ejemplo: `fix: completar navegación móvil WEB-020`.

## Protección de main

Después de la carga inicial, `main` debe configurarse con estas reglas:

- Requerir pull request antes del merge.
- Requerir que el check `test` termine correctamente.
- Resolver conversaciones abiertas antes del merge.
- Bloquear force push y eliminación de la rama.
- Evitar commits directos, excepto una intervención de emergencia justificada.
- Usar **Squash and merge** como método habitual.

Como el proyecto tiene una mantenedora principal, no se exige una aprobación externa. La revisión puede realizarse con la checklist del pull request y el resultado automático de los tests.

## Hotfixes

Las correcciones urgentes usan `fix/WEB-xxx-descripcion`, parten de `main` y siguen el mismo pull request y los mismos tests. No se crea una rama permanente de hotfix.

## Excepción inicial

La primera carga puede hacerse directamente en `main` porque el repositorio está vacío. Desde el siguiente cambio se aplica el flujo completo.
