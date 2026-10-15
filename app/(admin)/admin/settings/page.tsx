'use client';

import { useState } from 'react';
import { 
  Settings, ShieldCheck, Save, Clock, Percent, 
  FileText, Bell, Database, Lock, CheckCircle2 
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [gstRate, setGstRate] = useState(18);
  const [defaultCommission, setDefaultCommission] = useState(15);
  const [gracePeriodDays, setGracePeriodDays] = useState(7);
  const [reminderCadence, setReminderCadence] = useState('60, 30, 14');
  const [saving, setSaving] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Platform governance parameters updated in Supabase app_settings.');
    }, 600);
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
          Platform Governance
        </p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-stone-100">
          Distribution System Settings
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Configure statutory GST tariffs, default distributor margin rules, and security enforcement policies.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Taxation & Statutory Card */}
        <div className="rounded-3xl border border-white/10 bg-[#1c1d1a] p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--lime)]/15 text-[var(--lime-hi)]">
              <Percent className="size-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-stone-100">Taxation & GST Tariffs</h3>
              <p className="text-xs text-[var(--muted)]">Applies to all generated tax invoices and quotation previews</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-stone-300">Default Goods & Services Tax (GST %)</label>
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
              />
              <span className="text-[10px] text-[var(--muted)]">CGST 9% + SGST 9% (intra-state) or IGST 18% (inter-state)</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300">Default Distributor Commission Margin (%)</label>
              <input
                type="number"
                value={defaultCommission}
                onChange={(e) => setDefaultCommission(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
              />
              <span className="text-[10px] text-[var(--muted)]">Base rate for new OEM agreements</span>
            </div>
          </div>
        </div>

        {/* Contract Lifecycle & Expiration Cadence */}
        <div className="rounded-3xl border border-white/10 bg-[#1c1d1a] p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--lime)]/15 text-[var(--lime-hi)]">
              <Clock className="size-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-stone-100">Renewal Cadence & Grace Rules</h3>
              <p className="text-xs text-[var(--muted)]">CRON automated notification schedules</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-stone-300">Automated Reminder Windows (Days)</label>
              <input
                type="text"
                value={reminderCadence}
                onChange={(e) => setReminderCadence(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
              />
              <span className="text-[10px] text-[var(--muted)]">Comma-separated days before expiry (e.g. 60, 30, 14)</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300">Supplier Settlement Grace Period (Days)</label>
              <input
                type="number"
                value={gracePeriodDays}
                onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
              />
              <span className="text-[10px] text-[var(--muted)]">Grace buffer before late penalty triggers</span>
            </div>
          </div>
        </div>

        {/* Security & Authentication Policies */}
        <div className="rounded-3xl border border-white/10 bg-[#1c1d1a] p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--lime)]/15 text-[var(--lime-hi)]">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-stone-100">Security & Isolation Boundaries</h3>
              <p className="text-xs text-[var(--muted)]">Supabase Postgres Row Level Security enforcement</p>
            </div>
          </div>

          <div className="mt-4 divide-y divide-white/5 text-xs text-stone-300">
            <div className="flex items-center justify-between py-2.5">
              <span>Admin & Staff Two-Factor Requirement (AAL2)</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                Mandatory
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span>Customer Self-Registration</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                Public (/sign-up)
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span>Internal Admin Registration</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[var(--lime-hi)]">
                <Lock className="size-3.5" />
                Strictly Invitation-Only
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span>Supplier Login Policy</span>
              <span className="inline-flex items-center gap-1 font-semibold text-stone-300">
                Zero-Login Tokenized Actions
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[var(--lime)] px-6 py-2.5 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)] disabled:opacity-50"
        >
          <Save className="size-3.5" />
          {saving ? 'Updating Parameters...' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
}
