'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, Search, CheckCircle2, AlertCircle,
  ExternalLink, Loader2, Users
} from 'lucide-react';
import { toast } from 'sonner';

interface CustomerRow {
  id: string;
  company_name: string | null;
  billing_address: string | null;
  city: string | null;
  state: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  onboarding_step: number | null;
  created_at: string | null;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function fetchCustomers() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/customers');
      const json = await res.json();
      if (!res.ok) {
        toast.error('Failed to load customers: ' + (json.error ?? res.statusText));
        return;
      }
      setCustomers(json.customers ?? []);
    } catch (err: any) {
      toast.error('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.company_name ?? '').toLowerCase().includes(q) ||
      (c.full_name ?? '').toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
            Client Accounts &amp; Accounts Receivable
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-stone-100">
            Registered Enterprise Customers
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Verified corporate buyer accounts and aggregate procurement spend.
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company or contact officer..."
          className="w-full rounded-xl border border-white/10 bg-[#191a18] py-2 pl-9 pr-3 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1d1a] shadow-lg">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-xs text-[var(--muted)]">
            <Loader2 className="size-5 animate-spin mr-3 text-[var(--lime)]" />
            Loading customers…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 font-semibold text-stone-300">
                <tr>
                  <th className="py-3.5 px-4">Enterprise Entity</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Primary Contact</th>
                  <th className="py-3.5 px-4">Onboarding</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-stone-300">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-stone-500">
                      <Users className="mx-auto size-8 mb-2 opacity-40" />
                      {search ? 'No customers match your search.' : 'No customers registered yet.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 font-semibold text-stone-100">
                        {c.company_name ?? '—'}
                        <div className="text-[10px] font-normal text-[var(--muted)]">
                          Enrolled {c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-stone-200">{[c.city, c.state].filter(Boolean).join(', ') || '—'}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-stone-200">{c.full_name ?? '—'}</div>
                        <div className="text-[10px] text-[var(--muted)]">{c.email ?? ''}</div>
                      </td>
                      <td className="py-4 px-4 font-mono font-medium text-stone-200">
                        Step {c.onboarding_step ?? 1} / 4
                      </td>
                      <td className="py-4 px-4 text-[var(--muted)]">
                        {c.created_at
                          ? new Date(c.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="py-4 px-4">
                        {(c.onboarding_step ?? 0) >= 2 ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                            <CheckCircle2 className="size-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                            <AlertCircle className="size-3" />
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
