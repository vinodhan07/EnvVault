'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEnvironment } from '@/context/EnvironmentContext';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Plus, Trash2, Copy, Check, KeyRound, X, Loader2 } from 'lucide-react';
import { apiKeyService } from '@/services/apiKeyService';

export default function ApiKeysPage() {
  const { user, loading } = useAuth();
  const { selectedEnvironment } = useEnvironment();
  const router = useRouter();

  const [keys, setKeys] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const data = await apiKeyService.listApiKeys();
        setKeys(data);
      } catch (e) {
        console.error("Failed to fetch API keys", e);
      } finally {
        setIsFetching(false);
      }
    };
    if (user) fetchKeys();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const result = await apiKeyService.createApiKey({
        project_name: projectName,
        environment: selectedEnvironment,
      });
      setNewlyCreatedKey(result.api_key);
      setKeys((prev) => [result, ...prev]);
      setProjectName('');
    } catch (e) {
      console.error("Failed to create key", e);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Revoke this API key? Any applications using it will lose access.')) return;
    try {
      await apiKeyService.deleteApiKey(id);
      setKeys((prev) => prev.filter((k) => k.id !== id));
    } catch (e) {
      console.error("Failed to delete key", e);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading || !user) return null;

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl editorial-header text-[var(--foreground)] mb-3">API Keys</h1>
          <p className="text-[var(--muted)] text-sm font-light">
            Generate keys to access secrets programmatically from your applications.
          </p>
        </div>
        <button
          onClick={() => { setShowModal(true); setNewlyCreatedKey(null); }}
          className="editorial-button py-2 px-6 flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Generate Key</span>
        </button>
      </div>

      {/* Usage hint */}
      <div className="editorial-panel p-6 mb-8 border-l-4 border-[var(--foreground)]">
        <p className="text-sm text-[var(--muted)] font-light leading-relaxed">
          <span className="font-medium text-[var(--foreground)]">Usage:</span>{' '}
          Once you generate a key, use it in your application's HTTP requests:
        </p>
        <pre className="mt-3 text-xs font-mono text-[var(--foreground)] bg-[var(--accent)] p-4 overflow-x-auto">
{`curl ${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/env \\
  -H "Authorization: Bearer envvault_sk_your_key_here"

# For JSON format:
curl ${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/env?format=json \\
  -H "Authorization: Bearer envvault_sk_your_key_here"`}
        </pre>
      </div>

      {/* Keys Table */}
      <div className="editorial-panel">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[var(--foreground)]">
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-[0.1em] text-[var(--foreground)] font-medium">Project</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-[0.1em] text-[var(--foreground)] font-medium">API Key</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-[0.1em] text-[var(--foreground)] font-medium">Environment</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-[0.1em] text-[var(--foreground)] font-medium">Created</th>
                <th className="py-4 px-6 font-sans text-xs uppercase tracking-[0.1em] text-[var(--foreground)] font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {isFetching ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 size={24} className="animate-spin text-[var(--foreground)] mx-auto" />
                  </td>
                </tr>
              ) : keys.length > 0 ? (
                keys.map((k) => (
                  <tr key={k.id} className="group hover:bg-[var(--accent)] transition-colors duration-200">
                    <td className="py-5 px-6 text-sm font-medium text-[var(--foreground)]">{k.project_name}</td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-[var(--muted)] bg-[var(--accent)] px-2 py-1 rounded truncate max-w-[220px]">
                          {k.api_key.slice(0, 20)}...
                        </code>
                        <button
                          onClick={() => handleCopy(k.api_key, k.id)}
                          className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                          title="Copy full key"
                        >
                          {copiedId === k.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="stroke-[1.5]" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-xs uppercase tracking-[0.05em] text-[var(--muted)] px-2 py-1 border border-[var(--border)] rounded-sm">
                        {k.environment}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-sm text-[var(--muted)] font-light">
                      {new Date(k.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-5 px-6 text-right">
                      <button
                        onClick={() => handleDelete(k.id)}
                        className="text-[var(--muted)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Revoke key"
                      >
                        <Trash2 size={16} className="stroke-[1.5]" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-[var(--muted)] text-sm font-light italic">
                    No API keys generated yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Key Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg editorial-panel p-8 md:p-10 shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl editorial-header text-[var(--foreground)]">
                  {newlyCreatedKey ? 'Key Created' : 'Generate API Key'}
                </h2>
                <p className="text-sm text-[var(--muted)] font-light mt-1">
                  {newlyCreatedKey
                    ? 'Copy and store this key securely. It won\'t be shown again in full.'
                    : `Key will be scoped to the ${selectedEnvironment} environment.`}
                </p>
              </div>
              <button
                onClick={() => { setShowModal(false); setNewlyCreatedKey(null); }}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-1"
              >
                <X size={20} className="stroke-[1.5]" />
              </button>
            </div>

            {newlyCreatedKey ? (
              <div className="space-y-6">
                <div className="bg-[var(--accent)] p-4 rounded border border-[var(--border)] flex items-center justify-between gap-3">
                  <code className="text-sm font-mono text-[var(--foreground)] break-all">{newlyCreatedKey}</code>
                  <button
                    onClick={() => handleCopy(newlyCreatedKey, 'new')}
                    className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors flex-shrink-0"
                  >
                    {copiedId === 'new' ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} className="stroke-[1.5]" />}
                  </button>
                </div>
                <button
                  onClick={() => { setShowModal(false); setNewlyCreatedKey(null); }}
                  className="editorial-button w-full py-3"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-[0.1em] text-[var(--muted)] font-medium">Project Name</label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full editorial-input py-2 text-sm focus:bg-[var(--accent)]"
                    placeholder="e.g. payments-service"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-[0.1em] text-[var(--muted)] font-medium">Environment</label>
                  <div className="text-sm text-[var(--foreground)] font-medium py-2 border-b border-[var(--border)]">
                    {selectedEnvironment}
                  </div>
                  <p className="text-xs text-[var(--muted)] font-light">Switch environments using the top navigation bar.</p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="editorial-button-outline px-6 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="editorial-button px-6 py-2 flex items-center gap-2"
                  >
                    <KeyRound size={16} />
                    {creating ? 'Generating...' : 'Generate Key'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
