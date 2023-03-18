import { compressDBBadge } from "../functions/compressDBItems";
import { DBBadge } from "../types/database/badge";
import { Client } from "./Client";

export async function spawnBadge(badge_id: string, client: Client): Promise<Badge | null> {
    const db_badge = await client.db.badges.get(badge_id);
    if (!db_badge) return null;
    return new Badge(db_badge, client);
}

export class Badge implements DBBadge {
    public readonly id: string;
    public discord: { badge_id: string; badge_name: string; badge_string: string; };
    public self_applicable: boolean;
    public staff_applicable_only: boolean;

    public lastSaveDate: number | null = null;
    public lastFetchDate: number | null = null;

    private readonly client: Client;

    constructor(db_badge: DBBadge, c: Client) {
        this.id = db_badge.id;
        this.discord = db_badge.discord;
        this.self_applicable = db_badge.self_applicable;
        this.staff_applicable_only = db_badge.staff_applicable_only;
        this.client = c;
    }

    public async save(): Promise<this> {
        const compressed = compressDBBadge(this);
        this.client.db.badges.set(compressed);
        this.lastSaveDate = Date.now();
        return this;
    }
}