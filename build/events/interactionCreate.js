"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
function event(client, interaction) {
    // Check if its a commandInteraction
    if (interaction.type == discord_js_1.InteractionType.ApplicationCommand)
        CommandHandle(client, interaction);
    if (interaction.type == discord_js_1.InteractionType.MessageComponent && interaction.isButton())
        ButtonHandler(client, interaction);
}
exports.event = event;
function CommandHandle(client, interaction) {
    const cmdName = interaction.commandName;
    const cmd = client.commands.get(cmdName);
    if (cmd) {
        cmd.evt_command(client, interaction);
    }
}
function ButtonHandler(client, interaction) {
    // Get the name of the button
    const buttonName = interaction.customId;
    // Find out if the button is logged to the setup system
    const OwningMessage = interaction.message;
    const setup = client;
}
