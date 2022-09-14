"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkGuild = void 0;
const Badge_1 = require("./Badge");
const db = __importStar(require("quick.db"));
const TimerSystem_1 = require("./TimerSystem");
class NetworkGuild {
    constructor(guild, client) {
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
        this.logger = client.logger.guild;
    }
    getGuildData() {
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
            data.badges[badge] = new Badge_1.Badge(data.badges[badge].name, data.badges[badge].id, data.badges[badge].description);
        }
        for (const badge in data.enabledBadges) {
            data.enabledBadges[badge] = new Badge_1.Badge(data.enabledBadges[badge].name, data.enabledBadges[badge].id, data.enabledBadges[badge].description, data.enabledBadges[badge].slot);
        }
        return {
            badges: data.badges,
            enabledBadges: data.enabledBadges,
            messageCount: data.messageCount,
            banned: data.banned || false,
            ban: data.ban || undefined,
        };
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
    enableBadge(badgeID, slot) {
        // Check the user has the badge
        if (!this.hasBadge(badgeID)) {
            return false;
        }
        // Check if the user has the badge enabled
        if (this.enabledBadges.some((badge) => badge.id === badgeID)) {
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
    disableBadge(badgeID) {
        // Check the user has the badge
        if (!this.hasBadge(badgeID)) {
            return false;
        }
        // Check if the user has the badge enabled
        if (!this.enabledBadges.some((badge) => badge.id === badgeID)) {
            return false;
        }
        // Remove the badge
        this.enabledBadges[this.enabledBadges.findIndex((badge) => badge.id === badgeID)] = null;
        // Save the data
        this.saveGuildData();
        return true;
    }
    hasBadge(badgeID) {
        // Check if the user has the badge
        return this.badges.some(badge => badge.id === badgeID);
    }
    banGuild(reason, moderator, temp, time) {
        this.banned = true;
        this.ban = {
            reason: reason,
            moderator: moderator ? moderator : undefined,
            temp: temp,
            time: time
        };
        this.logger.ban(this, reason, moderator);
        if (this.ban.temp)
            this.clnt.timer.addTimer(new TimerSystem_1.Timer(undefined, time, (client, guild) => {
                guild.unbanGuild(null);
            }, this));
        this.saveGuildData();
    }
    unbanGuild(modID) {
        if (!this.banned)
            return;
        this.banned = false;
        this.ban = undefined;
        this.logger.unban(this, modID);
        this.saveGuildData();
    }
}
exports.NetworkGuild = NetworkGuild;
