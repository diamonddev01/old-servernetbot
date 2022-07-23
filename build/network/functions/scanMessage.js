"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scan = exports.scan_t = void 0;
const badPhrases_json_1 = __importDefault(require("../badPhrases/badPhrases.json"));
const config_1 = require("../../config");
const https_1 = require("https");
function scan_t(content) {
    content = content.toLowerCase();
    if (badPhrases_json_1.default.disallow.some(v => content.includes(v)))
        return 0;
    if (badPhrases_json_1.default.nsfw.some(v => content.includes(v)))
        return 1;
    if (badPhrases_json_1.default.minor.some(v => content.includes(v)))
        return 2;
    if (badPhrases_json_1.default.mid.some(v => content.includes(v)))
        return 3;
    return 10;
}
exports.scan_t = scan_t;
function scan(message) {
    return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
        // Detect Links
        const content = message.content.toLowerCase();
        const link = config_1.AUTOMOD_DEFINE_LINK.some(v => content.includes(v));
        // Detect pings
        let ping = false;
        ping = message.mentions.users.size > 0;
        ping = ping ? true : message.mentions.roles.size > 0;
        ping = ping ? true : message.mentions.everyone;
        ping = ping ? true : message.content.includes("@here");
        ping = ping ? true : message.content.includes("@everyone");
        // Detect bad links
        const badLink = yield badLinkCheck(content);
        let data = {
            link,
            allow_length: message.content.length <= config_1.AUTOMOD_MAX_LENGTH,
            phrases: scan_t(message.content),
            ping,
            badLink
        };
        res(config_1.AUTOMOD_ENABLED ? data : { link: false, allow_length: true, phrases: 10, ping: false, badLink: false });
    }));
}
exports.scan = scan;
// External to help https
function badLinkCheck(content) {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        (0, https_1.get)(`https://badlink.diamondstudios.tk/discord?message="${content}"`, res => {
            res.on('data', d => {
                resolve(JSON.parse(d));
            });
        });
    }));
}
/*
A RETURN OF 0 IS BANNED
A RETURN OF 1 IS NSFW
A RETURN OF 2 IS MID FILTERED TERMS
A RETURN OF 3 IS MINOR FILTERED TERMS. LEVEL 3 ALSO BANS LINKS/MEDIA

DEFAULT OF 2
*/ 
