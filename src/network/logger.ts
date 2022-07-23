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

        const moderator = warning.moderatorID ? warning.moderatorID : "829383622439206993"

        channel.send({
            content: `[⚠️] \`${user.User.tag}\` (\`${user.User.id}\`) has been warned for: \`${warning.message}\` by <@!${moderator}>`
        }).catch(console.log);
    }

    async log_ban(user: NetworkUser, reason: string, modID: string | null) {
        const channel = this.client.channels.cache.get(LOGGER_CHANNEL) || await this.client.channels.fetch(LOGGER_CHANNEL).catch(console.log);

        if (!channel || !channel.send) {
            return;
        }

        const moderator = modID ? modID : "829383622439206993"

        channel.send({
            content: `[🔨] \`${user.User.tag}\` (\`${user.User.id}\`) has been banned for: \`${reason}\` by <@!${moderator}>`
        }).catch(console.log);
    }

    async log_unban(user: NetworkUser, modID: string | null) {
        const channel = this.client.channels.cache.get(LOGGER_CHANNEL) || await this.client.channels.fetch(LOGGER_CHANNEL).catch(console.log);

        if (!channel || !channel.send) {
            return;
        }

        const moderator = modID ? modID : "829383622439206993"

        channel.send({
            content: `[🔨] \`${user.User.tag}\` (\`${user.User.id}\`) has been unbanned by <@!${moderator}>`
        }).catch(console.log);
    }

    async log_gBan(guild: NetworkGuild, reason: string, modID: string | null) {
        const channel = this.client.channels.cache.get(LOGGER_CHANNEL) || await this.client.channels.fetch(LOGGER_CHANNEL).catch(console.log);

        if (!channel || !channel.send) {
            return;
        }

        const moderator = modID ? modID : "829383622439206993"

        channel.send({
            content: `[🔨] The guild \`${guild.Guild.name}\` (\`${guild.Guild.id}\`) has been banned for: \`${reason}\` by <@!${moderator}>`
        }).catch(console.log);
    }

    async log_gUnban(guild: NetworkGuild, modID: string | null) {
        const channel = this.client.channels.cache.get(LOGGER_CHANNEL) || await this.client.channels.fetch(LOGGER_CHANNEL).catch(console.log);

        if (!channel || !channel.send) {
            return;
        }
        
        const moderator = modID ? modID : "829383622439206993"

        channel.send({
            content: `[🔨] The guild \`${guild.Guild.name}\` (\`${guild.Guild.id}\`) has been unbanned by <@!${moderator}>`
        }).catch(console.log);
    }
}