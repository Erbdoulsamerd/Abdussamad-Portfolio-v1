---
name: portfolio-style
description: House style for the "Field Archive" portfolio site - copy voice (no em dashes anywhere in copy), design tokens, type scale, component class inventory, and motion primitives. Use when writing or editing any user-facing copy, CSS, or React component in this repo.
---

# Field Archive house style

The design system for **Abdussamad Ibrahim (Flint)**, codenamed *Field Archive*. Dark
archival canvas, documentary red accent, oversized display type, hairline rules, grain.
It reads like a working archive of a practice, not a marketing site.

Two rules override everything else:

1. **No em dashes in copy.** See below.
2. **Tokens are law.** No raw hex, px type sizes, or literal durations in components.

---

## 1. Copy: no em dashes

**Never use an em dash (`—`, U+2014) in anything a person reads on the site.**

That covers, without exception:

- JSX text, `lead`, `body-2`, `pull` prose
- `LineMask` / `heading` arrays, headlines, footer CTA lines
- `lib/site.ts` and `lib/projects.ts` content fields: `lede`, `strap`, `body`, `quote`,
  `notes[].text`, `caption`, `paletteNote`, `meta[].value`
- `alt` and `coverAlt` / `heroAlt` text, `aria-label`, button labels, `data-cursor` labels
- Next `metadata` (`title`, `description`, `openGraph`), `not-found`, `sitemap`, `robots`

**Out of scope:** code comments and the `{/* ── SECTION ── */}` banners. Those use
box-drawing `─` (U+2500), not an em dash, and the author's comment voice stays as-is.
Do not rewrite comments to satisfy this rule.

### What to write instead

Pick by what the dash was doing, in this order of preference:

| The dash was... | Write instead | Example |
|---|---|---|
| Joining two independent clauses | **Two sentences** | `Below is the current toolkit. Each one has been used in service of the same idea.` |
| Introducing an explanation or list | **Colon** | `Nothing came from a swatch book: every value was sampled on site.` |
| Wrapping a short aside | **Comma pair** | `The mark, drawn in one unbroken line, is never filled.` |
| Separating meta fields or labels | **Middot `·`** | `Identity · Spatial · Interiors` |
| Numbering a caption | **Middot `·`** | `'01 · Living room, curved stair'` |
| Naming a title and role | **Middot `·`** | `Abdussamad Ibrahim · Creative Systems Designer` |

Restructuring into two sentences is almost always the strongest fix. The voice is
declarative and unhurried already, so short sentences suit it.

### Adjacent punctuation

- **En dash (`–`) is allowed for numeric ranges only**: `2022 – Present`, `2024 – 2025`.
  Never use it as a stand-in for the banned em dash in prose.
- **Hyphen (`-`)** for compounds: `free-range`, `full-height`, `hand-drawn`.
- **Curly quotes and apostrophes** in prose: `&rsquo;` / `’`, `“ ”`. Never straight `'` or `"`
  in rendered text.
- **Middot `·`** is the house separator. Space it: `A · B`, never `A·B`.
- Semicolons are fine and already used. Parentheses sparingly.

### Check before you ship

```bash
grep -rn $'—' app components lib --include="*.tsx" --include="*.ts"
```

Every hit must be inside a `//` or `/* */` comment. Anything in a string literal or JSX
text node is a bug.

---

## 2. Voice

- **Declarative, past-tense, documentary.** State what was done and why. `The name is Hausa,
  and it is literal.` Not `We wanted to create something authentic.`
- **First person singular** for the practice: `I began in brand identity. I did not stay there.`
- **No agency-speak.** No "solutions", "leverage", "seamless", "elevate", "passionate",
  "curated", "bespoke". No exclamation marks.
- **British/Nigerian English**: `behaviour`, `colour`, `visualisation`, `organise`.
- **Headlines are sentence case with a full stop**, split across lines as an array:
  `['I began in brand', 'identity. I did not', 'stay there.']`. Break lines where a reader
  would breathe, not to balance width.
- **Eyebrows and micro labels** are short nouns, sentence case: `Intent`, `Name & Mark`,
  `Material`, `The Plan`.
- **Alt text describes the frame**, plainly and specifically, no ticker of keywords:
  `Courtyard pool framed by earthen arches, banana leaves and palms`.
- **Cursor labels are imperative and tiny**: `Open`, `Copy`, `Expand`, `Drag me`,
  `Write to me`, `Open case study`.

---

## 3. Tokens are law

Every colour, size, space, radius, duration and easing comes from a CSS custom property
declared in `app/globals.css`. Full inventory: [references/tokens.md](references/tokens.md).

**Never** write a raw value in a component or a new rule:

```tsx
/* wrong */  <div style={{ color: '#D8402F', marginTop: 32, borderTop: '1px solid #222' }} />
/* right */  <div style={{ color: 'var(--accent)', marginTop: 'clamp(26px,4vw,46px)',
                           borderTop: '1px solid var(--rule)' }} />
```

The one sanctioned exception is a **per-project case-study accent**, set as an inline custom
property on the `.cs` root and consumed through `--accent` as normal:

```tsx
<article className="cs" style={{ ['--proj-accent' as string]: p.accent,
                                 ['--proj-accent-fg' as string]: p.accentFg }}>
```

Project accents live in `lib/projects.ts` (`accent`, `accentFg`), never in CSS.

### Colour semantics

