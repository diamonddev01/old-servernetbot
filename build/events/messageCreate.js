"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
function event(client, message) {
    const prefix = '>'; // fix soon
    const args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();
    if (!command)
        return;
    // Check command exists
    const cmd = client.commands.get(command) || client.commands.find(c => c.aliases && c.aliases.includes(command)); // Ignore issues
    if (cmd) {
        cmd.evt_msg(client, message, args);
    }
}
exports.event = event;
