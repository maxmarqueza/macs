# MACS — macstech.mx

Sitio web de **MACS**: una familia de agentes de IA especializados (cada "Mc" automatiza una parte de un negocio — marketing, soporte, ventas, datos…).

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS 4
- Deploy: **Vercel** · Dominio: **macstech.mx** (GoDaddy)

## Desarrollo

```bash
npm install
npm run dev   # http://localhost:3000
```

## Estructura

- `src/app/` — páginas y layout
- `src/data/agents.ts` — roster de agentes (fuente única: agregar aquí cada nuevo Mc)
- `docs/VISION.md` — concepto y visión de la marca
- `docs/ROADMAP.md` — plan por fases
- `docs/AGENTES/` — un `.md` por agente
- `CHANGELOG.md` — bitácora de cambios por sesión

## Flujo de trabajo

1. Cada cambio se documenta en `CHANGELOG.md`.
2. El roadmap se actualiza en `docs/ROADMAP.md`.
3. Cada nuevo agente: agregar a `src/data/agents.ts` + crear `docs/AGENTES/<Nombre>.md`.
