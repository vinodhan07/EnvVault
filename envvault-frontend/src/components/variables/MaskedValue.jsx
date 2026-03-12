// src/components/variables/MaskedValue.jsx
import { useState, useEffect } from 'react'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'
import { revealVariable } from '../../services/variableService'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function MaskedValue({ variableId }) {
  const [revealed,  setRevealed]  = useState(false)
  const [value,     setValue]     = useState('')
  const [copied,    setCopied]    = useState(false)
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (!revealed) return
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer)
          setRevealed(false)
          setValue('')
          setCountdown(10)
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [revealed])

  const handleReveal = async () => {
    try {
      const res = await revealVariable(variableId)
      setValue(res.data.value)
      setRevealed(true)
    } catch (err) {
      toast.error('Failed to decrypt value.', {
        style: { background: '#161618', border: '2px solid #FF0055', color: '#fff', borderRadius: '0' },
        iconTheme: { primary: '#FF0055', secondary: '#fff' },
      })
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(value || '••••••••')
    setCopied(true)
    toast.success('Sequence copied.', {
        style: { background: '#161618', border: '2px solid #D4FF00', color: '#fff', borderRadius: '0', fontFamily: 'JetBrains Mono' },
        iconTheme: { primary: '#D4FF00', secondary: '#000' },
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3 font-mono text-sm relative">
      <div className="relative overflow-hidden group/value cursor-text">
        <span className={`inline-block transition-colors ${revealed ? 'text-vault-neonLime drop-shadow-[0_0_8px_rgba(212,255,0,0.5)]' : 'text-vault-textMuted tracking-[0.3em] opacity-50'}`}>
          {revealed ? value : '********'}
        </span>
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-[10px] text-vault-neonMagenta border border-vault-neonMagenta/50 bg-vault-neonMagenta/10 px-2 py-0.5"
          >
            {countdown}s
          </motion.span>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover/row:opacity-100 transition-opacity">
        <button onClick={handleReveal} className="p-1.5 text-vault-textMuted hover:text-vault-neonCyan hover:bg-vault-neonCyan/10 border border-transparent hover:border-vault-neonCyan/30 transition-all">
          {revealed ? <EyeOff size={14}/> : <Eye size={14}/>}
        </button>

        <button onClick={handleCopy} className="p-1.5 text-vault-textMuted hover:text-vault-neonLime hover:bg-vault-neonLime/10 border border-transparent hover:border-vault-neonLime/30 transition-all">
          {copied ? <Check size={14} className="text-vault-neonLime drop-shadow-[0_0_5px_rgba(212,255,0,1)]"/> : <Copy size={14}/>}
        </button>
      </div>
    </div>
  )
}
