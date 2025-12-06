"use client";

import { useState } from "react";
import { Copy, Eye, EyeOff, Plus, Trash2, Check } from "lucide-react";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  requests: number;
};

const MOCK_KEYS: ApiKey[] = [
  {
    id: "1",
    name: "Production API",
    key: "dk_live_abc123def456ghi789jkl012mno345pqr678stu901vwx234",
    created: "2024-11-15",
    lastUsed: "2 hours ago",
    requests: 12450,
  },
  {
    id: "2",
    name: "Development",
    key: "dk_test_xyz987wvu654tsr321qpo098nml765kji432hgf210",
    created: "2024-10-20",
    lastUsed: "1 day ago",
    requests: 3280,
  },
];

export default function ApiKeysPage() {
  const [keys] = useState(MOCK_KEYS);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleVisibility = (id: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + "..." + key.substring(key.length - 8);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8">
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">API Keys</h1>
            <p className="text-zinc-400">Manage your API keys for accessing DataAPI</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-white font-medium hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" />
            Create New Key
          </button>
        </div>

        <div className="space-y-4">
          {keys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-[#5800C3]/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{apiKey.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span>Created {apiKey.created}</span>
                    <span>•</span>
                    <span>Last used {apiKey.lastUsed}</span>
                    <span>•</span>
                    <span>{apiKey.requests.toLocaleString()} requests</span>
                  </div>
                </div>
                <button className="text-zinc-500 hover:text-red-400 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 bg-black/50 border border-white/5 rounded-lg p-3 font-mono text-sm">
                <code className="flex-1 text-zinc-300">
                  {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                </code>
                <button
                  onClick={() => toggleVisibility(apiKey.id)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  {visibleKeys.has(apiKey.id) ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  {copiedKey === apiKey.id ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


