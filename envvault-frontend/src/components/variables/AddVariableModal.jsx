// src/components/variables/AddVariableModal.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { TerminalSquare, X } from 'lucide-react'

export default function AddVariableModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-vault-bg/90 backdrop-blur-md cursor-pointer" 
      />
      
      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="w-full max-w-lg bg-vault-surface border-2 border-vault-neonLime shadow-[0_0_30px_rgba(212,255,0,0.15)] relative z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-vault-border bg-vault-bg">
          <div className="flex items-center gap-3">
            <TerminalSquare className="text-vault-neonLime" size={24} />
            <h2 className="text-xl font-display font-black text-white uppercase tracking-widest">Inject Variable</h2>
          </div>
          <button onClick={onClose} className="text-vault-textMuted hover:text-vault-neonMagenta transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-display font-bold uppercase tracking-[0.2em] text-vault-neonLime">Key Identifier</label>
            <input className="w-full bg-vault-bg border-2 border-vault-border px-4 py-3 font-mono text-sm text-white focus:border-vault-neonLime focus:outline-none focus:ring-4 focus:ring-vault-neonLime/10 transition-all rounded-none placeholder-vault-textMuted/50" placeholder="DATABASE_URL" />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-display font-bold uppercase tracking-[0.2em] text-vault-neonLime">Encrypted Value</label>
            <input className="w-full bg-vault-bg border-2 border-vault-border px-4 py-3 font-mono text-sm text-white focus:border-vault-neonLime focus:outline-none focus:ring-4 focus:ring-vault-neonLime/10 transition-all rounded-none placeholder-vault-textMuted/50" placeholder="••••••••••••••••" />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-display font-bold uppercase tracking-[0.2em] text-vault-neonCyan">Context / Scope</label>
            <input className="w-full bg-vault-bg border-2 border-vault-border px-4 py-3 font-mono text-sm text-white focus:border-vault-neonCyan focus:outline-none focus:ring-4 focus:ring-vault-neonCyan/10 transition-all rounded-none placeholder-vault-textMuted/50" placeholder="Production connection string" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 p-6 border-t-2 border-vault-border bg-vault-bg/50">
          <button onClick={onClose} className="flex-1 px-4 py-3 bg-transparent border-2 border-vault-border text-white font-display font-bold uppercase tracking-widest hover:bg-vault-surface hover:text-white transition-all">Abort</button>
          <button className="flex-1 px-4 py-3 bg-vault-neonLime border-2 border-vault-neonLime text-black font-display font-bold uppercase tracking-widest hover:bg-vault-neonLimeDark transition-all shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">Execute</button>
        </div>
      </motion.div>
    </div>
  )
}
