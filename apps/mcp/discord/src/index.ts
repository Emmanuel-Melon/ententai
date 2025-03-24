import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { Client, IntentsBitField, Partials, TextChannel, ChannelType } from "discord.js";
import { ReadableStream } from "web-streams-polyfill";
(global as any).ReadableStream = ReadableStream;

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const FEEDBACK_CHANNEL_ID = process.env.FEEDBACK_CHANNEL_ID;
const GITHUB_CHANNEL_ID = process.env.GITHUB_CHANNEL_ID;
const APP_ID = process.env.APP_ID;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const DISCORD_SERVER_ID = process.env.DISCORD_SERVER_ID;
const GENERAL_CHANNEL_ID = process.env.GENERAL_CHANNEL_ID;

const CHANNEL_MAP: Record<string, string> = {
    "github": GITHUB_CHANNEL_ID,
    "feedback": FEEDBACK_CHANNEL_ID,
    "general": GENERAL_CHANNEL_ID
};

if (!DISCORD_TOKEN || !FEEDBACK_CHANNEL_ID || !GITHUB_CHANNEL_ID || !APP_ID || !PUBLIC_KEY || !GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME || !DISCORD_SERVER_ID || !GENERAL_CHANNEL_ID) {
    throw new Error("Missing required environment variables");
}

export const createDiscordClient = () => {
    const discord = new Client({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent,
            IntentsBitField.Flags.GuildMessageReactions,
        ],
        partials: [
            Partials.Message,
            Partials.Channel,
            Partials.Reaction,
            Partials.User,
        ],
    });

    discord.on("ready", () => {
        // Discord bot is ready
    });

    return discord;
};

const discord = createDiscordClient();

export class DiscordService {
    constructor() { }

    async handleReady() {
        // Discord bot is ready
    }

    /**
     * Fetches messages from a specified channel
     * @param channelId The ID of the channel to fetch messages from
     * @param limit Optional limit on the number of messages to fetch (default: 25)
     * @returns Array of formatted messages or null if error
     */
    async fetchChannelMessages(channelId: string, limit: number = 25): Promise<any[] | null> {
        try {
            // Get the channel
            const channel = await discord.channels.fetch(channelId);

            if (!channel || channel.type !== ChannelType.GuildText) {
                return null;
            }

            const textChannel = channel as TextChannel;

            // Fetch messages
            const messages = await textChannel.messages.fetch({ limit });

            if (messages.size === 0) {
                return [];
            }

            // Sort messages by timestamp (newest first for better UX)
            const sortedMessages = Array.from(messages.values()).sort((a, b) =>
                b.createdTimestamp - a.createdTimestamp
            );

            // Format messages for return
            return sortedMessages.map(message => ({
                id: message.id,
                author: {
                    username: message.author.username,
                    id: message.author.id,
                    isBot: message.author.bot
                },
                content: message.content,
                timestamp: message.createdAt.toISOString(),
                attachments: Array.from(message.attachments.values()).map(a => a.url)
            }));
        } catch (error) {
            return null;
        }
    }

    async initialize() {
        discord.on("ready", this.handleReady.bind(this));
    }
}

const discordService = new DiscordService();

// Set up event handlers
discord.on('ready', () => discordService.handleReady());

const startDiscord = async () => {
    try {
        await discord.login(DISCORD_TOKEN);
    } catch (error) {
        // Failed to start Discord bot
    }
}

startDiscord();

// MCP Server Logic
const server = new McpServer({
    name: "discord",
    version: "1.0.0",
});

// Interface for message format
interface DiscordMessage {
    id: string;
    author: {
        username: string;
        id: string;
        isBot: boolean;
    };
    content: string;
    timestamp: string;
    attachments: string[];
}

// Register tools
server.tool(
    'get-discord-messages',
    'Get messages from a particular Discord channel',
    {
        channel: z.string().describe("The name of the Discord channel to fetch messages from (e.g., 'github', 'feedback')"),
        limit: z.number().min(1).max(100).optional().describe("Maximum number of messages to fetch (default: 25)")
    },
    async ({ channel, limit = 25 }) => {
        try {
            // Get channel ID from the channel map
            const channelId = CHANNEL_MAP[channel];

            if (!channelId) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Unknown channel name: ${channel}. Available channels: ${Object.keys(CHANNEL_MAP).join(', ')}`
                        }
                    ]
                };
            }

            // Get the channel messages
            const messages = await discordService.fetchChannelMessages(channelId, limit);

            if (messages === null) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to retrieve messages from channel ${channel}. The channel may not exist or may not be a text channel.`
                        }
                    ]
                };
            }

            if (messages.length === 0) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `No messages found in channel ${channel}`
                        }
                    ]
                };
            }

            // Get channel name for display
            let channelDisplayName = channel;
            try {
                const channelInfo = await discord.channels.fetch(channelId);
                if (channelInfo?.type === ChannelType.GuildText) {
                    channelDisplayName = (channelInfo as TextChannel).name;
                }
            } catch (error) {
                // Error fetching channel info
            }

            // Format messages for display
            const formattedMessages = messages.map((msg: DiscordMessage, index: number) => {
                const authorInfo = `${msg.author.username}${msg.author.isBot ? ' [BOT]' : ''} (${msg.author.id})`;
                const timestamp = new Date(msg.timestamp).toLocaleString();
                let messageText = `[${index + 1}] ${authorInfo} - ${timestamp}\n${msg.content}`;

                if (msg.attachments.length > 0) {
                    messageText += `\nAttachments: ${msg.attachments.join(', ')}`;
                }

                messageText += '\n---';
                return messageText;
            }).join("\n\n");

            const responseText = `Messages from #${channelDisplayName} (${channelId}):\n\n${formattedMessages}`;

            return {
                content: [
                    {
                        type: "text",
                        text: responseText
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `An error occurred while fetching messages`
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
    // console.error("Fatal error in main():", error);
    process.exit(1);
});
