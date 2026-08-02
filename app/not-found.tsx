import Link from 'next/link';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <section className="wrap" style={{ minHeight: '72svh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 140 }}>
        <div className="mono" style={{ marginBottom: 20 }}>
          <span className="accent">Error 404</span> &nbsp; File not found in the archive
        </div>
        <h1 className="mega" style={{ margin: 0, textTransform: 'uppercase' }}>
          Missing<span className="accent">.</span>
        </h1>
        <p className="lead" style={{ marginTop: 26, maxWidth: '44ch' }}>
          That page isn&rsquo;t in the archive. It may have been renamed, or it was never filed in the first place.
        </p>
        <p style={{ marginTop: 28, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link className="btn solid" href="/"><span>Back to the work</span></Link>
          <Link className="btn" href="/about"><span>About the practice</span></Link>
        </p>
      </section>
      <Footer />
    </>
  );
}
