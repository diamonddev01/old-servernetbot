import { Client } from "../modified";
import { LOGGER_ENABLED, LOGGER_CHANNEL } from "../config";
import { GuildLogger } from "./subLoggers/guildLogger";
import { UserLogger } from "./subLoggers/userLogger";
import { LoggerConfig } from "../types/Logging";

export class Logger {
    client: Client;
    user: UserLogger;
    guild: GuildLogger;
    configuration: LoggerConfig;

    constructor(client: Client) {
        this.client = client;

        this.configuration = {
            enabled: LOGGER_ENABLED,
            channel: LOGGER_CHANNEL
        }

        this.guild = new GuildLogger(this.client, this);
        this.user = new UserLogger(this.client, this);
    }
}