import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { acquireScroll, releaseScroll } from "./scroll";

/**
 * Catálogo de movimiento de Halion (new-13-v2), módulo a módulo en el mismo orden
 * de arranque del original: gsap → scroll → split → clock → header → hero-video →
 * stage → parallax/cursor → statement → title → callouts → hero (intro).
 *
 * Es la primera sección de la portada de MACS y abre la página, como el original:
 * la intro (H1) arranca al cargar (su disparador «top 15%» ya está cumplido). La
 * cabecera fija solo existe mientras la sección ocupa la línea superior; después
 * sigue el hero de las manos con su propia barra. Beats, curvas, duraciones y
 * disparadores son los del original.
 */

let registered = false;
function setupGsap() {
  if (registered) return;
  registered = true;
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase);
  CustomEase.create("magic", "0.33, 0, 0, 1");
  CustomEase.create("quart", "0.41, 0.35, 0.2, 1");
  CustomEase.create("outExpo", "0.19, 1, 0.22, 1");
  CustomEase.create("base", "0.46, 0.03, 0.12, 1");
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ── H6 · clips scrubeados con búsquedas coalescidas ─────────────────── */

type Scrubber = {
  video: HTMLVideoElement | null;
  ready: Promise<void>;
  duration(): number;
  scrub(p01: number): void;
  destroy(): void;
};

const DEAD_ZONE = 0.03; // ~¾ de cuadro a 24 fps

function initHeroVideo(video: HTMLVideoElement | null, live: boolean): Scrubber {
  if (!video || !live) {
    return { video, ready: Promise.resolve(), duration: () => 0, scrub() {}, destroy() {} };
  }
  let inFlight = false;
  let pending: number | null = null;
  let watchdog = 0;
  const apply = (t: number) => {
    inFlight = true;
    clearTimeout(watchdog);
    watchdog = window.setTimeout(() => {
      inFlight = false;
    }, 500);
    video.currentTime = t;
  };
  const request = (t: number) => {
    if (inFlight) {
      pending = t;
      return;
    }
    if (Math.abs(t - video.currentTime) < DEAD_ZONE) return;
    apply(t);
  };
  const onSeeked = () => {
    inFlight = false;
    clearTimeout(watchdog);
    if (pending !== null) {
      const t = pending;
      pending = null;
      if (Math.abs(t - video.currentTime) >= DEAD_ZONE) apply(t);
    }
  };

  let done = false;
  let resolveReady: () => void = () => {};
  const ready = new Promise<void>((resolve) => {
    resolveReady = () => {
      if (done) return;
      done = true;
      resolve();
    };
  });
  const onMeta = () => {
    video.pause();
    apply(0.001); // fija el póster: primer cuadro
  };
  const onFirstFrame = () => resolveReady();
  const onCanPlay = () => {
    video.removeEventListener("canplay", onCanPlay);
    // calienta el decodificador: un salto corto y de vuelta al primer cuadro
    const warm = Math.min(0.12, (video.duration || 0) * 0.03);
    if (warm > DEAD_ZONE) {
      request(warm);
      request(0.001);
    }
  };
  video.addEventListener("seeked", onSeeked);
  video.addEventListener("loadedmetadata", onMeta);
  video.addEventListener("loadeddata", onFirstFrame);
  video.addEventListener("error", onFirstFrame);
  video.addEventListener("canplay", onCanPlay);
  const timer = window.setTimeout(resolveReady, 4000); // un clip ausente no bloquea la intro
  if (video.readyState >= 1) onMeta();
  if (video.readyState >= 2) onFirstFrame();

  return {
    video,
    ready,
    duration: () => video.duration || 0,
    scrub(p01) {
      if (!video.paused) video.pause();
      const d = video.duration;
      if (!d) return;
      request(clamp(p01 * d, 0, d - 0.001));
    },
    destroy() {
      clearTimeout(timer);
      clearTimeout(watchdog);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("loadeddata", onFirstFrame);
      video.removeEventListener("error", onFirstFrame);
      video.removeEventListener("canplay", onCanPlay);
    },
  };
}

/* ── H5 · reloj de Zúrich ────────────────────────────────────────────── */

