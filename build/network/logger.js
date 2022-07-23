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
exports.Logger = void 0;
const config_1 = require("../config");
class Logger {
    constructor(client) {
        this.client = client;
    }
    log_warn(warning, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = this.client.channels.cache.get(config_1.LOGGER_CHANNEL) || (yield this.client.channels.fetch(config_1.LOGGER_CHANNEL).catch(console.log));
            if (!channel || !channel.send) {
                return;
            }
            const moderator = warning.moderatorID ? warning.moderatorID : "829383622439206993";
            channel.send({
                content: `[⚠️] \`${user.User.tag}\` (\`${user.User.id}\`) has been warned for: \`${warning.message}\` by <@!${moderator}>`
            }).catch(console.log);
        });
    }
    log_ban(user, reason, modID) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = this.client.channels.cache.get(config_1.LOGGER_CHANNEL) || (yield this.client.channels.fetch(config_1.LOGGER_CHANNEL).catch(console.log));
            if (!channel || !channel.send) {
                return;
            }
            const moderator = modID ? modID : "829383622439206993";
            channel.send({
                content: `[🔨] \`${user.User.tag}\` (\`${user.User.id}\`) has been banned for: \`${reason}\` by <@!${moderator}>`
            }).catch(console.log);
        });
    }
    log_unban(user, modID) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = this.client.channels.cache.get(config_1.LOGGER_CHANNEL) || (yield this.client.channels.fetch(config_1.LOGGER_CHANNEL).catch(console.log));
            if (!channel || !channel.send) {
                return;
            }
            const moderator = modID ? modID : "829383622439206993";
            channel.send({
                content: `[🔨] \`${user.User.tag}\` (\`${user.User.id}\`) has been unbanned by <@!${moderator}>`
            }).catch(console.log);
        });
    }
    log_gBan(guild, reason, modID) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = this.client.channels.cache.get(config_1.LOGGER_CHANNEL) || (yield this.client.channels.fetch(config_1.LOGGER_CHANNEL).catch(console.log));
            if (!channel || !channel.send) {
                return;
            }
            const moderator = modID ? modID : "829383622439206993";
            channel.send({
                content: `[🔨] The guild \`${guild.Guild.name}\` (\`${guild.Guild.id}\`) has been banned for: \`${reason}\` by <@!${moderator}>`
            }).catch(console.log);
        });
    }
    log_gUnban(guild, modID) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = this.client.channels.cache.get(config_1.LOGGER_CHANNEL) || (yield this.client.channels.fetch(config_1.LOGGER_CHANNEL).catch(console.log));
            if (!channel || !channel.send) {
                return;
            }
            const moderator = modID ? modID : "829383622439206993";
            channel.send({
                content: `[🔨] The guild \`${guild.Guild.name}\` (\`${guild.Guild.id}\`) has been unbanned by <@!${moderator}>`
            }).catch(console.log);
        });
    }
}
exports.Logger = Logger;
