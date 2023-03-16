import { Guild as DiscordGuild } from "discord.js";
import { RawGuildData } from "discord.js/typings/rawDataTypes";
import { DBGuild, GUILD_META_DATA } from "../types/database/guild";
import { Client } from "./Client";
import { createDBGuild } from "../functions/createDBItems";
import { defaultModerationLevel } from "../config";
import { compressDBGuild } from "../functions/compressDBItems";

interface GuildModerationData {
    moderation_level: number;
    moderation_overrides: Map<string, boolean>;
}

export class Guild implements DBGuild {
    public id: string;
    public channel?: string | undefined;
    public subscription_status: number = 0;
    public partnership_status: number = 0;
    public moderations: string[] = [];
    public messages: number = 0;
    public metadata: GUILD_META_DATA = {};

    public lastFetchDate: null | number = null;
    public lastSaveDate: null | number = null;

    public moderationData: GuildModerationData = {
        moderation_level: 0,
        moderation_overrides: new Map<string, boolean>()
    }

    public ready: boolean = false;

    constructor(
        public guild: DiscordGuild
    ) {
        this.id = this.guild.id;
    }

    async get(client: Client): Promise<this> {
        let guild_data = await client.db.guilds.get(this.id);
        let new_spawn = false;
        if (!guild_data) {
            guild_data = createDBGuild(this.id);
            new_spawn = true;
        }

        this.channel = guild_data.channel;
        this.subscription_status = guild_data.subscription_status;
        this.partnership_status = guild_data.partnership_status;
        this.moderations = guild_data.moderations;
        this.messages = guild_data.messages;
        this.metadata = guild_data.metadata;

        // Read moderation data
        this.moderationData = {
            moderation_level: this.metadata.guild_moderation_status?.moderation_level || defaultModerationLevel,
            moderation_overrides: new Map<string, boolean>(this.metadata.guild_moderation_status?.moderation_overrides)
        }

        this.ready = true;
        this.lastFetchDate = Date.now();
        if (new_spawn) this.save(client);
        return this;
    }

    async save(client: Client): Promise<this> {
        // Load this.moderationData into this.metadata.guild_moderation_status
        let map_deloaded: [string, boolean][] = [];
        for (const item of this.moderationData.moderation_overrides) {
            map_deloaded.push(item);
        }

        this.metadata.guild_moderation_status = {
            moderation_level: this.moderationData.moderation_level,
            moderation_overrides: map_deloaded
        }

        let compressed = compressDBGuild(this);
        client.db.guilds.set(compressed);
        this.lastSaveDate = Date.now();
        return this;
    }
}