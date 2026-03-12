// src/components/variables/VariableTable.jsx
import MaskedValue from './MaskedValue'
import { Pencil, Trash2, ShieldAlert } from 'lucide-react'
import Badge from '../common/Badge'
import { motion } from 'framer-motion'

export default function VariableTable({ variables, onEdit, onDelete }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "tween", ease: "easeOut" } }
  }

  return (
    <div className="w-full border-2 border-vault-border bg-vault-surface/50 backdrop-blur-sm relative overflow-hidden group">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-vault-neonCyan" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-vault-neonCyan" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-vault-neonCyan" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-vault-neonCyan" />

      {/* Header */}
      <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-vault-border/50 text-vault-textMuted text-xs font-display font-bold uppercase tracking-[0.2em] border-b-2 border-vault-border">
        <span>Identity</span>
        <span>Value</span>
        <span>Context</span>
        <span>Scope</span>
        <span className="text-right">Access</span>
      </div>

      {/* Rows */}
      {variables.length > 0 ? (
        <motion.div variants={container} initial="hidden" animate="show" className="divide-y-2 divide-vault-border/30">
          {variables.map((v) => (
            <motion.div variants={item} key={v.id}
              className="grid grid-cols-5 gap-4 px-6 py-5 hover:bg-vault-neonCyan/5 transition-colors items-center relative group/row">
              
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-vault-neonCyan scale-y-0 group-hover/row:scale-y-100 transition-transform origin-center" />

              <span className="font-mono text-sm font-bold text-white group-hover/row:text-vault-neonCyan transition-colors">
                {v.key}
              </span>

              <MaskedValue variableId={v.id} />

              <span className="text-vault-textMuted text-sm truncate pr-4 font-mono">
                {v.description || '// no context provided'}
              </span>

              <div>
                <Badge env={v.environment} />
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={() => onEdit(v)}
                  className="p-2 text-vault-textMuted hover:text-black hover:bg-vault-neonLime border-2 border-transparent hover:border-black transition-all shadow-none hover:shadow-brutal-dark">
                  <Pencil size={16} strokeWidth={2.5} />
                </button>
                <button onClick={() => onDelete(v)}
                  className="p-2 text-vault-textMuted hover:text-black hover:bg-vault-neonMagenta border-2 border-transparent hover:border-black transition-all shadow-none hover:shadow-brutal-dark">
                  <Trash2 size={16} strokeWidth={2.5} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-vault-textMuted">
          <ShieldAlert size={48} className="mb-4 text-vault-border" />
          <p className="font-display font-bold uppercase tracking-widest text-lg">Vault is Empty</p>
          <p className="font-mono text-xs mt-2">Initialize variables to secure the environment.</p>
        </div>
      )}
    </div>
  )
}
