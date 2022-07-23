import { makeID } from "../functions/idMaker";
import { Client } from "./Client";
import * as db from "quick.db";

export class TimeManager {
    client: Client;
    activeTimers: Timer[] = [];

    constructor(client: Client) {
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

    addTimer(timer: Timer) {
        this.activeTimers.push(timer);

        if (timer.finishTime < Date.now()) {
            this.timerFinish(timer.id);
        }

        setTimeout(this.timerFinish, timer.finishTime - Date.now(), timer.id);

        this.saveTimers();
    }

    clearTimer(id: string, call?: boolean) {
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

    timerFinish(id: string) {
        this.clearTimer(id, true);
    }

    saveTimers() {
        db.set('timers', JSON.stringify(this.activeTimers));
    }
}

export class Timer {
    id: string;
    finishTime: number;
    callback: (client: Client, value: any) => void;
    value: any;

    constructor(id: string | undefined, finishTime: number, callback: (client: Client, value: any) => void, value: any) {
        this.id = id || makeID().toString();
        this.finishTime = finishTime;
        this.callback = callback;
        this.value = value;
    }

    finished(client: Client) {
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