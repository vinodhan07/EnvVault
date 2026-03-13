'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Key, ScrollText, ShieldAlert, KeyRound, Users, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Secrets', href: '/secrets', icon: Key },
  { name: 'API Keys', href: '/api-keys', icon: KeyRound },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Audit Logs', href: '/audit-logs', icon: ScrollText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredNavItems = [...navItems];
  if (user?.role === 'admin') {
    filteredNavItems.push({ name: 'Admin Control', href: '/admin', icon: Users });
  }

  return (
    <aside className="w-64 bg-[var(--background)] border-r border-[var(--border)] text-[var(--foreground)] hidden md:flex flex-col h-screen fixed left-0 top-0 transition-colors duration-300">
      <div className="p-8">
        <h1 className="text-xl font-semibold editorial-header tracking-tight flex items-center gap-3 text-[var(--foreground)]">
          <ShieldAlert className="text-[var(--foreground)] stroke-[1.5]" size={24} />
          EnvVault
        </h1>
        <div className="text-xs font-light text-[var(--muted)] mt-2">Secure Management System</div>
      </div>
      
      <nav className="flex-1 mt-8 space-y-2 px-4">
        <div className="text-[10px] font-medium tracking-[0.1em] text-[var(--muted)] px-4 mb-4 uppercase">Menu</div>
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-300 ${
                isActive 
                  ? 'bg-[var(--foreground)] text-[var(--background)]' 
                  : 'hover:bg-[var(--accent)] text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <Icon size={18} className={`stroke-[1.5] ${isActive ? 'text-[var(--background)]' : 'text-[var(--muted)] group-hover:text-[var(--foreground)]'} transition-colors`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-[var(--border)] text-xs text-[var(--muted)] flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        <span>System Secure</span>
      </div>
    </aside>
  );
}
