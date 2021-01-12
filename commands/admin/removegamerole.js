const { Command } = require('discord.js-commando');
const { GameRoles } = require('../../structures/db')

module.exports = class RemoveGameRoleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'removegamerole',
			aliases: ['rgr'],
			group: 'admin',
			memberName: 'removegamerole',
			description: 'Remove a Game Role from roleReaction',
            clientPermissions: ['ADMINISTRATOR'],
			userPermissions: ['ADMINISTRATOR'],
			guildOnly: true,
			args: [
				{
					key: 'roleName',
					prompt: 'What is the role to edit ?',
					type: 'string',
                },
			],
		});
    }
    
    async run(message, {roleName}) {

        const rowCount = await GameRoles.destroy({ where: { name: roleName } });
        if (!rowCount){
            return message.reply(`Game role ${roleName} doesn't exists.`);
        } else {
            return message.reply(`Game role ${roleName} removed.`);
        }
    }
};