const Discord = require('discord.js')
const gifs = require('../../utils/gifs.json')

module.exports = {
    name: 'hug',
    usage:'<tag someone>',
    description: 'Tenor wrapper',
    async execute(msg, args){
        var gif = null
            index = null
        if (!args.length) {
            return msg.channel.send(`To use this command u must tag some one, ${msg.author}!`); 
        } else {
            var someone = msg.mentions.users.first()
            index = Math.floor(Math.random() * gifs.hug.length);
            gif = gifs.hug[index]
            if (someone) {
                return msg.channel.send(`***Aww...,thare a hug from ${msg.author.username} to ${someone}***\n` + gif)                
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