const { Command } = require('discord.js-commando');
const { delay } = require("../../util/util");

module.exports = class TimerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'timer',
			group: 'utility',
			memberName: 'timer',
			description: 'Sets a timer for up to 10 minutes. Usage : \`<time in seconds>\`',
			args: [
				{
					key: 'time',
					prompt: 'How long should the timer last (in seconds)?',
					type: 'integer',
					max: 600,
					min: 1
				}
			]
		});
	}

	async run(msg, { time }) {
		const display = time > 59 ? `${time / 60} minutes` : `${time} seconds`;
		await msg.say(`🕰️ Set a timer for **${display}**.`);
		await delay(time * 1000);
		return msg.say(`🕰️ Your **${display}** timer is finished ${msg.author}!`);
	}
};