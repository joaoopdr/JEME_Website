'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HERO_CONFIG as C } from './config';

/**
 * HeroIntro
 *
 * Scroll-driven sequence:
 *   1. Full-screen team photo (subtly scales as you scroll)
 *   2. Radial vignette builds a spotlight around the logo
 *   3. Logo zooms into the M mark; red fills the screen
 *   4. First content section fades up over the red background
 *
 * Layer stack (bottom → top):
 *   1.  Team photograph — scroll-driven scale + static x/y offset
 *   2.  Radial vignette — scroll-animated spotlight
 *   3.  Brand-red fill — scroll-animated
 *   4.  Logo (outer positioning div)
 *         └── motion.div — scale + opacity + transformOrigin (all copies share)
 *               ├── A: far shadow     — brightness(0), blur 28px, offset (+4px, +14px)
 *               ├── B: contact shadow — brightness(0), blur 3px,  offset (+2px, +8px)
 *               ├── C: main logo      — relative (sizes container), brightness boost
 *               └── D: highlight      — brightness(3), blur 6px,   offset (-2px, -6px)
 *   5.  Content reveal — opacity + y
 *
 * Depth approach: copies A and B are offset far enough below+right that their
 * dark shapes extend visibly past the main logo's lower-right edges.
 * Copy D offset up+left creates a contrasting lit edge on the opposite side.
 * Light direction reads as coming from upper-left.
 */
