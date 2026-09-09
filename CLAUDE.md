@AGENTS.md

# Proyecto MACS — macstech.mx

Sitio de MACS: familia de agentes IA ("Mc") que automatizan áreas de un negocio.
Comunicarse con Max **en español**.

**Antes de trabajar, leer `docs/PROGRESS.md`** — tiene el estado actual, la infraestructura,
los siguientes pasos y las decisiones tomadas. Es el documento de traspaso entre sesiones.

Reglas de trabajo:

- Cada push a `main` despliega automáticamente a producción (https://macstech.mx). Verificar
  que `npm run build` pase antes de hacer push.
- Al terminar una sesión de trabajo: actualizar `CHANGELOG.md`, `docs/ROADMAP.md` y
  `docs/PROGRESS.md` (estado + siguientes pasos), y hacer push.
- Nuevo agente Mc = entrada en `src/data/agents.ts` + ficha en `docs/AGENTES/<Nombre>.md`.
- El dominio canónico es `macstech.mx` (sin www). No cambiar DNS ni dominios en Vercel.
- **Criptomoneda: descartada.** Max decidió no crear el token $MACS. Existe una rama vieja
  en GitHub (`claude/crear-criptomoneda-propia-8a300q`) que **no** se fusiona a `main`.
  No proponer ni retomar el tema.
- Antes de dar por hecha la infraestructura, se puede verificar en vivo: `curl -I https://macstech.mx`
  (200) y `curl -I https://www.macstech.mx` (308 al apex). **Ojo:** eso solo funciona en local; en las
  sesiones de Claude en la nube el proxy de red bloquea `curl` a macstech.mx y a `*.vercel.app` (403).
  Ahí se verifica con las herramientas MCP de Vercel (`get_project`, `list_deployments`,
  `get_deployment_build_logs`).
- Si se cambia el ícono (`src/app/icon.svg`), correr `node scripts/brand-assets.mjs` para regenerar
  `favicon.ico` y `public/logo.png`; el `apple-icon` y la og:image se regeneran solos en el build.
