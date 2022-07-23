"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomNetworkMessage = void 0;
const Network_User_1 = require("../classes/Network_User");
function CustomNetworkMessage(client, message) {
    const user = new Network_User_1.NetworkUser(message.author);
    const cnt = message.content;
    //NetworkSend(client, message, data, webhookOpts);
}
exports.CustomNetworkMessage = CustomNetworkMessage;
