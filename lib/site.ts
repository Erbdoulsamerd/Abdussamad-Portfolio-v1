export const site = {
  name: 'Abdussamad Ibrahim',
  alias: 'Flint',
  role: 'Creative Systems Designer',
  base: 'Kaduna, Nigeria',
  region: 'Northern Nigeria',
  since: '2019',
  email: 'hello@abdussamad.design',
  url: 'https://abdussamad.design',
  description:
    'Abdussamad Ibrahim (Flint) is a multidisciplinary designer in Nigeria working across identity, culture, objects, spaces and experiences.',
} as const;

export const nav = [
  { label: 'Index', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
] as const;

export const social = [
  { label: 'Instagram', href: '#' },
  { label: 'Behance', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Are.na', href: '#' },
] as const;

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
