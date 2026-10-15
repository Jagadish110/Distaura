'use client';

import { useState, useEffect } from 'react';
import { RefreshCcw, Send, Loader2, CalendarClock } from 'lucide-react';
import { toast } from 'sonner';

interface RenewalRow {
  id: string;
  renewal_date: string;
  renewal_price_paise: number;
  status: string;
  reminders_sent: number;
  days_remaining: number;
  order_number: string;
  company_name: string;
  product_name: string;
}

interface Stats {
  pipeline60Value: number;
  totalBase: number;
}

export default function AdminRenewalsPage() {
  const [renewals, setRenewals] = useState<RenewalRow[]>([]);
  const [stats, setStats] = useState<Stats>({ pipeline60Value: 0, totalBase: 0 });
  const [loading, setLoading] = useState(true);

  async function fetchRenewals() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/renewals');
      const json = await res.json();
      if (!res.ok) { toast.error(json.error ?? 'Failed to load renewals'); return; }
      setRenewals(json.renewals ?? []);
      setStats(json.stats ?? { pipeline60Value: 0, totalBase: 0 });
    } catch (err: any) {
      toast.error('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchRenewals(); }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
          Lifecycle &amp; Revenue Retention
        </p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-stone-100">
          Upcoming Software Renewals
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Automated reminder cadence (60, 30, and 14-day intervals) and contract renewal management.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
          <span className="text-xs text-[var(--muted)]">Pipeline Due in 60 Days</span>
          <div className="mt-2 font-display text-2xl font-bold text-amber-300">
            ₹{(stats.pipeline60Value / 100).toLocaleString('en-IN')}
          </div>
          <span className="mt-1 block text-[11px] text-[var(--muted)]">
            {renewals.filter(r => r.days_remaining >= 0 && r.days_remaining <= 60).length} Contract(s)
          </span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
          <span className="text-xs text-[var(--muted)]">Total Annual Renewal Base</span>
          <div className="mt-2 font-display text-2xl font-bold text-stone-100">
            ₹{(stats.totalBase / 100).toLocaleString('en-IN')}
          </div>
          <span className="mt-1 block text-[11px] text-[var(--muted)]">
            {renewals.length} Active Contract(s)
          </span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
          <span className="text-xs text-[var(--muted)]">Automated Dispatch Service</span>
          <div className="mt-2 font-display text-2xl font-bold text-[var(--lime-hi)]">Active (CRON)</div>
          <span className="mt-1 block text-[11px] text-[var(--muted)]">Daily at 00:00 UTC</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-stone-500">
          <Loader2 className="size-5 animate-spin mr-2" />
          <span className="text-sm">Loading renewals…</span>
        </div>
      ) : renewals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#1c1d1a] py-20 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <CalendarClock className="size-8 text-stone-500" />
          </div>
          <h3 className="text-sm font-semibold text-stone-300">No Upcoming Renewals</h3>
          <p className="mt-1 max-w-xs text-xs text-stone-500">
            Software contract renewals will appear here once orders are placed and renewal dates are tracked.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1d1a] shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 font-semibold text-stone-300">
                <tr>
                  <th className="py-3.5 px-4">Enterprise Buyer</th>
                  <th className="py-3.5 px-4">Software Product</th>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Renewal Expiry</th>
                  <th className="py-3.5 px-4">Countdown</th>
                  <th className="py-3.5 px-4">Contract Tariff</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-stone-300">
                {renewals.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-semibold text-stone-100">{r.company_name}</td>
                    <td className="py-4 px-4 text-stone-200">{r.product_name}</td>
                    <td className="py-4 px-4 font-mono text-[var(--lime-hi)]">{r.order_number}</td>
                    <td className="py-4 px-4 font-mono text-[var(--muted)]">
                      {new Date(r.renewal_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${r.days_remaining <= 30 ? 'text-red-400' : r.days_remaining <= 60 ? 'text-amber-300' : 'text-stone-200'}`}>
                        {r.days_remaining > 0 ? `${r.days_remaining} Days` : 'Overdue'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-stone-100">
                      ₹{(r.renewal_price_paise / 100).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                        r.status === 'renewed'
                          ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : r.status === 'lapsed'
                          ? 'border border-red-500/30 bg-red-500/10 text-red-400'
                          : r.days_remaining <= 30
                          ? 'border border-red-500/30 bg-red-500/10 text-red-300'
                          : 'border border-amber-500/30 bg-amber-500/10 text-amber-300'
                      }`}>
                        {r.status === 'renewed' ? 'Renewed' : r.status === 'lapsed' ? 'Lapsed' : r.days_remaining <= 30 ? 'Urgent' : 'Upcoming'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
