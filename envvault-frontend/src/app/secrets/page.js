'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEnvironment } from '@/context/EnvironmentContext';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import SecretTable from '@/components/SecretTable';
import CreateSecretModal from '@/components/CreateSecretModal';
import EditSecretModal from '@/components/EditSecretModal';
import { Loader2 } from 'lucide-react';
import { secretService } from '@/services/secretService';

export default function SecretsPage() {
  const { user, loading } = useAuth();
  const { selectedEnvironment } = useEnvironment();
  const router = useRouter();

  const [secrets, setSecrets] = useState([]);
  const [fetching, setFetching] = useState(true);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSecret, setEditingSecret] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const loadSecrets = async () => {
    setFetching(true);
    try {
      const data = await secretService.getSecrets(selectedEnvironment);
      setSecrets(Array.isArray(data) ? data : []);
    } catch {
      setSecrets([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user) loadSecrets();
  }, [user, selectedEnvironment]);

  const handleCreate = async (data) => {
    await secretService.createSecret(data);
    loadSecrets();
  };

  const handleUpdate = async (id, data) => {
    await secretService.updateSecret(id, data);
    loadSecrets();
  };

  const handleDelete = async (id) => {
    await secretService.deleteSecret(id);
    loadSecrets();
  };

  if (loading || !user) return null;

  return (
    <Layout>
      <div className="mb-12">
        <h1 className="text-4xl editorial-header text-[var(--foreground)] mb-3">Secrets</h1>
        <p className="text-[var(--muted)] text-sm font-light">
          Managing configuration for the <span className="font-medium text-[var(--foreground)]">{selectedEnvironment}</span> environment.
        </p>
      </div>

      {fetching ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 size={24} className="animate-spin text-[var(--foreground)] mb-4" />
          <div className="text-sm text-[var(--muted)] font-light">Loading secrets...</div>
        </div>
      ) : (
        <SecretTable 
          secrets={secrets} 
          onDelete={handleDelete} 
          onUpdate={(secret) => setEditingSecret(secret)}
          onCreate={() => setIsCreateOpen(true)}
        />
      )}

      <CreateSecretModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onCreate={handleCreate}
      />

      <EditSecretModal 
        isOpen={!!editingSecret} 
        onClose={() => setEditingSecret(null)} 
        onUpdate={handleUpdate}
        secret={editingSecret}
      />
    </Layout>
  );
}
