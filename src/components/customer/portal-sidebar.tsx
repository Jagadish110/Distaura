'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, FileText,
  HelpCircle, Settings, RefreshCcw, Bell, User, LogOut,
} from 'lucide-react';
import { Mark } from '@/components/site/mark';
import { useAuth } from '@/lib/auth/auth-provider';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/portal/products', label: 'Products', icon: Package },
  { href: '/portal/orders', label: 'My Orders', icon: ShoppingCart },
  { href: '/portal/renewals', label: 'Renewals', icon: RefreshCcw },
  { href: '/portal/documents', label: 'Documents', icon: FileText },
  { href: '/portal/notifications', label: 'Notifications', icon: Bell },
  { href: '/portal/settings', label: 'Settings', icon: Settings },
  { href: '/portal/help', label: 'Help', icon: HelpCircle },
];

export function PortalSidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex h-full max-h-screen w-[220px] flex-col border-r border-white/5 bg-[var(--panel)]">
      {/* Logo */}
      <Link href="/" className="flex shrink-0 items-center gap-2.5 px-5 py-5 no-underline">
        <Mark className="size-8 drop-shadow-[0_0_10px_rgba(184,224,44,0.4)]" />
        <span className="logo !text-lg font-bold">DISTAURA</span>
      </Link>

      {/* Nav */}
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-medium no-underline transition-all',
                active
                  ? 'bg-[var(--lime)]/15 text-[var(--lime-hi)]'
                  : 'text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]',
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="text-[13.5px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="shrink-0 border-t border-white/5 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Link
          href="/portal/account"
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-2 text-sm no-underline transition-all',
            'text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]',
          )}
        >
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--lime)]/20 text-xs font-semibold text-[var(--lime-hi)]">
            {profile?.full_name?.[0]?.toUpperCase() ?? <User className="size-3.5" />}
          </div>
          <span className="truncate">{profile?.full_name || 'My Account'}</span>
        </Link>
        <button
          onClick={signOut}
          className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-[var(--muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="size-3.5 shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
