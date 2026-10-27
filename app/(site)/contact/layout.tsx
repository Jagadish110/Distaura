import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Distaura about a solution for your business or distribution in India.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
