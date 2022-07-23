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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = exports.TimeManager = void 0;
const idMaker_1 = require("../functions/idMaker");
const db = __importStar(require("quick.db"));
class TimeManager {
    constructor(client) {
        this.activeTimers = [];
        this.client = client;
        this.loadTimers();
        setInterval(this.saveTimers, 60000);
    }
    loadTimers() {
        const timers = db.get('timers');
        if (timers === null) {
            return;
        }
        this.activeTimers = JSON.parse(timers);
        for (const timer of this.activeTimers) {
            this.addTimer(timer);
        }
    }
    addTimer(timer) {
        this.activeTimers.push(timer);
        if (timer.finishTime < Date.now()) {
            this.timerFinish(timer.id);
        }
        setTimeout(this.timerFinish, timer.finishTime - Date.now(), timer.id);
        this.saveTimers();
    }
    clearTimer(id, call) {
        const index = this.activeTimers.findIndex(timer => timer.id === id);
        if (index === -1) {
            return;
        }
        if (call) {
            this.activeTimers[index].finished(this.client);
        }
        this.activeTimers.splice(index, 1);
        this.saveTimers();
    }
    timerFinish(id) {
        this.clearTimer(id, true);
    }
    saveTimers() {
        db.set('timers', JSON.stringify(this.activeTimers));
    }
}
exports.TimeManager = TimeManager;
class Timer {
    constructor(id, finishTime, callback, value) {
        this.id = id || (0, idMaker_1.makeID)().toString();
        this.finishTime = finishTime;
        this.callback = callback;
        this.value = value;
    }
    finished(client) {
        this.callback(client, this.value);
    }
    get JSON() {
        return {
            id: this.id,
            finishTime: this.finishTime,
            callback: this.callback,
            value: this.value
        };
    }
}
exports.Timer = Timer;
