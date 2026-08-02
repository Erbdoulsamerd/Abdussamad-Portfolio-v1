# Token and class inventory

Everything here is declared in `app/globals.css`. This file is a lookup table, not a second
source of truth. If the two disagree, `globals.css` wins and this file needs updating.

---

## Palette (raw, never referenced directly by components)

| Token | Value | Note |
|---|---|---|
| `--c-ink` | `#0B0B0C` | archive canvas |
| `--c-ink-2` | `#121214` | |
| `--c-ink-3` | `#1A1A1D` | |
| `--c-ink-4` | `#232327` | |
| `--c-paper` | `#EFEBE3` | paper canvas |
| `--c-paper-2` | `#E4DFD5` | |
| `--c-paper-3` | `#D6D0C4` | |
| `--c-signal` | `#D8402F` | documentary red, the sitewide accent |
| `--c-amber` | `#F2A03D` | Gidan Kasa |
| `--c-lime` | `#D4FF3F` | acid accent, sparing |
| `--c-clay` | `#B5714E` | `.mark-stage` backdrop |
| `--c-moss` | `#2E3120` | |

## Semantic (what components consume)

| Token | `archive` (dark, default) | `paper` (light) |
|---|---|---|
| `--bg` | `--c-ink` | `--c-paper` |
| `--bg-raised` | `--c-ink-2` | `#F6F3ED` |
| `--bg-inset` | `#080809` | `--c-paper-2` |
| `--bg-plate` | `--c-ink-3` | `#FFFDF9` |
| `--fg` | `#F1EEE8` | `#131315` |
| `--fg-2` | `#9C978D` | `#5C574E` |
| `--fg-3` | `#66625B` | `#8D877C` |
| `--rule` | `rgba(241,238,232,.13)` | `rgba(19,19,21,.16)` |
| `--rule-2` | `rgba(241,238,232,.28)` | `rgba(19,19,21,.34)` |
| `--accent` | `--c-signal` | inherited |
| `--accent-fg` | `#FFF` | inherited |
| `--grain-a` | `.055` | `.04` |
| `--img-filter` | `none` | `contrast(1.02) saturate(.98)` |
| `--scheme` | `dark` | `light` |

Case studies override `--accent` / `--accent-fg` on `.cs` from `--proj-accent` /
`--proj-accent-fg`, which `app/work/[slug]/page.tsx` sets inline from the project record.

## Type

| Token | Value |
|---|---|
| `--f-display` | `"SkyBoxed Display", "Helvetica Neue", Helvetica, Arial, sans-serif` |
| `--f-body` | `"Helvetica Neue", Helvetica, "Arial Nova", Arial, sans-serif` |
| `--f-label` | same as body |
| `--t-mega` | `clamp(2.7rem, 12vw, 13rem)` |
| `--t-xl` | `clamp(2.4rem, 6.6vw, 5.8rem)` |
| `--t-l` | `clamp(2rem, 4.6vw, 3.9rem)` |
| `--t-m` | `clamp(1.4rem, 2.5vw, 2.15rem)` |
| `--t-s` | `clamp(1.05rem, 1.5vw, 1.32rem)` |
| `--t-body` | `clamp(.95rem, 1.05vw, 1.06rem)` |
| `--t-micro` | `.72rem` |

`SkyBoxed Display` is loaded via `@font-face` from `/fonts/SkyBoxedDisplay.woff2` with an
`.otf` fallback, `font-display: swap`, single weight 400.

## Space and motion

| Token | Value |
|---|---|
| `--gut` | `clamp(18px, 4vw, 52px)` |
| `--pad-y` | `clamp(72px, 11vw, 168px)` |
| `--maxw` | `1560px` |
| `--e-out` | `cubic-bezier(.16,1,.3,1)` |
| `--e-io` | `cubic-bezier(.65,.05,.36,1)` |
| `--d-fast` | `.22s` |
| `--d-base` | `.45s` |
| `--d-slow` | `.9s` |

---

## Class inventory

### Layout
`.wrap` `.sec` `.rule-t` `.grid12`

