import { User } from "../classes/User";
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