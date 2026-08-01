export type Shot = {
  src: string;
  alt: string;
  caption: string;
  /** 12-column span + aspect ratio, e.g. { span: 8, ratio: '4/3' } */
  span: 4 | 6 | 8 | 12;
  ratio: '4/3' | '3/4' | '16/9' | '1/1';
};

export type Swatch = { name: string; hex: string };

export type Section = {
  id: string;
  eyebrow: string;
  heading: string[];
  body?: string[];
  quote?: string;
  notes?: { key: string; text: string }[];
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  strap: string;
  year: string;
  place: string;
  tags: string[];
  cover: string;
  coverAlt: string;
  /** clean image for the case-study hero — no baked-in logotype */
  hero: string;
  heroAlt: string;
  lede: string;
  accent: string;
  accentFg: string;
  meta: { label: string; value: string }[];
  sections: Section[];
  palette: Swatch[];
  paletteNote: string;
  shots: Shot[];
  /** optional plan-vs-render comparison */
  compare?: { before: string; beforeAlt: string; after: string; afterAlt: string; beforeLabel: string; afterLabel: string };
  process?: Shot[];
  published: boolean;
};

const GK = (n: string, ext: 'jpg' | 'png' = 'jpg') => `/assets/img/gk/${n}.${ext}`;
const AA = (n: string) => `/assets/img/aadil/${n}.jpg`;
const EN = (n: string) => `/assets/img/enlira/${n}.jpg`;

