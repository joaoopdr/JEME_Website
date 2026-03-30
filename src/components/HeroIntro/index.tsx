'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
 */
export default function HeroIntro() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Hide scrollbar only during the intro phase
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      const shouldHideScrollbar = value < C.contentRevealRange[0];

      document.documentElement.classList.toggle(
        'intro-scrollbar-hidden',
        shouldHideScrollbar,
      );
      document.body.classList.toggle(
        'intro-scrollbar-hidden',
        shouldHideScrollbar,
      );
    });

    return () => {
      unsubscribe();
      document.documentElement.classList.remove('intro-scrollbar-hidden');
      document.body.classList.remove('intro-scrollbar-hidden');
    };
  }, [scrollYProgress]);

  // Radial vignette
  const vignetteOpacity = useTransform(
    scrollYProgress,
    C.imageDimRange,
    [0, C.imageDimMaxOpacity],
  );

  // Brand-red fill
  const redOpacity = useTransform(scrollYProgress, C.redFadeRange, [0, 1]);

  // Background image zoom
  const imageScale = useTransform(
    scrollYProgress,
    C.imageScaleRange,
    [C.imageScaleStart, C.imageScaleMax],
  );

  // Logo zoom
  const logoScale = useTransform(
    scrollYProgress,
    C.logoScaleRange,
    [1, C.logoMaxScale],
  );

  // Logo fade
  const logoOpacity = useTransform(
    scrollYProgress,
    C.logoFadeRange,
    [1, 0],
  );

  // Content reveal
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
    <div
      ref={containerRef}
      style={{ height: `${C.scrollHeightVh}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ── Layer 1: Team photograph ── */}
        <motion.div
          className="absolute inset-0"
          style={{
            scale: imageScale,
            x: C.imageOffsetX,
            y: C.imageOffsetY,
          }}
        >
          <img
            src="/images/team-hero.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center select-none pointer-events-none"
            draggable={false}
          />
        </motion.div>

        {/* ── Layer 2a: Static ambient shadow ── */}
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

        {/* ── Layer 2b: Radial vignette ── */}
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
        <div
          className="absolute left-0 right-0 flex justify-center pointer-events-none"
          style={{
            top: `${C.logoMarkScreenY}%`,
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
            <img
              src="/logo.svg"
              alt="JEME"
              width={841}
              height={595}
              className="w-full h-auto"
              draggable={false}
            />
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