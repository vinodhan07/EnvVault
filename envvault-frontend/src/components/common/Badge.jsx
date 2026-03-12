// src/components/common/Badge.jsx
export default function Badge({ env }) {
  const styles = {
    dev:     'text-vault-neonLime border-vault-neonLime bg-vault-neonLime/10 shadow-[0_0_10px_rgba(212,255,0,0.2)]',
    staging: 'text-vault-neonCyan border-vault-neonCyan bg-vault-neonCyan/10 shadow-[0_0_10px_rgba(0,229,255,0.2)]',
    prod:    'text-vault-neonMagenta border-vault-neonMagenta bg-vault-neonMagenta/10 shadow-[0_0_10px_rgba(255,0,85,0.2)]',
  }

  return (
    <span className={`px-3 py-1 border-2 text-[10px] font-display font-bold uppercase tracking-[0.2em] ${styles[env] || 'text-vault-textMuted border-vault-border'}`}>
      {env}
    </span>
  )
}
