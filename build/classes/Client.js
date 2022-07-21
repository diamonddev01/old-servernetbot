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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const discord_js_1 = require("discord.js");
const rest_1 = require("@discordjs/rest");
const token_1 = require("../__hdn/token");
class Client extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.commands = new discord_js_1.Collection();
        this.slashCommands = [];
    }
    addSlashCommand(cmd) {
        this.slashCommands.push(cmd);
    }
    registerSlash() {
        return __awaiter(this, void 0, void 0, function* () {
            const rest = new rest_1.REST({ version: '9' }).setToken(token_1.token);
            const guilds = this.guilds.cache.map(g => g.id);
            if (!this.user)
                return;
            let errs = [];
            for (const guild of guilds) {
                try {
                    yield rest.put(discord_js_1.Routes.applicationGuildCommands(this.user.id, guild), { body: this.slashCommands }).then(() => {
                        var _a;
                        console.log(`[/] Loaded slash commands in guild "${(_a = this.guilds.cache.get(guild)) === null || _a === void 0 ? void 0 : _a.name}" (${guild})`);
                    }).catch(e => console.log(JSON.stringify(e)));
                }
                catch (err) {
                    errs.push(err);
                }
            }
            console.log('[%] Servernet is now online with ' + errs.length + ' errors');
            for (const e of errs) {
                console.error(e);
            }
        });
    }
}
exports.Client = Client;
