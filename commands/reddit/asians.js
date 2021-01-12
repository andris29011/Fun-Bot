const SubredditCommand = require('../../structures/Subreddit');
const { list } = require("../../util/util");
const subreddits = require('../../resources/json/asians');

module.exports = class AsiansCommand extends SubredditCommand {
	constructor(client) {
		super(client, {
			name: 'asians',
			group: 'reddit',
			memberName: 'asians',
			description: 'Responds with a picture from Narkrai\'s favorite subreddits.',
			details: `**Subreddits** = ${subreddits.join(', ')}`,
			clientPermissions: ['EMBED_LINKS'],
			nsfw: true,
			postType: 'image',
			getIcon: true,
			hidden: true,
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