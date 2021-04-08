const brainly = require('../../brainly')
const func = require('../../function')
const Discord = require('discord.js');


module.exports = {


    name: 'ask',
    usage:'<question>',
    description: 'Brainly wrapper',
    async execute(msg, args) {
		if (!args.length) {
			return msg.channel.send(`You didn't provide any question, ${msg.author}!`);
		} else {
            let question = args.toString().replace(/[^A-Za-z\s]+/g, ' ');
                answer = null
                flag = null
                img = null
                q = null
            flag = await func.getGuildSetting(msg.guild.id, msg.guild.name)
			answer = await brainly.getAns(question, flag)
            q = await brainly.getQestion(question, flag)
            if (q !== null || answer !== undefined){
                msg.react('✅');
                for(let i = 0; i < answer.length; i += 2000) {
                    const toSend = answer.substring(i, Math.min(answer.length, i + 2000));
                    const reply = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(question)
                        .setAuthor('Maru-Sensei', 'https://i.imgur.com/H4nh6wQ.png')
                        .setDescription(toSend)
                        .setThumbnail(img)
                        .setTimestamp()
                        // .setFooter('Powered by Maru-sensei', 'https://i.imgur.com/H4nh6wQ.png');
                    msg.channel.send(reply)
                }
            }else if(typeof(answer) === 'undefined'){
                msg.react('❌')
                msg.reply('Not found:no_entry_sign:')
            }
		}

	},


}