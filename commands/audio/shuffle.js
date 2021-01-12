const { Command } = require('discord.js-commando');
const { canModifyQueue } = require("../../util/util");

module.exports = class PauseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'shuffle',
            aliases: [],
            group: 'audio',
            memberName: 'shuffle',
            description: 'Shuffle the playlist.',
            guildOnly: true,
        });
    }

    run(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);
        if (!canModifyQueue(message.member)) return;
    
        let songs = queue.songs;
        for (let i = songs.length - 1; i > 1; i--) {
          let j = 1 + Math.floor(Math.random() * i);
          [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        queue.songs = songs;
        message.client.queue.set(message.guild.id, queue);
        queue.textChannel.send(`${message.author} 🔀 shuffled the queue`).catch(console.error);
    }
};