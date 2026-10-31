// Seeds the Acreo Tech service catalogue (Schedule A, October 2026) into Supabase.
// Idempotent: categories and products are upserted by slug.
// Usage: node scripts/seed-acreo-catalogue.mjs
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

const env = Object.fromEntries(
  fs
    .readFileSync('.env.local', 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]),
);
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const SUPPLIER_ID = 'be7cb8a5-674d-4acd-b099-03912504a839'; // Acreo Tech

const categories = [
  { slug: 'websites', name: 'Websites', sort_order: 1 },
  { slug: 'web-apps', name: 'Web Apps', sort_order: 2 },
  { slug: 'mobile-apps', name: 'Mobile Apps', sort_order: 3 },
  { slug: 'automation-ai', name: 'Automation & AI', sort_order: 4 },
  { slug: 'social-media', name: 'Social Media', sort_order: 5 },
  { slug: 'custom-software', name: 'Custom Software', sort_order: 6 },
  { slug: 'maintenance', name: 'Maintenance (AMC)', sort_order: 7 },
];

// [slug, name, category, scope, indicative price, typical timeline, best for]
const services = [
  ['landing-page', 'Landing Page', 'websites', 'One responsive page, contact form, basic SEO', '₹4,000 – ₹8,000', '3–5 days', 'New businesses, campaigns and product launches'],
  ['business-website', 'Business Website', 'websites', '5–8 responsive pages, contact/WhatsApp integration, basic SEO', '₹12,000 – ₹30,000', '1–2 weeks', 'Small and growing businesses that need a professional web presence'],
  ['advanced-website', 'Advanced Website', 'websites', 'CMS/blog, animations, integrations, speed optimisation', '₹30,000 – ₹60,000+', '2–4 weeks', 'Businesses that publish content regularly or need integrations'],
  ['ecommerce-store', 'E-commerce Store', 'websites', 'Catalogue, cart, payment gateway, admin panel', '₹35,000 – ₹80,000+', '3–5 weeks', 'Retailers and brands selling online'],
  ['mvp-internal-web-tool', 'MVP / Internal Web Tool', 'web-apps', 'Authentication, dashboard, core workflow, admin', '₹40,000 – ₹90,000', '3–6 weeks', 'Startups validating an idea and teams replacing spreadsheets'],
  ['full-web-app', 'Full Web App', 'web-apps', 'Multi-role access, integrations, payments, reporting', '₹90,000 – ₹3,00,000+', '6–12 weeks', 'Businesses building a customer-facing or operational platform'],
  ['simple-mobile-app', 'Simple Mobile App', 'mobile-apps', 'Cross-platform, a few screens, basic backend', '₹50,000 – ₹1,00,000', '4–6 weeks', 'Businesses launching a first mobile app'],
  ['full-mobile-app', 'Full Mobile App', 'mobile-apps', 'Auth, payments, notifications, admin panel, store submission', '₹1,00,000 – ₹4,00,000+', '8–14 weeks', 'Businesses that need a complete app on the Play Store and App Store'],
  ['workflow-automation', 'Workflow Automation', 'automation-ai', 'Automation across forms, sheets, email, WhatsApp, CRM', '₹8,000 – ₹30,000', '3–10 days', 'Teams spending time on repetitive manual tasks'],
  ['ai-chatbot-assistant', 'AI Chatbot / Assistant', 'automation-ai', 'Trained on client data; website or WhatsApp deployment', '₹20,000 – ₹75,000', '1–3 weeks', 'Businesses handling frequent customer questions'],
  ['custom-ai-solution', 'Custom AI Solution', 'automation-ai', 'Document processing, internal AI tools, integrations', '₹50,000 – ₹2,00,000+', 'Scoped per project', 'Teams with document-heavy or specialised workflows'],
  ['social-media-starter', 'Social Media – Starter', 'social-media', 'Profile setup, 8 posts/month, one platform', '₹6,000 / month', 'Monthly', 'Businesses starting out on social media'],
  ['social-media-growth', 'Social Media – Growth', 'social-media', '12–16 posts, two platforms, basic reporting', '₹12,000 / month', 'Monthly', 'Businesses growing an audience on two platforms'],
  ['social-media-premium', 'Social Media – Premium', 'social-media', 'Content calendar, reels, three platforms, ad management support', '₹20,000+ / month', 'Monthly', 'Brands running an active, multi-platform presence'],
  ['custom-software', 'Custom Software', 'custom-software', 'Quoted after a requirements call', '₹25,000 – ₹3,00,000+ typical', 'Scoped per project', 'Requirements that do not fit a standard package'],
  ['amc-basic', 'AMC – Basic', 'maintenance', 'Hosting support, security updates, minor fixes', '~10% of project value / year; ₹6,000 minimum', 'Annual', 'Keeping an existing website or app running safely'],
  ['amc-standard', 'AMC – Standard', 'maintenance', 'Basic plus monthly content/feature updates, backups, priority support', '~15% of project value / year', 'Annual', 'Sites and apps that change regularly'],
  ['amc-premium', 'AMC – Premium', 'maintenance', 'Standard plus performance monitoring and dedicated support hours', '~20% of project value / year', 'Annual', 'Business-critical sites and apps'],
];

const { data: cats, error: catErr } = await sb
  .from('categories')
  .upsert(categories, { onConflict: 'slug' })
  .select('id, slug');
if (catErr) throw catErr;
const catId = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

const rows = services.map(([slug, name, cat, scope, price, timeline, bestFor], i) => {
  const social = cat === 'social-media';
  return {
    supplier_id: SUPPLIER_ID,
    category_id: catId[cat],
    slug,
    name,
    short_desc: `${scope}.`,
    description:
      `${scope}. Best for: ${bestFor}. ` +
      `Indicative price ${price}, before GST. Typical timeline: ${timeline}. ` +
      (social ? 'Advertising spend is separate. ' : '') +
      'Final price depends on scope and is confirmed in a written quotation.',
    features: [
      `Indicative price: ${price} + GST`,
      `Typical timeline: ${timeline}`,
      `Best for: ${bestFor}`,
      ...(social ? ['Advertising spend is billed separately'] : []),
    ],
    delivery_time: timeline,
    status: 'published',
    sort_order: i + 1,
  };
});

const { data: prods, error: prodErr } = await sb
  .from('products')
  .upsert(rows, { onConflict: 'slug' })
  .select('slug');
if (prodErr) throw prodErr;
console.log(`Upserted ${cats.length} categories and ${prods.length} products.`);
