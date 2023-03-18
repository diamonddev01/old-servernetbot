import { User as DiscordUser } from 'discord.js';
import { Client } from './Client';
import { createDBUser } from '../functions/createDBItems';
import { compressDBUser } from '../functions/compressDBItems';
import { DBUser } from '../types/database/user';
import { BanModeration, MuteModeration, WarningModeration } from './Moderation';

export async function getUser(u: string | DiscordUser, client: Client): Promise<User | null> {
    let user;
    if (typeof u == "string") {
        user = client.users.cache.get(u) || await client.users.fetch(u).catch();
        if (!user) return null;
    } else {
        user = u;
    }

    const data = await client.db.users.get(user.id);
    if (!data) return null;

    return new User(user, data, client);
}

export async function spawnUser(u: string | DiscordUser, client: Client): Promise<User | null> {
    let user = getUser(u, client);
    if (!user) user = newUser(typeof u == "string" ? u : u.id, client);
    return user;
}

export async function newUser(user_id: string, client: Client): Promise<User | null> {
    // ensure user does not exist in db
    const db_data = await spawnUser(user_id, client);
    if (db_data) return db_data;
    const data = createDBUser(user_id);
    const user = client.users.cache.get(user_id) || await client.users.fetch(user_id).catch();
    if (!user) return null;
    const u = new User(user, data, client);
    u.save(); // Force a save, ensures the new User stays in db.
    return u;
}

export class User implements DBUser {
    public message_count!: number;
    public badges!: string[];
    public staff!: boolean;
    public staff_rank!: number;
    public moderations!: string[];
    public can_talk!: boolean;
    public partnership_status!: number;
    public last_message_stamp!: number;
    public ready!: boolean;
    public lastFetchDate: number | null = null;
    public lastSaveDate: number | null = null;
    public id: string;

    constructor(
        public user: DiscordUser,
        data: DBUser,
        private client: Client
    ) {
        this.user = user;
        this.id = user.id;
        this.load(data);
    }

    private load(userdata: DBUser): this {
        this.message_count = userdata.message_count;
        this.badges = userdata.badges;
        this.staff = userdata.staff;
        this.staff_rank = userdata.staff_rank;
        this.moderations = userdata.moderations;
        this.can_talk = userdata.can_talk;
        this.partnership_status = userdata.partnership_status;
        this.last_message_stamp = userdata.last_message_stamp;

        this.ready = true;
        this.lastFetchDate = Date.now();

        return this;
    }

    public async save(): Promise<this> {
        if (!this.ready) return this;
        let compressed = compressDBUser(this);
        this.client.db.users.set(compressed);
        this.lastSaveDate = Date.now();
        return this;
    }

    public async get(): Promise<this> {
        const data = await this.client.db.users.get(this.id);
        if (!data) return this;
        this.load(data);

        this.user = await this.user.fetch(false);

        return this;
    }

    public async loadModerations(): Promise<(BanModeration | MuteModeration | WarningModeration)[]> {
        const f = [];
        for(const mid of this.moderations) {
            const dbmod = await this.client.db.moderations.spawn(mid);
            if(!dbmod) continue;
            f.push(dbmod);
        }

        return f;
    }
}