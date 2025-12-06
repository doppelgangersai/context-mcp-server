"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function McpPage() {
  const [copied, setCopied] = useState(false);

  const installCommand = "npx @dataapi/mcp-server";

  const copyCommand = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-2">MCP Server Integration</h1>
        <p className="text-zinc-400 mb-8">
          Connect DataAPI to your AI agents using Model Context Protocol
        </p>

        {/* Quick Start */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Start</h2>
          <div className="bg-black/50 border border-white/5 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500 font-mono">Terminal</span>
              <button
                onClick={copyCommand}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <code className="text-[#C2C4F9] font-mono text-sm">{installCommand}</code>
          </div>
          <p className="text-sm text-zinc-400">
            Run this command to install and configure the MCP server. Your API key will be automatically detected from environment variables.
          </p>
        </div>

        {/* Configuration */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Server URL</label>
              <code className="block bg-black/50 border border-white/5 rounded-lg p-3 text-sm text-zinc-300 font-mono">
                https://mcp.dataapi.com
              </code>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Authentication</label>
              <code className="block bg-black/50 border border-white/5 rounded-lg p-3 text-sm text-zinc-300 font-mono">
                Bearer YOUR_API_KEY
              </code>
            </div>
          </div>
        </div>

        {/* Supported Clients */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Supported Clients</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {["ChatGPT", "Claude", "OpenAI Agent Builder"].map((client) => (
              <div key={client} className="bg-black/40 border border-white/5 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">{client}</h3>
                <a href="#" className="text-sm text-[#C2C4F9] hover:text-white transition-colors">
                  Setup Guide →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


