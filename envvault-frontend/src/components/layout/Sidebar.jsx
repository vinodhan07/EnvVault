// src/components/layout/Sidebar.jsx
import { LayoutDashboard, History, LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { motion } from 'framer-motion'

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout)

  const links = [
    { to: '/dashboard', label: 'VAULT', icon: LayoutDashboard },
    { to: '/history',   label: 'AUDIT LOG',   icon: History },
  ]

  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-72 border-r-2 border-vault-border bg-vault-surface flex flex-col relative z-20"
    >
      <div className="p-8 border-b-2 border-vault-border">
         <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-vault-neonLime rotate-45 flex items-center justify-center shadow-neon-lime">
             <div className="w-4 h-4 bg-vault-bg -rotate-45" />
           </div>
           <h1 className="text-3xl font-display font-bold tracking-tighter uppercase text-white drop-shadow-[2px_2px_0px_#D4FF00]">
             EnvVault
           </h1>
         </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
              relative flex items-center gap-4 px-5 py-4 font-display font-semibold tracking-widest text-sm uppercase transition-all duration-300
              ${isActive
                ? 'text-black bg-vault-neonLime shadow-brutal translate-x-[2px] translate-y-[2px]'
                : 'text-vault-textMuted hover:text-white hover:bg-vault-surfaceHover border-2 border-transparent hover:border-vault-border shadow-brutal-dark hover:translate-x-[2px] hover:translate-y-[2px]'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <link.icon size={20} className={isActive ? 'text-black' : 'text-vault-textMuted group-hover:text-vault-neonCyan'} />
                {link.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t-2 border-vault-border">
        <button
          onClick={logout}
          className="group flex items-center justify-between w-full px-5 py-4 border-2 border-vault-border bg-vault-bg font-display font-bold text-vault-neonMagenta hover:bg-vault-neonMagenta hover:text-black transition-all shadow-brutal-magenta hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
        >
          <span className="uppercase tracking-widest">Terminate</span>
          <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </motion.div>
  )
}
