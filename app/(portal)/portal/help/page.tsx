'use client';

import { useState } from 'react';
import { 
  HelpCircle, MessageSquare, Phone, Mail, Clock, 
  CheckCircle2, AlertCircle, Send, ShieldCheck 
} from 'lucide-react';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  subject: string;
  software: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TICK-9021',
    subject: 'Request for additional seat license keys for TechCRM',
    software: 'TechCRM Enterprise',
    priority: 'medium',
    status: 'resolved',
    createdAt: '18 Sep 2026',
  },
  {
    id: 'TICK-8840',
    subject: 'Assistance required on NIC API e-invoicing authentication',
    software: 'FinFlow GST Accounting',
    priority: 'high',
    status: 'resolved',
    createdAt: '03 Aug 2026',
  },
];

export default function CustomerHelpPage() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    subject: '',
    software: 'TechCRM Enterprise',
    priority: 'medium' as const,
    description: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subject || !form.description) {
      toast.error('Please fill in subject and description.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const newTicket: Ticket = {
        id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: form.subject,
        software: form.software,
        priority: form.priority,
        status: 'open',
        createdAt: 'Just now',
      };
      setTickets([newTicket, ...tickets]);
      toast.success('Support ticket created. Our team has been notified.');
      setForm({
        subject: '',
        software: 'TechCRM Enterprise',
        priority: 'medium',
        description: '',
      });
      setSubmitting(false);
    }, 600);
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
          Fulfillment & Technical Assurance
        </p>
        <h1
          className="mt-1 font-display font-bold text-stone-100 tracking-tight"
          style={{ fontSize: '1.25rem', lineHeight: '1.75rem' }}
        >
          Support & Ticketing Desk
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Direct escalation access to Distaura procurement managers and software OEM tier-2 technical teams.
        </p>
      </div>

      {/* Support SLAs Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--lime)]/15 text-[var(--lime-hi)]">
              <Clock className="size-4" />
            </div>
            <div>
              <div className="text-xs text-[var(--muted)]">Standard Response SLA</div>
              <div className="text-sm font-bold text-stone-100">&lt; 2 Business Hours</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--lime)]/15 text-[var(--lime-hi)]">
              <Phone className="size-4" />
            </div>
            <div>
              <div className="text-xs text-[var(--muted)]">Emergency Hotline</div>
              <div className="text-sm font-bold text-stone-100">+91 80 4567 8999</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--lime)]/15 text-[var(--lime-hi)]">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <div className="text-xs text-[var(--muted)]">Dedicated Escrow Desk</div>
              <div className="text-sm font-bold text-stone-100">Priority Tier 1</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* New Ticket Form */}
        <div className="lg:col-span-6 rounded-3xl border border-white/10 bg-[#1c1d1a] p-6 sm:p-8">
          <h2 className="text-sm font-bold text-stone-100">
            Submit a Support Request
          </h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Detail your issue or licensing inquiry below for prompt escalation.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-300">Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g. License activation failed after server reboot"
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-stone-300">Software Product</label>
                <select
                  value={form.software}
                  onChange={(e) => setForm({ ...form, software: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
                >
                  <option value="TechCRM Enterprise">TechCRM Enterprise</option>
                  <option value="FinFlow GST Accounting">FinFlow GST Accounting</option>
                  <option value="SecureVault Endpoint Guard">SecureVault Endpoint Guard</option>
                  <option value="Billing & Invoices">Billing & Invoices</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300">Priority Level</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
                >
                  <option value="low">Low (General Query)</option>
                  <option value="medium">Medium (Standard Request)</option>
                  <option value="high">High (Feature Impacted)</option>
                  <option value="urgent">Urgent (Production Down)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300">Detailed Description</label>
              <textarea
                rows={4}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Provide error logs, steps to reproduce, or order number reference..."
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--lime)] py-2.5 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)] disabled:opacity-50"
            >
              <Send className="size-3.5" />
              {submitting ? 'Creating Ticket...' : 'Submit Ticket'}
            </button>
          </form>
        </div>

        {/* Existing Tickets List */}
        <div className="lg:col-span-6 rounded-3xl border border-white/10 bg-[#1c1d1a] p-6 sm:p-8">
          <h2 className="text-sm font-bold text-stone-100">
            Recent Support Tickets
          </h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Track your open escalations and past resolution history.
          </p>

          <div className="mt-6 space-y-3">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-white/5 bg-[#161715] p-4 transition-colors hover:border-white/10"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-[var(--lime-hi)]">{t.id}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                      t.status === 'resolved'
                        ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border border-amber-500/30 bg-amber-500/10 text-amber-300'
                    }`}
                  >
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
                <h4 className="mt-2 text-xs font-semibold text-stone-200">{t.subject}</h4>
                <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--muted)]">
                  <span>{t.software}</span>
                  <span>{t.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
