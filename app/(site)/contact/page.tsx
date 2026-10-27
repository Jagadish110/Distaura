'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mail, Phone, MapPin, Clock, Send, ShieldCheck, 
  MessageSquare, Building2, CheckCircle2 
} from 'lucide-react';
import { toast } from 'sonner';
import { site } from '@/lib/site';

export default function ContactPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'business',
    message: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in name, email, and message.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiry_type: form.role === 'supplier' ? 'supplier' : 'business',
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit message.');
      }

      toast.success('Thanks, your message has been received.');
      router.push(`/enquiry-sent?type=${form.role}&ref=${encodeURIComponent(data.referenceId || '')}`);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-28 pb-20">
      <section className="wrap relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Contact Coordinates & Info */}
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-3.5 py-1 text-xs font-semibold text-[var(--lime-hi)]">
              <MessageSquare className="size-3.5" />
              Contact us
            </span>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-stone-100">
              Talk to the Distaura team.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
              Whether you need a solution for your business or want to talk about distributing your product in India, send us a message and we will get back to you.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lime)]/15 text-[var(--lime-hi)]">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300">Email Inquiries</h4>
                  <a href={`mailto:${site.emails.hello}`} className="mt-1 block text-sm font-medium text-stone-100 no-underline hover:text-[var(--lime-hi)]">{site.emails.hello}</a>
                  <a href={`mailto:${site.emails.partners}`} className="block text-xs text-[var(--muted)] no-underline hover:text-[var(--lime-hi)]">Partnership queries: {site.emails.partners}</a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lime)]/15 text-[var(--lime-hi)]">
                  <Phone className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300">Phone</h4>
                  <a href={site.phoneHref} className="mt-1 block text-sm font-medium text-stone-100 no-underline hover:text-[var(--lime-hi)]">{site.phone}</a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#1c1d1a] p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lime)]/15 text-[var(--lime-hi)]">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300">Based in</h4>
                  <p className="mt-1 text-sm font-medium text-stone-100">{site.name}, {site.basedIn}</p>
                  <p className="text-xs text-[var(--muted)]">Serving businesses across India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-[var(--lime)]/30 bg-[#212320]/95 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl">
              <h2 className="font-display text-2xl font-bold text-stone-100">
                Send Us a Direct Message
              </h2>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Fill in the details below and we will get back to you.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300">
                    Full Name <span className="text-[var(--lime)]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Vikram Seth"
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
                      placeholder="vikram@company.com"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98123 45678"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300">
                    I represent a:
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
                  >
                    <option value="business">Business looking for a solution</option>
                    <option value="supplier">Supplier wanting distribution in India</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300">
                    Message / Note <span className="text-[var(--lime)]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help?"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--lime)] py-3 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)] hover:shadow-[0_0_20px_rgba(184,224,44,0.4)] disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                  <Send className="size-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
