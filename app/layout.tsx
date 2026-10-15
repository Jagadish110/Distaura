import type { Metadata } from 'next';
import { Sora, Manrope } from 'next/font/google';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth/auth-provider';
import '@/styles.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: {
    default: 'Distaura | Software Distribution for Indian Businesses',
    template: '%s | Distaura',
  },
  description:
    'Distaura is a B2B software distribution company connecting software suppliers with Indian businesses.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://distaura.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://distaura.com',
    siteName: 'Distaura',
    images: [{ url: '/og.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <head>
        <meta name="theme-color" content="#1a1b19" />
      </head>
      <body>
        <div className="grain" aria-hidden="true" />
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--text)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: 'var(--raise)',
            },
          }}
        />
      </body>
    </html>
  );
}
