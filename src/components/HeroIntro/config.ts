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
  // The component sets top = logoMarkScreenY%, then translateY(-logoMarkInSvgY%)
  // so the M mark itself (not the logo top/bottom edge) lands on that line.
  //
  //   20 → very high, near top fifth
  //   35 → upper-mid
  //   50 → dead centre
  //   65 → lower-mid (current — higher than before for better contrast region)
  //   75 → lower quarter
  //
  // *** Also update vignetteCenter Y to match whenever this changes ***
  logoMarkScreenY: 90,

  // M mark in SVG — do not change unless the SVG asset changes.
  logoMarkInSvgY: 45,    // % from viewBox top
  logoMarkInSvgX: '50%', // % from viewBox left — use '58%' to restore M-targeting rightward drift

  // ─── Logo initial perspective tilt ─────────────────────────────────────────
  // The logo starts tilted forward (as if lying on the ground plane) and
  // straightens to upright as the user scrolls. The brand "presents itself"
  // before commanding the screen.
  //
  // Tune:
  //   → More dramatic:    logoInitialRotateX ↑ (e.g. 40)
  //   → More restrained:  logoInitialRotateX ↓ (e.g. 15)
  //   → Disable tilt:     logoInitialRotateX = 0
  //   → Straighten faster: logoStraightenRange[1] ↓ (e.g. 0.12)
  //   → Straighten slower: logoStraightenRange[1] ↑ (e.g. 0.28)
  //   → Flatter field:    logoPerspective ↑ (e.g. 1400)
  //   → Deeper field:     logoPerspective ↓ (e.g. 600)
  logoInitialRotateX:  40,                            // degrees — forward tilt at scroll=0
  logoPerspective:     900,                           // px — 3D perspective depth
  logoStraightenRange: [0, 0.40] as [number, number], // scroll range over which tilt resolves

  // ─── Logo zoom ─────────────────────────────────────────────────────────────
  // Restrained early / explosive late. The logo remains largely legible until
  // the halfway point, then zooms aggressively into the M mark.
  //
  //   progress  0.00 → 0.30 : scale  1.0 → 1.5   (very slow — bottom stays in view)
  //   progress  0.30 → 0.50 : scale  1.5 → 2.0   (building — logo still visible)
  //   progress  0.50 → 0.65 : scale  2.0 → 18    (explosive — dive into the M)
  //
  // Tune:
  //   → More restrained early:   decrease logoScaleOutput[1] (e.g. 1.3)
  //   → Earlier acceleration:    decrease logoScaleProgress[2] (e.g. 0.42)
  //   → Later acceleration:      increase logoScaleProgress[2] (e.g. 0.55)
  //   → Stronger final zoom:     increase logoScaleOutput[3] (e.g. 22)
  logoScaleProgress: [0,    0.25, 0.50, 0.65] as number[],
  logoScaleOutput:   [1,    2.5,  5,  12 ] as number[],

  logoFadeRange: [0.45, 0.65] as [number, number],

  // ─── Logo vertical drift during zoom ───────────────────────────────────────
  // Almost-even curve with a slight front-bias: the first half of the scroll
  // covers slightly more ground than the second half, so the logo doesn't
  // stay low for too long but doesn't rush either.
  //
  // With logoMarkScreenY: 90 the M mark starts near the bottom of the screen.
  //
  //   0.00 → 0.25 :   0 → -18vh  (rate: 72 vh/unit — slightly faster)
  //   0.25 → 0.50 : -18 → -32vh  (rate: 56 vh/unit — medium)
  //   0.50 → 0.65 : -32 → -40vh  (rate: 53 vh/unit — slightly slower)
  //
  // Approximate M mark screen position during scroll (logoMarkScreenY: 90):
  //   progress 0:    ~90% from top
  //   progress 0.25: ~72% from top
  //   progress 0.50: ~58% from top
  //   progress 0.65: ~50% from top (near centre)
  //
  // Tune:
  //   → More total movement:   increase magnitude of output[3] (e.g. '-48vh')
  //   → Less total movement:   decrease magnitude of output[3] (e.g. '-32vh')
  //   → Earlier slowdown:      decrease progress[2] (e.g. 0.40)
  //   → Later slowdown:        increase progress[2] (e.g. 0.55)
  //   → Stronger front-bias:   increase magnitude of output[1] (e.g. '-24vh')
  //
  // On a wrapper OUTSIDE the scale element so y is not zoom-amplified.
  logoVerticalShiftProgress: [0,     0.25,   0.50,   0.65  ] as number[],
  logoVerticalShiftOutput:   ['0vh', '-20vh', '-40vh', '-50vh'] as string[],

  // ─── Logo depth: layered shadow + highlight stack ──────────────────────────
  // Offsets are intentionally small — the effect should read as a subtle
  // grounding cue, not a detached floating shadow.
  //
  // ── Far shadow ─────────────────────────────────────────────────────────────
  //   → Stronger grounding: logoShadowFarOpacity ↑ (toward 0.55)
  //   → Wider softness:     logoShadowFarBlur ↑ (toward 20)
  //   → More directional:   logoShadowFarOffsetY ↑ (toward 10)
  //   → Disable:            logoShadowFarOpacity = 0
  logoShadowFarOffsetX: 2,    // px — rightward shift
  logoShadowFarOffsetY: 5,    // px — downward shift
  logoShadowFarBlur:    12,   // px
  logoShadowFarOpacity: 0.30, // 0–1

  // ── Contact shadow ──────────────────────────────────────────────────────────
  //   → Sharper edge:  logoShadowContactBlur ↓ (toward 1)
  //   → Stronger:      logoShadowContactOpacity ↑ (toward 0.70)
  //   → Disable:       logoShadowContactOpacity = 0
  logoShadowContactOffsetX: 1,    // px
  logoShadowContactOffsetY: 3,    // px
  logoShadowContactBlur:    2,    // px
  logoShadowContactOpacity: 0.45, // 0–1

  // ── Highlight copy ──────────────────────────────────────────────────────────
  //   → Stronger rim:  logoHighlightOpacity ↑ (toward 0.40)
  //   → Softer bloom:  logoHighlightBlur ↑ (toward 12)
  //   → Disable:       logoHighlightOpacity = 0
  logoHighlightOffsetX: -2,   // px — leftward shift
  logoHighlightOffsetY: -6,   // px — upward shift
  logoHighlightBlur:     6,   // px
  logoHighlightOpacity:  0.30, // 0–1 — slightly stronger for initial contrast

  // ── Main logo image filter ──────────────────────────────────────────────────
  logoBrightness: 1.12,
  logoContrast:   1.08,

  // ─── Compositing: radial vignette ──────────────────────────────────────────
  // vignetteCenter Y must match logoMarkScreenY.
  //
  // imageDimInitialOpacity: at scroll=0 the vignette would otherwise be fully
  // transparent, leaving the logo lost against the raw photo. A non-zero initial
  // opacity gives the logo contrast before any scrolling happens.
  //
  //   → Stronger initial contrast: imageDimInitialOpacity ↑ (toward 0.45)
  //   → No initial vignette:       imageDimInitialOpacity = 0
  vignetteCenter:         '54% 90%',  // Y matches logoMarkScreenY: 90 (logo start position)
  vignetteEdgeOpacity:    0.82,
  vignetteCenterOpacity:  0.06,
  imageDimRange:          [0, 0.55] as [number, number],
  imageDimMaxOpacity:     1.0,
  imageDimInitialOpacity: 0.25,       // opacity at scroll=0

  // ─── Background photo ──────────────────────────────────────────────────────
  // imageObjectPosition: controls which part of the photo stays in frame as
  // the viewport aspect ratio changes (normal window vs fullscreen).
  // The X value centres the composition horizontally.
  // The Y value anchors the photo toward the lower portion (ground/people area),
  // ensuring that content stays visible regardless of how tall/narrow the viewport is.
  //
  //   → More of the top:    decrease Y (e.g. '50% 50%')
  //   → More of the bottom: increase Y (e.g. '50% 85%')
  imageObjectPosition: '50% 85%', // Make the second number 70% if the non-smiling image is used
  imageScaleStart: 1,
  imageScaleRange: [0, 0.65] as [number, number],
  imageScaleMax:   1.12,
  imageOffsetX:    '0%',
  imageOffsetY:    '0%',

  // ─── Red fill ──────────────────────────────────────────────────────────────
  redFadeRange: [0.4, 0.7] as [number, number],

  // ─── Content reveal ────────────────────────────────────────────────────────
  contentRevealRange:  [0.72, 1.0] as [number, number],
  contentRevealStartY: 60,

} as const;
