# Modelo privado de métricas del portfolio

Estado: decisión vigente desde el 3 de septiembre de 2026. Reemplaza la idea de construir un back office propio de WEB-065.

## Decisión

No se construye ni publica una ruta privada dentro de GitHub Pages. Una URL difícil de adivinar no es autenticación y el repositorio es público, por lo que un panel propio agregaría riesgo, mantenimiento y eventualmente costo sin mejorar la medición actual.

El modelo queda dividido en dos fuentes privadas y gratuitas:

1. **Umami Cloud**: dashboard autenticado del proveedor para pageviews y eventos automáticos del portfolio.
2. **Registro manual de outcomes**: archivo privado/local con el esquema de `analytics-outcomes.md` para contactos, propuestas e invitaciones. El repositorio publica únicamente el contrato, nunca los resultados reales.

No se intenta unir ambas fuentes en una página pública ni se copian datos de oportunidades al repositorio.

## Las cinco métricas

| Métrica | Fuente | Tipo |
| --- | --- | --- |
| Contactos recibidos | Registro manual | Outcome |
| Propuestas de proyectos | Registro manual | Outcome |
| Invitaciones a charlas | Registro manual | Outcome |
| Aperturas de casos de proyecto | Umami `project_case_open` | Evento automático |
| Descargas del CV | Umami `contact_cv_download` | Evento automático |

Los períodos configurables se resuelven con los filtros temporales del dashboard de Umami y filtrando `fecha` en el registro manual. Las dos fuentes mantienen definiciones estables y no requieren almacenar nombres, emails, empresas o mensajes.

## Por qué no unificarlas ahora

Un panel combinado necesitaría una tercera infraestructura con autenticación, almacenamiento y sincronización. Para el volumen actual no aporta una decisión adicional: las interacciones responden “qué contenido se usa” y los outcomes responden “qué oportunidades llegaron”. Mantener ambas señales separadas evita convertir correlación en causalidad.

Si en el futuro el volumen de oportunidades justifica automatizar esa unión, el criterio para reabrir esta decisión es contar con un servicio privado autenticado que pueda leer ambas fuentes sin exponer secretos ni datos personales en el cliente.

## Privacidad y operación

- El ID público de Umami no concede acceso al dashboard.
- No se usa `umami.identify()` ni perfiles de visitantes.
- El registro real de outcomes no se commitea.
- No se registran datos personales innecesarios.
- Un fallo del dashboard de Umami no afecta la web pública.
- Un fallo o ausencia del registro manual tampoco afecta el sitio.

Referencias: `analytics-events.md`, `analytics-outcomes.md` y `privacy.md`.
