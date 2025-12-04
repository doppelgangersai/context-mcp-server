# Context API MCP Server

MCP (Model Context Protocol) server for Claude Desktop integration with Context API - semantic search for Twitter/X posts.

## Features

- **search_twitter_posts** - Semantic search across Twitter/X posts
- **get_user_posts** - Get all indexed posts from a specific user
- **check_credits** - Check your API credit balance

## Installation

### 1. Get your API Key

Request an API key at [dev.doppelgangers.ai:3003](https://dev.doppelgangers.ai:3003) or via the API:

```bash
curl -X POST https://dev.doppelgangers.ai:3003/auth/request-key \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com", "name": "Your Name"}'
```

### 2. Configure Claude Desktop

Edit your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add the Context API MCP server:

```json
{
  "mcpServers": {
    "context-api": {
      "command": "npx",
      "args": ["-y", "context-api-mcp"],
      "env": {
        "CONTEXT_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Replace `your-api-key-here` with your Context API key.

### 3. Restart Claude Desktop

After updating the configuration, restart Claude Desktop for changes to take effect.

## Usage Examples

Once configured, you can use the tools in Claude Desktop:

### Search Twitter Posts

```
Search for tweets about AI regulation from @elonmusk
```

Claude will use the `search_twitter_posts` tool with semantic search.

### Get User Posts

```
Show me recent posts from @naval
```

Claude will use the `get_user_posts` tool.

### Check Credits

```
How many API credits do I have left?
```

Claude will use the `check_credits` tool.

## Tool Reference

### search_twitter_posts

Search Twitter/X posts using semantic search.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | Natural language search query |
| username | string | No | Twitter username to filter by |
| platform | string | No | Platform (default: "X") |
| limit | integer | No | Max results (1-50, default: 10) |
| offset | integer | No | Pagination offset |
| dateFrom | string | No | Filter from date (YYYY-MM-DD) |
| dateTo | string | No | Filter to date (YYYY-MM-DD) |
| minScore | number | No | Minimum relevance score (0-1) |

### get_user_posts

Get all indexed posts from a specific user.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| username | string | Yes | Twitter username (without @) |
| platform | string | No | Platform (default: "X") |
| simple | boolean | No | Return simplified data |

### check_credits

Check your API credit balance. No parameters required.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| CONTEXT_API_KEY | Yes | - | Your Context API key |
| CONTEXT_API_URL | No | https://dev.doppelgangers.ai:3003 | API base URL (optional) |

## Troubleshooting

### Server not showing in Claude Desktop

1. Ensure you have Node.js 18+ installed
2. Check that `CONTEXT_API_KEY` is set in the env section
3. Restart Claude Desktop completely (quit and reopen)

### API errors

Check the Claude Desktop logs for detailed error messages. The server outputs to stderr to avoid interfering with the MCP protocol.

### Test the server manually

```bash
CONTEXT_API_KEY=your-key npx context-api-mcp
```

The server will output log messages to stderr.

## Links

- [Context API Documentation](https://dev.doppelgangers.ai:3003/docs)
- [npm package](https://www.npmjs.com/package/context-api-mcp)
