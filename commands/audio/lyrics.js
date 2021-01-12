const { Command } = require('discord.js-commando');
const lyricsFinder = require("lyrics-finder");
const { MessageEmbed } = require("discord.js");

module.exports = class LyricsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lyrics',
            aliases: [],
            group: 'audio',
            memberName: 'lyrics',
            description: 'Find the lyrics of the current song.',
            guildOnly: true,
            args: [
				{
					key: 'title',
					prompt: 'What is the title of the song ?',
                    type: 'string',
                    default: ''
                }, 
                {
					key: 'artist',
					prompt: 'Who is the artist of the song ?',
                    type: 'string',
                    default: ''
                }
			],
        });
    }

    async run(message, {title, artist}) {

        let usingQueue = false;

        if (title === ''){
            const queue = message.client.queue.get(message.guild.id);
            if (!queue) return message.channel.send("There is nothing playing.").catch(console.error);

            title = queue.songs[0].title;
            artist = '';
            usingQueue = true;
        }

        let lyrics = await lyricsFinder(title, artist);

        if (lyrics === ''){
            if (usingQueue){
                lyrics = `No lyrics found for ${title} in queue. Try manual search : \`lyrics <title> <artist>\` `;
            } else {
                lyrics = `No lyrics found for ${title}.`;
            }
        }

        let lyricsEmbed = new MessageEmbed()
            .setTitle("Lyrics")
            .setDescription(lyrics)
            .setColor("#F8AA2A")
            .setTimestamp();

        if (lyricsEmbed.description.length >= 2048)
            lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
        return message.channel.send(lyricsEmbed).catch(console.error);
    }
};