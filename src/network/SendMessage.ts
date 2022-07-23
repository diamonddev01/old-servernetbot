import { Message } from "discord.js";
import { Client } from "../modified";
import { NetworkSend } from "./__send";
import { scan } from "./functions/scanMessage";
import { NetworkUser } from "../classes/Network_User";

export function CustomNetworkMessage(client: Client, message: Message) {
    const user = new NetworkUser(message.author);
    const cnt = message.content;

    //NetworkSend(client, message, data, webhookOpts);
}