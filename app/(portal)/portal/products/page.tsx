import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProductCatalogue } from '@/components/customer/product-catalogue';

export const metadata: Metadata = {
  title: 'Browse Products',
  description: 'Browse software products available through Distaura for your business.',
};

export default async function PortalProductsPage() {
  const supabase = await createServerSupabaseClient();

  const [productsRes, categoriesRes] = await Promise.all([
    supabase
      .from('public_products')
      .select('*')
      .order('product_sort', { ascending: true }),
    supabase.from('categories').select('*').order('sort_order'),
  ]);

  return (
    <ProductCatalogue
      products={productsRes.data ?? []}
      categories={categoriesRes.data ?? []}
    />
  );
}
