import { Client } from '../modified';

export function event(client: Client) {
    console.log('REGISTERING SLASH COMMANDS');

    // Register slash commands
    client.registerSlash();
}