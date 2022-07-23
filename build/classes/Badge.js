"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Badge = void 0;
const json = require('./badge_data.json');
class Badge {
    constructor(name, id, description, slot) {
        this.name = name;
        this.id = id;
        this.description = description;
        this.slot = slot;
        this.slots = [json.Allowed_Slot_1.includes(this.id), json.Allowed_Slot_2.includes(this.id), json.Allowed_Slot_3.includes(this.id), json.Allowed_Slot_4.includes(this.id)];
        this.allowedSlots = [1, 2, 3, 4].filter(i => this.slots[i - 1]);
    }
    get JSON() {
        return {
            name: this.name,
            id: this.id,
            description: this.description,
            slot: this.slot
        };
    }
}
exports.Badge = Badge;
