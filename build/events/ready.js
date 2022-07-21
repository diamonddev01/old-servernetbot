"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
function event(client) {
    console.log('REGISTERING SLASH COMMANDS');
    // Register slash commands
    client.registerSlash();
}
exports.event = event;
