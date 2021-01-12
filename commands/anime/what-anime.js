const { Command } = require('discord.js-commando');

module.exports = class WhatAnimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'what-anime',
			aliases: [],
			group: 'anime',
			memberName: 'what-anime',
			description: 'WIP : Using https://trace.moe/, what anime is this ?',
		});
    }
    
    run(message) {
		message.say(`WIP`);
	}
};
