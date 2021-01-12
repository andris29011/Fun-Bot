const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");
const { Command } = require('discord.js-commando');

module.exports = class QueueCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            aliases: [],
            group: 'audio',
            memberName: 'queue',
            description: 'Show the current youtube queue',
            guildOnly: true,
        });
    }

    run(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);

        const description = queue.songs.map((song, index) => `${index + 1}. ${escapeMarkdown(song.title)}`);

        let queueEmbed = new MessageEmbed()
            .setTitle("Music queue")
            .setDescription(description)
            .setColor("#F8AA2A");

        const splitDescription = splitMessage(description, {
            maxLength: 2048,
            char: "\n",
            prepend: "",
            append: ""
        });

        splitDescription.forEach(async (m) => {
            queueEmbed.setDescription(m);
            message.channel.send(queueEmbed);
        });
    }

};