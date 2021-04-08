const Discord = require('discord.js');
const brainly = require('./brainly')
const wiki = require('./wikipedia')
require('dotenv').config()
const http = require("http");
const Setting = require('./models/setting')
const Command = require('./models/commandModel')
const mongoose = require('mongoose')
const fs = require('fs')


// Note:import prefix
const { prefix } = require('./config.json')
const client = new Discord.Client();
client.commands = new Discord.Collection();


// NOTE:import all command in commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error!'));
db.once('open', function() {
  console.log('MongoDb ok!')
});


// NOTE:worker
http.createServer(function (req, res) {
  res.write('bot alive'); 
  res.end();
}).listen(8080);


async function makeGuildSetting(id,name){
    var setting = new Setting({
        guildId : id,
        guildName:name
    })
    setting.save((err,data) => {
        if (err) return err;
        return data.setting
    })
}

async function getGuildSetting(id,name){
    var res = null
    await Setting.findOne({guildId:id})
        .then(async data => {
            if (data){
                res = data.setting
            }else{
                var newsetting = await makeGuildSetting(id,name)
                res = newsetting
            }
        })
    return res;
}

async function getAllCommand(){
    var res = null
    await Command.find({},'command usage')
        .then(data => {
            res = data
        })
    return res
}


client.on("ready", () =>{
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ activity: { name: 'm!help' }, status: 'idle' })
 });


client.on('message',async msg => {
    let author = msg.author

    if (msg.channel.type === 'dm') {
        return;
    }

    if (/m!wiki/i.test(msg.content) && author.bot === false) {
        let question = msg.content.split(' '),
        answer = null,
        q = null
            reply = null
            flag = null
            img = null
            question.shift()
        q = question.toString().replace(/[^A-Za-z\s]+/g, ' ');
        flag = await getGuildSetting(msg.guild.id,msg.guild.name)
        answer = await wiki.getWiki(q, flag)
        img = await wiki.getMainImg(q, flag)
        if (typeof(answer) !== 'undefined'){
            msg.react('✅');
            for(let i = 0; i < answer.length; i += 2000) {
                const toSend = answer.substring(i, Math.min(answer.length, i + 2000));
                const reply = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(q.toUpperCase())
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

    if (/m!ask/i.test(msg.content) && author.bot === false) {
        let question = msg.content.split(' '),
        answer = null,
        q = null
        reply = null
        flag = null
            img = null
            question.shift()
            q = question.toString().replace(/[^A-Za-z\s]+/g, ' ');
        flag = await getGuildSetting(msg.guild.id,msg.guild.name)
        answer = await brainly.getAns(q, flag)
        question = await brainly.getQestion(q, flag)
        if (question !== null || answer !== undefined){
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

    else if (/m!help/i.test(msg.content) && author.bot === false) {
        var command = await getAllCommand(),
            commandStr = null
            commandArr = []
        command.forEach(element => {
            commandStr = `***${element.usage}***` + ' \n ' + '`'+ element.command + '`' + ' \n '
            commandArr.push(commandStr)
        });
        const reply = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('\nCommand List\n')
            .setAuthor('Maru-Sensei', 'https://i.imgur.com/H4nh6wQ.png')
            .setDescription(commandArr)
            .setThumbnail(null)
            .setTimestamp()
        msg.channel.send(reply)
    }

    else if (/m!set/i.test(msg.content) && author.bot === false) {
        let argRaw = msg.content.split(' '),
            arg = null
        argRaw.shift()
        arg = argRaw.toString()
        if (arg === 'ID' || arg === 'US') {        
            Setting.findOne({guildId:msg.guild.id})
                .then(data => {
                    if (data){
                        Setting.updateOne({guildId:msg.guild.id},{setting:arg},(err,data) => {
                          if (err) return msg.reply(`[server]${err}`)
                          msg.reply(`Switch to :flag_${arg.toLowerCase()}: server`)
                        })
                    }else if(!data){
                        const setting = new Setting({
                            guildId:msg.guild.id,
                            setting:arg,
                            guildName:msg.guild.name
                        })
                        setting.save((err,data) => {
                            if (err) return msg.reply(`[server]${err}`)
                            msg.reply(`Switch to :flag_${arg.toLowerCase()}: server`)
                        })
                    }
                })


        }else {
            msg.reply('Avaible Server [ID,US]')
        }
    }
    
    else if (/m!show/i.test(msg.content) && /config/i.test(msg.content) && author.bot === false){
        var reply = null,
            config = null
        Setting.findOne({guildId:msg.guild.id},(err,data) => {
            if(err) return msg.reply("no config yet,create \n ```m!set <chose one[ID, US]>```")
            config = `***ConfigId*** : ${data._id} \n ***GuildId*** : ${data.guildId} \n ***Language*** : :flag_${data.setting.toLowerCase()}:`
            reply = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('\nConfig\n')
                .setAuthor('Maru-Sensei', 'https://i.imgur.com/H4nh6wQ.png')
                .setDescription(config)
                .setThumbnail(null)
                .setTimestamp()
            msg.channel.send(reply)
        })        
    }

});

client.login(process.env.TOKEN);