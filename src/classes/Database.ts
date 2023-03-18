import { QuickDB } from "quick.db";
import { Client } from "./Client";
import { DatabaseFile, TableLinker as defLinker } from "../config";
import { DBUser } from "../types/database/user";
import { DBChannel } from "../types/database/channel";
import { DatabaseTables } from "../types/config_types";
import { DBModeration } from "../types/database/moderation";
import { DBGuild } from "../types/database/guild";
import { DBBadge } from "../types/database/badge";
import { User as DiscordUser, Guild as DiscordGuild, TextChannel } from "discord.js";
import { User } from "./User";
import { Guild } from "./Guild";
import { Channel, spawnChannel } from "./Channel";
import { Badge, spawnBadge } from "./Badge";
import { BanModeration, MuteModeration, WarningModeration, spawnModeraton } from "./Moderation";

export class Database {
    private DatabasePath: string;
    private Linker: DatabaseTables;

    public users: UserDB;
    public channels: ChannelDB;
    public moderations: ModerationDB;
    public guilds: GuildDB;
    public badges: BadgeDB;

    constructor(
        private client: Client
    ) {
        this.DatabasePath = `../${DatabaseFile}`;
        this.Linker = defLinker;

        this.users = new UserDB(this.DatabasePath, this.Linker, this.client);
        this.channels = new ChannelDB(this.DatabasePath, this.Linker, this.client);
        this.moderations = new ModerationDB(this.DatabasePath, this.Linker, this.client);
        this.guilds = new GuildDB(this.DatabasePath, this.Linker, this.client);
        this.badges = new BadgeDB(this.DatabasePath, this.Linker, this.client);
    }
}

class UserDB {
    private db: QuickDB;

    constructor(
        dbPath: string,
        TableLinker: DatabaseTables,
        private client: Client
    ) {
        this.db = new QuickDB({
            filePath: dbPath,
            table: TableLinker.users
        });
    }

    get(user_id: string): Promise<DBUser | null> {
        return this.db.get<DBUser>(user_id);
    }

    set(user_data: DBUser): Promise<DBUser> {
        return this.db.set<DBUser>(user_data.id, user_data);
    }

    fromDiscord(user: DiscordUser): Promise<User> {
        const u = new User(user);
        return u.get(this.client);
    }
}

class ChannelDB {
    private db: QuickDB;

    constructor(
        dbPath: string,
        TableLinker: DatabaseTables,
        private client: Client
    ) {
        this.db = new QuickDB({
            filePath: dbPath,
            table: TableLinker.channels
        })
    }

    get(channel_id: string): Promise<DBChannel | null> {
        return this.db.get<DBChannel>(channel_id);
    }

    set(channel: DBChannel): Promise<DBChannel> {
        return this.db.set<DBChannel>(channel.id, channel);
    }

    fromDiscord(channel: TextChannel): Promise<Channel | null> {
        return spawnChannel(channel, this.client);
    }
}

class ModerationDB {
    private db: QuickDB;

    constructor(
        dbPath: string,
        TableLinker: DatabaseTables,
        private client: Client
    ) {
        this.db = new QuickDB({
            filePath: dbPath,
            table: TableLinker.moderations
        })
    }

    get(moderation_id: string): Promise<DBModeration | null> {
        return this.db.get<DBModeration>(moderation_id);
    }

    set(moderation: DBModeration): Promise<DBModeration> {
        return this.db.set<DBModeration>(moderation.id, moderation);
    }

    spawn(id: string): Promise<BanModeration | MuteModeration | WarningModeration | null> {
        return spawnModeraton(id, this.client);
    }
}

class GuildDB {
    private db: QuickDB;

    constructor(
        dbPath: string,
        TableLinker: DatabaseTables,
        private client: Client
    ) {
        this.db = new QuickDB({
            filePath: dbPath,
            table: TableLinker.guilds
        })
    }

    get(guild_id: string): Promise<DBGuild | null> {
        return this.db.get<DBGuild>(guild_id);
    }

    set(guild: DBGuild): Promise<DBGuild> {
        return this.db.set<DBGuild>(guild.id, guild);
    }

    fromDiscord(guild: DiscordGuild): Promise<Guild> {
        const g = new Guild(guild);
        return g.get(this.client);
    }
}

class BadgeDB {
    private db: QuickDB;

    constructor(
        dbPath: string,
        TableLinker: DatabaseTables,
        private client: Client
    ) {
        this.db = new QuickDB({
            filePath: dbPath,
            table: TableLinker.bagdes
        })
    }

    get(badge_id: string): Promise<DBBadge | null> {
        return this.db.get<DBBadge>(badge_id);
    }

    set(badge: DBBadge): Promise<DBBadge> {
        return this.db.set<DBBadge>(badge.id, badge);
    }

    spawn(id: string): Promise<Badge | null> {
        return spawnBadge(id, this.client);
    }
}