const { Command } = require('discord.js-commando');
const { GameRoles } = require('../../structures/db')

const regexEmoji = /<:([a-zA-Z0-9]+):(\d+)>/

module.exports = class EditGameRoleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'editgamerole',
			aliases: ['egr'],
			group: 'admin',
			memberName: 'editgamerole',
			description: 'Edit a Game Role for roleReaction',
            clientPermissions: ['ADMINISTRATOR'],
			userPermissions: ['ADMINISTRATOR'],
			guildOnly: true,
			args: [
                {
					key: 'roleEmoji',
					prompt: 'What is the emoji for the role to edit ?',
					type: 'string',
				},
				{
					key: 'roleName',
					prompt: 'What is the role to edit ?',
					type: 'string',
                },
			],
		});
    }
    
    async run(message, {roleName, roleEmoji}) {

        let regex = roleEmoji.match(regexEmoji);
        if (regex){ // if emoji matchs customEmoji syntax, check if it's from the server
            console.log(regex[2]);
            if (!message.guild.emojis.cache.find(emoji => emoji.id === regex[2])){
                return message.reply('Error emoji is not from this server');
            }
        }

        const affectedRows = await GameRoles.update({ emoji: roleEmoji }, { where: { name: roleName } });
        if (!affectedRows){
            return message.reply(`Game role ${roleName} doesn't exists.`);
        } else {
            return message.reply(`Game role ${roleName} edited with emoji ${roleEmoji}.`);
        }

	}
};