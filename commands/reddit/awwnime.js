const SubredditCommand = require('../../structures/Subreddit');

module.exports = class AwwnimeCommand extends SubredditCommand {
	constructor(client) {
		super(client, {
			name: 'awwnime',
			aliases: ['aww-anime', 'moe'],
			group: 'reddit',
			memberName: 'awwnime',
			description: 'Responds with cute random anime art from **/r/awwnime**.',
			clientPermissions: ['EMBED_LINKS'],
			postType: 'image',
			getIcon: true,
			subreddit: 'awwnime'
		});
	}

	generateText(post, subreddit, icon) {
		return this.makeEmbed(post, subreddit, icon);
	}
};