import { describe, it, expect } from 'vitest';
import { HERO_CONFIG as C } from '../config';

/**
 * Validates the invariants that the HeroIntro animation depends on.
 * These are pure logic checks — no DOM, no React, no Framer Motion required.
 *
 * If any of these fail, the animation will misrender in the browser
 * (mismatched piecewise arrays, overlapping phases, etc.).
 */
describe('HERO_CONFIG — animation invariants', () => {

  it('logoScaleProgress is strictly increasing within [0, 1]', () => {
    const p = [...C.logoScaleProgress];
    expect(p[0]).toBe(0);
    for (let i = 1; i < p.length; i++) {
      expect(p[i]).toBeGreaterThan(p[i - 1]);
      expect(p[i]).toBeLessThanOrEqual(1);
    }
  });

  it('logoScaleProgress and logoScaleOutput have matching lengths', () => {
    expect(C.logoScaleProgress.length).toBe(C.logoScaleOutput.length);
  });

  it('logoVerticalShiftProgress and logoVerticalShiftOutput have matching lengths', () => {
    expect(C.logoVerticalShiftProgress.length).toBe(C.logoVerticalShiftOutput.length);
  });

  it('content reveal begins at or after logo has fully faded', () => {
    // Ensures the logo is invisible before the text content appears.
    expect(C.contentRevealRange[0]).toBeGreaterThanOrEqual(C.logoFadeRange[1]);
  });

  it('tilt straightening resolves before the explosive zoom phase', () => {
    // The logo should be upright before scale accelerates to its maximum.
    const explosiveZoomStart = C.logoScaleProgress[C.logoScaleProgress.length - 2];
    expect(C.logoStraightenRange[1]).toBeLessThanOrEqual(explosiveZoomStart);
  });

  it('red fill starts before logo fade completes', () => {
    // The red takeover should be underway while the logo is still (partially) visible.
    expect(C.redFadeRange[0]).toBeLessThan(C.logoFadeRange[1]);
  });

});
