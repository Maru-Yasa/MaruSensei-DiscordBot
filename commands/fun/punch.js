const tenor = require('../../tenor')
const Discord = require('discord.js')

module.exports = {
    name: 'punch',
    usage:'<tag someone>',
    description: 'Tenor wrapper',
    async execute(msg, args){
        if (!args.length) {
            return msg.channel.send(`To use this command u must tag some one, ${msg.author}!`); 
        } else {
            var someone = msg.mentions.users.first()
                gif = await tenor.getGif('anime kill')
            if (someone) {
                return msg.channel.send(`***Aww...,thare a punch from ${msg.author.username} to ${someone}***\n` + gif)                
            }else{
                return msg.reply('You must tag someone...')
            }
        //     const embed = new Discord.MessageEmbed()
        //     .setColor('#FF8DC4')
        //     .setTitle(
        //       `*Aww how cute, ${msg.author.username} gave ${
        //         msg.mentions.users.first().username
        //       } a pat!*`,
        //     )
        //     .setImage(gif);
      
        //   msg.channel.send(embed);
        }
    }
}