'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { HERO_CONFIG as C } from './config';

/**
 * HeroIntro
 *
 * Scroll-driven sequence (full animation):
 *   1. Team photo — logo starts tilted forward (ground-plane perspective)
 *   2. Logo straightens; radial vignette builds
 *   3. Logo zooms into the M mark; red fills the screen
 *   4. Content section fades up over the red background
 *
 * Reduced-motion fallback:
 *   A static full-screen section: photo + centred logo. No scroll behaviour.
 *
 * Layer stack (bottom → top):
 *   1.  Team photograph — Next.js Image (optimized, priority, quality 100)
 *   2.  Radial vignette — scroll-animated spotlight
 *   3.  Brand-red fill — scroll-animated
 *   4.  Logo — perspective context → rotateX → y drift → scale/opacity
 *   5.  Content reveal — opacity + y
 *
 * Image-load gating:
 *   The sticky container is opacity:0 until the photo fires onLoad, then
 *   opacity:1 with a 150 ms ease-in. This prevents the logo appearing over
 *   an unloaded background without any artificial overlay or long delay.
 */
export default function HeroIntro() {
  // Must be called unconditionally (Rules of Hooks).
  // null during SSR — treated as false (animated version until hydration).
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // ── Scrollbar hide/show ───────────────────────────────────────────────────
  useEffect(() => {
    if (prefersReducedMotion) {
      // Static mode: scrollbar always visible.
      document.documentElement.classList.remove('intro-scrollbar-hidden');
      document.body.classList.remove('intro-scrollbar-hidden');
      return;
    }

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
  }, [scrollYProgress, prefersReducedMotion]);

  // ── Derived motion values (always computed — hooks must be unconditional) ──

  const vignetteOpacity = useTransform(
    scrollYProgress,
    C.imageDimRange,
    [C.imageDimInitialOpacity, C.imageDimMaxOpacity],
  );

  const redOpacity = useTransform(scrollYProgress, C.redFadeRange,    [0, 1]);
  const imageScale = useTransform(scrollYProgress, C.imageScaleRange, [C.imageScaleStart, C.imageScaleMax]);

  const logoScale   = useTransform(scrollYProgress, C.logoScaleProgress, C.logoScaleOutput);
  const logoOpacity = useTransform(scrollYProgress, C.logoFadeRange,     [1, 0]);

  const logoY = useTransform(
    scrollYProgress,
    C.logoVerticalShiftProgress,
    C.logoVerticalShiftOutput,
  );

  const logoRotateX = useTransform(
    scrollYProgress,
    C.logoStraightenRange,
    [C.logoInitialRotateX, 0],
  );

  const contentOpacity = useTransform(scrollYProgress, C.contentRevealRange, [0, 1]);
  const contentY       = useTransform(scrollYProgress, C.contentRevealRange, [C.contentRevealStartY, 0]);

  // ── Reduced-motion static fallback ───────────────────────────────────────
  if (prefersReducedMotion) {
    return (
      <section
        aria-label="JEME hero"
        className="relative h-dvh overflow-hidden"
      >
        <Image
          src="/images/team-hero-smile.jpg"
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
          className="select-none pointer-events-none"
          style={{ objectFit: 'cover', objectPosition: C.imageObjectPosition }}
        />
        {/* Static vignette — same radial shape as the animated version */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse 80% 80% at ${C.vignetteCenter},
              rgba(0,0,0,${C.vignetteCenterOpacity}) 0%,
              rgba(0,0,0,0.72) 100%
            )`,
          }}
        />
        {/* Centred logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="JEME"
            width={841}
            height={595}
            className="w-[72vw] sm:w-[44vw] md:w-[32vw]"
            style={{ filter: `brightness(${C.logoBrightness}) contrast(${C.logoContrast})` }}
          />
        </div>
      </section>
    );
  }

  // ── Full scroll-driven animation ──────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      style={{ height: `${C.scrollHeightVh}vh` }}
      className="relative bg-black"
    >
      {/* h-dvh: dynamic viewport height — correct on iOS Safari (excludes address bar) */}
      {/*
        opacity gating: the entire sticky frame stays invisible until the photo
        fires onLoad. Transition is only applied in the reveal direction (none→1)
        so there is no artificial delay before the image is ready, and no
        overlay element that lingers afterward.
      */}
      <div
        className="sticky top-0 h-dvh overflow-hidden bg-black"
        style={{
          opacity:    imageLoaded ? 1 : 0,
          transition: imageLoaded ? 'opacity 150ms ease-in' : 'none',
        }}
      >

        {/* ── Layer 1: Team photograph ── */}
        {/*
          priority  → <link rel="preload"> in <head>, loading="eager" (never lazy)
          quality   → 85 instead of default 75 for a premium full-screen hero
          fill      → position:absolute inset:0, fills the motion.div container
          sizes     → "100vw" enables optimal srcset selection across breakpoints
        */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: imageScale, x: C.imageOffsetX, y: C.imageOffsetY }}
        >
          <Image
            src="/images/team-hero-smile.jpg"
            alt=""
            fill
            priority
            quality={100}
            sizes="100vw"
            className="select-none pointer-events-none"
            style={{ objectFit: 'cover', objectPosition: C.imageObjectPosition }}
            onLoad={() => setImageLoaded(true)}
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
          Outer div: screen positioning + perspective context (3D tilt).
          rotateX wrapper: logo straightens from initial tilt as user scrolls.
          y wrapper: vertical drift — outside scale so y is not zoom-amplified.
          Scale div: scale + opacity + transformOrigin (zoom carrier).

          *** To reposition: change logoMarkScreenY (also update vignetteCenter Y) ***
          *** To adjust tilt: change logoInitialRotateX / logoStraightenRange      ***
        */}
        <div
          className="absolute left-0 right-0 flex justify-center pointer-events-none"
          style={{
            top:         `${C.logoMarkScreenY}%`,
            transform:   `translateY(-${C.logoMarkInSvgY}%)`,
            perspective: `${C.logoPerspective}px`,
          }}
        >
          <motion.div
            className="w-full flex justify-center"
            style={{ rotateX: logoRotateX }}
          >
            <motion.div className="w-full flex justify-center" style={{ y: logoY }}>
              <motion.div
                className="relative w-[72vw] sm:w-[44vw] md:w-[32vw]"
                style={{
                  scale:           logoScale,
                  opacity:         logoOpacity,
                  transformOrigin: `${C.logoMarkInSvgX} ${C.logoMarkInSvgY}%`,
                }}
              >

                {/* A — Far shadow */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  aria-hidden
                  alt=""
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

                {/* B — Contact shadow */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  aria-hidden
                  alt=""
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

                {/* C — Main logo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
            {/* h1: primary page heading — visual styles unchanged */}
            <h1 className="text-4xl sm:text-5xl md:text-[3.25rem] font-light leading-[1.18] tracking-tight mb-8">
              Shaping the future
              <br />
              of your business
            </h1>
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
