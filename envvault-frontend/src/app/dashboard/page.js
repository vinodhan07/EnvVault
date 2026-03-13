'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEnvironment } from '@/context/EnvironmentContext';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Database, Activity, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { secretService } from '@/services/secretService';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { selectedEnvironment } = useEnvironment();
  const router = useRouter();
  const [stats, setStats] = useState({ secretsCount: 0, recentLogs: [] });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const secrets = await secretService.getSecrets(selectedEnvironment);
        const logs = await secretService.getAuditLogs();
        setStats({
          secretsCount: secrets?.length || 0,
          recentLogs: logs?.slice(0, 5) || []
        });
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };
    if (user) fetchDashboardData();
  }, [selectedEnvironment, user]);

  if (loading || !user) return null;

  return (
    <Layout>
      <div className="mb-12">
        <h1 className="text-4xl editorial-header text-[var(--foreground)] mb-3">Overview</h1>
        <p className="text-[var(--muted)] text-sm font-light">
          Managing configuration for the <span className="font-medium text-[var(--foreground)]">{selectedEnvironment}</span> environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Metric 1 */}
        <div className="editorial-panel p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">Total Secrets</div>
            <Database size={18} className="text-[var(--muted)] stroke-[1.5]" />
          </div>
          <div className="text-5xl editorial-header text-[var(--foreground)]">{stats.secretsCount}</div>
        </div>
        
        {/* Metric 2 */}
        <div className="editorial-panel p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">Environment</div>
            <ShieldCheck size={18} className="text-[var(--muted)] stroke-[1.5]" />
          </div>
          <div className="text-2xl font-sans font-medium text-[var(--foreground)]">{selectedEnvironment}</div>
        </div>

        {/* Metric 3 */}
        <div className="editorial-panel p-8 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6 relative z-10">
             <div className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">Status</div>
             <Activity size={18} className="text-[var(--foreground)] stroke-[1.5]" />
          </div>
          <div className="text-2xl font-sans font-medium text-[var(--foreground)] relative z-10 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[var(--foreground)]"></span>
            Optimal
          </div>
        </div>
      </div>

      <div className="editorial-panel border-t border-x-0 border-b-0">
        <div className="pt-8 pb-4 flex items-center justify-between">
          <h2 className="text-lg editorial-header text-[var(--foreground)]">Recent Activity</h2>
          <Link href="/audit-logs" className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] flex items-center gap-2 group uppercase tracking-[0.05em] transition-colors">
            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="divide-y divide-[var(--border)]">
          {stats.recentLogs.length > 0 ? (
            stats.recentLogs.map((log, i) => (
              <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                <div>
                   <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-medium text-[var(--foreground)] uppercase tracking-wider">{log.action}</span>
                      <span className="text-xs text-[var(--muted)]">—</span>
                      <span className="text-xs text-[var(--foreground)] font-mono">{log.secretKey}</span>
                   </div>
                   <p className="text-xs text-[var(--muted)] font-light">By {log.user}</p>
                </div>
                <div className="text-xs text-[var(--muted)] font-light">
                  {new Date(log.timestamp).toLocaleDateString()} &middot; {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          ) : (
             <div className="py-8 text-sm text-[var(--muted)] font-light italic">No recent activity found.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
