// src/pages/Login.jsx
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'

export default function Login() {
  const { register, handleSubmit } = useForm()
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    toast('Authentication Successful. Decrypting Vault...', {
      style: { background: '#161618', border: '2px solid #D4FF00', color: '#D4FF00', fontFamily: 'JetBrains Mono', borderRadius: '0' },
      icon: '🔓',
    })
    login({ name: 'Operative' }, 'mock-jwt-token')
    setTimeout(() => navigate('/dashboard'), 1500)
  }

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  return (
    <div className="min-h-screen bg-vault-bg flex flex-col items-center justify-center p-4 relative overflow-hidden text-vault-textMain">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-vault-neonCyan/10 via-vault-bg to-vault-bg z-0" />
      
      <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-md relative z-10">
        
        <motion.div variants={item} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 border-4 border-vault-neonLime rotate-45 shadow-neon-lime bg-vault-surface">
            <ShieldAlert size={36} className="-rotate-45 text-vault-neonLime" />
          </div>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter uppercase drop-shadow-[4px_4px_0px_#D4FF00]">EnvVault</h1>
          <p className="mt-4 font-mono text-vault-neonCyan text-sm tracking-[0.2em] uppercase">Secure Access Protocol</p>
        </motion.div>

        <motion.form variants={item} onSubmit={handleSubmit(onSubmit)} className="bg-vault-surface/80 backdrop-blur-xl border-2 border-vault-border p-8 relative">
          <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-vault-neonLime" />
          <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-vault-neonLime" />
          <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-vault-neonLime" />
          <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-vault-neonLime" />

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-[0.2em] text-vault-textMuted mb-2">Operative ID (Email)</label>
              <input
                {...register('email')} type="email"
                className="w-full bg-vault-bg border-2 border-vault-border px-4 py-3 font-mono text-sm text-white focus:border-vault-neonCyan focus:ring-4 focus:ring-vault-neonCyan/10 outline-none transition-all rounded-none"
                placeholder="operative@nexus.net"
              />
            </div>
            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-[0.2em] text-vault-textMuted mb-2">Decryption Key (Password)</label>
              <input
                {...register('password')} type="password"
                className="w-full bg-vault-bg border-2 border-vault-border px-4 py-3 font-mono text-sm text-white focus:border-vault-neonCyan focus:ring-4 focus:ring-vault-neonCyan/10 outline-none transition-all rounded-none"
                placeholder="••••••••••••••••"
              />
            </div>
            <button className="relative w-full group mt-8">
              <div className="absolute inset-0 bg-vault-neonLime translate-x-[4px] translate-y-[4px] border-2 border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0" />
              <div className="relative w-full bg-vault-neonLime border-2 border-black py-4 font-display font-black uppercase tracking-widest text-black flex items-center justify-center gap-2 group-hover:-translate-y-1 transition-transform">
                Initialize Connection
              </div>
            </button>
          </div>
        </motion.form>

        <motion.p variants={item} className="mt-8 text-center text-xs font-mono text-vault-textMuted uppercase tracking-widest">
          No clearance? <Link to="/register" className="text-vault-neonCyan hover:text-white transition-colors underline decoration-vault-neonCyan/50 hover:decoration-white underline-offset-4">Request Access</Link>
        </motion.p>
      </motion.div>
    </div>
  )
}
