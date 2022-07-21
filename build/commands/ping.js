"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const discord_js_1 = require("discord.js");
const Command_1 = require("../classes/Command");
function run(client, message, args) {
    message.reply({ content: 'Pong :D' }).catch(console.log);
}
function run_c(client, interaction) {
    interaction.reply({ content: 'Pong :D', ephemeral: true }).catch(console.log);
}
exports.command = new Command_1.Command({
    name: 'ping',
    description: 'Replies with pong',
    help: {
        Display: false
    },
    slashEnabled: true,
    SlashCommandData: new discord_js_1.SlashCommandBuilder()
}).set_msg(run).set_intcmd(run_c);
