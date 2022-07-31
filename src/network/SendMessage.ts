import { ChannelType, Guild, Message, User } from "discord.js";
import { Client } from "../modified";
import { NetworkSend } from "./__send";
import { scan } from "./functions/scanMessage";
import { NetworkUser } from "../classes/Network_User";
import { AUTOMOD_MAX_LENGTH, SLOWMODE, SLOWMODE_TIME, WARN_ESCALATION_THRESHOLD } from "../config";
import { NetworkGuild } from "../classes/Network_Guild";
import { NetworkChannel } from "../classes/Network_Channel";
import * as BadgeMap from '../maps/badge_mappings';

export async function CustomNetworkMessage(client: Client, message: Message) {
    if (message.channel.type !== ChannelType.GuildText) return; // Fix compiler errors
    if (!message.guild) return; // Fix compiler errors

    const user = new NetworkUser(message.author, client); // Create a new user object
    const guild = new NetworkGuild(message.guild, client); // Create a new guild object
    const channel = new NetworkChannel(message.channel) // Create a new channel object
    const cnt = message.content; // Move the message content into the cnt variable

    const scanned = await scan(message); // Check to see if any of the content violates content policies
    const timed = SLOWMODE ? (user.lastMessage) - Date.now() > SLOWMODE_TIME : false; // Check to see if the user is in slowmode
    const banned = user.banned; // Checks if the user is banned
    const GuildBanned = guild.banned; // Checks if the guild is banned

    if (message.author.bot) return // Dont allow bots to send messages
    
    if (banned || GuildBanned) {
        // Return the 'error'
        message.channel.send({ content: bannedStatement(message.author, message.guild, banned ? 'U' : 'G', banned ? user : guild) }).catch(console.log);
        message.react('❌').catch(console.log);
        message.react('🔨').catch(console.log);
        return;
    }

    if (timed) {
        // Return the 'error'
        message.channel.send({ content: `${message.author} You are in slowmode. Please wait ${((Date.now() - user.lastMessage) - SLOWMODE_TIME) * -1}ms before sending another message.` }).catch(console.log);
        message.react('❌').catch(console.log);
        message.react('⏲️').catch(console.log);
        return;
    }

    if (scanned.phrases == 0) {
        // Warn the user
        const r = user.warnUser('Use of a banned phrase', null);
        message.react('❌').catch(console.log);

        if (r == 1) {
            // Return the 'error'
            message.channel.send({ content: `${message.author} You have been warned for using a banned phrase.` }).catch(console.log);
        }

        if(r == 2) {
            // Return the 'error'
            message.channel.send({ content: `${message.author} You have been temp-banned for using a banned phrase. | Warning escalation policy mandates that after your ${WARN_ESCALATION_THRESHOLD}${textAfterNumber(WARN_ESCALATION_THRESHOLD)} warn you must be temp-banned.` }).catch(console.log);
        }

        return;
    }

    if (scanned.badLink) {
        // Warn the user
        const r = user.warnUser('Use of a banned link', null);
        message.react('❌').catch(console.log);

        if (r == 1) {
            // Return the 'error'
            message.channel.send({ content: `${message.author} You have been warned for using a banned link.` }).catch(console.log);
        }

        if(r == 2) {
            // Return the 'error'
            message.channel.send({ content: `${message.author} You have been temp-banned for using a banned link. | Warning escalation policy mandates that after your ${WARN_ESCALATION_THRESHOLD}${textAfterNumber(WARN_ESCALATION_THRESHOLD)} warn you must be temp-banned.` }).catch(console.log);
        }

        return;
    }

    if (!scanned.allow_length) {
        // Refuse to send the message (Not warning due to it hardly being a problem, just better for logging reasons)
        message.react('❌').catch(console.log);

        message.channel.send({ content: `${message.author} Your message is too long | Over ${AUTOMOD_MAX_LENGTH}.` }).catch(console.log);
        return;
    }

    if (scanned.ping) {
        // Refuse to send the message (I'm not warning as this is a common thing between alot of users)
        message.react('❌').catch(console.log);

        message.channel.send({ content: `${message.author} You cannot send pings accorss the network.` }).catch(console.log);
        return;
    }

    // Figure out media, stickers and attatchments
    const media: string[] | [] = message.attachments.map(a => a.url);
    const stickers: string[] | [] = message.stickers.map(s => s.url);

    if ((scanned.link || media.length > 0 || stickers.length > 0) && !(user.messageCount >= 100)) {
        // Refuse to send the message (Don't warn as the user is possibly new)
        message.react('❌').catch(console.log);

        message.channel.send({ content: `${message.author} You need to send 100 messages before you can send media.` }).catch(console.log);
        return;
    }

    // Gets the emoji instead of the whole class
    const guildBadges = guild.enabledBadges.map(b => b.emoji);
    const userBadges = user.enabledBadges.map(b => b?.emoji);

    // Webhook content
    const webhookString = `${message.content}${media.length > 0 ? `\n${media.join(' | ')}` : ''}${stickers.length > 0 ? `\n${stickers.join(' | ')}` : ''}`;
    const webhook_filt = `<Message content hidden due to server filters>`

    // Channel content
    // [guildName guildBadges] userName#userDiscriminator userBadges: messageContent attatchments/stickers (It looks more complex than it is)
    const content = `[${guild.guild.name}${guildBadges.length > 0 ? ` (${guildBadges.join(' ')})` : ''}] ${message.author.username}#${message.author.discriminator}${userBadges.length > 0 ? userBadges.join(' ') : ''}: ${webhookString}`;
    const filteredContent = `[Globus Network${BadgeMap.official}] ${client?.user?.tag}${BadgeMap.staff}: ${webhook_filt}`;

    // Other webhook data
    const username = message.author.tag;
    const avatar = message.author.avatar?.startsWith('a_') ? message.author.avatarURL({extension: 'gif', size: 4096}) : message.author.avatarURL({extension: 'webp', size: 4096});

    // Failsafe
    const _username = client.user?.tag;
    const _avatar = client.user?.avatarURL({ extension: 'webp', size: 4096 });

    NetworkSend(client, {
        ch: content,
        wh: webhookString,
    }, {}, {
        norm: {
            username: username,
            avatarURL: avatar,
        },
        fail: {
            username: _username,
            avatarURL: _avatar,
        },
    }, {
        limit_Level: scanned.phrases,
        limit_Exceeded_string: filteredContent,
        limit_Exceeded_string_wh: webhook_filt
    });
}

function bannedStatement(user: User, guild: Guild, banned: 'G' | 'U', bannedItem: NetworkGuild | NetworkUser): string {
    if(banned === 'G') {
        return `${guild.name} is banned from using servernet for ${bannedItem.ban?.reason || 'no reason'}. Please ask the server owner nicely to submit a server appeal.`;
    }

    return `${user.username}, you banned from using servernet for ${bannedItem.ban?.reason || 'no reason'}. Please submit an appeal.`;
}

function textAfterNumber(number: number): string {
    if (number === 1 || (number > 20 && (number % 10 == 1))) return 'st';
    if (number === 2 || (number > 20 && (number % 10 == 2))) return 'nd';
    if (number === 3 || (number > 20 && (number % 10 == 3))) return 'rd';
    return 'th';
}