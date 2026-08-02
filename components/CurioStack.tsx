'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { subscribeScroll } from './Motion';

export type Curio = { src?: string; alt: string; label: string; w: number; h: number };

/**
 * Where each print lands: a dealt pile, not a neat stack.
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

/**
 * Narrower than this and the deck stays a pinboard. On a phone the pinned stage
 * costs several screenfuls of scroll to show six prints, and cards flying in
 * from beyond the viewport edge read as the page sliding sideways under the
 * thumb. Mirrors the breakpoint `.cstack.live` is written against.
 */
const DECK = '(min-width: 761px)';

/** Head start, as a share of the stage, so the second print is already flying by the time the stage pins. */
const PRE = 0.25;
/** Share of the runway spent dealing; the tail holds the finished pile before the pin lets go. */
const DEAL = 0.9;
/** How much each print's flight overlaps the next, in segments. */
const OVERLAP = 1.35;

const clamp = (n: number, a: number, b: number) => (n < a ? a : n > b ? b : n);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Collected curiosities as a scroll-dealt deck. The first print is already lying
 * on the table when the stage arrives, so the section never reads as empty. The
 * stage then pins and the rest fly in from alternating sides, one per scroll
 * segment, before the pin releases into the next section.
 *
 * On a phone, without JS, or under reduced motion, the same markup stays a plain
 * pinboard grid (see `.cstack` in globals.css); the `live` class is what swaps in
 * the deck, and it goes back to a pinboard if the viewport narrows past `DECK`.
 */
export default function CurioStack({ items }: { items: Curio[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    /** Wires the deck up. Returns the teardown that puts the pinboard back. */
    const deal = () => {
      const cards = cardsRef.current.filter(Boolean) as HTMLElement[];
      if (!cards.length) return null;

      wrap.classList.add('live');

      const n = cards.length;
      // The first print does not fly, so the runway is divided between the rest.
      const dealers = Math.max(n - 1, 1);
      const seg = 1 / dealers;
      let dims = cards.map(() => ({ w: 0, h: 0 }));
      let vw = 0;
      let vh = 0;
      let stageH = 0;

      // Cache the boxes: reading them per frame would force a layout on every
      // scroll tick, and they only change on resize (or when an image lands).
      // clientWidth, not innerWidth: it is the layout viewport the cards are laid
      // out in, so the fly-in distance stays honest on pinch-zoomed mobile.
      const measure = (height: number) => {
        vw = document.documentElement.clientWidth;
        vh = height;
        stageH = stage.offsetHeight;
        dims = cards.map((c) => ({ w: c.offsetWidth, h: c.offsetHeight }));
      };

      const paint = (r: DOMRect, height: number) => {
        if (vw !== document.documentElement.clientWidth || vh !== height) measure(height);

        const pre = stageH * PRE;
        const span = r.height - stageH + pre;
        const p = span > 0 ? clamp((pre - r.top) / span, 0, 1) : 0;
        const dealt = clamp(p / DEAL, 0, 1);

        for (let i = 0; i < n; i++) {
          const card = cards[i];
          const { w, h } = dims[i];
          const rest = REST[i % REST.length];
          const dir = i % 2 ? 1 : -1;

          // Print one is always home; the others are dealt from index 1 onward.
          const t = i === 0 ? 1 : easeOut(clamp((dealt - (i - 1) * seg) / (seg * OVERLAP), 0, 1));
          // Prints under the top of the pile sink a little as the next ones land.
          const under = clamp(dealt * dealers - i, 0, 3);

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

      const height = window.innerHeight || document.documentElement.clientHeight;
      measure(height);
      paint(wrap.getBoundingClientRect(), height);

      // One shared engine drives this; a listener of its own would fight Lenis.
      const unsubscribe = subscribeScroll(wrap, paint);

      // Images arrive after first paint and change the card boxes under us.
      const remeasure = () => {
        measure(window.innerHeight || document.documentElement.clientHeight);
        paint(wrap.getBoundingClientRect(), vh);
      };
      const pending = Array.from(wrap.querySelectorAll('img')).filter((im) => !im.complete);
      pending.forEach((im) => im.addEventListener('load', remeasure, { once: true }));

      return () => {
        unsubscribe();
        pending.forEach((im) => im.removeEventListener('load', remeasure));
        wrap.classList.remove('live');
        cards.forEach((c) => {
          c.style.transform = '';
          c.style.opacity = '';
        });
      };
    };

    // Deal only where there is room for it, and undo it the moment there isn't:
    // rotating a phone or dragging a desktop window narrow has to land on the
    // pinboard, not on a half-dealt pile stranded mid-flight.
    const wide = window.matchMedia(DECK);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let teardown: (() => void) | null = null;

    const sync = () => {
      const wants = wide.matches && !still.matches;
      if (wants === Boolean(teardown)) return;
      if (wants) teardown = deal();
      else {
        teardown?.();
        teardown = null;
      }
    };

    sync();
    wide.addEventListener('change', sync);
    still.addEventListener('change', sync);

    return () => {
      wide.removeEventListener('change', sync);
      still.removeEventListener('change', sync);
      teardown?.();
    };
  }, [items.length]);

  return (
    <div
      className="cstack"
      ref={wrapRef}
      style={{ ['--n' as string]: Math.max(items.length - 1, 1) }}
    >
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
