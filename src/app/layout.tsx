import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  // Update metadataBase to the real production domain before launch.
  metadataBase: new URL('https://jeme.com'),
  title: {
    default:  'JEME',
    template: '%s | JEME',
  },
  description:
    'Strategic consulting that drives transformation, growth, and lasting competitive advantage.',
  openGraph: {
    title:       'JEME',
    description: 'Strategic consulting that drives transformation, growth, and lasting competitive advantage.',
    type:        'website',
    locale:      'en_US',
    // og:image resolves against metadataBase — update metadataBase to the real
    // production domain before launch, or social previews will not work.
    images: [
      {
        url:    '/images/team-hero.jpg',
        width:  3840,
        height: 2160,
        alt:    'JEME team',
      },
    ],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'JEME',
    description: 'Strategic consulting that drives transformation, growth, and lasting competitive advantage.',
    images:      ['/images/team-hero.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {/*
          Skip link: only visible on keyboard focus.
          Lets keyboard/screen-reader users jump past the hero intro directly
          to the main content landmark.
        */}
        <a
          href="#main-content"
          className="
            sr-only
            focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50
            focus:px-4 focus:py-2 focus:bg-white focus:text-brand-primary
            focus:font-semibold focus:rounded focus:shadow-lg focus:outline-none
          "
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