### Type
`.mega` `.xl` `.lg` `.md` `.lead` `.body-2` `.serif-it` `.mono` `.mono-s` `.accent` `.fg2`
`.eyebrow` (flex row with trailing hairline; `<b>` inside is accent-coloured)

### Chrome
`.grain` `.pre` / `.pre-inner` / `.pre-num` / `.pre-pct` / `.pre-bar`
`.cursor` / `.cursor.woke` / `.cursor.is-big` / `.cursor-lbl`
`.hdr` / `.hdr.stuck` / `.hdr.hide` `.brand` `.nav` `.hdr-r` `.clock` `.tgl` `.burger`
`.drawer` / `.drawer.on` `.prog` `.skip` `.sr` `.noscroll` `.halftone`

Cursor labels come from a `data-cursor="..."` attribute on any element;
`components/Chrome.tsx` reads it on pointer move and enlarges the dot.

### Actions
`.btn` (pill, wipe-up fill on hover) · `.btn.solid` (accent fill, inverts on hover)
`.ulink` (background-size underline grow) · `.ulink.is-pending` (no destination yet)
`.seg` / `.seg button[aria-selected]` (segmented control)

### Reveal
`[data-rv]` + `.in`, with `[data-d="1..6"]` staggering at 70ms steps
`.clipr` / `.clipr.in` (curtain plus defocus push-in)
`.img-in` (lift and pull focus, for images that must not be clipped)
`.linemask > i` (line slides up out of the mask; auto-staggers to the 4th line)

### Home
`.hero` `.hero-mark` `.hero-portrait` `.hero-drag` `.hero-sub` `.hero-bg`
`.marq` / `.marq-t` / `.marq.rev` (skews off a `--scroll-v` custom property)
`.idx` with `data-view="list|grid|columns"` · `.idx-bar` `.idx-item` `.idx-no` `.idx-ttl`
`.idx-meta` `.idx-thumb` `.idx-yr` `.idx-float` (fine-pointer hover preview)

### Case study
`.cs` (accent scope) `.cs-hero` `.cs-hero-img` `.cs-title` `.cs-meta` `.cs-sec`
`.cs-2col` / `.cs-2col.wide-r` `.chap` / `.chap-in` (sticky scrollspy nav)
`.sw-grid` / `.sw` (click-to-copy swatches) `.cmp` / `.cmp-top` / `.cmp-handle` / `.cmp-lbl`
`.gal` + `.g-4|6|8|12` + `.ar-43|34|169|11` `.lb` (lightbox) `.mark-stage` `.note` `.pull`
`.nxt` `.nextp` / `.nextp-ttl` / `.nextp-bar`

### About
`.ab-hero` `.ab-sec` `.ab-split` `.phil` `.prac` `.tl` `.cv` (`.yr` `.org` `.role`)
`.collage` / `.snap` `.ph` (labelled placeholder for missing artwork)
`.curio` `.cstack` / `.cstack.live` / `.cstack-stage` / `.cstack-deck` / `.cstack-card`

`.cstack` is a static pinboard by default and becomes a scroll-pinned dealt deck once
`CurioStack.tsx` adds `.live`. The static form is what no-JS and reduced-motion get.

### Work listing
`.work-hero`

### Footer
`.ftr` `.ftr-cta` `.ftr-grid` `.ftr-col` `.ftr-btm`

---

## Things that already exist, so do not rebuild them

- Scroll subscription: `subscribe()` in `components/Motion.tsx`, one rAF per frame, bound to
  Lenis with a native scroll/resize fallback.
- Smooth scroll and programmatic jumps: `getLenis()` / `scrollToTarget()` in
  `components/SmoothScroll.tsx`.
- Theme boot and persistence: `ThemeScript` / `ThemeToggle` in `components/Chrome.tsx`.
- Preloader suppression within a session: `PreloadScript` sets `html.preloaded`.
- Lightbox with keyboard nav and focus restore: `Gallery` in `components/CaseParts.tsx`.
</content>
</invoke>
