import { Client } from "../../classes/Client";
import { Message } from 'discord.js';
import { Prefix } from "../../config";

export function event(client: Client, message: Message): void {
    if (!message.content.toLowerCase().startsWith(Prefix) || message.author.bot) return;

    const args = message.content.toLowerCase().slice(Prefix.length).trim().split(/ + /g);
    const command = args.shift();

    if (!command) return;
    const cmd = client.commands.get(command) || client.commands.find(c => c.aliases && c.aliases.includes(command));
    if (cmd) {
        if (!cmd.messageEnabled) return;
        cmd.events.message(client, message, args);
    }
}