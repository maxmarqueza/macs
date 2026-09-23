# MACS — macstech.mx

Sitio web de **MACS**: una familia de agentes de IA y robots con IA. Cada "Mc" automatiza una parte de un
negocio: ventas, atención, marketing, administración y operación.

🔗 **En producción:** https://macstech.mx

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + TypeScript + Tailwind CSS 4
- Deploy: **Vercel** (team `imaxmx`, proyecto `macs`) · Dominio: **macstech.mx** (GoDaddy)
- Sin backend ni variables de entorno: el sitio es estático.
- Analítica: Vercel Web Analytics (`@vercel/analytics`); el script responde 200 en producción
  (10 de septiembre de 2026). Falta confirmar la recepción de eventos en el dashboard.

## Desarrollo

Requiere **Node ≥ 20.9** (el repo fija la 24 en `.nvmrc`, igual que Vercel).
El clon local está en `/Users/max/Desktop/Todo/Proyectos/MACS`.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # debe pasar antes de cualquier push
npm run lint
```

## Estructura

- `src/app/` — páginas y layout (`layout.tsx` tiene la metadata/SEO y el JSON-LD), más los
  archivos especiales de Next: `sitemap.ts`, `robots.ts`, `icon.svg`, `favicon.ico`, `apple-icon.tsx`
  y `opengraph-image.tsx` (estos dos últimos se generan en el build)
- `src/components/hero/` — la portada: abre con Halion y sigue el diseño de vikod3/handstouch con los
  textos de MACS. `ScrollHero.tsx` (fondo fijo + manos compuestas en WebGL cuyo acercamiento controla el
  scroll, con parallax, carga por Blob y niveles de resolución según la pantalla), `HandsTouchHero.tsx`
  (piezas: barra, hero, pie, sección «about», cierre de sitio, Inter + Outfit, marca «M»), `MenuButton.tsx`
  (menú) y `hand-renderer.ts` (compositor WebGL en modo scrub). `src/data/media.ts` define los videos
  (nombres versionados; `/media/*` se cachea un año). Medios en `public/media/` (61 MB).
- `src/components/halion/` — escena Halion (clon literal): `Halion.tsx`, `halion.css`, `halion-motion.ts`
  (GSAP) y `scroll.ts` (Locomotive Scroll + Lenis, dueño del scroll suave de la portada).
- `src/components/site/` — páginas interiores: `SiteShell.tsx` (barra, franja, salto al contenido y pie),
  `parts.tsx` (anillo, estados, lista del catálogo, filas de ficha, preguntas, ciclo de aprendizaje, botón de
  contacto), `McDetail.tsx` (ficha de cada Mc), `SolutionDetail.tsx` (página de cada giro),
  `ContactForm.tsx` (formulario que abre el correo), `LegalPage.tsx`, `HomeCatalog.tsx` (secciones del
  catálogo en la portada) y `NavLinks.tsx`.
- `src/lib/og.tsx` — imágenes para compartir de cada página (anillo + título), con `src/assets/og/ring.png`.
- `src/data/site.ts` — datos del sitio (nombre, URL, descripción, correo, WhatsApp) y `pageMetadata()`:
  fuente única
- `src/data/agents.ts` — **catálogo completo**: 10 agentes IA y 6 robots con IA, sus áreas, estados,
  giros recomendados y el proceso de trabajo. De aquí salen todas las páginas.
- `src/data/solutions.ts` — los seis giros: qué se repite, equipo de Mc, un día de ejemplo y preguntas.
- Rutas: `/` · `/agentes` y `/agentes/[slug]` · `/robots` y `/robots/[slug]` · `/soluciones` y
  `/soluciones/[slug]` · `/como-trabajamos` · `/nosotros` · `/contacto` · `/privacidad` · `/terminos`
- `src/assets/fonts/` — Geist en TrueType para la og:image (licencia OFL)
- `scripts/brand-assets.mjs` — regenera `favicon.ico` y `public/logo.png` a partir de `icon.svg`
- `docs/PROGRESS.md` — **empieza por aquí**: estado actual, infraestructura y siguientes pasos
- `docs/VISION.md` — concepto y visión de la marca
- `docs/ROADMAP.md` — plan por fases
- `docs/AGENTES/` — un `.md` por Mc (agentes y robots)
- `CHANGELOG.md` — bitácora de cambios por sesión
- `CLAUDE.md` / `AGENTS.md` — instrucciones para sesiones de Claude Code

## Avance del 10 de septiembre de 2026

Publicada y validada: [ficha de McMarketing](https://macstech.mx/agentes/mcmarketing),
su enlace desde la portada y su entrada en el sitemap.
La ficha usa las funciones documentadas (publicación diaria, comentarios y DMs mediante n8n);
el caso de éxito sigue pendiente de datos. Lint, build, navegador, CI y despliegue confirmados
para el commit `ecfe86f`. El correo sigue sin MX/SPF y falta el número de WhatsApp solicitado a Max.

## Despliegue

**Cada push a `main` despliega automáticamente a producción** (~1 min). No hay paso manual.
GitHub Actions (`.github/workflows/ci.yml`) corre lint + build en cada PR hacia `main` y en cada push a `main`.
Verificar siempre que `npm run build` pase antes de hacer push, y **revisar después que el deploy
quede en `READY`**: si el build falla, Vercel conserva el deploy anterior y el sitio sigue en pie,
pero el cambio nunca sale al aire.

El dominio canónico es `macstech.mx` (apex); `www.macstech.mx` redirige con 308 al apex.
No cambiar DNS ni dominios en Vercel.

## Flujo de trabajo

1. Cada cambio se documenta en `CHANGELOG.md`.
2. El roadmap se actualiza en `docs/ROADMAP.md`.
3. Al cerrar una sesión se actualiza `docs/PROGRESS.md` (estado + siguientes pasos).
4. Cada nuevo agente: agregar a `src/data/agents.ts` + crear `docs/AGENTES/<Nombre>.md`.
