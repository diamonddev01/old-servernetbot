import { Client } from '../modified';
import { Message } from 'discord.js';

export function event(client: Client, message: Message) {
    const prefix = '>' // fix soon

    const args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();

    if (!command) return;

    // Check command exists
    const cmd = client.commands.get(command) || client.commands.find(c => c.aliases && c.aliases.includes(command)); // Ignore issues
    if (cmd) {
        cmd.evt_msg(client, message, args);
    }
}