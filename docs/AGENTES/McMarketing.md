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
- Entrada en el catálogo `src/data/agents.ts` (slug `mcmarketing`, estado `disponible`: es el único Mc
  que se vende hoy).
- Desde el 2026-09-23 su página [McMarketing](https://macstech.mx/agentes/mcmarketing) usa la misma
  plantilla blanca que el resto de las fichas (`src/components/site/McDetail.tsx`), con los mismos
  textos y preguntas frecuentes de antes.
- La ficha presenta publicación diaria, respuestas a comentarios y DMs, uso de n8n y preguntas
  frecuentes. Incluye diseño adaptable y metadata propia; no afirma redes, herramientas de IA,
  clientes ni resultados todavía no documentados.
- **Estado del avance (2026-09-10):** publicada con el commit `ecfe86f`; lint, build, navegador
  y CI aprobados. HTTP 200 y metadata comprobados en producción.

## 🔴 Pendientes de información para el caso de éxito
La ficha funcional ya está publicada con los datos actuales. Para ampliar detalles y documentar
un caso de éxito hacen falta:

- [ ] ¿Qué redes cubre? (Instagram, Facebook, TikTok, X…)
- [ ] ¿Qué IA genera el contenido y las respuestas?
- [ ] Resultados medibles: posts por semana, tiempo ahorrado, comentarios/DMs atendidos.
- [ ] Capturas del flujo n8n para ilustrar el caso de éxito.
- [ ] ¿Hay algún cliente que se pueda nombrar, o va anónimo?
