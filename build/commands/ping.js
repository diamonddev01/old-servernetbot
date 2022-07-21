"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const Command_1 = require("../classes/Command");
function run(client, message, args) {
    message.reply({ content: 'Pong :D' }).catch(console.log);
}
exports.command = new Command_1.Command({
    name: 'ping',
    description: 'Replies with pong',
    help: {
        Display: false
    }
}).set_msg(run);
