'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#151614] px-4 text-center text-stone-100">
      <div className="flex size-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-950/20 text-red-400">
        <AlertTriangle className="size-8" />
      </div>

      <h1 className="mt-6 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
        Something interrupted this transaction
      </h1>
      <p className="mt-3 max-w-md text-sm text-[var(--muted)] leading-relaxed">
        An unexpected application exception occurred. Our telemetry logs have captured this incident for technical review.
      </p>

      {error.message && (
        <div className="mt-4 max-w-lg rounded-xl border border-white/5 bg-[#1b1c19] p-3 font-mono text-xs text-red-300">
          {error.message}
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 rounded-xl bg-[var(--lime)] px-5 py-2.5 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)]"
        >
          <RefreshCcw className="size-4" />
          Retry Operation
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-stone-200 transition-colors hover:bg-white/10"
        >
          <Home className="size-4" />
          Back to Safety
        </Link>
      </div>
    </div>
  );
}
