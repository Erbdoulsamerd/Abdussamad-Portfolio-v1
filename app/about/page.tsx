import type { Metadata } from 'next';
import Image from 'next/image';
import Footer from '@/components/Footer';
import CurioStack from '@/components/CurioStack';
import { ScrollProgress } from '@/components/Chrome';
import { LineMask, Reveal } from '@/components/Motion';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Abdussamad Ibrahim, also known as Flint, is a multidisciplinary designer in Nigeria whose practice exists at the intersection of identity, culture, objects, spaces and experiences.',
};

const experience = [
  { years: '2021', org: 'OSCA, Kano', role: 'Lead Graphic Designer (Volunteer)' },
  { years: '2022 – Present', org: 'Flint Horizon', role: 'Creative Fashion Director' },
  {
    years: '2022 – 2023',
    org: 'National Information Technology Development Agency (ONDI)',
    role: 'Intern (Head of Communication)',
  },
  { years: '2024 – 2025', org: 'Ananse Collective', role: 'Junior Graphic Designer' },
];

type Print = { src?: string; alt: string; label: string; w: number; h: number };

/**
 * The prints carry their own paper frame, clip, tilt and shadow, so they are
 * placed as-is — no cropping wrapper, no CSS frame. Omit `src` to fall back to
 * a labelled placeholder.
 */
const snaps: Print[] = [
  {
    src: '/assets/img/about/ramp.webp',
    alt: 'Cutting plywood for a skate ramp while a young helper steadies the sheet',
    label: 'Workshop · building the ramp',
    w: 869,
    h: 661,
  },
  {
    src: '/assets/img/about/photography.webp',
    alt: 'Two visitors photographing painted canvases hung on a gallery wall',
    label: 'Exhibition · work on the wall',
    w: 863,
    h: 601,
  },
  {
    src: '/assets/img/about/config.webp',
    alt: 'Flatlay of a Config lanyard badge, cap, watch and printed tee',
    label: 'Flatlay · studio objects',
    w: 566,
    h: 662,
  },
];

const curios: Print[] = [
  {
    src: '/assets/img/curio/wayback.webp',
    alt: 'A childhood photograph of three children standing together, faces blurred',
    label: 'Way back',
    w: 1600,
    h: 1159,
  },
  {
    src: '/assets/img/curio/tea.webp',
    alt: 'A metal teapot and a cup of tea on an engraved serving tray',
    label: 'Taburin mai shayi',
    w: 1163,
    h: 1600,
  },
  {
    src: '/assets/img/curio/f1.webp',
    alt: 'A die-cast Mercedes Formula One car beside a row of toy cars',
    label: 'Fleet',
    w: 1600,
    h: 1159,
  },
  {
    src: '/assets/img/curio/config-25.webp',
    alt: 'Two organisers laughing together at the Config watch party in Kano',
    label: 'Config ’25',
    w: 1600,
    h: 1159,
  },
  {
    src: '/assets/img/curio/matcha.webp',
    alt: 'A hand holding an iced matcha drink inside a car',
    label: 'Matcha',
    w: 1163,
    h: 1600,
  },
  {
    src: '/assets/img/curio/config-team.webp',
    alt: 'The Config Kano watch party team photographed together',
    label: 'Config team',
    w: 1600,
    h: 1159,
  },
];

function Print({ src, alt, label, w, h, sizes }: Print & { sizes: string }) {
  return src ? (
    <Image src={src} alt={alt} width={w} height={h} sizes={sizes} />
  ) : (
    <div className="ph" role="img" aria-label={alt}>
      <span>{label}</span>
    </div>
  );
}

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
            I am {site.name}, also known as <span className="accent">{site.alias}</span>, a multidisciplinary
            designer based in Nigeria whose practice exists at the intersection of identity, culture, objects,
            spaces, and experiences.
          </Reveal>
        </div>
      </section>

      {/* ── DOCUMENT ─────────────────────────────────────────── */}
      <div className="wrap" style={{ paddingBottom: 'var(--pad-y)', paddingTop: 'clamp(40px,6vw,80px)' }}>
        {/* 01 */}
        <section className="ab-sec" id="who">
          <div className="ab-split">
            <div>
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
            </div>

            {/* Dealt one at a time rather than as a block, so the pile builds. */}
            <div className="collage">
              {snaps.map((s, i) => (
                <Reveal
                  as="figure"
                  className="snap img-in"
                  delay={(i + 1) as 1 | 2 | 3}
                  key={s.label}
                >
                  <Print {...s} sizes="(max-width: 980px) 88vw, 34vw" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 02 */}
        <section className="ab-sec" id="practice">
          <h2 className="lg">
            <LineMask lines={['Fluid between', 'digital and physical.']} />
          </h2>
          <Reveal as="p" className="body-2">
            I have designed brand identities for businesses, startups, and cultural organisations. I have built
            physical structures like a skateboard ramp to support a growing skateboarding community. I have
            developed hospitality concepts where branding, architecture, interiors, and storytelling become one
            experience. Through photography, I document people, places, and ideas with the same intentionality
            that I bring to design. The rooms it happened in have been just as mixed.
          </Reveal>

          <Reveal as="ul" className="cv" delay={1} style={{ marginTop: 34 }}>
            {experience.map((e) => (
              <li key={`${e.years}-${e.org}`}>
                <span className="yr">{e.years}</span>
                <span>
                  <span className="org">{e.org}</span>
                  <span className="role">{e.role}</span>
                </span>
              </li>
            ))}
          </Reveal>

          <Reveal as="p" className="body-2" delay={2} style={{ marginTop: 30 }}>
            Different rooms, different titles, one practice: designing experiences that people can
            participate in rather than simply observe.
          </Reveal>
        </section>

        {/* 03 */}
        <section className="ab-sec" id="curiosities">
          <h2 className="lg">
            <LineMask lines={['Collected', 'curiosities']} />
          </h2>

          <Reveal className="curio">
            <p className="body-2">
              I collect more than references, I collect moments, objects, and experiences. Whether it&rsquo;s
              the engineering behind a Formula One car, the optimism of Spider-Man, the quiet ritual of making
              tea, or the craftsmanship woven into traditional Northern Nigerian textiles, each one teaches me
              something about people. They remind me that great design isn&rsquo;t created in isolation;
              it&rsquo;s shaped by the world around us.
            </p>
            <p className="body-2">
              These interests constantly find their way into my work. Sometimes they influence a brand identity,
              other times they become the foundation for a space, a product, a photograph, or a community
              initiative. They aren&rsquo;t distractions from my practice, they&rsquo;re the reason it continues
              to evolve.
            </p>
          </Reveal>

          <CurioStack items={curios} />
        </section>

      </div>

      <Footer />
    </>
  );
}
