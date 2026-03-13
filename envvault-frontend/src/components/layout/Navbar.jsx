'use client';

import { useAuth } from '@/context/AuthContext';
import { useEnvironment } from '@/context/EnvironmentContext';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { selectedEnvironment, setEnvironment } = useEnvironment();

  const environments = ['Development', 'Staging', 'Production'];

  return (
    <header className="h-16 bg-[var(--background)] border-b border-[var(--border)] flex items-center justify-between px-8 sticky top-0 z-40 w-full transition-colors">
      
      <div className="flex items-center gap-4 ml-8 md:ml-0">
        <div className="flex flex-col">
          <label className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1 font-medium">Environment</label>
          <div className="relative">
            <select
              value={selectedEnvironment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="bg-transparent text-[var(--foreground)] font-medium text-sm py-1 pr-6 outline-none appearance-none cursor-pointer hover:opacity-70 transition-opacity"
            >
              {environments.map(env => (
                <option key={env} value={env} className="bg-[var(--background)] text-[var(--foreground)]">{env}</option>
              ))}
            </select>
            {/* Custom down arrow */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {user && (
          <div className="hidden sm:flex flex-col text-right">
             <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-medium">Account</span>
             <span className="text-sm font-medium text-[var(--foreground)]">{user.email || 'Admin'}</span>
          </div>
        )}
        
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors group"
        >
          <span className="font-medium hidden sm:inline relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-[var(--foreground)] after:transition-all after:duration-300 group-hover:after:w-full">Sign Out</span>
          <LogOut size={16} className="stroke-[1.5]" />
        </button>
      </div>
    </header>
  );
}
