# Changelog

## 2026-09-09 (Fase 2: marca, SEO y analítica)
- **Marca:** nuevo ícono de MACS — una "M" en `sky-400` sobre `neutral-950` con un brillo sutil, la
  misma paleta del hero (`src/app/icon.svg`, fuente única de la marca). De ahí salen el
  `favicon.ico` (16/32/48 px, sustituye al de Next.js), el `apple-icon` de 180 px que se genera en el
  build y `public/logo.png` (512 px, para los datos estructurados). Script reproducible:
  `node scripts/brand-assets.mjs`.
- **og:image generada en el build** con `next/og` (`src/app/opengraph-image.tsx`, 1200×630): marca,
  "MACS", el lema y las píldoras del roster leídas de `src/data/agents.ts` (un Mc nuevo aparece solo).
  Usa Geist Regular y Bold en TrueType (`src/assets/fonts/`, licencia OFL incluida). Verificada en
  local: se renderiza correctamente.
- **SEO:** `sitemap.xml` y `robots.txt` generados por código, `<link rel="canonical">`, Twitter card
  `summary_large_image`, `theme-color` claro/oscuro y JSON-LD (`Organization` + `WebSite`) en el layout.
  Los datos del sitio (nombre, URL, descripción, correo, idioma) ahora viven en `src/data/site.ts` y
  los consumen el layout, la página, el sitemap, el robots y la og:image.
- **Vercel Analytics:** `@vercel/analytics` 2.0.1 y `<Analytics />` en el layout. ⚠️ Comprobado por la
  API de Vercel que **Web Analytics no está habilitado en el proyecto**: hasta que Max lo active en el
  dashboard (Analytics → Enable) el script responde 404 y no se registra nada. No hace falta redeploy.
- **CI en GitHub Actions:** `.github/workflows/ci.yml` (npm ci + lint + build, Node de `.nvmrc`, con
  `workflow_dispatch` para correrlo a mano). El 06-09 no se pudo por falta del scope `workflow`; esta vez
  el token OAuth de GitHub de la sesión sí lo tenía y se creó por la API. No se pudo ejecutar todavía:
  GitHub solo indexa workflows de la rama por defecto, así que correrá en el PR de fusión y en `main`.
- **Limpieza:** eliminados los cinco SVG de `create-next-app` en `public/` (no los usaba nada).
- **Seguridad:** `npm audit` marcaba 1 vulnerabilidad alta (js-yaml 4.3.1, transitiva vía eslint);
  `npm audit fix` la subió a 4.3.2. De nuevo 0 vulnerabilidades.
