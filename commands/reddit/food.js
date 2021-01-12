const SubredditCommand = require('../../structures/Subreddit');
const { list } = require("../../util/util");
const subreddits = require('../../resources/json/food');

module.exports = class FoodCommand extends SubredditCommand {
	constructor(client) {
		super(client, {
			name: 'food',
			group: 'reddit',
			memberName: 'food',
			description: 'Responds with a picture from a food subreddits.',
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