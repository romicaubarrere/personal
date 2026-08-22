# Trazabilidad de entrega

## Objetivo

Mantener una relación inequívoca entre tarjeta, rama, pull request, commit integrado
y despliegue. El tablero es la fuente del estado del trabajo; GitHub conserva la
implementación y la evidencia automática.

## Límite de trabajo en curso

Hay como máximo tres tickets de entrega en `Doing`. Las tarjetas que registran
un plan o una suite de QA no consumen ese límite mientras no representen una
implementación paralela. Antes de reclamar una tarjeta:

1. revisar `Doing` y las ramas y pull requests abiertos;
2. buscar el identificador `WEB-xxx` para detectar trabajo duplicado;
3. revisar sus dependencias y documentar cualquier bloqueo o excepción explícita;
4. mover la tarjeta a `Doing` y registrar la rama prevista.

Una tarjeta bloqueada conserva su estado y documenta el bloqueo; no se presenta
una dependencia pendiente como resuelta para simular avance.

## Relación entre artefactos

- Una tarjeta activa tiene una única rama corta con `WEB-xxx` en el nombre.
- El pull request incluye el enlace de Trello y usa `WEB-xxx` en el título.
- Los commits incluyen `WEB-xxx` y el merge habitual es `Squash and merge`.
- Una rama no agrupa tickets independientes.
- Las ramas remotas integradas se eliminan después del merge.

## Cierre

La tarjeta pasa a `Done` solamente cuando `Validate build` está verde y el cambio
está en `main`. El registro de cierre incluye:

- SHA final integrado y enlace al pull request;
- resultado del build y cantidad de pruebas;
- URL pública verificada, o `No aplica` si no hubo cambio desplegable;
- cualquier excepción o seguimiento pendiente.

Después del cierre se elimina la rama remota cuando su integración en `main`
está comprobada, se comprueba que no haya una tarjeta
completada fuera de `Done` y recién entonces se reclama el siguiente ticket listo.
Las ramas abiertas, no integradas o creadas por Dependabot no se eliminan como
parte de una limpieza general.

## Reconciliación

Si Trello y GitHub discrepan, se inspecciona la evidencia antes de mover o duplicar
trabajo. Un commit en `main` con pipeline verde permite cerrar la tarjeta; una rama
o un pull request abierto obliga a tratarla como activa. Nunca se interpreta el
nombre de una lista como prueba suficiente de finalización.
