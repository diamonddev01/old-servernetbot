import { Client } from '../../modified';
import { Warning } from '../Warn';
import { LOGGER_CHANNEL } from '../../config';
import { NetworkUser } from '../Network_User';
import { Logger } from '../logger';

export class UserLogger {
    client: Client;
    logger: Logger;
    
    constructor(client: Client, logger: Logger) {
        this.client = client;
        this.logger = logger;
    }

    async warn(warning: Warning, user: NetworkUser) {
        const channel = this.client.channels.cache.get(LOGGER_CHANNEL) || await this.client.channels.fetch(LOGGER_CHANNEL).catch(console.log);

        // Exit if no channel is defined. Also patch some compiler issues.
        if (!channel || !channel.send) { 
            return false;
        }

        const moderator = warning.moderatorID ? warning.moderatorID : "829383622439206993";

        channel.send({
            content: `[⚠️] \`${user.User.tag}\` (\`${user.User.id}\`) has been warned for: \`${warning.message}\` by <@!${moderator}>`
        }).catch(console.log);

        return true;
    }

    async ban(user: NetworkUser, reason: string, modID: string | null) {
        const channel = this.client.channels.cache.get(LOGGER_CHANNEL) || await this.client.channels.fetch(LOGGER_CHANNEL).catch(console.log);

        // Exit if no channel is defined. Also patch some compiler issues.
        if (!channel || !channel.send) {
            return false;
        }

        const moderator = modID ? modID : "829383622439206993";

        channel.send({
            content: `[🔨] \`${user.User.tag}\` (\`${user.User.id}\`) has been banned for: \`${reason}\` by <@!${moderator}>`
        }).catch(console.log);

        return true;
    }

    async unban(user: NetworkUser, modID: string | null) {
        const channel = this.client.channels.cache.get(LOGGER_CHANNEL) || await this.client.channels.fetch(LOGGER_CHANNEL).catch(console.log);

        // Exit if no channel is defined. Also patch some compiler issues.
        if (!channel || !channel.send) {
            return false;
        }

        const moderator = modID ? modID : "829383622439206993";

        channel.send({
            content: `[🔨] \`${user.User.tag}\` (\`${user.User.id}\`) has been unbanned by <@!${moderator}>`
        }).catch(console.log);

        return true;
    }
}

/*
NOTE

Ignore the warnings on the .send in if statements. This is just the compiler being the compiler. This issue will never exist when running.

Secondly the return true doesnt mean that the message has been sent, more that the logger hasnt encountered a major issue.
*/