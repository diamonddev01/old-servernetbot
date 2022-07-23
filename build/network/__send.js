"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkSend = void 0;
const db = __importStar(require("quick.db"));
const idMaker_1 = require("../functions/idMaker");
function NetworkSend(client, message, otherOpts, webhookOpts) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the channels
        const channels = JSON.parse(db.get('channels')) || [];
        // Check if the channel is running webhooks or not
        for (let channel of channels) {
            if (channel.webhook) {
                // Get the webhook
                const webhook = yield client.fetchWebhook(channel.wh.id, channel.wh.token).catch(console.log);
                if (!webhook) {
                    const warn = {
                        id: (0, idMaker_1.makeID)().toString(),
                        reason: 'Could not get webhook',
                        time: Date.now(),
                        type: 'WebhookGetFail'
                    };
                    const CWarns = channel.warnings || [];
                    CWarns.push(warn);
                    // Update the channel
                    channel.warnings = CWarns;
                    channel.warns = CWarns.length;
                    continue;
                }
                ;
                // Send the message
                webhook.send(Object.assign(Object.assign({ content: message }, otherOpts), webhookOpts)).catch(e => {
                    console.error(e);
                    // Create a new channel warning
                    const warn = {
                        id: (0, idMaker_1.makeID)().toString(),
                        reason: 'Webhook failed to send message',
                        time: Date.now(),
                        type: 'WebhookSendFail'
                    };
                    // Add the warning to the channel
                    const CWarns = channel.warnings || [];
                    CWarns.push(warn);
                    // Update the channel
                    channel.warnings = CWarns;
                    channel.warns = CWarns.length;
                });
                continue;
            }
            // Send the message to the channel
            const c = client.channels.cache.get(channel.id) || (yield client.channels.fetch(channel.id).catch(console.log));
            if (!c || !c.send) {
                // Create a new channel warning
                const warn = {
                    id: (0, idMaker_1.makeID)().toString(),
                    reason: 'Channel failed to send load',
                    time: Date.now(),
                    type: 'ChannelGetFail'
                };
                // Add the warning to the channel
                const CWarns = channel.warnings || [];
                CWarns.push(warn);
                continue;
            }
            ;
            c.send(Object.assign({ content: message }, otherOpts)).catch((e) => {
                console.error(e);
                // Create a new channel warning
                const warn = {
                    id: (0, idMaker_1.makeID)().toString(),
                    reason: 'Channel failed to send message',
                    time: Date.now(),
                    type: 'ChannelSendFail'
                };
                // Add the warning to the channel
                const CWarns = channel.warnings || [];
                CWarns.push(warn);
                // Update the channel
                channel.warnings = CWarns;
                channel.warns = CWarns.length;
            });
        }
    });
}
exports.NetworkSend = NetworkSend;
