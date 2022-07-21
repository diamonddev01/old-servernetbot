import { Client as c, Collection, ClientOptions } from 'discord.js';
import { Command } from './Command';

export class Client extends c {
    commands: Collection<string, Command>;
    slashCommands: undefined; // TODO

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
    }


}