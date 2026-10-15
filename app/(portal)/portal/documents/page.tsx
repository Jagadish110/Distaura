import { createServerSupabaseClient } from '@/lib/supabase/server';
import { DocumentsPage, type CustomerDocumentItem } from '@/components/customer/documents-page';

function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return 'Auto-generated PDF';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function CustomerDocumentsPageServer() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  let companyName = 'Your Organisation';
  if (user) {
    const { data: company } = await supabase
      .from('companies')
      .select('name')
      .eq('user_id', user.id)
      .single();
    if (company) {
      companyName = (company as any).name || companyName;
    }
  }

  // 1. Fetch uploaded documents from documents table (scoped by RLS to own orders & company)
  const { data: rawDocs, error: docsError } = await supabase
    .from('documents')
    .select(`
      id,
      name,
      file_type,
      mime_type,
      size_bytes,
      created_at,
      bucket,
      path,
      owner_type,
      owner_id
    `)
    .order('created_at', { ascending: false });

  if (docsError) {
    console.error('[documents] fetch error:', docsError.message);
  }

  // 2. Fetch orders placed by this company (scoped by RLS)
  const { data: rawOrders, error: ordersError } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      total_paise,
      created_at,
      products ( name ),
      product_plans ( name )
    `)
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.error('[orders for documents] fetch error:', ordersError.message);
  }

  const items: CustomerDocumentItem[] = [];
  const processedOrderIds = new Set<string>();

  // Map explicitly uploaded documents
  (rawDocs ?? []).forEach((doc: any) => {
    let type: CustomerDocumentItem['type'] = 'other';
    if (doc.file_type === 'invoice') type = 'invoice';
    else if (doc.file_type === 'agreement') type = 'agreement';
    else if (doc.file_type === 'credit_note') type = 'credit_note';
    else if (doc.file_type === 'license') type = 'license';

    if (doc.owner_type === 'order' && doc.owner_id) {
      processedOrderIds.add(doc.owner_id);
    }

    items.push({
      id: doc.id,
      name: doc.name,
      type,
      referenceNumber: doc.name.includes('-') ? doc.name.split('.')[0] : `DOC-${doc.id.slice(0, 8).toUpperCase()}`,
      date: formatDate(doc.created_at),
      status: 'valid',
      fileSize: formatFileSize(doc.size_bytes),
      companyName,
    });
  });

  // Map orders to official GST Tax Invoices
  (rawOrders ?? []).forEach((order: any) => {
    // If an uploaded invoice document already exists for this order, don't duplicate
    if (processedOrderIds.has(order.id)) return;

    const productName = (order.products as any)?.name ?? 'Software Subscription';
    const planName = (order.product_plans as any)?.name;
    const displayName = planName ? `${productName} (${planName})` : productName;
    const amountRupees = Math.round(Number(order.total_paise || 0) / 100);

    const isSettled = ['delivered', 'completed', 'payment_received'].includes(order.status);

    items.push({
      id: `inv-order-${order.id}`,
      name: `GST Tax Invoice - ${displayName}`,
      type: 'invoice',
      referenceNumber: `INV-${order.order_number}`,
      date: formatDate(order.created_at),
      amountRupees,
      status: isSettled ? 'settled' : 'pending',
      fileSize: 'E-Invoice PDF',
      orderNumber: order.order_number,
      productName: displayName,
      companyName,
    });
  });

  return (
    <DocumentsPage
      documents={items}
      companyName={companyName}
    />
  );
}
