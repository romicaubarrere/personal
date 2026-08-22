# Contrato de medici&oacute;n

## Estado

- Ticket: WEB-099
- Proveedor: pendiente de selecci&oacute;n
- Transporte actual: evento local del navegador `portfolio:analytics`

La portada emite un evento local cuando una persona activa un elemento con `data-analytics-event`. Esta capa no carga servicios externos, no guarda informaci&oacute;n y no env&iacute;a datos fuera del navegador. Un proveedor podr&aacute; conectarse m&aacute;s adelante escuchando el evento sin modificar los componentes del sitio.

## Propiedades permitidas

- `name`: identificador estable en `snake_case` tomado de `data-analytics-event`.
- `path`: ruta del documento, sin query string ni fragmento.
- `target_kind`: tipo sem&aacute;ntico del control activado, por ejemplo `a` o `button`.

No se incluyen texto visible, URL de destino, direcci&oacute;n de email, contenido libre, identificadores personales ni par&aacute;metros de la URL.

## Eventos publicados

| Evento | Acci&oacute;n |
| --- | --- |
| `persistent_contact_click` | Activar la pesta&ntilde;a persistente que lleva a Contacto. |
| `contact_email_click` | Activar el enlace de email aprobado. |
| `contact_linkedin_click` | Activar el enlace al LinkedIn aprobado. |

## Integraci&oacute;n futura

La selecci&oacute;n de GA4, PostHog u otro proveedor queda fuera de WEB-099. Antes de conectarlo se debe revisar su configuraci&oacute;n de privacidad, documentar el destino de los datos y mantener esta lista como fuente de verdad. No se agregan eventos desde un proveedor mediante selectores de texto o URLs: primero se declara el atributo en el componente y se actualizan contrato y pruebas.
