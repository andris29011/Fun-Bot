
var { translate } = require("google-translate-api-browser");

const { Command } = require('discord.js-commando');

module.exports = class TranslateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'translate',
			aliases: ['tl'],
			group: 'utility',
			memberName: 'translate',
			description: 'Translate text a given text. Usage : \`<origin language code> <target language code> <text>\`',
			args: [
				{
					key: 'from',
					prompt: 'Language code of text to translate',
					type: 'string',
                },
                {
					key: 'to',
					prompt: 'Language code of target translation',
					type: 'string',
                },
                {
					key: 'text',
					prompt: 'Text to translate',
					type: 'string',
				},
			],
		});
    }
    
    async run(message, {from, to, text}) {
        translate(text, { from: from, to: to })
            .then(res => {
                message.reply(text + " > " + res.text)
            })
	}
};
