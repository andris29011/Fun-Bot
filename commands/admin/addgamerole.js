const { Command } = require('discord.js-commando');
const { GameRoles } = require('../../structures/db')

const regexEmoji = /<:([a-zA-Z0-9]+):(\d+)>/

module.exports = class AddGameRoleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'addgamerole',
			aliases: ['agr'],
			group: 'admin',
			memberName: 'addgamerole',
			description: 'Add a Game Role for roleReaction',
            clientPermissions: ['ADMINISTRATOR'],
			userPermissions: ['ADMINISTRATOR'],
			guildOnly: true,
			args: [
                {
					key: 'roleEmoji',
					prompt: 'What is the emoji for the role to add ?',
					type: 'string',
				},
				{
					key: 'roleName',
					prompt: 'What is the role to add ?',
					type: 'string',
                },
			],
		});
    }
    
    async run(message, {roleName, roleEmoji}) {

        console.log(`${roleName} - ${roleEmoji}`)
        let regex = roleEmoji.match(regexEmoji);
        if (regex){ // if emoji matchs customEmoji syntax, check if it's from the server
            console.log(regex[2]);
            if (!message.guild.emojis.cache.find(emoji => emoji.id === regex[2])){
                return message.reply('Error emoji is not from this server');
            }
        }

		try {

            let roleExists = message.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLocaleLowerCase());
            if (roleExists){
                const role = await GameRoles.create({
                    name: roleName,
                    emoji: roleEmoji,
                });
                return message.reply(`Game role ${role.name} added.`);
            } else {
                return message.reply(`Game role ${roleName} doesn't exists.`);
            }

        }
        catch (e) {
            console.log(e);
            if (e.name === 'SequelizeUniqueConstraintError') {
                return message.reply('That game role already exists.');
            }
            return message.reply('Something went wrong with adding a game role.');
        }

	}
};