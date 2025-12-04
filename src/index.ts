#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { stderr } from 'process';

// Configuration
const API_BASE_URL =
  process.env.CONTEXT_API_URL || 'https://dev.doppelgnagers.ai:3003';
const API_KEY = process.env.CONTEXT_API_KEY || '';

// Types
interface SearchParams {
  query: string;
  username?: string;
  platform?: string;
  limit?: number;
  offset?: number;
  dateFrom?: string;
  dateTo?: string;
  minScore?: number;
  [key: string]: unknown;
}

interface RenderingsParams {
  username: string;
  platform?: string;
  simple?: boolean;
  [key: string]: unknown;
}

interface CreditsResponse {
  balance: number;
  lifetimePurchased: number;
  lifetimeUsed: number;
}

interface SearchResult {
  count: number;
  creditsCharged: number;
  creditsRemaining: number;
  renderings: Array<{
    global_doc_id: string;
    rendering: string;
    score: number;
    _store_date: string;
  }>;
}

// Logger (use stderr to not interfere with MCP protocol)
function log(message: string): void {
  stderr.write(`[context-api-mcp] ${message}\n`);
}

// API Client
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: Record<string, unknown>,
): Promise<T> {
  if (!API_KEY) {
    throw new Error(
      'CONTEXT_API_KEY environment variable is not set. Please set it in your Claude Desktop config.',
    );
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  log(`Making ${method} request to ${endpoint}`);

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  return response.json() as Promise<T>;
}

// Tool implementations
async function searchTwitterPosts(params: SearchParams): Promise<string> {
  const result = await apiRequest<SearchResult>('/v1/search', 'POST', params);

  if (result.count === 0) {
    return `No results found for query: "${params.query}"${
      params.username ? ` from @${params.username}` : ''
    }`;
  }

  const formattedResults = result.renderings
    .map((r, i) => {
      const date = new Date(r._store_date).toLocaleDateString();
      return `[${i + 1}] (Score: ${(r.score * 100).toFixed(1)}%, ${date})\n${
        r.rendering
      }`;
    })
    .join('\n\n---\n\n');

  return `Found ${result.count} results (showing ${result.renderings.length})\nCredits used: ${result.creditsCharged}, Remaining: ${result.creditsRemaining}\n\n${formattedResults}`;
}

async function getRenderings(params: RenderingsParams): Promise<string> {
  const endpoint = params.simple
    ? `/v1/renderings/simple?username=${encodeURIComponent(params.username)}${
        params.platform ? `&platform=${params.platform}` : ''
      }`
    : `/v1/renderings?username=${encodeURIComponent(params.username)}${
        params.platform ? `&platform=${params.platform}` : ''
      }`;

  const result = await apiRequest<{
    renderings: Array<{ id: string; text: string; createdAt: string }>;
  }>(endpoint);

  if (!result.renderings || result.renderings.length === 0) {
    return `No renderings found for @${params.username}`;
  }

  const formattedRenderings = result.renderings
    .slice(0, 20)
    .map((r, i) => {
      const date = new Date(r.createdAt).toLocaleDateString();
      return `[${i + 1}] (${date})\n${r.text}`;
    })
    .join('\n\n---\n\n');

  return `Found ${result.renderings.length} posts from @${params.username}\n\n${formattedRenderings}`;
}

async function getCredits(): Promise<string> {
  const result = await apiRequest<CreditsResponse>('/credits');
  return `Credits Balance: ${result.balance}\nLifetime Purchased: ${result.lifetimePurchased}\nLifetime Used: ${result.lifetimeUsed}`;
}

// Create MCP Server
const server = new Server(
  {
    name: 'context-api',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_twitter_posts',
      description:
        'Search Twitter/X posts using semantic search. Find relevant tweets based on meaning, not just keywords. Can filter by username, date range, and relevance score.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              "The search query. Use natural language to describe what you're looking for (e.g., 'thoughts on AI regulation' or 'predictions about Bitcoin price')",
          },
          username: {
            type: 'string',
            description:
              'Twitter/X username to search within (without @). If not provided, searches across all indexed users.',
          },
          platform: {
            type: 'string',
            description:
              "Platform to search. Currently only 'X' (Twitter) is supported.",
            default: 'X',
          },
          limit: {
            type: 'integer',
            description: 'Maximum number of results to return (1-50)',
            default: 10,
            minimum: 1,
            maximum: 50,
          },
          offset: {
            type: 'integer',
            description: 'Number of results to skip for pagination',
            default: 0,
            minimum: 0,
          },
          dateFrom: {
            type: 'string',
            description:
              'Filter results from this date (ISO format: YYYY-MM-DD)',
          },
          dateTo: {
            type: 'string',
            description:
              'Filter results until this date (ISO format: YYYY-MM-DD)',
          },
          minScore: {
            type: 'number',
            description:
              'Minimum relevance score (0-1). Higher values return more relevant results.',
            minimum: 0,
            maximum: 1,
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'get_user_posts',
      description:
        "Get all indexed posts from a specific Twitter/X user. Useful for browsing a user's content without a specific search query.",
      inputSchema: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: 'Twitter/X username (without @)',
          },
          platform: {
            type: 'string',
            description: "Platform. Currently only 'X' is supported.",
            default: 'X',
          },
          simple: {
            type: 'boolean',
            description: 'If true, returns simplified post data',
            default: false,
          },
        },
        required: ['username'],
      },
    },
    {
      name: 'check_credits',
      description:
        'Check your Context API credit balance and usage statistics.',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(
  CallToolRequestSchema,
  async (request: CallToolRequest) => {
    const { name, arguments: args } = request.params;

    try {
      let result: string;

      switch (name) {
        case 'search_twitter_posts': {
          const params = args as SearchParams;
          if (!params.query) {
            throw new Error('Query is required for search');
          }
          result = await searchTwitterPosts(params);
          break;
        }

        case 'get_user_posts': {
          const params = args as RenderingsParams;
          if (!params.username) {
            throw new Error('Username is required');
          }
          result = await getRenderings(params);
          break;
        }

        case 'check_credits': {
          result = await getCredits();
          break;
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      log(`Error in tool ${name}: ${errorMessage}`);

      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// Start server
async function main(): Promise<void> {
  log('Starting Context API MCP Server...');

  if (!API_KEY) {
    log(
      "WARNING: CONTEXT_API_KEY is not set. Tools will fail until it's configured.",
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);

  log('Server connected and ready');
}

main().catch((error) => {
  log(`Fatal error: ${error}`);
  process.exit(1);
});
