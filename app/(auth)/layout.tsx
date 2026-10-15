import Link from 'next/link';
import { Mark } from '@/components/site/mark';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#141513] text-stone-100 flex flex-col justify-between">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-[var(--lime)]/10 blur-[140px]" />
        <div className="absolute -bottom-40 right-10 size-[500px] rounded-full bg-emerald-500/5 blur-[140px]" />
      </div>

      {/* Header bar */}
      <header className="relative z-10 wrap flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <Mark className="size-10 drop-shadow-[0_0_16px_rgba(184,224,44,0.45)] transition-transform group-hover:scale-105" />
          <span className="logo !text-2xl font-bold tracking-wider text-stone-100">
            DISTAURA
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs">
          <Link
            href="/products"
            className="hidden sm:inline-block text-[var(--muted)] hover:text-stone-200 no-underline transition-colors"
          >
            Browse Catalogue
          </Link>
          <Link
            href="/contact"
            className="text-[var(--muted)] hover:text-stone-200 no-underline transition-colors"
          >
            Need Help?
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          {children}
        </div>
      </main>

      {/* Subtle footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-[var(--muted)] border-t border-white/5">
        <div className="wrap flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <span>© {new Date().getFullYear()} Distaura Technologies Pvt Ltd. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-stone-300 no-underline">Terms</Link>
            <Link href="/privacy" className="hover:text-stone-300 no-underline">Privacy</Link>
            <Link href="/admin/sign-in" className="text-stone-400 hover:text-[var(--lime-hi)] no-underline">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
