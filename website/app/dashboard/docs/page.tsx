"use client";

import { useState, useCallback } from "react";
import {
  FileText,
  ChevronRight,
  Copy,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { clsx } from "clsx";

interface DocSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface CodeBlockProps {
  code: string;
  id: string;
  copiedCode: string | null;
  onCopy: (text: string, id: string) => void;
}

function CodeBlock({ code, id, copiedCode, onCopy }: CodeBlockProps) {
  return (
    <div className="relative my-4">
      <pre className="rounded-lg bg-black/50 p-4 text-sm text-gray-300 overflow-x-auto">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={() => onCopy(code, id)}
        className={clsx(
          "absolute right-3 top-3 rounded-lg p-2 transition-colors",
          copiedCode === id
            ? "bg-green-500/10 text-green-400"
            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
        )}
      >
        {copiedCode === id ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      console.error("Failed to copy");
    }
  }, []);

  const sections: DocSection[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      content: (
        <div className="space-y-4 text-gray-300">
          <p>
            Welcome to the Context API documentation. This API provides semantic
            search capabilities for Twitter/X data with credit-based billing.
          </p>
          <h3 className="text-lg font-semibold text-white mt-6">
            1. Get your API Key
          </h3>
          <p>
            First, you need to create an API key from the{" "}
            <a
              href="/dashboard/api-keys"
              className="text-[#8B5CF6] hover:underline"
            >
              API Keys page
            </a>
            .
          </p>
          <h3 className="text-lg font-semibold text-white mt-6">
            2. Make your first request
          </h3>
          <p>
            Use the search endpoint to find relevant posts from a Twitter/X
            user:
          </p>
          <CodeBlock
            id="first-request"
            code={`curl -X POST "https://dev.doppelgagners.ai:3003/v1/search" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "What does he think about AI?",
    "username": "elonmusk",
    "platform": "X"
  }'`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          />
        </div>
      ),
    },
    {
      id: "authentication",
      title: "Authentication",
      content: (
        <div className="space-y-4 text-gray-300">
          <p>
            All API requests require authentication using an API key in the
            X-API-Key header.
          </p>
          <CodeBlock
            id="auth-header"
            code={`X-API-Key: YOUR_API_KEY`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          />
          <h3 className="text-lg font-semibold text-white mt-6">
            API Key Management
          </h3>
          <div className="space-y-3">
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                  POST
                </span>
                <code className="text-sm">/auth/request-key</code>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Request a new API key
              </p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                  GET
                </span>
                <code className="text-sm">/auth/api-keys</code>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                List all API keys for current developer
              </p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                  DELETE
                </span>
                <code className="text-sm">/auth/api-keys/{"{id}"}</code>
              </div>
              <p className="mt-2 text-sm text-gray-400">Revoke an API key</p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                  GET
                </span>
                <code className="text-sm">/auth/me</code>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Get current developer profile
              </p>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mt-6">
            Login Endpoints
          </h3>
          <div className="space-y-3">
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                  POST
                </span>
                <code className="text-sm">/auth/login/request-code</code>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Request verification code
              </p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                  POST
                </span>
                <code className="text-sm">/auth/login/verify</code>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Verify code and login
              </p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                  POST
                </span>
                <code className="text-sm">/auth/login/wallet/challenge</code>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Request wallet challenge
              </p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                  POST
                </span>
                <code className="text-sm">/auth/login/wallet/verify</code>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Verify wallet signature and login
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "search",
      title: "Search API",
      content: (
        <div className="space-y-4 text-gray-300">
          <p>
            The Search API allows you to perform semantic search on Twitter/X
            post renderings for a specific user.
          </p>
          <h3 className="text-lg font-semibold text-white mt-6">Endpoint</h3>
          <div className="rounded-lg bg-white/5 p-4">
            <div className="flex items-center gap-2">
              <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                POST
              </span>
              <code className="text-sm">/v1/search</code>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Search relevant post renderings based on a semantic query
            </p>
          </div>
          <h3 className="text-lg font-semibold text-white mt-6">
            Request Body
          </h3>
          <CodeBlock
            id="search-request"
            code={`{
  "query": "What does he think about AI?",
  "username": "elonmusk",
  "platform": "X"
}`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          />
          <h3 className="text-lg font-semibold text-white mt-6">
            Example Request
          </h3>
          <CodeBlock
            id="search-curl"
            code={`curl -X POST "https://dev.doppelgangers.ai:3003/v1/search" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "What does he think about AI?",
    "username": "elonmusk",
    "platform": "X"
  }'`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          />
          <h3 className="text-lg font-semibold text-white mt-6">
            Response Codes
          </h3>
          <div className="space-y-3">
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                  200
                </span>
                <span className="text-sm text-gray-300">Search results</span>
              </div>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
                  402
                </span>
                <span className="text-sm text-gray-300">
                  Insufficient credits
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                  404
                </span>
                <span className="text-sm text-gray-300">Dataset not found</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                If the dataset is not indexed, your request will be recorded for
                demand tracking.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "renderings",
      title: "Renderings API",
      content: (
        <div className="space-y-4 text-gray-300">
          <p>
            The Renderings API provides access to post renderings for a specific
            Twitter/X user.
          </p>
          <h3 className="text-lg font-semibold text-white mt-6">Endpoints</h3>
          <div className="space-y-3">
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                  GET
                </span>
                <code className="text-sm">/v1/renderings</code>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Get all post full renderings for a user, with metadata
              </p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                  GET
                </span>
                <code className="text-sm">/v1/renderings/simple</code>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Get all simple renderings for a user
              </p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                  GET
                </span>
                <code className="text-sm">/v1/jobs/{"{id}"}/status</code>
              </div>
              <p className="mt-2 text-sm text-gray-400">Get job status</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mt-6">
            Example Request
          </h3>
          <CodeBlock
            id="renderings-curl"
            code={`curl -X GET "https://dev.doppelgangers.ai:3003/v1/renderings?username=elonmusk&platform=X" \\
  -H "X-API-Key: YOUR_API_KEY"`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          />
        </div>
      ),
    },
    {
      id: "credits",
      title: "Credits",
      content: (
        <div className="space-y-4 text-gray-300">
          <p>
            Credits are used to pay for API requests. Each successful request
            consumes credits based on the operation type.
          </p>
          <h3 className="text-lg font-semibold text-white mt-6">Endpoints</h3>
          <div className="space-y-3">
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                  GET
                </span>
                <code className="text-sm">/credits</code>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Get current credit balance
              </p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                  GET
                </span>
                <code className="text-sm">/credits/transactions</code>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Get credit transaction history
              </p>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mt-6">
            Example Response
          </h3>
          <CodeBlock
            id="credits-response"
            code={`{
  "balance": 100,
  "totalUsed": 50,
  "totalPurchased": 150
}`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          />
        </div>
      ),
    },
    {
      id: "demand",
      title: "Demand API",
      content: (
        <div className="space-y-4 text-gray-300">
          <p>
            The Demand API allows you to see which creators are most requested
            by the community. When you search for a user that is not yet
            indexed, your request is automatically recorded.
          </p>
          <h3 className="text-lg font-semibold text-white mt-6">Endpoints</h3>
          <div className="space-y-3">
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                  GET
                </span>
                <code className="text-sm">/v1/demand</code>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Get demand leaderboard
              </p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                  GET
                </span>
                <code className="text-sm">/v1/demand/{"{username}"}</code>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Get detailed demand for a specific username
              </p>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mt-6">
            Example Response (404 with demand)
          </h3>
          <CodeBlock
            id="demand-response"
            code={`{
  "error": "dataset_not_found",
  "message": "No indexed data found for @username. Your request has been recorded.",
  "requestedUsername": "username",
  "demandRecorded": true,
  "demandStats": {
    "totalRequests": 1,
    "uniqueRequesters": 1,
    "rank": 1
  },
  "cta": {
    "message": "Want this dataset? Mint the NFT to become the data owner!",
    "mintUrl": "https://contextapi.com/mint/username"
  }
}`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          />
        </div>
      ),
    },
    {
      id: "rate-limits",
      title: "Rate Limits",
      content: (
        <div className="space-y-4 text-gray-300">
          <p>
            The API implements rate limiting to ensure fair usage. Rate limit
            information is included in the response headers.
          </p>
          <h3 className="text-lg font-semibold text-white mt-6">
            Rate Limit Headers
          </h3>
          <div className="space-y-3">
            <div className="rounded-lg bg-white/5 p-4">
              <code className="text-sm text-white">X-RateLimit-Limit-Short</code>
              <p className="mt-2 text-sm text-gray-400">
                Maximum requests per minute (default: 60)
              </p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <code className="text-sm text-white">X-RateLimit-Limit-Long</code>
              <p className="mt-2 text-sm text-gray-400">
                Maximum requests per day (default: 1000)
              </p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <code className="text-sm text-white">X-RateLimit-Remaining-Short</code>
              <p className="mt-2 text-sm text-gray-400">
                Remaining requests in current minute window
              </p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <code className="text-sm text-white">X-RateLimit-Remaining-Long</code>
              <p className="mt-2 text-sm text-gray-400">
                Remaining requests in current day window
              </p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <code className="text-sm text-white">X-RateLimit-Reset-Short</code>
              <p className="mt-2 text-sm text-gray-400">
                Seconds until the minute window resets
              </p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <code className="text-sm text-white">X-RateLimit-Reset-Long</code>
              <p className="mt-2 text-sm text-gray-400">
                Seconds until the day window resets
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "health",
      title: "Health Check",
      content: (
        <div className="space-y-4 text-gray-300">
          <p>Use the health endpoint to check the API status.</p>
          <div className="rounded-lg bg-white/5 p-4">
            <div className="flex items-center gap-2">
              <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                GET
              </span>
              <code className="text-sm">/health</code>
            </div>
            <p className="mt-2 text-sm text-gray-400">Health check endpoint</p>
          </div>
          <h3 className="text-lg font-semibold text-white mt-6">
            Example Response
          </h3>
          <CodeBlock
            id="health-response"
            code={`{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": "up",
    "cache": "up",
    "queue": "up"
  }
}`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          />
        </div>
      ),
    },
  ];

  const activeContent = sections.find((s) => s.id === activeSection);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a] px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Documentation</h1>
            <p className="mt-1 text-sm text-gray-400">
              Semantic search API for Twitter/X data
            </p>
          </div>
          <a
            href="https://dev.doppelgangers.ai:3003/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
          >
            Full API Docs
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* Content */}
      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 border-r border-white/10 p-6">
          <div className="space-y-1">
            {sections.map((section) => (
              <button
                type="button"
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={clsx(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  activeSection === section.id
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {section.title}
                </span>
                {activeSection === section.id && (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {activeContent?.title}
            </h2>
            {activeContent?.content}
          </div>
        </main>
      </div>
    </div>
  );
}
