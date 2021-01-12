const { Command } = require('discord.js-commando');
const { canModifyQueue } = require("../../util/util");

module.exports = class PauseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'loop',
            aliases: [],
            group: 'audio',
            memberName: 'loop',
            description: 'Toggle music loop.',
            guildOnly: true,
        });
    }

    run(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);
        if (!canModifyQueue(message.member)) return;
    
        // toggle from false to true and reverse
        queue.loop = !queue.loop;
        return queue.textChannel
          .send(`Loop is now ${queue.loop ? "**on**" : "**off**"}`)
          .catch(console.error);
    }
};