import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Cursor, Header, PreloadScript, SessionMark, ThemeScript } from '@/components/Chrome';
import SmoothScroll from '@/components/SmoothScroll';
import { site } from '@/lib/site';

const socialImage = new URL('/ai-og.png?v=20260803', site.url).toString();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: site.url },
  openGraph: {
    title: `${site.name} · ${site.role}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: 'website',
    images: [{ url: socialImage, width: 1200, height: 630, alt: `${site.name} preview` }],
  },
  other: {
    'og:image:secure_url': socialImage,
    'og:image:type': 'image/png',
    'og:image:alt': `${site.name} preview`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} · ${site.role}`,
    description: site.description,
    images: [{ url: socialImage, alt: `${site.name} preview` }],
  },
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
        <PreloadScript />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SessionMark />
        <SmoothScroll />
        <div className="grain" aria-hidden="true" />
        <Cursor />
        <Header />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
