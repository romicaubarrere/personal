# Contrato de medici&oacute;n

## Estado

- Ticket: WEB-062
- Proveedor propuesto: Plausible Analytics Cloud, todav&iacute;a desactivado
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
| `project_case_open` | Abrir un caso desde el lomo o su resumen. No identifica qu&eacute; proyecto fue abierto. |
| `view_projects_click` | Activar “Ver proyectos” en el hero. |

## Eventos reservados

`cv_download`, `contact_calendar_click` y `contact_instagram_click` se incorporar&aacute;n solo cuando esos destinos existan y hayan sido aprobados. No se publican atributos para controles pendientes.

Los contactos recibidos, propuestas de proyecto e invitaciones a charlas no se deducen de clics. Se registran manualmente con el formato definido en [Resultados de la medici&oacute;n](./analytics-outcomes.md).

## Integraci&oacute;n futura

La pol&iacute;tica publicada propone Plausible Analytics Cloud, pero el adaptador externo contin&uacute;a fuera de esta capa hasta aprobar proveedor, plan y retenci&oacute;n. Antes de conectarlo se debe verificar la configuraci&oacute;n en producci&oacute;n y mantener esta lista como fuente de verdad. No se agregan eventos desde un proveedor mediante selectores de texto o URLs: primero se declara el atributo en el componente y se actualizan contrato y pruebas.
