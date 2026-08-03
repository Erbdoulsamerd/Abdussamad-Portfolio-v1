import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import NextProject from '@/components/NextProject';
import { ScrollProgress } from '@/components/Chrome';
import { ChapterNav, Compare, Gallery, Swatches } from '@/components/CaseParts';
import { ClipReveal, CountUp, LineMask, Parallax, Reveal } from '@/components/Motion';
import { getProject, nextProject, projects } from '@/lib/projects';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};

  const coverImage = p.cover.startsWith('http') ? p.cover : new URL(p.cover, 'https://abdussamad.design').toString();

  return {
    title: `${p.title} · Case Study`,
    description: p.lede,
    alternates: { canonical: `https://abdussamad.design/work/${p.slug}` },
    openGraph: {
      title: `${p.title} · Case Study`,
      description: p.lede,
      url: `https://abdussamad.design/work/${p.slug}`,
      type: 'article',
      images: [{ url: coverImage, alt: p.coverAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${p.title} · Case Study`,
      description: p.lede,
      images: [{ url: coverImage, alt: p.coverAlt }],
    },
  };
}

export default async function CaseStudy({ params }: Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p || !p.published) notFound();

  const next = nextProject(p.slug);
  const chapters = [
    ...p.sections.map((s) => ({ id: s.id, label: s.eyebrow })),
    ...(p.compare ? [{ id: 'plan-compare', label: 'The Plan' }] : []),
    { id: 'palette', label: 'Palette' },
    { id: 'spaces', label: 'The Work' },
    ...(p.process ? [{ id: 'process', label: 'Process' }] : []),
  ];

  return (
    <div
      className="cs"
      style={{ ['--proj-accent' as string]: p.accent, ['--proj-accent-fg' as string]: p.accentFg }}
    >
      <ScrollProgress />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="cs-hero">
        <Parallax className="cs-hero-img" amount={8}>
          <Image src={p.hero} alt={p.heroAlt} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
        </Parallax>

        <div className="wrap">
          <Reveal className="mono" now style={{ marginBottom: 18 }}>
            {p.tags.join(' · ')} &nbsp;·&nbsp; <span className="accent">{p.year}</span>
          </Reveal>

          <h1 className="cs-title" style={{ margin: 0 }}>
            <LineMask now lines={p.title.split(' ')} />
          </h1>

          <Reveal as="p" className="lead" delay={2} now style={{ marginTop: 24, maxWidth: 'min(46ch, 100%)' }}>
            {p.lede}
          </Reveal>

          <Reveal as="dl" className="cs-meta" delay={3} now>
            {p.meta.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <ChapterNav items={chapters} />

      {/* ── NARRATIVE SECTIONS ───────────────────────────────── */}
      {p.sections.map((s, i) => (
        <section className={`cs-sec wrap${i ? ' rule-t' : ''}`} id={s.id} key={s.id}>
          <div className="cs-2col wide-r">
            <h2 className="lg">
              <LineMask lines={s.heading} />
            </h2>

            <div>
              {s.body?.map((b, n) => (
                <Reveal as="p" className="body-2" key={n} delay={(n + 1) as 1 | 2} style={{ marginTop: n ? '1.15em' : 0 }}>
                  {b}
                </Reveal>
              ))}

              {s.quote ? (
                <Reveal className="pull" delay={2}>
                  <p className="serif-it">{s.quote}</p>
                </Reveal>
              ) : null}

              {s.notes ? (
                <Reveal delay={3}>
                  {s.notes.map((n, k) => (
                    <div className="note" key={n.key} style={k === s.notes!.length - 1 ? { borderBottom: 0 } : undefined}>
                      <b>{n.key}</b>
                      <span>{n.text}</span>
                    </div>
                  ))}
                </Reveal>
              ) : null}
            </div>
          </div>
        </section>
      ))}

      {/* ── PLAN COMPARE ─────────────────────────────────────── */}
      {p.compare ? (
        <section className="cs-sec wrap rule-t" id="plan-compare">
          <Reveal as="p" className="mono" style={{ marginBottom: 20 }}>
            Drag to compare the drawing with the render
          </Reveal>
          <Reveal>
            <Compare {...p.compare} />
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(min(180px,100%),1fr))',
              gap: 1,
              background: 'var(--rule)',
              border: '1px solid var(--rule)',
              marginTop: 'clamp(26px,4vw,44px)',
            }}
          >
            {[
              { n: 2, l: 'Bedrooms' },
              { n: 1, l: 'Courtyard pool' },
              { n: 100, l: 'Exterior circulation', suffix: '%' },
              { n: p.palette.length, l: 'Core materials' },
            ].map((s) => (
              <div key={s.l} style={{ background: 'var(--bg)', padding: 'clamp(18px,2.4vw,26px)' }}>
                <b
                  style={{
                    fontFamily: 'var(--f-display)',
                    fontSize: 'clamp(2rem,4vw,3rem)',
                    letterSpacing: '-.04em',
                    display: 'block',
                  }}
                >
                  <CountUp to={s.n} />
                  {s.suffix ?? ''}
                </b>
                <span className="mono">{s.l}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── PALETTE ──────────────────────────────────────────── */}
      <section className="cs-sec wrap rule-t" id="palette">
        <div className="cs-2col wide-r" style={{ marginBottom: 'clamp(30px,4vw,52px)' }}>
          <h2 className="lg">
            <LineMask lines={['The palette.']} />
          </h2>
          <Reveal as="p" className="body-2">
            {p.paletteNote} Click any swatch to copy its value.
          </Reveal>
        </div>
        <Reveal>
          <Swatches palette={p.palette} />
        </Reveal>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────── */}
      <section className="cs-sec wrap rule-t" id="spaces">
        <div className="cs-2col wide-r" style={{ marginBottom: 'clamp(30px,4vw,52px)' }}>
          <h2 className="lg">
            <LineMask lines={['Look closer.']} />
          </h2>
          <Reveal as="p" className="body-2">
            Click any image to open it full size.
          </Reveal>
        </div>
        <Gallery shots={p.shots} />
      </section>

      {/* ── PROCESS ──────────────────────────────────────────── */}
      {p.process ? (
        <section className="cs-sec wrap rule-t" id="process">
          <div className="cs-2col wide-r" style={{ marginBottom: 'clamp(30px,4vw,52px)' }}>
            <h2 className="lg">
              <LineMask lines={['Modelled before', 'it was drawn.']} />
            </h2>
            <Reveal as="p" className="body-2">
              The whole scheme was resolved in 3D first. Working in the model rather than in elevation meant
              light could be tested directly. The sun was moved until the stair threw the right shadow, then
              the plan settled around what had been found.
            </Reveal>
          </div>
          <div className="cs-2col">
            {p.process.map((s, i) => (
              <ClipReveal key={s.src}>
                <figure style={{ margin: 0 }}>
                  <Image src={s.src} alt={s.alt} width={1600} height={900} sizes="(max-width: 900px) 100vw, 50vw" />
                  <figcaption className="mono" style={{ marginTop: 12 }}>
                    {s.caption}
                  </figcaption>
                </figure>
              </ClipReveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── NEXT — scrolling to the bottom carries you into it ─ */}
      <NextProject project={next} />
    </div>
  );
}
