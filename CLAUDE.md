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
