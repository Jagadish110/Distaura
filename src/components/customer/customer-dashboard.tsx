'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package, ShoppingCart, Bell, ArrowRight,
  FileText, Zap
} from 'lucide-react';
import { paiseToRupees } from '@/lib/constants';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';
import type { Profile, Company, Notification } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

interface Props {
  profile: Profile | null;
  company: Company | null;
  recentOrders: Array<{
    id: string;
    order_number: string;
    status: string;
    total_paise: number;
    created_at: string;
    products: { name: string; logo_url: string | null } | null;
  }>;
  notifications: Notification[];
}

const FEATURED_SOFTWARE = [
  {
    name: 'Google Workspace',
    category: 'Productivity & Email',
    price: 'From ₹145/user/mo',
    tags: ['18% ITC Eligible', 'Instant Tenant Setup'],
    badge: 'Popular',
  },
  {
    name: 'JetBrains All Products Pack',
    category: 'Developer Tools',
    price: 'From ₹24,900/seat/yr',
    tags: ['Direct INR Billing', 'Enterprise Key'],
    badge: 'High Value',
  },
  {
    name: 'Microsoft 365 Business',
    category: 'Cloud Office & Security',
    price: 'From ₹770/user/mo',
    tags: ['GST Statutory Invoice', 'Priority SLA'],
    badge: 'Enterprise',
  },
  {
    name: 'GitHub Enterprise',
    category: 'DevOps & CI/CD',
    price: 'From ₹1,850/seat/mo',
    tags: ['Indian GST Compliant', 'Volume Discount'],
    badge: 'DevOps',
  },
];

