import { DatabaseTables } from './types/config_types';
export { Token as token } from './config.hide';

// Developer Config
export const devMode = true; // Would you like the bot to act in a specific way (intended for development of the bot)
export const slashDevMode = false; // Would you like a specific way of registering slash commands. Check the Client.ts file
export const devGuild = ["YourServer"]; // All development servers
export const developers = ["YourID"]; // All users considered "developers"
export const testers = []; // All users you would like to have access to your bot during devMode (UNAVAILABLE)

// Main Config
export const Prefix = "!"; // What do you want your bot to respond to?

// Database Config
export const DatabaseFile = "../database/database.sqlite"; // Where would you like your database stored? (In relation to this file)
// Mapping of all the tables to their functions. Please note that the default works for most situations.
export const TableLinker: DatabaseTables = {
    users: "users",
    channels: "channels",
    moderations: "moderations",
    guilds: "guilds",
    bagdes: "badges"
}