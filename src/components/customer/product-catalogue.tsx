'use client';

import { useMemo, useState } from 'react';
import { Search, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { paiseToRupees } from '@/lib/constants';
import { PLAN_TYPE_LABELS } from '@/lib/constants';
import type { PublicProduct } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

interface Props {
  products: PublicProduct[];
  categories: Array<{ id: string; name: string; slug: string }>;
}

export function ProductCatalogue({ products, categories }: Props) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [planType, setPlanType] = useState('');

  // Deduplicate — view returns one row per plan
  const uniqueProducts = useMemo(() => {
    const seen = new Set<string>();
    return products.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [products]);

  const filtered = useMemo(() => {
    return uniqueProducts.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.short_desc ?? '').toLowerCase().includes(search.toLowerCase());
      const matchCategory = !category || p.category_id === category;
      const matchPlan =
        !planType ||
        products.some((row) => row.id === p.id && row.plan_type === planType);
      return matchSearch && matchCategory && matchPlan;
    });
  }, [uniqueProducts, products, search, category, planType]);

  // Get plans for a product
  const getPlans = (productId: string) =>
    products.filter((p) => p.id === productId && p.plan_id);

  return (
    <div className="space-y-6">
      <div>
        <p className="folio">Products</p>
        <h1
          className="mt-1 font-display font-bold text-stone-100 tracking-tight"
          style={{ fontSize: '1.25rem', lineHeight: '1.75rem' }}
        >
          Browse Software
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="search"
            placeholder="Search products…"
            className="w-full pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="min-w-[160px]"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={planType}
          onChange={(e) => setPlanType(e.target.value)}
          className="min-w-[140px]"
        >
          <option value="">All billing</option>
          {Object.entries(PLAN_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/5 bg-[var(--card)] py-16 text-center">
          <Package className="size-10 text-[var(--muted)]" />
          <p className="font-medium">No products found</p>
          <button
            onClick={() => { setSearch(''); setCategory(''); setPlanType(''); }}
            className="btn alt sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => {
            const plans = getPlans(product.id);
            const lowestPlan = plans.sort((a, b) => (a.price_paise ?? 0) - (b.price_paise ?? 0))[0];
            return (
              <Link
                key={product.id}
                href={`/portal/products/${product.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-white/5 bg-[#171815] p-4 no-underline transition-all hover:border-[var(--lime)]/30 hover:bg-[#1d1f1a] shadow-sm hover:-translate-y-0.5"
              >
                <div>
                  {/* Logo + Category */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--lime)]/10 text-[var(--lime)]">
                      {product.logo_url ? (
                        <img src={product.logo_url} alt={product.name} className="size-7 object-contain" />
                      ) : (
                        <Package className="size-4 text-[var(--lime)]" />
                      )}
                    </div>
                    {product.category_name && (
                      <span className="rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-stone-400">
                        {product.category_name}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="mt-3">
                    <p className="text-xs sm:text-sm font-bold text-stone-100 group-hover:text-[var(--lime-hi)] transition-colors">
                      {product.name}
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--muted)] line-clamp-2 leading-relaxed">
                      {product.short_desc}
                    </p>
                  </div>

                  {/* Supplier */}
                  <p className="mt-2 text-[10px] text-stone-500">By {product.supplier_name}</p>
                </div>

                {/* Price */}
                {lowestPlan && (
                  <div className="mt-3 border-t border-white/5 pt-2.5 flex items-baseline justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-stone-500 font-medium">Starting from</span>
                      <p className="font-display text-xs sm:text-sm font-bold text-stone-100 group-hover:text-[var(--lime-hi)] transition-colors">
                        {paiseToRupees(lowestPlan.price_paise ?? 0)}
                        <span className="ml-1 text-[10px] font-normal text-[var(--muted)]">
                          / {PLAN_TYPE_LABELS[lowestPlan.plan_type as keyof typeof PLAN_TYPE_LABELS]?.toLowerCase() ?? lowestPlan.plan_type}
                        </span>
                      </p>
                    </div>
                    <span className="text-[10px] font-medium text-stone-400 group-hover:text-[var(--lime-hi)] transition-colors flex items-center gap-0.5">
                      View <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
