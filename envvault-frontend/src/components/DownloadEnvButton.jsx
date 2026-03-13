'use client';

import { DownloadCloud } from 'lucide-react';
import { secretService } from '@/services/secretService';
import { useEnvironment } from '@/context/EnvironmentContext';

export default function DownloadEnvButton() {
  const { selectedEnvironment } = useEnvironment();

  const handleDownload = async () => {
    try {
      const data = await secretService.exportEnv(selectedEnvironment);
      // 'data' is basically the formatted string: "KEY=VALUE\n..."
      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `.env.${selectedEnvironment.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to download env block", e);
    }
  };

  return (
    <button 
      onClick={handleDownload}
      className="editorial-button-outline py-2 px-6 flex items-center justify-center gap-2"
      title={`Download .env.${selectedEnvironment.toLowerCase()}`}
    >
      <DownloadCloud size={16} />
      <span>Export .env</span>
    </button>
  );
}
