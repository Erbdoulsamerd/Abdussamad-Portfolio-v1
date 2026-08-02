'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/lib/projects';

type View = 'columns' | 'list' | 'grid';
const VIEWS: View[] = ['columns', 'list', 'grid'];

export default function WorkIndex({ projects }: { projects: Project[] }) {
  // Columns every visit. The toggle still switches views for the session, but
  // the choice is deliberately not remembered — the index always opens the same
  // way, for everyone.
  const [view, setView] = useState<View>('columns');
  const [preview, setPreview] = useState<string | null>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  /* floating hover preview, list view only */
  useEffect(() => {
    const el = floatRef.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let fx = 0, fy = 0, tx = 0, ty = 0, raf = 0;
    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      fx += (tx - fx) * 0.13;
      fy += (ty - fy) * 0.13;
      el.style.transform = `translate(${fx}px,${fy}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener('mousemove', move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
    };
  }, []);

  return (
    <>
      <div className="idx-bar">
        <h2 className="lg" style={{ margin: 0 }}>
          Index<span className="accent">.</span>
        </h2>
        <div className="seg" role="tablist" aria-label="Index view">
          {VIEWS.map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="idx" data-view={view}>
        {projects.map((p) => (
          <Link
            key={p.slug}
            className="idx-item"
            href={`/work/${p.slug}`}
            data-cursor="Open case study"
            onMouseEnter={() => setPreview(p.cover)}
            onMouseLeave={() => setPreview(null)}
          >
            <span className="idx-thumb">
              <Image
                src={p.cover}
                alt={p.coverAlt}
                width={900}
                height={675}
                sizes="(max-width: 760px) 100vw, 33vw"
              />
            </span>
            <span>
              <span className="idx-ttl">{p.title}</span>
              <span className="idx-meta" style={{ marginTop: 10 }}>
                {p.tags.map((t) => (
                  <em key={t}>{t}</em>
                ))}
                <em className="accent" style={{ borderColor: 'var(--accent)' }}>
                  Case study
                </em>
              </span>
            </span>
            <span className="idx-yr">
              {p.year} · {p.place}
            </span>
          </Link>
        ))}
      </div>

      <div ref={floatRef} className={`idx-float${preview && view === 'list' ? ' on' : ''}`} aria-hidden="true">
        {preview && view === 'list' ? (
          <Image src={preview} alt="" width={600} height={450} sizes="300px" />
        ) : null}
      </div>
    </>
  );
}
