# Fechas especiales

## Alcance del backlog

- **WEB-081:** edad automática desde el 13/05/2003 y celebración de cumpleaños cada 13/05.
- **WEB-082:** Halloween y las cinco fechas patrias aprobadas.
- **WEB-083:** Año Nuevo, Pascuas, corazones del 1.º de diciembre y Navidad.

Todas las celebraciones duran únicamente el día indicado y se resuelven con la fecha de `America/Montevideo`.

## Calendario implementado

| Celebración | Fecha | Simulación |
| --- | --- | --- |
| Año Nuevo | 1 de enero | `?celebration=new-year` |
| Pascuas | domingo de Pascuas calculado para cada año | `?celebration=easter` |
| Cumpleaños | 13 de mayo | `?celebration=birthday` |
| Fecha patria | 19 de abril | `?celebration=patriotic-04-19` |
| Fecha patria | 18 de mayo | `?celebration=patriotic-05-18` |
| Fecha patria | 19 de junio | `?celebration=patriotic-06-19` |
| Fecha patria | 18 de julio | `?celebration=patriotic-07-18` |
| Fecha patria | 25 de agosto | `?celebration=patriotic-08-25` |
| Halloween | 31 de octubre | `?celebration=halloween` |
| Corazones | 1 de diciembre | `?celebration=hearts-december` |
| Navidad | 25 de diciembre | `?celebration=christmas` |

Pascuas se calcula con el calendario gregoriano para el año en curso. Si coincide con una fecha patria, ambas celebraciones permanecen activas.

## Simulación para revisión

La simulación se activa solamente mediante parámetros de URL: no cambia la fecha del dispositivo, no guarda estado y no queda activa para otras visitas.

- `?celebration=<id>` fuerza una celebración.
- `?date=2027-05-13` simula una fecha completa y permite comprobar también la edad y Pascuas.
- `?special=<id>` se conserva como alias de compatibilidad para las revisiones anteriores de WEB-083.
- `?preview=birthday` y `#birthday-preview` se conservan para la revisión original de WEB-081.
