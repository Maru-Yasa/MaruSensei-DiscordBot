const fs = require('fs');
const Discord = require('discord.js');
const { prefix } = require('./config.json');
require('dotenv').config()
const http = require("http");


// NOTE:worker
http.createServer(function (req, res) {
  res.write('bot alive'); 
  res.end();
}).listen(8080);



const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}


client.once('ready', () => {
	console.log('Ready!');
  client.user.setPresence({ activity: { name: 'm!help' }, status: 'idle' })
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	var  command = args.shift().toLowerCase();
		 command = command.toLowerCase()

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(process.env.TOKEN);