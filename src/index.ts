// Import modified classes and/or libraries
import { Client } from './modified';

// Import normal deps
import { Partials } from 'discord.js';
import { readdirSync } from 'fs';

const client = new Client({
    intents: ['DirectMessages', 'Guilds', 'MessageContent', 'GuildWebhooks', 'GuildMessages'],
    partials: [Partials.Channel, Partials.Message, Partials.User]
});

// Code here

// Connect events
const eventFiles = readdirSync('./events/').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const { event } =require( `./events/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
    console.log(`[!] Loaded Event: ${eventName}`);
}

// Load commands
let slashCommands = [];
const commandFiles = readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const { command } = require( `./commands/${file}`);
    client.commands.set(command.name, command);
    let slash = command.slashCommandData;
    if (slash) {
        slashCommands.push(slash);
    }

    console.log(`[>] Loaded Command: ${command.name}`);
}

// Login
client.login('ODM2MDI1ODcyMjgwMTkxMDI2.GZUIQd.C0cw7G43rPyx6I1lNbCcIrFO384gSNEQkX2F8Q');