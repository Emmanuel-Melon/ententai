# GitHub MCP Server

This is the GitHub Model Control Protocol (MCP) server for Entent. It provides tools for LLMs to interact with GitHub repositories and issues.

## Setup

1. Copy `.env.example` to `.env` and fill in your GitHub credentials:
```bash
cp .env.example .env
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript code:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

## Docker

To run with Docker:

1. Build the image:
```bash
docker build -t entent-github-mcp .
```

2. Run the container:
```bash
docker run -p 3001:3001 --env-file .env entent-github-mcp
```

## Environment Variables

- `GITHUB_TOKEN`: Your GitHub personal access token
- `REPO_OWNER`: Owner of the target repository
- `REPO_NAME`: Name of the target repository
- `PORT`: Server port (default: 3001)
