'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { HERO_CONFIG as C } from './config';

/**
 * HeroIntro
 *
 * Scroll-driven sequence:
 *   1. Full-screen team photo with logo overlay
 *   2. Logo zooms into the M mark as the user scrolls
 *   3. Radial vignette dims surrounding areas; photo subtly scales
 *   4. Brand red fills the screen; logo fades out
 *   5. First content section fades up over the red background
 *
 * Layer stack (bottom → top):
 *   1. Team photo (subtly scales during zoom)
 *   2a. Static ambient shadow  — grounds logo in the scene from scroll = 0
 *   2b. Radial vignette overlay — cinematic spotlight, animated by scroll
 *   3. Brand-red fill
 *   4. Logo (with drop-shadow filter on wrapper, scale + opacity animated)
 *   5. Content reveal
 */
export default function HeroIntro() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Radial vignette (replaces the old flat black dim)
  const vignetteOpacity = useTransform(
    scrollYProgress,
    C.imageDimRange,
    [0, C.imageDimMaxOpacity],
  );

  // Brand-red fill
  const redOpacity = useTransform(scrollYProgress, C.redFadeRange, [0, 1]);

  // Subtle photo zoom — subliminal cinematic depth during logo zoom
  const imageScale = useTransform(
    scrollYProgress,
    C.imageScaleRange,
    [1, C.imageScaleMax],
  );

  // Logo scale — zooms into the M mark
  const logoScale = useTransform(
    scrollYProgress,
    C.logoScaleRange,
    [1, C.logoMaxScale],
  );

  // Logo fades out as red takes over
  const logoOpacity = useTransform(scrollYProgress, C.logoFadeRange, [1, 0]);

  // Content reveal — fades up over red background
  const contentOpacity = useTransform(
    scrollYProgress,
    C.contentRevealRange,
    [0, 1],
  );
  const contentY = useTransform(
    scrollYProgress,
    C.contentRevealRange,
    [C.contentRevealStartY, 0],
  );

  return (
    // Outer scroll spacer — its height determines total scroll distance
    <div
      ref={containerRef}
      style={{ height: `${C.scrollHeightVh}vh` }}
      className="relative"
    >
      {/* Sticky viewport — visually fixed while outer div scrolls past */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── Layer 1: Team photograph ── */}
        {/*
          Wrapped in a motion.div so the subtle scale (imageScaleMax = 1.06)
          can be applied without touching the Next.js Image component directly.
          overflow-hidden on the parent sticky div clips the slight overshoot.
        */}
        <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
          <Image
            src="/images/team-hero.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </motion.div>

        {/* ── Layer 2a: Static ambient shadow ── */}
        {/*
          Always present — no animation. A radial dark pool centred on the
          M mark position softens the photo underneath the logo from the very
          first frame, making the logo feel lit by the scene rather than
          pasted on top of it.
          → Tune: logoShadowOpacity, logoShadowSize in config.ts
        */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(
              ellipse ${C.logoShadowSize} at ${C.vignetteCenter},
              rgba(0,0,0,${C.logoShadowOpacity}) 0%,
              transparent 100%
            )`,
          }}
        />

        {/* ── Layer 2b: Radial vignette (animated) ── */}
        {/*
          Replaces the previous flat black overlay. Dark at the edges,
          minimal at the vignette centre — creates a natural spotlight on the
          logo area rather than a uniform curtain. Fades in with scroll.
          → Tune: vignetteEdgeOpacity, vignetteCenterOpacity, imageDimRange
        */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
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
          className="absolute inset-0 bg-brand-primary"
          style={{ opacity: redOpacity }}
        />

        {/* ── Layer 4: Logo ── */}
        {/*
          Two-element structure keeps positioning logic separate from animation:

          OUTER DIV — positioning only (plain CSS, no Framer Motion):
            top: logoMarkScreenY%         places the div's top edge at that point
            translateY(-logoMarkInSvgY%)  shifts it up by logoMarkInSvgY% of its
                                          own height, so the M mark (which sits
                                          logoMarkInSvgY% down from the logo top)
                                          aligns exactly with the target Y.
            filter: drop-shadow(...)      subtle ambient depth; follows the SVG
                                          alpha channel and does NOT scale with
                                          the logo (stays fixed on the wrapper).

          INNER MOTION.DIV — animation only:
            scale            zooms 1× → logoMaxScale
            opacity          fades out as red fills the screen
            transformOrigin  anchored to the M mark (logoMarkInSvgX, logoMarkInSvgY%)
                             so the M stays stationary during the scale-up
        */}
        <div
          className="absolute left-0 right-0 flex justify-center pointer-events-none"
          style={{
            top: `${C.logoMarkScreenY}%`,
            // Shift up so the M mark (logoMarkInSvgY% from logo top) lands on
            // the logoMarkScreenY% screen line, not the logo's top edge.
            transform: `translateY(-${C.logoMarkInSvgY}%)`,
            filter: `drop-shadow(0 2px ${C.logoDropShadowBlur}px rgba(0,0,0,${C.logoDropShadowOpacity}))`,
          }}
        >
          <motion.div
            className="w-[72vw] sm:w-[44vw] md:w-[32vw]"
            style={{
              scale: logoScale,
              opacity: logoOpacity,
              transformOrigin: `${C.logoMarkInSvgX} ${C.logoMarkInSvgY}%`,
            }}
          >
            {/*
              Plain <img> for the SVG: Next.js image optimisation has no benefit
              for vector files and can cause format-conversion edge cases.
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="JEME"
              width={841}
              height={595}
              className="w-full h-auto"
            />
          </motion.div>
        </div>

        {/* ── Layer 5: Content reveal ── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          <div className="max-w-2xl w-full text-center text-white">

            {/* Eyebrow */}
            <p className="text-[0.6875rem] font-semibold tracking-[0.22em] uppercase mb-8 text-white/60">
              Strategy &middot; Transformation &middot; Growth
            </p>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl md:text-[3.25rem] font-light leading-[1.18] tracking-tight mb-8">
              Shaping the future
              <br />
              of your business
            </h2>

            {/* Supporting paragraph */}
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
