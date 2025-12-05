
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import {
  ListToolsResultSchema,
  CallToolResultSchema,
} from '@modelcontextprotocol/sdk/types.js';

async function main() {
  console.log('Starting MCP Test Client...');

  // 1. Setup Transport to spawn the server process
  // We run the TS file directly using ts-node or similar, or the built JS
  // Adjust the command if you want to run the compiled js instead
  const transport = new StdioClientTransport({
    command: 'node',
    args: [
      '--loader',
      'ts-node/esm',
      '--no-warnings',
      'src/index.ts'
    ],
    env: {
      ...process.env,
      // Ensure API KEY is set here or in your environment
      CONTEXT_API_KEY: process.env.CONTEXT_API_KEY || 'your-test-api-key',
    }
  });

  const client = new Client(
    {
      name: 'test-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  try {
    // 2. Connect to server
    await client.connect(transport);
    console.log('Connected to server.');

    // 3. List Tools
    console.log('\n--- Listing Tools ---');
    const tools = await client.request(
      { method: 'tools/list' },
      ListToolsResultSchema,
    );
    console.log('Available tools:', tools.tools.map((t) => t.name).join(', '));

    // 4. Test a specific tool (e.g., search_relevant_posts)
    console.log('\n--- Testing search_relevant_posts ---');
    try {
      const result = await client.request(
        {
          method: 'tools/call',
          params: {
            name: 'search_relevant_posts',
            arguments: {
              query: 'What does @elonmusk think about AI?',
              username: 'elonmusk',
            },
          },
        },
        CallToolResultSchema,
      );

      // @ts-ignore
      if (result.content && result.content[0]) {
        // @ts-ignore
        console.log('Result:', result.content[0].text);
      } else {
        console.log('Result structure unexpected:', result);
      }

    } catch (error: any) {
      console.error('Tool execution failed (expected if API key is invalid):', error.message);
    }

  } catch (error) {
    console.error('Client error:', error);
  } finally {
    await client.close();
  }
}

main();