const json = require('./badge_data.json');
import * as MAP from '../maps/badge_mappings';

export class Badge {
    name: string;
    id: string;
    description: string;
    slot?: number;
    allowedSlots: number[];
    slots: boolean[];

    constructor(name: string, id: string, description: string, slot?: number) {
        this.name = name;
        this.id = id;
        this.description = description;
        this.slot = slot;

        this.slots = [json.Allowed_Slot_1.includes(this.id), json.Allowed_Slot_2.includes(this.id), json.Allowed_Slot_3.includes(this.id), json.Allowed_Slot_4.includes(this.id)];
        this.allowedSlots = [1, 2, 3, 4].filter(i => this.slots[i - 1]);
    }

    get JSON(): JSON_EXP {
        return {
            name: this.name,
            id: this.id,
            description: this.description,
            slot: this.slot
        }
    }

    get emoji(): string {
        return MAP[this.id];
    }
}

interface JSON_EXP {
    name: string;
    id: string;
    description: string;
    slot?: number;
}