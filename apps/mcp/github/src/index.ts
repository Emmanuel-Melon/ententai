import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Octokit } from '@octokit/rest';

// Environment variables validation
const requiredEnvVars = ['GITHUB_TOKEN', 'REPO_OWNER', 'REPO_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const server = new McpServer({
  name: 'github',
  version: '1.0.0'
});

// Health check tool
server.addTool(
  'health',
  {
    description: 'Check if the GitHub MCP server is healthy',
    parameters: {}
  },
  async () => {
    try {
      // Test GitHub API connection
      await octokit.rest.users.getAuthenticated();

      return {
        content: [
          {
            type: 'text',
            text: 'GitHub MCP server is healthy and connected to GitHub API'
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `GitHub MCP server health check failed: ${error.message}`
          }
        ]
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  process.exit(1);
});
