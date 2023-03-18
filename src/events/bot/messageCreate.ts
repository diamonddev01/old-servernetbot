import { Client } from "../../classes/Client";
import { Message } from 'discord.js';
import { Prefix } from "../../config";
import { networkMessage } from "../../network/networkMessage";

export function event(client: Client<true>, message: Message): void {
    if (message.author.bot) return;
    if(!message.content.toLowerCase().startsWith(Prefix)) return serverentLogic(client, message)

    const args = message.content.toLowerCase().slice(Prefix.length).trim().split(/ + /g);
    const command = args.shift();

    // Servernet logic
    if(!command) return serverentLogic(client, message);
    const cmd = client.commands.get(command) || client.commands.find(c => c.aliases && c.aliases.includes(command));
    if (cmd) {
        if (!cmd.messageEnabled) return;
        if(client.channelIdsCache.includes(message.channel.id)) {
            message.channel.send({content: "You cannot use a command on a network channel"}).catch();
            return;
        }
        cmd.events.message(client, message, args);
    } else {
        serverentLogic(client, message);
    }
}

function serverentLogic(client: Client<true>, message: Message): void {
    if(client.channelIdsCache.includes(message.channel.id)) {
        networkMessage(client, message);
    }

    return;
}