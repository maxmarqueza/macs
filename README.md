# MACS — macstech.mx

Sitio web de **MACS**: una familia de agentes de IA especializados (cada "Mc" automatiza una parte de un negocio — marketing, soporte, ventas, datos…).

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
- `src/data/site.ts` — datos del sitio (nombre, URL, descripción, correo): fuente única
- `src/data/agents.ts` — roster de agentes; `href` opcional enlaza solamente fichas existentes
- `src/app/agentes/mcmarketing/page.tsx` — ficha funcional de McMarketing con preguntas frecuentes
- `src/assets/fonts/` — Geist en TrueType para la og:image (licencia OFL)
- `scripts/brand-assets.mjs` — regenera `favicon.ico` y `public/logo.png` a partir de `icon.svg`
- `docs/PROGRESS.md` — **empieza por aquí**: estado actual, infraestructura y siguientes pasos
- `docs/VISION.md` — concepto y visión de la marca
- `docs/ROADMAP.md` — plan por fases
- `docs/AGENTES/` — un `.md` por agente
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
