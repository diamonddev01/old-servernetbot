"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import modified classes and/or libraries
const modified_1 = require("./modified");
// Import normal deps
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const token_1 = require("./__hdn/token");
const client = new modified_1.Client({
    intents: ['DirectMessages', 'Guilds', 'MessageContent', 'GuildWebhooks', 'GuildMessages'],
    partials: [discord_js_1.Partials.Channel, discord_js_1.Partials.Message, discord_js_1.Partials.User]
});
// Code here
// Connect events
const eventFiles = (0, fs_1.readdirSync)('./events/').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const { event } = require(`./events/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
    console.log(`[!] Loaded Event: ${eventName}`);
}
// Load commands
const commandFiles = (0, fs_1.readdirSync)('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const { command } = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    let slash = command.slashEnabled;
    if (slash) {
        client.addSlashCommand(command.slash);
    }
    console.log(`[>] Loaded Command: ${command.name}`);
}
// Login
client.login(token_1.token);
