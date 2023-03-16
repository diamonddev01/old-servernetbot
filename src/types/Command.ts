import { SlashCommandBuilder, Message, Interaction, CommandInteraction } from 'discord.js';
import { Client } from '../classes/Client';

export type modifiedSlashCommandBuilder = SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubCommand" | "addSubcommandGroup">

export type CommandConstructor = CommandConstructorSlashDisabled | CommandConstructorSlashEnabled;

interface CommandConstructorBase {
    name: string;
    description: string;
    aliases?: string[];

    messageEnabled: boolean;
    slashEnabled: boolean;
    slashCommandData?: modifiedSlashCommandBuilder;

    message?: (client: Client, message: Message, args: string[]) => void;
    command?: (client: Client, interaction: CommandInteraction) => void;
    interaction?: (client: Client, interaction: Interaction) => void;
}

interface CommandConstructorSlashDisabled extends CommandConstructorBase {
    slashEnabled: false;
    slashCommandData?: undefined;
}

interface CommandConstructorSlashEnabled extends CommandConstructorBase {
    slashEnabled: true;
    slashCommandData: modifiedSlashCommandBuilder;
}