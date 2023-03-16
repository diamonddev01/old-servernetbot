import { Guild } from "../classes/Guild";
import { User } from "../classes/User";
import { DBGuild } from "../types/database/guild";
import { DBUser } from "../types/database/user";

export function compressDBUser(user: User): DBUser {
    return {
        id: user.id,
        message_count: user.message_count,
        badges: user.badges,
        staff: user.staff,
        staff_rank: user.staff_rank,
        moderations: user.moderations,
        can_talk: user.can_talk,
        partnership_status: user.partnership_status
    }
}

export function compressDBGuild(guild: Guild): DBGuild {
    return {
        id: guild.id,
        channel: guild.channel,
        subscription_status: guild.subscription_status,
        partnership_status: guild.partnership_status,
        moderations: guild.moderations,
        messages: guild.messages,
        metadata: guild.metadata
    }
}