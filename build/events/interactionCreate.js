"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
function event(client, interaction) {
    // Check if its a commandInteraction
    if (interaction.type == discord_js_1.InteractionType.ApplicationCommand)
        CommandHandle(client, interaction);
}
exports.event = event;
function CommandHandle(client, interaction) {
    const cmdName = interaction.commandName;
    const cmd = client.commands.get(cmdName);
    if (cmd) {
        cmd.evt_command(client, interaction);
    }
}
