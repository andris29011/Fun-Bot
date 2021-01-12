const { Command } = require('discord.js-commando');
const request = require('node-superfetch');

module.exports = class CatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cat',
			aliases: [],
			group: 'random',
			memberName: 'cat',
			description: 'Look for a random cat picture from https://cataas.com/cat.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Cat As A Service',
					url: 'https://cataas.com/cat',
					reason: 'API'
				}
			]
		});
    }
    
    async run(message) {
		const { body } = await request.get('https://cataas.com/cat');
		return message.say('', { files: [{ attachment: body, name: 'cat.jpg' }] });
	}
};