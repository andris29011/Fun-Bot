const SubredditCommand = require('../../structures/Subreddit');

module.exports = class AnimemesCommand extends SubredditCommand {
	constructor(client) {
		super(client, {
			name: 'animemes',
			aliases: [],
			group: 'reddit',
			memberName: 'animemes',
			description: 'Responds with an animeme from **/r/Animemes**.',
			clientPermissions: ['EMBED_LINKS'],
			postType: 'image',
			getIcon: true,
			subreddit: 'animemes'
		});
	}

	generateText(post, subreddit, icon) {
		return this.makeEmbed(post, subreddit, icon);
	}
};