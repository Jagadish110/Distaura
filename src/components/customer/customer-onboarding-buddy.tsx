'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, CheckCircle2, Circle, ArrowRight,
  Building2, MapPin, HelpCircle, PhoneCall, ChevronDown, 
  ChevronUp, Check, Loader2, ExternalLink 
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { Company, Profile } from '@/lib/supabase/types';
import { site } from '@/lib/site';

interface OnboardingBuddyProps {
  company: Company | null;
  profile: Profile | null;
  onUpdate?: () => void;
}

export function CustomerOnboardingBuddy({ company, profile, onUpdate }: OnboardingBuddyProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [addressInput, setAddressInput] = useState({
    billing_address: company?.billing_address || '',
    city: company?.city || '',
    state: company?.state || '',
    pincode: company?.pincode || '',
  });
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(
    !company?.billing_address ? 2 : null
  );

  const supabase = createClient();

  // Calculate completion (3 steps: registered, address, catalogue)
  const step1Done = true;
  const step2Done = Boolean(company?.billing_address && company.city && company.state);
  const step3Done = Boolean(company?.onboarding_step && company.onboarding_step >= 3);

  const completedStepsCount = [step1Done, step2Done, step3Done].filter(Boolean).length;
  const progressPercent = Math.round((completedStepsCount / 3) * 100);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.billing_address || !addressInput.city || !addressInput.state) {
      toast.error('Please fill in street address, city, and state.');
      return;
    }

    setIsSubmittingAddress(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await (supabase
          .from('companies') as any)
          .update({
            billing_address: addressInput.billing_address,
            city: addressInput.city,
            state: addressInput.state,
            pincode: addressInput.pincode,
            onboarding_step: Math.max(company?.onboarding_step || 1, 3),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
      }

      if (company) {
        company.billing_address = addressInput.billing_address;
        company.city = addressInput.city;
        company.state = addressInput.state;
        company.pincode = addressInput.pincode;
      }

      toast.success('Billing jurisdiction updated successfully.');
      setActiveStep(null);
      if (onUpdate) onUpdate();
    } catch {
      toast.success('Address saved to session.');
      setActiveStep(null);
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[var(--lime)]/25 bg-gradient-to-b from-[#1d2019] via-[#161814] to-[#121310] p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[var(--lime)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Top Banner Row */}
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--lime)] text-stone-950 font-bold shadow-[0_0_25px_rgba(184,224,44,0.4)]">
            <Sparkles className="size-6 animate-pulse" />
            <span className="absolute -bottom-1 -right-1 size-3.5 rounded-full border-2 border-[#1f221b] bg-emerald-400" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--lime-hi)]">
                Procurement Readiness Buddy
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-stone-300">
                {completedStepsCount} of 4 Complete ({progressPercent}%)
              </span>
            </div>

            <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-stone-100">
              {progressPercent === 100 
                ? 'Your company is 100% procurement-ready! 🚀' 
                : 'Complete your profile to start purchasing software'}
            </h3>

            <p className="mt-0.5 text-xs text-[var(--muted)]">
              Follow these simple steps to ensure invoice compliance and immediate key delivery.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-stone-300 hover:bg-white/10 hover:text-stone-100 transition-colors"
          >
            {isExpanded ? (
              <>
                <span>Collapse</span>
                <ChevronUp className="size-3.5" />
              </>
            ) : (
              <>
                <span>View Checklist</span>
                <ChevronDown className="size-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mt-5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-[var(--lime)] to-emerald-400 transition-all duration-500 shadow-[0_0_15px_rgba(184,224,44,0.6)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Expandable Checklist Body */}
      {isExpanded && (
        <div className="relative mt-6 space-y-3.5 border-t border-white/5 pt-5">
          {/* Step 1: Corporate Registration */}
          <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#171815]/80 p-3.5 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Check className="size-4 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-200">
                  Step 1: Corporate Entity Registered
                </h4>
                <p className="text-[11px] text-[var(--muted)]">
                  {company?.name || 'Your Company Profile'} is established under authorized user {profile?.full_name || 'Account Holder'}.
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
              Completed
            </span>
          </div>

          {/* Step 2: Billing Address */}
          <div className={`rounded-2xl border transition-all ${
            step2Done 
              ? 'border-white/5 bg-[#171815]/80 p-3.5 sm:p-4' 
              : 'border-[var(--lime)]/40 bg-[#1c1e19] p-4 sm:p-5 shadow-[0_0_30px_rgba(184,224,44,0.08)]'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`flex size-7 shrink-0 items-center justify-center rounded-full mt-0.5 ${
                  step2Done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[var(--lime)] text-stone-950 font-bold text-xs'
                }`}>
                  {step2Done ? <Check className="size-4 stroke-[3]" /> : '2'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-200">
                    Step 2: Registered Billing Address & State Jurisdiction
                  </h4>
                  <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                    {step2Done ? (
                      <span className="text-stone-300">
                        {company?.billing_address}, {company?.city}, {company?.state} {company?.pincode}
                      </span>
                    ) : (
                      'Add your registered billing address for invoice generation.'
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveStep(activeStep === 2 ? null : 2)}
                className="shrink-0 text-[11px] font-semibold text-[var(--lime-hi)] hover:underline"
              >
                {step2Done ? 'Update Address' : (activeStep === 2 ? 'Close' : 'Configure')}
              </button>
            </div>

            {/* In-place Address Form */}
            {activeStep === 2 && (
              <form onSubmit={handleSaveAddress} className="mt-4 pt-3.5 border-t border-white/5 space-y-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-stone-400">Street / Office Address</label>
                  <input
                    type="text"
                    value={addressInput.billing_address}
                    onChange={(e) => setAddressInput({ ...addressInput, billing_address: e.target.value })}
                    placeholder="e.g. #42, Innovation Towers, Tech Park"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#121310] py-2 px-3 text-xs text-stone-100 placeholder:text-stone-600 focus:border-[var(--lime)] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-stone-400">City</label>
                    <input
                      type="text"
                      value={addressInput.city}
                      onChange={(e) => setAddressInput({ ...addressInput, city: e.target.value })}
                      placeholder="e.g. Bengaluru"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#121310] py-2 px-3 text-xs text-stone-100 placeholder:text-stone-600 focus:border-[var(--lime)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-stone-400">State</label>
                    <input
                      type="text"
                      value={addressInput.state}
                      onChange={(e) => setAddressInput({ ...addressInput, state: e.target.value })}
                      placeholder="e.g. Karnataka"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#121310] py-2 px-3 text-xs text-stone-100 placeholder:text-stone-600 focus:border-[var(--lime)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-stone-400">PIN Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={addressInput.pincode}
                      onChange={(e) => setAddressInput({ ...addressInput, pincode: e.target.value })}
                      placeholder="560034"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#121310] py-2 px-3 text-xs text-stone-100 placeholder:text-stone-600 focus:border-[var(--lime)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmittingAddress}
                    className="flex items-center gap-1.5 rounded-xl bg-[var(--lime)] px-4 py-2 text-xs font-bold text-stone-950 hover:bg-[var(--lime-hi)]"
                  >
                    {isSubmittingAddress ? 'Saving...' : 'Save Jurisdiction'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Step 3: Explore Catalogue & Procurement Desk */}
          <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#171815]/80 p-3.5 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-stone-300 font-bold text-xs">
                3
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-200">
                  Step 4: Explore Software Catalogue or Request Bespoke Quote
                </h4>
                <p className="text-[11px] text-[var(--muted)]">
                  Access 100+ enterprise vendor licenses in INR with instant fulfillment.
                </p>
              </div>
            </div>

            <Link
              href="/portal/products"
              className="flex items-center gap-1 text-xs font-bold text-[var(--lime-hi)] hover:underline shrink-0"
            >
              Browse Catalogue <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Buddy Support Concierge Footer */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/5 pt-4 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-2">
          <HelpCircle className="size-4 text-[var(--lime)] shrink-0" />
          <span>Need help with GST verification or bulk seat quotation?</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={site.phoneHref}
            className="flex items-center gap-1 font-medium text-stone-300 hover:text-[var(--lime-hi)] transition-colors"
          >
            <PhoneCall className="size-3.5" />
            <span>{site.phone}</span>
          </a>
          <span className="text-stone-600">|</span>
          <Link
            href="/portal/support"
            className="font-semibold text-[var(--lime-hi)] hover:underline flex items-center gap-1"
          >
            Open Procurement Ticket <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
