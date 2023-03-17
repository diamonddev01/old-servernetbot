import { TextChannel } from "discord.js";
import { RawGuildChannelData } from "discord.js/typings/rawDataTypes";
import { ConnectionDetails, DBChannel } from "../types/database/channel";
import { Client } from "./Client";
import { compressDBChannel } from "../functions/compressDBItems";

export async function spawnChannel(discord_channel: TextChannel, client: Client): Promise<Channel | null> {
    const connection_data = await client.db.channels.get(discord_channel.id);
    if (!connection_data) return null;
    return new Channel(discord_channel, connection_data);
}

export class Channel extends TextChannel implements DBChannel {
    public readonly connection_details: ConnectionDetails;
    public readonly guild_id: string;
    public message_count: number;

    public lastFetchDate: null | number = null;
    public lastSaveDate: null | number = null;

    constructor(discord_channel: TextChannel, data: DBChannel) {
        super(discord_channel.guild, discord_channel.toJSON() as RawGuildChannelData, discord_channel.client);
        this.guild_id = this.guildId;
        this.connection_details = data.connection_details;
        this.message_count = data.message_count;
    }

    async get(client: Client): Promise<this> {
        const channel = await client.db.channels.get(this.id);
        if (!channel) return this;

        this.message_count = channel.message_count;
        this.lastFetchDate = Date.now();
        return this;
    }

    async save(client: Client): Promise<this> {
        const compressed = compressDBChannel(this);
        client.db.channels.set(compressed);
        return this;
    }
}