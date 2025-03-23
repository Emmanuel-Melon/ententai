# Entent

Entent is an open-source platform that enables LLMs to access and interact with real-time API data while providing intuitive automation triggers through emoji reactions.

## Project Structure

The project has been broken down into several components:

- `mcp/` - Contains implementation of various Model Control Protocol (MCP) servers
  - `discord/` - MCP server for Discord integration
  - Other service integrations (GitHub, Calendar, etc.)
- Additional components (coming soon)

## Model Control Protocol (MCP)

The Model Control Protocol (MCP) is the core of Entent, enabling LLMs to access real-time data through standardized APIs. Each MCP server exposes specific tools that LLMs can use to interact with different services.

### Discord MCP Server

The Discord MCP server provides tools for LLMs to interact with Discord channels and messages. Currently, it exposes:

- `get-discord-messages` - Retrieves messages from specified channels

Configuration is managed through environment variables:
```
DISCORD_TOKEN=your_discord_bot_token
FEEDBACK_CHANNEL_ID=your_feedback_channel_id
GITHUB_CHANNEL_ID=your_github_channel_id
APP_ID=your_app_id
PUBLIC_KEY=your_public_key
GITHUB_TOKEN=your_github_token
REPO_OWNER=your_repo_owner
REPO_NAME=your_repo_name
DISCORD_SERVER_ID=your_discord_server_id
GENERAL_CHANNEL_ID=your_general_channel_id
```

This is a skeleton implementation to demonstrate how MCP works. In the future, a management console will be deployed to simplify integration and workflow configuration.

## Running with Claude Desktop

To use Entent MCP servers with Claude Desktop:

1. Install the latest version of Claude for Desktop from [the official website](https://claude.ai/desktop)
2. Make sure it's updated to the latest version
3. Configure Claude for Desktop for MCP servers:

   a. Open your Claude for Desktop configuration at:
   ```
   ~/Library/Application Support/Claude/claude_desktop_config.json
   ```
   (Create the file if it doesn't exist)

   b. Add your MCP servers configuration:
   ```json
   {
     "mcpServers": {
       "discord": {
         "command": "uv",
         "args": [
           "--directory",
           "/ABSOLUTE/PATH/TO/PARENT/FOLDER/discord",
           "run",
           "discord.js"
         ]
       }
     }
   }
   ```

4. Save the file and restart Claude for Desktop

## Development Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables for the discord server (see above)

3. Run the discord MCP server:
   ```
   node mcp/discord/discord.js
   ```

The server will start and be available for LLMs to connect and use its tools.