'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { nav, site } from '@/lib/site';

/* ── theme ───────────────────────────────────────────────────────────── */
const THEME_KEY = 'ai-theme';
type Theme = 'archive' | 'paper';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('archive');

  useEffect(() => {
    const el = document.documentElement.getAttribute('data-theme');
    setTheme(el === 'paper' ? 'paper' : 'archive');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'paper' ? 'archive' : 'paper';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
  };

  return (
    <button
      className="tgl"
      onClick={toggle}
      aria-label={theme === 'paper' ? 'Switch to dark archive' : 'Switch to paper'}
    >
      {theme === 'paper' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.9" />
      <path d="M12 2.2v2.4M12 19.4v2.4M4.5 4.5l1.7 1.7M17.8 17.8l1.7 1.7M2.2 12h2.4M19.4 12h2.4M4.5 19.5l1.7-1.7M17.8 6.2l1.7-1.7" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d="M20.5 14.2A8.6 8.6 0 1 1 9.8 3.5a6.7 6.7 0 0 0 10.7 10.7Z" />
    </svg>
  );
}

/* ── local clock ─────────────────────────────────────────────────────── */
export function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: site.clock.tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();

    // Align to the next whole second, then tick on the second, so the display
    // never visibly skips or repeats a value the way a naive setInterval drifts.
    let id = 0;
    const align = window.setTimeout(() => {
      tick();
      id = window.setInterval(tick, 1000);
    }, 1000 - (Date.now() % 1000));

    return () => {
      clearTimeout(align);
      clearInterval(id);
    };
  }, []);

  return (
    <div className="clock">
      {/* Placeholder keeps server and first client render identical (no
          hydration mismatch) and reserves the width so nothing shifts. */}
      <span>{time ?? '--:--:--'}</span> {site.clock.label}
    </div>
  );
}

/** Applies the saved theme before first paint, so there is no flash. */
export function ThemeScript() {
  const js = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');document.documentElement.setAttribute('data-theme',t==='paper'?'paper':'archive')}catch(e){}})()`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}

/* ── header + mobile drawer ──────────────────────────────────────────── */
export function Header() {
  const pathname = usePathname();
  const [stuck, setStuck] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setStuck(y > 40);
      setHidden(y > last.current && y > 420 && !open);
      last.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  useEffect(() => {
    document.body.classList.toggle('noscroll', open);
    return () => document.body.classList.remove('noscroll');
  }, [open]);

  // close the drawer whenever the route changes
  useEffect(() => setOpen(false), [pathname]);

  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header className={`hdr${stuck ? ' stuck' : ''}${hidden ? ' hide' : ''}`}>
        <div className="brand">
          <b>{site.name}</b>
          <span className="mono">{site.role}</span>
        </div>

        <nav className="nav" aria-label="Primary">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isCurrent(n.href) ? 'page' : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hdr-r">
          <Clock />
          <ThemeToggle />
          <button
            className={`burger${open ? ' on' : ''}`}
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <i />
            <i />
          </button>
        </div>
      </header>

      <nav className={`drawer${open ? ' on' : ''}`} aria-label="Mobile">
        {nav.map((n, i) => (
          <Link key={n.href} href={n.href}>
            {n.label} <em>{String(i + 1).padStart(2, '0')}</em>
          </Link>
        ))}
      </nav>
    </>
  );
}

/* ── preloader ───────────────────────────────────────────────────────── */
const PRELOAD_KEY = 'ai-preloaded';

/**
 * True once any page of the site has mounted in this tab. Module scope, so it
 * survives client-side navigation and resets on a real page load — which is
 * exactly the difference between "clicked back to the index" and "opened the
 * site fresh". sessionStorage covers the reload case; this covers the flash,
 * since it is readable during render.
 */
let seenThisTab = false;

/**
 * Marks the tab as having seen the site. Rendered by the layout, so it runs on
 * every page — land on /about first and the index still skips its loader later.
 *
 * Deferred by a tick on purpose: this sits above <main> in the layout, so its
 * effect fires before the page's own, and marking the tab synchronously would
 * tell the loader on a cold load of / that it had already run.
 */
