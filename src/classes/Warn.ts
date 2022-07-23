export class Warning {
    id: string;
    message: string;
    time: number;
    moderatorID?: string;

    constructor(id: string, message: string, time: number, moderator?: string) {
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
        }
    }
}