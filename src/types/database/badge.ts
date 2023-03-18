export interface DBBadge {
    id: string; // SERVERNET badge ID
    discord: DiscordBadgeInterface;
    self_applicable: boolean; // Can a user add this badge to themselves
    staff_applicable_only: boolean; // Can this badge only be added by staff
}

export interface DiscordBadgeInterface {
    badge_id: string;
    badge_name: string;
    badge_string: string; // <:badge_name:badge_id>
}