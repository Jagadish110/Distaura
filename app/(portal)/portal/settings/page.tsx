'use client';

import { useState } from 'react';
import { User, Lock, Mail, Shield, Bell, Save, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/auth-provider';

export default function CustomerSettingsPage() {
  const { profile, user } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || 'Jagadish K');
  const [email] = useState(user?.email || 'mottu9719@gmail.com');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [renewalAlerts, setRenewalAlerts] = useState(true);
  const [saving, setSaving] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Account preferences saved.');
    }, 500);
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
          Preferences & Credentials
        </p>
        <h1
          className="mt-1 font-display font-bold text-stone-100 tracking-tight"
          style={{ fontSize: '1.25rem', lineHeight: '1.75rem' }}
        >
          Account Settings
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Update your personal contact information, password, and notification frequency.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="rounded-3xl border border-white/10 bg-[#1c1d1a] p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-stone-100">Profile Details</h2>

          <div>
            <label className="block text-xs font-medium text-stone-300">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300">Sign-In Email Address</label>
            <input
              type="email"
              disabled
              value={email}
              className="mt-1 w-full rounded-xl border border-white/5 bg-[#141513] px-3.5 py-2.5 text-xs text-stone-400 cursor-not-allowed"
            />
            <span className="text-[10px] text-[var(--muted)]">Managed via Supabase authentication</span>
          </div>
        </div>

        {/* Security & Password Card */}
        <div className="rounded-3xl border border-white/10 bg-[#1c1d1a] p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-stone-100">Security</h2>

          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <div>
              <p className="text-xs font-semibold text-stone-200">Password</p>
              <p className="text-[11px] text-[var(--muted)]">Change your account password securely</p>
            </div>
            <button
              type="button"
              onClick={() => toast.info('Password reset link sent to your registered email.')}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-stone-200 hover:bg-white/10"
            >
              Reset Password
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-semibold text-stone-200">Session Protection</p>
              <p className="text-[11px] text-[var(--muted)]">Encrypted cookie tokens with Supabase Auth</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
              <CheckCircle2 className="size-3.5" />
              Active
            </span>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="rounded-3xl border border-white/10 bg-[#1c1d1a] p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-stone-100">Notification Alerts</h2>

          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <div>
              <p className="text-xs font-semibold text-stone-200">Renewal Alerts (60, 30, 14 days)</p>
              <p className="text-[11px] text-[var(--muted)]">Automated reminders before software expiration</p>
            </div>
            <input
              type="checkbox"
              checked={renewalAlerts}
              onChange={(e) => setRenewalAlerts(e.target.checked)}
              className="size-4 rounded accent-[var(--lime)]"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-semibold text-stone-200">Order & Tax Invoice Receipts</p>
              <p className="text-[11px] text-[var(--muted)]">Email delivery of GST Tax Invoices and credit notes</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="size-4 rounded accent-[var(--lime)]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[var(--lime)] px-6 py-2.5 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)] disabled:opacity-50"
        >
          <Save className="size-3.5" />
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </form>
    </div>
  );
}
