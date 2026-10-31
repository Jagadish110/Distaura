'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, ShieldCheck, Sparkles, Building2, Layers } from 'lucide-react';
import type { PublicProduct } from '@/lib/supabase/types';
import { offerings } from '@/lib/offerings';
import { whatsappLink } from '@/lib/site';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  slug: string;
}

// Group flat view rows (one row per plan) into products with a `plans` array.
interface ProductWithPlans {
  id: string;
  name: string;
  slug: string;
  short_desc: string | null;
  features: string[];
  category_name: string | null;
  category_slug: string | null;
  supplier_name: string;
  lowestPricePaise: number;
  plans: Array<{
    id: string;
    name: string;
    plan_type: string;
    price_paise: number;
  }>;
}

function groupProducts(rows: PublicProduct[]): ProductWithPlans[] {
  const map = new Map<string, ProductWithPlans>();

  for (const row of rows) {
    if (!map.has(row.id)) {
      map.set(row.id, {
        id: row.id,
        name: row.name,
        slug: row.slug,
        short_desc: row.short_desc,
        features: row.features,
        category_name: row.category_name,
        category_slug: row.category_slug,
        supplier_name: row.supplier_name,
        lowestPricePaise: Infinity,
        plans: [],
      });
    }

    const prod = map.get(row.id)!;

    if (row.plan_id && row.price_paise != null) {
      prod.plans.push({
        id: row.plan_id,
        name: row.plan_name ?? '',
        plan_type: row.plan_type ?? '',
        price_paise: row.price_paise,
      });
      if (row.price_paise < prod.lowestPricePaise) {
        prod.lowestPricePaise = row.price_paise;
      }
    }
  }

  return Array.from(map.values());
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  rows: PublicProduct[];
  categories: Category[];
}

const INDICATIVE_PREFIX = 'Indicative price:';

