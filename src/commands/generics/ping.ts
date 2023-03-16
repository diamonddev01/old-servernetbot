import { Command } from "../../classes/Command";
import { GuildTextBasedChannel } from 'discord.js';

export const command = new Command({
    name: "ping",
    description: "Gets the bot ping",
    aliases: ["wsping", "ws"],
    slashEnabled: false,
    messageEnabled: true,

    async message(client, message, args) {
        if (!("send" in message.channel)) return;
        const startTime = Date.now();
        const msg = await message.reply({ content: 'Pinging...' }).catch();
        if (!msg) return message.channel.send({ content: 'Failed' }).catch();

        msg.edit({ content: `Pong!\nWS: ${client.ws.ping}ms\nCMD: ${msg.createdTimestamp - startTime}ms\nSYS: ${Date.now() - startTime}ms` }).catch();
    },
});