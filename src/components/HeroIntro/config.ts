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
  scrollHeightVh: 300,

  // ─── Logo positioning ──────────────────────────────────────────────────────
  // Where the M mark should sit on screen, as % from the TOP of the viewport.
  logoMarkScreenY: 75,

  // Approximate M position within the SVG viewBox.
  logoMarkInSvgY: 45,
  logoMarkInSvgX: '58%',

  // ─── Logo zoom ─────────────────────────────────────────────────────────────
  logoMaxScale: 18,
  logoScaleRange: [0, 0.65] as [number, number],
  logoFadeRange: [0.45, 0.65] as [number, number],

  // ─── Compositing: vignette ─────────────────────────────────────────────────
  vignetteCenter: '54% 75%',
  vignetteEdgeOpacity: 0.85,
  vignetteCenterOpacity: 0.10,
  imageDimRange: [0, 0.55] as [number, number],
  imageDimMaxOpacity: 1.0,

  // ─── Compositing: ambient shadow ───────────────────────────────────────────
  logoShadowSize: '45% 32%',
  logoShadowOpacity: 0.42,

  // ─── Compositing: drop-shadow on logo wrapper ──────────────────────────────
  logoDropShadowBlur: 28,
  logoDropShadowOpacity: 0.28,

  // ─── Background image framing ──────────────────────────────────────────────
  // Static starting zoom so there is actual crop room.
  imageScaleStart: 1.06,

  // Scroll-driven zoom continues from the starting zoom.
  imageScaleRange: [0, 0.65] as [number, number],
  imageScaleMax: 1.12,

  // Static horizontal shift for the whole image layer.
  // Positive = move image to the right, negative = move left.
  imageOffsetX: '3%',

  // Static vertical shift if you ever want it.
  imageOffsetY: '-3%',

  // ─── Red fill ──────────────────────────────────────────────────────────────
  redFadeRange: [0.4, 0.7] as [number, number],

  // ─── Content reveal ────────────────────────────────────────────────────────
  contentRevealRange: [0.72, 1.0] as [number, number],
  contentRevealStartY: 60,
} as const;