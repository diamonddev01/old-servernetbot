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
exports.CustomNetworkMessage = void 0;
const discord_js_1 = require("discord.js");
const __send_1 = require("./__send");
const scanMessage_1 = require("./functions/scanMessage");
const Network_User_1 = require("../classes/Network_User");
const config_1 = require("../config");
const Network_Guild_1 = require("../classes/Network_Guild");
const Network_Channel_1 = require("../classes/Network_Channel");
const BadgeMap = __importStar(require("../maps/badge_mappings"));
function CustomNetworkMessage(client, message) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        if (message.channel.type !== discord_js_1.ChannelType.GuildText)
            return; // Fix compiler errors
        if (!message.guild)
            return; // Fix compiler errors
        const user = new Network_User_1.NetworkUser(message.author, client); // Create a new user object
        const guild = new Network_Guild_1.NetworkGuild(message.guild, client); // Create a new guild object
        const channel = new Network_Channel_1.NetworkChannel(message.channel); // Create a new channel object
        const cnt = message.content; // Move the message content into the cnt variable
        const scanned = yield (0, scanMessage_1.scan)(message); // Check to see if any of the content violates content policies
        const timed = config_1.SLOWMODE ? (user.lastMessage) - Date.now() > config_1.SLOWMODE_TIME : false; // Check to see if the user is in slowmode
        const banned = user.banned; // Checks if the user is banned
        const GuildBanned = guild.banned; // Checks if the guild is banned
        if (message.author.bot)
            return; // Dont allow bots to send messages
        if (banned || GuildBanned) {
            // Return the 'error'
            message.channel.send({ content: bannedStatement(message.author, message.guild, banned ? 'U' : 'G', banned ? user : guild) }).catch(console.log);
            message.react('❌').catch(console.log);
            message.react('🔨').catch(console.log);
            return;
        }
        if (timed) {
            // Return the 'error'
            message.channel.send({ content: `${message.author} You are in slowmode. Please wait ${((Date.now() - user.lastMessage) - config_1.SLOWMODE_TIME) * -1}ms before sending another message.` }).catch(console.log);
            message.react('❌').catch(console.log);
            message.react('⏲️').catch(console.log);
            return;
        }
        if (scanned.phrases == 0) {
            // Warn the user
            const r = user.warnUser('Use of a banned phrase', null);
            message.react('❌').catch(console.log);
            if (r == 1) {
                // Return the 'error'
                message.channel.send({ content: `${message.author} You have been warned for using a banned phrase.` }).catch(console.log);
            }
            if (r == 2) {
                // Return the 'error'
                message.channel.send({ content: `${message.author} You have been temp-banned for using a banned phrase. | Warning escalation policy mandates that after your ${config_1.WARN_ESCALATION_THRESHOLD}${textAfterNumber(config_1.WARN_ESCALATION_THRESHOLD)} warn you must be temp-banned.` }).catch(console.log);
            }
            return;
        }
        if (scanned.badLink) {
            // Warn the user
            const r = user.warnUser('Use of a banned link', null);
            message.react('❌').catch(console.log);
            if (r == 1) {
                // Return the 'error'
                message.channel.send({ content: `${message.author} You have been warned for using a banned link.` }).catch(console.log);
            }
            if (r == 2) {
                // Return the 'error'
                message.channel.send({ content: `${message.author} You have been temp-banned for using a banned link. | Warning escalation policy mandates that after your ${config_1.WARN_ESCALATION_THRESHOLD}${textAfterNumber(config_1.WARN_ESCALATION_THRESHOLD)} warn you must be temp-banned.` }).catch(console.log);
            }
            return;
        }
        if (!scanned.allow_length) {
            // Refuse to send the message (Not warning due to it hardly being a problem, just better for logging reasons)
            message.react('❌').catch(console.log);
            message.channel.send({ content: `${message.author} Your message is too long | Over ${config_1.AUTOMOD_MAX_LENGTH}.` }).catch(console.log);
            return;
        }
        if (scanned.ping) {
            // Refuse to send the message (I'm not warning as this is a common thing between alot of users)
            message.react('❌').catch(console.log);
            message.channel.send({ content: `${message.author} You cannot send pings accorss the network.` }).catch(console.log);
            return;
        }
        // Figure out media, stickers and attatchments
        const media = message.attachments.map(a => a.url);
        const stickers = message.stickers.map(s => s.url);
        if ((scanned.link || media.length > 0 || stickers.length > 0) && !(user.messageCount >= 100)) {
            // Refuse to send the message (Don't warn as the user is possibly new)
            message.react('❌').catch(console.log);
            message.channel.send({ content: `${message.author} You need to send 100 messages before you can send media.` }).catch(console.log);
            return;
        }
        // Gets the emoji instead of the whole class
        const guildBadges = guild.enabledBadges.map(b => b.emoji);
        const userBadges = user.enabledBadges.map(b => b === null || b === void 0 ? void 0 : b.emoji);
        // Webhook content
        const webhookString = `${message.content}${media.length > 0 ? `\n${media.join(' | ')}` : ''}${stickers.length > 0 ? `\n${stickers.join(' | ')}` : ''}`;
        const webhook_filt = `<Message content hidden due to server filters>`;
        // Channel content
        // [guildName guildBadges] userName#userDiscriminator userBadges: messageContent attatchments/stickers (It looks more complex than it is)
        const content = `[${guild.guild.name}${guildBadges.length > 0 ? ` (${guildBadges.join(' ')})` : ''}] ${message.author.username}#${message.author.discriminator}${userBadges.length > 0 ? userBadges.join(' ') : ''}: ${webhookString}`;
        const filteredContent = `[Globus Network${BadgeMap.official}] ${(_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.tag}${BadgeMap.staff}: ${webhook_filt}`;
        // Other webhook data
        const username = message.author.tag;
        const avatar = ((_b = message.author.avatar) === null || _b === void 0 ? void 0 : _b.startsWith('a_')) ? message.author.avatarURL({ extension: 'gif', size: 4096 }) : message.author.avatarURL({ extension: 'webp', size: 4096 });
        // Failsafe
        const _username = (_c = client.user) === null || _c === void 0 ? void 0 : _c.tag;
        const _avatar = (_d = client.user) === null || _d === void 0 ? void 0 : _d.avatarURL({ extension: 'webp', size: 4096 });
        (0, __send_1.NetworkSend)(client, {
            ch: content,
            wh: webhookString,
        }, {}, {
            norm: {
                username: username,
                avatarURL: avatar,
            },
            fail: {
                username: _username,
                avatarURL: _avatar,
            },
        }, {
            limit_Level: scanned.phrases,
            limit_Exceeded_string: filteredContent,
            limit_Exceeded_string_wh: webhook_filt
        });
    });
}
exports.CustomNetworkMessage = CustomNetworkMessage;
function bannedStatement(user, guild, banned, bannedItem) {
    var _a, _b;
    if (banned === 'G') {
        return `${guild.name} is banned from using servernet for ${((_a = bannedItem.ban) === null || _a === void 0 ? void 0 : _a.reason) || 'no reason'}. Please ask the server owner nicely to submit a server appeal.`;
    }
    return `${user.username}, you banned from using servernet for ${((_b = bannedItem.ban) === null || _b === void 0 ? void 0 : _b.reason) || 'no reason'}. Please submit an appeal.`;
}
function textAfterNumber(number) {
    if (number === 1 || (number > 20 && (number % 10 == 1)))
        return 'st';
    if (number === 2 || (number > 20 && (number % 10 == 2)))
        return 'nd';
    if (number === 3 || (number > 20 && (number % 10 == 3)))
        return 'rd';
    return 'th';
}
