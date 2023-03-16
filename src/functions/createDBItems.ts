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