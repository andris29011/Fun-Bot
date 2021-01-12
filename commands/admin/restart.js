const { Command } = require('discord.js-commando');

/**
 * Restart bot thanks to pm2 process manager.
 */
module.exports = class RestartCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'restart',
			aliases: [],
			group: 'admin',
			memberName: 'restart',
			description: 'Restart the bot.',
            ownerOnly: true,
			guildOnly: true,
			hidden: true
		});
    }
    
    async run(message) {
        await sleep(1000);
        process.exit(); 
	}
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}