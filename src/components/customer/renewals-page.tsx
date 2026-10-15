'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, RefreshCcw, Package } from 'lucide-react';
import { toast } from 'sonner';
export interface RenewalOrder {
  id: string;
  order_number: string;
  product_name: string;
  plan_name: string | null;
  billing_cycle: string | null;
  quantity: number;
  total_paise: number;
  renewal_date: string | null;
  status: string;
  days_remaining: number | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function statusOf(days: number | null): 'critical' | 'upcoming' | 'healthy' {
  if (days === null) return 'healthy';
  if (days <= 30) return 'critical';
  if (days <= 60) return 'upcoming';
  return 'healthy';
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  renewals: RenewalOrder[];
}

export function RenewalsPage({ renewals }: Props) {
  const [autoRenewMap, setAutoRenewMap] = useState<Record<string, boolean>>({});

  function toggleAutoRenew(id: string, name: string) {
    setAutoRenewMap((prev) => {
      const next = !prev[id];
      toast.success(`${name} auto-renew ${next ? 'enabled' : 'disabled'}.`);
      return { ...prev, [id]: next };
    });
  }

  function handleRequestRenewal(productName: string) {
    toast.success(
      `Renewal request dispatched for ${productName}. Your account manager will contact you with the revised quote.`,
    );
  }

  // ── Derived stats ───────────────────────────────────────────────────────────
  const totalAnnualSpend = renewals.reduce((sum, r) => sum + r.total_paise, 0);

  // Soonest renewal that hasn't expired
  const upcoming = renewals
    .filter((r) => r.days_remaining !== null && r.days_remaining >= 0)
    .sort((a, b) => (a.days_remaining ?? 0) - (b.days_remaining ?? 0))[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
          License Continuity &amp; Lifecycle
        </p>
        <h1
          className="mt-1 font-display font-bold text-stone-100 tracking-tight"
          style={{ fontSize: '1.25rem', lineHeight: '1.75rem' }}
        >
          Software Subscriptions &amp; Renewals
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Track license validity, lock in early renewal discounts, and prevent service disruptions.
        </p>
      </div>

      {/* Summary Banner */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Active count */}
        <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
          <span className="text-xs text-[var(--muted)]">Active Subscriptions</span>
          {renewals.length > 0 ? (
            <>
              <div className="mt-2 font-display text-3xl font-bold text-stone-100">
                {renewals.length} Suite{renewals.length !== 1 ? 's' : ''}
              </div>
              <span className="mt-1 block text-[11px] text-emerald-400">
                All licenses in good standing
              </span>
            </>
          ) : (
            <>
              <div className="mt-2 font-display text-3xl font-bold text-stone-400">—</div>
              <span className="mt-1 block text-[11px] text-[var(--muted)]">No active subscriptions</span>
            </>
          )}
        </div>

        {/* Next renewal */}
        <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
          <span className="text-xs text-[var(--muted)]">Next Renewal Due</span>
          {upcoming ? (
            <>
              <div className="mt-2 font-display text-3xl font-bold text-amber-300">
                {upcoming.days_remaining} Day{upcoming.days_remaining !== 1 ? 's' : ''}
              </div>
              <span className="mt-1 block text-[11px] text-[var(--muted)]">
                {upcoming.product_name}
              </span>
            </>
          ) : (
            <>
              <div className="mt-2 font-display text-3xl font-bold text-stone-400">—</div>
              <span className="mt-1 block text-[11px] text-[var(--muted)]">No upcoming renewals</span>
            </>
          )}
        </div>

        {/* Annual spend */}
        <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
          <span className="text-xs text-[var(--muted)]">Consolidated Annual Spend</span>
          {totalAnnualSpend > 0 ? (
            <>
              <div className="mt-2 font-display text-3xl font-bold text-stone-100">
                ₹{(totalAnnualSpend / 100).toLocaleString('en-IN')}
              </div>
              <span className="mt-1 block text-[11px] text-[var(--lime-hi)]">
                Input Tax Credit applicable
              </span>
            </>
          ) : (
            <>
              <div className="mt-2 font-display text-3xl font-bold text-stone-400">₹0</div>
              <span className="mt-1 block text-[11px] text-[var(--muted)]">No spend recorded</span>
            </>
          )}
        </div>
      </div>

      {/* Subscriptions List */}
      {renewals.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-12 text-center">
          <RefreshCcw className="mx-auto size-10 text-stone-600" />
          <h3 className="mt-4 font-display text-base font-semibold text-stone-300">
            No active subscriptions yet
          </h3>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Once your software orders are delivered, your renewal schedule will appear here.
          </p>
          <Link
            href="/portal/products"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--lime)] px-4 py-2.5 text-xs font-bold text-stone-950 hover:bg-[var(--lime-hi)]"
          >
            <Package className="size-4" />
            Browse Software Catalogue
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {renewals.map((sub) => {
            const status = statusOf(sub.days_remaining);
            const isAutoRenew = autoRenewMap[sub.id] ?? false;
            const renewalPriceRupees = sub.total_paise / 100;

            return (
              <div
                key={sub.id}
                className={`flex flex-col gap-6 rounded-2xl border bg-[#1c1d1a] p-6 lg:flex-row lg:items-center lg:justify-between transition-colors ${
                  status === 'critical'
                    ? 'border-red-500/30'
                    : status === 'upcoming'
                    ? 'border-amber-500/20'
                    : 'border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-md border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--lime-hi)]">
                      {sub.billing_cycle ?? 'Annual'}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--muted)]">
                      {sub.order_number}
                    </span>
                    {status === 'critical' && (
                      <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                        Renew soon
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 font-display text-lg font-bold text-stone-100">
                    {sub.product_name}
                  </h3>
                  {sub.plan_name && (
                    <p className="text-xs text-[var(--muted)]">{sub.plan_name}</p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-stone-300">
                    {sub.renewal_date && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-stone-400" />
                        <span>Expiry: {formatDate(sub.renewal_date)}</span>
                      </div>
                    )}
                    {sub.days_remaining !== null && (
                      <div className="flex items-center gap-1.5">
                        <Clock
                          className={`size-3.5 ${
                            status === 'critical' ? 'text-red-400' : 'text-amber-400'
                          }`}
                        />
                        <span
                          className={`font-semibold ${
                            status === 'critical' ? 'text-red-400' : 'text-amber-400'
                          }`}
                        >
                          {sub.days_remaining > 0
                            ? `${sub.days_remaining} days remaining`
                            : 'Expired'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t border-white/5 pt-4 lg:border-t-0 lg:pt-0">
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                      Renewal Fee
                    </div>
                    <div className="font-display text-xl font-bold text-stone-100">
                      ₹{renewalPriceRupees.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-[var(--muted)]">+ 18% GST</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAutoRenew(sub.id, sub.product_name)}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
                        isAutoRenew
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-white/10 bg-white/5 text-stone-400 hover:bg-white/10'
                      }`}
                    >
                      {isAutoRenew ? 'Auto-Renew: ON' : 'Auto-Renew: OFF'}
                    </button>
                    <button
                      onClick={() => handleRequestRenewal(sub.product_name)}
                      className="rounded-xl bg-[var(--lime)] px-4 py-2 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)]"
                    >
                      Confirm Renewal
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
