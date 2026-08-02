'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

export type Curio = { src?: string; alt: string; label: string; w: number; h: number };

/**
 * Where each print lands — a dealt pile, not a neat stack.
 * x/y are percentages of the card's own box, r is degrees.
 */
const REST = [
  { x: -7, y: -4, r: -4.4 },
  { x: 6, y: 3, r: 3.2 },
  { x: -4, y: 5, r: 1.6 },
  { x: 7, y: -3, r: -2.6 },
  { x: -6, y: 2, r: 4.8 },
  { x: 4, y: 4, r: -1.5 },
];

/** Head start, as a share of the stage, so the first print is already flying by the time the stage pins. */
const PRE = 0.32;
/** Share of the runway spent dealing; the tail holds the finished pile before the pin lets go. */
const DEAL = 0.9;
/** How much each print's flight overlaps the next, in segments. */
const OVERLAP = 1.35;

const clamp = (n: number, a: number, b: number) => (n < a ? a : n > b ? b : n);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Collected curiosities as a scroll-dealt deck: the stage pins, prints fly in from
 * alternating sides and drop onto the pile one per scroll segment, then the pin
 * releases into the next section.
 *
 * Without JS — or under reduced motion — the same markup stays a plain pinboard
 * grid (see `.cstack` in globals.css); the `live` class is what swaps in the deck.
 */
export default function CurioStack({ items }: { items: Curio[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLElement[];
    if (!cards.length) return;

    wrap.classList.add('live');

    const n = cards.length;
    const seg = 1 / n;
    let dims = cards.map(() => ({ w: 0, h: 0 }));
    let vw = 0;
    let stageH = 0;

    // Cache the boxes: reading them per frame would force a layout on every scroll
    // tick, and they only change on resize (or when an image finally lands).
    // clientWidth, not innerWidth — it is the layout viewport the cards are laid
    // out in, so the fly-in distance stays honest on pinch-zoomed mobile.
    const measure = () => {
      vw = document.documentElement.clientWidth;
      stageH = stage.offsetHeight;
      dims = cards.map((c) => ({ w: c.offsetWidth, h: c.offsetHeight }));
    };

    const upd = () => {
      const r = wrap.getBoundingClientRect();
      const pre = stageH * PRE;
      const span = r.height - stageH + pre;
      const p = span > 0 ? clamp((pre - r.top) / span, 0, 1) : 0;
      const dealt = clamp(p / DEAL, 0, 1);

      for (let i = 0; i < n; i++) {
        const card = cards[i];
        const { w, h } = dims[i];
        const rest = REST[i % REST.length];
        const dir = i % 2 ? 1 : -1;

        const t = easeOut(clamp((dealt - i * seg) / (seg * OVERLAP), 0, 1));
        // Prints under the top of the pile sink a little as the next ones land.
        const under = clamp(dealt * n - (i + 1), 0, 3);

        const fromX = dir * (vw / 2 + w / 2 + 40);
        const x = fromX * (1 - t) + (rest.x / 100) * w * t;
        const y = -0.42 * h * (1 - t) + ((rest.y / 100) * h + under * 5) * t;
        const rot = dir * 15 * (1 - t) + rest.r * t;
        const scale = 1.06 - 0.06 * t - under * 0.008;

        card.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${rot.toFixed(
          2
        )}deg) scale(${scale.toFixed(4)})`;
        card.style.opacity = String(Math.min(1, t * 5));
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        upd();
      });
    };
    const onResize = () => {
      measure();
      upd();
    };

    measure();
    upd();

    // Images arrive after first paint and change the card boxes under us.
    const pending = Array.from(wrap.querySelectorAll('img')).filter((im) => !im.complete);
    pending.forEach((im) => im.addEventListener('load', onResize, { once: true }));

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      pending.forEach((im) => im.removeEventListener('load', onResize));
      wrap.classList.remove('live');
      cards.forEach((c) => {
        c.style.transform = '';
        c.style.opacity = '';
      });
    };
  }, [items.length]);

  return (
    <div className="cstack" ref={wrapRef} style={{ ['--n' as string]: items.length }}>
      <div className="cstack-stage" ref={stageRef}>
        <div className="cstack-deck">
          {items.map((c, i) => (
            <figure
              className="cstack-card"
              key={c.label}
              data-portrait={c.h > c.w ? '' : undefined}
              style={{ zIndex: i + 1 }}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
            >
              {c.src ? (
                <Image
                  src={c.src}
                  alt={c.alt}
                  width={c.w}
                  height={c.h}
                  sizes="(max-width: 620px) 76vw, 34vw"
                />
              ) : (
                <div className="ph" role="img" aria-label={c.alt}>
                  <span>{c.label}</span>
                </div>
              )}
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
