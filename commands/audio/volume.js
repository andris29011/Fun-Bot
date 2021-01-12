const { Command } = require('discord.js-commando');
const { canModifyQueue } = require("../../util/util");

module.exports = class VolumeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'volume',
            aliases: ['v'],
            group: 'audio',
            memberName: 'volume',
            description: 'Change the volume (0 to 100) of the youtube player.',
            guildOnly: true,
            args: [
                {
                    key: 'volume',
                    prompt: 'Volume to set (0 to 100)?',
                    type: 'integer',
                    validate: volume => volume <= 0 && volume >= 100,
                    default: 50,
                },
            ],
        });
    }

    run(message, { volume }) {
        const queue = message.client.queue.get(message.guild.id);

        if (!queue) {
            return message.reply("There is nothing playing.").catch(console.error);
        }

        if (!canModifyQueue(message.member)) {
            return message.reply("You need to join a voice channel first!").catch(console.error);
        }

        queue.volume = volume;
        queue.connection.dispatcher.setVolumeLogarithmic(volume / 100);

        return queue.textChannel.send(`Volume set to: **${volume}%**`).catch(console.error);
    }

};