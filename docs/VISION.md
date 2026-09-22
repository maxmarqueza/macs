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

No hay manual de marca; esto es lo que ya está implementado en `src/app/page.tsx` y
`src/components/hero/` y sirve como fuente para derivar favicon, og:image y material nuevo sin
tener que preguntar:

| Elemento | Valor |
|---|---|
| Acento / color de marca | `sky` de Tailwind (`sky-400` en textos y detalles, `sky-500` en botones, `sky-600` en enlaces) |
| Base | escala `neutral` (fondo `neutral-950` en el hero, grises para el resto) |
| Estado "Activo" | `emerald` (badge del roster) |
| Tipografía | **Geist** (sans) y **Geist Mono**, cargadas con `next/font` en `layout.tsx` |
| Tono | desde el 22 de septiembre de 2026 la portada usa el diseño de handstouch (blanco, Inter + Outfit, video ambiental 4K y manos humana y robótica de `public/media/` cuyo acercamiento lo controla el scroll, con parallax) con textos de MACS: «inteligencia hecha humana», «Un Mc para cada área», McMarketing y Mc en camino. El concepto, el roster completo y el contacto salieron de la portada. La ficha `/agentes/mcmarketing` conserva la identidad anterior (claro, acento `sky`) |
| Ícono / logo | una **"M"** de trazo redondeado en `sky-400` sobre un cuadrado `neutral-950` con brillo sutil arriba (`src/app/icon.svg`, desde septiembre 2026). De ahí salen favicon, ícono de iOS, `logo.png` y la og:image |

## Público objetivo

Negocios en México que quieren automatizar operaciones con IA sin contratar un equipo técnico.

## Descartado

- **Criptomoneda propia / token $MACS.** Se evaluó en agosto de 2026 (se llegó a escribir un
  contrato ERC-20 sobre Base en una rama aparte). En septiembre de 2026 Max decidió **no**
  crear la criptomoneda. No forma parte de la visión de la marca; no retomar el tema.
