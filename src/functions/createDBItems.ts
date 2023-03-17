import { defaultModerationLevel } from "../config";
import { DBChannel } from "../types/database/channel";
import { DBGuild } from "../types/database/guild";
import { DBUser } from "../types/database/user";

export function createDBUser(user_id: string): DBUser {
    return {
        id: user_id,
        message_count: 0,
        badges: [],
        staff: false,
        staff_rank: 0,
        moderations: [],
        can_talk: false,
        partnership_status: 0
    }
}

export function createDBGuild(guild_id: string): DBGuild {
    return {
        id: guild_id,
        channel: undefined,
        subscription_status: 0,
        partnership_status: 0,
        moderations: [],
        messages: 0,
        metadata: {
            guild_moderation_status: {
                moderation_level: defaultModerationLevel,
                moderation_overrides: []
            }
        }
    }
}