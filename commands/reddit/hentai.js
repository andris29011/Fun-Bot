const SubredditCommand = require('../../structures/Subreddit');
const { list } = require("../../util/util");
const subreddits = require('../../resources/json/hentai');

module.exports = class HentaiCommand extends SubredditCommand {
	constructor(client) {
		super(client, {
			name: 'hentai',
			group: 'reddit',
			memberName: 'hentai',
			description: 'Responds with a random hentai image.',
			details: `**Subreddits** = ${subreddits.join(', ')}`,
			clientPermissions: ['EMBED_LINKS'],
			nsfw: true,
			postType: 'image',
			getIcon: true,
			args: [
				{
					key: 'subreddit',
					prompt: `What subreddit do you want to get hentai from? Either ${list(subreddits, 'or')}.`,
					type: 'string',
					oneOf: subreddits,
					default: () => subreddits[Math.floor(Math.random() * subreddits.length)],
					parse: subreddit => subreddit.toLowerCase()
				}
			]
		});
	}

	generateText(post, subreddit, icon) {
		return this.makeEmbed(post, subreddit, icon);
	}
};