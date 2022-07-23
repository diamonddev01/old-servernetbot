import { ChannelType, Guild, Message, User } from "discord.js";
import { Client } from "../modified";
import { NetworkSend } from "./__send";
import { scan } from "./functions/scanMessage";
import { NetworkUser } from "../classes/Network_User";
import { SLOWMODE, SLOWMODE_TIME } from "../config";
import { NetworkGuild } from "../classes/Network_Guild";
import { NetworkChannel } from "../classes/Network_Channel";

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
            message.channel.send({ content: `${message.author} You have been temp-banned for using a banned phrase. | Warning escalation policy mandates that after your x warn you must be temp-banned.` }).catch(console.log);
        }

        return;
    }

    //NetworkSend(client, message, data, webhookOpts);
}

function bannedStatement(user: User, guild: Guild, banned: 'G' | 'U', bannedItem: NetworkGuild | NetworkUser): string {
    if(banned === 'G') {
        return `${guild.name} is banned from using servernet for ${bannedItem.ban?.reason || 'no reason'}. Please ask the server owner nicely to submit a server appeal.`;
    }

    return `${user.username}, you banned from using servernet for ${bannedItem.ban?.reason || 'no reason'}. Please submit an appeal.`;
}