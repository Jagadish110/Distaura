'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShieldCheck, Mail, Clock, Home, Package } from 'lucide-react';

function EnquiryContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'business';

  const isSupplier = type === 'supplier';

  return (
    <div className="mx-auto max-w-xl text-center">
      {/* Animated Glowing Success Badge */}
      <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-[var(--lime)]/40 bg-[var(--lime)]/15 shadow-[0_0_40px_rgba(184,224,44,0.35)]">
        <CheckCircle2 className="size-10 text-[var(--lime)]" />
      </div>



      <h1 className="mt-5 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-100">
        {isSupplier ? 'Partnership Request Received' : 'Requirement Received'}
      </h1>

      <p className="mt-3 text-sm sm:text-base leading-relaxed text-[var(--muted)]">
        {isSupplier
          ? 'Thank you for choosing to distribute your software with Distaura. Our vendor evaluation desk has queued your application for review.'
          : 'Thank you for reaching out to Distaura Enterprise Solutions. Our procurement team has received your inquiry and is compiling matching software options.'}
      </p>

      {/* SLA Details Card */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-[#1c1d1a] p-6 text-left shadow-lg">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
          What Happens Next?
        </h3>
        <ul className="mt-4 space-y-3.5 text-xs text-stone-300">
          <li className="flex items-start gap-3">
            <Clock className="size-4 shrink-0 text-[var(--lime)] mt-0.5" />
            <div>
              <p className="font-semibold text-stone-200">Review within 4–24 business hours</p>
              <p className="text-[var(--muted)]">Our specialist dedicated to your industry will analyze your submission.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Mail className="size-4 shrink-0 text-[var(--lime)] mt-0.5" />
            <div>
              <p className="font-semibold text-stone-200">Official commercial proposal</p>
              <p className="text-[var(--muted)]">We will deliver a customized quotation or distributor terms sheet to your email.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <ShieldCheck className="size-4 shrink-0 text-[var(--lime)] mt-0.5" />
            <div>
              <p className="font-semibold text-stone-200">Guaranteed Distaura governance</p>
              <p className="text-[var(--muted)]">All licensing agreements are governed by strict SLAs and Indian commercial law.</p>
            </div>
          </li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/products"
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[var(--lime)] px-5 py-3 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)] hover:shadow-[0_0_20px_rgba(184,224,44,0.3)]"
        >
          <Package className="size-4" />
          Browse Software Catalogue
        </Link>
        <Link
          href="/"
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold text-stone-200 hover:bg-white/10"
        >
          <Home className="size-4" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}

export default function EnquirySentPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="wrap">
        <Suspense fallback={<div className="text-center py-20 text-stone-400">Loading confirmation...</div>}>
          <EnquiryContent />
        </Suspense>
      </div>
    </div>
  );
}
