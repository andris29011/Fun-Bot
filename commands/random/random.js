const { Command } = require('discord.js-commando');

module.exports = class RandomCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'random',
			aliases: ['rand', 'rnd'],
			group: 'random',
			memberName: 'random',
            description: 'Choose a random number between two bounds.',
            args: [
				{
					key: 'lower',
					prompt: 'Lower bound ?',
                    type: 'integer',
                    default: 0
                }, 
                {
					key: 'upper',
					prompt: 'Upper bound ?',
                    type: 'integer',
                    default: 100
                }
			],
		});
    }
    
    run(message, {lower, upper}) {

        if (lower > upper){
            return message.say(`Lower bound (${lower}) is greater than upper bound (${upper})`);
        }

        let res = Math.round(Math.random() * (upper - lower) + lower);
		return message.say(`I chose : ${res}`);
	}
};