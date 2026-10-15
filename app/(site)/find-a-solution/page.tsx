'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Briefcase, CheckCircle2, ArrowRight, ShieldCheck, 
  Clock, Headphones, Sparkles, Building2
} from 'lucide-react';
import { toast } from 'sonner';

function SolutionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillProduct = searchParams.get('product') || '';

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    message: prefillProduct
      ? `We are interested in procuring ${prefillProduct}. Please provide a formal quotation, implementation timeline, and multi-user licensing terms.`
      : '',
  });

  useEffect(() => {
    if (prefillProduct && !form.message) {
      setForm((prev) => ({
        ...prev,
        message: `We are interested in procuring ${prefillProduct}. Please provide a formal quotation, implementation timeline, and multi-user licensing terms.`,
      }));
    }
  }, [prefillProduct, form.message]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (form.message.length < 10) {
      toast.error('Please provide a little more detail about what you need (at least 10 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiry_type: 'business',
          name: form.name,
          company_name: form.companyName,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }

      toast.success('Your requirement was submitted successfully!');
      router.push(`/enquiry-sent?type=business&ref=${encodeURIComponent(data.referenceId || '')}`);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-7">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-3.5 py-1 text-xs font-semibold text-[var(--lime-hi)]">
          <Briefcase className="size-3.5" />
          Enterprise Procurement Advisory
        </span>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-stone-100">
          Find the right software stack <br />
          <span className="text-[var(--lime-hi)]">for your business workflows.</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--muted)]">
          Whether you need to modernize your ERP, migrate to GST-compliant invoicing, automate field sales, or lock down corporate endpoints, our enterprise procurement specialists will curate and negotiate the optimal solution.
        </p>

        <div className="mt-8 space-y-4">
          {[
            {
              title: 'Independent Vendor Comparison',
              desc: 'Unbiased recommendations tailored to your headcount, industry compliance, and existing tech stack.',
            },
            {
              title: 'Consolidated Billing & GST Credit',
              desc: 'Procure software from dozens of OEMs through one verified vendor of record with valid Tax Invoices.',
            },
            {
              title: 'Commercial Volume Discounts',
              desc: 'Leverage Distaura’s distributor scale to obtain favorable multi-seat and annual licensing terms.',
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#1b1c19] p-4">
              <CheckCircle2 className="size-5 shrink-0 text-[var(--lime)] mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-stone-200">{item.title}</h4>
                <p className="mt-0.5 text-xs text-[var(--muted)] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="rounded-3xl border border-[var(--lime)]/30 bg-[#212320]/95 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          <h2 className="font-display text-2xl font-bold text-stone-100">
            Tell Us What You Need
          </h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Our enterprise solution team will respond within 4 business hours with pricing options.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-300">
                Your Name <span className="text-[var(--lime)]">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Priya Sundaram"
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300">
                Company Name
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                placeholder="e.g. Sundaram Logistics LLP"
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-stone-300">
                  Work Email <span className="text-[var(--lime)]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="priya@sundaram.in"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-300">
                  Phone Number <span className="text-[var(--lime)]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98450 12345"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300">
                Requirement Details <span className="text-[var(--lime)]">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="What challenge are you solving? Mention desired software, number of users, or budget expectations..."
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--lime)] py-3 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)] hover:shadow-[0_0_20px_rgba(184,224,44,0.4)] disabled:opacity-50"
            >
              {submitting ? 'Submitting Request...' : 'Request Solution Proposal'}
              <ArrowRight className="size-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function FindASolutionPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="wrap relative">
        <Suspense fallback={<div className="text-center py-20 text-stone-400">Loading procurement desk...</div>}>
          <SolutionForm />
        </Suspense>
      </section>
    </div>
  );
}
