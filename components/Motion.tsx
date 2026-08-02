'use client';

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from 'react';
import { getLenis } from './SmoothScroll';

/**
 * One scroll engine for every effect on the site.
 *
 * It ticks off Lenis's own scroll emission, so reveals and parallax land on the
 * same frame as the smoothed scroll position instead of chasing it. Native
 * scroll/resize stay wired as a fallback for when Lenis is absent — it is never
 * constructed under `prefers-reduced-motion`.
 */
type Sub = { el: Element; tick: (rect: DOMRect, vh: number) => boolean | void };

const subs = new Set<Sub>();
let frame = 0;
let bound = false;
let detachLenis: (() => void) | null = null;

function flush() {
  frame = 0;
  const vh = window.innerHeight || document.documentElement.clientHeight;
  for (const s of Array.from(subs)) {
    if (s.tick(s.el.getBoundingClientRect(), vh) === true) subs.delete(s);
  }
  if (!subs.size) unbind();
}

/** Coalesce every source down to one measure per frame. */
const schedule = () => {
  if (!frame) frame = requestAnimationFrame(flush);
};

function bindLenis(attempts = 0) {
  const lenis = getLenis();
  if (lenis) {
    lenis.on('scroll', schedule);
    detachLenis = () => lenis.off('scroll', schedule);
    return;
  }
  // SmoothScroll builds Lenis in its own effect, which may land after ours.
  if (bound && attempts < 90) requestAnimationFrame(() => bindLenis(attempts + 1));
}

function bind() {
  if (bound) return;
  bound = true;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  bindLenis();
  schedule();
}

function unbind() {
  if (!bound) return;
  bound = false;
  window.removeEventListener('scroll', schedule);
  window.removeEventListener('resize', schedule);
  detachLenis?.();
  detachLenis = null;
}

function subscribe(sub: Sub) {
  subs.add(sub);
  bind();
  return () => {
    subs.delete(sub);
  };
}

/** Add `.in` as the element crosses into view, then stop watching it. */
function observe(el: Element) {
  if (typeof window === 'undefined') {
    el.classList.add('in');
    return () => {};
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.classList.add('in');
    return () => {};
  }
  return subscribe({
    el,
    tick: (r, vh) => {
      // 8% up from the fold, or already behind us on a restored scroll position
      if (r.top < vh * 0.92 || r.bottom <= 0) {
        el.classList.add('in');
        return true;
      }
    },
  });
}

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  /** reveal immediately (hero content, above the fold) */
  now?: boolean;
} & Record<string, unknown>;

export function Reveal({ children, as = 'div', delay, className, now, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (now) {
      const id = requestAnimationFrame(() => el.classList.add('in'));
      return () => cancelAnimationFrame(id);
    }
    return observe(el);
  }, [now]);

  return createElement(
    as,
    { ref, 'data-rv': '', 'data-d': delay, className, ...rest },
    children
  );
}

/** Headline whose lines slide up from a clipping mask. */
export function LineMask({ lines, now }: { lines: string[]; now?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const masks = Array.from(host.querySelectorAll('.linemask'));
    if (now) {
      const id = requestAnimationFrame(() => masks.forEach((m) => m.classList.add('in')));
      return () => cancelAnimationFrame(id);
    }
    const stops = masks.map((m) => observe(m));
    return () => stops.forEach((s) => s());
  }, [now, lines]);

  return (
    <span ref={ref}>
      {lines.map((l, i) => (
        <span className="linemask" key={i}>
          <i dangerouslySetInnerHTML={{ __html: l }} />
        </span>
      ))}
    </span>
  );
}

/** Image wrapper that un-zooms as it enters. */
export function ClipReveal({
  children,
  className = '',
  now,
  ...rest
}: { children: ReactNode; className?: string; now?: boolean } & Record<string, unknown>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (now) {
      const id = requestAnimationFrame(() => el.classList.add('in'));
      return () => cancelAnimationFrame(id);
    }
    return observe(el);
  }, [now]);
  return (
    <div ref={ref} className={`clipr ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}

/** Counts up to `to` the first time it scrolls into view. */
export function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setN(to);
      return;
    }
    let raf = 0;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        const t0 = performance.now();
        const run = (t: number) => {
          const p = Math.min((t - t0) / 1250, 1);
          setN(Math.round((1 - Math.pow(1 - p, 3)) * to));
          if (p < 1) raf = requestAnimationFrame(run);
        };
        raf = requestAnimationFrame(run);
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <span ref={ref} className={className}>
      {n}
    </span>
  );
}

/** Pulls toward the pointer on hover. */
export function Magnetic({
  children,
  strength = 0.25,
  className,
  href,
  ...rest
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
  href?: string;
} & Record<string, unknown>) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px,${
        (e.clientY - r.top - r.height / 2) * strength
      }px)`;
    };
    const leave = () => {
      el.style.transition = 'transform .55s cubic-bezier(.16,1,.3,1)';
      el.style.transform = '';
      setTimeout(() => (el.style.transition = ''), 560);
    };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, [strength]);

  return (
    <a ref={ref} href={href} className={className} {...rest}>
      {children}
    </a>
  );
}

/** Scrambles its own text on hover. */
export function Scramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\|<>*#';
    let raf = 0;
    let frame = 0;

    const enter = () => {
      cancelAnimationFrame(raf);
      frame = 0;
      const q = text.split('').map((c, i) => ({ c, start: i * 1.4, end: i * 1.4 + 9 }));
      const run = () => {
        let out = '';
        let done = 0;
        for (const o of q) {
          if (frame >= o.end) {
            done++;
            out += o.c;
          } else if (frame >= o.start) {
            out += o.c === ' ' ? ' ' : CH[Math.floor(Math.random() * CH.length)];
          } else {
            // Emit the real character rather than nothing. Dropping it made the
            // string grow a letter at a time, so the element re-measured every
            // frame and shoved the rest of the footer around — the flicker.
            out += o.c;
          }
        }
        el.textContent = out;
        if (done < q.length) {
          frame++;
          raf = requestAnimationFrame(run);
        } else el.textContent = text;
      };
      run();
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      el.textContent = text;
    };

    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
    };
  }, [text]);

  return (
    <span ref={ref} className={className} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
      {text}
    </span>
  );
}

/** Vertical parallax driven by scroll position. */
export function Parallax({
  children,
  amount = 8,
  className,
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Continuous: never returns true, so it stays subscribed for the page's life.
    return subscribe({
      el,
      tick: (r, vh) => {
        if (r.bottom < -200 || r.top > vh + 200) return;
        const prog = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = `translate3d(0,${-prog * amount}%,0)`;
      },
    });
  }, [amount]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