function initClock(root: HTMLElement) {
  const timeEl = root.querySelector<HTMLElement>("[data-clock-time]");
  const zoneEl = root.querySelector<HTMLElement>("[data-clock-zone]");
  if (!timeEl || !zoneEl) return () => {};
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Europe/Zurich",
  });
  let offset: Intl.DateTimeFormat | null = null;
  try {
    offset = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Zurich", timeZoneName: "longOffset" });
  } catch {
    offset = null;
  }
  let last = "";
  const tick = () => {
    const now = new Date();
    const text = time.format(now);
    if (text === last) return;
    last = text;
    timeEl.textContent = text;
    const name = offset?.formatToParts(now).find((p) => p.type === "timeZoneName")?.value ?? "GMT";
    // "GMT+02:00" → "UTC+2", "GMT+05:30" → "UTC+5:30", "GMT" → "UTC"
    const m = /^GMT([+-])(\d{2}):(\d{2})$/.exec(name);
    zoneEl.textContent = m ? `UTC${m[1]}${parseInt(m[2], 10)}${m[3] !== "00" ? `:${m[3]}` : ""}` : "UTC";
  };
  tick();
  const id = window.setInterval(tick, 1000);
  return () => window.clearInterval(id);
}

/* ── arranque ────────────────────────────────────────────────────────── */

