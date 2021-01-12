const { Command } = require('discord.js-commando');
const path = require('path');
const fs = require('fs');

const soundboardGroups = require('../../resources/json/soundboard');

module.exports = class SoundBoardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'soundboard',
			aliases: ['sb'],
			group: 'audio',
			memberName: 'soundboard',
			description: 'Play a sound from a local soundboard. Usage : \`<group:any> <sound number:0>\`',
			details : `Current groups available : ${soundboardGroups.join(', ')}\nTo add a group of sound or new sounds, contact my owner. `,
			guildOnly: true,
			args: [
				{
					key: 'folder',
					prompt: 'Which soundboard sound group ?',
					type: 'string',
					default: 'any'
                },
                {
					key: 'number',
					prompt: 'Sound number ?',
					type: 'integer',
					default: 0,
				},
			],
		});
    }
    
    async run(message, {folder, number}) {
		let sound = genPath(folder, number);
		if (message.member.voice.channel) {
			
			message.member.voice.channel.join().then(connection =>{

				let file = path.join.apply(null, sound);
				const dispatcher = connection.play(file, {volume : 0.5});
				dispatcher.on('start', () => {
					console.log(`Playing ${file}.`);
				});
	
				dispatcher.on('finish', () => {
					console.log(`Finished playing ${file}.`);
					dispatcher.destroy();
					message.member.voice.channel.leave();
				});
	
				dispatcher.on('error', console.error);
			})
		} else {
			return message.reply(`Please connect to a voice channel`).catch(console.error);
		}
	}
};

function genPath(folder, number){
	let pathAudio = [ __dirname, '..', '..', 'resources', 'audio'];

	if (folder != 'any'){
		pathAudio.push(folder.toLowerCase());
		console.log("1 :  "+ path.join.apply(null, pathAudio))

		if (fs.existsSync(path.join.apply(null, pathAudio))){
			
			fs.readdir(path.join.apply(null, pathAudio), (err, files) => {
				let i = 0;
				if (number === 0){ // random
					i = Math.floor(Math.random() * files.length);
					console.log("Random file : "+ path.join.apply(null, pathAudio))
	
				} else {
					if (number > files.length){
						console.log(`Args 1 ${number} is lower than file count, taking first.`)
					} else {
						i = number - 1;
					}
				}
				pathAudio.push(files[i]);
				console.log(`Reading ${files[i]}.`);
			});
			
		} else {
			return message.reply(`Arg ${folder} doesn't exists.`);
		}
	} else {
		fs.readdir(path.join.apply(null, pathAudio), (err, files) => {
			pathAudio.push(files[Math.floor(Math.random() * files.length)]);

			fs.readdir(path.join.apply(null, pathAudio), (err, files) => {
				pathAudio.push(files[Math.floor(Math.random() * files.length)]);
			});
		});
	}

	return pathAudio;
}