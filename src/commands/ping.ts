import { Message } from "discord.js";
import { Command } from "../classes/Command";
import { Client } from "../modified";

function run(client: Client, message: Message, args: string[]) {
    message.reply({ content: 'Pong :D' }).catch(console.log);
}

export const command = new Command({
    name: 'ping',
    description: 'Replies with pong',
    help: {
        Display: false
    }
}).set_msg(run);