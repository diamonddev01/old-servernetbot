export interface DBUser {
    id: string; // Discord UserID
    message_count: number; // Number of messages sent on the network
    badges: string[]; // A set of IDs connected to a badge in the badges db table
    staff: boolean; // Is the user a member of staff
    staff_rank: number; // What are the permissions of this user, defaults to 0 for non staff
    moderations: string[]; // A list of all moderations given to a user
    can_talk: boolean; // Defaults to true. When a user is muted or banned this should be set to false.
    partnership_status: number; // See subnotes 1
}

/*
SUBNOTES
---- ONE ----
Partnership status shows all information about the user in relation to partnerships
---- 1.1 ----
1 << 0 - Partner
1 << 1 - Verified
*/