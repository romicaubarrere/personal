# Fechas especiales

- Tickets auditados: WEB-081 y WEB-082
- Zona horaria de referencia: `America/Montevideo`
- Duración: solo el día correspondiente

## Fechas activas

| Celebración | Fecha | Simulación |
| --- | --- | --- |
| Cumpleaños | 13 de mayo | `?special=birthday` |
| Fecha patria | 19 de abril | `?special=patria-19-abril` |
| Fecha patria | 18 de mayo | `?special=patria-18-mayo` |
| Fecha patria | 19 de junio | `?special=patria-19-junio` |
| Fecha patria | 18 de julio | `?special=patria-18-julio` |
| Fecha patria | 25 de agosto | `?special=patria-25-agosto` |
| Halloween | 31 de octubre | `?special=halloween` |

La simulación se resuelve únicamente desde la URL actual: no cambia la fecha del dispositivo, no guarda estado y no queda activa para otras visitas. El parámetro anterior `?preview=birthday` y el hash `#birthday-preview` siguen funcionando para no romper la revisión original de WEB-081.

## Edad automática

La fecha de nacimiento es el 13 de mayo de 2003. La edad se calcula con la fecha de Montevideo y aumenta a partir del 13 de mayo de cada año.
