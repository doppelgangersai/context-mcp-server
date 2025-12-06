import { createPaidMcpHandler } from "x402-mcp";
import z from "zod";
import { facilitator } from "@coinbase/x402";
import { env } from "@/lib/env";
import { getOrCreateSellerAccount } from "@/lib/accounts";

// Context API configuration
const CONTEXT_API_URL = process.env.CONTEXT_API_URL || "https://dev.doppelgangers.ai:3003";
const CONTEXT_API_KEY = process.env.CONTEXT_API_KEY || "";

interface SearchResult {
  count: number;
  creditsCharged: number;
  creditsRemaining: number;
  renderings: Array<{ rendering?: string; score?: number }>;
}

interface RenderingsResult {
  count: number;
  renderings: Array<{ rendering?: string }>;
}

interface CreditsResult {
  balance: number;
  lifetimePurchased: number;
  lifetimeUsed: number;
}

async function contextApiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" = "GET",
  body?: Record<string, unknown>
): Promise<T> {
  const url = `${CONTEXT_API_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      "X-API-Key": CONTEXT_API_KEY,
      "Content-Type": "application/json",
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

let handler: ReturnType<typeof createPaidMcpHandler> | null = null;

async function getHandler() {
  if (!handler) {
    const sellerAccount = await getOrCreateSellerAccount();
    handler = createPaidMcpHandler(
      (server) => {
        server.paidTool(
          "get_random_number",
          "Get a random number between two numbers",
          { price: 0.001 },
          {
            min: z.number().int(),
            max: z.number().int(),
          },
          {},
          async (args) => {
            const randomNumber =
              Math.floor(Math.random() * (args.max - args.min + 1)) + args.min;
            return {
              content: [{ type: "text", text: randomNumber.toString() }],
            };
          }
        );
        server.paidTool(
          "add",
          "Add two numbers",
          { price: 0.001 },
          {
            a: z.number().int(),
            b: z.number().int(),
          },
          {},
          async (args) => {
            const result = args.a + args.b;
            return {
              content: [{ type: "text", text: result.toString() }],
            };
          }
        );
        server.tool(
          "hello-remote",
          "Receive a greeting",
          {
            name: z.string(),
          },
          async (args) => {
            return { content: [{ type: "text", text: `Hello ${args.name}` }] };
          }
        );

        // Context API - Search Twitter/X posts (paid)
        server.paidTool(
          "search_twitter_posts",
          "Semantic search for Twitter/X posts. Find relevant tweets based on meaning, not just keywords.",
          { price: 0.01 },
          {
            query: z.string().describe("Natural language search query"),
            username: z.string().optional().describe("Twitter username to filter (without @)"),
            platform: z.string().default("X").optional().describe("Platform (currently only X)"),
            limit: z.number().int().min(1).max(50).default(10).optional(),
            offset: z.number().int().min(0).default(0).optional(),
            dateFrom: z.string().optional().describe("Filter from date (YYYY-MM-DD)"),
            dateTo: z.string().optional().describe("Filter until date (YYYY-MM-DD)"),
            minScore: z.number().min(0).max(1).optional().describe("Minimum relevance score"),
          },
          {},
          async (args) => {
            const result = await contextApiRequest<SearchResult>("/v1/search", "POST", args);
            const formatted = result.renderings
              .map((r, i) => `[${i + 1}] (Score: ${((r.score || 0) * 100).toFixed(1)}%)\n${r.rendering || "[No content]"}`)
              .join("\n\n---\n\n");
            return {
              content: [{
                type: "text",
                text: `Found ${result.count} results. Credits used: ${result.creditsCharged}\n\n${formatted}`,
              }],
            };
          }
        );

        // Context API - Get user posts (paid)
        server.paidTool(
          "get_user_posts",
          "Get all indexed posts from a specific Twitter/X user.",
          { price: 0.01 },
          {
            username: z.string().describe("Twitter username (without @)"),
            platform: z.string().default("X").optional(),
            simple: z.boolean().default(false).optional(),
          },
          {},
          async (args) => {
            const endpoint = args.simple
              ? `/v1/renderings/simple?username=${encodeURIComponent(args.username)}${args.platform ? `&platform=${args.platform}` : ""}`
              : `/v1/renderings?username=${encodeURIComponent(args.username)}${args.platform ? `&platform=${args.platform}` : ""}`;
            const result = await contextApiRequest<RenderingsResult>(endpoint);
            const formatted = result.renderings
              .slice(0, 50)
              .map((r, i) => `[${i + 1}]\n${r.rendering || "[No content]"}`)
              .join("\n\n---\n\n");
            return {
              content: [{
                type: "text",
                text: `Found ${result.count} posts from @${args.username}\n\n${formatted}`,
              }],
            };
          }
        );

        // Context API - Check credits (free)
        server.tool(
          "check_credits",
          "Check your Context API credit balance.",
          {},
          async () => {
            const result = await contextApiRequest<CreditsResult>("/credits");
            return {
              content: [{
                type: "text",
                text: `Balance: ${result.balance}\nLifetime Purchased: ${result.lifetimePurchased}\nLifetime Used: ${result.lifetimeUsed}`,
              }],
            };
          }
        );
      },
      {
        serverInfo: {
          name: "test-mcp",
          version: "0.0.1",
        },
      },
      {
        recipient: sellerAccount.address,
        facilitator,
        network: env.NETWORK,
      }
    );
  }
  return handler;
}

export async function GET(req: Request) {
  const handler = await getHandler();
  return handler(req);
}

export async function POST(req: Request) {
  const handler = await getHandler();
  return handler(req);
}