- `--bg` / `--bg-raised` / `--bg-inset` / `--bg-plate` for surfaces, in that order of depth.
- `--fg` primary text, `--fg-2` secondary prose and meta, `--fg-3` quietest labels and numbers.
- `--rule` hairline dividers, `--rule-2` the stronger border on interactive chrome.
- `--accent` is documentary red `#D8402F` sitewide, overridden per case study. Use it for
  one thing at a time: the full stop in a headline, an active state, a bar, a key label.
  It is punctuation, not decoration.

---

## 4. Type

Three families, all tokenised. `--f-display` is **SkyBoxed Display** and is reserved for
`.mega`, `.xl`, `.lg`, `.cs-title`, `.nextp-ttl` and the preloader counter. Everything else
is `--f-body` / `--f-label` (Helvetica Neue stack).

| Class | Token | Use |
|---|---|---|
| `.mega` | `--t-mega` | Hero wordmark, footer CTA, next-project title. Uppercase. |
| `.xl` | `--t-xl` | Rare, large section openers |
| `.lg` | `--t-l` | Section headings (`h2`) |
| `.md` | `--t-m` | Body-family bold sub-headings, tight `-.02em` |
| `.lead` | `--t-s` | Standfirst under a hero, capped at `46ch` inline |
| `.body-2` | `--t-body` | Body prose, `--fg-2`, capped `68ch` |
| `.mono` / `.mono-s` | `.75rem` | Meta lines, captions, counters |
| `.eyebrow` | `.8rem` | Section label with trailing rule |

Rules that matter:

- Display faces carry **positive** tracking (`.012em`); body-family headings carry
  **negative** tracking (`-.02em` to `-.035em`). Do not swap them.
- `font-variant-numeric: tabular-nums` is global. Keep it. Numbers must not jitter.
- Never set body text below `14px`. Uppercase only for micro labels and display wordmarks.
- Prose gets a measure cap (`max-width: min(62ch, 100%)` or the class default). Never let a
  paragraph run the full 1560px.

---

## 5. Layout

- `.wrap` for the max-width gutter container (`--maxw` 1560px, `--gut` fluid 18-52px).
- `.sec` for a vertical section rhythm (`--pad-y`), `.rule-t` to add the hairline above it.
- Grids use `repeat(auto-fit, minmax(min(Xpx,100%), 1fr))` so they collapse without a query.
- **Hairline-gap grids** are a signature: `gap: 1px; background: var(--rule); border: 1px
  solid var(--rule)` with opaque children. Used by `.phil`, `.prac`, `.sw-grid`, `.cs-meta`.
- Breakpoints in use: `980`, `900`, `860`, `780`, `760`, `640`, `620`, `560`. Reuse an
  existing one before inventing another.
- Case-study galleries use the 12-column `.gal` with `.g-4 / .g-6 / .g-8 / .g-12` spans and
  `.ar-43 / .ar-34 / .ar-169 / .ar-11` ratios, set from `lib/projects.ts`.

---

## 6. Motion

Import primitives from `components/Motion.tsx`. Do not hand-roll scroll listeners: there is
one shared rAF-coalesced scroll engine bound to Lenis, and new listeners fight it.

| Primitive | Use |
|---|---|
| `<Reveal as delay now>` | Fade and rise on enter. `delay` is `1`-`6` (70ms steps). `now` for above the fold. |
| `<LineMask lines={[...]} now>` | Headline lines sliding out of a clip mask. Accepts inline HTML. |
| `<ClipReveal>` | Curtain wipe plus defocus push-in for images |
| `.img-in` on a `Reveal` | Same drama for images that must not be clipped (framed prints) |
| `<Parallax amount>` | Vertical scroll parallax |
| `<Magnetic strength>` | Pointer-following anchor, fine pointers only |
| `<Scramble text>` | Character scramble on hover |
| `<CountUp to>` | Counts on first intersection |

- Easing is `--e-out` `cubic-bezier(.16,1,.3,1)` for nearly everything. `--e-io` for symmetric moves.
- Durations: `--d-fast .22s` hover/colour, `--d-base .45s` layout/state, `--d-slow .9s` reveals.
- Images animate slower than text on purpose. They arrive last and land soft.
- **Every effect must no-op under `prefers-reduced-motion`.** Check the media query in JS
  before wiring, and add the class immediately instead. `globals.css` §19 is the backstop.
- Fine-pointer effects (`Magnetic`, cursor, `.idx-float`) must check
  `(hover: hover) and (pointer: fine)` and skip on touch.

---

## 7. Themes

Two, on `<html data-theme>`: `archive` (dark, default) and `paper` (light). `ThemeScript`
in `components/Chrome.tsx` sets it before first paint; `localStorage` key `ai-theme`.

Any new surface must resolve through the semantic tokens so both themes work for free.
Test `paper` before calling a component done: light mode swaps `--img-filter` in as well,
so images pick up a contrast/saturation adjustment.

---

## 8. Non-negotiables

- Focus is always visible: `:focus-visible` is a 2px accent outline. Never `outline: none`
  without a replacement (see `.hero-drag:focus-visible`).
- Interactive elements reachable by keyboard, with `aria-label` where the label is an icon
  or a glyph. Lightbox and gallery already model this (Escape, arrows, focus restore).
- `alt` on every `Image`. Decorative only gets `aria-hidden="true"` and an empty alt.
- Next `<Image>` always, with real `width`/`height` and a `sizes` string. No bare `<img>`.
- Touch targets 44px and up. `.tgl`, `.lb-x`, `.lb-nav button` are already at 34-42px with
  padding; do not go smaller.
- `npm run typecheck` and `npm run lint` clean before done.
</content>
</invoke>
