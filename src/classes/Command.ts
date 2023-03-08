import { CommandConstructor, modifiedSlashCommandBuilder } from "../types/Command";
import { Client } from "./Client";
import { Message, CommandInteraction, Interaction, SlashCommandBuilder } from 'discord.js';

export class Command {
    public name: string;
    public description: string;
    public aliases: string[];

    public messageEnabled: boolean;
    public slashEnabled: boolean;

    private slashCommandData?: modifiedSlashCommandBuilder;

    constructor(construct: CommandConstructor) {
        const { name, description, aliases, messageEnabled, slashEnabled, slashCommandData, message, command, interaction } = construct;

        this.name = name;
        this.description = description;
        this.aliases = aliases || [];

        this.messageEnabled = messageEnabled;
        this.slashEnabled = slashEnabled;

        this.slashCommandData = slashCommandData ? slashCommandData.setName(this.name).setDescription(this.description) : undefined;

        this.onMessage = message ? message : this.onMessage;
        this.onCommandInteraction = command ? command : this.onCommandInteraction;
        this.onInteraction = interaction ? interaction : this.onInteraction;
    }

    private onMessage(client: Client, message: Message, args: string[]): void {
        return;
    }

    private onCommandInteraction(client: Client, interaction: CommandInteraction): void {
        return;
    }

    private onInteraction(client: Client, interaction: Interaction): void {
        return;
    }

    public get events(): {
        message: (client: Client, message: Message, args: string[]) => void,
        command: (client: Client, interaction: CommandInteraction) => void,
        interaction: (client: Client, interaction: Interaction) => void
    } {
        return {
            message: this.onMessage,
            command: this.onCommandInteraction,
            interaction: this.onInteraction
        }
    }

    public getSlash(): SlashCommandBuilder | undefined {
        return this.slashCommandData as SlashCommandBuilder;
    }
}