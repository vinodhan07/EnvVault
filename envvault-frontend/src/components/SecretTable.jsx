'use client';

import { useState } from 'react';
import SecretRow from './SecretRow';
import { DownloadCloud, Plus } from 'lucide-react';
import DownloadEnvButton from './DownloadEnvButton';

export default function SecretTable({ secrets = [], onDelete, onUpdate, onCreate }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSecrets = secrets.filter(
    (s) =>
      s.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 relative z-10">
        <input
          type="text"
          placeholder="Search configuration..."
          className="editorial-input w-full sm:max-w-xs py-2 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <DownloadEnvButton />
          <button 
            onClick={onCreate}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 editorial-button py-2 px-6"
          >
            <Plus size={16} />
            <span>New Variable</span>
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto relative">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-[var(--foreground)]">
              <th className="py-4 px-4 font-sans text-xs uppercase tracking-[0.1em] text-[var(--foreground)] font-medium">Key / Variable</th>
              <th className="py-4 px-4 font-sans text-xs uppercase tracking-[0.1em] text-[var(--foreground)] font-medium">Value</th>
              <th className="py-4 px-4 font-sans text-xs uppercase tracking-[0.1em] text-[var(--foreground)] font-medium hidden md:table-cell">Description</th>
              <th className="py-4 px-4 font-sans text-xs uppercase tracking-[0.1em] text-[var(--foreground)] font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredSecrets.length > 0 ? (
              filteredSecrets.map((secret) => (
                <SecretRow 
                  key={secret.id} 
                  secret={secret} 
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-12 text-center text-[var(--muted)] text-sm font-light italic">
                  {searchTerm ? 'No configurations match your search.' : 'No configurations stored in this environment.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
