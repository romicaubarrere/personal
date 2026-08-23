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

## Fuentes verificadas el 23/08/2026

- [Umami Cloud documenta que Hobby es completamente gratuito](https://docs.umami.is/docs/cloud/faq).
- [Umami documenta eventos personalizados mediante atributos o JavaScript](https://docs.umami.is/docs/track-events).
- [Umami declara que funciona sin cookies y sin recopilar datos personales](https://umami.is/privacy).
- [Cloudflare documenta Web Analytics como gratuito](https://developers.cloudflare.com/web-analytics/about/), pero [confirma que todav&iacute;a no admite eventos personalizados](https://developers.cloudflare.com/web-analytics/faq/).
- [Plausible confirma que no ofrece plan gratuito](https://plausible.io/contact).
