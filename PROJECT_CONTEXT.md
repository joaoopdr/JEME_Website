# JEME Website — Project Context

> Read this file before starting any task. Update it after significant changes.

---

## Project Purpose

Public-facing website for JEME, a consulting firm. The site should communicate
premium positioning, strategic confidence, and visual restraint. The homepage
leads with a cinematic scroll-driven intro sequence.

---

## Stack

| Layer       | Choice                         |
|-------------|--------------------------------|
| Framework   | Next.js 15 (App Router)        |
| Language    | TypeScript (strict)            |
| Styling     | Tailwind CSS 3                 |
| Animation   | Framer Motion 11               |
| Font        | Inter (via `next/font/google`) |

---

## Brand Colours

| Token              | Hex       | Usage                        |
|--------------------|-----------|------------------------------|
| `brand-primary`    | `#C21A27` | Red fills, CTAs              |
| `brand-muted`      | `#615F59` | Body copy, secondary text    |
| `brand-danger`     | `#790E17` | Dark red, hover states       |
| `brand-text`       | `#1D1D1B` | Primary text                 |

---

## Asset Locations

| Asset        | Source file (root)                                        | Deployed path           |
|--------------|-----------------------------------------------------------|-------------------------|
| Team photo   | `MB__7947.jpg`                                            | `/public/images/team-hero.jpg` |
| Logo SVG     | `LOGO_JEME_cmyk...svg`                                    | `/public/logo.svg`      |

The SVG viewBox is `0 0 841.89 595.28`. The M mark is centred at approximately
**58 % from the left, 45 % from the top** of the viewBox — used as the zoom
transform-origin so the M stays anchored as the logo scales up.

---

## Implemented: Homepage Intro Sequence

### Component: `src/components/HeroIntro/index.tsx`

A scroll-progress-driven component built around a **sticky inner viewport**
inside a tall outer spacer div.

**Layer stack (bottom → top) — v7:**
1.  Team photograph — Next.js `<Image fill priority sizes="100vw">`, scroll-driven scale
2.  Radial vignette — spotlight, scroll-animated; starts at partial opacity (contrast)
3.  Brand-red fill — scroll-animated
4.  Logo (outer positioning div + `perspective` CSS context)
      └── motion.div — `rotateX` (tilt → upright over first 20% of scroll)
            └── motion.div — `y` (vertical drift, outside scale)
                  └── motion.div — scale + opacity + transformOrigin (zoom)
                        ├── A: far shadow
                        ├── B: contact shadow
                        ├── C: main logo
                        └── D: highlight
5.  Content reveal (opacity + y)

### Config: `src/components/HeroIntro/config.ts`

#### Logo height / position
```ts
logoMarkScreenY:   65   // % from viewport TOP — also update vignetteCenter Y
```

#### Logo initial perspective tilt
```ts
logoInitialRotateX:  28    // degrees — 0 disables tilt entirely
logoPerspective:     900   // px — increase for flatter look, decrease for deeper
logoStraightenRange: [0, 0.20]  // scroll range over which tilt resolves to 0deg
```

#### Shadow subtlety
```ts
// Far shadow (soft grounding)
logoShadowFarOffsetX:   2    // px right
logoShadowFarOffsetY:   5    // px down  → more direction: 8–10
logoShadowFarBlur:     12    // px       → wider: 20 | tighter: 6
logoShadowFarOpacity: 0.30   // → stronger: 0.55 | disable: 0

// Contact shadow (tight lift cue)
logoShadowContactOffsetX:   1   // px
logoShadowContactOffsetY:   3   // px  → more lift: 6–8
logoShadowContactBlur:      2   // px  → sharper: 1 | softer: 5
logoShadowContactOpacity: 0.45  // → stronger: 0.70
```

#### Initial contrast (vignette at scroll=0)
```ts
imageDimInitialOpacity: 0.25   // → stronger contrast: 0.40 | disable: 0
```

#### Hero image quality / loading
```ts
// In index.tsx: <Image fill priority sizes="100vw" />
// priority = eager load + preload link in <head>. Never use lazy on hero images.
// sizes="100vw" = full-width srcset selection across breakpoints.
```

---

## Image Optimization Decision

**Hero images must NOT be lazy-loaded.** The hero photo is above the fold and
visible the instant the page loads. Lazy loading would produce a blank or
placeholder state visible to the user before the image appears — exactly the
opposite of desired behavior.

**What was implemented:**
- `<img>` replaced with Next.js `<Image fill priority sizes="100vw">`
- `priority` adds `<link rel="preload">` in `<head>` and sets `loading="eager"`
- `fill` + `sizes="100vw"` enables responsive srcset — Next.js serves WebP/AVIF
  at the appropriate breakpoint width automatically
- No `next.config.ts` changes needed for local `/public` assets
- The `motion.div` wrapper retains `position: absolute` (satisfies `fill`'s
  requirement for a non-static parent)

---

## White Gap Fix (v7)

**Cause:** `body { background: #ffffff }` was the overscroll background color.
On Mac (elastic scroll) and iOS (rubber-band), pulling the page upward past
position 0 reveals the background of `<html>` above the page content.

**Fix:** `html { background-color: #1d1d1b }` in `globals.css`. The outer
hero container also has `className="... bg-black"` as a belt-and-suspenders
fallback. Body background remains `#ffffff` for content sections.

---

## Page Structure

```
app/page.tsx
  └── <main>
        ├── <HeroIntro />          ← scroll-driven (300 vh)
        └── <AboutSection />       ← static, red → white layout
```

`AboutSection` opens on `bg-brand-primary` to continue the red from the intro,
then transitions to white for body copy. This is placeholder content only.

---

## Refinement Priorities (Next Steps)

### High priority
1. **Logo position testing** — `logoMarkScreenY: 65` is the current value.
   Test: `50` (centre), `55`, `60`. Remember to update `vignetteCenter` Y to match.
2. **Tilt intensity** — `logoInitialRotateX: 28` is the starting point.
   Test: `15` (subtle), `35–40` (dramatic). Disable with `0`.
3. **Typography** — Consider pairing Inter with a serif (e.g. Cormorant Garamond
   or Playfair Display) for headings to elevate the premium feel.

### Medium priority
4. **Navigation** — A top nav that fades in after the intro; should appear fixed
   once the hero section scrolls past.
5. **Content section copy** — Replace placeholder with real copy; consider a CTA
   button in the content reveal layer.
6. **Logo position on mobile** — The logo is 72vw on mobile; M mark may land
   differently than on desktop. May need responsive `logoMarkScreenY` adjustments.
7. **Image focal point** — Confirm `object-position` and `imageOffsetX/Y` once
   the preferred photo composition is decided.

### Lower priority
8. **Performance** — The team photo is ~10 MB. Now that `next/image` is in use,
   Next.js will serve WebP/AVIF automatically in production. Still, export a
   source image ≤300 KB at 2× density for fastest initial delivery.
9. **Accessibility** — Add `aria-label` to the hero section; update logo `alt`
   text for appropriate screen-reader context.
10. **Additional sections** — Services, case studies, contact — build as new
    components in `src/components/sections/`.
