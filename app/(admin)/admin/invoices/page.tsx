'use client';

import { useState } from 'react';
import { 
  FileText, Search, Download, Plus, CheckCircle2, 
  Clock, ShieldCheck, ArrowDownToLine 
} from 'lucide-react';
import { toast } from 'sonner';

interface TaxInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  taxableValueRupees: number;
  gstRupees: number;
  totalRupees: number;
  date: string;
  status: 'paid' | 'unpaid';
}

const MOCK_INVOICES: TaxInvoice[] = [
  
];

export default function AdminInvoicesPage() {
  const [invoices] = useState<TaxInvoice[]>(MOCK_INVOICES);
  const [search, setSearch] = useState('');

  const filtered = invoices.filter(
    (i) =>
      i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      i.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
            Statutory Billing & GST Ledger
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-stone-100">
            GST Tax Invoices & Credit Notes
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Compliant e-invoicing series, HSN/SAC breakdowns, and Input Tax Credit (ITC) reconciliation.
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by invoice # or enterprise..."
          className="w-full rounded-xl border border-white/10 bg-[#191a18] py-2 pl-9 pr-3 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1d1a] shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/5 font-semibold text-stone-300">
              <tr>
                <th className="py-3.5 px-4">Invoice Serial</th>
                <th className="py-3.5 px-4">Buyer Enterprise</th>
                <th className="py-3.5 px-4">Taxable Value</th>
                <th className="py-3.5 px-4">GST (18%)</th>
                <th className="py-3.5 px-4">Gross Total</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-stone-300">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-mono font-medium text-[var(--lime-hi)]">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-4 px-4 font-semibold text-stone-100">
                    {inv.customerName}
                  </td>
                  <td className="py-4 px-4 font-medium text-stone-200">
                    ₹{inv.taxableValueRupees.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4 text-stone-300">
                    ₹{inv.gstRupees.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4 font-semibold text-stone-100">
                    ₹{inv.totalRupees.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4 text-[var(--muted)]">
                    {inv.date}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toast.success(`Downloading PDF for ${inv.invoiceNumber}`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-stone-300 hover:bg-white/10"
                      >
                        <ArrowDownToLine className="size-3 text-[var(--lime)]" />
                        PDF
                      </button>
                      <button
                        onClick={() => toast.info(`Issue credit note against ${inv.invoiceNumber}`)}
                        className="rounded-lg border border-red-500/20 bg-red-950/20 px-2 py-1 text-[11px] text-red-300 hover:bg-red-900/30"
                      >
                        Credit Note
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
