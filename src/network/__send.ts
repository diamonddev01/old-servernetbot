// Import quick.db
import { AnyComponent, Attachment, Client, Component, Embed, GuildTextBasedChannel, Sticker } from 'discord.js';
import * as db from 'quick.db';
import { ChannelOptions, WebhookEnabledChannel } from '../types/channelOptions';
import { Warn } from '../types/channelOptions';
import { makeID } from '../functions/idMaker';

export async function NetworkSend(client: Client, message: m, otherOpts: OPTS, webhookOpts: WEBHOOKOPTS, priOptions?: PRIOPTIONS) {
    // Get the channels
    const channels: ChannelOptions[] = <ChannelOptions[]>JSON.parse(db.get('channels')) || [];

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

            if (priOptions && priOptions?.limit_Level && priOptions?.limit_Level > channel.filterLevel) {
                webhook.send({
                    content: priOptions.limit_Exceeded_string_wh || '<msg filtered>',
                    ...webhookOpts.filtered
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

            // Send the message
            webhook.send({
                content: message.wh,
                ...otherOpts,
                ...webhookOpts.norm
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
        const c = client.channels.cache.get(channel.id) || await client.channels.fetch(channel.id).catch(console.log);

        if (!c  || !c.send) {
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

        if (priOptions && priOptions?.limit_Level && priOptions?.limit_Level > channel.filterLevel) {
            c.send({
                content: priOptions.limit_Exceeded_string || '<msg filtered>'
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

            continue;
        }

        c.send({
            content: message.ch,
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
    filtered: WEBHOOKOPTS_N;
    norm: WEBHOOKOPTS_N;
}

interface WEBHOOKOPTS_N {
    avatarURL?: string;
    username?: string;
}

interface OPTS {
    embeds?: Embed[];
    stickers?: Sticker[];
    components?: Component<AnyComponent>[];
    attatchments?: Attachment[];
}

interface PRIOPTIONS {
    limit_Level?: number;
    limit_Exceeded_string?: string;
    limit_Exceeded_string_wh?: string;
}

interface m {
    wh: string;
    ch: string;
}