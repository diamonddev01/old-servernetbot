import { Guild } from "discord.js";
import { Badge } from "./Badge";
import * as db from "quick.db";
import { Client } from "./Client";
import { Timer } from "./TimerSystem";

export class NetworkGuild {
    guild: Guild;
    banned: boolean;
    ban?: Ban;
    messageCount: number;
    id: string;
    enabledBadges: Badge[];
    badges: Badge[];
    clnt: Client;

    constructor(guild: Guild, client: Client) {
        this.guild = guild;
        this.id = guild.id;
        this.clnt = client;

        // Get some data about the guild
        const data = this.getGuildData();

        this.banned = data.banned;
        this.ban = data.ban;
        this.messageCount = data.messageCount;
        this.enabledBadges = data.enabledBadges;
        this.badges = data.badges;
    }

    getGuildData(): GuildData {
        // Get the user's data from the database
        const data_txt = db.get('guild-' + this.id) || null;
        if (data_txt === null) {
            // If the user doesn't have data, create it
            this.createGuildData();
            return this.getGuildData();
        }

        // Parse the data
        const data = JSON.parse(data_txt);

        // Turn the data into what is required
        for (const badge in data.badges) {
            data.badges[badge] = new Badge(data.badges[badge].name, data.badges[badge].id, data.badges[badge].description);
        }

        for (const badge in data.enabledBadges) {
            data.enabledBadges[badge] = new Badge(data.enabledBadges[badge].name, data.enabledBadges[badge].id, data.enabledBadges[badge].description, data.enabledBadges[badge].slot);
        }

        return {
            badges: data.badges,
            enabledBadges: data.enabledBadges,
            messageCount: data.messageCount,
            banned: data.banned || false,
            ban: <Ban>data.ban || undefined,
        }
    }

    createGuildData() {
        // Create the guild's data in the database
        db.set('guild-' + this.id, JSON.stringify({
            badges: [],
            enabledBadges: [],
            messageCount: 0,
            banned: false
        }));
    }

    saveGuildData() {
        // Turn the badges into an array
        const badges = this.enabledBadges.map(badge => badge.JSON);
        const enabledbadges = this.enabledBadges.map(badge => badge.JSON);

        // Save the user's data to the database
        db.set('user-' + this.id, JSON.stringify({
            badges: badges,
            enabledBadges: enabledbadges,
            messageCount: this.messageCount,
            banned: this.banned,
            ban: this.ban
        }));
    }

    enableBadge(badgeID: string, slot: number) {
        // Check the user has the badge
        if (!this.hasBadge(badgeID)) {
            return false;
        }

        // Check if the user has the badge enabled
        if (this.enabledBadges.some((badge: Badge) => badge.id === badgeID)) {
            return false;
        }

        // Check the badge slots
        if (!this.badges.some(badge => badge.id === badgeID && badge.allowedSlots.includes(slot))) {
            return false;
        }

        // Set the badge
        this.enabledBadges[slot - 1] = this.badges.find(badge => badge.id === badgeID);

        // Save the data
        this.saveGuildData();

        return true;
    }

    disableBadge(badgeID: string) {
        // Check the user has the badge
        if (!this.hasBadge(badgeID)) {
            return false;
        }

        // Check if the user has the badge enabled
        if (!this.enabledBadges.some((badge: Badge) => badge.id === badgeID)) {
            return false;
        }

        // Remove the badge
        this.enabledBadges[this.enabledBadges.findIndex((badge: Badge) => badge.id === badgeID)] = null;

        // Save the data
        this.saveGuildData();

        return true;
    }

    hasBadge(badgeID: string) {
        // Check if the user has the badge
        return this.badges.some(badge => badge.id === badgeID);
    }

    banGuild(reason: string, moderator: string | null, temp: boolean, time?: number) {
        this.banned = true;

        this.ban = {
            reason: reason,
            moderator: moderator ? moderator : undefined,
            temp: temp,
            time: time
        }

        this.clnt.logger.log_gBan(this, reason, moderator);
        if(this.ban.temp) this.clnt.timer.addTimer(
            new Timer(
                undefined,
                time,
                (client: Client, guild: NetworkGuild) => {
                    guild.unbanGuild(null);
                },
                this
            )
        )

        this.saveGuildData();
    }

    unbanGuild(modID: string | null) {
        if (!this.banned) return;
        this.banned = false;
        this.ban = undefined;

        this.clnt.logger.log_gUnban(this, modID);

        this.saveGuildData();
    }
}

interface GuildData {
    badges: Badge[];
    enabledBadges: Badge[];
    messageCount: number;
    banned: boolean;
    ban: Ban;
}

interface Ban {
    reason: string;
    moderator?: string;
    temp?: boolean;
    time?: number;
}