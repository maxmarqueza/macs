# PROGRESS — Estado del proyecto y traspaso de sesión

> **Propósito:** este archivo permite a cualquier sesión de Claude (local o en la nube)
> retomar el trabajo exactamente donde quedó. **Leerlo antes de trabajar** y actualizarlo
> al final de cada sesión.

**Última actualización:** 2026-09-06 (auditoría de traspaso)
**Estado general:** ✅ Fase 1 completa — sitio en producción en https://macstech.mx
**Rama de trabajo:** `main` (limpia y sincronizada con `origin/main`)

## Infraestructura (verificada el 2026-09-06 — no tocar)

| Pieza | Detalle | Verificación |
|---|---|---|
| Dominio | macstech.mx, comprado en GoDaddy (agosto 2026) | — |
| DNS | GoDaddy: `A @ → 216.150.1.1` · `CNAME www → macstech.mx.` | `dig` ✅ |
| Repo | github.com/maxmarqueza/macs (público), rama `main` | ✅ |
| Deploy | Vercel · team **imaxmx** (Pro) · proyecto **macs** (`prj_0QPK0kW8u9T58DflUkRNVpP4j5K9`) | último deploy `READY` ✅ |
| Runtime en Vercel | Node 24.x, framework Next.js | ✅ |
| Dominios en Vercel | `macstech.mx` (Production) · `www.macstech.mx` (redirect 308 → apex) · `macs-murex.vercel.app` · `macs-git-main-imaxmx.vercel.app` | apex 200 ✅ · www 308 ✅ |
| SSL | Emitido y activo | ✅ |
| CI/CD | **Cada push a `main` despliega a producción** (~1 min) | ✅ |

## Stack y versiones (al 2026-09-06)

- Next.js **16.3.4** (App Router, Turbopack) · React 19.2.8 · Tailwind CSS 4 · TypeScript 5.9.3
- Local: Node v24.18.1, npm 11.16.0 · `npm audit`: **0 vulnerabilidades**
- `npm run build` ✅ · `npm run lint` ✅ (sin errores)
- Versiones de `next` y `eslint-config-next` **fijadas exactas** a propósito (sin `^`).
- Versión de Node fijada en el repo: `engines.node >= 20.9.0` en `package.json` + `.nvmrc` (24, igual que Vercel).
- **CI en GitHub Actions** (`.github/workflows/ci.yml`): corre `npm ci`, `lint` y `build` en cada push y PR a `main`.

### Actualizaciones mayores pendientes (decisión, no urgencia)
No se aplicaron por ser cambios de versión mayor con riesgo de romper el build:
`eslint 9 → 10`, `typescript 5 → 7`, `@types/node 20 → 26`.

## Cómo trabajar

1. `npm install && npm run dev` → http://localhost:3000
2. Editar → verificar → `npm run build` (debe pasar) → commit → push a `main` → producción.
3. **Después del push, verificar que el deploy salió READY** — Vercel conserva el último deploy bueno,
   así que un build roto NO tumba el sitio, pero tampoco publica el cambio y pasa inadvertido.
   (Ya pasó una vez: el deploy `dpl_4Rgz86UJfGTym6YYrXeEWv9oZbKv` quedó en `ERROR`.)
4. Al cerrar sesión: actualizar `CHANGELOG.md`, `docs/ROADMAP.md` y **este archivo**.

## Dónde vive cada cosa

- Roster de agentes (fuente única): `src/data/agents.ts` — McMarketing (activo), McSoporte / McVentas / McDatos (próximamente)
- Landing completa: `src/app/page.tsx` — una sola página: hero, "¿Qué es un Mc?", roster, contacto (`mailto:contacto@macstech.mx`), footer. Anclas `#agentes` y `#contacto`.
- Metadata/SEO: `src/app/layout.tsx` (og tags básicos, `metadataBase` = macstech.mx, `locale: es_MX`)
- Concepto de marca: `docs/VISION.md` · Plan: `docs/ROADMAP.md` · Ficha por agente: `docs/AGENTES/`
- Instrucciones para Claude: `CLAUDE.md` (+ `AGENTS.md`, generado por `next dev` — no borrar)

## Siguientes pasos (en orden de impacto — Fase 2)

1. **Habilitar el correo de `macstech.mx`.** 🔴 **Bloqueado por una decisión de Max, no por información.**
   Hecho verificado el 2026-09-06: el dominio **no tiene registros MX ni SPF**, así que
   `contacto@macstech.mx` **no recibe correo** — y hoy es el único canal de contacto del sitio
   (`src/app/page.tsx`, `mailto:`). Cualquiera que escriba, rebota.
   La pregunta a Max no es "¿existe el buzón?" sino **"¿dónde quieres el correo?"**
   (Google Workspace, Zoho, el correo incluido de GoDaddy…). Después: alta de MX + SPF/DKIM en GoDaddy.
   Alternativa rápida: sustituir el `mailto:` por WhatsApp y quitar el correo hasta que funcione.
2. **Botón de WhatsApp** en contacto. 🔴 **Bloqueado:** falta que Max dé el número.
   Resuelve también el punto 1 de forma provisional.
3. **Página de McMarketing** (`/agentes/mcmarketing`) con el caso de éxito del flujo n8n.
   🔴 **Bloqueado:** falta info de Max (ver `docs/AGENTES/McMarketing.md`).
4. **Favicon + og:image** con la marca MACS (hoy sigue el favicon default de Next.js).
   🟢 Se puede hacer ya: la identidad visual de facto está registrada en `docs/VISION.md`
   (acento `sky`, escala `neutral`, `emerald` para "Activo", tipografía Geist).
5. **SEO:** `sitemap.ts`, `robots.ts` y JSON-LD de organización. 🟢 Se puede hacer ya.
6. **Vercel Analytics** (`@vercel/analytics`). 🟢 Se puede hacer ya.

> Si Max no está disponible, arrancar por 4, 5 y 6: no dependen de nadie.

## Decisiones tomadas (no revertir sin razón)

- Dominio canónico: **macstech.mx** (apex, sin www) — www redirige 308 al apex.
- Idioma del sitio y de la comunicación con Max: **español (México)**.
- Marca: "MACS" = muchos **Mc**; cada Mc es un agente IA con nombre, personalidad y especialidad.
- Stack sin backend por ahora: sitio estático/SSG en Next.js App Router; sin variables de entorno.
- ❌ **Criptomoneda / token $MACS: descartado (2026-09-06).** Max decidió que **no** va a crear
  la criptomoneda. Existe una rama vieja sin fusionar en GitHub,
  `claude/crear-criptomoneda-propia-8a300q` (10 de agosto: contrato ERC-20 sobre Base, tests,
  `docs/CRIPTOMONEDA.md`, carpeta `token/`). **No fusionarla a `main` ni retomar el tema.**
  Se conserva solo como archivo histórico.

## Contexto del usuario

Max (maxmarqueza en GitHub, team Vercel "imaxmx") es emprendedor en México con varios proyectos
web en Vercel. Construye automatizaciones con n8n.

## Pendientes de información (preguntar a Max)

- [ ] Número de WhatsApp para el botón de contacto.
- [ ] McMarketing: ¿qué redes cubre? ¿qué IA genera el contenido? ¿resultados medibles?
- [ ] **¿Dónde quieres el correo de macstech.mx?** Ya no es una duda: está comprobado que el dominio
      no tiene MX ni SPF y que `contacto@macstech.mx` **no recibe nada**. Falta que Max elija proveedor
      (ver siguiente paso 1).
