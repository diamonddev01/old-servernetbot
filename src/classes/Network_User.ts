import { User } from "discord.js";
import { Badge } from "./Badge";
import * as db from "quick.db";
import { Warning } from "./Warn";
import { WARN_TIMEOUT } from "../config";

export class NetworkUser {
    User: User;
    id: string;
    enabledBadges: Badge | null[];
    badges: Badge[];
    messageCount: number;
    warnings?: Warning[];
    banned: boolean;
    ban?: Ban;
    lastMessage;

    constructor(user: User) {
        this.User = user;
        this.id = user.id;

        // Get some data about the user
        const data = this.getUserData();
        this.enabledBadges = data.enabledBadges;
        this.badges = data.badges;
        this.messageCount = data.messageCount;
        this.warnings = data.warnings;
        this.banned = data.banned;
        this.ban = data.ban;
        this.lastMessage = data.lastMessage;

        this.saveUserData();
    }

    getUserData(): UserData {
        // Get the user's data from the database
        const data_txt = db.get('user-' + this.id) || null;
        if (data_txt === null) {
            // If the user doesn't have data, create it
            this.createUserData();
            return this.getUserData();
        }

        // Parse the data
        const data = JSON.parse(data_txt);

        // Turn the data into what is required
        for(const badge in data.badges) {
            data.badges[badge] = new Badge(data.badges[badge].name, data.badges[badge].id, data.badges[badge].description);
        }

        for (const badge in data.enabledBadges) {
            data.enabledBadges[badge] = new Badge(data.enabledBadges[badge].name, data.enabledBadges[badge].id, data.enabledBadges[badge].description, data.enabledBadges[badge].slot);
        }

        for (const warn in data.warnings) {
            if (data.warnings[warn].time - Date.now() > WARN_TIMEOUT) continue;
            data.warnings[warn] = new Warning(data.warnings[warn].id, data.warnings[warn].message, data.warnings[warn].time);
        }

        return {
            badges: data.badges,
            enabledBadges: data.enabledBadges,
            messageCount: data.messageCount,
            warnings: data.warnings,
            banned: data.banned || false,
            ban: <Ban>data.ban || undefined,
            lastMessage: data.lastMessage
        }
    }

    createUserData() {
        // Create the user's data in the database
        db.set('user-' + this.id, JSON.stringify({
            badges: [],
            enabledBadges: [],
            messageCount: 0,
            lastMessage: 0,
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
        this.saveUserData();

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
        this.saveUserData();

        return true;
    }

    hasBadge(badgeID: string) {
        // Check if the user has the badge
        return this.badges.some(badge => badge.id === badgeID);
    }

    saveUserData() {
        // Turn the badges into an array
        const badges = this.enabledBadges.map(badge => badge.JSON);
        const enabledbadges = this.enabledBadges.map(badge => badge.JSON);
        const warnings = this.warnings?.map(warn => warn.JSON);

        // Save the user's data to the database
        db.set('user-' + this.id, JSON.stringify({
            badges: badges,
            enabledBadges: enabledbadges,
            messageCount: this.messageCount,
            warnings: warnings,
            banned: this.banned,
            ban: this.ban,
            lastMessage: this.lastMessage
        }));
    }

    sentMessage() {
        // Increase the message count
        this.messageCount++;
        this.lastMessage = Date.now();

        // Save the data
        this.saveUserData();
    }

    // Reason is a string of why the warning was added | Moderator is the id of the moderator who applied the warning -> null if done by the automoderator
    warnUser(reason: string, moderator?: string | null) { 
        // Create a new warning
        const warn = new Warning(this.id, reason, Date.now(), moderator ? moderator : undefined);

        // Add the warning to the user's warnings
        if (this.warnings === undefined) {
            this.warnings = [warn];
        } else {
            this.warnings.push(warn);
        }

        // Save the data
        this.saveUserData();
    }

    // Reason is a string of why the ban was added | Moderator is the id of the moderator who applied the ban -> null if done by the automoderator
    banUser(reason: string, moderator: string | null, temp: boolean, time?: number) {
        this.banned = true;

        this.ban = {
            reason: reason,
            moderator: moderator ? moderator : undefined,
            temp: temp,
            time: time
        }

        this.saveUserData();
    }
}

interface UserData {
    badges: Badge[];
    enabledBadges: Badge[];
    messageCount: number;
    warnings?: Warning[];
    banned: boolean;
    ban: Ban;
    lastMessage: number;
}

interface Ban {
    reason: string;
    moderator?: string;
    temp?: boolean;
    time?: number;
}