# Changelog

## 2026-09-10 (preferencias permanentes de trabajo)
- Guardadas en `AGENTS.md` las preferencias de Max: respuestas breves, ejecución continua hasta
  finalizar, autoanálisis y revisión, comunicación sin narración rutinaria y consultas solo ante
  cambios de rumbo no planeados o decisiones importantes.
- Referencias en `CLAUDE.md` y `docs/PROGRESS.md`; roadmap ajustado para sugerir únicamente
  próximos pasos todavía no indicados por Max.

## 2026-09-10 (ficha de McMarketing — publicada)
- Recuperado el clon local en `/Users/max/Desktop/Todo/Proyectos/MACS`; la antigua ruta
  `/Users/max/Desktop/Proyectos/MACS` ya no existe.
- Implementada: `/agentes/mcmarketing` con funciones documentadas (publicación diaria,
  comentarios y DMs mediante n8n), preguntas frecuentes, diseño adaptable y metadata propia.
  La portada enlaza fichas mediante `Agent.href` opcional y el sitemap incluye solamente las existentes.
  Los datos pendientes bloquean el caso de éxito, no la ficha funcional básica.
- Auditoría HTTP de producción: portada, nueva ficha, sitemap, robots, icono y og:image responden 200;
  www y HTTP redirigen con 308 al dominio canónico HTTPS. La og:image es PNG de 1200 × 630.
  La portada enlaza la ficha y el sitemap la incluye; OG/Twitter contienen imagen.
- **Analytics:** `/_vercel/insights/script.js` ya responde 200 y el código publicado incorpora
  `@vercel/analytics` 2.0.1. Actualiza la observación del 9 de septiembre; no se verificaron
  recepción de eventos ni dashboard.
- **Contacto:** consultas DNS autoritativas y a Cloudflare confirman ausencia de MX y SPF.
  Falta elegir proveedor de correo; número de WhatsApp solicitado a Max, pendiente de respuesta.
- **Validación:** dos comprobaciones finales de lint y build aprobadas; ruta estática.
  Navegación catálogo → agente → contacto, FAQ con teclado, vistas de 1280/390/320 px sin
  desbordamiento y modos claro/oscuro revisados.
  Canonical, OG/Twitter con imagen y sitemap comprobados en el HTML generado.
  Axe: cero infracciones detectadas en la ficha en ambos modos; gradientes revisados visualmente.
- Mejorado el contraste de botones y numeración, y el foco visible de enlaces.
- **Publicada** en [macstech.mx/agentes/mcmarketing](https://macstech.mx/agentes/mcmarketing)
  con el commit `ecfe86f89ff26969d256c719eeee33e32a66f78c` en `main`.
  [Despliegue Vercel](https://vercel.com/imaxmx/macs/Esvs2WHA1BRCq6BFMLUEfbYkf7MW): estado del commit
  en GitHub `success`, «Deployment has completed».
  [CI](https://github.com/maxmarqueza/macs/actions/runs/34544060537) completado con `success`.
  El MCP de Vercel devolvió 403 para el scope `imaxmx`; se verificó mediante la API pública de
  GitHub y las URLs públicas, sin consultar `READY` en la API de Vercel.

## 2026-09-10 (flujo de trabajo: directo a `main`)
- **Sin ramas ni pull requests.** Max pidió que todo se publique directo: commit en `main` + push.
  Queda escrito como primera regla en `CLAUDE.md` y en `docs/PROGRESS.md`.
- **Remoto de git cambiado a SSH** (`git@github.com:maxmarqueza/macs.git`, llave
  `~/.ssh/id_ed25519_github`). Por HTTPS el `push` pedía usuario y contraseña —que GitHub ya no
  acepta— y dejaba la terminal colgada; por SSH sale sin pedir nada.
- Deploy de producción `50ff554` `READY`.

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
- **Revisión adversarial** del cambio (6 finders: API de Next 16, despliegue en Vercel, SEO, calidad de
  código, marca/visual y docs; 3 refutadores por hallazgo). Se quedó a medias por el límite de gasto de la
  cuenta (39 de 55 agentes no corrieron), así que los hallazgos sin refutar se verificaron a mano. Corregido:
  `sharp` pasa a `devDependencies` (el script de marca lo importaba sin declararlo; Next solo lo trae como
  dependencia opcional); `alternates.canonical` y `openGraph.url` se mueven del layout a `page.tsx`
  (en el layout los heredaría cualquier ruta nueva y Google la tomaría por duplicado de la portada);
  colores de marca y base de Open Graph centralizados en `src/data/site.ts`; og:image con composición
  centrada (sobrevive al recorte cuadrado de WhatsApp/iMessage), píldoras que envuelven y se acotan a 6,
  la del Mc activo en `emerald` como manda `VISION.md` y las de "próximamente" con más contraste; ícono
  con trazo alineado al píxel (2 px sólidos a 16 px en vez de bordes difusos); `CLAUDE.md` avisa que el
  proxy de las sesiones en la nube bloquea `curl` a producción; README y PROGRESS matizan CI y Analytics.
  Descartado tras comprobarlo: `<html lang="es">` vs `es-MX` (ambos válidos; se deja `es`).
- **Nota de proceso:** durante esa revisión, subagentes hicieron el commit de Fase 2, crearon el CI y
  empujaron a la rama por su cuenta (respondiendo a un hook de la sesión). Se auditaron los cuatro commits
  uno por uno: contienen exactamente el árbol de trabajo previsto más `ci.yml`; `main` no se tocó.
- **Publicado a producción:** Max autorizó la fusión; `main` avanzó por fast-forward con los 6 commits
  de la rama `claude/continuar-proyecto-fkeuih`. Deploy `dpl_DaiyjZYPvP2csg5c3XpKHEc8Ei97` en `READY` y
  primera ejecución del CI en `main` en verde. Queda por mirar en un navegador la og:image y el sitemap en
  vivo (desde la nube el proxy lo impide).

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
