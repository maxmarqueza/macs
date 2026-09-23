# Changelog

## 2026-09-22 (sin escena de partículas: manos y Halion por separado)
- Max: «quítame esta sección de transición, quiero las 2 secciones por separado sin modificar, a la
  perfección». Se eliminó por completo la explosión de partículas (`macs-burst.ts` y la dependencia
  `three`).
- **Sección 1, hero de las manos:** exactamente el publicado en `88f1f32` (recorrido 280 svh, toque en el
  último cuadro, pie y título igual), con una sola diferencia: al soltarse, las manos se van exactamente
  con su sección (antes al 90 %, lo que las haría invadir Halion).
- **Sección 2, Halion:** el clon literal, a continuación y sin relevo coordinado. Cada sección muestra
  solo su cabecera: la barra de MACS se retira y la de Halion aparece en la misma línea (72 px), y a la
  inversa al llegar a «Un Mc para cada área». El video de fondo del hero se pausa mientras Halion lo
  cubre por completo.
- Verificado con capturas reales (Chrome local) a 1440 × 900 y 390 × 844: hero, toque, salida de la
  sección, Halion (hero, about, product, callouts), relevo de cabeceras y pie de MACS; sin errores.
- **Publicado** con el commit `c3276562070b3394d1e8922e97d3bc14fc87e392` en `main`
  ([despliegue](https://vercel.com/imaxmx/macs/2vVwi2B9jiRsFSVCKaE6BayiXBA6) `success`); comprobado en
  https://macstech.mx con capturas reales, sin rastro de la escena de partículas.

## 2026-09-22 (partículas y Halion como dos secciones independientes)
- Max: «no quiero transición, no quedó nada bien; sepáralas en 2 secciones independientes y déjalo
  perfecto». Se quitó el relevo coordinado entre la palabra y Halion.
- **Sección 1 (manos → partículas).** La palabra «MACS» ya no se disuelve: termina de formarse al 62 %
  del recorrido, se sostiene y sale con su sección como cualquier otra. Recorrido de la explosión
  240 svh (antes 260).
- **Sección 2 (Halion).** Arranca sola cuando llega: su cabecera aparece solo cuando la sección ocupa la
  pantalla completa (antes asomaba sobre el final de las partículas) y se retira en el mismo píxel en
  que vuelve la barra de MACS (antes la barra de MACS reaparecía con media pantalla todavía en Halion).
- **Correcciones encontradas al revisar con capturas reales** (Chrome local sin cabeza):
  - La bola de partículas nacía muy por debajo de las yemas: la cámara no tenía la matriz actualizada
    al calcular el punto de contacto. Ahora nace exactamente entre los dedos, y el punto se fija en el
    instante del toque (con las manos ya en su posición final).
  - En móvil la palabra se salía por los lados: en pantallas angostas se reduce para caber con margen
    (en escritorio no cambia).
- Verificado en local a 1440 × 900 y 390 × 844 en cada tramo: toque, nacimiento en las yemas, explosión,
  palabra completa, salida de la sección, Halion (hero, about, product, callouts) y relevo de cabeceras
  hasta el pie de MACS; sin errores de consola.
- **Publicado** con el commit `89480c828d2f3aafa98505eb403ac663221b8fb5` en `main`
  ([despliegue](https://vercel.com/imaxmx/macs/CQEQDfmLoUiACzTHVTp66oKeVSuf) `success`). Comprobado en
  https://macstech.mx con capturas reales: nacimiento en las yemas, «MACS» formado, salida de la sección
  y Halion aparte con su cabecera; sin errores de consola.

## 2026-09-22 (explosión «MACS» al tocarse las manos + escena Halion)
- Max: al tocarse las manos, el efecto de partículas del sitio de Grupo MaSa «tal cual, misma calidad,
  mismo diseño, misma operación», formando la palabra **MACS**, y enseguida la siguiente escena con una
  transición coordinada: **Halion (new-13-v2, build CDN) recreado exactamente**, sin adaptarlo a MACS.
- **Explosión.** `src/components/hero/macs-burst.ts`, port fiel de la escena three.js de `portada.html`
  de MaSa (shader de partículas azul con núcleo y halo, agua con ondas, chispas, niebla, haz, estrellas,
  bokeh, reflejo en el agua, aberración cromática, cámara con parallax del puntero). 50 000 partículas
  nacen en las yemas (punto de contacto medido sobre el marco de las manos), estallan y forman «MACS» con
  contorno blanco y escombros; al final se disuelven hacia arriba. El bloque fijo del hero pasa de
  100 + 180 svh a 100 + 180 + 260 svh: acercamiento de las manos y después oscurecimiento 0–12 %,
  explosión 12–55 % (las manos se apagan entre 12 y 30 %), palabra sostenida, disolución 80–100 %. La
  escena solo se dibuja mientras está en pantalla, el video de fondo se pausa cuando queda tapado y la
  barra de MACS se apaga en las escenas oscuras y vuelve con «Un Mc para cada área».
- **Halion.** `src/components/halion/`: `Halion.tsx` (DOM y textos exactos de la especificación, los
  cuatro medios de CloudFront intactos, Inter Tight 400/500 por `next/font` con el mismo respaldo métrico
  que el original, bootstrap-icons 1.13.1 del CDN), `halion.css` (la hoja del original; la raíz fluida
  `html { font-size }` vive en `--u` y cada `rem` es `calc(N * var(--u))` para no alterar el resto de la
  portada), `halion-motion.ts` (catálogo H1–H9 con GSAP 3.13: intro por beats, título que sale por su
  máscara, plegado de la cabecera con Flip, reloj de Zúrich, clips scrubeados con búsquedas coalescidas,
  parallax del cursor, statement, título de producto con línea maestra, callouts en gravedad sobre los
  tres anclajes del clip 2 con cola de 1.2 s propiedad del cursor) y `scroll.ts` (Locomotive Scroll 5 +
  Lenis sobre el ticker de GSAP, dueño del scroll de toda la portada; anclas internas con `scrollTo` de
  2 s; `scrollRestoration` manual y scroll a 0 al arrancar, como el original).
- **Transición.** La palabra se disuelve subiendo justo al soltarse el bloque; el escenario negro de
  Halion entra por debajo (continuidad negro → negro) y su intro arranca cuando su hero llega al 15 %
  superior de la pantalla; la cabecera de Halion existe solo dentro de su escena y se releva con la barra
  de MACS al entrar la sección final. Únicas diferencias respecto al original, obligadas por vivir dentro
  de la portada: la intro no arranca al cargar sino al llegar; el escenario se recorta a su altura
  (`overflow: clip`, porque su sticky seguiría pegado 100 lvh sobre la sección siguiente); bajo 768 px
  hero, about y product se apilan (la especificación solo describe la composición de escritorio). Los
  clips de Halion son 1920 × 1080 por especificación (URLs fijas): no existe versión 4K de ellos.
- Con Lenis activo, el hero de las manos pasa a mapeo directo (Lenis ya suaviza; el resorte queda como
  respaldo). Las anclas de MACS (`#agentes`, `#proximos`, `#contacto`) son `<a>` normales para que
  Lenis las desplace. Clase `js` en `<html>` desde el script inline del `<head>`.
- Dependencias nuevas: three 0.170, gsap 3.13, locomotive-scroll 5.0 (lenis 1.3.17), @types/three.
- Verificado en local (lint, build, 1440 × 900 y 390 × 844): partículas desde las yemas, «MACS» formado
  y disuelto; Halion con intro, título de tres palabras (691 / 417 / 283 px a 1440, peso 400), lead en
  tres líneas, cápsula compacta con Flip y vuelta, roll-out del título, statement en cinco líneas,
  hairlines, chips 02 y 03, clip 1 hasta 8.04 s, clip 2 hasta 10.04 s, callouts con líneas y puntos, y
  regreso de la barra de MACS sobre fondo blanco. La captura del panel del navegador no incluye capas de
  video; el cuadro decodificado se comprobó volcándolo a un canvas.
- **Publicado** con el commit `18ddd4e3ed3f6eaec42c1e2cab09833a8abbe963` en `main`.
  [Despliegue Vercel](https://vercel.com/imaxmx/macs/EZLBQ8ufFEoxCy8enjH1doQswjd6): estado del commit en
  GitHub `success`. En producción: portada 200 con la escena Halion (textos, los dos clips de CloudFront,
  bootstrap-icons, Inter Tight), clase `js` y Lenis activos; comprobado en el navegador sobre
  https://macstech.mx: explosión de partículas en el bloque fijo, intro de Halion con título, lead en tres
  líneas y reloj de Zúrich, sin errores de consola.

## 2026-09-22 (auditoría a fondo de la portada y corrección integral)
- Max: «vuelve a revisar a fondo, no quedó bien, déjalo perfecto, es la imagen de mi empresa». Se corrió una
  auditoría con siete revisores independientes (código, carga, imagen, movimiento, marca, navegadores y una
  inspección en vivo) y se corrigió todo lo confirmado, sin más agentes para no gastar créditos.
- **El video terminaba antes del toque.** Medido con componentes conexas sobre la máscara: el contacto real
  ocurre en los cuadros 140–148 del original (5.83–6.17 s) y el clip cortaba en el 125 con 48 px de
  separación. Nuevo clip 0 → cuadro 144 (145 cuadros a 24 fps nativos; se abandona la interpolación a 48 fps
  porque los cuadros intermedios eran un 20 % más blandos y hacían parpadear la nitidez).
- **Material regenerado** desde el máster (`hands-scroll-*.v2.mp4`): máscara erosionada 2 px + suavizado 1 px
  (quita el halo claro y la contaminación negra del borde), color convertido y **etiquetado BT.709/tv**
  (antes sin etiquetas y con matriz 601: tono distinto entre navegadores y salto póster → canvas), **píxel
  cuadrado** (los mp4 llevaban SAR 539:540 y el navegador reescalaba cada cuadro), nivel superior **3744 px**
  (H.264 nivel 5.1, decodificable por hardware; 3840×2560 exigía nivel 6.0) y nuevo nivel **1296 px** para
  teléfonos. CRF 12, todos los cuadros clave, `slices=4`. Pesos: 5.5 / 9.5 / 19.3 / 26.9 MB. Fondo: solo el
  nivel 1920 (el 4K era un desenfoque idéntico). Póster nuevo con el alfa del shader (webp q95).
- **Carga.** El video se descarga completo con `fetch` y se asigna como Blob: todas las búsquedas son locales
  (antes, con `preload`, un scroll temprano buscaba en rangos sin descargar y las manos se congelaban o
  saltaban). Barra de progreso de 2 px arriba. Precarga desde `<head>` con un script inline antes del JS
  (`src/data/media.ts`, fuente única de niveles). `/media/*` con `Cache-Control: immutable` y nombres
  versionados (`next.config.ts`). Sin video solo si el usuario activó ahorro de datos.
- **Movimiento.** Curva `0.65p + 0.35p²` que compensa el frenado natural del metraje (antes doble ease-out:
  arranque pegado y final lento); resorte más firme (900, asienta en ~0.15 s) y mapeo directo en táctil;
  el toque se sostiene el 6 % final; el resorte arranca en la posición del scroll (recarga/volver atrás sin
  animación espuria); el título se desvanece del todo antes del toque (ya no queda un «fantasma» al 15 %
  entre los dedos); el pie se oculta de verdad (`visibility` + `inert`) al desaparecer; **tras el hero las
  manos se van con él** (antes quedaban fijas tapando el párrafo de la segunda pantalla); bucle rAF que
  duerme cuando nada cambia; `prefers-reduced-motion` desactiva parallax, fondo y entradas (el scrub por
  scroll se conserva); sin animaciones de entrada si la página abre ya desplazada.
- **Capas.** El degradado blanco vive dentro de la sección fija del hero, bajo su texto: el pie del hero
  (lema, copy, etiquetas) ya no se ve lavado y la segunda pantalla ya no queda bajo el degradado.
- **Compositor.** Dibujo tras `requestVideoFrameCallback` (Safari entregaba el cuadro anterior en
  `seeked`), respaldo con `seeked` + un cuadro extra, `highp` en el shader, `WEBGL_lose_context` y limpieza
  de `src` al desmontar, cambio de densidad de pantalla, sin código de reproducción automática.
- **Móvil.** Unidades `svh`/`lvh` y recorrido calculado con las alturas reales de la sección (antes
  `100vh` + `innerHeight` saltaban al plegarse la barra del navegador).
- **Página terminada.** El botón «Menú» abre un menú real (Inicio, Un Mc para cada área, McMarketing,
  Próximos Mc, Contacto; Escape/clic fuera cierran); las pastillas «Agentes IA · Automatización» enlazan;
  cierre de sitio con CTA de contacto y línea legal (`SiteFooter`, `#contacto`); anclas `#agentes` y
  `#proximos` (los CTAs de la ficha de McMarketing volvían a anclas inexistentes); página 404 con marca;
  **imagen para compartir** rehecha en blanco con las manos tocándose; `theme-color` blanco en la portada;
  un solo `h1` («MACS / inteligencia hecha humana»); contraste del subtítulo y del lema del pie subido;
  `lastModified` fijo en el sitemap; eliminada la vista previa `/lab/scroll` y la variante A.
- Pendiente que no depende del código: `contacto@macstech.mx` sigue sin buzón (sin MX); todos los contactos
  del sitio apuntan ahí. Y la ficha de McMarketing conserva la identidad oscura anterior.
- Verificado en local (lint, build, 1440 × 900 y 375 × 812: Blob cargado, toque en el último cuadro, pie
  nítido, manos que se van con el hero, menú, 404, sin recursos fallidos) y **publicado** con el commit
  `88f1f3285355ebd16c28d2cd34534dbeb486d476` en `main`.
  [Despliegue Vercel](https://vercel.com/imaxmx/macs/3XaFuq5jzPhDSeTj1X2QepANEpJG): estado del commit en
  GitHub `success`. En producción: portada 200 con los cuatro niveles `.v2`, anclas y `theme-color` blanco;
  `/media/*` con `Cache-Control: immutable`; `/opengraph-image` PNG 1200 × 630; `/no-existe` y
  `/lab/scroll` responden 404 con la página propia.

## 2026-09-22 (portada por scroll, variante B perfeccionada)
- Max eligió la variante **B** («me gusta la B pero pierde muchísima calidad, perfecciónalo»). Ahora es la
  portada (`src/components/hero/ScrollHero.tsx`), y `/lab/scroll` la conserva junto a A para comparar.
- **Calidad de imagen.** El video de scroll pasa de CRF 20 a **CRF 12** (casi sin pérdida; cada cuadro se
  ve quieto y la compresión se notaba), sigue con todos los cuadros clave y ahora tiene nivel **3840** para
  monitores 4K además de 3072 (retina) y 1920 (móvil). Solo cubre el tramo que se usa (reposo → toque,
  0–5.2 s). Pesos: `hands-scroll-1920.mp4` 13.3 MB · `-3072` 26.3 MB · `-3840` 37.4 MB. Las manos solo
  se trasladan en el parallax, nunca se reescalan, para no perder nitidez.
- **Calidad de movimiento.** El tramo se interpoló de 24 a **48 fps** con compensación de movimiento
  (`minterpolate` mci/aobmc/bidir), verificado: los cuadros intermedios conservan la coincidencia entre
  color y máscara (XOR ≈ 45 k px, igual que los originales) y sin artefactos visibles en dedos ni brazo.
  Así cada paso del scroll mueve las manos ~2 px en pantalla en vez de ~4. La inercia es un **resorte
  críticamente amortiguado** (sin rebote, arranque y frenado naturales, independiente de los fps), el
  recorrido lleva un suavizado leve que respeta el ritmo del metraje y el toque **se sostiene** el 10 %
  final del recorrido antes de soltar la pantalla. Parallax afinado: fondo −6 vh y escala 1.07, título −9 vh
  con desvanecido cuadrático (legible hasta el final), pie desaparece en el primer 45 %, manos −4 vh.
  Recorrido de 280 vh.
- Limpieza: se eliminan el hero de reproducción automática (`HeroScene.tsx`), sus niveles
  `hands-rgba-*.mp4` y los videos de `media/lab/` (28 MB); la variante C queda fuera porque necesitaba el
  tramo de separación, que ya no se incluye. `public/media/` pesa 83 MB.
- Verificado: resorte sin rebote que asienta en 0.5 s a 30/60/120 fps; el mapeo scroll → cuadro termina
  en el cuadro 249 (toque) al 90 % del recorrido; en local carga el nivel 3072 en retina y 1920 en móvil
  sin errores de red; lint y build. (El panel de Claude pausa la animación en segundo plano, así que la
  fluidez se juzga en Chrome.) **Publicado** con el commit `6f2b9927ab10521461f37dd017668f9cd51500b8` en
  `main`. [Despliegue Vercel](https://vercel.com/imaxmx/macs/2o2699iZCA3VmtJVC216ESNKgbn6): estado del
  commit en GitHub `success`; portada, los tres niveles de scroll y `/lab/scroll` responden 200.

## 2026-09-22 (vista previa: manos controladas por el scroll)
- Max pidió que el acercamiento de las manos lo controle el scroll (empieza en reposo, termina al tocarse
  los dedos, con parallax y 4K) y opciones con vista previa. Nueva página **`/lab/scroll`** (no indexada,
  `robots` la excluye) con tres variantes conmutables (`?v=a|b|c`), sobre el mismo diseño y textos de la
  portada: **A · Directo** (el scroll mueve las manos 1:1, recorrido de 200vh), **B · Parallax** (suavizado
  con inercia; fondo, título, pie y manos a distinta velocidad; recorrido de 260vh) y **C · Ciclo** (como B y,
  al entrar la segunda pantalla, las manos se separan y dejan libre el contenido).
- Técnica: `hand-renderer.ts` gana un modo `scrub` (`seek(time)` con búsquedas agrupadas, la última gana) y
  devuelve `{ dispose, seek }`. Los videos de scrub van con todos los cuadros clave (`-g 1`) para que cada
  búsqueda sea inmediata: `public/media/lab/hands-scrub-3072.mp4` (18.6 MB, retina) y `-1920` (10 MB,
  móvil). La portada no cambia; `HandsTouchHero.tsx` exporta sus piezas para reutilizarlas.
- La inercia es independiente de los fps (constante de tiempo, no por cuadro), para que se sienta igual a
  60 y 120 Hz. Las búsquedas esperan a los metadatos del video y se liberan solas si el navegador no
  emite `seeked`.
- Verificado en local (el panel de Claude limita la animación a ~2 fps en segundo plano, así que las
  comprobaciones son por valores, no por fluidez): en B el cuadro sigue al scroll (2.2 s a mitad del
  recorrido, 5.19 s = toque al final) y la segunda pantalla entra con las manos fijas; en C las manos se
  separan al entrar la segunda pantalla (8.2 s → 10.3 s); móvil elige el archivo de 1920 px sin
  desbordamiento; consola limpia; lint y build. La fluidez real se juzga en Chrome, que es el objetivo de
  la vista previa.
- **Publicado** con el commit `5b2577ad3516f50124539766849b958bda2f7dcb` en `main`.
  [Despliegue Vercel](https://vercel.com/imaxmx/macs/625iBJ6Xj8r4MVRyGMDKacU6RSqj): estado del commit en
  GitHub `success`. En producción `/lab/scroll` responde 200 (con `noindex`), los dos videos de scrub
  responden 200 y `robots.txt` excluye `/lab/`.

## 2026-09-22 (textos de MACS sobre el diseño de handstouch)
- Con el diseño ya idéntico al original, Max pidió opciones de texto para MACS y aprobó esta mezcla
  («publícalo tal cual»): marca «M» de MACS en el logo; barra «MACS · Menú · Agentes IA · Automatización ·
  Contacto» (Contacto enlaza a `contacto@macstech.mx`); hero «MACS / inteligencia hecha humana»; pie
  «Agentes IA para tu negocio» + «Cada Mc es un agente de inteligencia artificial que automatiza una parte
  de tu negocio, para que tú te concentres en hacerlo crecer» + etiquetas Marketing (enlaza a la ficha),
  Soporte y Ventas (enlazan al correo); segunda pantalla «Un Mc para / cada área», «01 / McMarketing:
  Publica. Responde. Conversa.» (enlaza a la ficha) con sus funciones documentadas, «El lado humano de la
  automatización», «02 / Próximos Mc: Soporte. Ventas. Datos.» y áreas Marketing · Soporte · Ventas ·
  Datos · Contenido · Automatización. Título y descripción vuelven a los de MACS.
- Diseño, medidas, tipografías, capas fijas, animaciones y videos 4K: sin cambios. Solo se afirma lo que
  documenta `src/data/agents.ts` (los Mc en camino se presentan como «vienen en camino»).
- Verificado en local (1440 × 900 y 375 × 812: textos completos sin desbordamiento, enlaces correctos,
  consola limpia, lint y build) y **publicado** con el commit `57ae37a6db41ca19c03b61e3b18b0a3290f42eff`
  en `main`. [Despliegue Vercel](https://vercel.com/imaxmx/macs/2KaGbD4rMq1rmpT86RsLqgeMpkTi): estado del
  commit en GitHub `success`, «Deployment has completed». En producción la portada responde 200 con el
  título de MACS, los textos nuevos y los enlaces a la ficha y al correo.

## 2026-09-22 (portada = página original completa; manos sin contorno negro)
- **La portada es ahora la página de [vikod3/handstouch](https://github.com/vikod3/handstouch)
  completa y tal cual**, por indicación de Max («exactamente como la página original, no importa si no
  queda nada de MACS»): barra fija, hero, pie con etiquetas, sección «Built to move with you», video de
  fondo, degradado y manos con `position: fixed` como en el original, título y descripción del original
  («NeuralKinetics»), fondo blanco también en modo oscuro. Se quitaron de la portada las secciones de
  MACS (concepto, roster, contacto y pie). `/agentes/mcmarketing`, el sitemap y el resto del sitio siguen.
- **Contorno negro de las manos, corregido.** Al comparar el compuesto sobre blanco del 4K con el del
  original apareció una franja negra en el lado del movimiento de los dedos. Causa real, comprobada
  cuadro por cuadro: al apilar el color reescalado (mp4, base de tiempo 1/12288) con la máscara
  (mkv, base 1/1000), la sincronización de ffmpeg emparejaba cuadros distintos y la máscara quedaba uno o
  dos cuadros atrás del color, así que cubría zonas donde el color ya era negro. Los cuadros de la IA y
  de la máscara sí coinciden por índice con el original (bordes a ±2 px). Arreglo: normalizar las marcas
  de tiempo de ambas entradas (`settb` + `setpts=N/24/TB`) antes de `vstack` y verificar por índice que
  color, máscara y original coinciden. Niveles y póster regenerados desde ese máster.
- Verificado: en los mp4 finales, bordes de color y de máscara coinciden con el original en los cuadros
  12, 13, 14, 100 y 200 (±2 px, como en el original) y la máscara difiere del original en < 450 px por
  cuadro; compuestos sobre blanco sin franja negra en mano, robot y yemas; en el navegador la portada
  carga con título «NeuralKinetics», capas `fixed`, nivel 3072 px en 1440 × 900 @2x, sin errores; lint y
  build en verde.
- **Publicado** con el commit `c4dbe267187aa52cd1e4d618f9462ef005f88cf2` en `main`.
  [Despliegue Vercel](https://vercel.com/imaxmx/macs/BQef5EGDWfzJ4Lysg8ezSvwjAk5B): estado del commit en
  GitHub `success`, «Deployment has completed». En producción la portada responde 200 con título
  «NeuralKinetics», sin secciones de MACS, y los tres niveles nuevos de las manos responden 200.

## 2026-09-22 (hero 100 % original: capas fijas y segunda pantalla)
- Max señaló que el hero no era idéntico al original. Diferencias corregidas: en
  [vikod3/handstouch](https://github.com/vikod3/handstouch) la barra, el video de fondo, el degradado
  inferior y las manos son `position: fixed`, así que al hacer scroll se quedan en pantalla mientras entra
  la segunda pantalla («Built to move with you»), que además no estaba incluida. Ahora la página abre con
  las **dos pantallas del original tal cual** (hero + «about», textos y CSS intactos, `.about-*` copiado de
  su `index.css`) y las cuatro capas se comportan como `fixed` durante esas dos pantallas.
- Implementación: `.hero-root` es una rejilla de una celda; cada capa es un `.hero-layer` pegajoso
  (`position: sticky`, 100vh, mismo z-index que en el original: video 0, degradado 20, barra 50, manos 60)
  que se va con la sección «about», para no flotar sobre el resto del sitio. Verificado que los botones de
  la barra y las etiquetas del pie reciben clics y que el texto se intercala igual que en el original.
- Las animaciones de entrada corren siempre, como con `motion` en el original (antes se omitían con
  `prefers-reduced-motion`).
- Verificado en local contra el build original servido lado a lado: 1440 × 900 en scroll 0 / 450 / 900 px
  idéntico; a 1350 y 1800 px las capas ya se fueron y siguen las secciones de MACS; 375 × 812 sin
  desbordamiento. Lint y build en verde.
- **Publicado** con el commit `acb53e34b6f2217bb235492e7a1a60319cef825e` en `main`.
  [Despliegue Vercel](https://vercel.com/imaxmx/macs/HpTz5D6c2rsCy9ZWc7vqWWtzda7F): estado del commit en
  GitHub `success`, «Deployment has completed». La portada en producción responde 200 e incluye las capas
  pegajosas y la sección «Built to move with you».

## 2026-09-22 (hero tal cual el original, en 4K UHD)
- **Hero copiado tal cual de [vikod3/handstouch](https://github.com/vikod3/handstouch)**, por
  indicación de Max («no lo adecues al sitio de MACS, pégalo tal cual la sección»): barra superior
  (NeuralKinetics, Menu, Advanced Bionics / Cognitive AI, Adaptive Systems), título «NeuralKinetics /
  cybernetics made organic», pie «Autonomous Dynamics» con sus etiquetas, tipografías Inter + Outfit
  (`next/font`), medidas y animaciones del original. Sin dependencias nuevas: `motion` se sustituyó por
  animaciones CSS equivalentes y el icono de `lucide-react` por su SVG. Lo único distinto: `fixed` →
  `absolute`, para que el efecto viva dentro de la sección y no flote sobre el resto del sitio.
  Código en `src/components/hero/HandsTouchHero.tsx` (sección) y `HeroScene.tsx` (capas de video).
- **Calidad 4K UHD.** Los videos originales (1440 px y 1280 px, bajo bitrate) se veían pixelados en
  pantallas retina. Se reescalaron con IA (ByteDance Video Upscale vía Higgsfield, ~2 créditos):
  el color de las manos a 6468 × 2160 y el fondo a 3814 × 2160, y de ahí se generaron los archivos
  finales con Lanczos + H.264 CRF 16. La máscara alfa de las manos se reescaló con Lanczos y un
  ligero enfoque (el tercer trabajo de IA lo bloqueó el clasificador de permisos de la sesión).
  Póster nuevo de 3840 × 1280 (webp con alfa) servido por `next/image` con calidad 90.
- **Niveles por pantalla** (`HeroScene.tsx` elige el mínimo que cubre ancho CSS × densidad, tope 3×;
  así retina y 4K nunca escalan hacia arriba y los teléfonos no bajan el archivo grande):
  manos `hands-rgba-1920.mp4` (4.1 MB) / `-3072` (8.3 MB) / `-3840` (11.6 MB, H.264 nivel 6.0);
  fondo `background-1920.mp4` (2.4 MB) / `-3840` (7.7 MB). Total en `public/media/`: 33 MB.
  El compositor WebGL ahora admite densidad 3×, evita mezclar las dos mitades del video al filtrar y
  no aplica conversiones de color del navegador. Se eliminaron `hands-rgba.mp4` y `background.mp4`.
- `next.config.ts`: `images.qualities: [75, 90]` (Next 16 exige declarar las calidades usadas).
- Verificado en local: lint, build, 1440 × 900 (nivel 3072 + fondo 4K, póster 3840) y 375 × 812
  (niveles 1920) sin desbordamiento, fuentes Outfit/Inter activas, sin errores de consola.
- **Publicado** con el commit `b4847aeb8198656bc72a34081e554ce602a72cfd` en `main`.
  [Despliegue Vercel](https://vercel.com/imaxmx/macs/8LDSXyvBqRLBEn8VBgXwEusVUaYL): estado del commit
  en GitHub `success`, «Deployment has completed». En producción la portada responde 200 con el hero
  original, los cinco videos y el póster responden 200 con su content-type, y `next/image` entrega el
  póster como webp con canal alfa (3840 × 1280 para `w=3840`, 1920 × 640 para `w=1920`).

## 2026-09-22 (hero con manos humana y robótica)
- **Nuevo hero en la portada**, adaptado de [vikod3/handstouch](https://github.com/vikod3/handstouch)
  a petición de Max: video ambiental de fondo y, por encima del texto, una mano humana y una robótica
  que se buscan y se tocan (loop de 12 s). El hero pasa de fondo oscuro a **blanco**; el resto del
  sitio no cambia.
- Implementación sin dependencias nuevas: `src/components/hero/HeroScene.tsx` (cliente) y
  `src/components/hero/hand-renderer.ts` (WebGL 1 puro, ~200 líneas, cargado aparte con `import()`).
  El video `hands-rgba.mp4` va apilado (color arriba, máscara alfa abajo) y un shader lo compone con
  transparencia real; el original usaba three.js. Póster estático mientras llega el primer cuadro o
  si WebGL falla; respeta `prefers-reduced-motion` (cuadro fijo) y pausa al ocultar la pestaña.
- Medios en `public/media/` (1.4 MB en total: `background.mp4`, `hands-rgba.mp4`, `hands-poster.webp`),
  copiados tal cual del repo original, que **no declara licencia** (ver pendientes en `PROGRESS.md`).
- Texto del hero: eyebrow `macstech.mx`, «MACS», «Muchos Mc, un solo objetivo», y abajo la frase
  de siempre con los dos botones («Conoce a los Mc», «Contacto»). Sin afirmaciones nuevas.
- Verificado en local: lint, build (ruta estática), 1440/1024/375 px sin desbordamiento, modo oscuro
  (el hero se mantiene blanco), pérdida y restauración del contexto WebGL (vuelve al póster y se
  recupera), y ambos videos reproduciéndose.
- **Publicado** con el commit `4e5d61d3f36702b085fbcb3dfec10eebeec915bd` en `main`.
  [Despliegue Vercel](https://vercel.com/imaxmx/macs/3xRRHBkLiNvobLaXWLfWrwA2PCpn): estado del commit
  en GitHub `success`, «Deployment has completed». En producción, la portada responde 200 e incluye el
  hero nuevo, y los tres archivos de `/media/` responden 200 con su content-type correcto.

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
