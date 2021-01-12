const { Command } = require('discord.js-commando');
const { MessageEmbed } = require("discord.js");
const { play } = require("../../include/play");
const { YOUTUBE_API_KEY, MAX_PLAYLIST_SIZE } = require("../../config.json");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

const { PRUNING } = require("../../config.json");

module.exports = class PlaylistCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'playlist',
            aliases: ['pl'],
            group: 'audio',
            memberName: 'playlist',
            description: 'Add a YouTube playlist to the server queue.',
            guildOnly: true,
            clientPermissions: ['CONNECT', 'SPEAK'],
			args: [
				{
					key: 'link',
					prompt: 'Youtube playlist link',
					type: 'string',
                },
			],
        });
    }

    async run(message, {link}) {
        const { channel } = message.member.voice;

        const serverQueue = message.client.queue.get(message.guild.id);
        if (serverQueue && channel !== message.guild.me.voice.channel)
            return message.reply(`You must be in the same channel as ${message.client.user}`).catch(console.error);

        if (!channel) return message.reply("You need to join a voice channel first!").catch(console.error);

        const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
        const urlValid = pattern.test(link);

        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: 25,
            playing: true
        };

        let song = null;
        let playlist = null;
        let videos = [];

        if (urlValid) {
            try {
                playlist = await youtube.getPlaylist(link, { part: "snippet" });
                videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
            } catch (error) {
                console.error(error);
                return message.reply("Playlist not found :(").catch(console.error);
            }
        } else {
            
            return message.reply("Playlist not found :(").catch(console.error);

        }

        videos.forEach((video) => {
            song = {
                title: video.title,
                url: video.url,
                duration: video.durationSeconds
            };

            if (serverQueue) {
                serverQueue.songs.push(song);
                if (!PRUNING)
                    message.channel
                        .send(`✅ **${song.title}** has been added to the queue by ${message.author}`)
                        .catch(console.error);
            } else {
                queueConstruct.songs.push(song);
            }
        });

        let playlistEmbed = new MessageEmbed()
            .setTitle(`${playlist.title}`)
            .setURL(playlist.url)
            .setColor("#F8AA2A")
            .setTimestamp();

        if (!PRUNING) {
            playlistEmbed.setDescription(queueConstruct.songs.map((song, index) => `${index + 1}. ${song.title}`));
            if (playlistEmbed.description.length >= 2048)
                playlistEmbed.description =
                    playlistEmbed.description.substr(0, 2007) + "\nPlaylist larger than character limit...";
        }

        message.channel.send(`${message.author} Started a playlist`, playlistEmbed);

        if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);

        if (!serverQueue) {
            try {
                const connection = await channel.join();
                queueConstruct.connection = connection;
                play(queueConstruct.songs[0], message);
            } catch (error) {
                console.error(`Could not join voice channel: ${error}`);
                message.client.queue.delete(message.guild.id);
                await channel.leave();
                return message.channel.send(`Could not join the channel: ${error}`).catch(console.error);
            }
        }
    }

};