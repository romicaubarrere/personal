# Resultados de la medici&oacute;n

Los clics ayudan a entender el recorrido dentro del portfolio, pero no prueban que haya existido una oportunidad profesional. Los resultados se registran manualmente cuando ocurren y se consultan con el modelo privado definido en [Modelo privado de m&eacute;tricas](./metrics-private-model.md). WEB-065 queda resuelto por ese modelo sin crear una ruta est&aacute;tica que simule autenticaci&oacute;n.

## Formato

```csv
fecha,resultado,origen,estado,notas
```

- `fecha`: d&iacute;a del resultado en formato `AAAA-MM-DD`.
- `resultado`: uno de `contacto_recibido`, `propuesta_proyecto` o `invitacion_charla`.
- `origen`: `portfolio`, `linkedin`, `referencia`, `evento` u `otro`.
- `estado`: `recibido`, `en_conversacion`, `aceptado` o `cerrado`.
- `notas`: contexto breve y opcional, sin datos que identifiquen a la persona o empresa.

No registrar nombres, emails, tel&eacute;fonos, mensajes completos, empresas ni informaci&oacute;n confidencial. Un mismo resultado se carga una sola vez y cambia de estado sobre la misma fila para evitar duplicados.

El archivo real con outcomes se mantiene privado y no se commitea. El repositorio conserva solamente este esquema y las definiciones de las m&eacute;tricas.

## Lectura

Las cifras se observan de forma acumulativa y por per&iacute;odos configurables. Las aperturas de casos y descargas del CV provienen de los eventos autom&aacute;ticos `project_case_open` y `contact_cv_download`; contactos, propuestas e invitaciones provienen de este registro manual. No se deduce una oportunidad a partir de un clic ni se intenta identificar a la persona que interactu&oacute; con el sitio.
