import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="wrap max-w-4xl">
        <nav className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <Link href="/" className="hover:text-stone-200">Home</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-stone-300 font-medium">Privacy Policy</span>
        </nav>

        <h1 className="mt-6 font-display text-3xl sm:text-4xl font-extrabold text-stone-100">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-[var(--muted)]">Last updated: October 2026.</p>

        <div className="mt-10 space-y-8 rounded-3xl border border-white/10 bg-[#1c1d1a] p-8 sm:p-12 text-xs sm:text-sm leading-relaxed text-stone-300">
          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">1. Information we collect</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              When you submit an enquiry or create an account we collect the details you give us, such as your name, company, email address, phone number and the requirement you describe. We do not collect payment card details through this website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">2. How we use it</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              We use your information to respond to your enquiry, prepare quotations, coordinate with the relevant supplier, manage your account and send service communications. We do not sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">3. Sharing</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              We share the details of your requirement with the supplier concerned only so that they can help prepare or deliver a quotation, and with service providers who help us run the website (for example hosting and email). We may disclose information where the law requires.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">4. Retention and your choices</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              We keep enquiry information for as long as it is needed to deal with your request and for our business records. You can ask us to access, correct or delete your personal information by emailing us.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">5. Security</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              We use reasonable technical and organisational measures to protect your information, but no online service can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">Contact</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Questions about this page? Email{' '}
              <a className="text-[var(--lime-hi)]" href={`mailto:${site.emails.hello}`}>{site.emails.hello}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
