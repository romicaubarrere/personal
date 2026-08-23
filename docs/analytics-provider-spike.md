# Spike de proveedor de anal&iacute;tica

## Restricci&oacute;n

La soluci&oacute;n no puede generar costos. Debe respetar la privacidad, funcionar con GitHub Pages y admitir los eventos personalizados definidos en WEB-062.

## Comparaci&oacute;n

| Opci&oacute;n | Costo | Eventos personalizados | Privacidad | Decisi&oacute;n |
| --- | --- | --- | --- | --- |
| Plausible Analytics Cloud | Pago despu&eacute;s de la prueba | S&iacute; | Sin cookies | Descartado: no tiene plan gratuito. |
| Cloudflare Web Analytics | Gratuito | No | Sin datos personales | Descartado para WEB-062: no puede recibir las interacciones definidas. |
| Umami Cloud Hobby | Gratuito | S&iacute; | Sin cookies ni datos personales | Seleccionado. |

## Decisi&oacute;n

Usar el plan Hobby gratuito de Umami Cloud, elegir la regi&oacute;n europea y no habilitar replays ni heatmaps. La integraci&oacute;n solo enviar&aacute; nombres de eventos, ruta sin query ni fragmento y tipo sem&aacute;ntico del control. No se enviar&aacute;n nombres, emails, empresas, texto visible ni URLs de destino.

La activaci&oacute;n requiere crear el sitio en Umami Cloud y obtener su identificador p&uacute;blico. Antes de publicar el script se debe confirmar la retenci&oacute;n efectiva del plan y ejecutar una verificaci&oacute;n real en producci&oacute;n. No se introducir&aacute; una tarjeta de pago ni se actualizar&aacute; a un plan pago.

## Por qu&eacute; conviene para este portfolio

Umami aporta valor si responde preguntas de producto concretas:

- qu&eacute; casos de estudio despiertan m&aacute;s inter&eacute;s;
- cu&aacute;ntas visitas llegan a una acci&oacute;n de contacto;
- qu&eacute; idioma y dispositivo requieren m&aacute;s atenci&oacute;n;
- qu&eacute; rutas reciben tr&aacute;fico y cu&aacute;les permanecen invisibles.

Su script pesa menos de 2 KB, el plan Hobby est&aacute; dirigido a proyectos personales de poco tr&aacute;fico, admite los eventos ya definidos y permite exportar todo a CSV. Tambi&eacute;n ofrece una API, por lo que los datos podr&aacute;n alimentar WEB-065 sin depender de copiar cifras a mano.

## L&iacute;mites y riesgos

- Cada vista, evento personalizado y propiedad guardada consume uso. Para cuidar el plan gratuito no se enviar&aacute;n propiedades adicionales salvo que exista una pregunta de producto que las necesite.
- La documentaci&oacute;n p&uacute;blica confirma que Hobby es gratuito, pero no publica all&iacute; un l&iacute;mite num&eacute;rico ni un per&iacute;odo de conservaci&oacute;n. Ambos valores se deben registrar desde la cuenta antes de activar el script.
- Bloqueadores de contenido pueden impedir la medici&oacute;n. Las cifras representan tendencias, no un censo exacto.
- Con poco tr&aacute;fico, porcentajes y comparaciones pueden ser inestables. No se tomar&aacute;n decisiones por una variaci&oacute;n aislada.
- Los filtros por IP son una funci&oacute;n Pro. Las visitas propias se deben evitar durante QA mediante el modo de simulaci&oacute;n o bloqueando el script en entornos no productivos, sin pagar por esa funci&oacute;n.
- El proveedor puede modificar las condiciones futuras del plan gratuito. La exportaci&oacute;n peri&oacute;dica reduce el riesgo de dependencia.

## Alcance inicial recomendado

Activar solamente vistas de p&aacute;gina y los eventos ya definidos para contacto, Ver proyectos y apertura de casos. No agregar datos de evento, reproducciones, mapas de calor ni identificadores de sesi&oacute;n propios.

Revisar el resultado a los 90 d&iacute;as:

- conservar Umami si permite decidir qu&eacute; contenido mejorar o priorizar;
- simplificar los eventos si solo produce datos que no cambian decisiones;
- retirarlo si el volumen es demasiado bajo o el plan deja de ser gratuito.

La alternativa de no instalar anal&iacute;tica sigue siendo v&aacute;lida. Umami se recomienda porque el portfolio tiene objetivos medibles de contacto y lectura de casos, no porque toda web necesite anal&iacute;tica.

## Fuentes verificadas el 23/08/2026

- [Umami Cloud documenta que Hobby es completamente gratuito](https://docs.umami.is/docs/cloud/faq).
- [Umami documenta eventos personalizados mediante atributos o JavaScript](https://docs.umami.is/docs/track-events).
- [Umami declara que funciona sin cookies y sin recopilar datos personales](https://umami.is/privacy).
- [Umami documenta un script de menos de 2 KB](https://docs.umami.is/docs) y [la exportaci&oacute;n completa a CSV](https://docs.umami.is/docs/cloud/export-data).
- [Umami Cloud ofrece una API con regi&oacute;n europea](https://docs.umami.is/docs/cloud/api-key).
- [Los filtros por IP comienzan en el plan Pro](https://docs.umami.is/docs/cloud/ip-filters).
- [Cloudflare documenta Web Analytics como gratuito](https://developers.cloudflare.com/web-analytics/about/), pero [confirma que todav&iacute;a no admite eventos personalizados](https://developers.cloudflare.com/web-analytics/faq/).
- [Plausible confirma que no ofrece plan gratuito](https://plausible.io/contact).
