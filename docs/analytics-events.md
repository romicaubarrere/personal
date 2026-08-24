# Contrato de medici&oacute;n

## Estado

- Ticket: WEB-062
- Proveedor activo: plan Hobby gratuito de Umami Cloud, regi&oacute;n europea
- Sitio: `Portfolio` para `romicaubarrere.github.io`
- Retenci&oacute;n: 6 meses
- Transporte: evento local `portfolio:analytics` conectado al tracker oficial de Umami

La portada emite un evento local cuando una persona activa un elemento con `data-analytics-event`. El adaptador escucha ese contrato y llama a `umami.track()` con el nombre y las dos propiedades permitidas. El tracker se carga en todas las rutas, restringido al dominio productivo, sin query strings ni fragmentos y respetando la preferencia Do Not Track.

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
| `contact_cv_download` | Descargar el curr&iacute;culum aprobado en PDF. |
| `contact_linkedin_click` | Activar el enlace al LinkedIn aprobado. |
| `project_case_open` | Abrir un caso desde el lomo o su resumen. No identifica qu&eacute; proyecto fue abierto. |
| `view_projects_click` | Activar “Ver proyectos” en el hero. |

## Eventos reservados

`cv_download`, `contact_calendar_click` y `contact_instagram_click` se incorporar&aacute;n solo cuando esos destinos existan y hayan sido aprobados. No se publican atributos para controles pendientes.

Los contactos recibidos, propuestas de proyecto e invitaciones a charlas no se deducen de clics. Se registran manualmente con el formato definido en [Resultados de la medici&oacute;n](./analytics-outcomes.md).

## Integraci&oacute;n productiva

El sitio usa el plan Hobby gratuito de Umami Cloud, con regi&oacute;n europea, un sitio, hasta 100.000 eventos mensuales y 6 meses de retenci&oacute;n. No se contrat&oacute; un plan pago ni se ingres&oacute; una tarjeta. El identificador del sitio es p&uacute;blico y no concede acceso al panel.

Umami registra p&aacute;ginas vistas y el contexto agregado que documenta su tracker: hostname, idioma del navegador, referrer, pantalla, t&iacute;tulo y ruta. Los eventos personalizados agregan &uacute;nicamente `path` y `target_kind`. No se llama a `umami.identify()`, no se crean perfiles y no se env&iacute;an nombres, emails, texto visible, destinos de enlaces, query strings ni fragmentos.

No se agregan eventos desde el proveedor mediante selectores de texto o URLs: primero se declara el atributo en el componente y se actualizan contrato y pruebas.
