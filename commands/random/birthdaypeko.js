const { Command } = require('discord.js-commando');
const path = require('path');
const fs = require('fs');

module.exports = class ChooseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'birthdaypeko',
			aliases: ['bdpeko'],
			group: 'random',
			memberName: 'birthdaypeko',
            description: 'Na... Narkarai-san ... Omedeto Happy Birthday ! Narkrai-san',
		});
    }
    
    async run(message) {
        const buffer = fs.readFileSync(path.join( __dirname, '..', '..', 'resources', 'video', 'birthday.mp4'));
		return message.say('', { files: [{ attachment: buffer, name: 'birthday.mp4' }] });
	}
};