'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-provider';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/admin/sign-in');
      return;
    }
    if (role && role.role === 'customer') {
      router.replace('/admin/sign-in?error=no_access');
    }
  }, [user, role, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--lime)] border-t-transparent" />
      </div>
    );
  }

  if (!user || role?.role === 'customer') return null;

  return (
    <div className="app-shell">
      <AdminSidebar />
      <div className="app-content">
        {children}
      </div>
    </div>
  );
}
