import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Cursor, Header, ThemeScript } from '@/components/Chrome';
import SmoothScroll from '@/components/SmoothScroll';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%230B0B0C'/><text y='74' x='50' font-size='68' font-family='Helvetica' font-weight='bold' fill='%23D8402F' text-anchor='middle'>A</text></svg>",
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0B0C',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="archive" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SmoothScroll />
        <div className="grain" aria-hidden="true" />
        <Cursor />
        <Header />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
