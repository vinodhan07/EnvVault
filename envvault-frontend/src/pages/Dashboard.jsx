// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import { useVariableStore } from '../store/variableStore'
import { getVariables, exportEnv } from '../services/variableService'
import Layout from '../components/layout/Layout'
import EnvSwitcher from '../components/environment/EnvSwitcher'
import VariableTable from '../components/variables/VariableTable'
import AddVariableModal from '../components/variables/AddVariableModal'
import EditVariableModal from '../components/variables/EditVariableModal'
import DeleteConfirmModal from '../components/variables/DeleteConfirmModal'
import ImportEnvModal from '../components/variables/ImportEnvModal'
import { Plus, Upload, Download, Search, Terminal } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const { variables, environment, setVariables,
          setEnvironment, loading, setLoading } = useVariableStore()

  const [search,      setSearch]      = useState('')
  const [showAdd,     setShowAdd]     = useState(false)
  const [editTarget,  setEditTarget]  = useState(null)
  const [deleteTarget,setDeleteTarget]= useState(null)
  const [showImport,  setShowImport]  = useState(false)

  // Fetch variables when env changes
  useEffect(() => {
    setLoading(true)
    getVariables('PROJECT_ID', environment)
      .then((res) => setVariables(res.data))
      .catch(() => setVariables([]))
      .finally(() => setLoading(false))
  }, [environment])

  const filtered = variables.filter((v) =>
    v.key.toLowerCase().includes(search.toLowerCase())
  )

  const handleExport = async () => {
    try {
      const res = await exportEnv('PROJECT_ID', environment)
      const url = URL.createObjectURL(new Blob([res.data]))
      const a   = document.createElement('a')
      a.href    = url
      a.download = `.env.${environment}`
      a.click()
    } catch (err) {
      console.error('Export failed', err)
    }
  }

  return (
    <Layout>
      <div className="space-y-8 pb-12">
        
        {/* Header Section */}
        <div className="flex items-end justify-between border-b-2 border-vault-border pb-6">
          <div>
            <h2 className="text-4xl font-display font-black uppercase tracking-tighter text-white flex items-center gap-3">
              <Terminal size={36} className="text-vault-neonLime" />
              Environment Variables
            </h2>
            <p className="text-vault-textMuted font-mono text-sm mt-2">Manage encrypted configuration across deployment stages.</p>
          </div>
          <EnvSwitcher current={environment} onChange={setEnvironment} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-vault-surface/40 p-4 border-2 border-vault-border relative">
          
          <div className="relative w-full lg:w-96 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-vault-textMuted group-focus-within:text-vault-neonCyan transition-colors"/>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search variables (Ctrl+K)"
              className="w-full pl-12 pr-4 py-3 bg-vault-bg border-2 border-vault-border font-mono text-sm text-white placeholder-vault-textMuted 
              focus:outline-none focus:border-vault-neonCyan focus:ring-4 focus:ring-vault-neonCyan/10 transition-all rounded-none"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <button onClick={() => setShowImport(true)}
              className="flex items-center gap-2 px-5 py-3 border-2 border-vault-border bg-vault-surface font-display font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all">
              <Upload size={16}/> Import
            </button>
            <button onClick={handleExport}
              className="flex items-center gap-2 px-5 py-3 border-2 border-vault-neonCyan bg-vault-neonCyan/10 text-vault-neonCyan font-display font-bold text-sm uppercase tracking-wider hover:bg-vault-neonCyan hover:text-black shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] transition-all">
              <Download size={16}/> Export
            </button>
            <button onClick={() => setShowAdd(true)}
              className="group flex items-center gap-2 px-6 py-3 border-2 border-vault-neonLime bg-vault-neonLime text-black font-display font-black text-sm uppercase tracking-wider shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
              <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Add Variable
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="relative">
          {loading ? (
             <div className="w-full h-64 border-2 border-vault-border bg-vault-surface/20 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-vault-border border-t-vault-neonLime rounded-full animate-spin" />
                <span className="font-mono text-xs text-vault-neonLime uppercase tracking-widest animate-pulse">Decrypting Vault...</span>
             </div>
          ) : (
             <VariableTable
              variables={filtered}
              onEdit={(v)    => setEditTarget(v)}
              onDelete={(v)  => setDeleteTarget(v)}
             />
          )}
        </div>
      </div>

      {/* Modals */}
      {showAdd      && <AddVariableModal   onClose={() => setShowAdd(false)} />}
      {editTarget   && <EditVariableModal  variable={editTarget} onClose={() => setEditTarget(null)} />}
      {deleteTarget && <DeleteConfirmModal variable={deleteTarget} onClose={() => setDeleteTarget(null)} />}
      {showImport   && <ImportEnvModal     onClose={() => setShowImport(false)} />}
    </Layout>
  )
}
