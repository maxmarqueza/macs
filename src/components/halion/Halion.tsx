"use client";

import { Inter_Tight } from "next/font/google";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import "./halion.css";

/**
 * Halion (new-13-v2, build CDN), recreado tal cual como escena posterior a la
 * explosión de partículas: mismo DOM, mismos textos, mismos cuatro medios de
 * CloudFront, misma hoja de estilos (halion.css) y mismo catálogo de movimiento
 * (halion-motion.ts). Es un clon literal, no una adaptación a MACS.
 */

export const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-halion",
  display: "swap",
});

const CLIP_1 = "https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/fb4c80b0-ed9d-4719-be32-99a9e18356c5.mp4";
const POSTER_1 = "https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/6dbdcd75-2556-435f-8180-60ced6f60321.jpg";
const CLIP_2 = "https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/ed15df08-46fa-46f8-8aed-70bd06ebc547.mp4";
const POSTER_2 = "https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/6acf44e4-ef4d-4565-a50c-3caa7c19399a.jpg";

const lineOffset = (n: number) => ({ "--line-offset": n }) as CSSProperties;

const CALLOUTS = [
  { key: "traces", value: <>0.3 <span className="no-upper">ms</span></>, label: "Brain link latency" },
  { key: "glass", value: "9H", label: "Space-grade glass" },
  { key: "ring", value: "12 TB", label: "Neural nets on board" },
] as const;

export default function Halion() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let dispose: (() => void) | null = null;
    let cancelled = false;
    import("./halion-motion").then(({ bootHalion }) => {
      if (cancelled) return;
      dispose = bootHalion(root);
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <div ref={rootRef} className={`halion ${interTight.variable}`} lang="en" data-halion>
      <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
        precedence="default"
      />

      <header className="header is-away" data-header>
        <div className="header__bar" data-header-bar>
          <div className="header__left">
            <span className="header__logo t-sublead" data-header-logo data-header-item>
              HALION<span className="header__mark">®</span>
            </span>
            <nav className="header__nav t-ui upper" data-header-nav aria-label="Halion">
              <a className="link-dim" href="#about" data-header-item>
                About
              </a>
              <a className="link-dim" href="#product" data-header-item>
                Product
              </a>
              <a className="link-dim" href="#faq" data-header-item>
                FAQ
              </a>
            </nav>
          </div>
          <div className="header__right">
            <div className="header__clock t-ui upper" data-clock data-header-item>
              <time data-clock-time>03:48 PM</time> Zurich <span className="header__sep">|</span>{" "}
              <span data-clock-zone>UTC+1</span>
            </div>
            <a className="btn btn--glass header__cta upper" href="#" data-header-cta data-header-item>
              <span className="btn__label" data-header-cta-label>
                Submit
              </span>
              <i className="bi bi-plus" aria-hidden="true" />
            </a>
            <button
              className="btn btn--glass btn--icon header__burger"
              type="button"
              aria-label="Menu"
              aria-expanded="false"
              data-header-burger
              data-header-item
            >
              <i className="bi bi-list" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div className="stage" data-stage>
        <div className="stage__scene">
          <div className="stage__par" data-scene-par>
            <video
              className="stage__media"
              data-hero-video
              src={CLIP_1}
              poster={POSTER_1}
              muted
              playsInline
              preload="auto"
              crossOrigin="anonymous"
              disablePictureInPicture
              disableRemotePlayback
            />
            <video
              className="stage__media stage__media--2"
              data-video-2
              src={CLIP_2}
              poster={POSTER_2}
              muted
              playsInline
              preload="auto"
              crossOrigin="anonymous"
              disablePictureInPicture
              disableRemotePlayback
            />
          </div>
          <div className="stage__scrim" />
        </div>

        <section className="hero" data-hero aria-label="Halion">
          <div className="hero__chrome">
            <div className="hero__grid">
              <h1 className="hero__title t-display-tight text-trim upper" data-hero-title>
                Augmented
                <br />
                human
                <br />
                mind
              </h1>
              <p className="hero__lead t-lead text-trim upper" data-hero-lead>
                A quantum AI chip you wear on your forehead. 128 qubits, engineered in Zurich.
              </p>
              <p className="hero__hint t-ui upper" data-hero-item>
                [ Scroll to explore ]
              </p>
              <a className="btn btn--solid hero__cta upper" href="#" data-hero-item>
                <span className="btn__label">Submit</span>
                <i className="bi bi-plus" aria-hidden="true" />
              </a>
              <ul className="hero__social t-ui upper" data-hero-item>
                <li>
                  <a className="link-dim" href="#" aria-label="Instagram">
                    Inst
                  </a>
                </li>
                <li>
                  <a className="link-dim" href="#" aria-label="Telegram">
                    TG
                  </a>
                </li>
                <li>
                  <a className="link-dim" href="#" aria-label="X">
                    X
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about" id="about" data-about>
          <div className="pin" data-statement-pin>
            <h2 className="about__statement t-statement-lg" data-statement>
              It weighs every option at once, keeps the best one and hands it to you before you finish the
              question.
            </h2>
          </div>
          <div className="about__top px-global grid-12">
            <div className="about__intro">
              <p className="t-lead upper reveal-lines" data-split="lines" data-scroll data-scroll-offset="20%">
                Quantum AI, worn on the forehead.
              </p>
              <p
                className="t-lead upper is-dim reveal-lines"
                data-split="lines"
                data-scroll
                data-scroll-offset="20%"
                style={lineOffset(1)}
              >
                Put it on. Be the smartest person in the room.
              </p>
            </div>
            <p
              className="about__stats t-ui upper reveal-lines"
              data-split="lines"
              data-scroll
              data-scroll-offset="20%"
              style={lineOffset(2)}
            >
              128 qubits<span className="about__dot">·</span>99.9% fidelity<span className="about__dot">·</span>250{" "}
              <span className="no-upper">µs</span>
            </p>
          </div>
          <div className="px-global">
            <div className="divider reveal-divider" data-scroll data-scroll-offset="20%" />
          </div>
          <div className="about__frame px-global">
            <div className="about__vline divider--v reveal-divider--v" data-scroll data-scroll-offset="10%" />
          </div>
          <div className="px-global">
            <div className="divider reveal-divider" data-scroll data-scroll-offset="5%" />
          </div>
        </section>
        <div className="foot px-global">
          <span className="chip t-caption inview-fade" data-scroll data-scroll-offset="5%">
            02
          </span>
        </div>

        <section className="product" id="product" data-product>
          <div className="callouts" data-callouts aria-hidden="true">
            <svg className="callouts__lines" data-callout-lines>
              {CALLOUTS.map((c) => (
                <g key={c.key} data-line={c.key}>
                  <line />
                  <circle className="callouts__dot" r="3" />
                  <circle className="callouts__tip" r="2" />
                </g>
              ))}
            </svg>
            {CALLOUTS.map((c) => (
              <div key={c.key} className="callout" data-callout={c.key}>
                <div className="callout__box">
                  <div className="callout__value">{c.value}</div>
                  <div className="callout__label t-caption upper">{c.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="product__screen px-global grid-12">
            <h2 className="product__title t-display-tight text-trim upper" data-title>
              Three parts.
              <br />
              One mind.
            </h2>
          </div>
          <div className="foot foot--abs px-global">
            <span className="chip t-caption inview-fade" data-scroll data-scroll-offset="5%">
              03
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
