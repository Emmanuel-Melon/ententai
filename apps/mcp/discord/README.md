# Discord MCP Server

This is the Discord integration component of the Entent Model Control Protocol (MCP). It enables LLMs to interact with Discord channels and messages in real-time.

## Features

Currently exposes the following tools:
- `get-discord-messages` - Retrieves messages from specified Discord channels

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
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

3. Start the server:
```bash
npm start
```

## Integration with Claude Desktop

To use this MCP server with Claude Desktop, add the following configuration to your `claude_desktop_config.json`:

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
