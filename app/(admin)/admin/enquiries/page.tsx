'use client';

import { useState, useEffect } from 'react';
import {
  Search, Mail, Phone, Building2, Loader2, MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

interface EnquiryRow {
  id: string;
  enquiry_type: 'business' | 'supplier';
  name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  message: string;
  status: 'new' | 'in_progress' | 'responded' | 'closed';
  created_at: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'business' | 'supplier'>('all');

  async function fetchEnquiries() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/enquiries');
      const json = await res.json();
      if (!res.ok) { toast.error(json.error ?? 'Failed to load enquiries'); return; }
      setEnquiries(json.enquiries ?? []);
    } catch (err: any) {
      toast.error('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchEnquiries(); }, []);

  async function updateStatus(id: string, status: EnquiryRow['status']) {
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error ?? 'Failed to update'); return; }
      toast.success(`Status updated to ${status.replace('_', ' ')}`);
      setEnquiries(enquiries.map(e => e.id === id ? { ...e, status } : e));
    } catch (err: any) {
      toast.error('Network error: ' + err.message);
    }
  }

  const filtered = enquiries.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      e.name.toLowerCase().includes(q) ||
      (e.company_name ?? '').toLowerCase().includes(q) ||
      e.message.toLowerCase().includes(q);
    const matchType = typeFilter === 'all' || e.enquiry_type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
          Inbound Commercial Pipeline
        </p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-stone-100">
          Inbound Enquiries &amp; Leads
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Track business procurement leads and OEM software partnership submissions from public desks.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lead by name, company, or requirement..."
            className="w-full rounded-xl border border-white/10 bg-[#191a18] py-2 pl-9 pr-3 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--muted)]">Channel:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="rounded-xl border border-white/10 bg-[#191a18] px-3 py-2 text-xs text-stone-200 focus:border-[var(--lime)] focus:outline-none"
          >
            <option value="all">All Enquiries</option>
            <option value="business">Business Solutions</option>
            <option value="supplier">Supplier Partnerships</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-stone-500">
          <Loader2 className="size-5 animate-spin mr-2" />
          <span className="text-sm">Loading enquiries…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#1c1d1a] py-20 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <MessageSquare className="size-8 text-stone-500" />
          </div>
          <h3 className="text-sm font-semibold text-stone-300">No Enquiries Yet</h3>
          <p className="mt-1 max-w-xs text-xs text-stone-500">
            {search ? 'No enquiries match your search.' : 'Business and supplier enquiries submitted through public forms will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((enq) => (
            <div
              key={enq.id}
              className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-6 shadow-md transition-all hover:border-white/20"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <span className={`rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                    enq.enquiry_type === 'supplier'
                      ? 'border border-purple-500/30 bg-purple-500/10 text-purple-300'
                      : 'border border-[var(--lime)]/30 bg-[var(--lime)]/10 text-[var(--lime-hi)]'
                  }`}>
                    {enq.enquiry_type === 'supplier' ? 'Supplier OEM' : 'Enterprise Buyer'}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {new Date(enq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[var(--muted)]">Pipeline Status:</span>
                  <select
                    value={enq.status}
                    onChange={(e) => updateStatus(enq.id, e.target.value as any)}
                    className="rounded-lg border border-white/10 bg-[#161715] px-2.5 py-1 text-xs text-stone-200 focus:border-[var(--lime)] focus:outline-none"
                  >
                    <option value="new">New Lead</option>
                    <option value="in_progress">In Progress</option>
                    <option value="responded">Quotation Sent</option>
                    <option value="closed">Closed / Won</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 grid gap-6 md:grid-cols-12">
                <div className="md:col-span-4 space-y-1">
                  <h3 className="font-display text-base font-bold text-stone-100">{enq.name}</h3>
                  {enq.company_name && (
                    <p className="text-xs font-medium text-stone-300 flex items-center gap-1.5">
                      <Building2 className="size-3.5 text-stone-400" />
                      {enq.company_name}
                    </p>
                  )}
                  <p className="text-xs text-[var(--muted)] flex items-center gap-1.5">
                    <Mail className="size-3.5 text-stone-400" />
                    {enq.email}
                  </p>
                  {enq.phone && (
                    <p className="text-xs text-[var(--muted)] flex items-center gap-1.5">
                      <Phone className="size-3.5 text-stone-400" />
                      {enq.phone}
                    </p>
                  )}
                </div>

                <div className="md:col-span-8 rounded-xl border border-white/5 bg-[#161715] p-4 text-xs text-stone-300 leading-relaxed">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">
                    Submitted Note / Specifications:
                  </span>
                  {enq.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
