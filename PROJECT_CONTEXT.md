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

**Layer stack (bottom → top) — v5:**
1.  Team photograph — static x/y offset; scroll-driven scale (1.06 → 1.12)
2.  Radial vignette — spotlight (dark edges, light centre), scroll-animated
3.  Brand-red fill — scroll-animated
4.  Logo (outer positioning div, no filter)
      └── motion.div — scale + opacity + transformOrigin (ALL copies share these)
            ├── A: far shadow img    — `blur(20px) brightness(0)` offset down, opacity 0.60
            ├── B: contact shadow img — `blur(4px) brightness(0)` offset down, opacity 0.70
            ├── C: main logo img     — `brightness(1.08) contrast(1.05)`, positions container
            └── D: highlight img    — `blur(8px) brightness(2.5)` offset up, opacity 0.14
5.  Content reveal (opacity + y)

**Why directional offsets matter (v6):** Previous copies had Y offsets of 3–6px on a logo rendered at ~410px wide. `6/410 = 1.5%` of logo width — entirely absorbed by the blur radius and photo texture noise. The shadow shape mostly hid behind the main logo. Only a narrow fringed edge was ever exposed, and it read as a CSS artifact rather than spatial depth.

**v6 approach:** Shadow offsets are 8–14px Y + 2–4px X. At 410px wide, 14px = 3.4% of width — clearly visible. More importantly, the shadow center lands 14px *below* the letterform base, and with 28px blur extending the dark zone ~42px further, there is a clearly perceptible dark region on the lower-right side of every letterform. The 8px contact shadow exposes a tight crisp ledge before blur softens it. The highlight shifted -6px up / -2px left creates a contrasting lit edge. Light direction is unambiguous.

**Logo positioning (v6):** `logoMarkScreenY: 75`, `vignetteCenter: '54% 75%'`

### Config: `src/components/HeroIntro/config.ts`

```ts
// *** LOGO POSITION ***
logoMarkScreenY:              75   // % from viewport TOP — also update vignetteCenter Y

// Shadow — far (soft cast, establishes floating presence)
logoShadowFarOffsetX:          4   // px right  → more directional: 8
logoShadowFarOffsetY:         14   // px down   → more depth: 20, 24
logoShadowFarBlur:            28   // px        → wider: 40 | tighter: 16
logoShadowFarOpacity:       0.75   // 0–1       → stronger: 0.90 | weaker: 0.45

// Shadow — contact (tight cast, primary lift signal)
logoShadowContactOffsetX:      2   // px right
logoShadowContactOffsetY:      8   // px down   → sharper lift: 10, 12
logoShadowContactBlur:         3   // px        → sharper: 1 | softer: 6
logoShadowContactOpacity:   0.80   // 0–1       → stronger: 0.95 | weaker: 0.50

// Highlight (rim light on upper-left surfaces)
logoHighlightOffsetX:         -2   // px left   → more directional: -4
logoHighlightOffsetY:         -6   // px up     → higher: -10
logoHighlightBlur:             6   // px        → softer bloom: 12
logoHighlightOpacity:       0.22   // 0–1       → stronger: 0.35 | disable: 0

logoBrightness:             1.08
logoContrast:               1.05
imageScaleMax:              1.12
```

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
1. **Logo position testing** — `logoMarkScreenY: 25` is the current starting point.
   Test other values: `20` (very high), `35` (upper-mid), `50` (centre).
   Remember to update `vignetteCenter` Y to match whenever this changes.
2. **Typography** — Consider pairing Inter with a serif (e.g. Cormorant Garamond
   or Playfair Display) for headings to elevate the premium feel.
3. **Logo position on mobile** — The logo is 72vw on mobile; M mark may land
   differently than on desktop. May need responsive `logoMarkScreenY` adjustments.
4. **Image focal point** — Confirm `object-position` and `imageOffsetX/Y` once
   the preferred photo composition is decided.

### Medium priority
5. **Navigation** — A top nav that fades in after the intro; should appear fixed
   once the hero section scrolls past.
6. **Content section copy** — Replace placeholder with real copy; consider a CTA
   button in the content reveal layer.
7. **Scroll pacing** — Adjust `scrollHeightVh` (currently 300) if the intro
   feels too slow or too rushed on different screen heights.

### Lower priority
8. **Performance** — The team photo is ~10 MB. Export a web-optimised version
   (WebP, ≤300 KB at 2× density) for production.
9. **Accessibility** — Add `aria-label` to the hero section; update logo `alt`
   text for appropriate screen-reader context.
10. **Additional sections** — Services, case studies, contact — build as new
    components in `src/components/sections/`.
