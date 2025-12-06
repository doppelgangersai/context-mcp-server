"use client";

import { useState, useEffect } from "react";
import {
  Key,
  Plus,
  Copy,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/lib/api";
import type { ApiKey } from "@/types/api";
import { clsx } from "clsx";

export default function ApiKeysPage() {
  const { accessToken } = useAuthStore();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyEmail, setNewKeyEmail] = useState("");
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, [accessToken]);

  async function fetchApiKeys() {
    if (!accessToken) return;

    setIsLoading(true);
    try {
      const response = await authApi.getApiKeys(accessToken);
      setApiKeys(response.keys);
    } catch (err) {
      console.error("Error fetching API keys:", err);
      setError("Failed to load API keys");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateKey() {
    if (!accessToken || !newKeyEmail.trim() || !newKeyName.trim()) return;

    setIsCreating(true);
    setError(null);
    try {
      const response = await authApi.requestApiKey(accessToken, {
        email: newKeyEmail.trim(),
        name: newKeyName.trim(),
      });
      setCreatedKey(response.apiKey);
      // Refresh the list to get the new key
      await fetchApiKeys();
      setNewKeyEmail("");
      setNewKeyName("");
    } catch (err) {
      console.error("Error creating API key:", err);
      setError("Failed to create API key");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleRevokeKey(id: string) {
    if (!accessToken) return;

    try {
      await authApi.revokeApiKey(accessToken, id);
      setApiKeys((prev) => prev.filter((key) => key.id !== id));
    } catch (err) {
      console.error("Error revoking API key:", err);
      setError("Failed to revoke API key");
    }
  }

  async function copyToClipboard(key: string, id: string) {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      console.error("Failed to copy");
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a] px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">API Keys</h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage your API keys for authentication
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-[#5800C3] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6B00E8] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create New Key
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400">
            <AlertCircle className="h-5 w-5" />
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* API Keys List */}
        <div className="rounded-xl border border-white/10 bg-[#111111]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          ) : apiKeys?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <Key className="h-12 w-12 mb-4 opacity-50" />
              <p className="font-medium">No API keys yet</p>
              <p className="text-sm mt-1">Create your first API key to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {apiKeys?.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5800C3]/10">
                      <Key className="h-5 w-5 text-[#8B5CF6]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">
                          {apiKey.name || "Unnamed Key"}
                        </span>
                        {!apiKey.isActive && (
                          <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-400">
                            Revoked
                          </span>
                        )}
                      </div>
                      <div className="mt-1 font-mono text-sm text-gray-400">
                        <span>{apiKey.keyPrefix}••••••••</span>
                      </div>
                      {apiKey.description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {apiKey.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm text-gray-400">
                      <div>
                        Created{" "}
                        {new Date(apiKey.createdAt).toLocaleDateString()}
                      </div>
                      {apiKey.lastUsedAt && (
                        <div className="text-xs text-gray-500">
                          Last used{" "}
                          {new Date(apiKey.lastUsedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {apiKey.key && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(apiKey.key!, apiKey.id)}
                        className={clsx(
                          "rounded-lg p-2 transition-colors",
                          copiedKey === apiKey.id
                            ? "bg-green-500/10 text-green-400"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                        )}
                        title="Copy to clipboard"
                      >
                        {copiedKey === apiKey.id ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    )}

                    {apiKey.isActive && (
                      <button
                        onClick={() => handleRevokeKey(apiKey.id)}
                        className="rounded-lg p-2 bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        title="Revoke key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#111111] p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white">
              {createdKey ? "API Key Created" : "Create New API Key"}
            </h2>

            {createdKey ? (
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-4">
                  Make sure to copy your API key now. You won&apos;t be able to
                  see it again!
                </p>
                <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 p-4">
                  <code className="flex-1 text-sm text-white font-mono break-all">
                    {createdKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(createdKey, "new")}
                    className={clsx(
                      "rounded-lg p-2 transition-colors shrink-0",
                      copiedKey === "new"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {copiedKey === "new" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreatedKey(null);
                  }}
                  className="mt-6 w-full rounded-lg bg-[#5800C3] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6B00E8] transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={newKeyEmail}
                    onChange={(e) => setNewKeyEmail(e.target.value)}
                    placeholder="developer@example.com"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-[#5800C3]/50 focus:outline-none focus:ring-1 focus:ring-[#5800C3]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-[#5800C3]/50 focus:outline-none focus:ring-1 focus:ring-[#5800C3]/50"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewKeyEmail("");
                      setNewKeyName("");
                    }}
                    className="flex-1 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateKey}
                    disabled={!newKeyEmail.trim() || !newKeyName.trim() || isCreating}
                    className="flex-1 rounded-lg bg-[#5800C3] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6B00E8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCreating ? "Creating..." : "Create Key"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
