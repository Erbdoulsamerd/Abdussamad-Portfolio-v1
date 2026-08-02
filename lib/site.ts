export const site = {
  name: 'Abdussamad Ibrahim',
  alias: 'Flint',
  role: 'Creative Systems Designer',
  base: 'Kaduna, Nigeria',
  region: 'Northern Nigeria',
  since: '2019',
  email: 'abdusibrahim@gmail.com',
  url: 'https://abdussamad.design',
  description:
    'Abdussamad Ibrahim (Flint) is a multidisciplinary designer in Nigeria working across identity, culture, objects, spaces and experiences.',
  /** Header clock. `tz` is an IANA zone; `label` is what reads after the time. */
  clock: { tz: 'Africa/Lagos', label: 'WAT Abuja, NG.' },
  /** External CV — opens in a new tab. Drive preview rather than a forced
      download: it survives Drive's virus-scan interstitial and lets people read
      it without committing to a file. */
  cvUrl: 'https://drive.google.com/file/d/1uZC4pG1p4Q0-fh3fzxXcSkVojvbjIfe6/view',
} as const;

/** The front page is the work, so there is no separate index entry. `match` adds
    a second path that also counts as current: the case studies under /work. */
export const nav: readonly { label: string; href: string; match?: string }[] = [
  { label: 'Work', href: '/', match: '/work' },
  { label: 'About', href: '/about' },
];

/** `href: '#'` marks a profile that doesn't exist yet — the footer renders it
    as inert text rather than a link that jumps the page to the top. */
export const social: readonly { label: string; href: string }[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/theamazingabdulll/' },
  { label: 'Behance', href: 'https://www.behance.net/abdussaibrahim' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abdussamad-ibrahim-928b9316a/' },
  { label: 'Are.na', href: 'https://www.are.na/abdussamad-ibrahim/channels' },
];

export const disciplines = [
  'Creative Systems Design',
  'Brand Strategy & Identity',
  'Creative Direction',
  'Experience Design',
  'Industrial Design',
  'Photography',
  'Editorial Design',
  'Spatial & Environmental Design',
  'Hospitality Concepts',
  'Community Building',
  'Research & Storytelling',
] as const;

export const philosophy = [
  { key: 'A', lead: 'A visual identity can shape', emph: 'perception.' },
  { key: 'B', lead: 'A product can encourage', emph: 'interaction.' },
  { key: 'C', lead: 'A space can influence', emph: 'behavior.' },
  { key: 'D', lead: 'A photograph can preserve', emph: 'culture.' },
  { key: 'E', lead: 'A community can change', emph: 'lives.' },
] as const;

/** Named in the practice, not yet documented as case files. */
export const archive = [
  { name: 'Flint', kind: 'Studio' },
  { name: 'SkateMania', kind: 'Community' },
  { name: 'The Backyard', kind: 'Space' },
] as const;
