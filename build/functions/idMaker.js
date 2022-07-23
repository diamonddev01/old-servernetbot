"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeID = void 0;
function makeID() {
    // Make a twitter snowflake id
    const timeSinceEpoch = Date.now();
    const RND = Math.floor(Math.random() * 1000);
    const id = +`${timeSinceEpoch}${RND}`;
    return id;
}
exports.makeID = makeID;
