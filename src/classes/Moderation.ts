import { compressDBModeration } from "../functions/compressDBItems";
import { DBBanModeration, DBModeration, DBMuteModeration, DBWarningModeration, ModerationTypes } from "../types/database/moderation";
import { Client } from "./Client";

export async function spawnModeraton(moderation_id: string, client: Client): Promise<BanModeration | MuteModeration | WarningModeration | null> {
    const moderation_data = await client.db.moderations.get(moderation_id);
    if (!moderation_data) return null;

    if (moderation_data.type == "warn") return new WarningModeration(moderation_data);
    if (moderation_data.type == "mute") return new MuteModeration(moderation_data);
    if (moderation_data.type == "ban") return new BanModeration(moderation_data);
    return null;
}

export class defaultModerationBehavior {
    public id: string;
    public target: string;
    public issued_at: string;
    public issuer: string;
    public reason: string;
    public automated: boolean;
    public type: ModerationTypes = "warn";
    public sub_information: any;

    public lastFetchDate: null | number = null;
    public lastSaveDate: null | number = null;

    constructor(moderation: DBModeration) {
        this.id = moderation.id;
        this.target = moderation.target;
        this.issued_at = moderation.issued_at;
        this.issuer = moderation.issuer;
        this.reason = moderation.reason;
        this.automated = moderation.automated;
        this.type = moderation.type;
        this.sub_information = moderation.sub_information;
    }

    async get(client: Client): Promise<this> {
        const moderation = await client.db.moderations.get(this.id);
        if (!moderation || moderation.type !== this.type) return this;

        this.id = moderation.id;
        this.target = moderation.target;
        this.issued_at = moderation.issued_at;
        this.issuer = moderation.issuer;
        this.reason = moderation.reason;
        this.automated = moderation.automated;
        this.sub_information = moderation.sub_information;

        this.lastFetchDate = Date.now();

        return this;
    }

    async save(client: Client): Promise<this> {
        const compressed = compressDBModeration(this);
        client.db.moderations.set(compressed);
        this.lastSaveDate = Date.now();
        return this;
    }
}

export class WarningModeration extends defaultModerationBehavior implements DBWarningModeration {
    type: "warn" = "warn";

    constructor(moderation: DBWarningModeration) {
        super(moderation);
    }
}

export class MuteModeration extends defaultModerationBehavior implements DBMuteModeration {
    type: "mute" = "mute";

    constructor(moderation: DBMuteModeration) {
        super(moderation);
    }
}

export class BanModeration extends defaultModerationBehavior implements DBBanModeration {
    type: "ban" = "ban";

    constructor(moderation: DBBanModeration) {
        super(moderation);
    }
}