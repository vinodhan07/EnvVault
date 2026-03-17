'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, ArrowRight, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { registerUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await registerUser(email, password);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] height-[600px] border border-[var(--border)] rounded-full opacity-20 pointer-events-none scale-150"></div>
        <div className="w-full max-w-sm relative z-10 mx-auto text-center">
            <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="text-[var(--foreground)]" size={32} />
            </div>
            <h1 className="text-3xl editorial-header text-[var(--foreground)] mb-4">Registration Received</h1>
            <p className="text-[var(--muted)] font-sans text-sm font-light mb-8">
                Your account for <strong>{email}</strong> has been created. To maintain high security standards, an administrator must manually review and approve your request.
            </p>
            <div className="p-4 border border-[var(--border)] text-[var(--foreground)] font-sans text-sm mb-8 italic">
                You will be able to sign in once your status is updated to "Approved".
            </div>
            <Link href="/login" className="editorial-button py-4 w-full flex items-center justify-center gap-2 group">
                <span>Return to Login</span>
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] height-[600px] border border-[var(--border)] rounded-full opacity-20 pointer-events-none scale-150"></div>

      <div className="w-full max-w-sm relative z-10 mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="w-12 h-12 flex items-center justify-center mb-6">
            <UserPlus className="text-[var(--foreground)] stroke-[1]" size={40} />
          </div>
          <h1 className="text-3xl editorial-header text-[var(--foreground)] mb-3">Join EnvVault</h1>
          <p className="text-[var(--muted)] font-sans text-sm font-light">Request access to secure configuration delivery.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 border border-[var(--border)] text-[var(--foreground)] font-sans text-sm text-center">
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-[0.1em] text-[var(--muted)] font-medium">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full editorial-input py-3 text-sm focus:bg-[var(--accent)] px-3"
              placeholder="developer@yourcompany.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-[0.1em] text-[var(--muted)] font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full editorial-input py-3 text-sm focus:bg-[var(--accent)] px-3 tracking-[0.2em]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full editorial-button py-4 mt-4 flex items-center justify-center gap-2 group"
          >
            <span>{loading ? 'Creating Request...' : 'Register Account'}</span>
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <p className="text-xs text-[var(--muted)]">
                Already have an account? <Link href="/login" className="text-[var(--foreground)] border-bottom border-[var(--foreground)]">Sign in</Link>
            </p>
        </div>

        <div className="mt-12 text-center text-xs font-sans text-[var(--muted)] font-light">
          &copy; {new Date().getFullYear()} EnvVault Systems.
        </div>
      </div>
    </div>
  );
}
