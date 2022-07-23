"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Warning = void 0;
class Warning {
    constructor(id, message, time, moderator) {
        this.id = id;
        this.message = message;
        this.time = time;
        this.moderatorID = moderator;
    }
    get JSON() {
        return {
            id: this.id,
            message: this.message,
            time: this.time,
            moderatorID: this.moderatorID
        };
    }
}
exports.Warning = Warning;
