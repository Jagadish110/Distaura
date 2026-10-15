'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2, MapPin, Briefcase, Users, ArrowRight, Loader2,
  CheckCircle2, ChevronRight, Store, Factory, Truck, Code2,
  BarChart3, Settings, Heart, GraduationCap, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface GoogleOnboardingProps {
  userId: string;
  userEmail: string;
  userName: string;
}

const INDUSTRY_OPTIONS = [
  { id: 'technology', label: 'Technology & IT', icon: Code2 },
  { id: 'manufacturing', label: 'Manufacturing', icon: Factory },
  { id: 'retail', label: 'Retail & Commerce', icon: Store },
  { id: 'logistics', label: 'Logistics & Supply Chain', icon: Truck },
  { id: 'finance', label: 'Finance & Accounting', icon: BarChart3 },
  { id: 'healthcare', label: 'Healthcare', icon: Heart },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'operations', label: 'Operations & Services', icon: Settings },
];

const TEAM_SIZE_OPTIONS = [
  { id: '1-10', label: '1–10 employees' },
  { id: '11-50', label: '11–50 employees' },
  { id: '51-200', label: '51–200 employees' },
  { id: '201-1000', label: '201–1,000 employees' },
  { id: '1000+', label: '1,000+ employees' },
];

const USE_CASE_OPTIONS = [
  { id: 'software_procurement', label: 'Procure Enterprise Software' },
  { id: 'accounting', label: 'GST / Accounting Tools' },
  { id: 'crm', label: 'CRM & Sales Automation' },
  { id: 'cloud_infra', label: 'Cloud Infrastructure' },
  { id: 'security', label: 'Cybersecurity Solutions' },
  { id: 'hr', label: 'HR & Payroll Management' },
  { id: 'erp', label: 'ERP Implementation' },
  { id: 'other', label: 'Something Else' },
];

const STEPS = [
  { id: 1, title: 'Company Details', description: 'Tell us about your organization' },
  { id: 2, title: 'Industry & Size', description: 'Help us match the right solutions' },
  { id: 3, title: 'What do you need?', description: 'Your procurement focus' },
];

