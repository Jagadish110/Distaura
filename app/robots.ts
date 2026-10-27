import type { MetadataRoute } from 'next';

const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://distaura.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/portal', '/api'] },
    sitemap: `${base}/sitemap.xml`,
  };
}
