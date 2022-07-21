"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import modified classes and/or libraries
const modified_1 = require("./modified");
// Import normal deps
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
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
let slashCommands = [];
const commandFiles = (0, fs_1.readdirSync)('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const { command } = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    let slash = command.slashCommandData;
    if (slash) {
        slashCommands.push(slash);
    }
    console.log(`[>] Loaded Command: ${command.name}`);
}
// Login
client.login('ODM2MDI1ODcyMjgwMTkxMDI2.GZUIQd.C0cw7G43rPyx6I1lNbCcIrFO384gSNEQkX2F8Q');
