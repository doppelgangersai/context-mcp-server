# Context API MCP Server
MCP (Model Context Protocol) server to access the doppelgangers.ai Social Media Context API.

This MCP server provides access to contextualized renderings (XML descriptions) of
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

## Features

- **search_relevant_posts**:
  Semantic search of contextualized post renderings of a certain Twitter/X user, based on a
  natural language queries like "What does @visionscaper think about the future of AI?".

- **get_all_user_posts**: Retrieve all contextualized post renderings of a specific Twitter/X user.
  This is useful to analyse the posts for insights, trends and topics over all posts.

- **check_credits**: View your API credit balance and usage.

## Installation

### 1. Get your API Key

Request an API key at [dev.doppelgangers.ai:3003](https://dev.doppelgangers.ai:3003) or via the API:

```bash
curl -X POST https://dev.doppelgangers.ai:3003/auth/request-key \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com", "name": "Your Name"}'
```

### 2. Configure Your Client

Add the following config to your MCP client:

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

### MCP Client configuration

<details>
<summary>Amp</summary>

Follow [Amp's MCP guide](https://ampcode.com/manual#mcp) and use the config provided above. You can also install the Context API MCP server using the CLI:

```bash
amp mcp add context-api -- npx context-api-mcp
```

</details>

<details>
<summary>Antigravity</summary>

To use the Context API MCP server follow the instructions from [Antigravity's docs](https://antigravity.google/docs/mcp) to install a custom MCP server. Add the following config to the MCP servers config:

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

> **Note**: If you encounter an "EOF" error, try using the absolute path to `npx` (e.g., `/usr/local/bin/npx`) or invoke the CLI script directly via `node`.

</details>

<details>
<summary>Claude Code</summary>

Use the Claude Code CLI to add the Context API MCP server ([guide](https://docs.anthropic.com/en/docs/claude-code/mcp)):

```bash
claude mcp add context-api npx context-api-mcp
```

</details>

<details>
<summary>Claude Desktop</summary>

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

After updating the configuration, restart Claude Desktop for changes to take effect.

</details>

<details>
<summary>Cline</summary>

Follow [Cline's MCP guide](https://docs.cline.bot/mcp/configuring-mcp-servers) and use the config provided above.

</details>

<details>
<summary>Codex</summary>

Follow the [configure MCP guide](https://github.com/openai/codex/blob/main/docs/advanced.md#model-context-protocol-mcp) using the standard config from above. You can also install the Context API MCP server using the Codex CLI:

```bash
codex mcp add context-api -- npx context-api-mcp
```

</details>

<details>
<summary>Copilot CLI</summary>

Start Copilot CLI:

```
copilot
```

Start the dialog to add a new MCP server by running:

```
/mcp add
```

Configure the following fields and press `CTRL+S` to save the configuration:

- **Server name:** `context-api`
- **Server Type:** `[1] Local`
- **Command:** `npx -y context-api-mcp`

</details>

<details>
<summary>Copilot / VS Code</summary>

Follow the MCP install [guide](https://code.visualstudio.com/docs/copilot/chat/mcp-servers#_add-an-mcp-server), with the standard config from above. You can also install the Context API MCP server using the VS Code CLI:

```bash
code --add-mcp '{"name":"context-api","command":"npx","args":["-y","context-api-mcp"],"env":{"CONTEXT_API_KEY":"your-api-key-here"}}'
```

</details>

<details>
<summary>Cursor</summary>

1. Open **Cursor Settings**
2. Go to **Features** > **MCP**
3. Click **+ Add New MCP Server**
4. Enter the following details:
   - **Name**: Context API
   - **Type**: `command`
   - **Command**: `npx -y context-api-mcp`
5. Add your API key in the environment variables section if supported, or ensure it's set in your system environment.

</details>

<details>
<summary>Factory CLI</summary>

Use the Factory CLI to add the Context API MCP server ([guide](https://docs.factory.ai/cli/configuration/mcp)):

```bash
droid mcp add context-api "npx -y context-api-mcp"
```

</details>

<details>
<summary>Gemini CLI</summary>

Install the Context API MCP server using the Gemini CLI.

**Project wide:**

```bash
gemini mcp add context-api npx context-api-mcp
```

**Globally:**

```bash
gemini mcp add -s user context-api npx context-api-mcp
```

Alternatively, follow the [MCP guide](https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md#how-to-set-up-your-mcp-server) and use the standard config from above.

</details>

<details>
<summary>Gemini Code Assist</summary>

Follow the [configure MCP guide](https://cloud.google.com/gemini/docs/codeassist/use-agentic-chat-pair-programmer#configure-mcp-servers) using the standard config from above.

</details>

<details>
<summary>JetBrains AI Assistant & Junie</summary>

Go to `Settings | Tools | AI Assistant | Model Context Protocol (MCP)` -> `Add`. Use the config provided above.
The same way context-api-mcp can be configured for JetBrains Junie in `Settings | Tools | Junie | MCP Settings` -> `Add`. Use the config provided above.

</details>

<details>
<summary>Kiro</summary>

In **Kiro Settings**, go to `Configure MCP` > `Open Workspace or User MCP Config` > Use the configuration snippet provided above.

Or, from the IDE **Activity Bar** > `Kiro` > `MCP Servers` > `Click Open MCP Config`. Use the configuration snippet provided above.

</details>

<details>
<summary>Qoder</summary>

In **Qoder Settings**, go to `MCP Server` > `+ Add` > Use the configuration snippet provided above.

Alternatively, follow the [MCP guide](https://docs.qoder.com/user-guide/chat/model-context-protocol) and use the standard config from above.

</details>

<details>
<summary>Qoder CLI</summary>

Install the Context API MCP server using the Qoder CLI ([guide](https://docs.qoder.com/cli/using-cli#mcp-servsers)):

**Project wide:**

```bash
qodercli mcp add context-api -- npx context-api-mcp
```

**Globally:**

```bash
qodercli mcp add -s user context-api -- npx context-api-mcp
```

</details>

<details>
<summary>Visual Studio</summary>

Follow the [Visual Studio MCP documentation](https://learn.microsoft.com/en-us/visualstudio/ide/mcp-servers?view=visualstudio) to add the server using the standard config from above.

</details>

<details>
<summary>Warp</summary>

Go to `Settings | AI | Manage MCP Servers` -> `+ Add` to [add an MCP Server](https://docs.warp.dev/knowledge-and-collaboration/mcp#adding-an-mcp-server). Use the config provided above.

</details>

<details>
<summary>Windsurf</summary>

Follow the [configure MCP guide](https://docs.windsurf.com/windsurf/cascade/mcp#mcp-config-json) using the standard config from above.

</details>

<details>
<summary>Zed</summary>

Edit your Zed settings file (`settings.json`):

```json
{
  "mcp": {
    "servers": {
      "context-api": {
        "command": "npx",
        "args": ["-y", "context-api-mcp"],
        "env": {
          "CONTEXT_API_KEY": "your-api-key-here"
        }
      }
    }
  }
}
```

</details>

## Usage Examples

Once configured, you can use the tools in your MCP client:

### Search Relevant Posts

Semantic search of contextualized post renderings of a certain Twitter/X user, based on a natural language query.

```
What does @elonmusk think about AI regulation?
```

### Get All User Posts
Retrieve all contextualized post renderings of a specific Twitter/X user. 
This tool is useful when you need to analyse posts for insights, trends and topics over all posts.

```
What has recently been the mood of @elonmusk?
```

### Check Credits

Check your Context API credit balance and usage statistics.

```
How many API credits do I have left?
```

## Tool Reference

### search_relevant_posts

### search_relevant_posts

Semantic search of contextualized post renderings of a certain Twitter/X user, based on a natural language query. 
Use this tool to find specific posts, relevant to the query.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | Natural language search query |
| username | string | Yes | Twitter/X username (without @) |
| platform | string | No | Platform (default: "X") |

### get_all_user_posts

Retrieve all contextualized post renderings of a specific Twitter/X user. 
This tool is useful when you need to analyse posts for insights, trends and topics over all posts.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| username | string | Yes | Twitter/X username (without @) |
| platform | string | No | Platform (default: "X") |
| simple | boolean | No | If true, returns simplified post renderings without metadata |
| limit | number | No | Max results to return (default: all) |
| offset | number | No | Pagination offset (default: 0) |

### check_credits

Check your Context API credit balance and usage statistics. No parameters required.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| CONTEXT_API_KEY | Yes | - | Your Context API key |
| CONTEXT_API_URL | No | https://dev.doppelgangers.ai:3003 | API base URL (optional) |

## Troubleshooting

### Server not showing in Client

1. Ensure you have Node.js 18+ installed
2. Check that `CONTEXT_API_KEY` is set correctly
3. Restart your client completely

### API errors

Check the client logs for detailed error messages. The server outputs to stderr to avoid interfering with the MCP protocol.

### Test the server manually

```bash
CONTEXT_API_KEY=your-key npx context-api-mcp
```

## Development

To run the server from source:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Run the server:
   ```bash
   node dist/index.js
   ```

## Links

- [Context API Documentation](https://dev.doppelgangers.ai:3003/docs)
- [npm package](https://www.npmjs.com/package/context-api-mcp)
