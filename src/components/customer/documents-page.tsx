'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, Download, Search, CheckCircle2, 
  Calendar, ShieldCheck, ArrowDownToLine, Printer,
  Eye, X, Building2, ShoppingBag, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export interface CustomerDocumentItem {
  id: string;
  name: string;
  type: 'invoice' | 'credit_note' | 'agreement' | 'license' | 'other';
  referenceNumber: string;
  date: string;
  amountRupees?: number | null;
  status: 'valid' | 'settled' | 'pending';
  fileSize: string;
  downloadUrl?: string | null;
  orderNumber?: string | null;
  productName?: string | null;
  companyName?: string | null;
}

interface Props {
  documents: CustomerDocumentItem[];
  companyName?: string | null;
}

export function DocumentsPage({ documents, companyName }: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'invoice' | 'agreement' | 'credit_note'>('all');
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<CustomerDocumentItem | null>(null);

  const filtered = documents.filter((doc) => {
    const matchesTab = activeTab === 'all' || doc.type === activeTab;
    const q = search.toLowerCase();
    const matchesSearch =
      search === '' ||
      doc.name.toLowerCase().includes(q) ||
      doc.referenceNumber.toLowerCase().includes(q) ||
      (doc.productName && doc.productName.toLowerCase().includes(q));
    return matchesTab && matchesSearch;
  });

  // Derived statistics
  const invoiceCount = documents.filter((d) => d.type === 'invoice').length;
  const agreementCount = documents.filter((d) => d.type === 'agreement').length;
  const totalInvoicedRupees = documents
    .filter((d) => d.type === 'invoice' && typeof d.amountRupees === 'number')
    .reduce((sum, d) => sum + (d.amountRupees || 0), 0);

  function handleDownload(doc: CustomerDocumentItem) {
    if (doc.downloadUrl) {
      window.open(doc.downloadUrl, '_blank');
      return;
    }
    // If it's an order-backed invoice, open the invoice viewer for printing/saving as PDF
    setSelectedInvoice(doc);
    toast.success(`Opening tax invoice ${doc.referenceNumber}...`);
  }

  function handlePrintInvoice() {
    window.print();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
          Financial &amp; Statutory Records
        </p>
        <h1
          className="mt-1 font-display font-bold text-stone-100 tracking-tight"
          style={{ fontSize: '1.25rem', lineHeight: '1.75rem' }}
        >
          Documents &amp; Tax Invoices
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Access your GST-compliant tax invoices, input tax credit schedules, and master software licensing agreements.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
          <span className="text-xs text-[var(--muted)]">Tax Invoices</span>
          <div className="mt-2 font-display text-2xl sm:text-3xl font-bold text-stone-100">
            {invoiceCount} Record{invoiceCount !== 1 ? 's' : ''}
          </div>
          <span className="mt-1 block text-[11px] text-emerald-400">
            GST ITC eligible &amp; audited
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
          <span className="text-xs text-[var(--muted)]">Total Statutory Spend</span>
          <div className="mt-2 font-display text-2xl sm:text-3xl font-bold text-stone-100">
            ₹{totalInvoicedRupees.toLocaleString('en-IN')}
          </div>
          <span className="mt-1 block text-[11px] text-[var(--muted)]">
            Includes CGST, SGST &amp; IGST
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
          <span className="text-xs text-[var(--muted)]">Master Agreements</span>
          <div className="mt-2 font-display text-2xl sm:text-3xl font-bold text-stone-100">
            {agreementCount} Contract{agreementCount !== 1 ? 's' : ''}
          </div>
          <span className="mt-1 block text-[11px] text-[var(--lime-hi)]">
            Distribution terms active
          </span>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: `All Records (${documents.length})` },
            { id: 'invoice', label: `Tax Invoices (${invoiceCount})` },
            { id: 'agreement', label: `Master Contracts (${agreementCount})` },
            { id: 'credit_note', label: 'Credit Notes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[var(--lime)] text-stone-950 font-semibold shadow-[0_0_12px_rgba(184,224,44,0.3)]'
                  : 'border border-white/5 bg-[#191a18] text-stone-400 hover:text-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search document # or title..."
            className="w-full rounded-xl border border-white/10 bg-[#191a18] py-1.5 pl-9 pr-3 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1d1a] shadow-lg">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[var(--lime)] mb-3">
              <FileText className="size-6" />
            </div>
            <h3 className="font-display text-base font-bold text-stone-100">
              No statutory documents found
            </h3>
            <p className="mt-1 max-w-md text-xs text-[var(--muted)]">
              {documents.length === 0
                ? 'Statutory tax invoices and software procurement agreements are generated when you place orders or complete enterprise agreements.'
                : 'No documents match your current search or filter criteria.'}
            </p>
            {documents.length === 0 && (
              <Link
                href="/portal/products"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--lime)] px-4 py-2 text-xs font-bold text-stone-950 hover:bg-[var(--lime-hi)] transition-all"
              >
                <ShoppingBag className="size-3.5" />
                <span>Explore Software Catalogue</span>
                <ArrowRight className="size-3.5" />
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 font-semibold text-stone-300">
                <tr>
                  <th className="py-3.5 px-4">Document Title</th>
                  <th className="py-3.5 px-4">Identifier / Ref</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Amount (Incl. GST)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-stone-300">
                {filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--lime)]/10 text-[var(--lime-hi)]">
                          <FileText className="size-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-stone-100">{doc.name}</div>
                          <div className="text-[10px] text-[var(--muted)]">
                            {doc.fileSize} • {doc.type.toUpperCase().replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-stone-200">
                      {doc.referenceNumber}
                    </td>
                    <td className="py-4 px-4 text-[var(--muted)]">{doc.date}</td>
                    <td className="py-4 px-4 font-medium text-stone-100">
                      {typeof doc.amountRupees === 'number'
                        ? `₹${doc.amountRupees.toLocaleString('en-IN')}`
                        : '—'}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          doc.status === 'settled'
                            ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                            : doc.status === 'valid'
                            ? 'border border-blue-500/30 bg-blue-500/10 text-blue-400'
                            : 'border border-amber-500/30 bg-amber-500/10 text-amber-300'
                        }`}
                      >
                        <CheckCircle2 className="size-3" />
                        {doc.status === 'settled'
                          ? 'Paid / Settled'
                          : doc.status === 'valid'
                          ? 'Active Agreement'
                          : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-stone-200 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <ArrowDownToLine className="size-3.5 text-[var(--lime)]" />
                        <span>PDF / View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Viewer Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#161714] p-6 sm:p-8 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--lime)] text-stone-950 font-bold">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-stone-100 text-sm">
                    Tax Invoice Preview
                  </h3>
                  <p className="font-mono text-xs text-[var(--lime-hi)]">
                    {selectedInvoice.referenceNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintInvoice}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-stone-200 hover:bg-white/10 transition-colors"
                >
                  <Printer className="size-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="rounded-xl p-1.5 text-stone-400 hover:bg-white/10 hover:text-stone-100 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Printable Tax Invoice Content */}
            <div className="mt-6 space-y-6 rounded-2xl border border-white/5 bg-[#121310] p-6 text-xs text-stone-300">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-display text-base font-extrabold text-stone-100">
                    DISTAURA DISTRIBUTION PVT LTD
                  </h4>
                  <p className="text-[11px] text-[var(--muted)] mt-0.5">
                    Authorized Indian Software Distributor
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Authorized Indian Software Distributor
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Place of Supply: Karnataka (29)
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block rounded-lg bg-[var(--lime)]/10 px-2.5 py-1 text-[11px] font-bold text-[var(--lime-hi)]">
                    ORIGINAL FOR RECIPIENT
                  </span>
                  <p className="mt-2 text-[11px] text-stone-400">
                    Invoice No: <strong className="font-mono text-stone-200">{selectedInvoice.referenceNumber}</strong>
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Date: <strong className="text-stone-200">{selectedInvoice.date}</strong>
                  </p>
                </div>
              </div>

              {/* Billed To */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Billed To (Recipient)
                </span>
                <p className="mt-1 font-semibold text-stone-100">
                  {selectedInvoice.companyName || companyName || 'Registered Enterprise Client'}
                </p>
              </div>

              {/* Line Items */}
              <div className="overflow-hidden rounded-xl border border-white/5">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-white/5 text-stone-300">
                    <tr>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-center">SAC Code</th>
                      <th className="py-2.5 px-3 text-right">Taxable Value</th>
                      <th className="py-2.5 px-3 text-right">GST (18%)</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-stone-200">
                    <tr>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-stone-100">
                          {selectedInvoice.productName || selectedInvoice.name}
                        </div>
                        <div className="text-[10px] text-[var(--muted)]">
                          Software License Subscription &amp; Support
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono">997331</td>
                      <td className="py-3 px-3 text-right">
                        {typeof selectedInvoice.amountRupees === 'number'
                          ? `₹${Math.round((selectedInvoice.amountRupees / 1.18)).toLocaleString('en-IN')}`
                          : '—'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {typeof selectedInvoice.amountRupees === 'number'
                          ? `₹${Math.round(selectedInvoice.amountRupees - selectedInvoice.amountRupees / 1.18).toLocaleString('en-IN')}`
                          : '—'}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-stone-100">
                        {typeof selectedInvoice.amountRupees === 'number'
                          ? `₹${selectedInvoice.amountRupees.toLocaleString('en-IN')}`
                          : '—'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Terms & Footer */}
              <div className="flex justify-between items-center text-[10px] text-[var(--muted)] border-t border-white/5 pt-3">
                <span>Computer generated tax invoice. Subject to Bengaluru jurisdiction.</span>
                <span className="text-emerald-400 font-medium">✓ 18% Input Tax Credit Eligible</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-stone-300 hover:bg-white/10"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
