import type { Metadata } from 'next';
import WorkIndex from '@/components/WorkIndex';
import { LineMask, Reveal } from '@/components/Motion';
import { projects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected work by Abdussamad Ibrahim — hospitality concepts, brand identities and spatial systems from Northern Nigeria.',
};

export default function WorkPage() {
  const published = projects.filter((p) => p.published);

  return (
    <>
      <section className="work-hero wrap">
        <h1 className="mega" style={{ margin: 0, textTransform: 'uppercase' }}>
          <LineMask now lines={['Selected', 'work']} />
        </h1>

        <Reveal
          as="p"
          className="lead"
          delay={2}
          now
          style={{ marginTop: 'clamp(24px,4vw,44px)', paddingTop: 24, borderTop: '1px solid var(--rule)', maxWidth: '52ch' }}
        >
          Three documented case files, each one a different expression of the same practice — a place, a
          product brand, and an institution. Every project connects identity to something you can walk into,
          eat, or stand in front of.
        </Reveal>
      </section>

      <section className="sec wrap rule-t">
        <WorkIndex projects={published} />

      </section>
    </>
  );
}
