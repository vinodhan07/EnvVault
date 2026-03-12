// src/pages/History.jsx
import Layout from '../components/layout/Layout'

export default function History() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Audit History</h2>
        </div>
        <div className="bg-navy-2 border border-white/10 rounded-2xl p-12 text-center text-gray-500 italic">
          Coming Soon: Track every change, reveal, and export in your vault.
        </div>
      </div>
    </Layout>
  )
}
