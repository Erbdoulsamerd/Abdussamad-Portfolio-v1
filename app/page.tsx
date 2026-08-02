import Link from 'next/link';
import Image from 'next/image';
import WorkIndex from '@/components/WorkIndex';
import DragPortrait from '@/components/DragPortrait';
import Footer from '@/components/Footer';
import { Preloader } from '@/components/Chrome';
import { LineMask, Magnetic, Reveal, Scramble } from '@/components/Motion';
import { projects } from '@/lib/projects';
import { disciplines, site } from '@/lib/site';

export default function Home() {
  const published = projects.filter((p) => p.published);

  return (
    <>
      <Preloader />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hero wrap">
        <div className="hero-bg" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <i key={i} />
          ))}
        </div>

        <div className="hero-mark">
          <h1 className="mega" style={{ margin: 0 }}>
            <LineMask
              now
              lines={[
                'Abdussamad',
                'Ibrahim<sup style="font-size:.2em;vertical-align:super" class="accent">®</sup>',
              ]}
            />
          </h1>

          <Reveal className="hero-portrait" delay={2} now>
            <DragPortrait>
              <Image
                src="/assets/img/me.png"
                alt={`Halftone portrait of ${site.name}`}
                width={877}
                height={1034}
                priority
                draggable={false}
                sizes="(max-width: 860px) 40vw, 288px"
              />
            </DragPortrait>
          </Reveal>
        </div>

        <div className="hero-sub">
          <Reveal as="p" className="lead" delay={2} now style={{ maxWidth: 'min(46ch, 100%)' }}>
            A multidisciplinary designer working at the intersection of{' '}
            <span className="serif-it accent">identity, culture, objects, spaces</span> and experiences. I
            don&rsquo;t design deliverables. I design systems people can participate in.
          </Reveal>

          <Reveal delay={3} now style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <Magnetic
              className="btn solid"
              href={site.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Download CV</span>
            </Magnetic>
            <Link className="btn" href="/about">
              <span>About the practice</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────── */}
      <div className="marq" aria-hidden="true">
        <div className="marq-t">
          {disciplines.slice(0, 8).map((d) => (
            <span key={d}>
              {d}
              <u />
            </span>
          ))}
        </div>
        <div className="marq-t" aria-hidden="true">
          {disciplines.slice(0, 8).map((d) => (
            <span key={d}>
              {d}
              <u />
            </span>
          ))}
        </div>
      </div>

      {/* ── WORK INDEX ───────────────────────────────────────── */}
      <section className="sec wrap rule-t" id="work">

        <WorkIndex projects={published} />

      </section>

      {/* ── PRACTICE ─────────────────────────────────────────── */}
      <section className="sec wrap rule-t" id="practice">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))',
            gap: 'var(--gut)',
          }}
        >
          <div>
            <h2 className="lg" style={{ marginBottom: 22 }}>
              <LineMask lines={['One practice,', 'eleven tools.']} />
            </h2>
            <Reveal as="p" className="body-2">
              Design is not defined by the medium. The medium simply becomes the most appropriate tool for
              solving a problem. Below is the current toolkit. Each one has been used in service of the same
              idea.
            </Reveal>
          </div>

          <ul style={{ borderTop: '1px solid var(--rule)' }}>
            {disciplines.map((d) => (
              <li key={d} style={{ borderBottom: '1px solid var(--rule)' }}>
                <Link
                  href="/about"
                  className="ulink"
                  style={{ display: 'block', padding: '13px 0' }}
                >
                  <Scramble text={d} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>


      <Footer />
    </>
  );
}
