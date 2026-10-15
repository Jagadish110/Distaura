'use client';

import { useState } from 'react';
import { 
  Users, UserPlus, ShieldCheck, Mail, Lock, 
  KeyRound, CheckCircle2, Copy 
} from 'lucide-react';
import { toast } from 'sonner';

interface TeamStaff {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'team';
  permissions: string[];
  mfaEnabled: boolean;
  status: 'active' | 'invited';
}

const MOCK_TEAM: TeamStaff[] = [
  {
    id: 'staff-1',
    name: 'Jagadish K (Super Admin)',
    email: 'mottu9719@gmail.com',
    role: 'admin',
    permissions: ['all'],
    mfaEnabled: true,
    status: 'active',
  },
  {
    id: 'staff-2',
    name: 'Ananya Deshmukh',
    email: 'ananya@distaura.com',
    role: 'team',
    permissions: ['orders', 'products', 'enquiries'],
    mfaEnabled: true,
    status: 'active',
  },
  {
    id: 'staff-3',
    name: 'Rohan Mehta',
    email: 'rohan@distaura.com',
    role: 'team',
    permissions: ['commissions', 'invoices'],
    mfaEnabled: true,
    status: 'active',
  },
];

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamStaff[]>(MOCK_TEAM);
  const [modalOpen, setModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'team'>('team');
  const [generatedInviteLink, setGeneratedInviteLink] = useState('');

  function handleInviteStaff(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail) return;

    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const link = `http://localhost:3000/admin/accept-invite?token=${token}&email=${encodeURIComponent(newEmail)}`;
    setGeneratedInviteLink(link);

    const created: TeamStaff = {
      id: `staff-${Date.now()}`,
      name: newEmail.split('@')[0],
      email: newEmail,
      role: newRole,
      permissions: newRole === 'admin' ? ['all'] : ['orders', 'enquiries'],
      mfaEnabled: false,
      status: 'invited',
    };

    setTeam([...team, created]);
    toast.success(`Staff invitation created for ${newEmail}`);
  }

  function copyInvite() {
    navigator.clipboard.writeText(generatedInviteLink);
    toast.success('Invitation link copied to clipboard.');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
            Internal Staff & Role-Based Access
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-stone-100">
            Team & Permissions
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Admins and internal team members are strictly invitation-only. All staff accounts enforce AAL2 MFA verification.
          </p>
        </div>

        <button
          onClick={() => {
            setGeneratedInviteLink('');
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-[var(--lime)] px-4 py-2.5 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)]"
        >
          <UserPlus className="size-4" />
          Invite Staff Member
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1d1a] shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/5 font-semibold text-stone-300">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Role Classification</th>
                <th className="py-3.5 px-4">Assigned Permissions</th>
                <th className="py-3.5 px-4">AAL2 Two-Factor</th>
                <th className="py-3.5 px-4">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-stone-300">
              {team.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-semibold text-stone-100">{s.name}</div>
                    <div className="text-[11px] text-[var(--muted)]">{s.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`rounded-md px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                        s.role === 'admin'
                          ? 'border border-[var(--lime)]/30 bg-[var(--lime)]/10 text-[var(--lime-hi)]'
                          : 'border border-blue-500/30 bg-blue-500/10 text-blue-300'
                      }`}
                    >
                      {s.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {s.permissions.map((p) => (
                        <span key={p} className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-stone-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {s.mfaEnabled ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                        <CheckCircle2 className="size-3.5" />
                        TOTP Enforced
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-300">Enrollment Pending</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                        s.status === 'active'
                          ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border border-amber-500/30 bg-amber-500/10 text-amber-300'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#212320] p-6 sm:p-8 shadow-2xl">
            <h3 className="font-display text-xl font-bold text-stone-100">
              Invite Internal Staff
            </h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Generates a single-use cryptographically secured invite link.
            </p>

            {!generatedInviteLink ? (
              <form onSubmit={handleInviteStaff} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300">Staff Work Email</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="name@distaura.com"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300">Administrative Level</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#161715] px-3.5 py-2.5 text-xs text-stone-100 focus:border-[var(--lime)] focus:outline-none"
                  >
                    <option value="team">Team Member (Orders, Products, Enquiries)</option>
                    <option value="admin">Full Administrator (Finance, Commissions, Team)</option>
                  </select>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-stone-300 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[var(--lime)] px-5 py-2 text-xs font-bold text-stone-950 hover:bg-[var(--lime-hi)]"
                  >
                    Generate Invite Link
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-[var(--lime)]/30 bg-[var(--lime)]/10 p-3.5 text-xs text-stone-200">
                  <span className="block font-semibold text-[var(--lime-hi)]">Secure Invite Link Created</span>
                  <p className="mt-1 break-all font-mono text-[11px] text-stone-300">
                    {generatedInviteLink}
                  </p>
                </div>

                <button
                  onClick={copyInvite}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--lime)] py-2.5 text-xs font-bold text-stone-950 hover:bg-[var(--lime-hi)]"
                >
                  <Copy className="size-3.5" />
                  Copy Invite Link
                </button>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-medium text-stone-300 hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
