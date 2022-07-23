import { Client } from "../modified";
import { Warning } from "../classes/Warn";
import { LOGGER_CHANNEL, LOGGER_ENABLED } from "../config";
import { NetworkUser } from "../classes/Network_User";
import { NetworkGuild } from "../classes/Network_Guild";

export class Logger {
    client: Client
    constructor(client: Client) {
        this.client = client;
    }

    async log_warn(warning: Warning, user: NetworkUser) {
        const channel = this.client.channels.cache.get(LOGGER_CHANNEL) || await this.client.channels.fetch(LOGGER_CHANNEL).catch(console.log);

        if (!channel || !channel.send) {
            return;
        }

        channel.send({
            content: `[⚠️] \`${user.User.tag}\` (\`${user.User.id}\`) has been warned for: \`${warning.message}\` by <@!${warning.moderatorID}>`
        }).catch(console.log);
    }

    async log_ban(user: NetworkUser, reason: string, modID: string) {
        const channel = this.client.channels.cache.get(LOGGER_CHANNEL) || await this.client.channels.fetch(LOGGER_CHANNEL).catch(console.log);

        if (!channel || !channel.send) {
            return;
        }

        channel.send({
            content: `[🔨] \`${user.User.tag}\` (\`${user.User.id}\`) has been banned for: \`${reason}\` by <@!${modID}>`
        }).catch(console.log);
    }

    async log_unban(user: NetworkUser, modID: string) {
        const channel = this.client.channels.cache.get(LOGGER_CHANNEL) || await this.client.channels.fetch(LOGGER_CHANNEL).catch(console.log);

        if (!channel || !channel.send) {
            return;
        }

        channel.send({
            content: `[🔨] \`${user.User.tag}\` (\`${user.User.id}\`) has been unbanned by <@!${modID}>`
        }).catch(console.log);
    }

    async log_gBan(guild: NetworkGuild, reason: string, modID: string) {
        const channel = this.client.channels.cache.get(LOGGER_CHANNEL) || await this.client.channels.fetch(LOGGER_CHANNEL).catch(console.log);

        if (!channel || !channel.send) {
            return;
        }

        channel.send({
            content: `[🔨] The guild \`${guild.Guild.name}\` (\`${guild.Guild.id}\`) has been banned for: \`${reason}\` by <@!${modID}>`
        }).catch(console.log);
    }

    async log_gUnban(guild: NetworkGuild, modID: string) {
        const channel = this.client.channels.cache.get(LOGGER_CHANNEL) || await this.client.channels.fetch(LOGGER_CHANNEL).catch(console.log);

        if (!channel || !channel.send) {
            return;
        }

        channel.send({
            content: `[🔨] The guild \`${guild.Guild.name}\` (\`${guild.Guild.id}\`) has been unbanned by <@!${modID}>`
        }).catch(console.log);
    }
}