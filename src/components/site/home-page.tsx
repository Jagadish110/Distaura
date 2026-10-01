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
    title: "1. Diagnose & match",
    copy: "We consult with you to understand your specific challenges and match you with vetted products or specialized services.",
  },
  {
    title: "2. Transparent terms",
    copy: "We agree distributor pricing with the supplier and handle localized rupee procurement with zero hassle.",
  },
  {
    title: "3. Direct delivery",
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
    <div className="relative min-h-dvh overflow-x-hidden bg-canvas pb-24 text-paper">
      <ScrollProgress />
      <div className="grain" aria-hidden="true" />
      <a className="skip" href="#main">
        Skip to content
      </a>

      <div className="relative min-h-dvh" id="top">
        <img
          src="/hero-india.jpg"
          alt=""
          width={1792}
          height={1008}
          className="pointer-events-none absolute inset-0 size-full object-cover object-[70%_center]"
          fetchPriority="high"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-canvas via-canvas/78 to-canvas/10" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-canvas via-transparent to-canvas/45" />
        <div className="relative z-10 flex min-h-dvh flex-col">
          <NavBar />
          <div className="flex flex-1 flex-col justify-center pt-20 pb-8 md:pt-24 md:pb-12">
            <div className="wrap max-w-5xl lg:max-w-6xl">
              <p className="folio">Products & Services / India</p>
              <h1 className="font-display mt-4 text-display text-paper">
                We are the distribution partner for products and services.
              </h1>
              <p className="mt-5 max-w-3xl text-base md:text-lg text-stone leading-relaxed">
                Every business faces distinct operational challenges. We partner directly with you to understand your workflow, diagnose bottlenecks, and connect you with curated products and specialized services—with rupee billing, zero procurement friction, and dedicated onboarding support.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <ButtonLink href="#businesses" size="md">
                  Find solutions for your business
                </ButtonLink>
                <ButtonLink href="#suppliers" variant="line" size="md">
                  Partner with us
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CityMarquee />

      <main id="main">
        <section id="route" className="border-t border-hairline py-20 md:py-28">
          <div className="wrap">
            <Reveal>
              <p className="folio">01 / The route</p>
              <h2 className="font-display mt-4 max-w-2xl text-headline">
                The idea in motion.
              </h2>
              <p className="intro mt-5 max-w-2xl text-stone">
                Products and services move from supplier to business through Distaura.
                Payment moves back. Clean, transparent distribution built for India.
              </p>
            </Reveal>
            <Reveal className="mt-12 rounded-lg border border-hairline bg-panel p-5 md:p-8">
              <ExchangeBoard />
            </Reveal>
          </div>
        </section>

        <section className="relative min-h-[70vh] overflow-hidden border-t border-hairline">
          <img
            src="/house.jpg"
            alt=""
            width={1792}
            height={1008}
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-canvas via-canvas/55 to-canvas/20" />
          <div className="relative flex min-h-[70vh] items-end py-16 md:py-24">
            <Reveal className="wrap max-w-4xl">
              <p className="folio">02 / The house</p>
              <h2 className="font-display mt-5 text-headline italic text-paper">
                We do the distribution and selling, so suppliers can focus on what they build best.
              </h2>
              <p className="mt-6 max-w-2xl text-stone">
                Distaura partners with product creators, specialized service providers, SaaS companies, and B2B solution makers. We agree on distributor terms with each partner, then bring their solutions directly to Indian businesses seeking tailored tools. The supplier keeps full control over fulfillment, quality, and support.
              </p>
            </Reveal>
          </div>
        </section>

        <section
          id="suppliers"
          className="border-t border-hairline py-20 md:py-28"
        >
          <div className="wrap">
            <Reveal>
              <p className="folio">03 / Two sides</p>
              <h2 className="font-display mt-4 max-w-2xl text-headline">
                Two sides, one clear route to market.
              </h2>
            </Reveal>

            <div
              id="businesses"
              className="mt-12 grid overflow-hidden rounded-lg border border-hairline bg-panel lg:grid-cols-2"
            >
              <Reveal className="p-8 md:p-12">
                <h3 className="font-display text-3xl text-brass-hi">
                  For product & service suppliers
                </h3>
                <p className="mt-3 text-stone">
                  Reach more Indian businesses through our sales and
                  distribution network, without building a local team first.
                </p>
                <ul className="split-list">
                  {supplierPoints.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <ButtonLink href={`mailto:${site.emails.partners}?subject=Supplier%20partnership%20enquiry`}>
                  Become a supplier partner
                  <ArrowUpRight className="size-4" />
                </ButtonLink>
              </Reveal>
              <Reveal className="border-t border-hairline p-8 md:p-12 lg:border-t-0 lg:border-l">
                <h3 className="font-display text-3xl text-brass-hi">
                  For businesses
                </h3>
                <p className="mt-3 text-stone">
                  Discover and procure tailored products, tools, and services
                  matched to your exact operational challenges.
                </p>
                <ul className="split-list">
                  {businessPoints.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <ButtonLink
                  href={`mailto:${site.emails.hello}?subject=Business%20enquiry`}
                  variant="line"
                >
                  Tell us what you need
                  <ArrowUpRight className="size-4" />
                </ButtonLink>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="how" className="border-t border-hairline py-20 md:py-28">
          <div className="wrap">
            <Reveal>
              <p className="folio">04 / Method</p>
              <h2 className="font-display mt-4 text-headline">How it works</h2>
            </Reveal>
            <div className="mt-12 grid gap-0 md:grid-cols-3">
              {steps.map((step, index) => (
                <Reveal
                  key={step.title}
                  className="border-hairline py-8 md:border-l md:px-10 md:py-0 md:first:border-l-0 md:first:pl-0 max-md:border-t max-md:first:border-t-0 max-md:first:pt-0"
                >
                  <span className="block font-display text-6xl leading-none text-brass">
                    0{index + 1}
                  </span>
                  <h3 className="font-display mt-6 text-2xl">{step.title}</h3>
                  <p className="mt-3 text-stone">{step.copy}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id="why"
          className="relative overflow-hidden border-t border-hairline"
        >
          <img
            src="/skyline.jpg"
            alt=""
            width={1728}
            height={1152}
            className="absolute inset-0 size-full object-cover opacity-35"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-b from-canvas via-canvas/80 to-canvas" />
          <div className="relative py-20 md:py-28">
            <div className="wrap">
              <Reveal>
                <p className="folio">05 / Stance</p>
                <h2 className="font-display mt-4 max-w-2xl text-headline">
                  Built to be a serious distribution partner.
                </h2>
              </Reveal>
              <div className="mt-12 grid md:grid-cols-2">
                {principles.map((item) => (
                  <Reveal
                    key={item.title}
                    className="border-t border-hairline py-8 md:pr-12 md:even:pl-12 md:even:pr-0"
                  >
                    <h3 className="font-display text-2xl">{item.title}</h3>
                    <p className="mt-2 text-stone">{item.copy}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="relative overflow-hidden border-t border-hairline bg-panel py-20 md:py-28"
        >
          <img
            src="/jali.jpg"
            alt=""
            width={1792}
            height={1008}
            className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-30 lg:block"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-panel via-panel to-panel/40" />
          <div className="relative wrap grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <p className="folio">06 / The desk</p>
              <h2 className="font-display mt-4 text-headline">Let's talk.</h2>
              <p className="mt-5 max-w-xl text-stone">
                Whether you offer products and services or need them tailored for your business, tell us
                a little about what you have in mind and we will get back to
                you.
              </p>
              <div className="mt-8">
                <ContactDesk />
              </div>
            </Reveal>
            <Reveal className="grid content-start gap-8">
              <div>
                <p className="text-sm text-stone">Suppliers</p>
                <a
                  className="mt-1 inline-block border-b border-brass-lo text-lg text-brass-hi no-underline"
                  href={`mailto:${site.emails.partners}`}
                >
                  {site.emails.partners}
                </a>
              </div>
              <div>
                <p className="text-sm text-stone">Businesses</p>
                <a
                  className="mt-1 inline-block border-b border-brass-lo text-lg text-brass-hi no-underline"
                  href={`mailto:${site.emails.hello}`}
                >
                  {site.emails.hello}
                </a>
              </div>
              <div>
                <p className="text-sm text-stone">Phone</p>
                <a
                  className="mt-1 inline-block border-b border-brass-lo text-lg text-brass-hi no-underline"
                  href={site.phoneHref}
                >
                  {site.phone}
                </a>
              </div>
              <div>
                <p className="text-sm text-stone">Based in</p>
                <p className="mt-1 text-lg">{site.basedIn}</p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline py-8 text-sm text-stone">
        <div className="wrap flex flex-wrap items-center justify-between gap-3">
          <span className="font-display text-lg text-paper">{site.name}</span>
          <span>{site.tagline}</span>
        </div>
      </footer>

      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--panel)",
            color: "var(--paper)",
            border: "1px solid var(--hairline)",
          },
        }}
      />
    </div>
  );
}
