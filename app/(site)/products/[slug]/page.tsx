import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck, CheckCircle2, ArrowRight, Building2,
  Star, ChevronRight, Lock,
} from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { PublicProduct } from '@/lib/supabase/types';

// ── Data layer ────────────────────────────────────────────────────────────────

interface Plan {
  id: string;
  name: string;
  plan_type: string;
  price_paise: number;
  currency: string;
  tax_inclusive: boolean;
  user_limit: number | null;
  features: string[];
  plan_sort: number;
  recommended?: boolean;
}

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  short_desc: string | null;
  description: string | null;
  features: string[];
  demo_url: string | null;
  delivery_time: string | null;
  category_name: string | null;
  supplier_name: string;
  plans: Plan[];
}

async function getProduct(slug: string): Promise<ProductDetail | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('public_products')
    .select('*')
    .eq('slug', slug);

  if (error || !data || data.length === 0) return null;

  const first = data[0] as PublicProduct;

  // Deduplicate plans from the flat view rows
  const planMap = new Map<string, Plan>();
  for (const row of data as PublicProduct[]) {
    if (row.plan_id && !planMap.has(row.plan_id)) {
      planMap.set(row.plan_id, {
        id: row.plan_id,
        name: row.plan_name ?? '',
        plan_type: row.plan_type ?? 'monthly',
        price_paise: row.price_paise ?? 0,
        currency: row.currency ?? 'INR',
        tax_inclusive: row.tax_inclusive ?? false,
        user_limit: row.user_limit ?? null,
        features: row.plan_features ?? [],
        plan_sort: row.plan_sort ?? 0,
      });
    }
  }

  const plans = Array.from(planMap.values()).sort((a, b) => a.plan_sort - b.plan_sort);
  // Mark the middle plan as recommended if there are 2+ plans and none is flagged
  if (plans.length >= 2) {
    plans[Math.floor(plans.length / 2)].recommended = true;
  }

  return {
    id: first.id,
    name: first.name,
    slug: first.slug,
    short_desc: first.short_desc,
    description: first.description,
    features: first.features,
    demo_url: first.demo_url,
    delivery_time: first.delivery_time,
    category_name: first.category_name,
    supplier_name: first.supplier_name,
    plans,
  };
}

