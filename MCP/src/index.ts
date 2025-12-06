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
interface SearchRelevantParams {
  query: string;
  username: string;
  platform?: string;
  [key: string]: unknown;
}

interface RenderingsQueryParams {
  username: string;
  platform?: string;
  simple?: boolean;
  limit?: number;
  offset?: number;
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
  global_doc_id: string;
  global_user_id: string;
  rendering: string;
}

interface RelevantRendering extends Rendering {
  score?: number;
}

interface SearchRelevantResult {
  count: number;
  creditsCharged: number;
  creditsRemaining: number;
  renderings: RelevantRendering[];
}

interface QueryRenderingsResult {
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
async function searchRelevantPostRenderings(params: SearchRelevantParams): Promise<string> {
  const result = await apiRequest<SearchRelevantResult>('/v1/search', 'POST', params);

  const count = safeNumber(result.count, 0);
  const renderings = safeArray<RelevantRendering>(result.renderings);

  if (count === 0 || renderings.length === 0) {
    return `No results found for query: "${params.query}"${
      params.username ? ` from posts of X user @${params.username}` : ''
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

async function getAllUserPostRenderings(params: RenderingsQueryParams): Promise<string> {
  const queryParams = new URLSearchParams({
    username: params.username,
    ...(params.platform && { platform: params.platform }),
    ...(params.limit !== undefined && { limit: String(params.limit) }),
    ...(params.offset !== undefined && { offset: String(params.offset) }),
  });

  const endpoint = params.simple
    ? `/v1/renderings/simple?${queryParams.toString()}`
    : `/v1/renderings?${queryParams.toString()}`;

  const result = await apiRequest<QueryRenderingsResult>(endpoint);

  const count = safeNumber(result.count, 0);
  const renderings = safeArray<Rendering>(result.renderings);

  if (renderings.length === 0) {
    return `No posts found of X user @${params.username}`;
  }

  // Cap at 1024 results to prevent context overflow
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
const SERVER_INSTRUCTIONS = `This MCP server provides access to contextualized renderings (XML descriptions) of 
Twitter/X posts. The contextualization allows for: 
 * More high-quality retrieval of relevant information from the posts,
 * More high-quality analysis of insights, trends, topics, etc. from the posts
 
The contextualization is achieved by adding the following information to the XML description of each post:
 * Descriptions of referenced posts and images
 * When the post is a reply in a conversation, the conversation or a summary of the conversation.
 * Metadata about the post (e.g., creation data, post ID, etc.)
 
Note that no descriptions are added yet related to referenced videos or links (external sites).
 
The XML structure helps to describe the relationship between posts and their context.   
 
Using the available tools has a cost associated with it, with each call the credit balance is updated.

## Available Tools:
- **search_relevant_posts**: 
  Semantic search of contextualized post renderings of a certain Twitter/X user, based on a 
  natural language queries like "What does @visionscaper think about the future of AI?".
  
- **get_all_user_posts**: Retrieve all contextualized post renderings of a specific Twitter/X user. 
  This is useful to analyse the posts for insights, trends and topics over all posts.
  
- **check_credits**: View your API credit balance and usage.

## Usage Tips:
- Searches are semantic (meaning-based), not keyword-based. Describe what you're looking for in natural language.
- Each search consumes API credits. Use check_credits to monitor your balance.
- Currently only the Twitter/X platform is supported.`;

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
      name: 'search_relevant_posts',
      description:
        'Semantic search of contextualized post renderings of a certain Twitter/X user, based on a ' +
        'natural language query. Twitter/X username and platform (= X) must be provided. \n' +
        'Use this tool to find specific posts, relevant to the query.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              'The search query. Use natural language to describe what you\'re looking for. For instance: \n' +
              ' * \"What does @elonmusk think about AI regulation?\" or ' +
              ' * \"What is @hosseeb\'s prediction on the price of Bitcoin?\"',
          },
          username: {
            type: 'string',
            description:
              'Twitter/X username to search within (without @). This argument is required.',
          },
          platform: {
            type: 'string',
            description:
              "Platform to search. Currently only 'X' (Twitter) is supported.",
            default: 'X',
          },
        },
        required: ['query', 'username'],
      },
    },
    {
      name: 'get_all_user_posts',
      description:
        'Retrieve all contextualized post renderings of a specific Twitter/X user. ' +
        'This tool is useful when you need to analyse posts for insights, trends and topics over all posts. \n' +
        'For instance, to answer queries such as: \n' +
        ' * \"What topics does @elonmusk tweet most about?\"\n' +
        ' * \"What has recently been the mood of @elonmusk?\"',
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
            description: 'If true, returns simplified post renderings, ' +
              'without metadata such as creation date, post ID, etc.',
            default: false,
          },
          limit: {
            type: 'number',
            description: 'Max results to return (default: all)',
          },
          offset: {
            type: 'number',
            description: 'Pagination offset',
            default: 0,
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
        case 'search_relevant_posts': {
          const params = args as SearchRelevantParams;
          if (!params.username) {
            throw new Error('Username is required');
          }
          if (!params.query) {
            throw new Error('Query is required for search');
          }
          result = await searchRelevantPostRenderings(params);
          break;
        }

        case 'get_all_user_posts': {
          const params = args as RenderingsQueryParams;
          if (!params.username) {
            throw new Error('Username is required');
          }
          result = await getAllUserPostRenderings(params);
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
