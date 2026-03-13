'use client';

import { useState, useEffect } from 'react';
import { useEnvironment } from '@/context/EnvironmentContext';
import { X, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import { secretService } from '@/services/secretService';

export default function EditSecretModal({ isOpen, onClose, onUpdate, secret }) {
  const { selectedEnvironment } = useEnvironment();
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [fetching, setFetching] = useState(false);

  // When the modal opens with a secret, fetch the real value
  useEffect(() => {
    if (secret && isOpen) {
      setKey(secret.key);
      setDescription(secret.description || '');
      setValue('');
      setRevealed(false);
      
      // Fetch the actual secret value
      setFetching(true);
      secretService.revealSecret(secret.id)
        .then((data) => {
          setValue(data.value || '');
        })
        .catch((err) => {
          console.error("Failed to fetch secret value", err);
          setValue('');
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [secret, isOpen]);

  if (!isOpen || !secret) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onUpdate(secret.id, { key, value, description, environment: selectedEnvironment });
    setLoading(false);
    onClose();
  };

  // Mask the value for display
  const displayValue = revealed ? value : '●'.repeat(Math.min(value.length, 20));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg editorial-panel p-8 md:p-10 shadow-2xl">
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl editorial-header text-[var(--foreground)]">Edit Configuration</h2>
            <p className="text-sm text-[var(--muted)] font-light mt-1">Modifying in <span className="font-medium text-[var(--foreground)]">{selectedEnvironment}</span></p>
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
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs uppercase tracking-[0.1em] text-[var(--muted)] font-medium">Variable Value</label>
              <button
                type="button"
                onClick={() => setRevealed(!revealed)}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1 text-xs"
                title={revealed ? 'Hide value' : 'Reveal value'}
              >
                {revealed ? <EyeOff size={14} className="stroke-[1.5]" /> : <Eye size={14} className="stroke-[1.5]" />}
                <span>{revealed ? 'Hide' : 'Reveal'}</span>
              </button>
            </div>
            
            {fetching ? (
              <div className="flex items-center gap-2 py-3 text-[var(--muted)]">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-xs font-light">Fetching secret value...</span>
              </div>
            ) : (
              <textarea
                required
                value={revealed ? value : displayValue}
                onChange={(e) => {
                  // If user types, auto-reveal and set value
                  if (!revealed) setRevealed(true);
                  setValue(e.target.value);
                }}
                onFocus={() => {
                  // When focused, reveal value so user sees real text
                  if (!revealed) setRevealed(true);
                }}
                className="w-full editorial-input py-2 focus:bg-[var(--accent)] text-sm font-mono min-h-[80px] resize-y"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-[0.1em] text-[var(--muted)] font-medium">Description <span className="text-[var(--border)]">(Optional)</span></label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full editorial-input py-2 focus:bg-[var(--accent)] text-sm font-sans"
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
              disabled={loading || fetching}
              className="editorial-button px-6 py-2 flex items-center gap-2"
            >
               {loading ? 'Updating...' : (
                 <>
                   <Check size={16} /> Update Details
                 </>
               )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
