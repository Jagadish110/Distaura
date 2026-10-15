'use client';

import { useState } from 'react';
import { Shield, Clock, Search, FileText, Database, UserCheck } from 'lucide-react';

interface AuditEntry {
  id: string;
  tableName: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  actorEmail: string;
  timestamp: string;
  details: string;
}

const MOCK_AUDIT: AuditEntry[] = [
  {
    id: 'aud-001',
    tableName: 'orders',
    operation: 'UPDATE',
    actorEmail: 'mottu9719@gmail.com',
    timestamp: '2026-10-04 12:45:10 IST',
    details: 'Order ORD-2026-0891 status changed to fulfilled; license credentials issued',
  },
  {
    id: 'aud-002',
    tableName: 'commissions',
    operation: 'INSERT',
    actorEmail: 'system_trigger',
    timestamp: '2026-10-04 11:30:22 IST',
    details: 'Generated 15% distributor commission ledger entry for TechCorp India Pvt Ltd',
  },
  {
    id: 'aud-003',
    tableName: 'products',
    operation: 'INSERT',
    actorEmail: 'mottu9719@gmail.com',
    timestamp: '2026-10-04 10:15:00 IST',
    details: 'Created software listing TechCRM Enterprise (slug: techcrm-enterprise)',
  },
  {
    id: 'aud-004',
    tableName: 'app_settings',
    operation: 'UPDATE',
    actorEmail: 'mottu9719@gmail.com',
    timestamp: '2026-10-04 09:00:15 IST',
    details: 'Updated statutory GST tax rate parameter to 18%',
  },
];

export default function AdminAuditLogsPage() {
  const [logs] = useState<AuditEntry[]>(MOCK_AUDIT);
  const [search, setSearch] = useState('');

  const filtered = logs.filter(
    (l) =>
      l.tableName.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.actorEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
            Compliance & Telemetry
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-stone-100">
            Immutable Audit Log
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Cryptographically sealed system audit events recorded by Postgres triggers. Read-only records.
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter audit records..."
          className="w-full rounded-xl border border-white/10 bg-[#191a18] py-2 pl-9 pr-3 text-xs text-stone-100 placeholder:text-stone-500 focus:border-[var(--lime)] focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1d1a] shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/5 font-semibold text-stone-300">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Entity / Table</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Event Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-stone-300">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-mono text-[var(--muted)] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-4 px-4 font-mono font-medium text-stone-200">
                    {log.tableName}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        log.operation === 'INSERT'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : log.operation === 'UPDATE'
                          ? 'bg-blue-500/15 text-blue-400'
                          : 'bg-red-500/15 text-red-400'
                      }`}
                    >
                      {log.operation}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-stone-200">
                    {log.actorEmail}
                  </td>
                  <td className="py-4 px-4 text-stone-300 leading-relaxed">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
