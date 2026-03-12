// src/pages/NotFound.jsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-vault-bg flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      <motion.div 
        animate={{ opacity: [0.02, 0.1, 0.02], scale: [1, 1.05, 1] }} 
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <h1 className="text-[25rem] font-display font-black text-vault-neonMagenta leading-none select-none blur-md">404</h1>
      </motion.div>
      
      <div className="relative z-10 bg-vault-surface/80 backdrop-blur-xl border-2 border-vault-border p-12 max-w-xl shadow-[0_0_50px_rgba(255,0,85,0.1)]">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-vault-neonMagenta" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-vault-neonMagenta" />

        <h2 className="text-5xl font-display font-black uppercase text-white tracking-tighter mb-4 drop-shadow-[3px_3px_0px_#FF0055]">Sector Void</h2>
        <p className="text-vault-textMuted font-mono uppercase tracking-widest text-sm mb-12">
          Critical failure: The requested vector does not exist or has been redacted from the databanks.
        </p>
        
        <Link to="/dashboard" className="relative group inline-block">
          <div className="absolute inset-0 bg-vault-neonCyan translate-x-[6px] translate-y-[6px] border-2 border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0" />
          <div className="relative bg-vault-neonCyan border-2 border-black px-8 py-4 font-display font-black uppercase tracking-widest text-black flex items-center justify-center hover:-translate-y-1 transition-transform">
            Return to Active Node
          </div>
        </Link>
      </div>
    </div>
  )
}
