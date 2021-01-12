const { Command } = require('discord.js-commando');
const { canModifyQueue } = require("../../util/util");

module.exports = class PauseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pause',
            aliases: [],
            group: 'audio',
            memberName: 'pause',
            description: 'Pause or unpause the youtube player.',
            guildOnly: true,
        });
    }

    run(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);
        if (!canModifyQueue(message.member)) return;

        if (queue.playing) {
            queue.playing = false;
            queue.connection.dispatcher.pause(true);
            return queue.textChannel.send(`${message.author} ⏸ paused the music.`).catch(console.error);
        } else {
            queue.playing = true;
            queue.connection.dispatcher.resume();
            return queue.textChannel.send(`${message.author} ⏯ resumed the music.`).catch(console.error);
        }
    }
};