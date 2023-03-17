export type DBModeration = DBWarningModeration | DBMuteModeration | DBBanModeration;
export type ModerationTypes = "warn" | "mute" | "ban";

export interface DBModerationBase {
    id: string; // The id of the moderation. This id should be user_id:timestamp_of_issue
    target: string; // The user the moderation is issued against
    issuer: string; // The user who issued the moderation
    reason: string; // The reason the moderation was issued
    issued_at: string; // When the moderation was issued
    automated: boolean; // Was the moderation issued by an automated system
    type: ModerationTypes; // The type of moderation
    sub_information: any; // Should be defined in the extension
}

export interface DBWarningModeration extends DBModerationBase {
    type: "warn";
    sub_information: {};
}

export interface DBMuteModeration extends DBModerationBase {
    type: "mute";
    sub_information: {
        duration: number; // A time in miliseconds that the mute was issued for.
        started_at: number; // Timestamp of when the mute started
        expires_at: number; // Timestamp of when the mute ends/ended
    }
}

export interface DBBanModeration extends DBModerationBase {
    type: "ban";
    sub_information: null | {};
}