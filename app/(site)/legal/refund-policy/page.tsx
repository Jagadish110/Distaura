import { redirect } from 'next/navigation';

export default function LegalRefundRedirect() {
  redirect('/refund-policy');
}
