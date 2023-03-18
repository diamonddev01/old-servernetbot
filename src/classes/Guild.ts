import { Guild as DiscordGuild } from "discord.js";
import { DBGuild, GUILD_META_DATA } from "../types/database/guild";
import { Client } from "./Client";
import { createDBGuild } from "../functions/createDBItems";
import { defaultModerationLevel } from "../config";
import { compressDBGuild } from "../functions/compressDBItems";

export async function getGuild(g: string | DiscordGuild, client: Client): Promise<Guild | null> {
    let guild;
    if (typeof g == "string") {
        guild = client.guilds.cache.get(g) || await client.guilds.fetch(g).catch();
        if (!guild) return null;
    } else {
        guild = g;
    }

    const data = await client.db.guilds.get(guild.id);
    if (!data) return null;

    return new Guild(guild, data, client);
}

export async function spawnGuild(g: string | DiscordGuild, client: Client): Promise<Guild | null> {
    let user = getGuild(g, client);
    if (!user) user = newGuild(typeof g == "string" ? g : g.id, client);
    return user;
}

export async function newGuild(guild_id: string, client: Client): Promise<Guild | null> {
    // ensure user does not exist in db
    const db_data = await spawnGuild(guild_id, client);
    if (db_data) return db_data;
    const data = createDBGuild(guild_id);
    const guild = client.guilds.cache.get(guild_id) || await client.guilds.fetch(guild_id).catch();
    if (!guild) return null;
    const g = new Guild(guild, data, client);
    g.save(); // Force a save, ensures the new User stays in db.
    return g;
}

interface GuildModerationData {
    moderation_level: number;
    moderation_overrides: Map<string, boolean>;
}

export class Guild implements DBGuild {
    public readonly id: string;
    public channel?: string | undefined;
    public subscription_status!: number;
    public partnership_status!: number;
    public moderations!: string[];
    public messages!: number;
    public metadata!: GUILD_META_DATA;
    public guild_prefix?: string;

    public lastFetchDate: null | number = null;
    public lastSaveDate: null | number = null;

    public moderationData!: GuildModerationData

    public ready: boolean = false;

    constructor(
        public guild: DiscordGuild,
        data: DBGuild,
        private client: Client
    ) {
        this.id = this.guild.id;
        this.load(data);
    }

    private async load(guild_data: DBGuild): Promise<this> {
        this.channel = guild_data.channel;
        this.subscription_status = guild_data.subscription_status;
        this.partnership_status = guild_data.partnership_status;
        this.moderations = guild_data.moderations;
        this.messages = guild_data.messages;
        this.metadata = guild_data.metadata;

        this.guild_prefix = this.metadata.guild_prefix;

        // Read moderation data
        this.moderationData = {
            moderation_level: this.metadata.guild_moderation_status?.moderation_level || defaultModerationLevel,
            moderation_overrides: new Map<string, boolean>(this.metadata.guild_moderation_status?.moderation_overrides)
        }

        this.ready = true;
        this.lastFetchDate = Date.now();
        return this;
    }

    public async save(): Promise<this> {
        // Load this.moderationData into this.metadata.guild_moderation_status
        if (!this.ready) return this;
        let map_deloaded: [string, boolean][] = [];
        for (const item of this.moderationData.moderation_overrides) {
            map_deloaded.push(item);
        }

        this.metadata.guild_moderation_status = {
            moderation_level: this.moderationData.moderation_level,
            moderation_overrides: map_deloaded
        }

        let compressed = compressDBGuild(this);
        this.client.db.guilds.set(compressed);
        this.lastSaveDate = Date.now();
        return this;
    }

    public async get(): Promise<this> {
        const data = await this.client.db.guilds.get(this.id);
        if (!data) {
            this.save();
            return this;
        };
        this.load(data);

        this.guild = await this.guild.fetch();

        return this;
    }
}