# PROGRESS — Estado del proyecto y traspaso de sesión

> **Propósito:** este archivo permite a cualquier sesión de Claude (local o en la nube)
> retomar el trabajo exactamente donde quedó. **Leerlo antes de trabajar** y actualizarlo
> al final de cada sesión.

**Última actualización:** 2026-09-10 (preferencias de comunicación y ejecución guardadas)
**Estado general:** ✅ Fase 1 completa · 🟡 Fase 2 en curso: marca, SEO, integración de analítica y CI
en producción en https://macstech.mx. La ficha de McMarketing está publicada y validada;
siguen pendientes el contacto, confirmar eventos de Analytics y el caso de éxito.
**Rama de trabajo:** `main`, y **solo `main`**. Max pidió (2026-09-10) que todo se publique directo:
commit en `main` + push, sin ramas ni pull requests.

## Para retomar en la siguiente sesión (leer primero)

**Preferencias de Max:** brevedad; continuar hasta finalizar; autoanalizar y revisar el resultado;
evitar narración rutinaria; consultar solo cambios de rumbo no planeados o decisiones importantes.
Al cerrar, sugerir únicamente un próximo paso que Max aún no haya indicado. Reglas completas en
`AGENTS.md`, referenciadas también en `CLAUDE.md`.

**Último trabajo completado:** publicada `/agentes/mcmarketing` con funciones ya documentadas, preguntas
frecuentes, diseño adaptable y metadata propia. La portada enlaza mediante `Agent.href` opcional
y el sitemap incluye solamente páginas existentes. No se añaden redes específicas, clientes ni
resultados sin evidencia. **Lint, build, navegador, CI y despliegue confirmados.** El siguiente
paso es resolver el contacto: proveedor de correo y número de WhatsApp pendientes de Max.

**Clon local:** `/Users/max/Desktop/Todo/Proyectos/MACS`. La ruta registrada anteriormente,
`/Users/max/Desktop/Proyectos/MACS`, ya no existe.

