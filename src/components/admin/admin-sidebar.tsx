'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Truck, Package, ShoppingCart, DollarSign,
  FileText, HelpCircle, Settings, Users, ChevronLeft, ChevronRight, LogOut,
} from 'lucide-react';
import { Mark } from '@/components/site/mark';
import { useAuth } from '@/lib/auth/auth-provider';
import { useAdminSidebarStore } from '@/lib/stores/ui-store';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, perm: null },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { href: '/admin/suppliers', label: 'Suppliers', icon: Truck, perm: 'suppliers' },
      { href: '/admin/products', label: 'Products', icon: Package, perm: 'products' },
    ],
  },
  {
    label: 'Sales',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, perm: 'orders' },
      { href: '/admin/renewals', label: 'Renewals', icon: FileText, perm: 'orders' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { href: '/admin/commissions', label: 'Commissions', icon: DollarSign, perm: 'commissions' },
      { href: '/admin/invoices', label: 'Invoices', icon: FileText, perm: 'invoices' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { href: '/admin/enquiries', label: 'Enquiries', icon: HelpCircle, perm: 'enquiries' },
      { href: '/admin/customers', label: 'Customers', icon: Users, perm: 'orders' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/team', label: 'Team', icon: Users, perm: 'team' },
      { href: '/admin/settings', label: 'Settings', icon: Settings, perm: null },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { profile, role, signOut } = useAuth();
  const { collapsed, toggle } = useAdminSidebarStore();

  const isAdmin = role?.role === 'admin';
  const perms = role?.permissions ?? [];

  const canSee = (perm: string | null) => {
    if (perm === null) return true;
    if (isAdmin) return true;
    return perms.includes(perm);
  };

  return (
    <aside
      className={cn(
        'relative flex h-full max-h-screen flex-col border-r border-white/5 bg-[var(--panel)] transition-all duration-300',
        collapsed ? 'w-[64px]' : 'w-[220px]',
      )}
    >
      {/* Logo */}
      <Link
        href="/admin/dashboard"
        className={cn(
          'flex shrink-0 items-center gap-2.5 px-4 py-5 no-underline overflow-hidden',
          collapsed && 'justify-center px-0',
        )}
      >
        <Mark className="size-8 shrink-0 drop-shadow-[0_0_10px_rgba(184,224,44,0.4)]" />
        {!collapsed && <span className="logo !text-base font-bold whitespace-nowrap">DISTAURA</span>}
      </Link>

      {/* Nav Groups */}
      <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 pb-4">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((i) => canSee(i.perm));
          if (!visibleItems.length) return null;
          return (
            <div key={group.label} className="mb-2">
              {!collapsed && (
                <p className="mb-1 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted)]">
                  {group.label}
                </p>
              )}
              {visibleItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium no-underline transition-all',
                      collapsed && 'justify-center px-0 py-3',
                      active
                        ? 'bg-[var(--lime)]/15 text-[var(--lime-hi)]'
                        : 'text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]',
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {!collapsed && label}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User info + Sign out */}
      <div className={cn(
        'shrink-0 border-t border-white/5 p-2',
        collapsed ? 'flex flex-col items-center gap-1' : '',
      )}>
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--lime)]/20 text-xs font-bold text-[var(--lime-hi)]">
                {profile?.full_name?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-[var(--text)]">{profile?.full_name}</p>
                <p className="text-[0.65rem] capitalize text-[var(--muted)]">{role?.role}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-[var(--muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="size-3.5 shrink-0" />
              <span>Sign out</span>
            </button>
          </>
        ) : (
          <button
            onClick={signOut}
            title="Sign out"
            className="flex size-9 items-center justify-center rounded-xl text-[var(--muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="size-4" />
          </button>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-20 flex size-6 items-center justify-center rounded-full border border-white/10 bg-[var(--panel)] text-[var(--muted)] shadow transition-colors hover:text-[var(--text)]"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
      </button>
    </aside>
  );
}
