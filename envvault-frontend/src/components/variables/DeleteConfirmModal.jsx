// src/components/variables/DeleteConfirmModal.jsx
import { motion } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

export default function DeleteConfirmModal({ variable, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-vault-bg/90 backdrop-blur-md cursor-pointer" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
        className="w-full max-w-sm bg-vault-bg border-2 border-vault-neonMagenta shadow-[0_0_40px_rgba(255,0,85,0.3)] relative z-10 p-1"
      >
        <div className="bg-vault-surface p-6 text-center border-2 border-vault-border">
          <AlertTriangle size={48} className="text-vault-neonMagenta mx-auto mb-4" />
          <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest mb-2">Destruction Protocol</h2>
          <p className="text-vault-textMuted text-sm mb-6 font-mono">
            Permanently delete <span className="text-vault-neonMagenta font-bold px-2 py-0.5 bg-vault-neonMagenta/10 border border-vault-neonMagenta/30">{variable?.key}</span>? This data will be irretrievable.
          </p>
          <div className="flex flex-col gap-3">
            <button className="w-full px-4 py-3 bg-vault-neonMagenta border-2 border-vault-neonMagenta text-black font-display font-bold uppercase tracking-widest hover:bg-[#CC0044] hover:border-[#CC0044] transition-all shadow-[4px_4px_0px_#222] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">Confirm Purge</button>
            <button onClick={onClose} className="w-full px-4 py-3 bg-transparent border-2 border-vault-border text-white font-display font-bold uppercase tracking-widest hover:bg-vault-bg transition-all">Cancel Vector</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
