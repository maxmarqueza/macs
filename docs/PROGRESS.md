# PROGRESS — Estado del proyecto y traspaso de sesión

> **Propósito:** este archivo permite a cualquier sesión de Claude (local o en la nube)
> retomar el trabajo exactamente donde quedó. **Leerlo antes de trabajar** y actualizarlo
> al final de cada sesión.

**Última actualización:** 2026-09-09 (cierre de sesión, todo publicado)
**Estado general:** ✅ Fase 1 completa · ✅ Fase 2 (marca, SEO, analítica, CI) **fusionada a `main` y en producción** en https://macstech.mx
**Rama de trabajo:** `main` (limpia y sincronizada con `origin/main`). La rama `claude/continuar-proyecto-fkeuih` ya está fusionada (fast-forward) y se puede borrar.

## Para retomar en la siguiente sesión (leer primero)

**Nada quedó a medias.** Al cerrar la sesión del 2026-09-09 todo está fusionado a `main` y publicado:
el deploy de producción `dpl_DaiyjZYPvP2csg5c3XpKHEc8Ei97` (commit `946a214`) quedó `READY`, y el CI de
GitHub Actions corrió por primera vez en `main` y quedó en verde. Árbol de trabajo limpio, sin PR abierto.

Para retomar: `git checkout main && git pull && npm ci`, y seguir por "Siguientes pasos".