**Implementación publicada:** commit `ecfe86f89ff26969d256c719eeee33e32a66f78c` en `main`.
[Despliegue Vercel](https://vercel.com/imaxmx/macs/Esvs2WHA1BRCq6BFMLUEfbYkf7MW)
confirmado por el estado Vercel del commit en GitHub: `success`, «Deployment has completed».
[CI](https://github.com/maxmarqueza/macs/actions/runs/34544060537): `completed` / `success`.
Revisar `git status` antes de sincronizar o instalar dependencias.

**Flujo de trabajo (decisión de Max, 2026-09-10): directo en `main`.** Nada de ramas ni PRs.

**Autenticación con GitHub:** el remoto usa **SSH** (`git@github.com:maxmarqueza/macs.git`) con la llave
`~/.ssh/id_ed25519_github`, ya registrada en la cuenta. Se cambió desde HTTPS porque el `push` por HTTPS
pedía usuario y contraseña (GitHub ya no acepta contraseña ahí) y colgaba la terminal. Con SSH el push
sale sin pedir nada. No hay `gh` instalado en la Mac.

**Ramas viejas en GitHub, pendientes de borrar** (Max ya dijo que sí; falta el permiso para
ejecutar `git push origin --delete` desde la sesión):

- `claude/continuar-proyecto-fkeuih` — 0 commits propios, todo su trabajo ya está en `main`. Borrar sin riesgo.
- `claude/crear-criptomoneda-propia-8a300q` — 1 commit propio (`894fb95`, el token $MACS **descartado**).

Ambas quedaron respaldadas en tags locales (`archivo/rama-continuar-proyecto` y `archivo/cripto-macs`),
así que borrarlas en GitHub no pierde nada mientras exista este clon.

Para retomar: revisar `git status` en el clon indicado y seguir por "Siguientes pasos".

Auditoría HTTP del 2026-09-10: portada, `/agentes/mcmarketing`, `/opengraph-image`, `/sitemap.xml`, `/robots.txt` e
`/icon.svg` responden 200; HTTP y www redirigen con 308 al apex HTTPS. Canonical y metadatos
sociales apuntan al dominio correcto; la og:image es PNG de 1200 × 630. La portada de producción
enlaza la ficha y el sitemap la incluye; OG/Twitter contienen imagen.
Dos comprobaciones finales de lint y build aprobadas. La revisión visual y de navegación pasó
en 1280/390/320 px sin desbordamiento y en modos claro/oscuro; FAQ operable con teclado.
Axe detectó cero infracciones en la ficha; los gradientes se revisaron visualmente.
La vista previa dentro de aplicaciones al compartir el enlace no se comprobó.

## Qué se publicó el 2026-09-09 (Fase 2)

Todo lo de los antiguos siguientes pasos 4, 5, 6 y 7 — favicon + og:image, SEO, Analytics y el CI —
más limpieza, un parche de seguridad y las correcciones de una revisión adversarial (canonical por
página, `sharp` declarado, og:image centrada, ícono alineado al píxel). Detalle en `CHANGELOG.md`.
Se trabajó en la rama `claude/continuar-proyecto-fkeuih` (6 commits) y se fusionó a `main` con
fast-forward; el deploy de producción quedó `READY` y el CI en verde.

Nota (ya solo histórica, porque desde el 2026-09-10 no se usan ramas): los deploys de preview de ramas
(`macs-git-<rama>-imaxmx.vercel.app`) piden iniciar sesión en Vercel (Deployment Protection); desde una
sesión de Claude solo se llega a sus build logs por MCP.

## Infraestructura (API de Vercel: 2026-09-09; HTTP/DNS: 2026-09-10 — no tocar)

| Pieza | Detalle | Verificación |
|---|---|---|
| Dominio | macstech.mx, comprado en GoDaddy (agosto 2026) | — |
| DNS | GoDaddy: `A @ → 216.150.1.1` · `CNAME www → macstech.mx.`; sin MX ni SPF | `dig` autoritativo y Cloudflare ✅ (2026-09-10) |
| Repo | github.com/maxmarqueza/macs (público), rama `main` · remoto por **SSH** (`git@github.com:...`) | ✅ |
| Deploy | Vercel · team **imaxmx** (Pro) · proyecto **macs** (`prj_0QPK0kW8u9T58DflUkRNVpP4j5K9`) | `ecfe86f`: estado Vercel en GitHub `success`; producción verificada |
| Runtime en Vercel | Node 24.x, framework Next.js | ✅ |
| Dominios en Vercel | `macstech.mx` (Production) · `www.macstech.mx` (redirect 308 → apex) · `macs-murex.vercel.app` · `macs-imaxmx.vercel.app` · `macs-git-main-imaxmx.vercel.app` | apex 200 ✅ · www 308 ✅ (2026-09-10) |
| SSL | Emitido y activo | ✅ |
| CI/CD | **Cada push a `main` despliega a producción** (~1 min). Ya no se usan ramas (todo va directo a `main`). GitHub Actions (`.github/workflows/ci.yml`: npm ci + lint + build) corre en cada push a `main` y en cada PR. | `ecfe86f`: deploy ✅ · CI `34544060537` `success` ✅ |
| Web Analytics | Integración publicada; `/_vercel/insights/script.js` responde **200** | HTTP ✅ (2026-09-10); eventos y dashboard pendientes de confirmar |

> Nota para sesiones en la nube: el proxy de red de Claude bloquea `curl` a macstech.mx (403 en el
> túnel). Para verificar producción usar las herramientas MCP de Vercel (`get_project`,
> `list_deployments`, `web_fetch_vercel_url`), no `curl`.

> Acceso del 2026-09-10: el MCP de Vercel devolvió 403 con el scope `imaxmx`. En esta sesión local
> se verificaron el estado Vercel del commit mediante la API pública de GitHub y las URLs públicas.
> No se confirmó `READY` mediante la API de Vercel.

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
2. Editar → `npm run lint` + `npm run build` + revisión en navegador → commit **en `main`** → push → producción.
   **No crear ramas ni pull requests** (decisión de Max, 2026-09-10).
3. **Después del push, verificar que el deploy salió READY** — Vercel conserva el último deploy bueno,
   así que un build roto NO tumba el sitio, pero tampoco publica el cambio y pasa inadvertido.
   (Ya pasó una vez: el deploy `dpl_4Rgz86UJfGTym6YYrXeEWv9oZbKv` quedó en `ERROR`.)
4. Al cerrar sesión: actualizar `CHANGELOG.md`, `docs/ROADMAP.md` y **este archivo**.
5. Si se cambia la marca (`src/app/icon.svg`): correr `node scripts/brand-assets.mjs` (usa `sharp`,
   devDependency) para regenerar `favicon.ico` y `public/logo.png`. El `apple-icon` y la og:image se
   regeneran solos en el build.
6. Al crear una ruta nueva: exportar `metadata` con `alternates.canonical` y `openGraph` desde su
   `page.tsx` (ver `src/app/page.tsx`). Para una ficha de agente, asignar `href` en el roster cuando
   exista la página; la portada y `src/app/sitemap.ts` usan esos enlaces.

## Dónde vive cada cosa

- Datos del sitio (nombre, URL, lema, descripción, correo, idioma): `src/data/site.ts` — **fuente única**;
  la consumen el layout, la página, el sitemap, el robots y la og:image.
- Roster de agentes (fuente única): `src/data/agents.ts` — McMarketing (activo), McSoporte / McVentas / McDatos (próximamente).
  `href` opcional enlaza fichas existentes desde la portada y el sitemap. La og:image también lee de aquí.
- Portada: `src/app/page.tsx` — hero, "¿Qué es un Mc?", roster, contacto (`mailto:` a `site.email`), footer. Anclas `#agentes` y `#contacto`.
- Ficha de McMarketing: `src/app/agentes/mcmarketing/page.tsx`, con metadata propia.
- Metadata/SEO: `src/app/layout.tsx` (title, description, Open Graph global, Twitter card, `theme-color`,
  JSON-LD `Organization` + `WebSite`, `<Analytics />`). **Cada `page.tsx` define su `alternates.canonical`
  y su `openGraph` (con `...openGraphBase` de `site.ts` + `url`)**: si el canonical viviera en el layout,
  toda ruta nueva heredaría el de la portada. `src/app/sitemap.ts` y `src/app/robots.ts`.
- Marca: `src/app/icon.svg` (fuente única del ícono) → `src/app/favicon.ico` y `public/logo.png` (generados
  por `scripts/brand-assets.mjs`) · `src/app/apple-icon.tsx` y `src/app/opengraph-image.tsx` (generados en el
  build con `next/og`) · fuentes para la og:image en `src/assets/fonts/` (Geist, OFL).
- Concepto de marca: `docs/VISION.md` · Plan: `docs/ROADMAP.md` · Ficha por agente: `docs/AGENTES/`
- Instrucciones para Claude: `CLAUDE.md` (+ `AGENTS.md`, generado por `next dev` — no borrar)

## Siguientes pasos

1. **Habilitar el correo de `macstech.mx`.** 🔴 Falta que Max elija proveedor. El 2026-09-10
   se reconfirmó la ausencia de MX y SPF con DNS autoritativo y Cloudflare. El sitio sigue mostrando
   `contacto@macstech.mx` como único canal de contacto; no se ha verificado un buzón operativo.
   La elección de proveedor y la configuración de correo siguen pendientes; no se cambió DNS.
2. **Botón de WhatsApp** en contacto. 🔴 Número solicitado a Max; pendiente de respuesta.
3. **Confirmar eventos de Analytics en el dashboard.** El script de producción ya responde 200;
   esto reemplaza la observación anterior del 404, pero no demuestra recepción de eventos.
4. **Caso de éxito de McMarketing.** 🔴 Faltan redes específicas, herramientas de IA, resultados,
   capturas y permiso para nombrar clientes (ver `docs/AGENTES/McMarketing.md`). Esos datos bloquean
   el caso de éxito y sus afirmaciones, no la ficha funcional básica.

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

- [ ] Número de WhatsApp para el botón de contacto: solicitado, pendiente de respuesta.
- [ ] Caso de éxito de McMarketing: redes, IA, resultados medibles, capturas y cliente publicable.
- [ ] **¿Dónde quieres el correo de macstech.mx?** Falta elegir proveedor; ausencia de MX/SPF
      reconfirmada el 2026-09-10 (ver siguiente paso 1).
- [ ] ¿Le gusta el ícono "M" y la og:image? Se hicieron sin consultarle, a partir de la identidad
      visual de facto de `docs/VISION.md`. Si quiere otra cosa, basta con cambiar `src/app/icon.svg`
      y correr `node scripts/brand-assets.mjs`.
