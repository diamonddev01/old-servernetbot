import { User as DiscordUser } from 'discord.js';
import { RawUserData } from 'discord.js/typings/rawDataTypes';
import { Client } from './Client';
import { createDBUser } from '../functions/createDBItems';
import { compressDBUser } from '../functions/compressDBItems';
import { DBUser } from '../types/database/user';

export class User extends DiscordUser implements DBUser {
    public message_count: number = 0;
    public badges: string[] = [];
    public staff: boolean = false;
    public staff_rank: number = 0;
    public moderations: string[] = [];
    public can_talk: boolean = false;
    public partnership_status: number = 0;
    public ready = false;
    public lastFetchDate: number | null = null;
    public lastSaveDate: number | null = null;

    public fetchError?: string;

    constructor(user: DiscordUser) {
        super(user.client, user.toJSON() as RawUserData);
    }

    async get(client: Client): Promise<this> {
        let userdata = await client.db.users.get(this.id);
        let new_spawn = false;
        if (!userdata) {
            userdata = createDBUser(this.id);
            new_spawn = true;
        }
        this.message_count = userdata.message_count;
        this.badges = userdata.badges;
        this.staff = userdata.staff;
        this.staff_rank = userdata.staff_rank;
        this.moderations = userdata.moderations;
        this.can_talk = userdata.can_talk;
        this.partnership_status = userdata.partnership_status;

        this.ready = true;
        this.lastFetchDate = Date.now();

        if (new_spawn) this.save(client);
        return this;
    }

    async save(client: Client): Promise<this> {
        let compressed = compressDBUser(this);
        client.db.users.set(compressed);
        this.lastSaveDate = Date.now();
        return this;
    }
}