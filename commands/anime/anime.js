const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { cleanAnilistHTML } = require("../../util/util");

const { ANILIST_USERNAME } = require("../../config.json");
const searchGraphQL = stripIndents`
	query ($search: String, $type: MediaType, $isAdult: Boolean) {
		anime: Page (perPage: 10) {
			results: media (type: $type, isAdult: $isAdult, search: $search) {
				id
				title {
					english
					romaji
				}
			}
		}
	}
`;
const resultGraphQL = stripIndents`
	query media($id: Int, $type: MediaType) {
		Media(id: $id, type: $type) {
			id
			idMal
			title {
				english
				romaji
			}
			coverImage {
				large
				medium
			}
			startDate { year }
			description(asHtml: false)
			season
			type
			siteUrl
			status
			episodes
			isAdult
			meanScore
			averageScore
			externalLinks {
				url
				site
			}
		}
	}
`;
const personalGraphQL = stripIndents`
	query ($name: String, $type: MediaType) {
		MediaListCollection(userName: $name, type: $type) {
			lists {
				entries {
					mediaId
					score(format: POINT_10)
					status
				}
				name
			}
		}
	}
`;
const seasons = {
    WINTER: 'Winter',
    SPRING: 'Spring',
    SUMMER: 'Summer',
    FALL: 'Fall'
};
const statuses = {
    FINISHED: 'Finished',
    RELEASING: 'Releasing',
    NOT_YET_RELEASED: 'Unreleased',
    CANCELLED: 'Cancelled'
};

module.exports = class AnimeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'anime',
            aliases: [],
            group: 'anime',
            memberName: 'anime',
            description: 'Query AniList for an anime entry.',
            clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'AniList',
					url: 'https://anilist.co/',
					reason: 'API',
					reasonURL: 'https://anilist.gitbook.io/anilist-apiv2-docs/'
                },
            ],
            args: [
                {
                    key: 'query',
                    prompt: 'What anime to search on AniList ?',
                    type: 'string'
                }
            ]
        });
        this.personalList = null;
    }

    async run(message, { query }) {
        try {
            const id = await this.search(query);
            if (!id) return message.say('Could not find any results.');
            const anime = await this.fetchAnime(id);
            if (!this.personalList) await this.fetchPersonalList();
            const entry = this.personalList.find(ani => ani.mediaId === id);
            const embed = new MessageEmbed()
                .setColor(0x02A9FF)
                .setAuthor('AniList', 'https://i.imgur.com/iUIRC7v.png', 'https://anilist.co/')
                .setURL(anime.siteUrl)
                .setThumbnail(anime.coverImage.large || anime.coverImage.medium || null)
                .setTitle(anime.title.english || anime.title.romaji)
                .setDescription(anime.description ? cleanAnilistHTML(anime.description) : 'No description.')
                .addField('❯ Status', statuses[anime.status], true)
                .addField('❯ Episodes', anime.episodes || '???', true)
                .addField('❯ Season', anime.season ? `${seasons[anime.season]} ${anime.startDate.year}` : '???', true)
                .addField('❯ Average Score', anime.averageScore ? `${anime.averageScore}%` : '???', true)
                .addField(`❯ ${ANILIST_USERNAME}'s Score`, entry && entry.score ? `${entry.score}/10` : '???', true)
                .addField('❯ External Links', anime.externalLinks.length
                    ? anime.externalLinks.map(link => `[${link.site}](${link.url})`).join(', ')
                    : 'None');
            return message.embed(embed);
        } catch (err) {
            return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }

    async search(query) {
        const { body } = await request
            .post('https://graphql.anilist.co/')
            .send({
                variables: {
                    search: query,
                    type: 'ANIME'
                },
                query: searchGraphQL
            });
        if (!body.data.anime.results.length) return null;
        return body.data.anime.results[0].id;
    }

    async fetchAnime(id) {
        const { body } = await request
            .post('https://graphql.anilist.co/')
            .send({
                variables: {
                    id,
                    type: 'ANIME'
                },
                query: resultGraphQL
            });
        return body.data.Media;
    }

    async fetchPersonalList() {
        if (this.personalList) return this.personalList;
        const { body } = await request
            .post('https://graphql.anilist.co/')
            .send({
                variables: {
                    name: ANILIST_USERNAME,
                    type: 'ANIME'
                },
                query: personalGraphQL
            });
        const { lists } = body.data.MediaListCollection;
        this.personalList = [];
        for (const list of Object.values(lists)) this.personalList.push(...list.entries);
        setTimeout(() => { this.personalList = null; }, 3.6e+6);
        return this.personalList;
    }
};
