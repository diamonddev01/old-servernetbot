import { Client } from "../../classes/Client";
import {Interaction, InteractionType, CommandInteraction} from 'discord.js';

export function event(client: Client, interaction: Interaction): void {
    if(!interaction.guildId || !interaction.guild) return;

    if(interaction.type == InteractionType.ApplicationCommand) HandleCommand(client, interaction);
}

function HandleCommand(client: Client, interaction: CommandInteraction): void {
    if(interaction.channel?.isDMBased()) return;
    if(!interaction.channel) return;

    const cmdName = interaction.commandName;
    const cmd = client.commands.get(cmdName);

    if(cmd) {
        cmd.events.command(client, interaction);
    }
}