export const projects: Project[] = [
  /* ───────────────────────────── GIDAN KASA ───────────────────────────── */
  {
    slug: 'gidan-kasa',
    index: '01',
    title: 'Gidan Kasa',
    strap: 'House of earth',
    year: '2024',
    place: 'Kaduna',
    tags: ['Hospitality', 'Spatial', 'Identity'],
    cover: GK('cover'),
    coverAlt: 'Gidan Kasa — logotype set over the earthen courtyard',
    hero: GK('court-01'),
    heroAlt: 'Gidan Kasa — earthen courtyard with pool, arched openings and palms',
    lede:
      'Hausa for “house of earth.” A hospitality concept where the ground the building stands on became the material, the palette and the name.',
    accent: '#E08A2E',
    accentFg: '#1A1206',
    meta: [
      { label: 'Project', value: 'Gidan Kasa' },
      { label: 'Discipline', value: 'Hospitality concept' },
      { label: 'Scope', value: 'Identity · Spatial · Interiors' },
      { label: 'Stage', value: 'Concept & visualisation' },
      { label: 'Place', value: 'Northern Nigeria' },
    ],
    sections: [
      {
        id: 'intent',
        eyebrow: 'Intent',
        heading: ['Not a building', 'with a logo', 'attached.'],
        body: [
          'Most hospitality projects are assembled in sequence: an architect draws the shell, an interior designer dresses it, and a brand studio arrives at the end to name it and print the menus. Each step inherits decisions it had no part in making.',
          'Gidan Kasa was approached the other way round. The name, the plan, the plaster, the light and the language were treated as one system, resolved together. The result is a place where you cannot separate the branding from the architecture, because there was never a moment when they were separate.',
        ],
        quote: 'A space can influence behaviour. So it should be designed with the same intent as an identity.',
        notes: [
          { key: '01', text: 'Build from what is already underfoot — earth, not import.' },
          { key: '02', text: 'Let the courtyard, not the corridor, organise the plan.' },
          { key: '03', text: 'Design for the hour before sunset, when the walls do the work.' },
          { key: '04', text: 'Make every surface something a hand would want to touch.' },
        ],
      },
      {
        id: 'name',
        eyebrow: 'Name & Mark',
        heading: ['Gidan Kasa', '— house of earth.'],
        body: [
          'The name is Hausa, and it is literal. Gida is house. Kasa is the ground, the earth, the land itself. Naming the place after its own material means the brand can never drift away from the building — it is a promise the walls keep on their own.',
          'The mark is written, not typeset. A single continuous line, drawn with the same looseness as a finger dragged through wet plaster, so the logotype reads as a gesture belonging to the surface rather than a label applied on top of it.',
        ],
        notes: [
          { key: 'Form', text: 'Continuous monoline script, drawn by hand' },
          { key: 'Setting', text: 'Two lines, stacked, generous leading' },
          { key: 'Colour', text: 'Sun amber on clay, or clay on sand' },
          { key: 'Rule', text: 'Never outlined, never on white' },
        ],
      },
      {
        id: 'material',
        eyebrow: 'Material',
        heading: ['Touch is', 'the argument.'],
        body: [
          'Earth render, cane, oak and raw linen were selected for how they behave over time rather than how they photograph on day one. Clay absorbs heat and gives it back slowly after dark. Cane filters light into pattern. Linen creases and stays creased.',
          'Each one is a material that improves by being used — which is exactly what you want from a place people are meant to live in, briefly.',
        ],
      },
      {
        id: 'plan',
        eyebrow: 'The Plan',
        heading: ['The courtyard', 'does the organising.'],
        body: [
          'Two bedrooms, a living room, a kitchen and a pool, arranged so that no room reaches another without passing through open air. The corridor is deliberately exterior — you feel the temperature change on the way to bed. It is a small inconvenience that does more for the experience of the place than any amenity could.',
        ],
      },
      {
        id: 'close',
        eyebrow: 'Closing',
        heading: ['One system,', 'many surfaces.'],
        body: [
          'Gidan Kasa is the clearest argument I have for the way I work. The name explains the material. The material sets the palette. The palette decides the light. The light shapes the plan. Nothing here was applied at the end.',
          'This is what I mean by designing systems rather than deliverables — and it is why I don’t separate branding from architecture, or photography from spatial thinking. They are different surfaces of a single decision.',
        ],
        quote: 'I don’t believe great design lives in one category. I believe it lives in the connections between them.',
      },
    ],
    palette: [
      { name: 'Sun Amber', hex: '#FBA03A' },
      { name: 'Burnt Earth', hex: '#65351B' },
      { name: 'Dry Olive', hex: '#555E03' },
      { name: 'Plaster Sand', hex: '#F2D0AB' },
      { name: 'Deep Bark', hex: '#2E2C1D' },
    ],
    paletteNote:
      'Nothing in the palette was chosen from a swatch book. Every value was sampled from something present on site — the clay of the render, the shade under a mango tree, the bleached sand of the courtyard floor at midday, the bark of the doors.',
    compare: {
      before: GK('plan'),
      beforeAlt: 'Floor plan: yard, living room, kitchen, swimming pool, exterior corridor, two bedrooms',
      after: GK('court-01'),
      afterAlt: 'Rendered courtyard with pool, arches and planting',
      beforeLabel: 'Drawing',
      afterLabel: 'Built view',
    },
    shots: [
      { src: GK('living-02'), alt: 'Living room with sculptural curved staircase, woven pendant light and full-height windows', caption: '01 — Living room, curved stair', span: 8, ratio: '4/3' },
      { src: GK('bath-02'), alt: 'Bathroom with rain shower, teak slat floor, round mirror and stone basin', caption: '02 — Bathroom, teak deck', span: 4, ratio: '3/4' },
      { src: GK('court-01'), alt: 'Courtyard pool framed by earthen arches, banana leaves and palms', caption: '03 — Courtyard, pool', span: 4, ratio: '3/4' },
      { src: GK('ext-01'), alt: 'Dining room with reclaimed timber table, woven rush chairs and two large cane pendants', caption: '04 — Dining, under the stair', span: 8, ratio: '4/3' },
      { src: GK('court-02'), alt: 'Galley kitchen with poured concrete counters, timber island and garden doors', caption: '05 — Kitchen, garden end', span: 6, ratio: '4/3' },
      { src: GK('corridor'), alt: 'Exterior corridor with timber beams, arched openings and lattice screens casting patterned shadow', caption: '06 — Corridor, exterior', span: 6, ratio: '4/3' },
      { src: GK('room-01'), alt: 'Bedroom with low timber platform bed, cane pendant, round brass mirror and dried grasses', caption: '07 — Bedroom 01', span: 6, ratio: '4/3' },
      { src: GK('room-02'), alt: 'Second bedroom with linen armchairs, timber sideboards and afternoon light across the clay wall', caption: '08 — Bedroom 02', span: 6, ratio: '4/3' },
      { src: GK('bath-01'), alt: 'Bathroom with organically-shaped timber mirror, stone basin and window onto planting', caption: '09 — Bathroom, garden window', span: 6, ratio: '4/3' },
      { src: GK('bath-03'), alt: 'Bathroom with floating timber vanity, round mirror, wall sconces and glazed concrete shower', caption: '10 — Bathroom, floating vanity', span: 6, ratio: '4/3' },
      { src: GK('living-01'), alt: 'Wide view of the living room: linen sofa, timber coffee table, curved clay stair and garden beyond', caption: '11 — Living room, the long view', span: 12, ratio: '16/9' },
    ],
    process: [
      { src: GK('process-01'), alt: '3D software viewport showing the living room scene under construction', caption: '01 — Living room, scene in progress', span: 6, ratio: '16/9' },
      { src: GK('process-02', 'png'), alt: '3D software viewport with timeline and outliner, testing the lighting of the interior scene', caption: '02 — Lighting pass', span: 6, ratio: '16/9' },
    ],
    published: true,
  },

  /* ───────────────────────────────── AADIL ───────────────────────────────── */
  {
    slug: 'aadil',
    index: '02',
    title: 'Aadil',
    strap: 'The secret ingredient is freshness',
    year: '2024',
    place: 'F&B',
    tags: ['Brand Identity', 'Packaging', 'Art Direction'],
    cover: AA('cover'),
    coverAlt: 'Aadil logotype set over free-range poultry',
    hero: AA('18'),
    heroAlt: 'Free-range hen portrait framed with the Aadil mark',
    lede:
      'A free-range chicken brand built on appetite, warmth and a Nigerian sense of humour — from a hand-drawn script to a truck driving through Kaduna.',
    accent: '#F04B23',
    accentFg: '#FFFFFF',
    meta: [
      { label: 'Project', value: 'Aadil' },
      { label: 'Sector', value: 'Food & beverage' },
      { label: 'Scope', value: 'Identity · Packaging · Art direction' },
      { label: 'Typeface', value: 'Gilroy' },
      { label: 'Year', value: '2024' },
    ],
    sections: [
      {
        id: 'intent',
        eyebrow: 'Intent',
        heading: ['A brand that', 'behaves like', 'a person.'],
        body: [
          'Aadil sells chicken. That is a category where everyone shouts about price and nobody sounds like a human being. The opening decision was to make the brand talk the way people actually talk about food — “lowkey the best decision today” — and let the warmth do the selling.',
          'A soft white script with a red comb sitting on top of it, a yolk-yellow field, and photography of birds that are visibly alive and outdoors. Nothing about it apologises for being a chicken brand.',
        ],
        quote: 'The secret ingredient is freshness — so the identity had to look fresh before it said anything.',
        notes: [
          { key: 'A', text: 'Script logotype, drawn soft, never outlined.' },
          { key: 'B', text: 'Yolk yellow is the brand. Red is the accent, never the field.' },
          { key: 'C', text: 'Photograph living birds outdoors, not product on white.' },
          { key: 'D', text: 'Write the way a customer would text a friend.' },
        ],
      },
      {
        id: 'voice',
        eyebrow: 'Voice',
        heading: ['The copy', 'is the layout.'],
        body: [
          'Aadil’s headlines are not set inside a layout — they are the layout. Gilroy at its heaviest, cropped tight to the frame, red on yolk yellow, with the bird pushing in from the edge. There is no decoration doing any work.',
          'The vocabulary is deliberately Nigerian and deliberately spoken. KUKURUKU is not a slogan, it is the sound a rooster makes. That single decision does more brand-building than a paragraph of positioning ever would.',
        ],
      },
      {
        id: 'livery',
        eyebrow: 'Livery',
        heading: ['The truck', 'is the billboard.'],
        body: [
          'A delivery fleet in a Nigerian city is seen by more people in a week than any campaign will reach in a month. So the truck was treated as the primary application, not an afterthought — full yolk-yellow body, the script running the length of the box, comb shapes cropping off the panels.',
          'Uniform followed the same logic. A driver in a branded tee and cap is a brand asset who talks back, remembers your street, and gets photographed.',
        ],
        quote: 'Chicken truck. Two words on the side of a van, doing more work than a strapline.',
      },
    ],
    palette: [
      { name: 'Yolk Yellow', hex: '#FDBA12' },
      { name: 'Comb Red', hex: '#F04B23' },
      { name: 'Cream', hex: '#FFF3D6' },
      { name: 'Char', hex: '#2B2118' },
    ],
    paletteNote:
      'Two colours do almost all the work: a yellow warm enough to read as edible, and a red reserved for the comb, the accent and the shout. Everything else is support.',
    shots: [
      { src: AA('01'), alt: 'THE SECRET INGREDIENT IS FRESHNESS headline in red on yellow with a whole bird', caption: '01 — Headline system', span: 12, ratio: '16/9' },
      { src: AA('16'), alt: 'KUKURUKU repeated behind a watercolour rooster illustration', caption: '02 — Kukuruku', span: 4, ratio: '3/4' },
      { src: AA('07'), alt: 'The freshness headline set for portrait formats', caption: '03 — Portrait cut', span: 4, ratio: '3/4' },
      { src: AA('18'), alt: 'Free-range hen portrait framed with the Aadil mark', caption: '04 — Spotted', span: 4, ratio: '3/4' },
      { src: AA('12'), alt: 'Yellow delivery truck in full Aadil livery with the driver leaning out', caption: '05 — Chicken truck', span: 8, ratio: '4/3' },
      { src: AA('10'), alt: 'Driver in an Aadil branded tee at the wheel of the truck', caption: '06 — Uniform', span: 4, ratio: '3/4' },
      { src: AA('04'), alt: 'Kraft carrier bag reading Lowkey The Best Decision Today', caption: '07 — Carrier bag', span: 6, ratio: '4/3' },
      { src: AA('06'), alt: 'Aadil brand identity board in yellow and red', caption: '08 — Identity board', span: 6, ratio: '4/3' },
      { src: AA('05'), alt: 'Aadil branding applied outdoors', caption: '09 — Outdoor', span: 12, ratio: '16/9' },
    ],
    published: true,
  },

  /* ──────────────────────────────── ENLIRA ──────────────────────────────── */
  {
    slug: 'enlira',
    index: '03',
    title: 'Enlira',
    strap: 'Great impact is never built alone',
    year: '2025',
    place: 'Impact',
    tags: ['Brand Identity', 'Stationery', 'Environmental'],
    cover: EN('cover'),
    coverAlt: 'Enlira — green hoarding carrying the wordmark',
    hero: EN('cover'),
    heroAlt: 'Enlira — green site hoarding carrying the wordmark',
    lede:
      'An identity for a firm that puts institutional discipline behind social outcomes — forest green, gold, and a butterfly drawn in one unbroken line.',
    accent: '#F5C518',
    accentFg: '#04331F',
    meta: [
      { label: 'Project', value: 'Enlira' },
      { label: 'Sector', value: 'Impact investment' },
      { label: 'Scope', value: 'Identity · Stationery · Campaign' },
      { label: 'Typeface', value: 'Gilroy' },
      { label: 'Year', value: '2025' },
    ],
    sections: [
      {
        id: 'intent',
        eyebrow: 'Intent',
        heading: ['Impact deserves', 'the same discipline', 'as any investment.'],
        body: [
          'Impact investing has a presentation problem. It is usually dressed either as charity — soft, apologetic, watercoloured — or as finance, in which case the impact disappears entirely. Enlira needed to look like neither.',
          'The answer was a forest green as serious as any institution, a gold that carries the optimism, and a single continuous line drawing of a butterfly: transformation stated once, without a metaphor being laboured.',
        ],
        quote: 'Great impact is never built alone.',
        notes: [
          { key: '01', text: 'Green is the institution. Gold is the outcome.' },
          { key: '02', text: 'The butterfly is drawn in one unbroken line — never filled.' },
          { key: '03', text: 'Set everything in Gilroy. Nothing decorative.' },
          { key: '04', text: 'Show real people at work, not stock optimism.' },
        ],
      },
      {
        id: 'system',
        eyebrow: 'System',
        heading: ['A system is only real', 'once someone else', 'can run it.'],
        body: [
          'An identity that only works when its designer is in the room is not an identity, it is a decoration. Enlira’s system was built so an internal team could extend it on a Monday morning without asking permission.',
          'One mark with two lockups. Seven colours with defined roles. One typeface across every weight. The constraint is the point — there is very little room to get it wrong.',
        ],
      },
      {
        id: 'campaign',
        eyebrow: 'Campaign',
        heading: ['Impact investment,', 'said out loud.'],
        body: [
          'A campaign for an impact firm has to do two contradictory things at once — sound credible to institutional capital and mean something to the people the capital is meant to reach. Splitting the difference produces something that convinces nobody.',
          'So the campaign leads with the sentence and lets the photography carry the proof: people planting, people working, people who are visibly not stock footage.',
        ],
      },
    ],
    palette: [
      { name: 'Forest', hex: '#04331F' },
      { name: 'Gold', hex: '#F5C518' },
      { name: 'Cream', hex: '#FCE9C8' },
      { name: 'Olive', hex: '#C3C77E' },
      { name: 'Mint', hex: '#B4DCC8' },
      { name: 'Cocoa', hex: '#5A2E10' },
      { name: 'Charcoal', hex: '#263238' },
    ],
    paletteNote:
      'Seven colours with defined roles. Forest and gold carry the brand; the remaining five support without ever competing for the headline.',
    shots: [
      { src: EN('cover'), alt: 'Green site hoarding carrying the Enlira wordmark', caption: '01 — Site hoarding', span: 8, ratio: '4/3' },
      { src: EN('01'), alt: 'Enlira butterfly monogram in gold on green and green on gold', caption: '02 — The mark', span: 4, ratio: '3/4' },
      { src: EN('08'), alt: 'Social campaign posts: Impact Investment, and Great impact is never built alone', caption: '03 — Campaign', span: 12, ratio: '16/9' },
      { src: EN('03'), alt: 'Seven-colour palette as circles: forest, gold, cream, olive, mint, cocoa, charcoal', caption: '04 — Palette', span: 6, ratio: '4/3' },
      { src: EN('09'), alt: 'Gilroy typeface specimen set in charcoal on gold', caption: '05 — Typeface', span: 6, ratio: '4/3' },
      { src: EN('04'), alt: 'Type weight and style grid in cocoa on cream', caption: '06 — Weights', span: 6, ratio: '4/3' },
      { src: EN('06'), alt: 'Enlira identity applied across collateral', caption: '07 — Application', span: 6, ratio: '4/3' },
      { src: EN('02'), alt: 'Enlira brand system layout', caption: '08 — System', span: 12, ratio: '16/9' },
    ],
    published: true,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
