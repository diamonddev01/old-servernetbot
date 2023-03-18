import { Client as DiscordClient, ClientOptions, Collection, SlashCommandBuilder, Routes } from "discord.js";
import { REST } from '@discordjs/rest'
import { Command } from "./Command";
import { devGuild, slashDevMode } from "../config";
import { Database } from "./Database";

export class Client<Ready extends boolean = boolean> extends DiscordClient<Ready> {
    public commands: Collection<string, Command> = new Collection();
    private slashCommands: SlashCommandBuilder[] = [];
    public db: Database = new Database(this);
    public channelIdsCache: string[] = [];

    constructor(options: ClientOptions) {
        super(options);
    }

    public addSlashCommand(slash: SlashCommandBuilder): void {
        this.slashCommands.push(slash);
    }

    public registerCommands(): Promise<boolean> {
        return new Promise<boolean>(async (resolve) => {
            if (!this.user || !this.token) return resolve(false);
            const rest = new REST({ version: "10" }).setToken(this.token);

            if (slashDevMode) {
                this.registerDeveloperSlashCommands(rest);
            }

            this.registerSlashCommands(rest);
        })
    }

    private registerDeveloperSlashCommands(rest: REST): Promise<boolean> {
        return new Promise<boolean>(async (resolve) => {
            if (!this.user) return resolve(false);
            let errors: string[] = [];

            for (const guild of devGuild) {
                try {
                    await rest.put(Routes.applicationGuildCommands(this.user.id, guild), { body: this.slashCommands }).catch(error => {
                        errors.push(guild);
                        console.log(error);
                    })
                } catch (err) {
                    errors.push(guild);
                    console.log(err);
                }
            }

            if (errors.length > 0) console.log(`Failed to load commands in ${errors.join(', ')}`);
            return resolve(true);
        })
    }

    private registerSlashCommands(rest: REST): Promise<boolean> {
        return new Promise<boolean>(async (resolve) => {
            if (!this.user) return resolve(false);

            let success = true;

            try {
                await rest.put(Routes.applicationCommands(this.user.id), { body: this.slashCommands }).catch(error => {
                    console.log("Failed to load slash commands");
                    console.log(error);
                    success = false;
                })
            } catch (error) {
                console.log("Failed to load slash commands");
                console.log(error);
                success = false;
            }

            return resolve(success);
        })
    }
}