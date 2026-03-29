/**
 * HeroIntro animation configuration.
 *
 * All scroll progress values are normalized 0–1, where:
 *   0 = top of the hero section reaches the top of the viewport
 *   1 = bottom of the hero section reaches the bottom of the viewport
 *
 * Adjust these values to tune the feel without touching component logic.
 */
export const HERO_CONFIG = {
  // ─── Scroll ────────────────────────────────────────────────────────────────
  // Total height of the scroll section (in vh). The sticky inner viewport is
  // always 100vh, so (scrollHeightVh - 100) vh is the actual scroll distance.
  scrollHeightVh: 300,

  // ─── Logo positioning ──────────────────────────────────────────────────────
  // Where the M mark should sit on screen, as % from the TOP of the viewport.
  // 75% = 25% from the bottom = lower quarter of the screen.
  // → To push logo even lower: increase toward 82–85.
  logoMarkScreenY: 75,

  // Where the M mark sits within the SVG viewBox, as % from the TOP of the SVG.
  // SVG viewBox: 0 0 841.89 595.28. M mark center ≈ y 268 → 268 / 595.28 ≈ 45%.
  // This value drives BOTH the CSS translateY positioning AND the transformOrigin Y.
  // → Adjust only if the SVG asset changes.
  logoMarkInSvgY: 45,

  // Horizontal position of the M mark within the SVG, as % from the LEFT.
  // Used as transformOrigin X — keeps the M stationary during scale.
  // → Adjust only if the SVG asset changes.
  logoMarkInSvgX: '58%',

  // ─── Logo zoom ─────────────────────────────────────────────────────────────
  // Maximum scale at the end of the zoom phase.
  // At 18×, the M mark roughly fills the screen width on a 32vw initial logo.
  // → For more immersive zoom: increase toward 22–26.
  // → For subtler effect: decrease toward 12–14.
  logoMaxScale: 18,

  // Logo scales from 1× to logoMaxScale over this progress range.
  logoScaleRange: [0, 0.65] as [number, number],
  // Logo fades out as the red field takes over — avoids a hard edge.
  logoFadeRange: [0.45, 0.65] as [number, number],

  // ─── Compositing: vignette ─────────────────────────────────────────────────
  // Center of the spotlight vignette, matching the M mark's screen position.
  // Horizontal: M is at 58% of logo width, logo is centred → ~54% from left.
  // Vertical: matches logoMarkScreenY.
  // → If the logo feels off-centre in the vignette, nudge the horizontal value.
  vignetteCenter: '54% 75%',

  // How dark the outer edges of the vignette get (0–1).
  // → For stronger spotlight contrast: increase toward 0.92.
  // → For a more open, airy feel: decrease toward 0.70.
  vignetteEdgeOpacity: 0.85,

  // Minimal residual darkening at the vignette's bright centre.
  // Keeps the logo area just slightly dimmed so colours read well against
  // bright photo areas.
  vignetteCenterOpacity: 0.10,

  // The vignette fades in over this progress range (same timing as old dim overlay).
  imageDimRange: [0, 0.55] as [number, number],
  // Peak opacity of the vignette layer (1.0 = fully rendered as defined in gradient).
  imageDimMaxOpacity: 1.0,

  // ─── Compositing: ambient shadow ───────────────────────────────────────────
  // A static radial gradient under the logo, present from scroll = 0.
  // Grounds the logo in the photograph without animating — creates local depth.
  // → For stronger grounding: increase logoShadowOpacity toward 0.60.
  // → For a smaller shadow halo: reduce logoShadowSize values.
  logoShadowSize:    '45% 32%', // ellipse width and height relative to viewport
  logoShadowOpacity: 0.42,

  // ─── Compositing: drop-shadow on logo wrapper ──────────────────────────────
  // Applied via CSS filter on the outer (non-animated) logo wrapper.
  // Follows the SVG's alpha channel — no rectangular box shadow.
  // Does NOT scale with the logo (it stays anchored to the wrapper).
  // → For a more visible depth cue: increase logoDropShadowOpacity toward 0.45.
  // → For a tighter shadow: decrease logoDropShadowBlur toward 14.
  logoDropShadowBlur:    28,   // px
  logoDropShadowOpacity: 0.28, // 0–1

  // ─── Compositing: subtle photo scale ───────────────────────────────────────
  // The background photo very gently zooms during the logo zoom phase.
  // Subliminal parallax — makes the transition feel more cinematic.
  // → For more obvious depth: increase imageScaleMax toward 1.10.
  // → To disable: set imageScaleMax to 1.0.
  imageScaleRange: [0, 0.65] as [number, number],
  imageScaleMax:   1.06,

  // ─── Red fill ──────────────────────────────────────────────────────────────
  // Brand-red overlay fades from 0 → 1 over this range.
  redFadeRange: [0.4, 0.7] as [number, number],

  // ─── Content reveal ────────────────────────────────────────────────────────
  contentRevealRange:  [0.72, 1.0] as [number, number],
  contentRevealStartY: 60, // px below final position at start of reveal
} as const;
