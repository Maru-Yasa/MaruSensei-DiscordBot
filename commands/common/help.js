const { prefix } = require('../../config.json');
const Discord = require('discord.js')

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(msg, args) {
    var data = [];
    const { commands } = msg.client;
    
    if (!args.length) {
        data.push(commands.map(command => `\`${prefix}${command.name}\``).join('\n '));
        let spe = `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`
        for(let i = 0; i < data.length; i += 2000) {
            const reply = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Here\'s a list of all my commands:')
                .setAuthor('Maru-Sensei', 'https://i.imgur.com/H4nh6wQ.png')
                .setDescription(data + '\n' + spe)
                .setThumbnail()
                .setTimestamp()
                // .setFooter('Powered by Maru-sensei', 'https://i.imgur.com/H4nh6wQ.png');
            return msg.channel.send(reply)
    }

    }
        
    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
    
    if (!command) {
        return msg.reply('that\'s not a valid command!');
    }
    data.push({
        name:command.name,
        desc:command.description,
        usage:command.usage
    })
    // data.push(`**Name:** ${command.name}`);
    
    // if (command.aliases) data.push(`\n**Aliases:** ${command.aliases}\n`);
    // if (command.description) data.push(`\n**Description:** ${command.description}\n`);
    // if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}\n`);
    
    // data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
    let toSend = `\n**Name:**: ${data[0].name}\n**Description:** ${data[0].desc}\n**Usage:** ${prefix}${data[0].name} ${data[0].usage}\n`
    return msg.reply(toSend, { split: true });

        
	},
};