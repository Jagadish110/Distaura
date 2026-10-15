'use client';

import Link from 'next/link';
import { Home, Search, Package, ArrowLeft } from 'lucide-react';
import { Mark } from '@/components/site/mark';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#151614] px-4 text-center text-stone-100">
      <div className="relative">
        <Mark className="mx-auto size-16 drop-shadow-[0_0_25px_rgba(184,224,44,0.45)]" />
        <span className="mt-4 block font-mono text-xs uppercase tracking-widest text-[var(--lime-hi)]">
          Error 404 • Resource Not Found
        </span>
      </div>

      <h1 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold tracking-tight">
        Lost in distribution?
      </h1>
      <p className="mt-3 max-w-md text-sm text-[var(--muted)] leading-relaxed">
        The page or software catalogue route you are looking for has been moved, archived, or does not exist.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-[var(--lime)] px-5 py-2.5 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)] hover:shadow-[0_0_20px_rgba(184,224,44,0.3)]"
        >
          <Home className="size-4" />
          Back to Home
        </Link>
        <Link
          href="/products"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-stone-200 transition-colors hover:bg-white/10"
        >
          <Package className="size-4" />
          Browse Catalogue
        </Link>
      </div>
    </div>
  );
}
