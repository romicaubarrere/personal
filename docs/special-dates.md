# Fechas especiales

## Alcance del backlog

- **WEB-081:** edad automática desde el 13/05/2003 y celebración de cumpleaños cada 13/05.
- **WEB-082:** Halloween, fechas patrias y demás fechas especiales.

Esta rama integra solamente la parte verificable de esos tickets: edad, cumpleaños, Halloween y las cinco fechas patrias aprobadas. No incorpora otras celebraciones de WEB-082.

## Calendario implementado

- Cumpleaños: 13/05.
- Halloween: 31/10.
- Fechas patrias: 19/04, 18/05, 19/06, 18/07 y 25/08.

Todas las celebraciones duran únicamente el día indicado y se resuelven con la fecha de `America/Montevideo`.

## Simulación para revisión

La simulación se activa solamente mediante parámetros de URL y no modifica la fecha del dispositivo:

- `?celebration=birthday`
- `?celebration=halloween`
- `?celebration=patriotic-04-19`
- `?celebration=patriotic-05-18`
- `?celebration=patriotic-06-19`
- `?celebration=patriotic-07-18`
- `?celebration=patriotic-08-25`
- `?date=2027-05-13` para simular una fecha completa y comprobar también la edad.

Se conserva compatibilidad con el preview anterior de WEB-081: `?preview=birthday` y `#birthday-preview`.
