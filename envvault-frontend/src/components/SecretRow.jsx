'use client';

import { useState } from 'react';
import { Eye, EyeOff, Copy, Trash2, Edit2, Download } from 'lucide-react';
import { secretService } from '@/services/secretService';
import { maskSecret } from '@/utils/maskSecret';

export default function SecretRow({ secret, onDelete, onUpdate }) {
  const [revealedValue, setRevealedValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRevealToggle = async () => {
    if (revealedValue) {
      setRevealedValue(null);
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await secretService.revealSecret(secret.id);
      setRevealedValue(data.value);
    } catch (error) {
      console.error("Failed to reveal secret", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    let textToCopy = revealedValue || secret.value;
    
    // If not revealed, we need to fetch the real value before copying
    if (!revealedValue) {
       try {
           const data = await secretService.revealSecret(secret.id);
           textToCopy = data.value;
       } catch (error) {
           console.error("Failed to fetch for copy", error);
           return;
       }
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayValue = revealedValue ? revealedValue : maskSecret(secret.value);

  return (
    <tr className="group hover:bg-[var(--accent)] transition-colors duration-200">
      <td className="py-5 px-4">
        <div className="font-mono text-sm font-medium text-[var(--foreground)]">{secret.key}</div>
        <div className="md:hidden text-xs text-[var(--muted)] font-light mt-1 truncate max-w-[200px]">{secret.description}</div>
      </td>
      
      <td className="py-5 px-4 font-mono text-sm text-[var(--foreground)] break-all max-w-[250px]">
        {isLoading ? (
          <span className="animate-pulse text-[var(--muted)] tracking-widest">..........</span>
        ) : (
          <span className={`${revealedValue ? 'text-[var(--foreground)]' : 'text-[var(--muted)] tracking-widest'}`}>
            {displayValue}
          </span>
        )}
      </td>
      
      <td className="py-5 px-4 hidden md:table-cell">
        <span className="text-sm font-light text-[var(--muted)] line-clamp-2 max-w-[300px]">
          {secret.description || <span className="italic opacity-50">No description</span>}
        </span>
      </td>
      
      <td className="py-5 px-4 text-right">
        <div className="flex items-center justify-end gap-2 sm:gap-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          
          <button 
            onClick={handleRevealToggle}
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            title={revealedValue ? "Hide value" : "Reveal value"}
            disabled={isLoading}
          >
            {revealedValue ? <EyeOff size={16} className="stroke-[1.5]" /> : <Eye size={16} className="stroke-[1.5]" />}
          </button>
          
          <button 
            onClick={handleCopy}
            className={`${copied ? 'text-emerald-500' : 'text-[var(--muted)] hover:text-[var(--foreground)]'} transition-colors relative`}
            title="Copy to clipboard"
          >
            <Copy size={16} className="stroke-[1.5]" />
          </button>
          
          <span className="w-px h-4 bg-[var(--border)] hidden sm:block"></span>

          <button 
            onClick={() => onUpdate(secret)}
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            title="Edit Key"
          >
            <Edit2 size={16} className="stroke-[1.5]" />
          </button>
          
          <button 
            onClick={() => {
              if (window.confirm('Delete this variable permanently?')) {
                onDelete(secret.id);
              }
            }}
            className="text-[var(--muted)] hover:text-red-500 transition-colors"
            title="Delete Key"
          >
            <Trash2 size={16} className="stroke-[1.5]" />
          </button>
        </div>
      </td>
    </tr>
  );
}
