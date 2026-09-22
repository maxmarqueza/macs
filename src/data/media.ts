/**
 * Videos de la portada (fuente única). Los nombres llevan versión porque
 * `/media/*` se sirve con caché inmutable (ver next.config.ts): al regenerar un
 * archivo hay que cambiar el sufijo.
 */

/** Video de las manos controlado por el scroll: [ancho máximo de pantalla que cubre, ruta]. */
export const HANDS_TIERS: readonly (readonly [number, string])[] = [
  [1296, "/media/hands-scroll-1296.v2.mp4"],
  [1920, "/media/hands-scroll-1920.v2.mp4"],
  [3072, "/media/hands-scroll-3072.v2.mp4"],
  [Infinity, "/media/hands-scroll-3744.v2.mp4"],
];

export const HANDS_FPS = 24;
export const HANDS_FRAMES = 145; // cuadro 144 = dedos en contacto

/** Fondo ambiental: un solo nivel; es un desenfoque y el de 4K no aportaba nada. */
export const BACKDROP_SRC = "/media/background-1920.mp4";

export const POSTER_SRC = "/media/hands-poster.v2.webp";

/** Píxeles reales que cubre el marco de las manos (ancho CSS × densidad, tope 3×). */
export function neededWidth(innerWidth: number, devicePixelRatio: number) {
  return Math.ceil(innerWidth * Math.min(devicePixelRatio || 1, 3));
}

export function pickHandsTier(needed: number) {
  return (HANDS_TIERS.find(([max]) => needed <= max) ?? HANDS_TIERS[HANDS_TIERS.length - 1])[1];
}

/**
 * Script inline para <head>: elige el mismo nivel que el cliente y lo precarga
 * antes de que cargue el JS (la descarga de ~10–27 MB es lo que más tarda).
 */
export const preloadScript = `(function(){try{var n=Math.ceil(innerWidth*Math.min(devicePixelRatio||1,3));var t=${JSON.stringify(
  HANDS_TIERS.map(([max, src]) => [max === Infinity ? 1e9 : max, src]),
)};var c=navigator.connection;if(c&&c.saveData)return;for(var i=0;i<t.length;i++){if(n<=t[i][0]){var l=document.createElement("link");l.rel="preload";l.as="fetch";l.crossOrigin="anonymous";l.href=t[i][1];l.setAttribute("fetchpriority","high");document.head.appendChild(l);break;}}}catch(e){}})();`;