export function CustomerDashboard({ profile, company: initialCompany, recentOrders, notifications }: Props) {
  const [company, setCompany] = useState<Company | null>(initialCompany);
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';

  return (
    <div className="space-y-5 pb-8">
      {/* ── Top Header Banner ─────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-3 py-0.5 text-[11px] font-semibold text-[var(--lime-hi)]">
              <span className="size-1.5 rounded-full bg-[var(--lime)] animate-ping" />
              Customer Procurement Portal
            </span>
          </div>

          <h1
            className="mt-1.5 font-display font-bold text-white tracking-tight"
            style={{ fontSize: '1.25rem', lineHeight: '1.75rem' }}
          >
            Hi, {firstName} 👋
          </h1>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            {company?.name ? `${company.name} • ` : ''}Authorized Corporate Procurement Account
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/portal/products"
            className="group flex items-center gap-2 rounded-2xl bg-[var(--lime)] px-5 py-2.5 text-xs sm:text-sm font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)] hover:shadow-[0_0_25px_rgba(184,224,44,0.4)] active:scale-[0.99]"
          >
            <span>Browse Products</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* ── 5 Key Metrics & Action Cards ─────────────────────── */}
      <div className="grid gap-2.5 sm:gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={recentOrders.length.toString()}
          subtext="Procurement requests"
          href="/portal/orders"
        />
        <StatCard
          icon={Package}
          label="Subscriptions"
          value={recentOrders.filter((o) => o.status === 'completed').length.toString()}
          subtext="Licensed software seats"
          href="/portal/orders"
        />
        <StatCard
          icon={FileText}
          label="Tax Invoices"
          value={recentOrders.filter((o) => o.status === 'completed').length.toString()}
          subtext="18% ITC Compliant"
          href="/portal/invoices"
        />
        <StatCard
          icon={Bell}
          label="Notifications"
          value={notifications.length.toString()}
          subtext="Renewals & alerts"
          href="/portal/notifications"
        />
        <StatCard
          icon={Zap}
          label="Explore Catalogue"
          value="100+"
          subtext="Enterprise software"
          href="/portal/products"
          highlight
        />
      </div>

      {/* ── Recent Orders & Curated Catalogue ─────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-stone-100">
              Procurement & Software Orders
            </h2>
            <p className="text-xs text-[var(--muted)]">
              Track quotation status, activation keys, and statutory tax invoices.
            </p>
          </div>
          <Link href="/portal/orders" className="text-xs font-bold text-[var(--lime-hi)] hover:underline flex items-center gap-1">
            View all orders <ArrowRight className="size-3" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="rounded-3xl border border-white/5 bg-[#161714] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-white/5 gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-white/5 text-[var(--muted)]">
                  <ShoppingCart className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-200">
                    No procurement orders placed yet
                  </h3>
                  <p className="text-xs text-[var(--muted)]">
                    Explore curated corporate solutions below or submit an RFQ for bespoke multi-seat volume pricing.
                  </p>
                </div>
              </div>

              <Link
                href="/portal/products"
                className="self-start sm:self-auto rounded-xl bg-[var(--lime)] px-4 py-2 text-xs font-bold text-stone-950 hover:bg-[var(--lime-hi)] transition-all"
              >
                Explore All Products
              </Link>
            </div>

            {/* Curated enterprise software cards */}
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3.5">
                Recommended Software for Indian Enterprises
              </p>
              <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                {FEATURED_SOFTWARE.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col justify-between rounded-2xl border border-white/5 bg-[#1a1b18] p-4 hover:border-white/10 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-md border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--lime-hi)]">
                          {item.badge}
                        </span>
                        <span className="text-[10px] text-stone-400">{item.category}</span>
                      </div>
                      <h4 className="mt-2 text-xs font-bold text-stone-100">{item.name}</h4>
                      <p className="mt-1 font-display text-xs font-bold text-[var(--lime-hi)]">
                        {item.price}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-white/5 px-1.5 py-0.5 text-[9px] text-stone-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href="/portal/products"
                      className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-[11px] font-bold text-stone-200 hover:bg-[var(--lime)] hover:text-stone-950 hover:border-transparent transition-all"
                    >
                      <span>Request Quotation</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#161714]">
            {recentOrders.map((order, i) => (
              <Link
                key={order.id}
                href={`/portal/orders/${order.id}`}
                className={cn(
                  'flex items-center justify-between px-5 py-4 no-underline transition-colors hover:bg-white/5',
                  i !== 0 && 'border-t border-white/5',
                )}
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lime)]/10 text-[var(--lime)]">
                    <Package className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-100">{order.products?.name ?? 'Software Order'}</p>
                    <p className="text-xs text-[var(--muted)]">PO #{order.order_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-medium',
                      ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS],
                    )}
                  >
                    {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ?? order.status}
                  </span>
                  <span className="hidden text-sm font-semibold text-stone-200 sm:block">
                    {paiseToRupees(order.total_paise)}
                  </span>
                  <ArrowRight className="size-4 text-[var(--muted)]" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  href,
  highlight,
}: {
  icon: typeof ShoppingCart;
  label: string;
  value: string | React.ReactNode;
  subtext: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex flex-col justify-between min-h-[120px] overflow-hidden rounded-2xl border p-4 no-underline transition-all shadow-sm',
        highlight
          ? 'border-[var(--lime)]/30 bg-gradient-to-br from-[var(--lime)]/10 via-[#171815] to-[#171815] hover:border-[var(--lime)]/60 hover:bg-[#1d1f1a]'
          : 'border-white/5 bg-[#171815] hover:border-[var(--lime)]/30 hover:bg-[#1d1f1a]'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={cn('text-xs font-medium truncate', highlight ? 'text-[var(--lime-hi)]' : 'text-[var(--muted)]')}>
          {label}
        </span>
        <div
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-xl transition-all',
            highlight
              ? 'bg-[var(--lime)] text-stone-950 group-hover:scale-105'
              : 'bg-[var(--lime)]/10 text-[var(--lime)] group-hover:bg-[var(--lime)] group-hover:text-stone-950'
          )}
        >
          <Icon className="size-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="font-display text-2xl sm:text-3xl font-extrabold text-stone-100 flex items-center gap-1.5">
          {value}
        </div>
        <p className="mt-0.5 text-[11px] text-stone-400">{subtext}</p>
      </div>
    </Link>
  );
}

