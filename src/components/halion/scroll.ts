import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";
import type Lenis from "lenis";

/**
 * Dueño del scroll suave de la portada (lib/scroll.js de Halion): Locomotive
 * Scroll 5 con Lenis dentro, movido por el ticker de GSAP. Es un singleton con
 * cuenta de referencias porque lo usan tanto la escena Halion como el hero de
 * MACS (que pasa a mapeo directo cuando Lenis ya suaviza el desplazamiento).
 */

export type ScrollOwner = {
  scroll: LocomotiveScroll;
  lenis: Lenis;
  /** true cuando Lenis suaviza la rueda (en táctil el desplazamiento es nativo). */
  smooth: boolean;
};

let owner: ScrollOwner | null = null;
let refs = 0;
let teardown: (() => void) | null = null;

const targetOf = (href: string) => {
  if (href.startsWith("#")) return href;
  if (href.startsWith("/#") && location.pathname === "/") return href.slice(1);
  return null;
};

export function acquireScroll(): ScrollOwner {
  refs += 1;
  if (owner) return owner;

  gsap.registerPlugin(ScrollTrigger);
  const previousRestoration = history.scrollRestoration;
  history.scrollRestoration = "manual";
  const hash = location.hash;
  window.scrollTo(0, 0);

  const scroll = new LocomotiveScroll({
    lenisOptions: {},
    initCustomTicker: (render) => gsap.ticker.add(render),
    destroyCustomTicker: (render) => gsap.ticker.remove(render),
  });
  const lenis = scroll.lenisInstance as Lenis;
  lenis.on("scroll", () => ScrollTrigger.update());
  gsap.ticker.lagSmoothing(0);
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  owner = { scroll, lenis, smooth: !isTouch && lenis.options.smoothWheel !== false };

  // Anclas internas: preventDefault + lenis.scrollTo(hash, { duration: 2 }).
  // «#» a secas (Submit, redes) y hashes sin destino (FAQ) no navegan.
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element | null)?.closest?.("a[href]");
    if (!anchor) return;
    const href = anchor.getAttribute("href") ?? "";
    const hash = targetOf(href);
    if (hash === null) return;
    event.preventDefault();
    if (hash.length < 2) return;
    let target: Element | null = null;
    try {
      target = document.querySelector(hash);
    } catch {
      target = null;
    }
    if (!target) return;
    lenis.scrollTo(target as HTMLElement, { duration: 2 });
  };
  document.addEventListener("click", onClick, true);

  // Enlace profundo (/#agentes desde otra página): se respeta tras el primer cuadro.
  if (hash.length > 1) {
    requestAnimationFrame(() => {
      let target: Element | null = null;
      try {
        target = document.querySelector(hash);
      } catch {
        target = null;
      }
      if (target && owner) lenis.scrollTo(target as HTMLElement, { immediate: true, force: true });
    });
  }

  teardown = () => {
    document.removeEventListener("click", onClick, true);
    scroll.destroy();
    history.scrollRestoration = previousRestoration;
  };
  return owner;
}

export function releaseScroll() {
  refs = Math.max(0, refs - 1);
  if (refs > 0 || !owner) return;
  teardown?.();
  teardown = null;
  owner = null;
}
