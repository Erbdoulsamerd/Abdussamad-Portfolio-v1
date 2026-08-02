'use client';

import { useEffect, useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';

const EDGE = 10; // px of the bounding box kept clear on every side
const NUDGE = 12; // arrow-key step
const NUDGE_FAR = 48; // arrow-key step with shift held
const SLOP = 8; // px a touch must travel sideways before it counts as a drag

type Pos = { x: number; y: number };

/**
 * Wraps a decorative image and lets the visitor shove it around its container.
 *
 * Uses the `translate` CSS property rather than `transform` so it cannot fight
 * the `Reveal` wrapper, which animates `transform` on the same subtree.
 *
 * Touch works, without turning the image into a spot the page can't be scrolled
 * from: the element is `touch-action: pan-y`, so a vertical swipe still scrolls
 * (the browser takes the gesture and sends us a `pointercancel`) while a
 * sideways one is ours. Once a touch reads as sideways it drags on both axes.
 * Mouse drags start immediately; keyboard nudging works everywhere.
 */
export default function DragPortrait({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef<Pos>({ x: 0, y: 0 });
  const from = useRef({ px: 0, py: 0, x: 0, y: 0 });
  const down = useRef(false); // pointer is held — may not be a drag yet
  const dragging = useRef(false); // gesture claimed; moves are applied

  useEffect(() => {
    // A narrower window can leave the image parked outside its bounds.
    const onResize = () => move(pos.current.x, pos.current.y);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /**
   * Clamps to the hero box, not the viewport: `.hero` is `overflow: hidden`, so
   * anything past its edge would be silently sliced off mid-drag.
   */
  const clamp = (el: HTMLElement, x: number, y: number): Pos => {
    const box = (el.closest('.hero') ?? el.offsetParent ?? document.body) as HTMLElement;
    const b = box.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    // r already includes the applied translate; back it out for the resting box.
    const left = r.left - pos.current.x;
    const top = r.top - pos.current.y;
    const lo = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
    return {
      x: lo(x, b.left + EDGE - left, b.right - EDGE - r.width - left),
      y: lo(y, b.top + EDGE - top, b.bottom - EDGE - r.height - top),
    };
  };

  const move = (x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    pos.current = clamp(el, x, y);
    el.style.translate = `${pos.current.x}px ${pos.current.y}px`;
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.button !== 0) return;
    const direct = e.pointerType !== 'mouse';
    down.current = true;
    // A mouse press is unambiguous; a touch has to prove itself first (below).
    dragging.current = !direct;
    from.current = { px: e.clientX, py: e.clientY, x: pos.current.x, y: pos.current.y };
    el.classList.remove('is-resetting');
    if (!direct) el.classList.add('is-dragging');
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!down.current) return;

    if (!dragging.current) {
      // Still deciding. Nothing has moved yet, so if the browser reads this as a
      // scroll and cancels us, the image never twitches.
      const dx = e.clientX - from.current.px;
      const dy = e.clientY - from.current.py;
      if (Math.abs(dx) < SLOP || Math.abs(dx) <= Math.abs(dy)) return;
      dragging.current = true;
      ref.current?.classList.add('is-dragging');
      // Re-base on the finger's current spot so the image doesn't jump the slop.
      from.current.px = e.clientX;
      from.current.py = e.clientY;
      return;
    }

    move(from.current.x + (e.clientX - from.current.px), from.current.y + (e.clientY - from.current.py));
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!down.current) return;
    down.current = false;
    dragging.current = false;
    const el = ref.current;
    el?.classList.remove('is-dragging');
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('is-resetting');
    move(0, 0);
    const done = () => el.classList.remove('is-resetting');
    el.addEventListener('transitionend', done, { once: true });
    // Belt and braces: with reduced motion the transition is ~0ms and may not fire.
    window.setTimeout(done, 700);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? NUDGE_FAR : NUDGE;
    const by: Record<string, Pos> = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    };
    if (e.key === 'Escape') {
      reset();
      return;
    }
    const d = by[e.key];
    if (!d) return;
    e.preventDefault(); // otherwise the page scrolls out from under the nudge
    move(pos.current.x + d.x, pos.current.y + d.y);
  };

  return (
    <div
      ref={ref}
      className="hero-drag"
      data-cursor="Drag me"
      tabIndex={0}
      aria-label="Portrait. Drag it, or use the arrow keys to move it and Escape to put it back."
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={reset}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}
