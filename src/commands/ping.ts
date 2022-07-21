import { ApplicationCommandType, CommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { Command } from "../classes/Command";
import { Client } from "../modified";

function run(client: Client, message: Message, args: string[]) {
    message.reply({ content: 'Pong :D' }).catch(console.log);
}

function run_c(client: Client, interaction: CommandInteraction) {
    interaction.reply({ content: 'Pong :D', ephemeral: true }).catch(console.log);
}

export const command = new Command({
    name: 'ping',
    description: 'Replies with pong',
    help: {
        Display: false
    },
    slashEnabled: true,
    SlashCommandData: new SlashCommandBuilder()
}).set_msg(run).set_intcmd(run_c);