export function SessionMark() {
  useEffect(() => {
    const id = setTimeout(() => {
      seenThisTab = true;
      try {
        sessionStorage.setItem(PRELOAD_KEY, '1');
      } catch {}
    }, 0);
    return () => clearTimeout(id);
  }, []);
  return null;
}

/** Hides the preloader before first paint when this tab has already seen it. */
export function PreloadScript() {
  const js = `(function(){try{if(sessionStorage.getItem('${PRELOAD_KEY}'))document.documentElement.classList.add('preloaded')}catch(e){}})()`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}

export function Preloader() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const started = useRef(false);
  // Decided once, on this instance's first render: reading the live flag on every
  // render would yank the overlay away mid-count the moment SessionMark sets it.
  const [skip] = useState(() => seenThisTab);

  useEffect(() => {
    // Once per tab. A reload keeps the session (storage), a click back to the
    // index keeps the module flag; only closing the tab starts over.
    // The ref guards the strict-mode remount: on the second pass SessionMark has
    // already written the flag, and without it the loader would cut itself short.
    if (!started.current) {
      let seen = skip;
      try {
        seen = seen || sessionStorage.getItem(PRELOAD_KEY) === '1';
      } catch {}
      if (seen) {
        setGone(true);
        return;
      }
      started.current = true;
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dur = reduce ? 220 : 1100;
    let raf = 0;
    let t0: number | null = null;
    let finished = false;

    document.body.classList.add('noscroll');

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      clearTimeout(watchdog);
      setN(100);
      setDone(true);
      document.body.classList.remove('noscroll');
      setTimeout(() => setGone(true), 700);
    };

    const frame = (t: number) => {
      if (finished) return;
      if (t0 === null) t0 = t;
      const p = Math.min((t - t0) / dur, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(frame);
      else setTimeout(finish, reduce ? 0 : 180);
    };
    raf = requestAnimationFrame(frame);

    // Hard ceiling. Without it a throttled tab (backgrounded on load) would
    // never get a frame and the visitor would be stranded, scroll-locked.
    const watchdog = setTimeout(finish, dur + 900);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(watchdog);
      document.body.classList.remove('noscroll');
    };
  }, [skip]);

  // Navigating back to the index inside the same visit: nothing to load, so
  // there is no overlay to paint at all — not even for the frame before the
  // effect runs. On a reload the markup ships but CSS has already hidden it.
  if (gone || skip) return null;

  return (
    <div className="pre" role="status" aria-label="Loading" {...(done ? { 'hidden-anim': '' } : {})}>
      <div className="pre-inner">
        <div className="pre-num">
          {String(n).padStart(3, '0')}
          <span className="pre-pct">%</span>
        </div>
        <div className="pre-bar">
          <i style={{ width: `${n}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ── custom cursor ───────────────────────────────────────────────────── */
export function Cursor() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    const dot = document.createElement('div');
    dot.className = 'cursor';
    const lbl = document.createElement('div');
    lbl.className = 'cursor-lbl';
    document.body.append(dot, lbl);

    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, woke = false, raf = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!woke) {
        woke = true;
        cx = mx;
        cy = my;
        dot.classList.add('woke');
      }
    };
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest?.('[data-cursor]') as HTMLElement | null;
      if (t) {
        dot.classList.add('is-big');
        lbl.classList.add('on');
        lbl.textContent = t.getAttribute('data-cursor') ?? '';
      } else if ((e.target as HTMLElement)?.closest?.('a,button,[role="button"]')) {
        dot.classList.add('is-big');
        lbl.classList.remove('on');
      } else {
        dot.classList.remove('is-big');
        lbl.classList.remove('on');
      }
    };

    const loop = () => {
      cx += (mx - cx) * 0.19;
      cy += (my - cy) * 0.19;
      dot.style.transform = `translate(${cx}px,${cy}px)`;
      lbl.style.transform = `translate(${cx}px,${cy}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', over);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      dot.remove();
      lbl.remove();
    };
  }, []);

  return null;
}

/* ── scroll progress bar ─────────────────────────────────────────────── */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const upd = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${h > 0 ? Math.min(Math.max(scrollY / h, 0), 1) : 0})`;
    };
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
    return () => {
      window.removeEventListener('scroll', upd);
      window.removeEventListener('resize', upd);
    };
  }, []);
  return <div className="prog" ref={ref} aria-hidden="true" />;
}