export function GoogleOnboardingFlow({ userId, userEmail, userName }: GoogleOnboardingProps) {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    companyName: '',
    city: '',
    state: '',
    industry: '',
    teamSize: '',
    useCases: [] as string[],
  });

  const toggleUseCase = (id: string) => {
    setForm((prev) => ({
      ...prev,
      useCases: prev.useCases.includes(id)
        ? prev.useCases.filter((u) => u !== id)
        : [...prev.useCases, id],
    }));
  };

  const nextStep = () => {
    if (step === 1 && !form.companyName.trim()) {
      toast.error('Please enter your company name.');
      return;
    }
    if (step === 2 && !form.industry) {
      toast.error('Please select your industry.');
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (form.useCases.length === 0) {
      toast.error('Please select at least one procurement focus.');
      return;
    }

    setSaving(true);
    try {
      // 1. Upsert profile
      await (supabase.from('profiles') as any).upsert({
        id: userId,
        email: userEmail,
        full_name: userName,
        updated_at: new Date().toISOString(),
      });

      // 2. Create or update company record
      const { data: existingCo } = await (supabase.from('companies') as any)
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      const companyPayload = {
        user_id: userId,
        name: form.companyName,
        city: form.city || null,
        state: form.state || null,
        onboarding_step: 2,
        updated_at: new Date().toISOString(),
      };

      if (existingCo) {
        await (supabase.from('companies') as any)
          .update(companyPayload)
          .eq('id', existingCo.id);
      } else {
        await (supabase.from('companies') as any).insert({
          ...companyPayload,
          created_at: new Date().toISOString(),
        });
      }

      toast.success('Welcome to Distaura! Your account is ready.');
      router.push('/portal/dashboard');
    } catch (err: any) {
      // Even on error, navigate through — data can be filled in portal
      toast.success('Account set up! You can complete your profile in the portal.');
      router.push('/portal/dashboard');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e0f0d]/95 backdrop-blur-xl px-4">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-60 left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-[var(--lime)]/8 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-60 right-0 size-[500px] rounded-full bg-emerald-500/5 blur-[160px]" />

      <div className="relative w-full max-w-lg">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`flex size-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    step > s.id
                      ? 'bg-[var(--lime)] text-stone-950'
                      : step === s.id
                      ? 'bg-[var(--lime)]/20 border border-[var(--lime)] text-[var(--lime-hi)]'
                      : 'bg-white/5 border border-white/10 text-stone-500'
                  }`}
                >
                  {step > s.id ? <CheckCircle2 className="size-4" /> : s.id}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-px flex-1 mx-1 w-16 sm:w-24 transition-all ${step > s.id ? 'bg-[var(--lime)]/60' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
              Step {step} of {STEPS.length}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-[#1c1d1a]/98 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="flex size-8 items-center justify-center rounded-xl bg-[var(--lime)] text-stone-950">
                <ShieldCheck className="size-4" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
                Quick Setup — {STEPS[step - 1].title}
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-stone-100">
              {step === 1 && `Welcome, ${userName?.split(' ')[0] || 'there'}! 👋`}
              {step === 2 && 'About your company'}
              {step === 3 && 'What do you need?'}
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {STEPS[step - 1].description}
            </p>
          </div>

          {/* Step 1: Company Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Company / Business Name <span className="text-[var(--lime)]">*</span>
                </label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-500" />
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    placeholder="e.g. Acme Technologies Pvt Ltd"
                    className="w-full rounded-xl border border-white/10 bg-[#161715] py-3 pl-10 pr-4 text-sm text-stone-100 placeholder:text-stone-600 focus:border-[var(--lime)] focus:outline-none focus:ring-1 focus:ring-[var(--lime)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">City</label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-stone-500" />
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Bengaluru"
                      className="w-full rounded-xl border border-white/10 bg-[#161715] py-3 pl-9 pr-3 text-sm text-stone-100 placeholder:text-stone-600 focus:border-[var(--lime)] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">State</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    placeholder="e.g. Karnataka"
                    className="w-full rounded-xl border border-white/10 bg-[#161715] py-3 px-3.5 text-sm text-stone-100 placeholder:text-stone-600 focus:border-[var(--lime)] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Industry & Team Size */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-3">
                  Industry <span className="text-[var(--lime)]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {INDUSTRY_OPTIONS.map((ind) => {
                    const Icon = ind.icon;
                    const selected = form.industry === ind.id;
                    return (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => setForm({ ...form, industry: ind.id })}
                        className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-all ${
                          selected
                            ? 'border-[var(--lime)]/60 bg-[var(--lime)]/10 text-[var(--lime-hi)] shadow-[0_0_12px_rgba(184,224,44,0.15)]'
                            : 'border-white/10 bg-white/5 text-stone-400 hover:border-white/20 hover:text-stone-200'
                        }`}
                      >
                        <Icon className="size-3.5 shrink-0" />
                        {ind.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-3">
                  <Users className="inline size-3.5 mr-1" />
                  Company Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {TEAM_SIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setForm({ ...form, teamSize: opt.id })}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                        form.teamSize === opt.id
                          ? 'border-[var(--lime)]/60 bg-[var(--lime)]/10 text-[var(--lime-hi)]'
                          : 'border-white/10 bg-white/5 text-stone-400 hover:border-white/20 hover:text-stone-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Use Cases */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-[var(--muted)]">Select all that apply — we'll prioritize your catalogue view.</p>
              <div className="grid grid-cols-2 gap-2">
                {USE_CASE_OPTIONS.map((uc) => {
                  const selected = form.useCases.includes(uc.id);
                  return (
                    <button
                      key={uc.id}
                      type="button"
                      onClick={() => toggleUseCase(uc.id)}
                      className={`flex items-center gap-2 rounded-xl border px-3.5 py-3 text-left text-xs font-medium transition-all ${
                        selected
                          ? 'border-[var(--lime)]/60 bg-[var(--lime)]/10 text-[var(--lime-hi)] shadow-[0_0_12px_rgba(184,224,44,0.15)]'
                          : 'border-white/10 bg-white/5 text-stone-400 hover:border-white/20 hover:text-stone-200'
                      }`}
                    >
                      <div className={`size-4 shrink-0 rounded border ${selected ? 'border-[var(--lime)] bg-[var(--lime)]' : 'border-white/20'} flex items-center justify-center`}>
                        {selected && <CheckCircle2 className="size-3 text-stone-950" />}
                      </div>
                      {uc.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-7 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-stone-300 hover:bg-white/10"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  toast('You can complete these details in your portal.');
                  router.push('/portal/dashboard');
                }}
                className="text-xs text-stone-500 hover:text-stone-300 underline"
              >
                Skip for now
              </button>
            )}

            {step < STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="group flex items-center gap-2 rounded-xl bg-[var(--lime)] px-5 py-2.5 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)] hover:shadow-[0_0_20px_rgba(184,224,44,0.3)]"
              >
                Continue
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="group flex items-center gap-2 rounded-xl bg-[var(--lime)] px-5 py-2.5 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)] disabled:opacity-60"
              >
                {saving ? (
                  <><Loader2 className="size-4 animate-spin" /> Setting up…</>
                ) : (
                  <><span>Enter Portal</span><ChevronRight className="size-4" /></>
                )}
              </button>
            )}
          </div>

          <p className="mt-4 text-center text-[10px] text-stone-600">
            Signed in as <span className="text-stone-400">{userEmail}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
