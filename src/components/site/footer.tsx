import Link from 'next/link';
import { Mark } from '@/components/site/mark';
import { site } from '@/lib/site';
import { ArrowUpRight } from 'lucide-react';

const product = [
  { label: 'Browse Catalogue', href: '/products' },
  { label: 'Find a Solution', href: '/find-a-solution' },
  { label: 'Pricing', href: '/pricing' },
];

const company = [
  { label: 'For Suppliers', href: '/partner' },
  { label: 'For Businesses', href: '/solutions' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const legal = [
  { label: 'Terms of Service', href: '/legal/terms' },
  { label: 'Privacy Policy', href: '/legal/privacy' },
  { label: 'Refund Policy', href: '/legal/refund-policy' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 pt-16 pb-8 text-sm text-[var(--muted)]">
      <div className="wrap">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3 no-underline group">
              <Mark className="size-10 drop-shadow-[0_0_12px_rgba(184,224,44,0.4)] transition-transform group-hover:scale-105" />
              <span className="logo !text-xl font-bold">{site.name.toUpperCase()}</span>
            </Link>
            <p className="mt-4 text-xs leading-relaxed max-w-xs">
              {site.description}
            </p>
            <div className="mt-6 space-y-2 text-xs">
              <a
                href={`mailto:${site.emails.hello}`}
                className="flex items-center gap-1.5 hover:text-[var(--lime-hi)] transition-colors no-underline"
              >
                {site.emails.hello}
                <ArrowUpRight className="size-3 opacity-50" />
              </a>
              <a
                href={site.phoneHref}
                className="flex items-center gap-1.5 hover:text-[var(--lime-hi)] transition-colors no-underline"
              >
                {site.phone}
              </a>
            </div>
            {/* Live status */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px]">
              <span className="dot-live" />
              <span>Onboarding partners across India</span>
            </div>
          </div>

          {/* Product */}
          <div className="md:col-span-2">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text)]">
              Product
            </p>
            <nav className="flex flex-col gap-2.5">
              {product.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="no-underline text-xs transition-colors hover:text-[var(--lime-hi)]"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div className="md:col-span-3">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text)]">
              Company
            </p>
            <nav className="flex flex-col gap-2.5">
              {company.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="no-underline text-xs transition-colors hover:text-[var(--lime-hi)]"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="md:col-span-3">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text)]">
              Legal
            </p>
            <nav className="flex flex-col gap-2.5">
              {legal.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="no-underline text-xs transition-colors hover:text-[var(--lime-hi)]"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 pt-5 border-t border-white/5">
              <Link
                href="/portal/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--lime-hi)] hover:underline no-underline"
              >
                Customer Portal
                <ArrowUpRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <div className="flex items-center gap-1 text-stone-600">
            <span>Distributed from</span>
            <span className="text-[var(--muted)]">{site.basedIn}</span>
            <span>·</span>
            <span>GST-compliant B2B marketplace</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