export function bootHalion(root: HTMLElement): () => void {
  setupGsap();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const live = !reduced;
  const html = document.documentElement;
  const q = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel);
  const qa = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));

  const header = q("[data-header]");
  const hero = q("[data-hero]");
  const stage = q("[data-stage]");
  const about = q("#about");
  const product = q("#product");
  if (!header || !hero || !stage || !about || !product) return () => {};

  acquireScroll();
  const disposers: Array<() => void> = [];
  const splits: SplitText[] = [];
  let disposed = false;
  let inView = false; // la escena está en pantalla: solo entonces corren ticker y parallax

  const ctx = gsap.context(() => {
    /* ── clock ── */
    disposers.push(initClock(root));

    /* ── clips ── */
    const heroVideo = initHeroVideo(q<HTMLVideoElement>("[data-hero-video]"), live);
    const productVideo = initHeroVideo(q<HTMLVideoElement>("[data-video-2]"), live);
    disposers.push(heroVideo.destroy, productVideo.destroy);

    /* ── H7′ · cursor compartido + parallax de escena ── */
    const cursor = { nx: 0, ny: 0, x: 0, y: 0, seen: false };
    const scenePar = q("[data-scene-par]");
    const shift = { x: 0, y: 0 };
    const move = (cx: number, cy: number) => {
      const hw = window.innerWidth / 2;
      const hh = window.innerHeight / 2;
      cursor.nx = clamp((cx - hw) / hw, -1, 1);
      cursor.ny = clamp((cy - hh) / hh, -1, 1);
      cursor.seen = true;
    };
    const onMouse = (e: MouseEvent) => move(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) move(t.clientX, t.clientY);
    };
    const release = () => {
      cursor.nx = 0;
      cursor.ny = 0;
    };
    if (live) {
      window.addEventListener("mousemove", onMouse, { passive: true });
      window.addEventListener("touchmove", onTouch, { passive: true });
      document.addEventListener("mouseleave", release);
      window.addEventListener("touchend", release, { passive: true });
      disposers.push(() => {
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("touchmove", onTouch);
        document.removeEventListener("mouseleave", release);
        window.removeEventListener("touchend", release);
      });
    }
    const getShift = () => shift;

    /* ── H9 · callouts en gravedad ── */
    const AMP = 140;
    const TAIL = 1.2;
    const TAIL_LERP = 0.06;
    type Attach = "top" | "bottom";
    const SPEC: Record<string, { a0: [number, number]; a1: [number, number]; rest: [number, number]; depth: number; attach: Attach }> = {
      traces: { a0: [0.24, 0.3], a1: [0.24, 0.268], rest: [-40, -150], depth: 0.55, attach: "bottom" },
      glass: { a0: [0.234, 0.556], a1: [0.221, 0.556], rest: [-90, 80], depth: 0.8, attach: "top" },
      ring: { a0: [0.78, 0.395], a1: [0.78, 0.385], rest: [90, -110], depth: 1, attach: "bottom" },
    };
    const calloutsEl = q("[data-callouts]");
    const items = Object.keys(SPEC)
      .map((key) => {
        const box = q(`[data-callout="${key}"]`);
        const g = q<SVGGElement>(`[data-line="${key}"]`);
        if (!box || !g) return null;
        const line = g.querySelector("line");
        const dot = g.querySelector<SVGCircleElement>(".callouts__dot");
        const tip = g.querySelector<SVGCircleElement>(".callouts__tip");
        if (!line || !dot || !tip) return null;
        line.setAttribute("pathLength", "1");
        const inner = box.querySelector<HTMLElement>(".callout__box");
        return {
          ...SPEC[key],
          key,
          box,
          inner,
          line,
          dot,
          tip,
          x: 0,
          y: 0,
          toX: gsap.quickTo(box, "x", { duration: 0.7 + 0.5 * SPEC[key].depth, ease: "power3.out" }),
          toY: gsap.quickTo(box, "y", { duration: 0.7 + 0.5 * SPEC[key].depth, ease: "power3.out" }),
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);
    let productP = 0;
    let productActive = false;
    let tailT = 1;
    const coverRect = () => {
      const vw = calloutsEl?.clientWidth || window.innerWidth;
      const vh = calloutsEl?.clientHeight || window.innerHeight;
      const s = Math.max(vw / 1920, vh / 1080);
      const w = 1920 * s;
      const h = 1080 * s;
      return { x: (vw - w) / 2, y: (vh - h) / 2, w, h };
    };
    const layoutCallouts = (settle: boolean) => {
      const rect = coverRect();
      const sh = getShift();
      for (const it of items) {
        const ax = rect.x + lerp(it.a0[0], it.a1[0], tailT) * rect.w + sh.x;
        const ay = rect.y + lerp(it.a0[1], it.a1[1], tailT) * rect.h + sh.y;
        const tx = ax + it.rest[0] - cursor.x * AMP * it.depth;
        const ty = ay + it.rest[1] - cursor.y * AMP * it.depth;
        if (settle) {
          gsap.set(it.box, { x: tx, y: ty });
        } else {
          it.toX(tx);
          it.toY(ty);
        }
        const bx = Number(gsap.getProperty(it.box, "x")) || 0;
        const by = Number(gsap.getProperty(it.box, "y")) || 0;
        const bw = it.box.offsetWidth;
        const bh = it.box.offsetHeight;
        const ex = bx + bw / 2;
        const ey = it.attach === "top" ? by : by + bh;
        it.line.setAttribute("x1", ax.toFixed(2));
        it.line.setAttribute("y1", ay.toFixed(2));
        it.line.setAttribute("x2", ex.toFixed(2));
        it.line.setAttribute("y2", ey.toFixed(2));
        it.dot.setAttribute("cx", ax.toFixed(2));
        it.dot.setAttribute("cy", ay.toFixed(2));
        it.tip.setAttribute("cx", ex.toFixed(2));
        it.tip.setAttribute("cy", ey.toFixed(2));
      }
    };
    const callouts = {
      setScroll(p: number) {
        productP = p;
      },
    };
    if (items.length) {
      // entrada al 85 % de la ventana de Product, reversible al subir
      const entrance = gsap.timeline({ paused: true });
      items.forEach((it, i) => {
        if (it.inner) entrance.fromTo(it.inner, { y: "1em", autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "magic" }, i * 0.12);
        entrance.fromTo(it.line, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: "magic" }, i * 0.12);
        entrance.fromTo([it.dot, it.tip], { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.4, ease: "magic" }, i * 0.12 + 0.1);
      });
      if (live) {
        ScrollTrigger.create({
          trigger: product,
          start: () => `bottom ${window.innerHeight + 0.15 * product.offsetHeight}px`,
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
          animation: entrance,
        });
      } else {
        entrance.progress(1);
        layoutCallouts(true);
      }
    }

    /* ── stage: clip 1 hero + About, clip 2 Product ── */
    if (live) {
      ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        endTrigger: about,
        end: "top top",
        scrub: true,
        onUpdate: (st) => heroVideo.scrub(st.progress),
      });
    }
    /* ── ticker: cursor suavizado, parallax de escena, callouts y cola del clip 2 ── */
    const scrubProduct = () => {
      const D = productVideo.duration();
      if (D <= 0) return;
      const w = smoothstep(0.85, 1, productP);
      const t = productP * (D - TAIL) + w * tailT * TAIL;
      productVideo.scrub(t / D);
    };
    const tick = () => {
      if (!inView) return;
      cursor.x += (cursor.nx - cursor.x) * 0.07;
      cursor.y += (cursor.ny - cursor.y) * 0.07;
      if (scenePar) {
        shift.x = -cursor.x * 26;
        shift.y = -cursor.y * 18;
        scenePar.style.transform = `translate3d(${shift.x.toFixed(2)}px, ${shift.y.toFixed(2)}px, 0) scale(1.05)`;
      }
      if (!items.length) return;
      const tailTarget = cursor.seen ? (cursor.nx + 1) / 2 : 1;
      tailT += (tailTarget - tailT) * TAIL_LERP;
      if (productActive) scrubProduct();
      layoutCallouts(false);
    };
    if (live) {
      gsap.ticker.add(tick);
      disposers.push(() => gsap.ticker.remove(tick));
    }

    ScrollTrigger.create({
      trigger: product,
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (st) => callouts.setScroll(st.progress),
      onEnter: () => stage.classList.add("is-second"),
      onEnterBack: () => stage.classList.add("is-second"),
      onLeaveBack: () => stage.classList.remove("is-second"),
      onToggle: (st) => {
        productActive = st.isActive;
        // al salir por el final, el último cuadro que queda fijo es el del cierre real de la ventana
        if (!st.isActive && st.progress >= 1) {
          productP = 1;
          scrubProduct();
        }
      },
    });


    /* ── cabecera: visible solo dentro de la escena; pliegue (H4) ── */
    const bar = q("[data-header-bar]");
    const cta = q("[data-header-cta]");
    const burger = q("[data-header-burger]");
    const nav = q("[data-header-nav]");
    const clock = q("[data-clock]");
    const ctaLabel = q("[data-header-cta-label]");
    const logo = q("[data-header-logo]");
    const headerItems = qa("[data-header-item]");
    let headerTween: gsap.core.Tween | null = null;
    let introStarted = false;
    let introDone = false;
    const show = () => {
      header.style.visibility = "visible";
      hero.style.visibility = "visible";
    };
    const setCompact = (on: boolean) => {
      if (header.classList.contains("is-compact") === on) return;
      if (!live) {
        header.classList.toggle("is-compact", on);
        return;
      }
      if (headerTween) {
        // una cabecera plegándose y una entrada en curso nunca escriben los mismos transforms
        headerTween.kill();
        headerTween = null;
        gsap.set(headerItems, { clearProps: "all" });
        for (const el of headerItems) el.style.transition = "";
        show();
      }
      const moving = [bar, cta, burger, nav, clock, ctaLabel].filter((el): el is HTMLElement => !!el);
      const state = Flip.getState(moving);
      const fromPx = logo ? parseFloat(getComputedStyle(logo).fontSize) : 0;
      header.classList.toggle("is-compact", on);
      const toPx = logo ? parseFloat(getComputedStyle(logo).fontSize) : 0;
      Flip.from(state, {
        duration: 0.6,
        ease: "magic",
        nested: true,
        absoluteOnLeave: true,
        clearProps: true,
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, y: "-.5em", duration: 0.25, ease: "magic" }),
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: ".5em" }, { autoAlpha: 1, y: 0, duration: 0.4, delay: 0.2, ease: "magic", clearProps: "all" }),
      });
      for (const el of [cta, burger]) {
        if (el) el.style.transition = "transform 0s, background-color var(--dur-mid) var(--ease-magic), color var(--dur-mid) var(--ease-magic)";
      }
      if (logo && fromPx && toPx) {
        gsap.fromTo(logo, { scale: fromPx / toPx, transformOrigin: "0% 50%" }, { scale: 1, duration: 0.6, ease: "magic", clearProps: "transform" });
      }
    };
    ScrollTrigger.create({
      trigger: hero,
      start: "top -4%",
      onEnter: () => setCompact(true),
      onLeaveBack: () => setCompact(false),
    });
    // la cabecera de Halion solo existe mientras su sección ocupa la línea superior
    // (72 px: el mismo punto en que se retira y vuelve la barra de MACS)
    ScrollTrigger.create({
      trigger: hero,
      start: "top 72px",
      endTrigger: root,
      end: "bottom 72px", // mismo punto en que vuelve la barra de MACS
      onToggle: (st) => header.classList.toggle("is-away", !st.isActive),
    });
    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onToggle: (st) => {
        inView = st.isActive;
      },
    });

    /* ── hero: SplitText del título (palabras, sin autoSplit) y del lead (líneas) ── */
    const title = q("[data-hero-title]");
    const lead = q("[data-hero-lead]");
    const hint = q(".hero__hint");
    const heroCta = q(".hero__cta");
    const social = q(".hero__social");
    let titleWords: Element[] = [];
    let leadLines: Element[] = [];
    let introRunning = false;
    let leadIntro: gsap.core.Tween | null = null;
    const buildRollOut = () => {
      // H2 + H3: el título sale hacia arriba por su máscara y el resto del chrome se apaga
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: hero, start: "top top", end: "+=50%", scrub: true },
      });
      if (titleWords.length) tl.to(titleWords, { yPercent: -130, duration: 0.5, stagger: { each: 0.06, from: "start" } }, 0);
      if (hint) tl.to(hint, { autoAlpha: 0, y: "-1em", duration: 0.3 }, 0);
      if (lead) tl.to(lead, { autoAlpha: 0, y: "-1em", duration: 0.4 }, 0.05);
      const chrome = [heroCta, social].filter((el): el is HTMLElement => !!el);
      if (chrome.length) tl.to(chrome, { autoAlpha: 0, y: "-1em", duration: 0.4, stagger: 0.08 }, 0.1);
      const state = { progress: 0 };
      tl.to(state, { progress: 1, duration: 1, onUpdate: () => html.style.setProperty("--hero-p", state.progress.toFixed(3)) }, 0);
    };
    const finishIntro = () => {
      if (introDone) return;
      introDone = true;
      introRunning = false;
      const chrome = [hint, heroCta, social].filter((el): el is HTMLElement => !!el);
      gsap.set([...titleWords, ...leadLines, ...chrome], { clearProps: "all" });
      for (const el of [...titleWords, ...leadLines, ...chrome] as HTMLElement[]) el.style.transition = "";
      if (live) buildRollOut();
    };
    if (live && title) {
      const split = new SplitText(title, { type: "words", mask: "words", wordsClass: "word", autoSplit: false });
      splits.push(split);
      titleWords = split.words;
    }
    if (live && lead) {
      const split = new SplitText(lead, {
        type: "lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        onSplit: (self) => {
          leadLines = self.lines;
          if (introRunning) {
            leadIntro = gsap.fromTo(self.lines, { y: "1em", autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.4, ease: "magic", stagger: 0.05 });
            return leadIntro;
          }
          return undefined;
        },
      });
      splits.push(split);
      leadLines = split.lines;
    }

    /* ── H1 · intro ── */
    const startIntro = () => {
      if (introStarted) return;
      introStarted = true;
      if (!live) {
        show();
        finishIntro();
        return;
      }
      introRunning = true;
      const chrome = [hint, heroCta, social].filter((el): el is HTMLElement => !!el);
      for (const el of [...headerItems, ...chrome, ...titleWords, ...leadLines] as HTMLElement[]) el.style.transition = "none";
      // la cabecera lleva su propio tween: el pliegue puede matarlo sin tocar al hero
      if (!header.classList.contains("is-compact") && headerItems.length) {
        headerTween = gsap.fromTo(
          headerItems,
          { y: "1em", autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: "magic",
            stagger: 0.08,
            clearProps: "all",
            onComplete: () => {
              headerTween = null;
              for (const el of headerItems) el.style.transition = "";
            },
          },
        );
      }
      const tl = gsap.timeline({ onComplete: finishIntro });
      if (titleWords.length) tl.fromTo(titleWords, { yPercent: 130 }, { yPercent: 0, duration: 1.6, ease: "outExpo", stagger: 0.075 }, 0.15);
      if (leadLines.length) {
        leadIntro = gsap.fromTo(leadLines, { y: "1em", autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.4, ease: "magic", stagger: 0.05, paused: true });
        tl.add(leadIntro.play(), 0.5);
      }
      if (chrome.length) tl.fromTo(chrome, { y: "1em", autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "magic", stagger: 0.1 }, 0.8);
      requestAnimationFrame(show); // tras pintar el primer cuadro de los fromTo
    };
    let armed = false;
    const arm = () => {
      if (armed) return;
      armed = true;
      if (!live) {
        startIntro();
        return;
      }
      Promise.all([document.fonts.ready, heroVideo.ready]).then(() => requestAnimationFrame(startIntro));
      // failsafe 4 s: si no arrancó y la pestaña está visible, estado de reposo; oculta, se rearma
      const failsafe = () => {
        if (introStarted) return;
        if (document.hidden) {
          const onVisible = () => {
            document.removeEventListener("visibilitychange", onVisible);
            window.setTimeout(failsafe, 4000);
          };
          document.addEventListener("visibilitychange", onVisible);
          return;
        }
        introStarted = true;
        show();
        finishIntro();
      };
      window.setTimeout(failsafe, 4000);
    };
    if (live) {
      ScrollTrigger.create({ trigger: hero, start: "top 15%", once: true, onEnter: arm });
    } else {
      arm();
    }
    // si el pliegue llega antes que la intro (scroll rápido), la intro arranca ya y la cabecera queda en reposo
    const guard = ScrollTrigger.create({
      trigger: hero,
      start: "top -4%",
      onEnter: () => {
        startIntro();
        guard.kill();
      },
    });

    /* ── split de [data-split] + statement (H7) + título de producto (H8), tras las fuentes ── */
    document.fonts.ready.then(() => {
      if (disposed) return;
      requestAnimationFrame(() => {
        if (disposed) return;
        for (const el of qa("[data-split]")) {
          splits.push(new SplitText(el, { type: "lines", mask: "lines", linesClass: "line", propIndex: true, autoSplit: true }));
        }
        const statement = q("[data-statement]");
        const pin = q("[data-statement-pin]");
        if (live && statement && pin) {
          splits.push(
            new SplitText(statement, {
              type: "lines",
              mask: "lines",
              linesClass: "line",
              autoSplit: true,
              onSplit: (self) =>
                gsap.fromTo(
                  self.lines,
                  { yPercent: 130 },
                  {
                    yPercent: 0,
                    duration: 1.6,
                    ease: "outExpo",
                    stagger: 0.075,
                    scrollTrigger: { trigger: pin, start: "top 8%", toggleActions: "play none none reverse" },
                  },
                ),
            }),
          );
        }
        const productTitle = q("[data-title]");
        if (live && productTitle) {
          const split = new SplitText(productTitle, { type: "words", mask: "words", wordsClass: "word", autoSplit: false });
          splits.push(split);
          const words = split.words;
          const master = gsap.timeline({ paused: true });
          master.fromTo(words, { yPercent: 130 }, { yPercent: 0, duration: 1.6, ease: "outExpo", stagger: 0.075 }, 0);
          master.addLabel("in");
          master.to(words, { yPercent: -130, duration: 0.5, ease: "none", stagger: { each: 0.06, from: "start" } }, "in");
          const inTime = master.labels.in;
          const outDur = master.duration() - inTime;
          ScrollTrigger.create({
            trigger: productTitle,
            start: "top 85%",
            onEnter: () => {
              gsap.killTweensOf(master);
              master.tweenTo("in");
            },
            onLeaveBack: () => {
              gsap.killTweensOf(master);
              master.tweenTo(0, { ease: "none" });
            },
          });
          ScrollTrigger.create({
            trigger: product,
            start: "top top",
            end: "+=50%",
            scrub: true,
            onUpdate: (st) => {
              const p = st.progress;
              if (p <= 0 && master.time() <= inTime) return; // la zona de entrada manda
              gsap.killTweensOf(master);
              master.time(inTime + p * outDur, true);
            },
          });
        }
        ScrollTrigger.refresh();
      });
    });
  }, root);

  requestAnimationFrame(() => {
    if (!disposed) ScrollTrigger.refresh();
  });

  return () => {
    disposed = true;
    for (const d of disposers) d();
    ctx.revert();
    for (const s of splits) {
      try {
        s.revert();
      } catch {
        /* ya revertido */
      }
    }
    html.style.removeProperty("--hero-p");
    releaseScroll();
  };
}
