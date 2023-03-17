import { Channel } from "../classes/Channel";
import { Guild } from "../classes/Guild";
import { defaultModerationBehavior } from "../classes/Moderation";
import { User } from "../classes/User";
import { DBChannel } from "../types/database/channel";
import { DBGuild } from "../types/database/guild";
import { DBModeration } from "../types/database/moderation";
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

export function compressDBModeration(moderation: defaultModerationBehavior): DBModeration {
    return {
        id: moderation.id,
        target: moderation.target,
        issued_at: moderation.issued_at,
        issuer: moderation.issuer,
        automated: moderation.automated,
        reason: moderation.reason,
        type: moderation.type,
        sub_information: moderation.sub_information
    }
}

export function compressDBChannel(channel: Channel): DBChannel {
    return {
        id: channel.id,
        connection_details: channel.connection_details,
        guild_id: channel.guild_id,
        message_count: channel.message_count
    }
}