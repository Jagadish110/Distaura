import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request a Quote',
  description: 'Tell us your requirement and budget range and Distaura will come back with a written quote.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
