// Import quick.db
import { Client, GuildTextBasedChannel } from 'discord.js';
import * as db from 'quick.db';
import { ChannelOptions, WebhookEnabledChannel } from '../types/channelOptions';
import { Warn } from '../types/channelOptions';
import { makeID } from '../functions/idMaker';

export async function NetworkSend(client: Client, message: string, otherOpts: OPTS, webhookOpts: WEBHOOKOPTS) {
    // Get the channels
    const channels: ChannelOptions[] = <ChannelOptions[]>db.get('channels') || [];

    // Check if the channel is running webhooks or not
    for (let channel of channels) {
        if (channel.webhook) {
            // Get the webhook
            const webhook = await client.fetchWebhook(channel.wh.id, channel.wh.token).catch(console.log);

            if (!webhook) {
                const warn: Warn = {
                    id: makeID().toString(),
                    reason: 'Could not get webhook',
                    time: Date.now(),
                    type: 'WebhookGetFail'
                };

                const CWarns = channel.warnings || [];
                CWarns.push(warn);

                // Update the channel
                channel.warnings = CWarns;
                channel.warns = CWarns.length;

                continue;
            };

            // Send the message
            webhook.send({
                content: message,
                ...otherOpts,
                ...webhookOpts
            }).catch(e => {
                console.error(e);

                // Create a new channel warning
                const warn: Warn = {
                    id: makeID().toString(),
                    reason: 'Webhook failed to send message',
                    time: Date.now(),
                    type: 'WebhookSendFail'
                };

                // Add the warning to the channel
                const CWarns = channel.warnings || [];
                CWarns.push(warn);

                // Update the channel
                channel.warnings = CWarns;
                channel.warns = CWarns.length;
            });

            continue;
        }

        // Send the message to the channel
        const c = <GuildTextBasedChannel>client.channels.cache.get(channel.id) || await <GuildTextBasedChannel>client.channels.fetch(channel.id).catch(console.log);

        if (!c) {
            // Create a new channel warning
            const warn: Warn = {
                id: makeID().toString(),
                reason: 'Channel failed to send load',
                time: Date.now(),
                type: 'ChannelGetFail'
            };

            // Add the warning to the channel
            const CWarns = channel.warnings || [];
            CWarns.push(warn);

            continue;
        };

        c.send({
            content: message,
            ...otherOpts
        }).catch((e) => {
            console.error(e);

            // Create a new channel warning
            const warn: Warn = {
                id: makeID().toString(),
                reason: 'Channel failed to send message',
                time: Date.now(),
                type: 'ChannelSendFail'
            };

            // Add the warning to the channel
            const CWarns = channel.warnings || [];
            CWarns.push(warn);

            // Update the channel
            channel.warnings = CWarns;
            channel.warns = CWarns.length;
        });
    }
}

interface WEBHOOKOPTS {
    avatarURL?: string;
    username?: string;
}