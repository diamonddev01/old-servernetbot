import { BaseGuildTextChannel, Channel } from "discord.js";
import { Badge } from "./Badge";
import * as db from "quick.db";
import { Warning } from "./Warn";
import { WARN_TIMEOUT } from "../config";
import { makeID } from "../functions/idMaker";

export class NetworkChannel {
    Channel: BaseGuildTextChannel;
    id: string;
    warnings?: Warning[];
    banned: boolean;
    ban?: Ban;
    lastMessage;

    constructor(channel: BaseGuildTextChannel) {
        this.Channel = channel;
        this.id = this.Channel.id;

        // Get some data about the channel
        const data = this.getChannelData();
        this.warnings = data.warnings;
        this.banned = data.banned;
        this.ban = data.ban;
        this.lastMessage = data.lastMessage;

        this.saveChannelData();
    }

    getChannelData(): ChannelData {
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
            if (data.warnings[warn].time - Date.now() > WARN_TIMEOUT) continue;
            data.warnings[warn] = new Warning(data.warnings[warn].id, data.warnings[warn].message, data.warnings[warn].time);
        }

        return {
            warnings: data.warnings,
            banned: data.banned || false,
            ban: <Ban>data.ban || undefined,
            lastMessage: data.lastMessage
        }
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
        // Turn the warnings into an array
        const warnings = this.warnings?.map(warn => warn.JSON);

        // Save the channel's data to the database
        db.set('channel-' + this.id, JSON.stringify({
            warnings: warnings,
            banned: this.banned,
            ban: this.ban,
            lastMessage: this.lastMessage
        }));
    }

    // Reason is a string of why the warning was added | Moderator is the id of the moderator who applied the warning -> null if done by the automoderator
    warnChannel(reason: string, moderator?: string | null) {
        // Create a new warning
        const warn = new Warning(makeID().toString(), reason, Date.now(), moderator ? moderator : undefined);

        // Add the warning to the channel's warnings
        if (this.warnings === undefined) {
            this.warnings = [warn];
        } else {
            this.warnings.push(warn);
        }

        // Save the data
        this.saveChannelData();
    }

    // Reason is a string of why the ban was added | Moderator is the id of the moderator who applied the ban -> null if done by the automoderator
    banChannel(reason: string, moderator: string | null, temp: boolean, time?: number) {
        this.banned = true;

        this.ban = {
            reason: reason,
            moderator: moderator ? moderator : undefined,
            temp: temp,
            time: time
        }

        this.saveChannelData();
    }
}

interface ChannelData {
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