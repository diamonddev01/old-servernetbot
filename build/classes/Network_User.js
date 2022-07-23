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
exports.NetworkUser = void 0;
const Badge_1 = require("./Badge");
const db = __importStar(require("quick.db"));
const Warn_1 = require("./Warn");
const config_1 = require("../config");
class NetworkUser {
    constructor(user) {
        this.User = user;
        this.id = user.id;
        // Get some data about the user
        const data = this.getUserData();
        this.enabledBadges = data.enabledBadges;
        this.badges = data.badges;
        this.messageCount = data.messageCount;
        this.warnings = data.warnings;
        this.saveUserData();
    }
    getUserData() {
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
        for (const badge in data.badges) {
            data.badges[badge] = new Badge_1.Badge(data.badges[badge].name, data.badges[badge].id, data.badges[badge].description);
        }
        for (const badge in data.enabledBadges) {
            data.enabledBadges[badge] = new Badge_1.Badge(data.enabledBadges[badge].name, data.enabledBadges[badge].id, data.enabledBadges[badge].description, data.enabledBadges[badge].slot);
        }
        for (const warn in data.warnings) {
            if (data.warnings[warn].time - Date.now() > config_1.WARN_TIMEOUT)
                continue;
            data.warnings[warn] = new Warn_1.Warning(data.warnings[warn].id, data.warnings[warn].message, data.warnings[warn].time);
        }
        return {
            badges: data.badges,
            enabledBadges: data.enabledBadges,
            messageCount: data.messageCount,
            warnings: data.warnings,
            banned: data.banned,
            ban: data.ban
        };
    }
    createUserData() {
        // Create the user's data in the database
        db.set('user-' + this.id, JSON.stringify({
            badges: [],
            enabledBadges: [],
            messageCount: 0,
        }));
    }
    enableBadge(badgeID, slot) {
        // Check the user has the badge
        if (!this.hasBadge(badgeID)) {
            return false;
        }
        // Check if the user has the badge enabled
        if (this.enabledBadges.some(badge => badge.id === badgeID)) {
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
    hasBadge(badgeID) {
        // Check if the user has the badge
        return this.badges.some(badge => badge.id === badgeID);
    }
    saveUserData() {
        var _a;
        // Turn the badges into an array
        const badges = this.enabledBadges.map(badge => badge.JSON);
        const enabledbadges = this.enabledBadges.map(badge => badge.JSON);
        const warnings = (_a = this.warnings) === null || _a === void 0 ? void 0 : _a.map(warn => warn.JSON);
        // Save the user's data to the database
        db.set('user-' + this.id, JSON.stringify({
            badges: badges,
            enabledBadges: enabledbadges,
            messageCount: this.messageCount,
            warnings: warnings,
            banned: this.banned,
            ban: this.ban
        }));
    }
    sentMessage() {
        // Increase the message count
        this.messageCount++;
        // Save the data
        this.saveUserData();
    }
    // Reason is a string of why the warning was added | Moderator is the id of the moderator who applied the warning -> null if done by the automoderator
    warnUser(reason, moderator) {
        // Create a new warning
        const warn = new Warn_1.Warning(this.id, reason, Date.now(), moderator ? moderator : undefined);
        // Add the warning to the user's warnings
        if (this.warnings === undefined) {
            this.warnings = [warn];
        }
        else {
            this.warnings.push(warn);
        }
        // Save the data
        this.saveUserData();
    }
    // Reason is a string of why the ban was added | Moderator is the id of the moderator who applied the ban -> null if done by the automoderator
    banUser(reason, moderator, temp, time) {
        this.banned = true;
        this.ban = {
            reason: reason,
            moderator: moderator ? moderator : undefined,
            temp: temp,
            time: time
        };
        this.saveUserData();
    }
}
exports.NetworkUser = NetworkUser;
