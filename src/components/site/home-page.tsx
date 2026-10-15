import { ArrowUpRight, ArrowRight, CheckCircle2, TrendingUp, Zap, Globe2, Shield } from "lucide-react";
import { ButtonLink } from "@/components/site/button";
import { ContactDesk } from "@/components/site/contact-desk";
import { ExchangeBoard } from "@/components/site/exchange-board";
import { Reveal } from "@/components/site/reveal";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { site } from "@/lib/site";
import Link from "next/link";

const supplierPoints = [
  "Direct access to Indian businesses actively seeking solutions",
  "A dedicated sales and distribution partner for your offerings",
  "You retain delivery, client relationship, and quality control",
  "Clear distributor terms and pricing agreed upfront",
];

const businessPoints = [
  "Curated solutions matched to your exact business needs",
  "One trusted partner for discovery, purchasing, and billing",
  "Purchasing handled locally in India, invoiced in rupees",
  "Direct delivery and onboarding backed by the supplier",
];

const steps = [
  {
    number: "01",
    title: "Diagnose & match",
    copy: "We consult with you to understand your specific challenges and match you with vetted products or specialized services.",
    color: "from-[var(--lime)]/20 to-emerald-500/5",
    highlight: "var(--lime)",
  },
  {
    number: "02",
    title: "Transparent terms",
    copy: "We agree distributor pricing with the supplier and handle localized rupee procurement with zero hassle.",
    color: "from-emerald-400/20 to-teal-500/5",
    highlight: "rgb(52 211 153)",
  },
  {
    number: "03",
    title: "Direct delivery",
    copy: "The supplier fulfils the product or service directly, while Distaura stays by your side throughout onboarding.",
    color: "from-teal-400/20 to-cyan-500/5",
    highlight: "rgb(45 212 191)",
  },
];

const principles = [
  {
    icon: TrendingUp,
    title: "Distribution first",
    copy: "We are not an open catalog or passive affiliate site. Selling and matching the right solution is our core job.",
  },
  {
    icon: Zap,
    title: "Asset light",
    copy: "No heavy inventory or warehouses, so our full focus goes into serving customers and supplier partners.",
  },
  {
    icon: Shield,
    title: "Curated portfolio",
    copy: "We work with a focused set of vetted products and services we can properly stand behind.",
  },
  {
    icon: Globe2,
    title: "Clear agreements",
    copy: "Pricing, support, and responsibilities are clearly defined with every partner.",
  },
];


function CityMarquee() {
  const loop = [...site.cities, ...site.cities];
  return (
    <div className="marquee" aria-label="Cities we sell into">
      <div className="marquee-track">
        {loop.map((city, index) => (
          <span className="marquee-item" key={`${city}-${index}`}>
            {city}
          </span>
        ))}
      </div>
    </div>
  );
}

