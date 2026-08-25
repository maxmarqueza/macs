# PROGRESS — Estado del proyecto y traspaso de sesión

> **Propósito:** este archivo permite a cualquier sesión de Claude (local o en la nube)
> retomar el trabajo exactamente donde quedó. Mantenerlo actualizado al final de cada sesión.

**Última actualización:** 2026-08-25
**Estado general:** ✅ Fase 1 completa — sitio en producción en https://macstech.mx

## Infraestructura (todo funcionando, no tocar)

| Pieza | Detalle |
|---|---|
| Dominio | macstech.mx, comprado en GoDaddy (agosto 2026) |
| DNS | GoDaddy: registro `A @ → 216.150.1.1` (IP nueva de Vercel); `CNAME www → macstech.mx.` |
| Repo | github.com/maxmarqueza/macs (público), rama `main` |
| Deploy | Vercel, team **imaxmx** (Pro), proyecto **macs** → macs-murex.vercel.app |
| Dominios en Vercel | `macstech.mx` (Production) · `www.macstech.mx` (redirect 308 → apex) · SSL activo |
| CI/CD | **Cada push a `main` despliega automáticamente a producción** (~1 min) |

## Cómo trabajar

1. `npm install && npm run dev` → http://localhost:3000
2. Editar → verificar → `npm run build` (debe pasar) → commit → push a `main` → producción.
3. Al cerrar sesión de trabajo: actualizar `CHANGELOG.md`, `docs/ROADMAP.md` y este archivo.

## Dónde vive cada cosa

- Roster de agentes (fuente única): `src/data/agents.ts` — McMarketing (activo), McSoporte/McVentas/McDatos (próximamente, propuestos)
- Landing completa: `src/app/page.tsx` (una sola página con anclas #agentes y #contacto)
- Metadata/SEO: `src/app/layout.tsx` (og tags básicos ya configurados, `metadataBase` = macstech.mx)
- Concepto de marca: `docs/VISION.md` · Plan: `docs/ROADMAP.md` · Ficha por agente: `docs/AGENTES/`

## Siguientes pasos (en orden de impacto — Fase 2)

1. **Botón de WhatsApp** en la sección de contacto, reemplazando o acompañando el `mailto:`.
   ⚠️ Falta que Max proporcione el número de WhatsApp.
2. **Página de McMarketing** (`/agentes/mcmarketing`) con el caso de éxito del flujo n8n.
   ⚠️ Falta info de Max: qué redes cubre (¿IG/FB/TikTok/X?), qué IA usa, resultados (posts/semana, tiempo ahorrado).
3. **Favicon + og:image** con la marca MACS (hoy sigue el favicon default de Next.js).
4. Formulario de contacto o link directo a WhatsApp en lugar de solo correo.
5. SEO: sitemap, robots, JSON-LD de organización.

## Decisiones tomadas (no revertir sin razón)

- Dominio canónico: **macstech.mx** (apex, sin www) — el www redirige 308 al apex.
- Idioma del sitio y de la comunicación con Max: **español (México)**.
- Marca: "MACS" = muchos **Mc**; cada Mc es un agente IA con nombre, personalidad y especialidad.
- Stack sin backend por ahora: sitio estático/SSG en Next.js App Router; sin variables de entorno.

## Contexto del usuario

Max (maxmarqueza en GitHub, team Vercel "imaxmx") es emprendedor en México con varios proyectos
web en Vercel. Construye automatizaciones con n8n. El correo de contacto del sitio es
contacto@macstech.mx (⚠️ verificar que ese buzón exista/reciba correo — no se ha confirmado).
