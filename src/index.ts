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
  process.env.CONTEXT_API_URL || 'https://dev.doppelgangers.ai:3003';
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

interface Rendering {
  _job_id?: string;
  _store_date?: string;
  global_doc_id?: string;
  global_user_id?: string;
  rendering?: string;
}

interface SearchRendering extends Rendering {
  score?: number;
}

interface SearchResult {
  count: number;
  creditsCharged: number;
  creditsRemaining: number;
  renderings: SearchRendering[];
}

interface RenderingsResult {
  count: number;
  renderings: Rendering[];
}

// Logger (use stderr to not interfere with MCP protocol)
function log(message: string): void {
  stderr.write(`[context-api-mcp] ${message}\n`);
}

// Safe formatters for potentially missing/invalid data
function formatScore(score: unknown): string {
  if (score === undefined || score === null) {
    return '[Unknown score]';
  }
  const numScore = Number(score);
  if (isNaN(numScore)) {
    return '[Unknown score]';
  }
  return `${(numScore * 100).toFixed(1)}%`;
}

function formatRendering(rendering: unknown): string {
  if (rendering === undefined || rendering === null) {
    return '[No content]';
  }
  const str = String(rendering).trim();
  if (str === '' || str === '[No content]') {
    return '[No content]';
  }
  return str;
}

function safeNumber(value: unknown, fallback: number): number {
  if (value === undefined || value === null) {
    return fallback;
  }
  const num = Number(value);
  return isNaN(num) ? fallback : num;
}

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
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

  const count = safeNumber(result.count, 0);
  const renderings = safeArray<SearchRendering>(result.renderings);

  if (count === 0 || renderings.length === 0) {
    return `No results found for query: "${params.query}"${
      params.username ? ` from @${params.username}` : ''
    }`;
  }

  const creditsCharged = safeNumber(result.creditsCharged, 0);
  const creditsRemaining = safeNumber(result.creditsRemaining, 0);

  const formattedResults = renderings
    .map((r, i) => {
      const score = formatScore(r.score);
      const content = formatRendering(r.rendering);
      return `[${i + 1}] (Score: ${score})\n${content}`;
    })
    .join('\n\n---\n\n');

  return `Found ${count} results (showing ${renderings.length})\nCredits used: ${creditsCharged}, Remaining: ${creditsRemaining}\n\n${formattedResults}`;
}

async function getRenderings(params: RenderingsParams): Promise<string> {
  const endpoint = params.simple
    ? `/v1/renderings/simple?username=${encodeURIComponent(params.username)}${
        params.platform ? `&platform=${params.platform}` : ''
      }`
    : `/v1/renderings?username=${encodeURIComponent(params.username)}${
        params.platform ? `&platform=${params.platform}` : ''
      }`;

  const result = await apiRequest<RenderingsResult>(endpoint);

  const count = safeNumber(result.count, 0);
  const renderings = safeArray<Rendering>(result.renderings);

  if (renderings.length === 0) {
    return `No posts found for @${params.username}`;
  }

  const slicedRenderings = renderings.slice(0, 1024);
  const formattedRenderings = slicedRenderings
    .map((r, i) => {
      const content = formatRendering(r.rendering);
      return `[${i + 1}]\n${content}`;
    })
    .join('\n\n---\n\n');

  return `Found ${count} posts from @${params.username} (showing ${slicedRenderings.length})\n\n${formattedRenderings}`;
}

async function getCredits(): Promise<string> {
  const result = await apiRequest<CreditsResponse>('/credits');
  return `Credits Balance: ${result.balance}\nLifetime Purchased: ${result.lifetimePurchased}\nLifetime Used: ${result.lifetimeUsed}`;
}

// Server instructions for LLM
const SERVER_INSTRUCTIONS = `This MCP server provides semantic search capabilities for Twitter/X posts through the Context API.

## Available Tools:
- **search_twitter_posts**: Semantic search across indexed tweets. Use natural language queries like "opinions about AI safety" rather than keywords. Supports filtering by username, date range, and relevance score.
- **get_user_posts**: Retrieve all indexed posts from a specific Twitter/X user.
- **check_credits**: View your API credit balance and usage.

## Usage Tips:
- Searches are semantic (meaning-based), not keyword-based. Describe what you're looking for in natural language.
- Use the username filter to focus on a specific person's tweets.
- Higher minScore values (0.7+) return more relevant but fewer results.
- Each search consumes API credits. Use check_credits to monitor your balance.
- Currently only Twitter/X platform is supported.`;

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
    instructions: SERVER_INSTRUCTIONS,
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
