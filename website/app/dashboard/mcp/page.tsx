"use client";

import { useState } from "react";
import { Terminal, Copy, CheckCircle, ExternalLink, Search, MessageSquare, CreditCard } from "lucide-react";
import { clsx } from "clsx";

export default function MCPPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const mcpConfig = `{
  "mcpServers": {
    "context-api": {
      "command": "npx",
      "args": ["-y", "context-api-mcp"],
      "env": {
        "CONTEXT_API_KEY": "your-api-key-here"
      }
    }
  }
}`;

  const exampleSearch = `"What does @elonmusk think about AI regulation?"

"What is @hosseeb's prediction on the price of Bitcoin?"`;

  const exampleAnalysis = `"What topics does @elonmusk tweet most about?"

"What has recently been the mood of @naval?"`;

  async function copyToClipboard(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      console.error("Failed to copy");
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a] px-8 py-6">
        <div>
          <h1 className="text-2xl font-bold text-white">MCP Integration</h1>
          <p className="mt-1 text-sm text-gray-400">
            Access Twitter/X posts with semantic search via Model Context Protocol
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="p-8 max-w-4xl">
        {/* What is MCP */}
        <div className="rounded-xl border border-white/10 bg-[#111111] p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#5800C3]/10 shrink-0">
              <Terminal className="h-6 w-6 text-[#8B5CF6]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                What is MCP?
              </h2>
              <p className="mt-2 text-gray-400">
                Model Context Protocol (MCP) allows AI assistants like Claude to connect to
                external services and tools. With our MCP server, you can perform semantic searches
                across Twitter/X posts and analyze user content directly in your conversations.
              </p>
              <a
                href="https://modelcontextprotocol.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-sm text-[#8B5CF6] hover:text-[#A78BFA] transition-colors"
              >
                Learn more about MCP
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Available Tools */}
        <div className="rounded-xl border border-white/10 bg-[#111111] p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Available Tools</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-4 w-4 text-[#8B5CF6]" />
                <h3 className="font-medium text-white">search_relevant_posts</h3>
              </div>
              <p className="text-sm text-gray-400">
                Semantic search across a user&apos;s posts using natural language queries.
              </p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-[#8B5CF6]" />
                <h3 className="font-medium text-white">get_all_user_posts</h3>
              </div>
              <p className="text-sm text-gray-400">
                Retrieve all posts for comprehensive analysis of trends and topics.
              </p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-[#8B5CF6]" />
                <h3 className="font-medium text-white">check_credits</h3>
              </div>
              <p className="text-sm text-gray-400">
                View your API credit balance and usage statistics.
              </p>
            </div>
          </div>
        </div>

        {/* Setup Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="rounded-xl border border-white/10 bg-[#111111] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5800C3] text-white font-bold text-sm">
                1
              </div>
              <h3 className="text-lg font-semibold text-white">
                Get your API Key
              </h3>
            </div>
            <p className="text-gray-400 mb-4">
              First, create an API key from the API Keys page. You&apos;ll need
              this to authenticate requests.
            </p>
            <a
              href="/dashboard/api-keys"
              className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Go to API Keys
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border border-white/10 bg-[#111111] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5800C3] text-white font-bold text-sm">
                2
              </div>
              <h3 className="text-lg font-semibold text-white">
                Configure Your AI Client
              </h3>
            </div>
            <p className="text-gray-400 mb-4">
              Add the following configuration to your MCP-compatible client (Claude Desktop, Cursor, VS Code, etc.):
            </p>
            <div className="relative">
              <pre className="rounded-lg bg-black/50 p-4 text-sm text-gray-300 overflow-x-auto">
                <code>{mcpConfig}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(mcpConfig, "config")}
                className={clsx(
                  "absolute right-3 top-3 rounded-lg p-2 transition-colors",
                  copiedCode === "config"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                )}
              >
                {copiedCode === "config" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-500 space-y-1">
              <p className="font-medium text-gray-400">Config file locations:</p>
              <p>
                <span className="text-gray-400">Claude Desktop (macOS):</span>{" "}
                <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded">~/Library/Application Support/Claude/claude_desktop_config.json</code>
              </p>
              <p>
                <span className="text-gray-400">Claude Desktop (Windows):</span>{" "}
                <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded">%APPDATA%\Claude\claude_desktop_config.json</code>
              </p>
              <p>
                <span className="text-gray-400">Cursor:</span>{" "}
                <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded">~/.cursor/mcp.json</code>
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border border-white/10 bg-[#111111] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5800C3] text-white font-bold text-sm">
                3
              </div>
              <h3 className="text-lg font-semibold text-white">
                Start Using It
              </h3>
            </div>
            <p className="text-gray-400 mb-4">
              Restart your AI client, then you can use natural language to search and analyze Twitter/X posts:
            </p>

            {/* Search Examples */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-300 mb-2">Semantic Search Examples:</p>
              <div className="relative">
                <pre className="rounded-lg bg-black/50 p-4 text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                  <code>{exampleSearch}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(exampleSearch, "search")}
                  className={clsx(
                    "absolute right-3 top-3 rounded-lg p-2 transition-colors",
                    copiedCode === "search"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {copiedCode === "search" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Analysis Examples */}
            <div>
              <p className="text-sm font-medium text-gray-300 mb-2">Analysis Examples:</p>
              <div className="relative">
                <pre className="rounded-lg bg-black/50 p-4 text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                  <code>{exampleAnalysis}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(exampleAnalysis, "analysis")}
                  className={clsx(
                    "absolute right-3 top-3 rounded-lg p-2 transition-colors",
                    copiedCode === "analysis"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {copiedCode === "analysis" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="mt-6 rounded-xl border border-white/10 bg-[#111111] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Environment Variables</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Variable</th>
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Required</th>
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-2 px-3">
                    <code className="text-[#8B5CF6]">CONTEXT_API_KEY</code>
                  </td>
                  <td className="py-2 px-3 text-green-400">Yes</td>
                  <td className="py-2 px-3 text-gray-400">Your API key for authentication</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">
                    <code className="text-[#8B5CF6]">CONTEXT_API_URL</code>
                  </td>
                  <td className="py-2 px-3 text-gray-500">No</td>
                  <td className="py-2 px-3 text-gray-400">Custom API endpoint (defaults to production)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Supported Clients */}
        <div className="mt-6 rounded-xl border border-white/10 bg-[#111111] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Supported Clients</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Claude Desktop",
              "Claude Code",
              "Cursor",
              "VS Code",
              "Windsurf",
              "Cline",
              "JetBrains IDEs",
              "Copilot CLI",
              "Gemini CLI",
              "Zed",
              "Warp",
            ].map((client) => (
              <span
                key={client}
                className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300 border border-white/10"
              >
                {client}
              </span>
            ))}
          </div>
        </div>

        {/* Help */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold text-white mb-2">Need Help?</h3>
          <p className="text-sm text-gray-400">
            Check out the{" "}
            <a
              href="https://github.com/doppelgangersai/context-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8B5CF6] hover:text-[#A78BFA]"
            >
              GitHub repository
            </a>{" "}
            for detailed documentation, or{" "}
            <a
              href="/dashboard/contact"
              className="text-[#8B5CF6] hover:text-[#A78BFA]"
            >
              contact support
            </a>{" "}
            if you run into any issues.
          </p>
        </div>
      </div>
    </div>
  );
}
