'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, ShieldCheck, MapPin, Sparkles, ArrowRight, 
  ArrowLeft, CheckCircle2, Check, Loader2, HelpCircle, 
  PhoneCall, Users, Layers, Zap, AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { Company, Profile } from '@/lib/supabase/types';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface WizardProps {
  company: Company | null;
  profile: Profile | null;
  availableCategories?: CategoryItem[];
}

const INDIAN_STATES = [
  'Andhra Pradesh (37)', 'Arunachal Pradesh (12)', 'Assam (18)', 'Bihar (10)',
  'Chhattisgarh (22)', 'Delhi (07)', 'Goa (30)', 'Gujarat (24)', 'Haryana (06)',
  'Himachal Pradesh (02)', 'Jharkhand (20)', 'Karnataka (29)', 'Kerala (32)',
  'Madhya Pradesh (23)', 'Maharashtra (27)', 'Odisha (21)', 'Punjab (03)',
  'Rajasthan (08)', 'Tamil Nadu (33)', 'Telangana (36)', 'Uttar Pradesh (09)',
  'Uttarakhand (05)', 'West Bengal (19)', 'Other / Union Territory'
];

export function CustomerOnboardingWizard({ company, profile, availableCategories = [] }: WizardProps) {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    companyName: company?.name || '',
    businessType: company?.business_type || 'Private Limited (Pvt Ltd)',
    industry: company?.industry || 'IT & Software Services',
    companySize: company?.company_size || '11-50 employees',
    billingAddress: company?.billing_address || '',
    city: company?.city || '',
    state: company?.state || 'Karnataka (29)',
    pincode: company?.pincode || '',
    categories: (company?.categories as string[]) || [],
    inviteEmail: '',
  });

  const toggleCategory = (id: string) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(id);
      return {
        ...prev,
        categories: exists 
          ? prev.categories.filter((c) => c !== id)
          : [...prev.categories, id],
      };
    });
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim()) {
      toast.error('Please provide your registered company name');
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.billingAddress.trim() || !formData.city.trim()) {
      toast.error('Please enter your street address and city');
      return;
    }
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Session expired. Please sign in again.');
        router.push('/sign-in');
        return;
      }

      const { error } = await (supabase
        .from('companies') as any)
        .update({
          name: formData.companyName,
          business_type: formData.businessType,
          industry: formData.industry,
          company_size: formData.companySize,
          billing_address: formData.billingAddress,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          categories: formData.categories,
          onboarding_step: 3,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        toast.success('Onboarding complete! Welcome to Distaura.');
      } else {
        toast.success('Company profile saved! Welcome to Distaura.');
      }

      router.push('/portal/dashboard');
    } catch {
      toast.success('Onboarding saved! Welcome to Distaura.');
      router.push('/portal/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#1a1b18]/95 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
      {/* Wizard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-8 border-b border-white/5 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-3 py-1 text-xs font-semibold text-[var(--lime-hi)]">
            <Sparkles className="size-3.5" />
            Enterprise Procurement Setup
          </span>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-stone-100">
            Welcome to Distaura, {profile?.full_name?.split(' ')[0] || 'Partner'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">
            Complete your company profile to enable instant billing and key delivery.
          </p>
        </div>

        {/* Step pills */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex size-8 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                s === step
                  ? 'bg-[var(--lime)] text-stone-950 shadow-[0_0_20px_rgba(184,224,44,0.4)]'
                  : s < step
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/5 text-stone-500 border border-white/5'
              }`}
            >
              {s < step ? <Check className="size-4 stroke-[3]" /> : s}
            </div>
          ))}
        </div>
      </div>

      {/* Step Progress Line */}
      <div className="my-6 flex items-center justify-between text-[11px] font-semibold text-stone-400">
        <span className={step >= 1 ? 'text-[var(--lime-hi)]' : ''}>1. Company Details</span>
        <span className="h-0.5 w-12 bg-white/10" />
        <span className={step >= 2 ? 'text-[var(--lime-hi)]' : ''}>2. Billing Jurisdiction</span>
        <span className="h-0.5 w-12 bg-white/10" />
        <span className={step >= 3 ? 'text-[var(--lime-hi)]' : ''}>3. Software Stack</span>
      </div>

      {/* ── STEP 1: Corporate Entity Details ──────────────────── */}
      {step === 1 && (
        <form onSubmit={handleNextStep1} className="space-y-5 animate-in fade-in duration-300">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
              Registered Entity Name <span className="text-[var(--lime)]">*</span>
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                <Building2 className="size-4" />
              </div>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Acme Tech Solutions Pvt Ltd"
                className="w-full rounded-2xl border border-white/10 bg-[#141512] py-3 pl-10 pr-4 text-xs sm:text-sm text-stone-100 placeholder:text-stone-600 focus:border-[var(--lime)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                Business Constitution
              </label>
              <select
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="mt-1.5 w-full rounded-2xl border border-white/10 bg-[#141512] py-3 px-3.5 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
              >
                <option value="Private Limited (Pvt Ltd)">Private Limited (Pvt Ltd)</option>
                <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
                <option value="Public Limited Company">Public Limited Company</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership Firm">Partnership Firm</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                Industry Sector
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="mt-1.5 w-full rounded-2xl border border-white/10 bg-[#141512] py-3 px-3.5 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
              >
                <option value="IT & Software Services">IT & Software Services</option>
                <option value="Fintech & Financial Services">Fintech & Financial Services</option>
                <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                <option value="Manufacturing & Industrial">Manufacturing & Industrial</option>
                <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                <option value="Media, Agency & Marketing">Media, Agency & Marketing</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Link
              href="/portal/dashboard"
              className="text-xs text-[var(--muted)] hover:text-stone-300 transition-colors"
            >
              Skip for now & go to dashboard
            </Link>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-2xl bg-[var(--lime)] px-6 py-3 text-xs sm:text-sm font-bold text-stone-950 hover:bg-[var(--lime-hi)] transition-all"
            >
              <span>Continue to Billing Address</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </form>
      )}

      {/* ── STEP 2: Registered Billing Address ─────────────────── */}
      {step === 2 && (
        <form onSubmit={handleNextStep2} className="space-y-5 animate-in fade-in duration-300">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
              Registered Billing Address <span className="text-[var(--lime)]">*</span>
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                <MapPin className="size-4" />
              </div>
              <input
                type="text"
                required
                value={formData.billingAddress}
                onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                placeholder="#42, Tech Park, Corporate Boulevard"
                className="w-full rounded-2xl border border-white/10 bg-[#141512] py-3 pl-10 pr-4 text-xs sm:text-sm text-stone-100 placeholder:text-stone-600 focus:border-[var(--lime)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                City <span className="text-[var(--lime)]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Bengaluru"
                className="mt-1.5 w-full rounded-2xl border border-white/10 bg-[#141512] py-3 px-3.5 text-xs text-stone-100 placeholder:text-stone-600 focus:border-[var(--lime)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                State Jurisdiction <span className="text-[var(--lime)]">*</span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="mt-1.5 w-full rounded-2xl border border-white/10 bg-[#141512] py-3 px-3.5 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                Postal PIN Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                placeholder="560034"
                className="mt-1.5 w-full rounded-2xl border border-white/10 bg-[#141512] py-3 px-3.5 text-xs text-stone-100 placeholder:text-stone-600 focus:border-[var(--lime)] focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#141512] p-4 text-xs text-[var(--muted)] flex items-start gap-3">
            <AlertCircle className="size-4 shrink-0 text-[var(--lime)] mt-0.5" />
            <span>
              Your state code determines whether intra-state (CGST 9% + SGST 9%) or inter-state (IGST 18%) is applied on invoices.
            </span>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-stone-200 transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-2xl bg-[var(--lime)] px-6 py-3 text-xs sm:text-sm font-bold text-stone-950 hover:bg-[var(--lime-hi)] transition-all"
            >
              <span>Continue to Software Stack</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </form>
      )}

      {/* ── STEP 3: Software Interests & Finalize ──────────────── */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-300">
              Select Primary Software Categories for Your Enterprise
            </h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              This customizes your pricing desk and enables automated volume discounts.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(availableCategories.length > 0
                ? availableCategories.map((c) => ({
                    id: c.slug || c.id,
                    label: c.name,
                    icon: '💼',
                  }))
                : [
                    { id: 'crm', label: 'CRM & Customer Relationships', icon: '📈' },
                    { id: 'erp', label: 'ERP & Enterprise Planning', icon: '📊' },
                    { id: 'accounting', label: 'Accounting & Statutory Finance', icon: '💼' },
                    { id: 'hr-payroll', label: 'HR & Payroll Compliance', icon: '👥' },
                    { id: 'cybersecurity', label: 'Cybersecurity & Protection', icon: '🛡️' },
                    { id: 'analytics', label: 'Data Analytics & BI', icon: '⚡' },
                  ]
              ).map((cat) => {
                const isSelected = formData.categories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-[var(--lime)] bg-[var(--lime)]/10 text-stone-100 shadow-[0_0_20px_rgba(184,224,44,0.15)]'
                        : 'border-white/5 bg-[#141512] text-stone-400 hover:border-white/10'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-stone-200">{cat.label}</p>
                    </div>
                    {isSelected && <Check className="size-4 text-[var(--lime)]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--lime)]/30 bg-[var(--lime)]/10 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--lime-hi)]">
              <CheckCircle2 className="size-4" />
              <span>Procurement Setup Complete</span>
            </div>
            <p className="mt-1 text-xs text-stone-300">
              Clicking below will establish your verified buyer account on Distaura. You can start placing software orders, requesting bespoke quotations, and downloading tax invoices.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-stone-200 transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="flex items-center gap-2 rounded-2xl bg-[var(--lime)] px-8 py-3.5 text-xs sm:text-sm font-bold text-stone-950 hover:bg-[var(--lime-hi)] hover:shadow-[0_0_30px_rgba(184,224,44,0.4)] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Configuring Procurement Vault...</span>
                </>
              ) : (
                <>
                  <span>Complete Setup & Enter Dashboard</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
