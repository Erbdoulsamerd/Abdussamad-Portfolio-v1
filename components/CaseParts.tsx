'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import Image from 'next/image';
import type { Shot, Swatch } from '@/lib/projects';
import { scrollToTarget } from './SmoothScroll';
import { Reveal } from './Motion';

/* ── palette swatches, click to copy ─────────────────────────────────── */
export function Swatches({ palette }: { palette: Swatch[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      /* clipboard blocked — still show feedback so the click isn't dead */
    }
    setCopied(hex);
    setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1300);
  };

  return (
    <div className="sw-grid">
      {palette.map((s) => (
        <button
          key={s.hex}
          className="sw"
          style={{ ['--c' as string]: s.hex }}
          onClick={() => copy(s.hex)}
          data-cursor="Copy"
          aria-label={`Copy ${s.name} ${s.hex}`}
        >
          <i />
          <span>
            <b>{s.name}</b>
            <em>{copied === s.hex ? 'Copied' : s.hex}</em>
          </span>
        </button>
      ))}
    </div>
  );
}

/* ── before/after slider ─────────────────────────────────────────────── */
export function Compare({
  before,
  beforeAlt,
  after,
  afterAlt,
  beforeLabel,
  afterLabel,
}: {
  before: string;
  beforeAlt: string;
  after: string;
  afterAlt: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);

  const setFromX = useCallback((x: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPct(Math.min(Math.max(((x - r.left) / r.width) * 100, 0), 100));
  }, []);

  useEffect(() => {
    let dragging = false;
    const el = box.current;
    if (!el) return;

    const down = (e: PointerEvent) => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      setFromX(e.clientX);
    };
    const move = (e: PointerEvent) => dragging && setFromX(e.clientX);
    const up = (e: PointerEvent) => {
      dragging = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {}
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, [setFromX]);

  const key = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 3;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPct((p) => Math.max(p - step, 0));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPct((p) => Math.min(p + step, 100));
    }
  };

  return (
    <div className="cmp" ref={box} style={{ touchAction: 'none' }}>
      <Image src={after} alt={afterAlt} width={1600} height={1100} sizes="100vw" />
      <div className="cmp-top" ref={top} style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
        <Image src={before} alt={beforeAlt} width={1600} height={1100} sizes="100vw" />
      </div>
      <div
        className="cmp-handle"
        ref={handle}
        style={{ left: `${pct}%` }}
        role="slider"
        tabIndex={0}
        aria-label="Compare plan and render"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        onKeyDown={key}
      />
      <span className="cmp-lbl l">{beforeLabel}</span>
      <span className="cmp-lbl r">{afterLabel}</span>
    </div>
  );
}

/* ── gallery + lightbox ──────────────────────────────────────────────── */
const spanClass = (s: Shot['span']) => `g-${s}`;
const ratioClass = (r: Shot['ratio']) =>
  r === '4/3' ? 'ar-43' : r === '3/4' ? 'ar-34' : r === '16/9' ? 'ar-169' : 'ar-11';

export function Gallery({ shots }: { shots: Shot[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restore = useRef<HTMLElement | null>(null);

  const show = (i: number) => {
    restore.current = document.activeElement as HTMLElement;
    setOpen(i);
  };
  const close = useCallback(() => {
    setOpen(null);
    restore.current?.focus();
  }, []);

  useEffect(() => {
    if (open === null) return;
    document.body.classList.add('noscroll');
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : (i - 1 + shots.length) % shots.length));
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % shots.length));
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('noscroll');
      document.removeEventListener('keydown', onKey);
    };
  }, [open, shots.length, close]);

  return (
    <>
      <div className="gal">
        {shots.map((s, i) => (
          <Reveal
            as="figure"
            key={s.src + i}
            className={`${spanClass(s.span)} ${ratioClass(s.ratio)} img-in`}
            /* rolling stagger so a row lands as a wave, not a slab */
            delay={((i % 3) + 1) as 1 | 2 | 3}
            role="button"
            tabIndex={0}
            data-cursor="Expand"
            onClick={() => show(i)}
            onKeyDown={(e: ReactKeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                show(i);
              }
            }}
          >
            <Image src={s.src} alt={s.alt} width={1600} height={1200} sizes="(max-width: 760px) 100vw, 60vw" />
            <figcaption>{s.caption}</figcaption>
          </Reveal>
        ))}
      </div>

      <div className={`lb${open !== null ? ' on' : ''}`} role="dialog" aria-modal="true" aria-label="Image viewer">
        <div className="lb-hd">
          <span className="mono">{open !== null ? shots[open].caption : ''}</span>
          <button className="lb-x" ref={closeRef} onClick={close} aria-label="Close viewer">
            ✕
          </button>
        </div>
        <div className="lb-stage" onClick={close}>
          {open !== null ? (
            <Image
              src={shots[open].src}
              alt={shots[open].alt}
              width={1800}
              height={1350}
              sizes="100vw"
              style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
            />
          ) : null}
        </div>
        <div className="lb-ft">
          <span className="mono">
            {open !== null
              ? `${String(open + 1).padStart(2, '0')} / ${String(shots.length).padStart(2, '0')}`
              : ''}
          </span>
          <div className="lb-nav">
            <button
              onClick={() => setOpen((i) => (i === null ? i : (i - 1 + shots.length) % shots.length))}
              aria-label="Previous image"
            >
              Prev
            </button>
            <button
              onClick={() => setOpen((i) => (i === null ? i : (i + 1) % shots.length))}
              aria-label="Next image"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── sticky chapter nav with scrollspy ───────────────────────────────── */
export function ChapterNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const en of entries) if (en.isIntersecting) setActive(en.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) scrollToTarget(el);
  };

  return (
    <nav className="chap" aria-label="Chapters">
      <div className="wrap">
        <div className="chap-in">
          {items.map((i) => (
            <a
              key={i.id}
              href={`#${i.id}`}
              aria-current={active === i.id}
              onClick={(e) => go(e, i.id)}
            >
              {i.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
