const { Command } = require('discord.js-commando');
const { canModifyQueue } = require("../../util/util");

module.exports = class StopCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            aliases: [],
            group: 'audio',
            memberName: 'stop',
            description: 'Stop the queue.',
            guildOnly: true,
        });
    }

    run(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);
        if (!canModifyQueue(message.member)) return;

        queue.songs = [];
        queue.connection.dispatcher.end();
        message.say(`${message.author} ⏹ stopped the music!`).catch(console.error);
    }
};