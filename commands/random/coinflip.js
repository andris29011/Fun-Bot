const { Command } = require('discord.js-commando');

module.exports = class CoinflipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'coinflip',
			aliases: ['cf'],
			group: 'random',
			memberName: 'coinflip',
			description: 'Coin flip!',
		});
    }
    
    run(message) {
		let res = Math.round(Math.random());
		return message.say(res === 0 ? 'Tail' : 'Head');
	}
};