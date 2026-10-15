import type { Metadata } from 'next';
import { VerifyEmailPage } from '@/components/auth/verify-email';

export const metadata: Metadata = { title: 'Verify Email' };

export default function VerifyEmail() {
  return <VerifyEmailPage />;
}
