'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, Download, CheckCircle2, Clock,
  AlertCircle, Package, ShoppingCart,
} from 'lucide-react';
export interface CustomerOrder {
  id: string;
  order_number: string;
  product_name: string;
  plan_name: string | null;
  total_paise: number;
  billing_cycle: string | null;
  status: string;
  created_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending:            { label: 'Pending',           color: 'border-amber-500/30 bg-amber-500/10 text-amber-400',   icon: Clock },
  supplier_confirmed: { label: 'Confirmed',         color: 'border-blue-500/30 bg-blue-500/10 text-blue-400',      icon: Clock },
  payment_received:   { label: 'Payment Received',  color: 'border-blue-500/30 bg-blue-500/10 text-blue-400',      icon: Clock },
  delivered:          { label: 'Delivered',         color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400', icon: CheckCircle2 },
  completed:          { label: 'Active License',    color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400', icon: CheckCircle2 },
  cancelled:          { label: 'Cancelled',         color: 'border-red-500/30 bg-red-500/10 text-red-400',         icon: AlertCircle },
  refunded:           { label: 'Refunded',          color: 'border-stone-500/30 bg-stone-500/10 text-stone-400',   icon: AlertCircle },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  orders: CustomerOrder[];
}

export function OrdersPage({ orders }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = orders.filter(
    (o) =>
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.product_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
            Purchases &amp; Fulfillment
          </p>
          <h1
            className="mt-1 font-display font-bold text-stone-100 tracking-tight"
            style={{ fontSize: '1.25rem', lineHeight: '1.75rem' }}
          >
            Order History
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Manage your company's procured software licenses, delivery credentials, and tax invoices.
          </p>
        </div>

        <Link
          href="/portal/products"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--lime)] px-4 py-2.5 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)]"
        >
          <Package className="size-4" />
          Procure New Software
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by order # or product name..."
          className="w-full rounded-xl border border-white/10 bg-[#191a18] py-2.5 pl-10 pr-4 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1d1a] shadow-lg">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingCart className="size-10 text-stone-600" />
            <h3 className="mt-4 font-display text-base font-semibold text-stone-300">
              No orders yet
            </h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Your software procurement history will appear here.
            </p>
            <Link
              href="/portal/products"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--lime)] px-4 py-2.5 text-xs font-bold text-stone-950 hover:bg-[var(--lime-hi)]"
            >
              <Package className="size-4" />
              Browse Catalogue
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 font-semibold text-stone-300">
                <tr>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Software &amp; Tier</th>
                  <th className="py-3.5 px-4">Amount (INR)</th>
                  <th className="py-3.5 px-4">Order Date</th>
                  <th className="py-3.5 px-4">License Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-stone-300">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-500">
                      No orders matched your search
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => {
                    const cfg = STATUS_CONFIG[order.status] ?? {
                      label: order.status,
                      color: 'border-white/10 bg-white/5 text-stone-400',
                      icon: Clock,
                    };
                    const Icon = cfg.icon;

                    return (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4 font-mono font-medium text-[var(--lime-hi)]">
                          {order.order_number}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-stone-100">{order.product_name}</div>
                          {order.plan_name && (
                            <div className="text-[11px] text-[var(--muted)]">{order.plan_name}</div>
                          )}
                          {order.billing_cycle && (
                            <div className="text-[10px] text-[var(--muted)] capitalize">
                              {order.billing_cycle}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 font-medium text-stone-100">
                          ₹{(order.total_paise / 100).toLocaleString('en-IN')}
                          <span className="ml-1 text-[10px] text-[var(--muted)]">+ GST</span>
                        </td>
                        <td className="py-4 px-4 text-[var(--muted)]">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cfg.color}`}
                          >
                            <Icon className="size-3" />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                alert(`Invoice download for order ${order.order_number} — coming soon`)
                              }
                              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-stone-300 hover:bg-white/10"
                              title="Download Tax Invoice"
                            >
                              <Download className="size-3" />
                              Invoice
                            </button>
                            <Link
                              href="/portal/products"
                              className="inline-flex items-center gap-1 rounded-lg border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--lime-hi)] hover:bg-[var(--lime)]/20"
                            >
                              Upgrade
                            </Link>
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
    </div>
  );
}