// Server Component
export function HomePage() {
  return (
    <>
      <ScrollProgress />

      {/* ── Hero Section ────────────────────────────────────────── */}
      <div className="relative min-h-dvh overflow-hidden" id="top">
        <img
          src="/hero-india.jpg"
          alt=""
          width={1792}
          height={1008}
          className="pointer-events-none absolute inset-0 size-full object-cover object-[70%_center]"
          fetchPriority="high"
        />
        {/* Rich layered overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1a1b19] via-[#1a1b19]/90 to-[#1a1b19]/30" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1b19] via-transparent to-[#1a1b19]/60" />
        {/* Lime ambient glow */}
        <div className="pointer-events-none absolute -bottom-40 -left-40 size-[700px] rounded-full bg-[var(--lime)]/8 blur-[160px]" />

        <div className="relative z-10 flex min-h-dvh flex-col">
          <div className="flex flex-1 flex-col justify-center pt-28 pb-16 md:pt-32 md:pb-20">
            <div className="wrap max-w-5xl lg:max-w-6xl">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-4 py-1.5 text-xs font-semibold text-[var(--lime-hi)] backdrop-blur-sm mb-6">
                <span className="size-1.5 rounded-full bg-[var(--lime)] animate-pulse" />
                B2B Software Distribution · India
              </div>

              <h1 className="font-display text-[clamp(2.6rem,6.5vw,5rem)] font-bold leading-[1.06] tracking-[-0.03em] text-[var(--text)]">
                Your distribution partner<br />
                <span className="text-[var(--lime-hi)]">for India's enterprise market.</span>
              </h1>

              <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-[var(--muted)] md:text-xl">
                Distaura connects software and product suppliers with Indian businesses.
                We handle customer acquisition and localized sales — the supplier delivers,
                and the business gets a solution that fits.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <ButtonLink href="#suppliers">
                  Become a partner
                  <ArrowUpRight className="size-4" />
                </ButtonLink>
                <ButtonLink href="/products" variant="alt">
                  Browse catalogue
                  <ArrowRight className="size-4" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main id="main">
        {/* ── City Marquee ─────────────────────────────────────── */}
        <CityMarquee />

        {/* ── Exchange Board ──────────────────────────────────── */}
        <section id="route" className="border-t border-white/5 py-20 md:py-28">
          <div className="wrap">
            <Reveal>
              <p className="folio">02 / Exchange</p>
              <h2 className="mt-4 text-headline">How Distaura works</h2>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                A clean, transparent bridge aligning supplier products with business demand
                across India.
              </p>
            </Reveal>

            <Reveal className="mt-12">
              <ExchangeBoard />
            </Reveal>
          </div>
        </section>

        {/* ── Two Sides ───────────────────────────────────────── */}
        <section id="suppliers" className="border-t border-white/5 py-20 md:py-28">
          <div className="wrap">
            <Reveal>
              <p className="folio">03 / Two sides</p>
              <h2 className="mt-4 max-w-2xl text-headline">
                Two sides, one clear route to market.
              </h2>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                We agree distributor terms with each supplier and sell their solutions to businesses
                across India. The supplier keeps control of delivery and support.
              </p>
            </Reveal>

            <div id="businesses" className="mt-12 grid gap-6 lg:grid-cols-2">
              <Reveal className="card flex flex-col justify-between group hover:border-[var(--lime)]/30 transition-colors duration-300">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-[var(--lime)]/20 bg-[var(--lime)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--lime-hi)]">
                    <Shield className="size-3.5" />
                    For software suppliers
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl text-[var(--lime-hi)]">
                    Reach Indian businesses at scale
                  </h3>
                  <p className="mt-3 text-[var(--muted)]">
                    Reach more Indian businesses through our sales and distribution network,
                    without building an expensive local team first.
                  </p>
                  <ul className="split-list mt-4">
                    {supplierPoints.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="size-3.5 shrink-0 text-[var(--lime)] mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4">
                  <ButtonLink
                    href={`mailto:${site.emails.partners}?subject=${encodeURIComponent("Supplier partnership enquiry")}`}
                  >
                    Become a partner
                    <ArrowUpRight className="size-4" />
                  </ButtonLink>
                </div>
              </Reveal>

              <Reveal className="card flex flex-col justify-between group hover:border-white/15 transition-colors duration-300">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-stone-300">
                    <Globe2 className="size-3.5" />
                    For businesses
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl text-[var(--lime-hi)]">
                    Discover & procure with confidence
                  </h3>
                  <p className="mt-3 text-[var(--muted)]">
                    Discover and procure tailored products, tools, and services
                    matched to your exact operational challenges.
                  </p>
                  <ul className="split-list mt-4">
                    {businessPoints.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="size-3.5 shrink-0 text-[var(--lime)] mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4">
                  <ButtonLink
                    href={`mailto:${site.emails.hello}?subject=${encodeURIComponent("Business enquiry")}`}
                    variant="alt"
                  >
                    Tell us what you need
                    <ArrowUpRight className="size-4" />
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Featured Products CTA ──────────────────────────── */}
        <section className="border-t border-white/5 py-16 md:py-20 bg-gradient-to-b from-transparent to-[#161815]/60">
          <div className="wrap">
            <Reveal>
              <div className="rounded-3xl border border-[var(--lime)]/20 bg-gradient-to-br from-[#1e2218] via-[#1a1b19] to-[#1a1b19] p-8 sm:p-12 relative overflow-hidden">
                <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-[var(--lime)]/10 blur-3xl" />
                <div className="relative max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-3 py-1 text-xs font-semibold text-[var(--lime-hi)] mb-5">
                    <Zap className="size-3" />
                    Live Catalogue
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-100">
                    Browse verified enterprise software — priced in INR.
                  </h2>
                  <p className="mt-4 text-[var(--muted)] text-sm leading-relaxed">
                    GST-compliant accounting, cloud ERPs, CRMs, security tooling, and more.
                    Every listing comes with transparent pricing and dedicated Indian deployment support.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 rounded-xl bg-[var(--lime)] px-5 py-3 text-sm font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)] hover:shadow-[0_0_25px_rgba(184,224,44,0.35)]"
                    >
                      Browse Catalogue <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      href="/find-a-solution"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-stone-200 hover:bg-white/10"
                    >
                      Request custom solution
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── How It Works ──────────────────────────────────── */}
        <section id="how" className="border-t border-white/5 py-20 md:py-28">
          <div className="wrap">
            <Reveal>
              <p className="folio">04 / Method</p>
              <h2 className="mt-4 text-headline">How it works</h2>
              <p className="mt-3 max-w-xl text-[var(--muted)]">
                A straightforward three-step process gets you from need to solution.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <Reveal key={step.title} className="relative">
                  <div className={`card h-full bg-gradient-to-br ${step.color} border-white/10 hover:border-white/20 transition-colors`}>
                    <div className="font-display text-5xl font-black text-white/5 leading-none mb-4">
                      {step.number}
                    </div>
                    <h3
                      className="font-display text-xl font-semibold"
                      style={{ color: step.highlight }}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[var(--muted)] text-sm leading-relaxed">
                      {step.copy}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Principles / Stance ──────────────────────────── */}
        <section
          id="why"
          className="relative overflow-hidden border-t border-white/5 py-20 md:py-28"
        >
          <img
            src="/skyline.jpg"
            alt=""
            width={1728}
            height={1152}
            className="pointer-events-none absolute inset-0 size-full object-cover opacity-20"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1a1b19] via-[#1a1b19]/80 to-[#1a1b19]" />

          <div className="relative wrap">
            <Reveal>
              <p className="folio">05 / Stance</p>
              <h2 className="mt-4 max-w-2xl text-headline">
                Built to be a serious distribution partner.
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {principles.map((item) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} className="card group hover:border-[var(--lime)]/20 transition-colors">
                    <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-[var(--lime)]/10 text-[var(--lime)]">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[var(--lime-hi)]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[var(--muted)]">{item.copy}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Contact Desk ────────────────────────────────── */}
        <section
          id="contact"
          className="relative overflow-hidden border-t border-white/5 py-20 md:py-28"
        >
          <img
            src="/jali.jpg"
            alt=""
            width={1792}
            height={1008}
            className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-20 lg:block"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1a1b19] via-[#1a1b19] to-[#1a1b19]/40" />

          <div className="relative wrap grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <Reveal className="card">
              <p className="folio">06 / The desk</p>
              <h2 className="mt-4 text-headline">Let&apos;s talk.</h2>
              <p className="mt-4 max-w-xl text-[var(--muted)]">
                Whether you build software and services or need them tailored for your business in
                India, tell us what you have in mind and we will get back to you promptly.
              </p>
              <div className="mt-8">
                <ContactDesk />
              </div>
            </Reveal>

            <Reveal className="card flex flex-col justify-between">
              <div>
                <h3 className="font-display text-2xl font-semibold text-[var(--lime-hi)]">
                  Direct channels
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Reach our distribution desks directly for immediate inquiries.
                </p>

                <div className="mt-8 space-y-6">
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-[var(--muted)]">
                      Suppliers
                    </span>
                    <a
                      className="mt-1 inline-block text-lg font-semibold text-[var(--lime-hi)] transition-colors hover:text-white"
                      href={`mailto:${site.emails.partners}`}
                    >
                      {site.emails.partners}
                    </a>
                  </div>

                  <div>
                    <span className="block text-xs uppercase tracking-wider text-[var(--muted)]">
                      Businesses
                    </span>
                    <a
                      className="mt-1 inline-block text-lg font-semibold text-[var(--lime-hi)] transition-colors hover:text-white"
                      href={`mailto:${site.emails.hello}`}
                    >
                      {site.emails.hello}
                    </a>
                  </div>

                  <div>
                    <span className="block text-xs uppercase tracking-wider text-[var(--muted)]">
                      Phone
                    </span>
                    <a
                      className="mt-1 inline-block text-lg font-semibold text-[var(--lime-hi)] transition-colors hover:text-white"
                      href={site.phoneHref}
                    >
                      {site.phone}
                    </a>
                  </div>

                  <div>
                    <span className="block text-xs uppercase tracking-wider text-[var(--muted)]">
                      Headquarters
                    </span>
                    <p className="mt-1 text-lg font-semibold text-[var(--text)]">
                      {site.basedIn}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-white/5 bg-[#171815] p-5 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3">
                  <div className="size-3 rounded-full bg-[var(--lime)] shadow-[0_0_8px_var(--lime)]" />
                  <span className="text-sm font-medium text-[var(--muted)]">
                    Active partner onboarding across {site.cities.length}+ metro hubs
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
