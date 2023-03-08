import { Client } from "../../classes/Client";

export function event(client: Client) {
    client.registerCommands();

    console.log(client.user?.username + " is now active");
}