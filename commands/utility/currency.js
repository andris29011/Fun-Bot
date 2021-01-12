const { Command } = require('discord.js-commando');
const request = require('node-superfetch');
const { formatNumber } = require("../../util/util")

module.exports = class AvatarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'currency',
			aliases: ['curr'],
			group: 'utility',
			memberName: 'currency',
			description: 'Convert currency. Usage : \`<amount> <base currency> <target currency>\`',
			examples: [`\`currency 250 EUR JPY\` -> \`250 EUR <==> 30,350 JPY\``],
            args: [
                {
					key: 'amount',
					prompt: 'What is the amount to convert ?',
					type: 'float'
				},
				{
					key: 'base',
					prompt: 'What is the currency code to convert?',
					type: 'string',
					max: 3,
                    min: 3, 
                    parse: base => base.toUpperCase()
                }, 
                {
					key: 'target',
					prompt: 'What is the currency code to convert to ?',
					type: 'string',
					max: 3,
                    min: 3, 
                    parse: target => target.toUpperCase()
                },
			]
        });
        
        this.rates = new Map();
    }
    
    async run(message, {amount, base, target}) {
		try {
			const rate = await this.fetchRate(base, target);
			return message.say(`${formatNumber(amount)} ${base} <==> ${formatNumber(amount * rate)} ${target}.`);
		} catch (err) {
			if (err.status === 400) return message.say('Invalid base/target.');
			return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
    }
    
    async fetchRate(base, target) {
		const query = `${base}-${target}`;
		if (this.rates.has(query)) return this.rates.get(query);
		const { body } = await request
			.get('https://api.exchangeratesapi.io/latest')
			.query({
				base,
				symbols: target
			});
		this.rates.set(query, body.rates[target]);
		setTimeout(() => this.rates.delete(query), 1.8e+6);
		return body.rates[target];
	}
};
