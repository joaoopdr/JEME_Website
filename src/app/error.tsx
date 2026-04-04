'use client';

import { useEffect } from 'react';

/**
 * Next.js App Router error boundary.
 * Catches runtime errors inside the route segment and its children
 * (e.g. HeroIntro, AboutSection) and shows a graceful branded fallback.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with a real error reporting service (e.g. Sentry) when ready.
    console.error('[JEME error boundary]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <p className="text-[0.6875rem] font-semibold tracking-[0.22em] uppercase mb-6 text-brand-muted">
        Something went wrong
      </p>
      <h2 className="text-2xl sm:text-3xl font-light tracking-tight mb-10 text-brand-text text-center">
        We couldn&apos;t load this page.
      </h2>
      <button
        onClick={reset}
        className="px-6 py-3 bg-brand-primary text-white text-sm font-semibold tracking-[0.12em] uppercase hover:bg-brand-danger transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