// ── generateMetadata ──────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('public_products')
    .select('name, short_desc')
    .eq('slug', slug)
    .limit(1)
    .single();

  const product = data as any;
  return {
    title: product ? `${product.name} | Distaura` : 'Product | Distaura',
    description: product?.short_desc ?? '',
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const lowestPricePaise = Math.min(...product.plans.map((p) => p.price_paise));
  const lowestPriceRupees = lowestPricePaise / 100;

  return (
    <div className="pt-28 pb-20">
      {/* Breadcrumb */}
      <div className="wrap">
        <nav className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <Link href="/" className="hover:text-stone-200">Home</Link>
          <ChevronRight className="size-3.5" />
          <Link href="/products" className="hover:text-stone-200">Catalogue</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-stone-300 font-medium">{product.name}</span>
        </nav>
      </div>

      {/* Hero Overview */}
      <section className="wrap mt-6">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Main Info */}
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-2">
              {product.category_name && (
                <span className="rounded-md border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--lime-hi)]">
                  {product.category_name}
                </span>
              )}
              <span className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-stone-300">
                <Building2 className="size-3 text-stone-400" />
                Verified OEM: {product.supplier_name}
              </span>
            </div>

            <h1 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-100">
              {product.name}
            </h1>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-stone-300">
              {product.description ?? product.short_desc}
            </p>

            {/* Key Capabilities */}
            {product.features.length > 0 && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-[#1c1d1a] p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
                  Core Enterprise Capabilities
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-200">
                      <CheckCircle2 className="size-4 shrink-0 text-[var(--lime)] mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery info */}
            {product.delivery_time && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-[#1c1d1a] p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-200">
                  Delivery &amp; Fulfilment
                </h2>
                <div className="mt-3 flex items-center gap-2 text-xs text-stone-300">
                  <ShieldCheck className="size-4 shrink-0 text-[var(--lime)]" />
                  <span>{product.delivery_time}</span>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Side Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 rounded-2xl border border-[var(--lime)]/30 bg-[#212320]/90 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
              <span className="rounded-md border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--lime-hi)]">
                Distaura Distribution Guarantee
              </span>
              <h3 className="mt-3 font-display text-xl font-bold text-stone-100">
                Procure with Complete Safety
              </h3>
              <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                Direct vendor licensing, GST tax invoice with full ITC credit eligibility, and local
                implementation support.
              </p>

              {product.plans.length > 0 && (
                <div className="my-5 border-t border-white/10 pt-4">
                  <div className="text-xs text-[var(--muted)]">Starting at</div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-display text-3xl font-extrabold text-stone-100">
                      ₹{lowestPriceRupees.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[var(--muted)]">+ 18% GST</span>
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                <Link
                  href={`/sign-up?product=${encodeURIComponent(product.slug)}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--lime)] py-3 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)] hover:shadow-[0_0_20px_rgba(184,224,44,0.4)]"
                >
                  Create Account &amp; Procure
                  <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  href={`/find-a-solution?product=${encodeURIComponent(product.name)}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 text-xs font-semibold text-stone-200 transition-colors hover:bg-white/10"
                >
                  Request Formal Quotation / PO
                </Link>
              </div>

              <div className="mt-5 space-y-2 border-t border-white/5 pt-4 text-[11px] text-[var(--muted)]">
                <div className="flex items-center gap-2">
                  <Lock className="size-3.5 text-[var(--lime)]" />
                  <span>Official tax invoice on confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-[var(--lime)]" />
                  <span>Distaura escrow &amp; delivery warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      {product.plans.length > 0 && (
        <section className="wrap mt-20">
          <div className="text-center max-w-2xl mx-auto">
            <span className="rounded-md border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-3 py-1 text-xs font-semibold text-[var(--lime-hi)]">
              Subscription &amp; Licensing
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-stone-100">
              Available Licensing Plans
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Choose the tier matching your team size or deployment scale.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {product.plans.map((plan) => {
              const priceRupees = plan.price_paise / 100;
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all ${
                    plan.recommended
                      ? 'border-2 border-[var(--lime)] bg-[#212420] shadow-[0_20px_40px_rgba(184,224,44,0.15)]'
                      : 'border border-white/10 bg-[#1c1d1a]'
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--lime)] px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-stone-950">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <h3 className="font-display text-xl font-bold text-stone-100">{plan.name}</h3>
                    <p className="mt-1 text-xs text-[var(--muted)] capitalize">
                      {plan.plan_type.replace('_', '-')} billing
                      {plan.user_limit ? ` · up to ${plan.user_limit} users` : ''}
                    </p>

                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="font-display text-3xl font-extrabold text-stone-100">
                        ₹{priceRupees.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-[var(--muted)]">INR</span>
                    </div>

                    {plan.features.length > 0 && (
                      <div className="mt-6 border-t border-white/10 pt-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-300">
                          Included Features
                        </p>
                        <ul className="mt-3 space-y-2.5">
                          {plan.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-stone-300">
                              <CheckCircle2 className="size-3.5 shrink-0 text-[var(--lime)] mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 border-t border-white/5 pt-4">
                    <Link
                      href={`/sign-up?product=${encodeURIComponent(product.slug)}&plan=${encodeURIComponent(plan.name)}`}
                      className={`w-full block py-2.5 rounded-xl text-center text-xs font-semibold transition-all ${
                        plan.recommended
                          ? 'bg-[var(--lime)] text-stone-950 hover:bg-[var(--lime-hi)]'
                          : 'border border-white/15 bg-white/5 text-stone-200 hover:bg-white/10'
                      }`}
                    >
                      Select Plan
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
