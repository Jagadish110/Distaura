'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Loader2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface CommissionRow {
  id: string;
  sale_amount_paise: number;
  commission_amount_paise: number;
  supplier_payout_paise: number;
  commission_pct: number;
  due_date: string | null;
  status: string;
  order_number: string;
  supplier_name: string;
}

interface Stats {
  totalMargin: number;
  pendingPayout: number;
}

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<CommissionRow[]>([]);
  const [stats, setStats] = useState<Stats>({ totalMargin: 0, pendingPayout: 0 });
  const [loading, setLoading] = useState(true);

  async function fetchCommissions() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/commissions');
      const json = await res.json();
      if (!res.ok) { toast.error(json.error ?? 'Failed to load commissions'); return; }
      setCommissions(json.commissions ?? []);
      setStats(json.stats ?? { totalMargin: 0, pendingPayout: 0 });
    } catch (err: any) {
      toast.error('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchCommissions(); }, []);

  async function markSettled(id: string, supplier: string) {
    try {
      const res = await fetch('/api/admin/commissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error ?? 'Failed to update'); return; }
      toast.success(`Payout settled for ${supplier}`);
      fetchCommissions();
    } catch (err: any) {
      toast.error('Network error: ' + err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
          Treasury &amp; Settlement Ledger
        </p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-stone-100">
          Supplier Commissions &amp; Disbursements
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Distributor margin realization, OEM contract percentages, and bank remittance reconciliation.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
          <span className="text-xs text-[var(--muted)]">Pending Supplier Disbursements</span>
          <div className="mt-2 font-display text-2xl font-bold text-amber-300">
            ₹{(stats.pendingPayout / 100).toLocaleString('en-IN')}
          </div>
          <span className="mt-1 block text-[11px] text-[var(--muted)]">
            {commissions.filter(c => c.status === 'pending' || c.status === 'due').length} Due
          </span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
          <span className="text-xs text-[var(--muted)]">Realized Distaura Margins</span>
          <div className="mt-2 font-display text-2xl font-bold text-[var(--lime-hi)]">
            ₹{(stats.totalMargin / 100).toLocaleString('en-IN')}
          </div>
          <span className="mt-1 block text-[11px] text-[var(--muted)]">Net distributor commission</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
          <span className="text-xs text-[var(--muted)]">Statutory TDS Deductions</span>
          <div className="mt-2 font-display text-2xl font-bold text-stone-100">Section 194H</div>
          <span className="mt-1 block text-[11px] text-emerald-400">TDS Certificates Prepared</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-stone-500">
          <Loader2 className="size-5 animate-spin mr-2" />
          <span className="text-sm">Loading commissions…</span>
        </div>
      ) : commissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#1c1d1a] py-20 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <DollarSign className="size-8 text-stone-500" />
          </div>
          <h3 className="text-sm font-semibold text-stone-300">No Commission Records Yet</h3>
          <p className="mt-1 max-w-xs text-xs text-stone-500">
            Commission ledger entries will appear here once orders are confirmed and payment is received.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1d1a] shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 font-semibold text-stone-300">
                <tr>
                  <th className="py-3.5 px-4">Supplier OEM</th>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Gross Sale</th>
                  <th className="py-3.5 px-4">Distaura Margin</th>
                  <th className="py-3.5 px-4">Supplier Net Payout</th>
                  <th className="py-3.5 px-4">Settlement Due</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-stone-300">
                {commissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-semibold text-stone-100">{comm.supplier_name}</td>
                    <td className="py-4 px-4 font-mono text-[var(--lime-hi)]">{comm.order_number}</td>
                    <td className="py-4 px-4 font-medium text-stone-200">
                      ₹{(comm.sale_amount_paise / 100).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-[var(--lime-hi)]">
                        ₹{(comm.commission_amount_paise / 100).toLocaleString('en-IN')}
                      </span>
                      <span className="ml-1 text-[10px] text-[var(--muted)]">({Number(comm.commission_pct).toFixed(1)}%)</span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-stone-100">
                      ₹{(comm.supplier_payout_paise / 100).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-[var(--muted)]">
                      {comm.due_date ? new Date(comm.due_date).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                        comm.status === 'paid' || comm.status === 'waived'
                          ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : comm.status === 'overdue'
                          ? 'border border-red-500/30 bg-red-500/10 text-red-400'
                          : 'border border-amber-500/30 bg-amber-500/10 text-amber-300'
                      }`}>
                        {comm.status === 'paid' ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                        {comm.status === 'paid' ? 'Disbursed' : comm.status === 'overdue' ? 'Overdue' : 'Due for Payment'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {comm.status !== 'paid' && comm.status !== 'waived' && comm.status !== 'cancelled' ? (
                        <button
                          onClick={() => markSettled(comm.id, comm.supplier_name)}
                          className="rounded-lg bg-[var(--lime)] px-2.5 py-1 text-[11px] font-bold text-stone-950 hover:bg-[var(--lime-hi)]"
                        >
                          Record Payout
                        </button>
                      ) : (
                        <span className="text-[10px] text-stone-500">UTR Confirmed</span>
                      )}
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
