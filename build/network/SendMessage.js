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
exports.CustomNetworkMessage = void 0;
const discord_js_1 = require("discord.js");
const scanMessage_1 = require("./functions/scanMessage");
const Network_User_1 = require("../classes/Network_User");
const config_1 = require("../config");
const Network_Guild_1 = require("../classes/Network_Guild");
const Network_Channel_1 = require("../classes/Network_Channel");
function CustomNetworkMessage(client, message) {
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
                message.channel.send({ content: `${message.author} You have been temp-banned for using a banned phrase. | Warning escalation policy mandates that after your x warn you must be temp-banned.` }).catch(console.log);
            }
            return;
        }
        //NetworkSend(client, message, data, webhookOpts);
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
