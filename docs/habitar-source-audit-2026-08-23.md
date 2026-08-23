# Auditoría de fuentes de habITar

Fecha: 2026-08-23  
Alcance: documentación disponible en Google Drive para sustentar el caso público de portfolio.

## Objetivo

Establecer qué fuentes son canónicas, qué afirmaciones pueden publicarse y qué material requiere anonimización o aprobación explícita. La disponibilidad en Drive resuelve el acceso a las fuentes; no equivale a permiso de publicación de datos personales, capturas o videos.

## Fuentes canónicas revisadas

Se priorizaron las versiones finales y consolidadas sobre borradores, copias y archivos marcados como antiguos:

- Proyecto Final · E7 · Portafolio · habITar v5.2.
- Proyecto Final · versión final v6.0.
- Anexo 10 · Investigación UX, Design Thinking y Arquetipos de Usuario v1.2.
- Anexo 13 · Guía UAT v1.6.
- Anexo 20 · Informe Final de Pruebas v1.3.
- Anexo 29 · Evidencias de Gestión del Proyecto ClickUp v1.1.
- Anexos 2, 3, 4, 5, 9, 17, 19, 21, 28, 30, 31 y 32 de E7.
- Guía Única de Estudio · Defensa Final habITar.
- Presentación y guion de Defensa Final.
- Anteproyecto y anexos de relevamiento, riesgos, backlog e investigación UX, usados sólo para reconstruir la evolución.

En Drive existen duplicados, exportaciones PDF, documentos nativos y versiones antiguas. Ante contradicciones prevalecen E7/final, la guía consolidada verificada y la evidencia del producto real.

## Trazabilidad del caso público

| Sección del caso | Evidencia principal | Uso público |
| --- | --- | --- |
| Problema y contexto | Proyecto final, metodología de relevamiento, UX | Sí, en forma general y sin identificar a la cooperativa |
| Research | Anexo 10, metodología de relevamiento | Sí, describiendo técnicas y aprendizajes |
| Prototipo Lovable | Anexo 10, evidencia de gestión y defensa | Sí, diferenciándolo del producto final |
| Priorización y alcance | Backlog, trazabilidad, riesgos | Sí, con decisiones y criterios |
| Validación | Guía UAT e investigación UX | Sí, con resultados agregados y anonimizados |
| Calidad | Plan de testing, informe final, métricas QA | Sí, con cifras canónicas verificadas |
| Arquitectura y seguridad | Anexos técnicos y defensa | Sólo a nivel explicativo; sin secretos ni detalles operativos sensibles |
| Capturas y video | Presentaciones, manuales y materiales de defensa | Pendiente de selección, saneamiento y aprobación explícita |

## Hallazgos

1. El proceso de producto está suficientemente documentado para contar problema → investigación → prototipo → validación → priorización → MVP → QA.
2. El prototipo en Lovable debe presentarse como herramienta de aprendizaje, no como producto final.
3. La documentación permite diferenciar con claridad el prototipo del sistema funcional en staging.
4. Las cifras públicas deben tomarse de las fuentes finales: 63 requisitos *must have*, 226 casos manuales y más de 2.700 pruebas automatizadas.
5. Hay material visual reutilizable, pero contiene potencialmente nombres, rostros, correos, datos de la cooperativa, datos operativos o pantallas con información identificable.
6. Se detectó y corrigió en el PR una filtración de contexto: el tamaño exacto de la cooperativa. También se eliminó el nombre de una especialista porque la existencia del documento en Drive no prueba autorización de publicación.
7. Los duplicados y borradores no deben citarse como fuente final ni usarse para resolver contradicciones.

## Política de publicación

Puede publicarse sin autorización adicional:

- descripción general del problema;
- métodos de investigación;
- aprendizajes y decisiones;
- rol de Romina y distribución general de responsabilidades;
- métricas finales agregadas ya verificadas;
- distinción entre prototipo y producto funcional.

Requiere anonimización previa:

- nombre de la cooperativa;
- tamaño exacto o combinaciones que faciliten su identificación;
- nombres de participantes o especialistas sin consentimiento de publicación;
- testimonios, respuestas, datos de contacto y datos financieros;
- capturas con perfiles, correos, unidades, movimientos o identificadores.

Requiere aprobación explícita de Romina antes de publicar:

- video del producto o de la defensa;
- capturas del prototipo o del producto;
- logos de terceros o de la cooperativa;
- citas textuales atribuibles;
- cualquier material donde la anonimización pueda reducirse por contexto.

## Estado de WEB-074

La fase textual queda respaldada por Drive y puede completarse con contenido anonimizado. La fase multimedia sigue bloqueada hasta seleccionar, sanear y aprobar video y capturas. El ticket no debe cerrarse como completo mientras esos criterios sigan pendientes.