export default function HeroIntro() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // ── Scrollbar hide/show ───────────────────────────────────────────────────
  // Calls applyScrollbarState immediately on mount (before any scroll fires)
  // to ensure the correct state is set on first render/refresh.
  useEffect(() => {
    const applyScrollbarState = (value: number) => {
      const hide = value < C.contentRevealRange[0];
      document.documentElement.classList.toggle('intro-scrollbar-hidden', hide);
      document.body.classList.toggle('intro-scrollbar-hidden', hide);
    };

    applyScrollbarState(scrollYProgress.get()); // immediate on mount
    const unsubscribe = scrollYProgress.on('change', applyScrollbarState);

    return () => {
      unsubscribe();
      document.documentElement.classList.remove('intro-scrollbar-hidden');
      document.body.classList.remove('intro-scrollbar-hidden');
    };
  }, [scrollYProgress]);

  // ── Derived motion values ─────────────────────────────────────────────────

  const vignetteOpacity = useTransform(
    scrollYProgress,
    C.imageDimRange,
    [0, C.imageDimMaxOpacity],
  );

  const redOpacity   = useTransform(scrollYProgress, C.redFadeRange,    [0, 1]);
  const imageScale   = useTransform(scrollYProgress, C.imageScaleRange, [C.imageScaleStart, C.imageScaleMax]);

  // Piecewise non-linear scale — slow start, fast finish.
  // Input/output arrays define three segments of increasing slope.
  // See logoScaleProgress / logoScaleOutput in config.ts to tune.
  const logoScale   = useTransform(scrollYProgress, C.logoScaleProgress, C.logoScaleOutput);
  const logoOpacity = useTransform(scrollYProgress, C.logoFadeRange,     [1, 0]);

  // Vertical drift — logo travels upward as zoom progresses.
  // Sits on a wrapper OUTSIDE the scale element so it is not amplified by zoom.
  // '0vh' → '-Nvh': negative y = upward in CSS transform coordinates.
  // Tune: logoVerticalShiftVh (distance) and logoVerticalShiftRange (timing).
  const logoY = useTransform(
    scrollYProgress,
    C.logoVerticalShiftRange,
    ['0vh', `-${C.logoVerticalShiftVh}vh`],
  );
  const contentOpacity = useTransform(scrollYProgress, C.contentRevealRange, [0, 1]);
  const contentY       = useTransform(scrollYProgress, C.contentRevealRange, [C.contentRevealStartY, 0]);

  return (
    <div
      ref={containerRef}
      style={{ height: `${C.scrollHeightVh}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── Layer 1: Team photograph ── */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: imageScale, x: C.imageOffsetX, y: C.imageOffsetY }}
        >
          <img
            src="/images/team-hero.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center select-none pointer-events-none"
            draggable={false}
          />
        </motion.div>

        {/* ── Layer 2: Radial vignette ── */}
        {/* vignetteCenter Y must match logoMarkScreenY in config */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: vignetteOpacity,
            background: `radial-gradient(
              ellipse 80% 80% at ${C.vignetteCenter},
              rgba(0,0,0,${C.vignetteCenterOpacity}) 0%,
              rgba(0,0,0,${C.vignetteEdgeOpacity}) 100%
            )`,
          }}
        />

        {/* ── Layer 3: Brand-red fill ── */}
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-brand-primary pointer-events-none"
          style={{ opacity: redOpacity }}
        />

        {/* ── Layer 4: Logo ── */}
        {/*
          OUTER DIV: positioning only.
            top: logoMarkScreenY%  +  translateY(-logoMarkInSvgY%)
            → anchors the M mark (not the logo top/bottom) at that screen line.

          MOTION.DIV: animation carrier — scale + opacity + transformOrigin.
            All four child imgs inherit the same zoom and fade.

          CHILD IMG STACKING (DOM order = paint order):
            A — far shadow:     brightness(0) silhouette, blurred 28px, offset (+4,+14)px
                                The shadow center lands 14px below each letterform base.
                                28px blur extends the dark zone ~42px below the glyph bottom.
                                Clearly visible dark region below+right of every letterform.

            B — contact shadow: brightness(0) silhouette, blurred 3px,  offset (+2,+8)px
                                8px offset = crisp dark ledge is visibly exposed below
                                each glyph before the 3px blur softens the edge.
                                Reads as a hard cast shadow — the primary lift signal.

            C — main logo:      position:relative (sizes the container), crisp.
                                brightness/contrast boost = slightly front-lit.

            D — highlight:      brightness(3) ≈ near-white, blurred 6px, offset (-2,-6)px
                                Shifts UP and LEFT — opposite direction from the shadow.
                                Warm rim on the upper-left surfaces of the letterforms.
                                At 0.22 opacity it is clearly perceptible as a lit edge.

          The combination of shadow (lower-right) and highlight (upper-left) creates
          an unambiguous light direction that the eye reads as spatial lift.

          *** To reposition the logo: change logoMarkScreenY in config.ts ***
              Then update vignetteCenter Y to match.
        */}
        <div
          className="absolute left-0 right-0 flex justify-center pointer-events-none"
          style={{
            top:       `${C.logoMarkScreenY}%`,
            transform: `translateY(-${C.logoMarkInSvgY}%)`,
          }}
        >
          {/* Vertical drift wrapper — outside the scale element so y is not zoom-amplified */}
          <motion.div className="w-full flex justify-center" style={{ y: logoY }}>
          <motion.div
            className="relative w-[72vw] sm:w-[44vw] md:w-[32vw]"
            style={{
              scale:           logoScale,
              opacity:         logoOpacity,
              transformOrigin: `${C.logoMarkInSvgX} ${C.logoMarkInSvgY}%`,
            }}
          >

            {/* A — Far shadow: wide soft cast shadow */}
            <img
              aria-hidden
              src="/logo.svg"
              width={841}
              height={595}
              draggable={false}
              style={{
                position:  'absolute',
                inset:     0,
                width:     '100%',
                height:    '100%',
                filter:    `blur(${C.logoShadowFarBlur}px) brightness(0)`,
                opacity:   C.logoShadowFarOpacity,
                transform: `translate(${C.logoShadowFarOffsetX}px, ${C.logoShadowFarOffsetY}px)`,
              }}
            />

            {/* B — Contact shadow: tight crisp lift edge */}
            <img
              aria-hidden
              src="/logo.svg"
              width={841}
              height={595}
              draggable={false}
              style={{
                position:  'absolute',
                inset:     0,
                width:     '100%',
                height:    '100%',
                filter:    `blur(${C.logoShadowContactBlur}px) brightness(0)`,
                opacity:   C.logoShadowContactOpacity,
                transform: `translate(${C.logoShadowContactOffsetX}px, ${C.logoShadowContactOffsetY}px)`,
              }}
            />

            {/* C — Main logo: crisp, slightly front-lit */}
            <img
              src="/logo.svg"
              alt="JEME"
              width={841}
              height={595}
              draggable={false}
              className="relative w-full h-auto"
              style={{
                filter: `brightness(${C.logoBrightness}) contrast(${C.logoContrast})`,
              }}
            />

            {/* D — Highlight: warm rim on upper-left surfaces */}
            <img
              aria-hidden
              src="/logo.svg"
              width={841}
              height={595}
              draggable={false}
              style={{
                position:  'absolute',
                inset:     0,
                width:     '100%',
                height:    '100%',
                filter:    `blur(${C.logoHighlightBlur}px) brightness(3)`,
                opacity:   C.logoHighlightOpacity,
                transform: `translate(${C.logoHighlightOffsetX}px, ${C.logoHighlightOffsetY}px)`,
              }}
            />

          </motion.div>
          </motion.div>
        </div>

        {/* ── Layer 5: Content reveal ── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          <div className="max-w-2xl w-full text-center text-white">
            <p className="text-[0.6875rem] font-semibold tracking-[0.22em] uppercase mb-8 text-white/60">
              Strategy &middot; Transformation &middot; Growth
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-[3.25rem] font-light leading-[1.18] tracking-tight mb-8">
              Shaping the future
              <br />
              of your business
            </h2>
            <p className="text-base sm:text-lg text-white/75 leading-relaxed max-w-prose mx-auto">
              We partner with forward-thinking organizations to design and
              execute transformations that create lasting competitive advantage.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
