const { Command } = require('discord.js-commando');

module.exports = class ChooseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'choose',
			aliases: [],
			group: 'random',
			memberName: 'choose',
            description: 'Let the bot choose for you. Usage : \`<option 1>; <option 2>; ...\`',
            args: [
				{
					key: 'options',
					prompt: 'What should i choose from ? (Separated by \';\')',
					type: 'string',
                }
			],
		});
    }
    
    run(message, {options}) {

        let array = options.split(";");
        const res = array[Math.floor(Math.random() * array.length)];

		return message.say(`I chose : ${res}`);
	}
};