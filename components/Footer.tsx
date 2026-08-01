import Link from 'next/link';
import { LineMask, Scramble } from './Motion';
import { nav, site, social } from '@/lib/site';

export default function Footer({
  lines = ["Let's make", 'it mean', 'something<span class="accent">.</span>'],
  colTitle = 'Practice',
  colItems = ['Identity & systems', 'Spatial & hospitality', 'Photography & editorial'],
}: {
  lines?: string[];
  colTitle?: string;
  colItems?: string[];
}) {
  return (
    <footer className="ftr wrap">
      <a className="ftr-cta" href={`mailto:${site.email}`} data-cursor="Write to me">
        <h2 className="mega" style={{ margin: 0 }}>
          <LineMask lines={lines} />
        </h2>
      </a>

      <div className="ftr-grid">
        <div className="ftr-col">
          <h4>Navigate</h4>
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <Link className="ulink" href={n.href}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="ftr-col">
          <h4>Elsewhere</h4>
          <ul>
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

        <div className="ftr-col">
          <h4>Contact</h4>
          <ul>
            <li>
              <a className="ulink" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li className="fg2">Available 2026</li>
          </ul>
        </div>

        <div className="ftr-col">
          <h4>{colTitle}</h4>
          <ul>
            {colItems.map((c) => (
              <li className="fg2" key={c}>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ftr-btm">
        <span className="mono">© 2026 {site.name}</span>
      </div>
    </footer>
  );
}
