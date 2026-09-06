# Roadmap — macstech.mx

Estado detallado y siguientes pasos: [PROGRESS.md](PROGRESS.md).

## Fase 1 — Base (agosto 2026) ✅ completa
- [x] Comprar dominio macstech.mx (GoDaddy)
- [x] Scaffolding del proyecto (Next.js + Tailwind)
- [x] Crear repo en GitHub (github.com/maxmarqueza/macs) y conectar a Vercel (team imaxmx, proyecto "macs")
- [x] Configurar DNS de GoDaddy → Vercel (A @ → 216.150.1.1; SSL emitido; sitio vivo en https://macstech.mx)
- [x] www.macstech.mx → redirect 308 a macstech.mx
- [x] Landing page v1: hero, concepto MACS, roster de agentes, contacto

## Fase 2 — Contenido (en curso)
Listo para empezar (no depende de nadie):
- [ ] Favicon + og:image con la marca MACS
- [ ] SEO básico: `sitemap.ts`, `robots.ts`, JSON-LD de organización
- [ ] Vercel Analytics

Bloqueado a la espera de información de Max:
- [ ] Botón / link de WhatsApp en contacto 🔴 falta el número
- [ ] Página por agente, empezando con `/agentes/mcmarketing` 🔴 falta info del agente
- [ ] Caso de éxito de McMarketing (flujo n8n) 🔴 falta info y capturas

## Fase 3 — Crecimiento
- [ ] Blog / novedades
- [ ] Demo interactiva de agentes
- [ ] Más agentes al roster (McWeb, McHardware…)

## Mantenimiento
- [x] Next.js al día (16.3.4) — septiembre 2026
- [ ] Evaluar saltos de versión mayor: eslint 10, TypeScript 7, @types/node 26

## Descartado
- ❌ **Criptomoneda / token $MACS** (decisión de Max, septiembre 2026). No retomar.
  Detalle en [PROGRESS.md](PROGRESS.md#decisiones-tomadas-no-revertir-sin-razón).

## Mejora continua
Cada sesión de trabajo: actualizar `CHANGELOG.md`, marcar avances aquí, poner al día
`PROGRESS.md`, y proponer 1–2 mejoras.
