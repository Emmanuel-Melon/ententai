# Entent UI

The management console for Entent MCP servers and automations. Built with Next.js 14, React 18, Radix UI, and TailwindCSS.

## Features

- Dashboard for monitoring MCP servers
- Automation workflow management
- Real-time server status monitoring
- Configuration management for MCP servers
- Integration settings

## Development Setup

1. Make sure you have Node.js 20 installed:
```bash
nvm install 20
nvm use 20
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
apps/ui/
├── src/
│   ├── app/          # Next.js app router
│   ├── components/   # Reusable UI components
│   ├── lib/         # Utilities and helpers
│   └── types/       # TypeScript type definitions
├── public/          # Static assets
└── tailwind.config.js
```

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file with the following variables:

```
# API URLs
NEXT_PUBLIC_DISCORD_MCP_URL=http://localhost:3000
NEXT_PUBLIC_GITHUB_MCP_URL=http://localhost:3001
```
