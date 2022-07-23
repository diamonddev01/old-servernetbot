"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomNetworkMessage = void 0;
const __send_1 = require("./__send");
function CustomNetworkMessage(client, message, data, webhookOpts) {
    (0, __send_1.NetworkSend)(client, message, data, webhookOpts);
}
exports.CustomNetworkMessage = CustomNetworkMessage;