Queda por mirar en vivo desde un navegador (desde una sesión en la nube no se puede por el proxy):
`https://macstech.mx/opengraph-image`, `/sitemap.xml`, `/robots.txt`, `/icon.svg`, y la vista previa al
compartir el enlace (p. ej. en WhatsApp o con https://www.opengraph.xyz/). Si algo se viera mal, Vercel
conserva el deploy anterior (`fe594bb`) como candidato de rollback.

## Qué se publicó el 2026-09-09 (Fase 2)

Todo lo de los antiguos siguientes pasos 4, 5, 6 y 7 — favicon + og:image, SEO, Analytics y el CI —
más limpieza, un parche de seguridad y las correcciones de una revisión adversarial (canonical por
página, `sharp` declarado, og:image centrada, ícono alineado al píxel). Detalle en `CHANGELOG.md`.
Se trabajó en la rama `claude/continuar-proyecto-fkeuih` (6 commits) y se fusionó a `main` con
fast-forward; el deploy de producción quedó `READY` y el CI en verde.

Nota: los deploys de preview de ramas (`macs-git-<rama>-imaxmx.vercel.app`) piden iniciar sesión en Vercel
(Deployment Protection); desde una sesión de Claude solo se llega a sus build logs por MCP.

## Infraestructura (verificada el 2026-09-09 vía API de Vercel — no tocar)

| Pieza | Detalle | Verificación |
|---|---|---|
| Dominio | macstech.mx, comprado en GoDaddy (agosto 2026) | — |
| DNS | GoDaddy: `A @ → 216.150.1.1` · `CNAME www → macstech.mx.` | `dig` ✅ (2026-09-06) |
| Repo | github.com/maxmarqueza/macs (público), rama `main` | ✅ |
| Deploy | Vercel · team **imaxmx** (Pro) · proyecto **macs** (`prj_0QPK0kW8u9T58DflUkRNVpP4j5K9`) | último deploy de `main` (`946a214`, 2026-09-09) `READY` ✅ |
| Runtime en Vercel | Node 24.x, framework Next.js | ✅ |
| Dominios en Vercel | `macstech.mx` (Production) · `www.macstech.mx` (redirect 308 → apex) · `macs-murex.vercel.app` · `macs-imaxmx.vercel.app` · `macs-git-main-imaxmx.vercel.app` | apex 200 ✅ · www 308 ✅ (2026-09-06) |
| SSL | Emitido y activo | ✅ |
| CI/CD | **Cada push a `main` despliega a producción** (~1 min). Las ramas generan un deploy de preview. GitHub Actions (`.github/workflows/ci.yml`: npm ci + lint + build) corre en cada push a `main` y en cada PR. | deploy ✅ · CI en `main` verde ✅ |
| Web Analytics | **No habilitado** en el proyecto (comprobado por API el 2026-09-09) | 🟡 lo activa Max en el dashboard |

> Nota para sesiones en la nube: el proxy de red de Claude bloquea `curl` a macstech.mx (403 en el
> túnel). Para verificar producción usar las herramientas MCP de Vercel (`get_project`,
> `list_deployments`, `web_fetch_vercel_url`), no `curl`.

## Stack y versiones (al 2026-09-09)

- Next.js **16.3.4** (App Router, Turbopack) · React 19.2.8 · Tailwind CSS 4 · TypeScript 5.9.3 ·
  `@vercel/analytics` 2.0.1 · `sharp` 0.35.4 (dev, solo para `scripts/brand-assets.mjs`)
- Vercel: Node 24.x · `.nvmrc` = 24 · `engines.node >= 20.9.0` (la sesión del 09-09 usó Node 22 sin problema)
- `npm run build` ✅ · `npm run lint` ✅ · `npm audit`: **0 vulnerabilidades**
- Versiones de `next` y `eslint-config-next` **fijadas exactas** a propósito (sin `^`).
- **CI en GitHub Actions:** `.github/workflows/ci.yml` (npm ci + lint + build) corre en cada push a `main`
  y en cada PR hacia `main`. Primera ejecución en `main` el 2026-09-09: verde. Aun así, correr `npm run build`
  antes de cada push: el CI avisa, pero no impide el deploy de Vercel.

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
5. Si se cambia la marca (`src/app/icon.svg`): correr `node scripts/brand-assets.mjs` (usa `sharp`,
   devDependency) para regenerar `favicon.ico` y `public/logo.png`. El `apple-icon` y la og:image se
   regeneran solos en el build.
6. Al crear una ruta nueva: exportar `metadata` con `alternates.canonical` y `openGraph` desde su
   `page.tsx` (ver `src/app/page.tsx`), y añadirla a `src/app/sitemap.ts`.

## Dónde vive cada cosa

- Datos del sitio (nombre, URL, lema, descripción, correo, idioma): `src/data/site.ts` — **fuente única**;
  la consumen el layout, la página, el sitemap, el robots y la og:image.
- Roster de agentes (fuente única): `src/data/agents.ts` — McMarketing (activo), McSoporte / McVentas / McDatos (próximamente).
  La og:image también lee de aquí: un Mc nuevo aparece en la imagen sin tocar nada más.
- Landing completa: `src/app/page.tsx` — una sola página: hero, "¿Qué es un Mc?", roster, contacto (`mailto:` a `site.email`), footer. Anclas `#agentes` y `#contacto`.
- Metadata/SEO: `src/app/layout.tsx` (title, description, Open Graph global, Twitter card, `theme-color`,
  JSON-LD `Organization` + `WebSite`, `<Analytics />`). **Cada `page.tsx` define su `alternates.canonical`
  y su `openGraph` (con `...openGraphBase` de `site.ts` + `url`)**: si el canonical viviera en el layout,
  toda ruta nueva heredaría el de la portada. `src/app/sitemap.ts` y `src/app/robots.ts`.
- Marca: `src/app/icon.svg` (fuente única del ícono) → `src/app/favicon.ico` y `public/logo.png` (generados
  por `scripts/brand-assets.mjs`) · `src/app/apple-icon.tsx` y `src/app/opengraph-image.tsx` (generados en el
  build con `next/og`) · fuentes para la og:image en `src/assets/fonts/` (Geist, OFL).
- Concepto de marca: `docs/VISION.md` · Plan: `docs/ROADMAP.md` · Ficha por agente: `docs/AGENTES/`
- Instrucciones para Claude: `CLAUDE.md` (+ `AGENTS.md`, generado por `next dev` — no borrar)

## Siguientes pasos (en orden de impacto)

1. **Habilitar Web Analytics en Vercel** (proyecto `macs` → pestaña Analytics → Enable). 🟡 **Solo Max**:
   no hay herramienta MCP para hacerlo. El código ya está en producción; no hace falta redeploy. Mientras no
   se active, el navegador pide `/_vercel/insights/script.js` y recibe 404 (inofensivo, pero se ve en la consola).
2. **Habilitar el correo de `macstech.mx`.** 🔴 **Bloqueado por una decisión de Max, no por información.**
   Hecho verificado el 2026-09-06: el dominio **no tiene registros MX ni SPF**, así que
   `contacto@macstech.mx` **no recibe correo** — y hoy es el único canal de contacto del sitio.
   Cualquiera que escriba, rebota. La pregunta a Max es **"¿dónde quieres el correo?"**
   (Google Workspace, Zoho, el correo incluido de GoDaddy…). Después: alta de MX + SPF/DKIM en GoDaddy.
   Alternativa rápida: sustituir el `mailto:` por WhatsApp y quitar el correo hasta que funcione.
   (El correo está en `src/data/site.ts` y también aparece en el JSON-LD.)
3. **Botón de WhatsApp** en contacto. 🔴 **Bloqueado:** falta que Max dé el número.
   Resuelve también el punto 2 de forma provisional.
4. **Página de McMarketing** (`/agentes/mcmarketing`) con el caso de éxito del flujo n8n.
   🔴 **Bloqueado:** falta info de Max (ver `docs/AGENTES/McMarketing.md`). Al crearla: exportar
   `metadata` con `alternates.canonical` y `openGraph` desde su `page.tsx` y añadir la ruta a
   `src/app/sitemap.ts`.

> Si Max no está disponible: ya no queda nada de Fase 2 que no dependa de él. Candidatos que sí se
> pueden hacer solos: evaluar las actualizaciones mayores (eslint 10, TS 7) en una rama, o añadir un
> `manifest.webmanifest` (PWA básica) si se considera útil. Ninguno es urgente.

## Decisiones tomadas (no revertir sin razón)

- Dominio canónico: **macstech.mx** (apex, sin www) — www redirige 308 al apex.
- Idioma del sitio y de la comunicación con Max: **español (México)**.
- Marca: "MACS" = muchos **Mc**; cada Mc es un agente IA con nombre, personalidad y especialidad.
- Identidad visual: la "M" de `src/app/icon.svg` (acento `sky-400` sobre `neutral-950`) es el ícono
  oficial de facto desde el 2026-09-09; la og:image se genera por código (no es una imagen estática)
  para que siempre refleje el roster.
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
      (ver siguiente paso 2).
- [ ] ¿Le gusta el ícono "M" y la og:image? Se hicieron sin consultarle, a partir de la identidad
      visual de facto de `docs/VISION.md`. Si quiere otra cosa, basta con cambiar `src/app/icon.svg`
      y correr `node scripts/brand-assets.mjs`.
