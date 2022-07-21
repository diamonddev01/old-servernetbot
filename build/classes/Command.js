"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(construct) {
        this.slashEnabled = false;
        const { name, description, help, aliases } = construct;
        this.name = name;
        this.description = description;
        this.help = help;
        this.aliases = aliases;
        if (construct.slashEnabled) {
            if (construct.SlashCommandData) {
                construct.SlashCommandData.setName(this.name);
                construct.SlashCommandData.setDescription(this.description);
                this.slash = construct.SlashCommandData;
                this.slashEnabled = true;
            }
        }
    }
    msg_run(client, message, args) {
        message.channel.send({ content: `Failed to run command ${this.name} - msg_run function not defined.` }); // Return an error code.
    }
    int_run(client, interaction) {
        interaction.reply({ content: `Failed to run command ${this.name} - int_run function not defined`, ephemeral: true }); // Return an error code
    }
    int_other(client, interaction) {
        // Used to parse data for button presses or other items like that.
        return;
    }
    // Allow the command to redefine what happens on a message
    set_msg(func) {
        this.msg_run = func;
        return this;
    }
    set_intcmd(func) {
        this.int_run = func;
        return this;
    }
    set_intother(func) {
        this.int_other = func;
        return this;
    }
    // Stuff that gets called by the event
    evt_msg(c, m, a) {
        try {
            this.msg_run(c, m, a);
        }
        catch (e) {
            console.log(e);
        }
    }
    evt_command(c, i) {
        try {
            this.int_run(c, i);
        }
        catch (e) {
            console.log(e);
        }
    }
    evt_interaction(c, i) {
        // TODO
    }
}
exports.Command = Command;
