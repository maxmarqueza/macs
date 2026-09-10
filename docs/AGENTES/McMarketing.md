# McMarketing

**Especialidad:** Marketing automatizado en redes sociales.
**Estado:** ✅ Activo (es el único Mc funcionando hoy).

## Qué hace
- Publica contenido automáticamente todos los días en redes sociales.
- Responde comentarios automáticamente.
- Responde DMs automáticamente.

## Stack
- **n8n** (flujo de automatización)

## Cómo aparece en el sitio
- Ficha en el roster de la landing, definida en `src/data/agents.ts` (slug `mcmarketing`).
- Página propia implementada y validada: `/agentes/mcmarketing`, enlazada mediante el `href` del roster.
- La ficha presenta publicación diaria, respuestas a comentarios y DMs, uso de n8n y preguntas
  frecuentes. Incluye diseño adaptable y metadata propia; no afirma redes, herramientas de IA,
  clientes ni resultados todavía no documentados.
- **Estado del avance (2026-09-10):** lint, build y navegador aprobados; publicación pendiente.

## 🔴 Pendientes de información para el caso de éxito
La ficha funcional puede publicarse con los datos actuales. Para ampliar detalles y documentar
un caso de éxito hacen falta:

- [ ] ¿Qué redes cubre? (Instagram, Facebook, TikTok, X…)
- [ ] ¿Qué IA genera el contenido y las respuestas?
- [ ] Resultados medibles: posts por semana, tiempo ahorrado, comentarios/DMs atendidos.
- [ ] Capturas del flujo n8n para ilustrar el caso de éxito.
- [ ] ¿Hay algún cliente que se pueda nombrar, o va anónimo?
