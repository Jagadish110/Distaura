'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Search, CheckCircle2, Clock, Loader2, Package2 } from 'lucide-react';
import { toast } from 'sonner';

interface OrderRow {
  id: string;
  order_number: string;
  status: string;
  total_paise: number;
  billing_cycle: string | null;
  created_at: string;
  company_name: string;
  product_name: string;
  plan_name: string | null;
  invoice_number: string | null;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  supplier_confirmed: 'Confirmed',
  payment_received: 'Payment Received',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const json = await res.json();
      if (!res.ok) { toast.error(json.error ?? 'Failed to load orders'); return; }
      setOrders(json.orders ?? []);
    } catch (err: any) {
      toast.error('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchOrders(); }, []);

  async function markFulfilled(id: string) {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'delivered' }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error ?? 'Failed to update'); return; }
      toast.success('Order marked delivered.');
      fetchOrders();
    } catch (err: any) {
      toast.error('Network error: ' + err.message);
    }
  }

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      o.order_number.toLowerCase().includes(q) ||
      o.company_name.toLowerCase().includes(q) ||
      o.product_name.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
            Fulfillment &amp; Commerce
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-stone-100">
            Orders &amp; Quotations
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Process incoming corporate procurement requests, issue tax invoices, and authorize software tokens.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, company, or software..."
            className="w-full rounded-xl border border-white/10 bg-[#191a18] py-2 pl-9 pr-3 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--muted)]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#191a18] px-3 py-2 text-xs text-stone-200 focus:border-[var(--lime)] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="supplier_confirmed">Confirmed</option>
            <option value="payment_received">Payment Received</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-stone-500">
          <Loader2 className="size-5 animate-spin mr-2" />
          <span className="text-sm">Loading orders…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#1c1d1a] py-20 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Package2 className="size-8 text-stone-500" />
          </div>
          <h3 className="text-sm font-semibold text-stone-300">No Orders Yet</h3>
          <p className="mt-1 max-w-xs text-xs text-stone-500">
            {search ? 'No orders match your search.' : 'Corporate procurement orders will appear here once customers place them.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1d1a] shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 font-semibold text-stone-300">
                <tr>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Client Enterprise</th>
                  <th className="py-3.5 px-4">Software &amp; Tier</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Order Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-stone-300">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-mono font-medium text-[var(--lime-hi)]">
                      {order.order_number}
                    </td>
                    <td className="py-4 px-4 font-semibold text-stone-100">{order.company_name}</td>
                    <td className="py-4 px-4">
                      <div className="text-stone-200">{order.product_name}</div>
                      {order.plan_name && <div className="text-[10px] text-[var(--muted)]">{order.plan_name}</div>}
                    </td>
                    <td className="py-4 px-4 font-semibold text-stone-100">
                      ₹{((order.total_paise ?? 0) / 100).toLocaleString('en-IN')}
                      <span className="text-[10px] text-[var(--muted)]"> + GST</span>
                    </td>
                    <td className="py-4 px-4 text-[var(--muted)]">
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                        order.status === 'completed' || order.status === 'delivered'
                          ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : order.status === 'cancelled' || order.status === 'refunded'
                          ? 'border border-red-500/30 bg-red-500/10 text-red-400'
                          : 'border border-amber-500/30 bg-amber-500/10 text-amber-300'
                      }`}>
                        {order.status === 'completed' || order.status === 'delivered'
                          ? <CheckCircle2 className="size-3" />
                          : <Clock className="size-3" />}
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {order.status === 'payment_received' && (
                        <button
                          onClick={() => markFulfilled(order.id)}
                          className="rounded-lg bg-[var(--lime)] px-2.5 py-1 text-[11px] font-bold text-stone-950 hover:bg-[var(--lime-hi)]"
                        >
                          Fulfill &amp; Issue Key
                        </button>
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
