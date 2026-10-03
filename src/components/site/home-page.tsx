import { ArrowUpRight } from "lucide-react";
import { Toaster } from "sonner";
import { ButtonLink } from "@/components/site/button";
import { ContactDesk } from "@/components/site/contact-desk";
import { ExchangeBoard } from "@/components/site/exchange-board";
import { NavBar } from "@/components/site/nav-bar";
import { Reveal } from "@/components/site/reveal";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { site } from "@/lib/site";

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
    title: "Diagnose & match",
    copy: "We consult with you to understand your specific challenges and match you with vetted products or specialized services.",
  },
  {
    title: "Transparent terms",
    copy: "We agree distributor pricing with the supplier and handle localized rupee procurement with zero hassle.",
  },
  {
    title: "Direct delivery",
    copy: "The supplier fulfils the product or service directly, while Distaura stays by your side throughout onboarding.",
  },
];

const principles = [
  {
    title: "Distribution first",
    copy: "We are not an open catalog or passive affiliate site. Selling and matching the right solution is our core job.",
  },
  {
    title: "Asset light",
    copy: "No heavy inventory or warehouses, so our full focus goes into serving customers and supplier partners.",
  },
  {
    title: "Curated portfolio",
    copy: "We work with a focused set of vetted products and services we can properly stand behind.",
  },
  {
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

export function HomePage() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[var(--bg)] pb-24 text-[var(--text)]">
      <ScrollProgress />
      <div className="grain" aria-hidden="true" />
      <a className="skip" href="#main">
        Skip to content
      </a>

      {/* ── Hero Section ────────────────────────────────────────── */}
      <div className="relative min-h-dvh" id="top">
        <img
          src="/hero-india.jpg"
          alt=""
          width={1792}
          height={1008}
          className="pointer-events-none absolute inset-0 size-full object-cover object-[70%_center] opacity-80"
          fetchPriority="high"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1a1b19] via-[#1a1b19]/85 to-[#1a1b19]/25" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1b19] via-transparent to-[#1a1b19]/50" />

        <div className="relative z-10 flex min-h-dvh flex-col">
          <NavBar />

          <div className="flex flex-1 flex-col justify-center pt-24 pb-12 md:pt-28 md:pb-16">
            <div className="wrap max-w-5xl lg:max-w-6xl">
              <p className="folio">Products & Services / India</p>

              <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--text)]">
                We are the distribution partner for products and services.
              </h1>

              <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-[var(--muted)] md:text-xl">
                Distaura connects software and product suppliers with Indian businesses.
                We handle customer acquisition and localized sales, the supplier delivers,
                and the business gets a solution that fits.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <ButtonLink href="#suppliers">
                  Partner with us
                </ButtonLink>
                <ButtonLink href="#businesses" variant="alt">
                  Find a solution
                </ButtonLink>
              </div>

              <p className="mt-12 max-w-xl text-sm text-[var(--muted)]">
                No warehouses and no inventory. Solutions are sold and delivered remotely,
                so our focus stays entirely on reaching the right buyers.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main id="main">
        {/* ── Marquee Section ─────────────────────────────────────── */}
        <CityMarquee />

        {/* ── Exchange Board Section ──────────────────────────────── */}
        <section id="route" className="border-t border-white/5 py-20 md:py-28">
          <div className="wrap">
            <Reveal>
              <p className="folio">02 / Exchange</p>
              <h2 className="mt-4 text-headline">
                How Distaura works
              </h2>
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

        {/* ── Two Sides Section ───────────────────────────────────── */}
        <section
          id="suppliers"
          className="border-t border-white/5 py-20 md:py-28"
        >
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

            <div
              id="businesses"
              className="mt-12 grid gap-8 lg:grid-cols-2"
            >
              <Reveal className="card flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-2xl md:text-3xl text-[var(--lime-hi)]">
                    For software suppliers
                  </h3>
                  <p className="mt-3 text-[var(--muted)]">
                    Reach more Indian businesses through our sales and distribution network,
                    without building an expensive local team first.
                  </p>
                  <ul className="split-list">
                    {supplierPoints.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2">
                  <ButtonLink
                    href={`mailto:${site.emails.partners}?subject=${encodeURIComponent("Supplier partnership enquiry")}`}
                  >
                    Become a partner
                    <ArrowUpRight className="size-4" />
                  </ButtonLink>
                </div>
              </Reveal>

              <Reveal className="card flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-2xl md:text-3xl text-[var(--lime-hi)]">
                    For businesses
                  </h3>
                  <p className="mt-3 text-[var(--muted)]">
                    Discover and procure tailored products, tools, and services
                    matched to your exact operational challenges.
                  </p>
                  <ul className="split-list">
                    {businessPoints.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2">
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

        {/* ── How It Works Section ─────────────────────────────────── */}
        <section id="how" className="border-t border-white/5 py-20 md:py-28">
          <div className="wrap">
            <Reveal>
              <p className="folio">04 / Method</p>
              <h2 className="mt-4 text-headline">How it works</h2>
            </Reveal>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <Reveal key={step.title} className="card">
                  <div className="num">{index + 1}</div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-[var(--lime-hi)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[var(--muted)]">{step.copy}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stance / Principles Section ──────────────────────────── */}
        <section
          id="why"
          className="relative overflow-hidden border-t border-white/5 py-20 md:py-28"
        >
          <img
            src="/skyline.jpg"
            alt=""
            width={1728}
            height={1152}
            className="pointer-events-none absolute inset-0 size-full object-cover opacity-25"
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

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {principles.map((item) => (
                <Reveal key={item.title} className="card">
                  <h3 className="font-display text-xl font-semibold text-[var(--lime-hi)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[var(--muted)]">{item.copy}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact Desk Section ─────────────────────────────────── */}
        <section
          id="contact"
          className="relative overflow-hidden border-t border-white/5 py-20 md:py-28"
        >
          <img
            src="/jali.jpg"
            alt=""
            width={1792}
            height={1008}
            className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-25 lg:block"
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
                    Active partner onboarding across 12+ metro hubs
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 text-sm text-[var(--muted)]">
        <div className="wrap flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo-badge.png"
              alt="Distaura"
              className="size-9 rounded-full object-contain drop-shadow-[0_0_10px_rgba(184,224,44,0.4)]"
            />
            <span className="logo !text-xl font-bold">{site.name}</span>
          </div>
          <span>{site.tagline}</span>
        </div>
      </footer>

      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--card)",
            color: "var(--text)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "var(--raise)",
          },
        }}
      />
    </div>
  );
}
