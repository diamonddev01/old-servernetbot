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
exports.Badge = void 0;
const json = require('./badge_data.json');
const MAP = __importStar(require("../maps/badge_mappings"));
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
    get emoji() {
        return MAP[this.id];
    }
}
exports.Badge = Badge;
