'use client';

import { useState } from 'react';
import { useEnvironment } from '@/context/EnvironmentContext';
import { X, Check } from 'lucide-react';

export default function CreateSecretModal({ isOpen, onClose, onCreate }) {
  const { selectedEnvironment } = useEnvironment();
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onCreate({ key, value, description, environment: selectedEnvironment });
    setLoading(false);
    
    // Reset internal state
    setKey('');
    setValue('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg editorial-panel p-8 md:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl editorial-header text-[var(--foreground)]">New Configuration</h2>
            <p className="text-sm text-[var(--muted)] font-light mt-1">Creating in <span className="font-medium text-[var(--foreground)]">{selectedEnvironment}</span></p>
          </div>
          <button 
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-1"
          >
            <X size={20} className="stroke-[1.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-[0.1em] text-[var(--muted)] font-medium">Variable Key</label>
            <input
              type="text"
              required
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
              className="w-full editorial-input py-2 focus:bg-[var(--accent)] text-sm font-mono"
              placeholder="e.g. DATABASE_URL"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-[0.1em] text-[var(--muted)] font-medium">Variable Value</label>
            <textarea
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full editorial-input py-2 focus:bg-[var(--accent)] text-sm font-mono min-h-[80px] resize-y"
              placeholder="e.g. postgres://user:pass@host/db"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-[0.1em] text-[var(--muted)] font-medium">Description <span className="text-[var(--border)]">(Optional)</span></label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full editorial-input py-2 focus:bg-[var(--accent)] text-sm font-sans"
              placeholder="What is this used for?"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="editorial-button-outline px-6 py-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="editorial-button px-6 py-2 flex items-center gap-2"
            >
               {loading ? 'Saving...' : (
                 <>
                   <Check size={16} /> Save Configuration
                 </>
               )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
