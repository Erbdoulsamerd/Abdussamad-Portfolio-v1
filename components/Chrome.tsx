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
      <span aria-hidden="true">{theme === 'paper' ? '☾' : '☀'}</span>
    </button>
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
export function Preloader() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
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
  }, []);

  if (gone) return null;

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
