const tenor = require('../../tenor')
const Discord = require('discord.js')

module.exports = {
    name: 'gif',
    usage:'<keywords>',
    description: 'Tenor wrapper',
    async execute(msg, args){
        if (!args.length) {
            return msg.channel.send(`To use this command u must add argument, ${msg.author}!`); 
        } else {
                gif = await tenor.getGif(args)
            if (true) {
                return msg.channel.send(gif)                
            }
        }
    }
}