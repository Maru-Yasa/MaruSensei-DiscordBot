const func = require('../../function')
const wikipedia = require('../../wikipedia')
const Discord = require('discord.js');


module.exports = {
    name:'wiki',
    usage:'<question>',
    description: 'wikipedia wrapper',
    async execute(msg, args){
        if (!args.length) {
            return msg.channel.send(`You didn't provide any question, ${msg.author}!`); 
        } else {
            var question = args[0]
                answer = null
                flag = null
                img = null
            flag = await func.getGuildSetting(msg.guild.id, msg.guild.id)
            answer = await wikipedia.getWiki(question, flag)
            img = await wikipedia.getMainImg(question, flag)
            if (typeof(answer) !== 'undefined'){
                msg.react('✅');
                for(let i = 0; i < answer.length; i += 2000) {
                    const toSend = answer.substring(i, Math.min(answer.length, i + 2000));
                    const reply = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(question.toUpperCase())
                        .setAuthor('Maru-Sensei', 'https://i.imgur.com/H4nh6wQ.png')
                        .setDescription(toSend)
                        .setThumbnail(img)
                        .setTimestamp()
                        // .setFooter('Powered by Maru-sensei', 'https://i.imgur.com/H4nh6wQ.png');
                    msg.channel.send(reply)
            }
            
        }else{
            msg.react('❌')
            msg.reply('Not found:no_entry_sign:')
        }

    }
        
    }
}