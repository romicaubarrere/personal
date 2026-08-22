# Resultados de la medici&oacute;n

Los clics ayudan a entender el recorrido dentro del portfolio, pero no prueban que haya existido una oportunidad profesional. Los resultados se registran manualmente cuando ocurren y luego pueden alimentar el back office privado de WEB-065.

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

## Lectura

Las cifras se observan de forma acumulativa y por per&iacute;odos configurables. Las aperturas de casos y descargas del CV provienen de eventos autom&aacute;ticos; contactos, propuestas e invitaciones provienen de este registro manual. El CV y sus eventos permanecen ausentes hasta que WEB-085 publique un archivo aprobado.
