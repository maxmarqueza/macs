# MACS — macstech.mx

Sitio web de **MACS**: una familia de agentes de IA especializados (cada "Mc" automatiza una parte de un negocio — marketing, soporte, ventas, datos…).

🔗 **En producción:** https://macstech.mx

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + TypeScript + Tailwind CSS 4
- Deploy: **Vercel** (team `imaxmx`, proyecto `macs`) · Dominio: **macstech.mx** (GoDaddy)
- Sin backend ni variables de entorno: el sitio es estático.

## Desarrollo

Requiere **Node ≥ 20.9** (el repo fija la 24 en `.nvmrc`, igual que Vercel).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # debe pasar antes de cualquier push
npm run lint
```

## Estructura

- `src/app/` — páginas y layout (`layout.tsx` tiene la metadata/SEO)
- `src/data/agents.ts` — roster de agentes (fuente única: agregar aquí cada nuevo Mc)
- `docs/PROGRESS.md` — **empieza por aquí**: estado actual, infraestructura y siguientes pasos
- `docs/VISION.md` — concepto y visión de la marca
- `docs/ROADMAP.md` — plan por fases
- `docs/AGENTES/` — un `.md` por agente
- `CHANGELOG.md` — bitácora de cambios por sesión
- `CLAUDE.md` / `AGENTS.md` — instrucciones para sesiones de Claude Code

## Despliegue

**Cada push a `main` despliega automáticamente a producción** (~1 min). No hay paso manual.
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
