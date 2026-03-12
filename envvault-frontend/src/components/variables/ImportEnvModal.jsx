// src/components/variables/ImportEnvModal.jsx
import { motion } from 'framer-motion'
import { FileUp, X } from 'lucide-react'

export default function ImportEnvModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-vault-bg/90 backdrop-blur-md cursor-pointer" 
      />
      <motion.div 
        initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
        className="w-full max-w-xl bg-vault-surface border-2 border-vault-neonLime relative z-10"
      >
        <div className="flex items-center justify-between p-6 border-b-2 border-vault-border bg-vault-bg">
          <div className="flex items-center gap-3">
            <FileUp className="text-vault-neonLime" size={24} />
            <h2 className="text-xl font-display font-black text-white uppercase tracking-widest">Batch Import</h2>
          </div>
          <button onClick={onClose} className="text-vault-textMuted hover:text-vault-neonMagenta transition-colors"><X size={24} /></button>
        </div>
        <div className="p-8">
          <p className="text-vault-textMuted text-sm mb-4 font-mono">Execute bulk injection by pasting raw `.env` definitions below.</p>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-vault-neonLime to-vault-neonCyan opacity-30 group-focus-within:opacity-100 blur transition-all duration-500 rounded-none z-0" />
            <textarea
              className="relative w-full h-56 bg-vault-bg border-2 border-vault-border p-5 font-mono text-sm text-vault-neonLime focus:border-white focus:outline-none transition-all resize-none z-10"
              placeholder="# PASTE SECRETS HERE&#10;API_KEY=xoxb-1234...&#10;DB_HOST=127.0.0.1"
            ></textarea>
          </div>
        </div>
        <div className="flex gap-4 p-6 border-t-2 border-vault-border bg-vault-bg/50">
          <button onClick={onClose} className="flex-1 px-4 py-3 text-white font-display font-bold uppercase tracking-widest hover:bg-vault-surface border-2 border-transparent hover:border-vault-border transition-all">Abort</button>
          <button className="flex-1 px-4 py-3 bg-white text-black font-display font-black uppercase tracking-widest shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all border-2 border-black">Initialize Integration</button>
        </div>
      </motion.div>
    </div>
  )
}
