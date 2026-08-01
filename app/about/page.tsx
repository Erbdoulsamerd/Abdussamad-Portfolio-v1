import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { ScrollProgress } from '@/components/Chrome';
import { ChapterNav } from '@/components/CaseParts';
import { ClipReveal, LineMask, Reveal } from '@/components/Motion';
import { disciplines, philosophy, site } from '@/lib/site';
import { projects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Abdussamad Ibrahim, also known as Flint — a multidisciplinary designer in Nigeria whose practice exists at the intersection of identity, culture, objects, spaces and experiences.',
};

const chapters = [
  { id: 'who', label: 'Who I Am' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'practice', label: 'My Practice' },
  { id: 'drives', label: 'What Drives Me' },
  { id: 'areas', label: 'Areas of Practice' },
  { id: 'forward', label: 'Looking Forward' },
];

export default function About() {
  return (
    <>
      <ScrollProgress />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="ab-hero wrap">
        <h1 className="mega" style={{ margin: 0, textTransform: 'uppercase' }}>
          <LineMask now lines={['About', 'the practice']} />
        </h1>

        <div
          style={{
            marginTop: 'clamp(34px,5vw,64px)',
            paddingTop: 24,
            borderTop: '1px solid var(--rule)',
          }}
        >
          <Reveal as="p" className="lead" delay={1} now>
            I am {site.name}, also known as <span className="accent">{site.alias}</span> — a multidisciplinary
            designer based in Nigeria whose practice exists at the intersection of identity, culture, objects,
            spaces, and experiences.
          </Reveal>
        </div>
      </section>

      <ChapterNav items={chapters} />

      {/* ── DOCUMENT ─────────────────────────────────────────── */}
      <div className="wrap" style={{ paddingBottom: 'var(--pad-y)', paddingTop: 'clamp(40px,6vw,80px)' }}>
        <div className="ab-doc">
          <nav className="ab-nav" aria-label="Sections">
            <p className="mono" style={{ marginBottom: 12, color: 'var(--fg-3)' }}>
              Contents
            </p>
            <ol>
              {chapters.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`}>
                    <span>{c.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div>
            {/* 01 */}
            <section className="ab-sec" id="who">
              <h2 className="lg">
                <LineMask lines={['I began in brand', 'identity. I did not', 'stay there.']} />
              </h2>
              <Reveal as="p" className="body-2">
                Although I began my journey through brand identity design, my work has continually expanded
                beyond traditional boundaries. Today, I work across branding, creative direction, industrial
                design, photography, editorial design, spatial thinking, hospitality concepts, and community
                building.
              </Reveal>
              <Reveal as="p" className="body-2" delay={1}>
                I don&rsquo;t see these as separate disciplines, but as different ways of expressing the same
                idea.
              </Reveal>
              <Reveal className="pull" delay={2}>
                <p>
                  Design is not defined by the medium. The medium simply becomes the most appropriate tool for
                  solving a problem.
                </p>
              </Reveal>
            </section>

            {/* 02 */}
            <section className="ab-sec" id="philosophy">
              <h2 className="lg">
                <LineMask lines={['The strongest ideas', 'are not confined', 'to one discipline.']} />
              </h2>

              <Reveal as="ul" className="phil">
                {philosophy.map((p) => (
                  <li key={p.key}>
                    <span>
                      {p.lead} {p.emph}
                    </span>
                  </li>
                ))}
              </Reveal>

              <Reveal as="p" className="body-2" delay={1} style={{ marginTop: 28 }}>
                Rather than creating isolated deliverables, I design systems that connect people, places,
                ideas, and experiences. Every project starts with curiosity and ends with one question:
              </Reveal>
              <Reveal
                as="p"
                className="lg accent serif-it"
                delay={2}
                style={{ marginTop: 22, fontWeight: 400 }}
              >
                How can this become more meaningful?
              </Reveal>
            </section>

            {/* 03 */}
            <section className="ab-sec" id="practice">
              <h2 className="lg">
                <LineMask lines={['Fluid between', 'digital and physical.']} />
              </h2>
              <Reveal as="p" className="body-2">
                I have designed brand identities for businesses, startups, and cultural organizations. I have
                built physical structures like a skateboard ramp to support a growing skateboarding community.
                I have developed hospitality concepts where branding, architecture, interiors, and storytelling
                become one experience. Through photography, I document people, places, and ideas with the same
                intentionality that I bring to design.
              </Reveal>

              <Reveal as="ul" className="tl" delay={1} style={{ marginTop: 34 }}>
                {projects.map((p) => (
                  <li key={p.slug}>
                    <span className="mono accent">{p.title}</span>
                    <span>
                      <span className="md">{p.strap}.</span>
                      <span className="mono" style={{ display: 'block', marginTop: 8 }}>
                        <Link className="ulink" href={`/work/${p.slug}`}>
                          Read the case study
                        </Link>
                      </span>
                    </span>
                  </li>
                ))}
                <li>
                  <span className="mono">SkateMania</span>
                  <span>
                    <span className="md">A skateboard ramp, built by hand, for a community that needed one.</span>
                  </span>
                </li>
                <li>
                  <span className="mono">The Backyard</span>
                  <span>
                    <span className="md">A space designed to be gathered in, not just looked at.</span>
                  </span>
                </li>
                <li>
                  <span className="mono">Flint</span>
                  <span>
                    <span className="md">The studio name, and the through-line across every discipline.</span>
                  </span>
                </li>
              </Reveal>

              <Reveal as="p" className="body-2" delay={2} style={{ marginTop: 30 }}>
                These all represent different expressions of a single practice — designing experiences that
                people can participate in rather than simply observe.
              </Reveal>
            </section>

            {/* 04 */}
            <section className="ab-sec" id="drives">
              <h2 className="lg">
                <LineMask lines={['The relationship', 'between design', 'and culture.']} />
              </h2>
              <Reveal as="p" className="body-2">
                I enjoy understanding how people move, gather, communicate, remember, and create meaning.
                Whether I am developing a visual identity, directing a photoshoot, prototyping an object, or
                imagining a new public space, my goal remains the same: to create work that feels intentional,
                useful, and lasting.
              </Reveal>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))',
                  gap: 'var(--gut)',
                  marginTop: 32,
                  alignItems: 'center',
                }}
              >
                <Reveal as="p" className="body-2" delay={1}>
                  Growing up in {site.region} has significantly influenced my perspective. It has inspired me
                  to explore local stories, architecture, youth culture, craftsmanship, and community through a
                  contemporary design lens.
                </Reveal>
                <ClipReveal className="ab-plate-img">
                  <Image
                    src="/assets/img/gk/ext-01.jpg"
                    alt="Earthen architecture with arched openings and palms — Gidan Kasa"
                    width={1200}
                    height={1500}
                    sizes="(max-width: 900px) 100vw, 40vw"
                  />
                </ClipReveal>
              </div>
            </section>

            {/* 05 */}
            <section className="ab-sec" id="areas">
              <h2 className="lg" style={{ marginBottom: 30 }}>
                <LineMask lines={['Eleven tools,', 'one intent.']} />
              </h2>
              <Reveal as="ul" className="prac">
                {disciplines.map((d) => (
                  <li key={d}>
                    <button type="button">
                      <span className="t">{d}</span>
                    </button>
                  </li>
                ))}
              </Reveal>
            </section>

            {/* 06 */}
            <section className="ab-sec" id="forward">
              <h2 className="lg">
                <LineMask lines={['Blurring the', 'boundaries.']} />
              </h2>
              <Reveal as="p" className="body-2">
                My ambition is to continue building projects that blur the boundaries between disciplines.
              </Reveal>

              <Reveal
                as="ul"
                delay={1}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(min(210px,100%),1fr))',
                  gap: 1,
                  background: 'var(--rule)',
                  border: '1px solid var(--rule)',
                  marginTop: 28,
                }}
              >
                {[
                  ['Brands', 'that become communities'],
                  ['Spaces', 'that become destinations'],
                  ['Products', 'that become rituals'],
                  ['Ideas', 'that leave cultural impact'],
                ].map(([k, v]) => (
                  <li key={k} style={{ background: 'var(--bg)', padding: 'clamp(20px,2.6vw,28px)' }}>
                    <span className="mono accent">{k}</span>
                    <span className="md" style={{ display: 'block', marginTop: 12 }}>
                      {v}
                    </span>
                  </li>
                ))}
              </Reveal>

              <Reveal className="pull" delay={2} style={{ marginTop: 44 }}>
                <p>
                  I don&rsquo;t believe great design lives in one category. I believe it lives in the
                  connections between them.
                </p>
              </Reveal>
            </section>
          </div>
        </div>
      </div>

      <Footer lines={['Work with', 'me<span class="accent">.</span>']} />
    </>
  );
}
