'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package, Plus, Search,
  Edit2, Eye, CheckCircle2, Trash2, AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  supplier_id: string;
  supplier_name: string;
  category_id: string | null;
  category_name: string | null;
  status: string;
  sort_order: number;
  plans: { id: string; name: string; price_paise: number; is_active: boolean }[];
}

interface CategoryRow { id: string; name: string; }
interface SupplierRow { id: string; name: string; }

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminProductsPage() {

  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Delete confirmation state ─────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [newProd, setNewProd] = useState({
    name: '',
    slug: '',
    category_id: '',
    supplier_id: '',
    short_desc: '',
    price_paise: 199900, // ₹1,999
  });

  // ── Fetch ───────────────────────────────────────────────────────────────────

  // ── Fetch via server API (bypasses RLS/AAL2) ────────────────────────────
  async function fetchAll() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const json = await res.json();
      if (!res.ok) {
        toast.error('Failed to load products: ' + (json.error ?? res.statusText));
        return;
      }
      setProducts(json.products ?? []);
      setCategories(json.categories ?? []);
      setSuppliers(json.suppliers ?? []);

      // Seed defaults for new product form
      if (json.suppliers?.[0]) setNewProd((p) => ({ ...p, supplier_id: json.suppliers[0].id }));
      if (json.categories?.[0]) setNewProd((p) => ({ ...p, category_id: json.categories[0].id }));
    } catch (err: any) {
      toast.error('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Filtered list ────────────────────────────────────────────────────────────

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(q) ||
      p.supplier_name.toLowerCase().includes(q);
    const matchesCat =
      selectedCat === 'all' || p.category_id === selectedCat;
    return matchesSearch && matchesCat;
  });

  // ── Add product ──────────────────────────────────────────────────────────────

  // ── Create product via server API (bypasses RLS/AAL2) ───────────────────
  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!newProd.name || !newProd.slug || !newProd.supplier_id) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProd, sort_order: products.length + 1 }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? 'Failed to create product.');
        return;
      }

      if (json.warning) toast.warning(json.warning);
      else toast.success(`${newProd.name} published to software catalogue.`);

      setModalOpen(false);
      setNewProd((p) => ({ ...p, name: '', slug: '', short_desc: '' }));
      fetchAll();
    } catch (err: any) {
      toast.error('Network error: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  // ── Delete product ─────────────────────────────────────────────────────────

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products?id=${deleteTarget.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to delete product.');
        return;
      }
      toast.success(`"${deleteTarget.name}" has been deleted.`);
      setDeleteTarget(null);
      fetchAll();
    } catch (err: any) {
      toast.error('Network error: ' + err.message);
    } finally {
      setDeleting(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
            Distribution Catalogue
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-stone-100">
            Software Products &amp; Margin Management
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Manage software listings, active plan tiers, supplier agreements, and commercial margins.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[var(--lime)] px-4 py-2.5 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)] hover:shadow-[0_0_15px_rgba(184,224,44,0.3)]"
        >
          <Plus className="size-4" />
          Add Software Listing
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search software or OEM supplier..."
            className="w-full rounded-xl border border-white/10 bg-[#191a18] py-2 pl-9 pr-3 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--muted)]">Category:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#191a18] px-3 py-2 text-xs text-stone-200 focus:border-[var(--lime)] focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1d1a] shadow-lg">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-xs text-[var(--muted)]">
            <div className="size-5 animate-spin rounded-full border-2 border-[var(--lime)] border-t-transparent mr-3" />
            Loading catalogue…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 font-semibold text-stone-300">
                <tr>
                  <th className="py-3.5 px-4">Software Name</th>
                  <th className="py-3.5 px-4">OEM Supplier</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Active Tiers</th>
                  <th className="py-3.5 px-4">Base Tariff</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-stone-300">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-500">
                      <Package className="mx-auto size-8 mb-2 opacity-40" />
                      No products found
                    </td>
                  </tr>
                ) : (
                  filtered.map((prod) => {
                    const activePlans = prod.plans.filter((p) => p.is_active);
                    const lowestPaise = activePlans.length
                      ? Math.min(...activePlans.map((p) => p.price_paise))
                      : 0;
                    return (
                      <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-semibold text-stone-100">{prod.name}</div>
                          <div className="font-mono text-[10px] text-[var(--muted)]">/{prod.slug}</div>
                        </td>
                        <td className="py-4 px-4 font-medium text-stone-200">{prod.supplier_name}</td>
                        <td className="py-4 px-4">
                          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px]">
                            {prod.category_name ?? '—'}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono">
                          {activePlans.length} plan{activePlans.length !== 1 ? 's' : ''}
                        </td>
                        <td className="py-4 px-4 font-semibold text-stone-100">
                          ₹{(lowestPaise / 100).toLocaleString('en-IN')}
                          <span className="text-[10px] text-[var(--muted)]"> / mo</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                            prod.status === 'published'
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                              : prod.status === 'draft'
                              ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                              : 'border-white/10 bg-white/5 text-stone-400'
                          }`}>
                            <CheckCircle2 className="size-3" />
                            {prod.status.charAt(0).toUpperCase() + prod.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/products/${prod.slug}`}
                              target="_blank"
                              className="rounded-lg p-1.5 text-stone-400 hover:bg-white/5 hover:text-stone-200"
                              title="View Live Listing"
                            >
                              <Eye className="size-3.5" />
                            </Link>
                            <button
                              onClick={() => toast.info(`Editing ${prod.name} — coming soon`)}
                              className="rounded-lg p-1.5 text-stone-400 hover:bg-white/5 hover:text-stone-200"
                              title="Edit Details"
                            >
                              <Edit2 className="size-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(prod)}
                              className="rounded-lg p-1.5 text-stone-400 hover:bg-red-500/15 hover:text-red-400 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#1e1916] p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15">
                <AlertTriangle className="size-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-stone-100">Delete Product?</h3>
                <p className="mt-1 text-xs text-stone-400">
                  This will permanently delete{' '}
                  <span className="font-semibold text-stone-200">&ldquo;{deleteTarget.name}&rdquo;</span>{' '}
                  and all its pricing tiers. This cannot be undone.
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
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-500 disabled:opacity-60"
              >
                {deleting && <span className="inline-block size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                {deleting ? 'Deleting…' : 'Yes, Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#212320] p-6 sm:p-8 shadow-2xl">
            <h3 className="font-display text-xl font-bold text-stone-100">
              Add New Software Listing
            </h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Configure product details, category, and default tariff tier.
            </p>

            <form onSubmit={handleAddProduct} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300">Software Name *</label>
                <input
                  type="text"
                  required
                  value={newProd.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, '');
                    setNewProd({ ...newProd, name, slug });
                  }}
                  placeholder="e.g. CloudDesk Support Suite"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={newProd.slug}
                  onChange={(e) => setNewProd({ ...newProd, slug: e.target.value })}
                  placeholder="cloud-desk-support"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs font-mono text-stone-200 focus:border-[var(--lime)] focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-stone-300">Category</label>
                  <select
                    value={newProd.category_id}
                    onChange={(e) => setNewProd({ ...newProd, category_id: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300">Supplier / OEM *</label>
                  <select
                    value={newProd.supplier_id}
                    required
                    onChange={(e) => setNewProd({ ...newProd, supplier_id: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300">
                  Base Plan Price (₹ paise — e.g. 199900 = ₹1,999)
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  value={newProd.price_paise}
                  onChange={(e) => setNewProd({ ...newProd, price_paise: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
                />
                <p className="mt-1 text-[10px] text-[var(--muted)]">
                  = ₹{(newProd.price_paise / 100).toLocaleString('en-IN')} INR
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300">Short Description</label>
                <textarea
                  rows={3}
                  value={newProd.short_desc}
                  onChange={(e) => setNewProd({ ...newProd, short_desc: e.target.value })}
                  placeholder="Key value proposition and use case..."
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-stone-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[var(--lime)] px-5 py-2 text-xs font-bold text-stone-950 hover:bg-[var(--lime-hi)] disabled:opacity-60"
                >
                  {saving ? 'Publishing…' : 'Publish Software'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
