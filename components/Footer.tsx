import { LineMask, Scramble } from './Motion';
import { site, social } from '@/lib/site';

/** One footer, identical on every page: the same call, the same last line. */
const CTA = ["Let's make", 'it mean', 'something<span class="accent">.</span>'];

export default function Footer() {
  return (
    <footer className="ftr wrap">
      <a className="ftr-cta" href={`mailto:${site.email}`} data-cursor="Write to me">
        <h2 className="mega" style={{ margin: 0 }}>
          <LineMask lines={CTA} />
        </h2>
      </a>

      {/* Type is set once on the row so the copyright and the links cannot drift
          apart; only the colour separates metadata from something clickable. */}
      <div className="ftr-btm">
        <span className="fg2">© 2026 {site.name}</span>

        {/* The "Elsewhere" heading is gone with the columns, so the list carries
            the label itself rather than reading as four bare links. */}
        <ul className="ftr-social" aria-label="Elsewhere">
          {social.map((s) => {
            const pending = !s.href || s.href === '#';
            return (
              <li key={s.label}>
                {/* Until a real URL exists, don't render a link that jumps
                    the page to the top when clicked. */}
                {pending ? (
                  <span className="ulink is-pending" aria-disabled="true">
                    <Scramble text={s.label} />
                  </span>
                ) : (
                  <a className="ulink" href={s.href} target="_blank" rel="noreferrer">
                    <Scramble text={s.label} />
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
