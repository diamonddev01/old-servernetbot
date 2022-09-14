import { Client as c, Collection, ClientOptions, Routes, SlashCommandBuilder } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Command } from './Command';
import { token } from '../__hdn/token';
import { Logger } from './logger';
import { TimeManager } from './TimerSystem';

export class Client extends c {
    commands: Collection<string, Command>;
    slashCommands: SlashCommandBuilder[];
    logger: Logger;
    timer: TimeManager;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();

        this.logger = new Logger(this);
        this.timer = new TimeManager(this);

        this.slashCommands = [];
    }

    addSlashCommand(cmd: SlashCommandBuilder) {
        this.slashCommands.push(cmd);
    }

    async registerSlash() {
        const rest = new REST({ version: '9' }).setToken(token);
        const guilds = this.guilds.cache.map(g => g.id);

        if (!this.user) return;

        let errs: any[] = [];

        for (const guild of guilds) {
            try {
                await rest.put(Routes.applicationGuildCommands(this.user.id, guild), { body: this.slashCommands }).then(() => {
                    console.log(`[/] Loaded slash commands in guild "${this.guilds.cache.get(guild)?.name}" (${guild})`);
                }).catch(e => console.log(JSON.stringify(e)));
            } catch (err) {
                errs.push(err);
            }
        }

        console.log('[%] Servernet is now online with ' + errs.length + ' errors');

        for (const e of errs) {
            console.error(e);
        }
    }
}