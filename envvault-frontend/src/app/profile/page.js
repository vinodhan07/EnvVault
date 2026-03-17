'use client';

import { useAuth } from '@/context/AuthContext';
import { User, Mail, Shield, Copy, Check, Info } from 'lucide-react';
import { useState } from 'react';
import Layout from '@/components/Layout';

export default function ProfilePage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (user?.user_token) {
      navigator.clipboard.writeText(user.user_token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-4">
        <div className="flex items-center justify-between mb-12 border-b border-[var(--border)] pb-8">
          <div>
            <h1 className="text-4xl editorial-header text-[var(--foreground)] mb-2">Developer Profile</h1>
            <p className="text-[var(--muted)] font-sans text-sm font-light">Your identity and access credentials.</p>
          </div>
          <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center">
            <User size={24} className="text-[var(--foreground)]" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* User Info Column */}
          <div className="md:col-span-1 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[var(--muted)]">
                <Mail size={16} />
                <span className="text-xs uppercase tracking-[0.1em] font-medium">Email Address</span>
              </div>
              <p className="text-[var(--foreground)] font-sans border-b border-[var(--border)] pb-2">{user?.email}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[var(--muted)]">
                <Shield size={16} />
                <span className="text-xs uppercase tracking-[0.1em] font-medium">System Role</span>
              </div>
              <p className="text-[var(--foreground)] font-sans flex items-center gap-2">
                <span className="capitalize">{user?.role}</span>
                {user?.role === 'admin' && (
                    <span className="bg-[var(--foreground)] text-[var(--background)] text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter ml-1">Admin</span>
                )}
              </p>
            </div>
          </div>

          {/* Identity Token Column */}
          <div className="md:col-span-2 space-y-8">
            <div className="editorial-panel p-8 bg-[var(--accent)]/30">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl editorial-header">User Identity Token</h2>
                 <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">Active Identity</span>
              </div>
              
              <p className="text-sm font-sans text-[var(--muted)] mb-8 font-light leading-relaxed">
                This identity token is unique to your account. To fetch secrets programmatically, you must provide this token in the <code className="bg-[var(--accent)] px-1 rounded">X-User-Token</code> header alongside an Environment API Key.
              </p>

              <div className="relative group">
                <div className="w-full bg-[var(--background)] border border-[var(--border)] p-4 font-mono text-sm tracking-tight text-[var(--foreground)] break-all pr-12 min-h-[52px] flex items-center">
                  {user?.user_token || "Fetching identity token..."}
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-[var(--accent)] rounded-md transition-colors text-[var(--muted)] hover:text-[var(--foreground)]"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>

              <div className="mt-8 flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded">
                <Info size={16} className="text-blue-500 mt-0.5" />
                <div className="text-xs text-[var(--muted)] leading-relaxed">
                  <strong className="text-blue-500">Security Note:</strong> Never share this token. If you suspect your token has been compromised, contact an administrator to rotate your credentials.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
