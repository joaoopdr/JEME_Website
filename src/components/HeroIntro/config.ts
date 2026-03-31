/**
 * HeroIntro animation configuration.
 *
 * All scroll progress values are normalized 0–1, where:
 *   0 = top of the hero section reaches the top of the viewport
 *   1 = bottom of the hero section reaches the bottom of the viewport
 */
export const HERO_CONFIG = {

  // ─── Scroll ────────────────────────────────────────────────────────────────
  scrollHeightVh: 300,

  // ─── Logo positioning ──────────────────────────────────────────────────────
  // *** THIS IS THE VALUE TO CHANGE TO REPOSITION THE LOGO ***
  //
  // Where the M mark lands on screen, as % from the TOP of the viewport.
  // The component: sets top = logoMarkScreenY%, then translateY(-logoMarkInSvgY%)
  // so the M mark itself (not the logo top/bottom edge) lands on that line.
  //
  //   20 → very high, near top fifth
  //   35 → upper-mid
  //   50 → dead centre
  //   65 → lower-mid
  //   75 → current — lower quarter
  //
  // *** Also update vignetteCenter Y to match whenever this changes ***
  logoMarkScreenY: 75,

  // M mark in SVG — do not change unless the SVG asset changes.
  logoMarkInSvgY: 45,   // % from viewBox top
  logoMarkInSvgX: '58%', // % from viewBox left

  // ─── Logo zoom ─────────────────────────────────────────────────────────────
  logoMaxScale:   18,
  logoScaleRange: [0, 0.65]    as [number, number],
  logoFadeRange:  [0.45, 0.65] as [number, number],

  // ─── Logo depth: layered shadow + highlight stack ──────────────────────────
  //
  // Three additional SVG copies are rendered behind/above the main logo,
  // each with an independent x/y offset + blur + opacity.
  //
  // The offsets are intentionally large enough to be clearly visible —
  // they must extend past the main logo edge on the shadow side so the eye
  // reads actual positional separation, not just edge fringe.
  //
  // All values are CSS px, measured on the unscaled logo element.
  // On desktop (32vw ≈ 410px wide), 14px ≈ 3.4% of logo width — clearly
  // perceptible. The effect is strongest on the bottom-right letterform edges.
  //
  // ── Far shadow (soft cast shadow — wide atmospheric depth) ─────────────────
  // The shadow center lands logoShadowFarOffsetY px below + X px to the right
  // of the main logo. At blur 28px it extends ~28px further in all directions,
  // so the outer edge of the dark zone sits ~42px below each letterform.
  // This is the main "floating" signal.
  //
  //   → Stronger depth:  logoShadowFarOpacity ↑ (toward 0.90)
  //   → Wider spread:    logoShadowFarBlur ↑ (toward 40)
  //   → More directional: logoShadowFarOffsetY ↑ (toward 20) or X ↑ (toward 8)
  //   → Weaker:          logoShadowFarOpacity ↓ (toward 0.45)
  logoShadowFarOffsetX: 4,   // px — rightward shift (simulates light from top-left)
  logoShadowFarOffsetY: 14,  // px — downward shift
  logoShadowFarBlur:    28,  // px — blur radius
  logoShadowFarOpacity: 0.75, // 0–1

  // ── Contact shadow (tight cast shadow — establishes physical lift) ──────────
  // Small blur + strong offset = crisp dark ledge visible on the lower-right
  // edge of every letterform. The 8px Y offset means ~8px of dark shape is
  // clearly exposed below the main logo before the blur softens it.
  //
  //   → More lift:    logoShadowContactOpacity ↑ (toward 0.95)
  //   → Sharper edge: logoShadowContactBlur ↓ (toward 1)
  //   → Softer edge:  logoShadowContactBlur ↑ (toward 6)
  //   → Weaker:       logoShadowContactOpacity ↓ (toward 0.45)
  logoShadowContactOffsetX: 2,   // px
  logoShadowContactOffsetY: 8,   // px
  logoShadowContactBlur:    3,   // px
  logoShadowContactOpacity: 0.80, // 0–1

  // ── Highlight copy (rim light — top-left surfaces catch ambient light) ──────
  // Shifted slightly up and left — the opposite direction from the shadow.
  // brightness(3) makes the SVG colors near-white. At 0.22 opacity this is
  // a visible warm glow on the upper-left edges of the letterforms.
  // It pairs with the lower-right shadow to create a clear light direction.
  //
  //   → Stronger:  logoHighlightOpacity ↑ (toward 0.35)
  //   → Softer:    logoHighlightBlur ↑ (toward 12) or opacity ↓
  //   → Disable:   logoHighlightOpacity = 0
  logoHighlightOffsetX: -2,  // px — leftward shift
  logoHighlightOffsetY: -6,  // px — upward shift
  logoHighlightBlur:     6,  // px
  logoHighlightOpacity:  0.22, // 0–1

  // ── Main logo image filter ──────────────────────────────────────────────────
  // Applied only to the main crisp logo copy.
  logoBrightness: 1.08,
  logoContrast:   1.05,

  // ─── Compositing: radial vignette ──────────────────────────────────────────
  // Y in vignetteCenter must match logoMarkScreenY.
  vignetteCenter:        '54% 75%',
  vignetteEdgeOpacity:   0.82,
  vignetteCenterOpacity: 0.06,
  imageDimRange:         [0, 0.55] as [number, number],
  imageDimMaxOpacity:    1.0,

  // ─── Background photo ──────────────────────────────────────────────────────
  imageScaleStart: 1.06,
  imageScaleRange: [0, 0.65] as [number, number],
  imageScaleMax:   1.12,
  imageOffsetX:    '3%',
  imageOffsetY:    '-3%',

  // ─── Red fill ──────────────────────────────────────────────────────────────
  redFadeRange: [0.4, 0.7] as [number, number],

  // ─── Content reveal ────────────────────────────────────────────────────────
  contentRevealRange:  [0.72, 1.0] as [number, number],
  contentRevealStartY: 60,

} as const;
