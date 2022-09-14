"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildLogger = void 0;
const config_1 = require("../../config");
class GuildLogger {
    constructor(client, logger) {
        this.client = client;
        this.logger = logger;
    }
    ban(guild, reason, modID) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = this.client.channels.cache.get(config_1.LOGGER_CHANNEL) || (yield this.client.channels.fetch(config_1.LOGGER_CHANNEL).catch(console.log));
            // Exit if no channel is defined. Also patch some compiler issues.
            if (!channel || !channel.send) {
                return false;
            }
            const moderator = modID ? modID : "829383622439206993";
            channel.send({
                content: `[🔨] The guild \`${guild.Guild.name}\` (\`${guild.Guild.id}\`) has been banned for: \`${reason}\` by <@!${moderator}>`
            }).catch(console.log);
            return true;
        });
    }
    unban(guild, modID) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = this.client.channels.cache.get(config_1.LOGGER_CHANNEL) || (yield this.client.channels.fetch(config_1.LOGGER_CHANNEL).catch(console.log));
            // Exit if no channel is defined. Also patch some compiler issues.
            if (!channel || !channel.send) {
                return false;
            }
            const moderator = modID ? modID : "829383622439206993";
            channel.send({
                content: `[🔨] The guild \`${guild.Guild.name}\` (\`${guild.Guild.id}\`) has been unbanned by <@!${moderator}>`
            }).catch(console.log);
            return true;
        });
    }
}
exports.GuildLogger = GuildLogger;
/*
NOTE

Ignore the warnings on the .send in if statements. This is just the compiler being the compiler. This issue will never exist when running.

Secondly the return true doesnt mean that the message has been sent, more that the logger hasnt encountered a major issue.
*/ 
