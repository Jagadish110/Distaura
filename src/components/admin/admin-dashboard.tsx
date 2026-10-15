'use client';

import Link from 'next/link';
import { ShoppingCart, DollarSign, HelpCircle, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import { paiseToRupees } from '@/lib/constants';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface Stats {
  totalOrders: number;
  pendingCommissionsCount: number;
  pendingCommissionsValue: number;
  newEnquiries: number;
}

interface Props {
  stats: Stats;
  recentOrders: Array<{ id: string; order_number?: string; status: string; total_paise: number; created_at: string }>;
  pendingCommissions: Array<{ id: string; status: string; commission_amount_paise: number; due_date: string | null }>;
  newEnquiries: Array<{ id: string; name: string; enquiry_type: string; created_at: string }>;
}

export function AdminDashboard({ stats, recentOrders, pendingCommissions, newEnquiries }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <p className="folio">Admin</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">Dashboard</h1>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} href="/admin/orders" />
        <KPICard
          icon={DollarSign}
          label="Commission Due"
          value={paiseToRupees(stats.pendingCommissionsValue)}
          sub={`${stats.pendingCommissionsCount} open`}
          href="/admin/commissions"
          urgent={stats.pendingCommissionsCount > 0}
        />
        <KPICard icon={HelpCircle} label="New Enquiries" value={stats.newEnquiries} href="/admin/enquiries" urgent={stats.newEnquiries > 0} />
        <KPICard icon={TrendingUp} label="Active Suppliers" value="—" href="/admin/suppliers" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <section className="card !p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-[var(--lime-hi)] hover:underline">View all →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-[var(--muted)]">No orders yet</p>
          ) : (
            recentOrders.map((order, i) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className={cn(
                  'flex items-center justify-between px-5 py-3.5 no-underline hover:bg-white/5 transition-colors',
                  i !== 0 && 'border-t border-white/5',
                )}
              >
                <div>
                  <p className="text-sm font-medium">{order.order_number ?? order.id.slice(0, 8)}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS])}>
                    {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ?? order.status}
                  </span>
                  <span className="text-sm">{paiseToRupees(order.total_paise)}</span>
                  <ArrowRight className="size-4 text-[var(--muted)]" />
                </div>
              </Link>
            ))
          )}
        </section>

        {/* Commissions Due */}
        <section className="card !p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <h2 className="font-semibold">Commissions Due</h2>
            <Link href="/admin/commissions" className="text-xs text-[var(--lime-hi)] hover:underline">View all →</Link>
          </div>
          {pendingCommissions.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-[var(--muted)]">All clear ✓</p>
          ) : (
            pendingCommissions.map((comm, i) => (
              <Link
                key={comm.id}
                href={`/admin/commissions/${comm.id}`}
                className={cn(
                  'flex items-center justify-between px-5 py-3.5 no-underline hover:bg-white/5 transition-colors',
                  i !== 0 && 'border-t border-white/5',
                )}
              >
                <div className="flex items-center gap-2">
                  <Clock className={cn('size-4', comm.status === 'overdue' ? 'text-red-400' : 'text-amber-400')} />
                  <div>
                    <p className="text-sm font-medium capitalize">{comm.status}</p>
                    <p className="text-xs text-[var(--muted)]">
                      Due {comm.due_date ? new Date(comm.due_date).toLocaleDateString('en-IN') : '—'}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold">{paiseToRupees(comm.commission_amount_paise)}</span>
              </Link>
            ))
          )}
        </section>
      </div>

      {/* New Enquiries */}
      {newEnquiries.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">New Enquiries</h2>
            <Link href="/admin/enquiries" className="text-xs text-[var(--lime-hi)] hover:underline">View all →</Link>
          </div>
          <div className="card !p-0 overflow-hidden">
            {newEnquiries.map((enq, i) => (
              <Link
                key={enq.id}
                href={`/admin/enquiries/${enq.id}`}
                className={cn(
                  'flex items-center justify-between px-5 py-3.5 no-underline hover:bg-white/5 transition-colors',
                  i !== 0 && 'border-t border-white/5',
                )}
              >
                <div>
                  <p className="text-sm font-medium">{enq.name}</p>
                  <p className="text-xs capitalize text-[var(--muted)]">{enq.enquiry_type} enquiry</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">New</span>
                  <ArrowRight className="size-4 text-[var(--muted)]" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function KPICard({
  icon: Icon,
  label,
  value,
  sub,
  href,
  urgent,
}: {
  icon: typeof ShoppingCart;
  label: string;
  value: string | number;
  sub?: string;
  href: string;
  urgent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'card group flex flex-col gap-2 no-underline transition-all hover:border-[var(--lime)]/30',
        urgent && 'border-amber-500/30',
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors', urgent ? 'bg-amber-500/15' : 'bg-[var(--lime)]/10 group-hover:bg-[var(--lime)]/20')}>
          <Icon className={cn('size-5', urgent ? 'text-amber-400' : 'text-[var(--lime)]')} />
        </div>
        <p className="text-xs text-[var(--muted)]">{label}</p>
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      {sub && <p className="text-xs text-[var(--muted)]">{sub}</p>}
    </Link>
  );
}
