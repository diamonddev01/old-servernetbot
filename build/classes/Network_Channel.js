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
exports.NetworkChannel = void 0;
const db = __importStar(require("quick.db"));
const Warn_1 = require("./Warn");
const config_1 = require("../config");
const idMaker_1 = require("../functions/idMaker");
class NetworkChannel {
    constructor(channel) {
        this.Channel = channel;
        this.id = this.Channel.id;
        // Get some data about the channel
        const data = this.getChannelData();
        this.warnings = data.warnings;
        this.banned = data.banned;
        this.ban = data.ban;
        this.options = data.options;
        this.saveChannelData();
    }
    getChannelData() {
        // Get the channel's data from the database
        const data_txt = db.get('channel-' + this.id) || null;
        if (data_txt === null) {
            // If the channel doesn't have data, create it
            this.createChannelData();
            return this.getChannelData();
        }
        // Parse the data
        const data = JSON.parse(data_txt);
        for (const warn in data.warnings) {
            if (data.warnings[warn].time - Date.now() > config_1.WARN_TIMEOUT)
                continue;
            data.warnings[warn] = new Warn_1.Warning(data.warnings[warn].id, data.warnings[warn].message, data.warnings[warn].time);
        }
        return {
            warnings: data.warnings,
            banned: data.banned || false,
            ban: data.ban || undefined,
            options: data.options || {
                id: this.id,
                webhook: false,
                filterLevel: config_1.DEFAULT_FILTER_LEVEL
            }
        };
    }
    createChannelData() {
        // Create the channel's data in the database
        db.set('channel-' + this.id, JSON.stringify({
            badges: [],
            enabledBadges: [],
            messageCount: 0,
            lastMessage: 0,
        }));
    }
    saveChannelData() {
        var _a;
        // Turn the warnings into an array
        const warnings = (_a = this.warnings) === null || _a === void 0 ? void 0 : _a.map(warn => warn.JSON);
        // Save the channel's data to the database
        db.set('channel-' + this.id, JSON.stringify({
            warnings: warnings,
            banned: this.banned,
            ban: this.ban,
        }));
    }
    // Reason is a string of why the warning was added | Moderator is the id of the moderator who applied the warning -> null if done by the automoderator
    warnChannel(reason, moderator) {
        // Create a new warning
        const warn = new Warn_1.Warning((0, idMaker_1.makeID)().toString(), reason, Date.now(), moderator ? moderator : undefined);
        // Add the warning to the channel's warnings
        if (this.warnings === undefined) {
            this.warnings = [warn];
        }
        else {
            this.warnings.push(warn);
        }
        // Save the data
        this.saveChannelData();
    }
    // Reason is a string of why the ban was added | Moderator is the id of the moderator who applied the ban -> null if done by the automoderator
    banChannel(reason, moderator, temp, time) {
        this.banned = true;
        this.ban = {
            reason: reason,
            moderator: moderator ? moderator : undefined,
            temp: temp,
            time: time
        };
        this.saveChannelData();
    }
}
exports.NetworkChannel = NetworkChannel;
