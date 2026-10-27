import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enquiry Received',
  robots: { index: false },
  description: 'Thanks for your enquiry.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
