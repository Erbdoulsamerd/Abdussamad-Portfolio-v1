'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

/** Shared instance so anchors and scroll-driven effects can talk to it. */
let instance: Lenis | null = null;
export const getLenis = () => instance;

/** Scroll to an element (or the top) through Lenis, with a native fallback. */
export function scrollToTarget(target: Element | number, offset = -86) {
  const l = getLenis();
  if (l) {
    l.scrollTo(target as never, { offset, duration: 1.1 });
    return;
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const top =
    typeof target === 'number'
      ? target
      : target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
}

/** The element the current URL hash points at, if it resolves to one. */
function hashTarget(): Element | null {
  const hash = window.location.hash;
  if (!hash || hash === '#') return null;
  try {
    return document.querySelector(hash);
  } catch {
    return null;
  }
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Honour reduced motion — no hijacking the scroll for people who asked not to.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      // gentle exponential ease-out; long tail, no rubber band
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    instance = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Expose scroll velocity so effects can react to it (marquee skew, etc.)
    const onScroll = ({ velocity }: { velocity: number }) => {
      document.documentElement.style.setProperty('--scroll-v', String(velocity.toFixed(2)));
    };
    lenis.on('scroll', onScroll);

    return () => {
      cancelAnimationFrame(raf);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      instance = null;
      document.documentElement.style.removeProperty('--scroll-v');
    };
  }, []);

  // App Router keeps the DOM alive across routes — reset Lenis to the top, unless
  // the URL asked for a section (/#work from another page) and it has rendered.
  useEffect(() => {
    const el = hashTarget();
    if (el) {
      scrollToTarget(el);
      return;
    }
    const l = getLenis();
    if (l) l.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  // Any in-page anchor glides instead of jumping. Covers bare `#id` and the
  // full `/#id` form, so long as it lands on the page we are already on — a hash
  // on some other route is the router's business, handled by the effect above.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank') return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname) return;
      if (!url.hash || url.hash === '#') return;
      let el: Element | null = null;
      try {
        el = document.querySelector(url.hash);
      } catch {
        return;
      }
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el);
      history.replaceState(null, '', url.hash);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
