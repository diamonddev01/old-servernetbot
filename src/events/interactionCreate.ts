import { Client } from '../modified';
import { ButtonInteraction, CommandInteraction, Interaction, InteractionType, Message } from 'discord.js';

export function event(client: Client, interaction: Interaction) {
    // Check if its a commandInteraction

    if (interaction.type == InteractionType.ApplicationCommand) CommandHandle(client, <CommandInteraction>interaction);
    if (interaction.type == InteractionType.MessageComponent && interaction.isButton()) ButtonHandler(client, <ButtonInteraction>interaction);
}

function CommandHandle(client: Client, interaction: CommandInteraction) {
    const cmdName = interaction.commandName;

    const cmd = client.commands.get(cmdName);
    if (cmd) {
        cmd.evt_command(client, interaction);
    }
}

function ButtonHandler(client: Client, interaction: ButtonInteraction) {
    // Get the name of the button
    const buttonName = interaction.customId;

    // Find out if the button is logged to the setup system
    const OwningMessage: Message = interaction.message;
    
    const setup = client
}