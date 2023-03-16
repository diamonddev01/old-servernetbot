import { Client } from "./classes/Client";
import { Command } from "./classes/Command";
import { token } from "./config";
import { readdirSync } from 'fs';

const client = new Client({
    /*
        GUILDS - Needed to access guilds and guild channels.
        GUILD_INTEGRATIONS & GUILD_WEBHOOKS - Needed to use webhook systems.
        GUILD_MESSAGES - To view the messages sent by users.
        MESSAGE_CONTENT - To get the content of the messages.
        GUILD_MESSAGE_REACTIONS - Might be used later on to allow message reporting
    */
    intents: 34353
});

// Read files
const eventFiles = readdirSync('./events/bot/').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const { event } = require(`./events/bot/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
}

const commandDirs = readdirSync('./commands/').filter(file => !file.includes("."));
for (const dir of commandDirs) {
    const directory = readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));
    for (const file of directory) {
        const { command } = require(`./commands/${dir}/${file}`);
        const cmd = command as Command;
        client.commands.set(cmd.name, cmd);
        if (cmd.slashEnabled) {
            const slashData = cmd.getSlash();
            if (!slashData) continue;
            client.addSlashCommand(slashData);
        }
    }
}

client.login(token);