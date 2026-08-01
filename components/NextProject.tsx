'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Project } from '@/lib/projects';

/**
 * Sits at the foot of a case study. Reaching the bottom of it carries you
 * into the next project, so the three case studies read as a loop.
 * Always a real link, so it works without the auto-advance.
 */
export default function NextProject({ project }: { project: Project }) {
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    router.prefetch(`/work/${project.slug}`);

    // Auto-advance is a scroll hijack; don't do it to people who asked for less motion.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let dwell = 0;
    let ticking = false;
    // Only arm once the panel has genuinely been below the fold, so a deep
    // link landing near the bottom can't fire it on arrival.
    let armed = false;

    const TRIGGER = 0.6; // advance as soon as the panel is well into view

    const measure = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block first appears, 1 when it fills the viewport
      const p = Math.min(Math.max((vh - r.top) / vh, 0), 1);
      setProgress(Math.min(p / TRIGGER, 1));

      if (p < 0.15) armed = true;
      if (reduce || fired.current || !armed) return;

      if (p >= TRIGGER) {
        // a couple of frames so a bounce at the edge doesn't count
        dwell += 1;
        if (dwell > 4) {
          fired.current = true;
          router.push(`/work/${project.slug}`);
        }
      } else {
        dwell = 0;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(measure);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    measure();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [project.slug, router]);

  return (
    <section className="nextp" ref={ref}>
      <Image src={project.cover} alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} aria-hidden="true" />

      <div className="nextp-in wrap">
        <p className="mono nextp-lbl">Next project</p>

        <Link href={`/work/${project.slug}`} className="nextp-ttl" data-cursor="Open">
          {project.title}
        </Link>

        <p className="mono nextp-meta">
          {project.tags.join(' · ')} &nbsp;·&nbsp; {project.year}
        </p>

        <div className="nextp-bar" aria-hidden="true">
          <i style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
    </section>
  );
}
