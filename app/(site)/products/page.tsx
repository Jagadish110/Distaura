import { Suspense } from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { PublicProduct } from '@/lib/supabase/types';
import { CataloguePage } from '@/components/site/catalogue-page';

// ── Data layer ────────────────────────────────────────────────────────────────

async function getProducts(): Promise<PublicProduct[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('public_products')
    .select('*')
    .order('product_sort', { ascending: true });

  if (error) {
    console.error('[catalogue] failed to fetch products:', error.message);
    return [];
  }

  return data ?? [];
}

async function getCategories() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('sort_order', { ascending: true });

  return data ?? [];
}

// ── Page ──────────────────────────────────────────────────────────────────────

export const metadata = {
  title: 'Software Catalogue | Distaura',
  description:
    'Browse verified enterprise software suites with GST-compliant INR pricing and dedicated Indian deployment support.',
};

export default async function PublicCataloguePageServer() {
  const [rows, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <Suspense>
      <CataloguePage rows={rows} categories={categories} />
    </Suspense>
  );
}
