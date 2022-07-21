import { CommandInteraction, Interaction, Message } from 'discord.js';
import { Client } from '../modified';
import {HelpMenus} from '../types/HelpMenus';

export class Command {
    name: string;
    description: string;
    help: HelpData;
    aliases?: string[];

    constructor(construct: Construct) {
        const { name, description, help, aliases } = construct;
        this.name = name;
        this.description = description;
        this.help = help;
        this.aliases = aliases;
    }

    msg_run(client: Client, message: Message, args: string[]): void {
        message.channel.send({ content: `Failed to run command ${this.name} - msg_run function not defined.` }); // Return an error code.
    }

    int_run(client: Client, interaction: CommandInteraction): void {
        interaction.reply({content: `Failed to run command ${this.name} - int_run function not defined`, ephemeral: true}) // Return an error code
    }

    int_other(client: Client, interaction: Interaction) {
        // Used to parse data for button presses or other items like that.
        return;
    }

    // Allow the command to redefine what happens on a message
    set_msg(func: (client: Client, mesasge: Message, args: string[]) => void) {
        this.msg_run = func;

        return this;
    }

    set_intcmd(func: (client: Client, interaction: CommandInteraction) => void) {
        this.int_run = func;

        return this;
    }

    set_intother(func: (client: Client, interaction: Interaction) => void) {
        this.int_other = func;

        return this;
    }

    // Stuff that gets called by the event
    evt_msg(c: Client, m: Message, a: string[]) {
        try {
            this.msg_run(c, m, a);
        } catch (e) {
            console.log(e);
        }
    }

    evt_interaction(c: Client, i: Interaction) {
        // TODO
    }
}

interface HelpData {
    MessageUsage?: string;
    InteractionUsage?: string;
    Category?: HelpMenus;
    Display: boolean;
}

interface Construct {
    name: string;
    description: string;
    help: HelpData;
    aliases?: string[];
}