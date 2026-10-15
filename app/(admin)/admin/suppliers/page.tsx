'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Search, CheckCircle2, AlertCircle, Loader2, Building2, Trash2, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface SupplierRow {
  id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  status: string;
  // joined from agreements
  commission_value: number | null;
  due_days: number | null;
  // joined from products count
  products_count: number;
}

const defaultForm = {
  name: '',
  contact_name: '',
  email: '',
  phone: '',
  city: '',
  state: 'Karnataka',
  commission_value: 15,
  due_days: 30,
};

export default function AdminSuppliersPage() {

  const [suppliers, setSuppliers] = useState<SupplierRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  // ── Delete confirmation state ─────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<SupplierRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch suppliers via server API (bypasses RLS/AAL2) ─────────────────
  async function fetchSuppliers() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/suppliers');
      const json = await res.json();
      if (!res.ok) {
        toast.error('Failed to load suppliers: ' + (json.error ?? res.statusText));
        return;
      }
      setSuppliers(json.suppliers ?? []);
    } catch (err: any) {
      toast.error('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Create supplier + agreement via server API (bypasses RLS) ──────────
  async function handleAddSupplier(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Supplier name and email are required.');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/admin/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error('Failed to create supplier: ' + (json.error ?? res.statusText));
        return;
      }

      if (json.warning) {
        toast.warning(json.warning);
      } else {
        toast.success(`Supplier "${form.name}" onboarded successfully!`);
      }

      setModalOpen(false);
      setForm(defaultForm);
      await fetchSuppliers();
    } catch (err: any) {
      toast.error('Network error: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  // ── Delete supplier ─────────────────────────────────────────────────────────

  async function handleDeleteSupplier() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/suppliers?id=${deleteTarget.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to delete supplier.');
        return;
      }
      toast.success(`"${deleteTarget.name}" and all associated products have been deleted.`);
      setDeleteTarget(null);
      fetchSuppliers();
    } catch (err: any) {
      toast.error('Network error: ' + err.message);
    } finally {
      setDeleting(false);
    }
  }

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.contact_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (s.city ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
            OEM Vendor Relationships
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-stone-100">
            Software Suppliers &amp; Agreements
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Manage distributor commission models, settlement intervals, and verified bank credentials.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[var(--lime)] px-4 py-2.5 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)]"
        >
          <Plus className="size-4" />
          Onboard Supplier
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search supplier name, city, or contact..."
          className="w-full rounded-xl border border-white/10 bg-[#191a18] py-2 pl-9 pr-3 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
        />
      </div>

      {/* Table / States */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-stone-500">
          <Loader2 className="size-5 animate-spin mr-2" />
          <span className="text-sm">Loading suppliers…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#1c1d1a] py-20 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Building2 className="size-8 text-stone-500" />
          </div>
          <h3 className="text-sm font-semibold text-stone-300">No Suppliers Onboarded Yet</h3>
          <p className="mt-1 max-w-xs text-xs text-stone-500">
            {search
              ? 'No suppliers match your search. Try a different name or city.'
              : 'Start by onboarding your first OEM partner to build your catalogue.'}
          </p>
          {!search && (
            <button
              onClick={() => setModalOpen(true)}
              className="mt-5 flex items-center gap-2 rounded-xl bg-[var(--lime)] px-4 py-2 text-xs font-bold text-stone-950 hover:bg-[var(--lime-hi)]"
            >
              <Plus className="size-3.5" /> Onboard First Supplier
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1d1a] shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 font-semibold text-stone-300">
                <tr>
                  <th className="py-3.5 px-4">Supplier Entity</th>
                  <th className="py-3.5 px-4">Contact Officer</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Distaura Margin %</th>
                  <th className="py-3.5 px-4">Payout Cycle</th>
                  <th className="py-3.5 px-4">Catalog Items</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-stone-300">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-semibold text-stone-100">
                      {s.name}
                      <div className="text-[11px] font-normal text-[var(--muted)]">{s.email}</div>
                    </td>
                    <td className="py-4 px-4 text-stone-200">
                      {s.contact_name ?? '—'}
                      <div className="text-[11px] text-[var(--muted)]">{s.phone ?? ''}</div>
                    </td>
                    <td className="py-4 px-4 text-[var(--muted)]">
                      {[s.city, s.state].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-[var(--lime-hi)]">
                        {s.commission_value != null ? `${Number(s.commission_value).toFixed(1)}%` : '—'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-stone-200">
                      {s.due_days != null ? `Net ${s.due_days} Days` : '—'}
                    </td>
                    <td className="py-4 px-4 font-mono">{s.products_count}</td>
                    <td className="py-4 px-4">
                      {s.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                          <CheckCircle2 className="size-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                          <AlertCircle className="size-3" />
                          {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-red-500/15 hover:text-red-400 transition-colors"
                        title="Delete Supplier"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Supplier Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#1e1916] p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15">
                <AlertTriangle className="size-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-stone-100">Delete Supplier?</h3>
                <p className="mt-1 text-xs text-stone-400">
                  This will permanently delete{' '}
                  <span className="font-semibold text-stone-200">&ldquo;{deleteTarget.name}&rdquo;</span>{' '}
                  and all its products ({deleteTarget.products_count} listing{deleteTarget.products_count !== 1 ? 's' : ''}).
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-stone-300 hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSupplier}
                disabled={deleting}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-500 disabled:opacity-60"
              >
                {deleting && <span className="inline-block size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                {deleting ? 'Deleting…' : 'Yes, Delete Supplier'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#212320] p-6 sm:p-8 shadow-2xl">
            <h3 className="font-display text-xl font-bold text-stone-100">Onboard OEM Supplier</h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Establish master distribution terms and settlement schedule.
            </p>

            <form onSubmit={handleAddSupplier} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300">Company / Legal Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Apex Cloud Solutions Pvt Ltd"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:border-[var(--lime)] focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-stone-300">Contact Officer</label>
                  <input
                    type="text"
                    value={form.contact_name}
                    onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                    placeholder="e.g. Sanjay Nair"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:border-[var(--lime)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-300">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="partners@apexcloud.in"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:border-[var(--lime)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-stone-300">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:border-[var(--lime)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-300">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:border-[var(--lime)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-stone-300">Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    required
                    value={form.commission_value}
                    onChange={(e) => setForm({ ...form, commission_value: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-300">Payout Due Days</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.due_days}
                    onChange={(e) => setForm({ ...form, due_days: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setModalOpen(false); setForm(defaultForm); }}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-stone-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[var(--lime)] px-5 py-2 text-xs font-bold text-stone-950 hover:bg-[var(--lime-hi)] disabled:opacity-60"
                >
                  {saving && <Loader2 className="size-3.5 animate-spin" />}
                  {saving ? 'Saving…' : 'Create Agreement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