export function CataloguePage({ rows, categories }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  const products = useMemo(() => groupProducts(rows), [rows]);
  const hasPlans = products.some((p) => p.plans.length > 0);
  const usedCategories = useMemo(
    () => categories.filter((c) => products.some((p) => p.category_slug === c.slug)),
    [categories, products],
  );

  const filtered = useMemo(() => {
    return products.filter((prod) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        prod.name.toLowerCase().includes(q) ||
        (prod.short_desc ?? '').toLowerCase().includes(q) ||
        (prod.category_name ?? '').toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'all' || prod.category_slug === selectedCategory;

      const matchesPlan =
        planFilter === 'all' || prod.plans.some((p) => p.plan_type === planFilter);

      return matchesSearch && matchesCategory && matchesPlan;
    });
  }, [products, search, selectedCategory, planFilter]);

  return (
    <div className="pt-28 pb-20">
      {/* Hero Header */}
      <section className="wrap relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-3.5 py-1 text-xs font-semibold text-[var(--lime-hi)] backdrop-blur-sm">
            <Sparkles className="size-3.5" />
            Software &amp; Services Catalogue
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-100">
            Solutions for your business, <br />
            <span className="text-[var(--lime-hi)]">quoted to your requirement.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            Browse the solutions we distribute in partnership with our suppliers. Every listing can
            be enquired about directly, and pricing is confirmed in a written quotation.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        {products.length > 0 && (
        <div className="mt-10 rounded-2xl border border-white/10 bg-[#212320]/80 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search solutions by name or keyword..."
                className="w-full rounded-xl border border-white/10 bg-[#161715] py-3 pl-11 pr-4 text-sm text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none focus:ring-1 focus:ring-[var(--lime)]"
              />
            </div>

            {/* Billing model */}
            {hasPlans && (
            <div className="flex items-center gap-2">
              <label htmlFor="plan-filter" className="text-xs text-[var(--muted)] whitespace-nowrap">
                Billing:
              </label>
              <select
                id="plan-filter"
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#161715] px-3 py-3 text-xs text-stone-200 focus:border-[var(--lime)] focus:outline-none"
              >
                <option value="all">All Models</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
                <option value="one_time">One-time</option>
              </select>
            </div>
            )}
          </div>

          {/* Category Chips */}
          <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[var(--lime)] text-stone-950 shadow-[0_0_12px_rgba(184,224,44,0.3)]'
                  : 'border border-white/5 bg-[#171816] text-stone-400 hover:border-white/15 hover:text-stone-200'
              }`}
            >
              All Solutions
            </button>
            {usedCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-[var(--lime)] text-stone-950 shadow-[0_0_12px_rgba(184,224,44,0.3)]'
                    : 'border border-white/5 bg-[#171816] text-stone-400 hover:border-white/15 hover:text-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        )}
      </section>

      {/* Catalogue Grid */}
      <section className="wrap mt-10">
        {products.length > 0 && (
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <p className="text-sm text-[var(--muted)]">
            Showing <span className="font-semibold text-stone-200">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'solution' : 'solutions'}
          </p>
          <Link
            href="/find-a-solution"
            className="text-xs font-medium text-[var(--lime-hi)] hover:underline flex items-center gap-1"
          >
            Looking for something specific? Request a quote{' '}
            <ArrowRight className="size-3" />
          </Link>
        </div>
        )}

        {offerings.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map((o) => (
              <div
                key={o.slug}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#1e201d] p-6"
              >
                <div>
                  <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
                    <Building2 className="size-3" /> {o.supplier}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold text-stone-100">{o.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{o.summary}</p>
                  <p className="mt-3 text-xs text-stone-300">
                    <span className="font-semibold">Best for:</span> {o.targetCustomers}
                  </p>
                  <ul className="mt-3 space-y-2 border-t border-white/5 pt-3">
                    {o.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-stone-300">
                        <ShieldCheck className="size-3.5 shrink-0 text-[var(--lime)] mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="text-sm font-semibold text-stone-100">{o.priceNote ?? 'Price on request'}</p>
                  <a
                    href={whatsappLink(`Hi Distaura, I'm interested in ${o.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block rounded-xl bg-[var(--lime)] py-2.5 text-center text-xs font-semibold text-stone-950 no-underline hover:bg-[var(--lime-hi)]"
                  >
                    Contact Distaura
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {products.length === 0 && offerings.length === 0 ? (
          <div className="my-16 rounded-2xl border border-[var(--lime)]/20 bg-[#1c1d1a] p-10 text-center sm:p-14">
            <Layers className="mx-auto size-12 text-[var(--lime)]" />
            <h3 className="mt-4 font-display text-2xl font-semibold text-stone-100">
              Our catalogue is being finalised
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
              We are confirming the solutions we offer with our supplier partners. Tell us what your
              business needs and we will let you know what we can provide, with a written quote.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/find-a-solution"
                className="rounded-xl bg-[var(--lime)] px-5 py-3 text-xs font-bold text-stone-950 no-underline hover:bg-[var(--lime-hi)]"
              >
                Request a Quote
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-medium text-stone-200 no-underline hover:bg-white/10"
              >
                Contact us
              </Link>
            </div>
          </div>
        ) : products.length === 0 ? null : filtered.length === 0 ? (
          <div className="my-16 rounded-2xl border border-white/10 bg-[#1c1d1a] p-12 text-center">
            <Layers className="mx-auto size-12 text-stone-500" />
            <h3 className="mt-4 font-display text-lg font-semibold text-stone-200">
              No software matched your query
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Try adjusting your search criteria or explore our custom procurement assistance.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setPlanFilter('all');
              }}
              className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-stone-300 hover:bg-white/10"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => {
              const priceRupees =
                product.lowestPricePaise === Infinity ? 0 : product.lowestPricePaise / 100;
              const indicative = product.features.find((f) => f.startsWith(INDICATIVE_PREFIX));
              const otherFeatures = product.features.filter((f) => f !== indicative);
              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#1e201d] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--lime)]/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="rounded-md border border-[var(--lime)]/20 bg-[var(--lime)]/10 px-2 py-0.5 font-medium text-[var(--lime-hi)]">
                        {product.category_name ?? 'Software'}
                      </span>
                      <span className="flex items-center gap-1 text-[var(--muted)]">
                        <Building2 className="size-3" />
                        {product.supplier_name.split(' ')[0]}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="mt-4 font-display text-xl font-bold text-stone-100 group-hover:text-[var(--lime-hi)] transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--muted)] line-clamp-3">
                      {product.short_desc}
                    </p>

                    {/* Features */}
                    <ul className="mt-4 space-y-2 border-t border-white/5 pt-3">
                      {otherFeatures.slice(0, 3).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-stone-300">
                          <ShieldCheck className="size-3.5 shrink-0 text-[var(--lime)] mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="mt-6 border-t border-white/10 pt-4">
                    {product.plans.length > 0 ? (
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                            Approved list price
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="font-display text-2xl font-bold text-stone-100">
                              ₹{priceRupees.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-[var(--muted)]">/ mo</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400">+ 18% GST</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                          {indicative ? 'Indicative price' : 'Pricing'}
                        </span>
                        <p className="font-display text-lg font-bold text-stone-100">
                          {indicative
                            ? indicative.slice(INDICATIVE_PREFIX.length).replace(/\s*\+ GST$/, '').trim()
                            : 'Price on request'}
                        </p>
                        <span className="text-[10px] text-stone-400">
                          {indicative ? 'Before GST · final price confirmed in your quote' : 'Confirmed in your quote'}
                        </span>
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-2">
                      <a
                        href={whatsappLink(`Hi Distaura, I'm interested in ${product.name}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-xl bg-[var(--lime)] py-2.5 text-center text-xs font-semibold text-stone-950 no-underline transition-all hover:bg-[var(--lime-hi)] hover:shadow-[0_0_15px_rgba(184,224,44,0.4)]"
                      >
                        Contact Distaura
                      </a>
                      <Link
                        href={`/products/${product.slug}`}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-center text-xs font-medium text-stone-300 transition-colors hover:bg-white/10"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Procurement Callout */}
      <section className="wrap mt-20">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--lime)]/30 bg-gradient-to-r from-[#22271d] via-[#1a1b19] to-[#22271d] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="max-w-2xl">
            <span className="rounded-md border border-[var(--lime)]/40 bg-[var(--lime)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--lime-hi)]">
              Procurement Desk
            </span>
            <h2 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-stone-100">
              Need something specific, or a quote for your team?
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
              Tell us your requirement and budget range. We will confirm scope and terms with the
              supplier and come back with a written quotation.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/find-a-solution"
                className="rounded-xl bg-[var(--lime)] px-5 py-3 text-xs font-bold text-stone-950 transition-transform active:scale-95 hover:bg-[var(--lime-hi)]"
              >
                Request a Quote
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-medium text-stone-200 hover:bg-white/10"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
