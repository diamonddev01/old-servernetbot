"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const config_1 = require("../config");
const guildLogger_1 = require("./subLoggers/guildLogger");
const userLogger_1 = require("./subLoggers/userLogger");
class Logger {
    constructor(client) {
        this.client = client;
        this.configuration = {
            enabled: config_1.LOGGER_ENABLED,
            channel: config_1.LOGGER_CHANNEL
        };
        this.guild = new guildLogger_1.GuildLogger(this.client, this);
        this.user = new userLogger_1.UserLogger(this.client, this);
    }
}
exports.Logger = Logger;
