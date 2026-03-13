'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Loader2, Search } from 'lucide-react';
import { secretService } from '@/services/secretService';

export default function AuditLogsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await secretService.getAuditLogs();
        setLogs(data);
      } catch (e) {
        console.error("Failed to fetch audit logs", e);
      } finally {
        setIsFetching(false);
      }
    };
    if (user) fetchLogs();
  }, [user]);

  if (loading || !user) return null;

  const filteredLogs = logs.filter(
    (log) =>
      log.secretKey?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.environment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl editorial-header text-[var(--foreground)] mb-3">Audit Trail</h1>
          <p className="text-[var(--muted)] text-sm font-light">Immutable record of all configuration modifications.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search records..."
            className="w-full editorial-input py-2 pl-9 text-sm focus:bg-[var(--accent)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 ml-3 text-[var(--muted)]" />
        </div>
      </div>

      <div className="editorial-panel">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[var(--foreground)]">
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-[0.1em] text-[var(--foreground)] font-medium">Timestamp</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-[0.1em] text-[var(--foreground)] font-medium">Actor</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-[0.1em] text-[var(--foreground)] font-medium">Action</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-[0.1em] text-[var(--foreground)] font-medium">Subject</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-[0.1em] text-[var(--foreground)] font-medium">Environment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {isFetching ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 size={24} className="animate-spin text-[var(--foreground)] mx-auto" />
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--accent)] transition-colors duration-200 group">
                    <td className="py-4 px-6 text-sm">
                      <div className="font-medium text-[var(--foreground)]">{new Date(log.timestamp).toLocaleDateString()}</div>
                      <div className="text-xs text-[var(--muted)] font-light mt-1">{new Date(log.timestamp).toLocaleTimeString()}</div>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-[var(--foreground)]">{log.user || 'System'}</td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-mono uppercase tracking-wider font-medium text-[var(--foreground)]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-sm text-[var(--foreground)]">{log.secretKey}</td>
                    <td className="py-4 px-6">
                      <span className="text-xs uppercase tracking-[0.05em] text-[var(--muted)] px-2 py-1 border border-[var(--border)] rounded-sm">
                         {log.environment}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-[var(--muted)] text-sm font-light italic">
                    {searchTerm ? 'No audit records match your search.' : 'No audit records found in the system.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
