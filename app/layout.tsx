import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Cursor, Header, PreloadScript, SessionMark, ThemeScript } from '@/components/Chrome';
import SmoothScroll from '@/components/SmoothScroll';
import SoundEffects from '@/components/SoundEffects';
import { site, social } from '@/lib/site';

const socialImage = new URL('/ai-og.png', site.url).toString();
const siteTitle = `${site.name} | ${site.role}`;
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  alternateName: site.alias,
  jobTitle: site.role,
  description: site.description,
  url: site.url,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kaduna',
    addressRegion: 'Northern Nigeria',
    addressCountry: 'NG',
  },
  sameAs: social.map((item) => item.href),
  knowsAbout: [
    'Brand strategy',
    'Identity design',
    'Experience design',
    'Industrial design',
    'Photography',
    'Spatial design',
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: siteTitle,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  alternates: { canonical: site.url },
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: siteTitle,
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
    title: siteTitle,
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SessionMark />
        <SmoothScroll />
        <SoundEffects />
        <div className="grain" aria-hidden="true" />
        <Cursor />
        <Header />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
