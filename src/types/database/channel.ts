type connection_methods_and_overrides = "SNET_TEAM" | "GUILD_STAFF";

export interface DBChannel {
    id: string; // The discord id of the channel
    connection_details: {
        connected_at: number; // Timestamp of when the channel was connected to the network
        connected_by: string; // user id who added the channel to the network
        connection_method: connection_methods_and_overrides; // Describes how the channel was added for future debuging if needed.
    }
    guild: string; // The id of the guild the channel is in
}