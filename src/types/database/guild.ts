export interface DBGuild {
    id: string; // Discord ID
    channel?: string; // See Subnotes 1
    subscription_status: number; // See subnotes 2
    partnership_status: number; // See subnotes 3
    moderations: string[]; // See subnotes 4
    messages: number; // Allows the tracking of guild message numbers
    metadata: GUILD_META_DATA;
}

export interface GUILD_META_DATA {
    guild_partnership?: {
        last_application_partner?: number;
        last_application_verified?: number;
        denied_partner_count?: number;
        denied_verified_count?: number;
        denial_reasons_partner?: string[];
        denial_reasons_verified?: string[];
    }
    guild_moderation_status?: {
        moderation_level?: number;
        moderation_ovverides?: Map<string, boolean>;
    }
}

/*
SUBNOTES
---- ONE ----
This is the connected channel for this guild. This is noted here to prevent guilds adding multiple channels.
This is optional as guilds may want to remove a channel for some reasons but not delete some of their guild meta_data.
This also protects partnered guilds from having their partnership voided for accidental mistakes.

---- TWO ----
This is used to display any guild subscriptions. This will be used for donator badges or something in the future.
This value defaults to 0 for people who are not active supporters. Once this functionality is added correctly this value will have more options.
There will probably be a database for all of the data to do with this option.

--- THREE ---
This value will be used to denote if a guild is a partner of servernet or a verified guild (by servernet)
This will also have states for applied and denied.
---- 3.1 ----
States:
1 << 0 - Active Partner
1 << 1 - Active Verified
1 << 2 - Applied Partner
1 << 3 - Applied Verified

--- FOUR ---
Why can guilds have moderations. This basically allows a guild to be issued a warning if there are large numbers of users harrassing others on the network
and if that behavior is not resolved then the guild gets removed from the network. *FEATURE NOT IMPLEMENTED
*/