// src/components/layout/Navbar.jsx
import { Bell, Search, Hexagon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navbar() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className="h-20 border-b-2 border-vault-border bg-vault-surface/80 backdrop-blur-xl px-8 flex items-center justify-between relative z-20"
    >
      <div className="flex items-center gap-3">
        <Hexagon size={24} className="text-vault-neonCyan" />
        <div className="font-display flex flex-col leading-tight">
           <span className="text-[10px] text-vault-textMuted tracking-widest uppercase">Active Project</span>
           <span className="text-white font-bold tracking-wider text-lg shadow-sm drop-shadow-[1px_1px_0px_#00E5FF]">PROJECT_ZERO</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative group p-2 text-vault-textMuted hover:text-vault-neonLime transition-colors">
          <Search size={22} />
          <span className="absolute inset-0 bg-vault-neonLime/20 blur-md scale-0 group-hover:scale-100 transition-transform rounded-full" />
        </button>
        <button className="relative group p-2 text-vault-textMuted hover:text-vault-neonMagenta transition-colors">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-vault-neonMagenta rounded-full border border-vault-bg animate-pulse" />
          <span className="absolute inset-0 bg-vault-neonMagenta/20 blur-md scale-0 group-hover:scale-100 transition-transform rounded-full" />
        </button>
        
        {/* User Avatar - Cyber styled */}
        <div className="relative group cursor-pointer">
          <div className="w-10 h-10 bg-vault-surface border-2 border-vault-neonCyan flex items-center justify-center font-display font-bold text-vault-neonCyan transform group-hover:-rotate-12 transition-transform shadow-neon-cyan">
            OP
          </div>
          <div className="absolute inset-0 bg-vault-neonCyan mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </motion.header>
  )
}
