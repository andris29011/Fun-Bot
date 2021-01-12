const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { GameRoles } = require('../../structures/db')

const regexEmoji = /<:([a-zA-Z0-9]+):(\d+)>/

module.exports = class GamerolesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gameroles',
			aliases: ['gr'],
			group: 'admin',
			memberName: 'gameroles',
			description: 'Display embeded message for game roles',
			clientPermissions: ['ADMINISTRATOR'],
			userPermissions: ['ADMINISTRATOR'],
			guildOnly: true,
		});
    }
    
    async run(message) {

		const rolesList = await GameRoles.findAll();
		let desc = "";
		for (let role of rolesList){
			desc += role.emoji + " : " + role.name + "\n";
		}

		const embed = new MessageEmbed()
			.setTitle('Game Roles')
			.setDescription(desc)
			.setColor('BLUE')
			.setImage();

		message.embed(embed).then(sentMessage =>{
			for (let role of rolesList){
				let regex = role.emoji.match(regexEmoji);
				if (regex){
					console.log(regex[2]);
					sentMessage.react(regex[2]);
				} else {
					sentMessage.react(role.emoji);
				}
			}
		});

		message.delete();
	}
};
