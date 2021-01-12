const { Command } = require('discord.js-commando');
const { canModifyQueue } = require("../../util/util");

module.exports = class SkipCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            aliases: [],
            group: 'audio',
            memberName: 'skip',
            description: 'Skip the current song.',
            guildOnly: true,
        });
    }

    run(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);
        if (!canModifyQueue(message.member)) return;
        queue.connection.dispatcher.end();
        message.say(`${message.author} ⏩ skipped the song`).catch(console.error);
    }
};