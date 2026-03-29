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

**Layer stack (bottom → top):**
1. Team photograph — subtle zoom (1.0 → 1.06) during scroll for cinematic depth
2a. Static ambient shadow — radial gradient always present, grounds logo in scene
2b. Radial vignette overlay — dark edges / lighter centre, animated by scroll
3. Brand-red fill overlay (fades in to solid red)
4. Logo (scales up toward M, then fades out; drop-shadow filter on wrapper)
5. First content section (eyebrow + headline + paragraph, fades up over red)

**Scroll phases (progress 0 → 1):**

| Phase             | Range      | What happens                                         |
|-------------------|------------|------------------------------------------------------|
| Vignette in       | 0 → 0.55   | Radial vignette fades to full; edges darken, centre stays light |
| Red fill begin    | 0.40       | Brand red starts fading in                           |
| Logo zoom         | 0 → 0.65   | Logo scales 1× → 18×                                |
| Logo fade-out     | 0.45 → 0.65| Logo opacity drops to 0 as red fills screen          |
| Red fill complete | 0.70       | Screen is solid brand red                            |
| Content reveal    | 0.72 → 1.0 | Eyebrow + headline + paragraph fade up 60 px         |

**Logo positioning (revised v2):**
- Uses `top: logoMarkScreenY%` + `translateY(-logoMarkInSvgY%)` on the outer wrapper
- This anchors the M mark itself (not the logo baseline) to `logoMarkScreenY` = 75% from top
- Works correctly at all screen sizes since `%` translateY is relative to the element height
- Previous `bottom: 25%` anchored the logo *baseline*, placing the M mark ~47% from bottom (too high)

### Config: `src/components/HeroIntro/config.ts`

All tunable values live here. Key constants after v2 refinement:

```ts
scrollHeightVh:        300    // Total section height — controls pace
logoMarkScreenY:       75     // M mark target: % from top of viewport (75 = 25% from bottom)
logoMarkInSvgY:        45     // M mark position in SVG: % from top of viewBox
logoMarkInSvgX:        '58%'  // M mark position in SVG: % from left of viewBox
logoMaxScale:          18     // Maximum zoom factor (was 10)
vignetteCenter:        '54% 75%' // Spotlight centre — matches M mark screen position
vignetteEdgeOpacity:   0.85   // How dark the surrounding areas get
vignetteCenterOpacity: 0.10   // Minimal darkening at the logo centre
logoShadowSize:        '45% 32%' // Ambient shadow ellipse size
logoShadowOpacity:     0.42   // Ambient shadow darkness
logoDropShadowBlur:    28     // Logo drop-shadow blur radius (px)
logoDropShadowOpacity: 0.28   // Logo drop-shadow alpha
imageScaleMax:         1.06   // Max photo scale during zoom (subtle parallax)
contentRevealStartY:   60     // px the content starts below its final position
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
1. **Typography** — Consider pairing Inter with a serif (e.g. Cormorant Garamond
   or Playfair Display) for headings to elevate the premium feel.
2. **Logo position on mobile** — Test `logoMarkScreenY: 75` on real devices;
   may need a higher value (e.g. 80) on smaller screens where the logo is 72vw.
3. **Vignette tuning** — `vignetteCenter` uses a fixed `'54% 75%'` that averages
   desktop and mobile M positions. Could be made responsive via CSS custom props.
4. **Image focal point** — Confirm `object-position` on the team photo once the
   preferred crop/composition direction is decided.

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
