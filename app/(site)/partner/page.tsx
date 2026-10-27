'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, ShieldCheck, Zap, TrendingUp, Handshake, 
  CheckCircle2, ArrowRight, Lock, Globe2, FileCheck
} from 'lucide-react';
import { toast } from 'sonner';

export default function PartnerWithUsPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    productDesc: '',
    message: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.companyName || !form.email || !form.phone || !form.productDesc) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (form.productDesc.length < 20) {
      toast.error('Product description should be at least 20 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiry_type: 'supplier',
          name: form.name,
          company_name: form.companyName,
          email: form.email,
          phone: form.phone,
          product_desc: form.productDesc,
          message: form.message || form.productDesc,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit partnership request.');
      }

      toast.success('Partnership request submitted successfully!');
      router.push(`/enquiry-sent?type=supplier&ref=${encodeURIComponent(data.referenceId || '')}`);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-28 pb-20">
      {/* Hero Section */}
      <section className="wrap relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-3.5 py-1 text-xs font-semibold text-[var(--lime-hi)]">
              <Handshake className="size-3.5" />
              For Suppliers
            </span>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-stone-100">
              Reach Indian businesses <br />
              <span className="text-[var(--lime-hi)]">through a distribution partner.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--muted)]">
              Distaura is a growing distribution network that connects suppliers with Indian businesses. We find and talk to customers; you keep delivery and support. Commercial terms are agreed with each supplier in writing.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-[#1c1d1a] p-4">
                <div className="flex items-center gap-2 font-display text-sm font-bold text-stone-200">
                  <ShieldCheck className="size-4 text-[var(--lime)]" />
                  Clear commercial terms
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Margins, payment terms and responsibilities are agreed in writing with each supplier before we sell.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#1c1d1a] p-4">
                <div className="flex items-center gap-2 font-display text-sm font-bold text-stone-200">
                  <FileCheck className="size-4 text-[var(--lime)]" />
                  Local sales support
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  We handle introductions, requirement gathering and quotations for Indian customers.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#1c1d1a] p-4">
                <div className="flex items-center gap-2 font-display text-sm font-bold text-stone-200">
                  <TrendingUp className="size-4 text-[var(--lime)]" />
                  A growing network
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  We are building relationships with Indian businesses and focus on qualified enquiries for our supplier partners.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#1c1d1a] p-4">
                <div className="flex items-center gap-2 font-display text-sm font-bold text-stone-200">
                  <Lock className="size-4 text-[var(--lime)]" />
                  Simple for you
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  We pass you qualified enquiries and order details by email, so you do not need another portal to manage.
                </p>
              </div>
            </div>
          </div>

          {/* Supplier Enquiry Form */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[var(--lime)]/30 bg-[#212320]/95 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl">
              <h2 className="font-display text-2xl font-bold text-stone-100">
                Partner with Distaura
              </h2>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Tell us about your product or service. Our team will review it and get back to you.
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
                    placeholder="e.g. Arun Ramanathan"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300">
                    Company / Entity Name <span className="text-[var(--lime)]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    placeholder="e.g. Acme Software"
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
                      placeholder="arun@acme.com"
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
                      placeholder="+91 98765 43210"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300">
                    Product / Software Overview <span className="text-[var(--lime)]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={form.productDesc}
                    onChange={(e) => setForm({ ...form, productDesc: e.target.value })}
                    placeholder="Describe your software, ideal customer profile, and key features (min 20 characters)..."
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300">
                    Commercial Notes / Margin expectations
                  </label>
                  <textarea
                    rows={2}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Existing pricing tiers, preferred commission structure, or target verticals..."
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--lime)] py-3 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)] hover:shadow-[0_0_20px_rgba(184,224,44,0.4)] disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Partnership Request'}
                  <ArrowRight className="size-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* How it works for suppliers */}
      <section className="wrap mt-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="rounded-md border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-3 py-1 text-xs font-semibold text-[var(--lime-hi)]">
            Partnership process
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-stone-100">
            How Supplier Onboarding Works
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {[
            {
              step: '01',
              title: 'Listing Agreement',
              desc: 'We discuss fit and sign a written distribution agreement covering pricing, commission and payment terms.',
            },
            {
              step: '02',
              title: 'Catalogue listing',
              desc: 'Once you confirm what we may offer, and at what price, we list it on the Distaura catalogue.',
            },
            {
              step: '03',
              title: 'Customer enquiries',
              desc: 'Qualified customer enquiries are passed to you, and we coordinate quotations and next steps.',
            },
            {
              step: '04',
              title: 'Settlement',
              desc: 'Payments and invoicing follow the terms set out in your distribution agreement.',
            },
          ].map((item) => (
            <div key={item.step} className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-6">
              <span className="font-display text-3xl font-extrabold text-[var(--lime-hi)]">
                {item.step}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-stone-100">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
