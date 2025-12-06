# Context API x402 Server

Paid MCP server for Context API — semantic search for Twitter/X posts with crypto payments via [x402](https://x402.org) protocol.

## Features

- **Paid Tools**: Pay-per-request semantic search via cryptocurrency (USDC)
- **search_twitter_posts** ($0.01) — Semantic search across indexed tweets
- **get_user_posts** ($0.01) — Get all posts from a specific user
- **check_credits** (free) — Check your Context API balance
- Secure server-managed wallets via Coinbase CDP
- Testnet support for development

## Tech Stack

- [Next.js](https://nextjs.org/)
- [x402](https://x402.org) — HTTP-native payment protocol
- [Coinbase CDP](https://docs.cdp.coinbase.com/) — Wallet management
- [Context API](https://dev.doppelgangers.ai:3003) — Twitter/X semantic search

## Getting Started

```bash
cd x402-ai-starter
pnpm install
```

## Environment Variables

Create `.env.local` with:

```env
# Coinbase CDP (from https://portal.cdp.coinbase.com)
CDP_API_KEY_ID=your_key_id
CDP_API_KEY_SECRET=your_secret
CDP_WALLET_SECRET=your_wallet_secret

# Network: base-sepolia (testnet) or base (mainnet)
NETWORK=base-sepolia

# Context API
CONTEXT_API_URL=https://dev.doppelgangers.ai:3003
CONTEXT_API_KEY=your_context_api_key
```

## Running Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## MCP Endpoint

The paid MCP server is available at:

```text
http://localhost:3000/mcp
```

## Paid Tools

| Tool | Price | Description |
|------|-------|-------------|
| `search_twitter_posts` | $0.01 | Semantic search for tweets by meaning |
| `get_user_posts` | $0.01 | Get all indexed posts from a user |
| `check_credits` | Free | Check Context API credit balance |

## Testing Payments

By default uses `base-sepolia` testnet with fake USDC. The app auto-requests faucet funds when low.

Manual faucet: [Coinbase CDP Faucet](https://portal.cdp.coinbase.com/products/faucet?token=USDC&network=base-sepolia)

## Production

1. Deploy to Vercel or your server
2. Set `NETWORK=base` for mainnet
3. Fund your wallet with real USDC

## Related

- [Context API MCP Server](../) — Free MCP server for Claude Desktop
- [x402 Protocol](https://x402.org) — Payment protocol documentation
