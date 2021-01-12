const { Command } = require('discord.js-commando');

module.exports = class PruneCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'prune',
			aliases: [],
			group: 'utility',
			memberName: 'prune',
			description: 'Prune messages (99 by default) in the current text channel.',
			guildOnly: true,
			args: [
				{
					key: 'amount',
					prompt: 'How many messages should be pruned?',
					type: 'integer',
					default: 99,
				},
			],
		});
    }
    
    run(message, {amount}) {
		message.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			message.say('there was an error trying to prune messages in this channel!');
		});
	}
};