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
Publicado en producción el 9 de septiembre de 2026:
- [x] Favicon + og:image con la marca MACS (ícono "M", `apple-icon`, `logo.png`, og:image generada en el build)
- [x] SEO básico: `sitemap.ts`, `robots.ts`, canonical, Twitter card, JSON-LD de organización
- [x] Vercel Analytics (`@vercel/analytics` en el layout); script 200 en producción el 10 de septiembre
- [x] CI en GitHub Actions (ver Mantenimiento)

Avance del 22 de septiembre de 2026:
- [x] Portada = la página de vikod3/handstouch completa y tal cual (barra, hero, sección «about», capas
      fijas, textos, título y tipografías; sin secciones de MACS, por indicación de Max) con los videos
      reescalados a 4K UHD, sin contorno negro, servidos por niveles según la pantalla. Ver `CHANGELOG.md`.
- [x] Textos de MACS sobre ese diseño (aprobados por Max el 22 de septiembre): «inteligencia hecha
      humana», «Un Mc para cada área», McMarketing y Mc en camino; Contacto y etiquetas enlazadas.
- [x] Manos controladas por el scroll (variante B elegida por Max) y auditoría a fondo con corrección
      integral el 22 de septiembre: clip hasta el contacto real, material regenerado (BT.709, píxel
      cuadrado, nivel 5.1, máscara ajustada), carga por Blob con precarga, movimiento afinado, menú real,
      cierre de sitio, 404, imagen para compartir. Ver `CHANGELOG.md`.
- [x] Explosión de partículas que forma «MACS» al tocarse las manos (escena de Grupo MaSa portada
      fielmente) y escena **Halion** recreada exactamente a continuación, con transición coordinada y
      scroll suave (Lenis) en toda la portada. Después, por indicación de Max, se quitó la escena
      de partículas, y después se invirtió el orden: Halion abre la portada y sigue el hero de las
      manos. Ver `CHANGELOG.md`.
- [ ] Unificar la ficha de McMarketing con la identidad blanca de la portada (hoy sigue oscura, Geist).
- [ ] Contacto real: el buzón `contacto@macstech.mx` no existe (sin MX); decidir proveedor o canal.
- [ ] Decidir si el concepto, el roster completo y el contacto de MACS vuelven a la portada o viven en
      otra página: hoy la portada es el diseño de handstouch con los textos de MACS y solo sigue
      publicada `/agentes/mcmarketing`.
- [ ] Confirmar con Max la licencia de los videos de las manos (el repo original no la declara).

Avance del 10 de septiembre de 2026:
- [x] Publicar `/agentes/mcmarketing`: ficha funcional, preguntas frecuentes, diseño adaptable y metadata propia;
      enlace desde la portada y sitemap limitado a páginas existentes. Commit `ecfe86f` publicado;
      lint, build, navegador y CI aprobados; ruta y metadatos comprobados en producción.
- [ ] Confirmar recepción de eventos de Analytics en el dashboard (el script 200 no la demuestra).

Bloqueado a la espera de una decisión de Max:
- [ ] Habilitar correo en macstech.mx (ausencia de MX/SPF reconfirmada el 10 de septiembre) 🔴 falta elegir proveedor
- [ ] Botón / link de WhatsApp en contacto 🔴 número solicitado a Max, pendiente de respuesta
- [ ] Caso de éxito de McMarketing (flujo n8n) 🔴 faltan resultados, redes, herramientas y capturas;
      estos datos no bloquean la ficha funcional básica

## Fase 3 — Crecimiento
- [ ] Blog / novedades
- [ ] Demo interactiva de agentes
- [ ] Más agentes al roster (McWeb, McHardware…)

## Mantenimiento
- [x] Next.js al día (16.3.4) — septiembre 2026
- [x] CI en GitHub Actions (lint + build) — `.github/workflows/ci.yml`, primera ejecución en `main` en verde el 9 de septiembre 2026
- [x] Versión de Node fijada en el repo (`engines` + `.nvmrc`) — septiembre 2026
- [x] Bug corregido: el sitio renderizaba en Arial pese a cargar Geist — septiembre 2026
- [x] `npm audit` limpio otra vez (js-yaml transitivo parchado) — 9 de septiembre 2026
- [x] Restos de `create-next-app` eliminados (`public/*.svg`) — 9 de septiembre 2026
- [ ] Evaluar saltos de versión mayor: eslint 10, TypeScript 7, @types/node 26

## Descartado
- ❌ **Criptomoneda / token $MACS** (decisión de Max, septiembre 2026). No retomar.
  Detalle en [PROGRESS.md](PROGRESS.md#decisiones-tomadas-no-revertir-sin-razón).

## Mejora continua
Cada sesión de trabajo: actualizar `CHANGELOG.md`, marcar avances aquí, poner al día
`PROGRESS.md`, revisar el resultado e informar brevemente. Sugerir únicamente un próximo paso
que Max aún no haya indicado, considerando el contexto completo (ver preferencias en `AGENTS.md`).
