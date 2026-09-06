# MACS — Visión

**Dominio:** macstech.mx (comprado en GoDaddy, agosto 2026)
**Deploy:** Vercel + GitHub

## Concepto

**MACS** = muchos **Mc** ("Mac" abreviado). Cada **Mc** es un agente de IA especializado — software, o hardware con software — que resuelve un tipo de problema tecnológico para empresas y personas.

La marca funciona como una **familia de agentes**: cada servicio de la empresa se personifica como un Mc con nombre propio, personalidad y especialidad.

## Agentes (roster inicial)

| Agente | Especialidad | Estado |
|---|---|---|
| **McMarketing** | Automatización de redes sociales: publica diario, responde comentarios y DMs (flujo en n8n) | ✅ Funcionando |

> Agregar aquí cada nuevo Mc conforme se defina.

## Ideas de futuros Mc (por validar)

- McSoporte — soporte técnico / helpdesk IA
- McVentas — seguimiento de leads y cotizaciones
- McDatos — reportes y análisis automatizados
- McWeb — sitios web / landing pages
- McHardware — soluciones IoT / hardware con software

## Identidad visual (de facto)

No hay manual de marca; esto es lo que ya está implementado en `src/app/page.tsx` y sirve como
fuente para derivar favicon, og:image y material nuevo sin tener que preguntar:

| Elemento | Valor |
|---|---|
| Acento / color de marca | `sky` de Tailwind (`sky-400` en textos y detalles, `sky-500` en botones, `sky-600` en enlaces) |
| Base | escala `neutral` (fondo `neutral-950` en el hero, grises para el resto) |
| Estado "Activo" | `emerald` (badge del roster) |
| Tipografía | **Geist** (sans) y **Geist Mono**, cargadas con `next/font` en `layout.tsx` |
| Tono | oscuro en el hero, claro en el cuerpo |

## Público objetivo

Negocios en México que quieren automatizar operaciones con IA sin contratar un equipo técnico.

## Descartado

- **Criptomoneda propia / token $MACS.** Se evaluó en agosto de 2026 (se llegó a escribir un
  contrato ERC-20 sobre Base en una rama aparte). En septiembre de 2026 Max decidió **no**
  crear la criptomoneda. No forma parte de la visión de la marca; no retomar el tema.
