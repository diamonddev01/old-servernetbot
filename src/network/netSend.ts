// Sends content across the network

import { ChannelType, MessageCreateOptions } from "discord.js";
import { Client } from "../classes/Client";
import { spawnChannel } from "../classes/Channel";
import { spawnGuild } from "../classes/Guild";

export async function sendNetMessage(content: MessageCreateOptions, client: Client<true>): Promise<void> {
    const channels = await client.db.channels.all();

    for (const { value } of channels) {
        const c = client.channels.cache.get(value.id) || await client.channels.fetch(value.id).catch();
        if (!c || c.type !== ChannelType.GuildText) continue;
        const channel = await spawnChannel(c, client);
        if (!channel) continue;
        const guild = await spawnGuild(channel.guild, client);
        if (!guild) continue;

        // !!TODO!! guild_moderation_options
        const guild_moderation_options = guild.moderationData;

        // send
        channel.send(content);
    }
}