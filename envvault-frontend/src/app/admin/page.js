'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { Users, CheckCircle, XCircle, Clock, ShieldCheck } from 'lucide-react';
import Layout from '@/components/Layout';

export default function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users. Ensure you have admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/admin/users/${id}/approve`);
      fetchUsers();
    } catch (err) {
      alert('Failed to approve user.');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/admin/users/${id}/reject`);
      fetchUsers();
    } catch (err) {
      alert('Failed to reject user.');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-[var(--muted)] font-heading italic text-xl">Access Restricted. Administrator credentials required.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-4">
        <div className="flex items-center justify-between mb-12 border-b border-[var(--border)] pb-8">
          <div>
            <h1 className="text-4xl editorial-header text-[var(--foreground)] mb-2">Registry Control</h1>
            <p className="text-[var(--muted)] font-sans text-sm font-light">Manage developer access and identity tokens.</p>
          </div>
          <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center">
            <Users size={24} className="text-[var(--foreground)]" />
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 border border-red-500/20 bg-red-500/5 text-red-500 font-sans text-sm text-center italic">
            {error}
          </div>
        )}

        <div className="editorial-panel overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--accent)]/50">
                <th className="px-6 py-4 text-xs uppercase tracking-[0.1em] text-[var(--muted)] font-medium">Developer</th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.1em] text-[var(--muted)] font-medium">Status</th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.1em] text-[var(--muted)] font-medium">Identity Token</th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.1em] text-[var(--muted)] font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[var(--muted)] italic">Retrieving user records...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[var(--muted)] italic">No user records found.</td>
                </tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-[var(--accent)]/30 transition-colors">
                  <td className="px-6 py-6">
                    <div className="text-sm font-medium text-[var(--foreground)]">{u.email}</div>
                    <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider mt-1">{u.role}</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      {u.status === 'approved' && <CheckCircle size={14} className="text-green-500" />}
                      {u.status === 'rejected' && <XCircle size={14} className="text-red-500" />}
                      {u.status === 'pending' && <Clock size={14} className="text-orange-500" />}
                      <span className={`text-xs capitalize ${
                        u.status === 'approved' ? 'text-green-500' : 
                        u.status === 'rejected' ? 'text-red-500' : 'text-orange-500'
                      }`}>
                        {u.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    {u.user_token ? (
                      <div className="flex items-center gap-2 text-xs font-mono bg-[var(--accent)] px-2 py-1 rounded w-fit">
                        <ShieldCheck size={12} className="text-[var(--muted)]" />
                        {u.user_token.slice(0, 15)}...
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--muted)] italic">Not generated</span>
                    )}
                  </td>
                  <td className="px-6 py-6 text-right">
                    {u.status === 'pending' && (
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleApprove(u.id)}
                          className="text-xs uppercase tracking-wider font-medium text-green-500 hover:underline"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(u.id)}
                          className="text-xs uppercase tracking-wider font-medium text-red-500 hover:underline"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {u.status !== 'pending' && u.role !== 'admin' && (
                      <button 
                          onClick={() => u.status === 'approved' ? handleReject(u.id) : handleApprove(u.id)}
                          className="text-xs uppercase tracking-wider font-light text-[var(--muted)] hover:text-[var(--foreground)]"
                      >
                          Reset Status
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
