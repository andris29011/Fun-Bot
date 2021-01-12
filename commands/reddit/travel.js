const SubredditCommand = require('../../structures/Subreddit');
const { list } = require("../../util/util");
const subreddits = require('../../resources/json/travel');

module.exports = class TravelCommand extends SubredditCommand {
	constructor(client) {
		super(client, {
			name: 'travel',
			group: 'reddit',
			memberName: 'travel',
			description: 'Responds with a travel picture from reddit.',
			details: `**Subreddits** = ${subreddits.join(', ')}`,
			clientPermissions: ['EMBED_LINKS'],
			nsfw: false,
			postType: 'image',
			getIcon: true,
			args: [
				{
					key: 'subreddit',
					prompt: `What subreddit do you want to get pictures from? Either ${list(subreddits, 'or')}.`,
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