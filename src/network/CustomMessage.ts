import { Attachment, Embed, Sticker, Component } from "discord.js";
import { Client } from "../modified";
import { NetworkSend } from "./__send";

export function CustomNetworkMessage(client: Client, message: string, data: OtherData, webhookOpts: OptionalWebhookConfig) {
    NetworkSend(client, message, data, webhookOpts);
}

interface OptionalWebhookConfig {
    avatarURL?: string;
    username?: string;
}

interface OtherData {
    embeds?: Embed[];
    files?: any[];
    stickers?: Sticker[];
    components?: Component[];
    attatchments?: Attachment[];
}