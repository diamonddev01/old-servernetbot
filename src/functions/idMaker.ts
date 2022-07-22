export function makeID() {
    // Make a twitter snowflake id
    const timeSinceEpoch = Date.now();
    const RND = Math.floor(Math.random() * 1000);
    const id: number = +`${timeSinceEpoch}${RND}`;

    return id;
}