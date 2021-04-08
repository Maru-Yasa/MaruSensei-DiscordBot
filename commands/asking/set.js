const func = require('../../function')
const Discord = require('discord.js');


module.exports = {
    name:'set',
    usage:'<country code> [ID,US]',
    description: 'set server for Wikipedia and Brainly',
    async execute(msg, args){
        if (!args.length) {
            return msg.channel.send(`You didn't provide any language code, ${msg.author}!`); 
        } else {
            var flag = args[0]
            func.setFlag(msg,flag)
        }
    }
}