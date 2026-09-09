# PROGRESS — Estado del proyecto y traspaso de sesión

> **Propósito:** este archivo permite a cualquier sesión de Claude (local o en la nube)
> retomar el trabajo exactamente donde quedó. **Leerlo antes de trabajar** y actualizarlo
> al final de cada sesión.

**Última actualización:** 2026-09-09
**Estado general:** ✅ Fase 1 completa — sitio en producción en https://macstech.mx ·
🟡 Fase 2 (marca, SEO, analítica) **hecha en una rama, pendiente de fusionar a `main`**
**Rama de trabajo:** `claude/continuar-proyecto-fkeuih` (parte de `main` en `fe594bb`; ver "Qué hay en la rama")

## Qué hay en la rama `claude/continuar-proyecto-fkeuih` (2026-09-09)

Todo lo de los antiguos siguientes pasos 4, 5 y 6 — favicon + og:image, SEO y Analytics —
más limpieza y un parche de seguridad. Detalle en `CHANGELOG.md`. **Producción no cambia hasta
que Max fusione la rama a `main`** (un PR en GitHub, o `git merge` local + push). El build y el
lint pasan, y con `next start` todas las rutas nuevas responden 200.

Después de fusionar, hay que **comprobar el deploy en Vercel** y luego ver en vivo:
`https://macstech.mx/opengraph-image`, `/sitemap.xml`, `/robots.txt`, `/icon.svg`, `/apple-icon`
y la vista previa al compartir el enlace (p. ej. en WhatsApp o con https://www.opengraph.xyz/).

## Infraestructura (verificada el 2026-09-09 vía API de Vercel — no tocar)

| Pieza | Detalle | Verificación |
|---|---|---|
| Dominio | macstech.mx, comprado en GoDaddy (agosto 2026) | — |
| DNS | GoDaddy: `A @ → 216.150.1.1` · `CNAME www → macstech.mx.` | `dig` ✅ (2026-09-06) |
| Repo | github.com/maxmarqueza/macs (público), rama `main` | ✅ |
| Deploy | Vercel · team **imaxmx** (Pro) · proyecto **macs** (`prj_0QPK0kW8u9T58DflUkRNVpP4j5K9`) | último deploy de `main` (`fe594bb`) `READY` ✅ |
| Runtime en Vercel | Node 24.x, framework Next.js | ✅ |
| Dominios en Vercel | `macstech.mx` (Production) · `www.macstech.mx` (redirect 308 → apex) · `macs-murex.vercel.app` · `macs-git-main-imaxmx.vercel.app` | apex 200 ✅ · www 308 ✅ (2026-09-06) |
| SSL | Emitido y activo | ✅ |
| CI/CD | **Cada push a `main` despliega a producción** (~1 min). Las ramas generan un deploy de preview. | ✅ |
| Web Analytics | **No habilitado** en el proyecto (comprobado por API el 2026-09-09) | 🟡 lo activa Max en el dashboard |

> Nota para sesiones en la nube: el proxy de red de Claude bloquea `curl` a macstech.mx (403 en el
> túnel). Para verificar producción usar las herramientas MCP de Vercel (`get_project`,
> `list_deployments`, `web_fetch_vercel_url`), no `curl`.

## Stack y versiones (al 2026-09-09)

- Next.js **16.3.4** (App Router, Turbopack) · React 19.2.8 · Tailwind CSS 4 · TypeScript 5.9.3 ·
  `@vercel/analytics` 2.0.1
- Vercel: Node 24.x · `.nvmrc` = 24 · `engines.node >= 20.9.0` (la sesión del 09-09 usó Node 22 sin problema)
- `npm run build` ✅ · `npm run lint` ✅ · `npm audit`: **0 vulnerabilidades**
- Versiones de `next` y `eslint-config-next` **fijadas exactas** a propósito (sin `^`).
- **No hay CI todavía** (ver siguiente paso 5): la verificación del build es manual.

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
5. Si se cambia la marca (`src/app/icon.svg`): correr `node scripts/brand-assets.mjs` para regenerar
   `favicon.ico` y `public/logo.png`. El `apple-icon` y la og:image se regeneran solos en el build.

## Dónde vive cada cosa

- Datos del sitio (nombre, URL, lema, descripción, correo, idioma): `src/data/site.ts` — **fuente única**;
  la consumen el layout, la página, el sitemap, el robots y la og:image.
- Roster de agentes (fuente única): `src/data/agents.ts` — McMarketing (activo), McSoporte / McVentas / McDatos (próximamente).
  La og:image también lee de aquí: un Mc nuevo aparece en la imagen sin tocar nada más.
- Landing completa: `src/app/page.tsx` — una sola página: hero, "¿Qué es un Mc?", roster, contacto (`mailto:` a `site.email`), footer. Anclas `#agentes` y `#contacto`.
- Metadata/SEO: `src/app/layout.tsx` (title, description, canonical, Open Graph, Twitter card, `theme-color`,
  JSON-LD `Organization` + `WebSite`, `<Analytics />`). `src/app/sitemap.ts` y `src/app/robots.ts`.
- Marca: `src/app/icon.svg` (fuente única del ícono) → `src/app/favicon.ico` y `public/logo.png` (generados
  por `scripts/brand-assets.mjs`) · `src/app/apple-icon.tsx` y `src/app/opengraph-image.tsx` (generados en el
  build con `next/og`) · fuentes para la og:image en `src/assets/fonts/` (Geist, OFL).
- Concepto de marca: `docs/VISION.md` · Plan: `docs/ROADMAP.md` · Ficha por agente: `docs/AGENTES/`
- Instrucciones para Claude: `CLAUDE.md` (+ `AGENTS.md`, generado por `next dev` — no borrar)

## Siguientes pasos (en orden de impacto)

1. **Fusionar `claude/continuar-proyecto-fkeuih` a `main`** y comprobar que el deploy queda `READY`.
   🟢 Lo puede hacer Max en un minuto (o una sesión de Claude si Max lo pide). Luego verificar en vivo
   la og:image y el sitemap (ver arriba).
2. **Habilitar Web Analytics en Vercel** (proyecto `macs` → pestaña Analytics → Enable). 🟡 **Solo Max**:
   no hay herramienta MCP para hacerlo. El código ya está; no hace falta redeploy. Mientras no se
   active, el navegador pide `/_vercel/insights/script.js` y recibe 404 (inofensivo, pero se ve en la consola).
3. **Habilitar el correo de `macstech.mx`.** 🔴 **Bloqueado por una decisión de Max, no por información.**
   Hecho verificado el 2026-09-06: el dominio **no tiene registros MX ni SPF**, así que
   `contacto@macstech.mx` **no recibe correo** — y hoy es el único canal de contacto del sitio.
   Cualquiera que escriba, rebota. La pregunta a Max es **"¿dónde quieres el correo?"**
   (Google Workspace, Zoho, el correo incluido de GoDaddy…). Después: alta de MX + SPF/DKIM en GoDaddy.
   Alternativa rápida: sustituir el `mailto:` por WhatsApp y quitar el correo hasta que funcione.
   (El correo está en `src/data/site.ts` y también aparece en el JSON-LD.)
4. **Botón de WhatsApp** en contacto. 🔴 **Bloqueado:** falta que Max dé el número.
   Resuelve también el punto 3 de forma provisional.
5. **CI en GitHub Actions.** 🔴 **Solo lo puede hacer Max**, no una sesión de Claude: el token de
   git y la app de GitHub disponibles **no tienen el scope `workflow`**, así que GitHub rechaza
   cualquier push que cree o modifique `.github/workflows/` (`refusing to allow a Personal Access
   Token to create or update workflow ... without workflow scope` / `403 Resource not accessible
   by integration`). La vía rápida es crearlo desde la web de GitHub (Add file → Create new file →
   `.github/workflows/ci.yml`) con esto:

   ```yaml
   name: CI
   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version-file: .nvmrc
             cache: npm
         - run: npm ci
         - run: npm run lint
         - run: npm run build
   ```

   Ya está comprobado que `npm ci` + `lint` + `build` pasan desde un clon limpio, así que el
   workflow debería quedar en verde a la primera.
6. **Página de McMarketing** (`/agentes/mcmarketing`) con el caso de éxito del flujo n8n.
   🔴 **Bloqueado:** falta info de Max (ver `docs/AGENTES/McMarketing.md`). Al crearla: añadir la ruta
   a `src/app/sitemap.ts`.

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
      (ver siguiente paso 3).
- [ ] ¿Le gusta el ícono "M" y la og:image? Se hicieron sin consultarle, a partir de la identidad
      visual de facto de `docs/VISION.md`. Si quiere otra cosa, basta con cambiar `src/app/icon.svg`
      y correr `node scripts/brand-assets.mjs`.
