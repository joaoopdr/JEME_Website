'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HERO_CONFIG as C } from './config';

/**
 * HeroIntro
 *
 * Scroll-driven sequence:
 *   1. Full-screen team photo — logo starts tilted forward (ground-plane perspective)
 *   2. As user scrolls, logo straightens to upright; radial vignette builds
 *   3. Logo zooms into the M mark; red fills the screen
 *   4. First content section fades up over the red background
 *
 * Layer stack (bottom → top):
 *   1.  Team photograph — Next.js Image (optimized, priority loaded), scroll-driven scale
 *   2.  Radial vignette — scroll-animated spotlight (starts at partial opacity for contrast)
 *   3.  Brand-red fill — scroll-animated
 *   4.  Logo (outer positioning div + perspective context)
 *         └── motion.div — rotateX (tilt → upright)
 *               └── motion.div — y (vertical drift, outside scale)
 *                     └── motion.div — scale + opacity + transformOrigin
 *                           ├── A: far shadow
 *                           ├── B: contact shadow
 *                           ├── C: main logo
 *                           └── D: highlight
 *   5.  Content reveal — opacity + y
 */
export default function HeroIntro() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // ── Scrollbar hide/show ───────────────────────────────────────────────────
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

  // Vignette starts at imageDimInitialOpacity (not 0) so the logo has contrast
  // against the raw photo before the user scrolls.
  const vignetteOpacity = useTransform(
    scrollYProgress,
    C.imageDimRange,
    [C.imageDimInitialOpacity, C.imageDimMaxOpacity],
  );

  const redOpacity = useTransform(scrollYProgress, C.redFadeRange,    [0, 1]);
  const imageScale = useTransform(scrollYProgress, C.imageScaleRange, [C.imageScaleStart, C.imageScaleMax]);

  // Piecewise non-linear scale — slow start, fast finish.
  const logoScale   = useTransform(scrollYProgress, C.logoScaleProgress, C.logoScaleOutput);
  const logoOpacity = useTransform(scrollYProgress, C.logoFadeRange,     [1, 0]);

  // Vertical drift — on a wrapper outside the scale element so y is not zoom-amplified.
  const logoY = useTransform(
    scrollYProgress,
    C.logoVerticalShiftProgress,
    C.logoVerticalShiftOutput,
  );

  // Perspective tilt — logo starts lying forward, straightens as user scrolls.
  // Framer Motion clamps by default: stays at 0deg once logoStraightenRange[1] is reached.
  const logoRotateX = useTransform(
    scrollYProgress,
    C.logoStraightenRange,
    [C.logoInitialRotateX, 0],
  );

  const contentOpacity = useTransform(scrollYProgress, C.contentRevealRange, [0, 1]);
  const contentY       = useTransform(scrollYProgress, C.contentRevealRange, [C.contentRevealStartY, 0]);

  return (
    // bg-black: prevents white overscroll flash when pulling upward past the top
    // of the page (e.g. Mac elastic scroll / iOS rubber-band).
    <div
      ref={containerRef}
      style={{ height: `${C.scrollHeightVh}vh` }}
      className="relative bg-black"
    >
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── Layer 1: Team photograph ── */}
        {/*
          Next.js Image with fill + priority:
          - priority: adds <link rel="preload"> in <head> and sets loading="eager"
          - Hero images must NOT be lazy-loaded; they are above the fold.
          - fill: renders position:absolute inset:0, fills the motion.div container.
          - sizes="100vw": tells the browser this is always full-viewport-width,
            enabling optimal srcset selection across breakpoints.
          The motion.div parent has position:absolute, satisfying Image fill's
          requirement for a non-static positioned container.
        */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: imageScale, x: C.imageOffsetX, y: C.imageOffsetY }}
        >
          <Image
            src="/images/team-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="select-none pointer-events-none"
            style={{ objectFit: 'cover', objectPosition: C.imageObjectPosition }}
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
          Outer div: screen positioning.
            top: logoMarkScreenY%  +  translateY(-logoMarkInSvgY%)
            perspective: logoPerspective — creates 3D context for child rotateX.

          rotateX wrapper: logo starts tilted forward (as if lying on the ground).
            Straightens to 0deg by logoStraightenRange[1]. Framer Motion clamps
            automatically — stays upright for the rest of the interaction.

          y wrapper: vertical drift — OUTSIDE the scale element so y is not
            amplified by the zoom factor.

          Scale div: animation carrier — scale + opacity + transformOrigin.
            All four child imgs share the same zoom and fade.

          *** To reposition the logo: change logoMarkScreenY in config.ts ***
              Then update vignetteCenter Y to match.
          *** To adjust tilt: change logoInitialRotateX / logoStraightenRange ***
        */}
        <div
          className="absolute left-0 right-0 flex justify-center pointer-events-none"
          style={{
            top:         `${C.logoMarkScreenY}%`,
            transform:   `translateY(-${C.logoMarkInSvgY}%)`,
            perspective: `${C.logoPerspective}px`,
          }}
        >
          {/* Perspective tilt — logo rises from ground plane to upright */}
          <motion.div
            className="w-full flex justify-center"
            style={{ rotateX: logoRotateX }}
          >
            {/* Vertical drift wrapper — outside scale so y is not zoom-amplified */}
            <motion.div className="w-full flex justify-center" style={{ y: logoY }}>
              <motion.div
                className="relative w-[72vw] sm:w-[44vw] md:w-[32vw]"
                style={{
                  scale:           logoScale,
                  opacity:         logoOpacity,
                  transformOrigin: `${C.logoMarkInSvgX} ${C.logoMarkInSvgY}%`,
                }}
              >

                {/* A — Far shadow: soft atmospheric grounding */}
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

                {/* B — Contact shadow: tight lift edge */}
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
