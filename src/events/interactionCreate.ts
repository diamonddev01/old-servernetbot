import { Client } from '../modified';
import { CommandInteraction, Interaction, InteractionType } from 'discord.js';

export function event(client: Client, interaction: Interaction) {
    // Check if its a commandInteraction

    if (interaction.type == InteractionType.ApplicationCommand) CommandHandle(client, <CommandInteraction>interaction);
}

function CommandHandle(client: Client, interaction: CommandInteraction) {
    const cmdName = interaction.commandName;

    const cmd = client.commands.get(cmdName);
    if (cmd) {
        cmd.evt_command(client, interaction);
    }
}