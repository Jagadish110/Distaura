import type { MetadataRoute } from 'next';

const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://distaura.com';
const paths = ['', '/products', '/pricing', '/find-a-solution', '/partner', '/about', '/contact', '/terms', '/privacy', '/refund-policy'];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((p) => ({ url: `${base}${p}`, lastModified: new Date() }));
}
