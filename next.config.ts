import type { NextConfig } from 'next';

const securityHeaders = [
  // Prevents the page from being loaded in an iframe (clickjacking protection).
  { key: 'X-Frame-Options',        value: 'DENY' },
  // Prevents MIME-type sniffing.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Sends full URL only to same-origin requests; only origin to cross-origin.
  { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
  // Disables browser features not used by this site.
  {
    key:   'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  // Content-Security-Policy — permissive starting point.
  // 'unsafe-inline' and 'unsafe-eval' are required by Next.js + Framer Motion.
  // Harden this by adding nonce-based script allowlisting in a future pass.
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes.
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