- **Verificación:** `npm run lint` y `npm run build` pasan; con `next start` todas las rutas nuevas
  responden 200 (`/`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/apple-icon`, `/icon.svg`,
  `/favicon.ico`, `/logo.png`) y el `<head>` lleva canonical, og:image con alt, twitter:image e íconos.
- **Ojo:** este trabajo está en la rama `claude/continuar-proyecto-fkeuih`, **no en `main`**. No
  llega a producción hasta que Max la fusione (ver siguientes pasos en `docs/PROGRESS.md`).

## 2026-09-06 (auditoría de traspaso)
- Auditoría multi-agente del repo para comprobar que quedaba listo para otra sesión: 6 dimensiones (exactitud de los docs, enlaces, coherencia entre documentos, arranque desde cero, clon limpio e infraestructura viva), cada hallazgo verificado por refutadores independientes. 29 hallazgos brutos → 1 confirmado + 5 vacíos del crítico de completitud; el resto, refutado.
- **Bug corregido en el sitio:** `globals.css` fijaba `font-family: Arial` en `body` fuera de toda capa CSS, y eso le ganaba a la utilidad `.font-sans` (que vive en `@layer utilities`). Producción renderizaba en **Arial** mientras precargaba dos archivos de **Geist** que nunca se usaban. Verificado en navegador antes y después: producción `Arial, Helvetica, sans-serif` → local `Geist, "Geist Fallback"`. Era un resto del scaffolding de `create-next-app`.
- **Correo:** comprobado que `macstech.mx` **no tiene registros MX ni SPF**, así que `contacto@macstech.mx` no recibe correo — y es el único canal de contacto del sitio. Deja de ser una duda ("¿existe el buzón?") y pasa a ser el siguiente paso 1 en `PROGRESS.md`.
- **CI: no se pudo agregar.** Se escribió `.github/workflows/ci.yml` (npm ci + lint + build), pero GitHub rechaza el push: ni el token de git ni la app de GitHub tienen el scope `workflow`. Queda como siguiente paso 7 en `PROGRESS.md`, con el YAML listo para que Max lo cree desde la web. La regla de "verificar el build antes del push" sigue siendo manual.
- **Entorno reproducible:** `engines.node >= 20.9.0` en `package.json` y `.nvmrc` con 24 (la versión de Vercel). Antes la versión de Node solo vivía como prosa en los docs.
- `.gitignore` ahora ignora `.claude/settings.local.json` (antes solo lo ignoraba la config global de Max, así que otra máquina podía commitear permisos locales).
- `docs/VISION.md`: nueva sección **Identidad visual (de facto)** con la paleta y tipografía que ya usa el sitio, para que el favicon y el og:image se puedan hacer sin consultar a Max.
- Comprobado que un clon limpio funciona de principio a fin: `git clone` + `npm ci` + `build` + `lint` pasan, y no hay secretos en el historial.

## 2026-09-06
- Sesión de mantenimiento y puesta al día del repo para traspaso.
- Infraestructura verificada en vivo: apex `macstech.mx` responde 200, `www` responde 308 al apex, DNS apuntando a 216.150.1.1 y último deploy de Vercel en estado `READY`.
- Dependencias actualizadas: **Next.js 16.3.0 → 16.3.4** y `eslint-config-next` a la par (versiones fijadas exactas, sin `^`), más `@types/react-dom`. `npm run build` y `npm run lint` pasan; 0 vulnerabilidades.
- Actualizaciones mayores **no** aplicadas por riesgo de romper el build, documentadas como decisión pendiente: eslint 10, TypeScript 7, @types/node 26.
- `docs/PROGRESS.md` reescrito: infraestructura con columna de verificación, stack con versiones, siguientes pasos marcados como bloqueados o listos para empezar, y lista de pendientes de información.
- README y ROADMAP puestos al día con el estado real del proyecto.
- **Decisión: la criptomoneda queda descartada.** Max decidió no crear el token $MACS. Queda una rama sin fusionar en GitHub (`claude/crear-criptomoneda-propia-8a300q`, del 10 de agosto, con contrato ERC-20 sobre Base) que **no se integra a `main`**; se conserva solo como archivo histórico.

## 2026-08-25
- Creado `docs/PROGRESS.md`: documento de traspaso entre sesiones (estado, infraestructura, siguientes pasos, decisiones).
- `CLAUDE.md` ampliado con contexto del proyecto y reglas de trabajo para cualquier sesión nueva (local o en la nube).

## 2026-08-07 (tarde)
- Repo creado en GitHub: github.com/maxmarqueza/macs (público). Push inicial hecho.
- Proyecto desplegado en Vercel (team imaxmx, proyecto "macs"). Deploy exitoso.
- Dominio macstech.mx agregado en Vercel (Production, sin redirect a www).
- DNS en GoDaddy: registro A @ cambiado de WebsiteBuilder a 216.150.1.1 (IP nueva de Vercel). Propagación inmediata.
- SSL emitido. **Sitio en producción: https://macstech.mx** ✅
- www.macstech.mx agregado en Vercel con redirect 308 permanente → macstech.mx. Verificado: www responde 308 y el apex 200.
- Infraestructura completa: dominio + SSL + www + deploy automático en cada push a main.

## 2026-08-07
- Inicio del proyecto. Dominio macstech.mx comprado en GoDaddy.
- Creada documentación base: docs/VISION.md, docs/ROADMAP.md, docs/AGENTES/McMarketing.md.
- Scaffolding del sitio con Next.js + Tailwind.
