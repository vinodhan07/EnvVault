// src/components/environment/EnvSwitcher.jsx
import { motion } from 'framer-motion'

const ENVS = [
  { key: 'dev',     label: 'DEV',     color: 'text-vault-neonLime', border: 'border-vault-neonLime', shadow: 'shadow-neon-lime' },
  { key: 'staging', label: 'STG',  color: 'text-vault-neonCyan', border: 'border-vault-neonCyan', shadow: 'shadow-neon-cyan' },
  { key: 'prod',    label: 'PROD',    color: 'text-vault-neonMagenta', border: 'border-vault-neonMagenta', shadow: 'shadow-neon-magenta' },
]

export default function EnvSwitcher({ current, onChange }) {
  return (
    <div className="flex bg-vault-surface border-2 border-vault-border p-1 relative z-10">
      {ENVS.map((env) => (
        <button
          key={env.key}
          onClick={() => onChange(env.key)}
          className={`relative px-6 py-2 font-display font-bold text-sm tracking-widest uppercase transition-colors duration-300 z-10
            ${current === env.key ? env.color : 'text-vault-textMuted hover:text-white'}
          `}
        >
          {current === env.key && (
            <motion.div
              layoutId="env-pill"
              className={`absolute inset-0 bg-vault-bg border-2 ${env.border} -z-10 ${env.shadow}`}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {env.label}
        </button>
      ))}
    </div>
  )
}
