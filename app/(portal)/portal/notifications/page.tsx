'use client';

import { useState } from 'react';
import { Bell, CheckCircle2, Clock, AlertTriangle, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category: 'renewal' | 'order' | 'compliance' | 'security';
  date: string;
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Upcoming License Renewal - SecureVault Endpoint Guard',
    body: 'Your 25-seat license will expire in 37 days (10 Nov 2026). Early renewal secures current tariff rates.',
    category: 'renewal',
    date: '2 hours ago',
    isRead: false,
  },
  {
    id: 'n-2',
    title: 'Tax Invoice Generated - INV-2026-0412',
    body: 'Your GST Tax Invoice for TechCRM Pro Annual Subscription has been generated and filed with the portal.',
    category: 'order',
    date: '1 day ago',
    isRead: false,
  },
  {
    id: 'n-3',
    title: 'Security Notice: New Team Member Authorized',
    body: 'Senthil Nathan has accepted the technical access role for your corporate workspace.',
    category: 'security',
    date: '3 days ago',
    isRead: true,
  },
];

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  function markAllRead() {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read.');
  }

  function clearNotification(id: string) {
    setNotifications(notifications.filter((n) => n.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
            Activity & Telemetry
          </p>
          <h1
            className="mt-1 font-display font-bold text-stone-100 tracking-tight"
            style={{ fontSize: '1.25rem', lineHeight: '1.75rem' }}
          >
            Notifications & Alerts
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Stay informed on subscription milestones, fulfillment dispatches, and compliance notices.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-stone-300 transition-colors hover:bg-white/10"
        >
          <CheckCircle2 className="size-3.5 text-[var(--lime)]" />
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`flex items-start justify-between gap-4 rounded-2xl border p-5 transition-all ${
              item.isRead
                ? 'border-white/5 bg-[#171815] text-[var(--muted)]'
                : 'border-[var(--lime)]/30 bg-[#1c1d1a] shadow-[0_10px_30px_rgba(0,0,0,0.4)]'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                  item.isRead ? 'bg-white/5 text-stone-400' : 'bg-[var(--lime)]/15 text-[var(--lime-hi)]'
                }`}
              >
                <Bell className="size-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className={`text-xs font-semibold ${item.isRead ? 'text-stone-300' : 'text-stone-100'}`}>
                    {item.title}
                  </p>
                  {!item.isRead && (
                    <span className="size-2 rounded-full bg-[var(--lime)] drop-shadow-[0_0_6px_rgba(184,224,44,0.6)]" />
                  )}
                </div>
                <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">{item.body}</p>
                <span className="mt-2 block text-[10px] text-stone-500">{item.date}</span>
              </div>
            </div>

            <button
              onClick={() => clearNotification(item.id)}
              className="rounded-lg p-1.5 text-stone-500 hover:bg-white/5 hover:text-stone-300"
              title="Dismiss"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
