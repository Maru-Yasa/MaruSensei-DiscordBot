const Discord = require('discord.js');
const client = new Discord.Client();
const brainly = require('brainly-scraper-v2');
require('dotenv').config()
const http = require("http");
const Setting = require('./models/setting')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error!'));
db.once('open', function() {
  console.log('MongoDb ok!')
});

http.createServer(function (req, res) {
  res.write('bot alive'); 
  res.end();
}).listen(8080);


// async function getAns(q){
//     var res = undefined
//     await BrainlyAPI.startWorker({ experimental: true, server: Server.ID }, async brainly => {
//         const result = await brainly.findQuestion(q);
//         let array = Array.from(result)
//         array = array[0]
//         res = array.raw.node.answers.nodes[0].content.replace( /(<([^>]+)>)/ig, '')
//     });
//     return res;
// }


async function getAns(q,flag){
    var res = undefined
    await brainly(q, 1, flag)
        .then( async response => {
            let array = Array.from(response)
            try {
                res = response.data[0].jawaban[0].text                
            } catch (error) {
                res = "I dont know :sob:"
            }

        })
    return res;
}

async function getQuestion(q,flag){
    var res = undefined
    await brainly(q, 1, flag)
        .then(async response => {
            let array = Array.from(response)
            try {
                res = response.data[0].pertanyaan                
            } catch (error) {
                res = "I dont know :sob:"
            }
        })
    return res;
}


async function makeGuildSetting(id){
    var setting = new Setting({
        guildId : id
    })
    setting.save((err,data) => {
        if (err) return err;
        return data.setting
    })
}

async function getGuildSetting(id){
    var res = null
    await Setting.findOne({guildId:id})
        .then(async data => {
            if (data){
                res = data.setting
            }else{
                var newsetting = await makeGuildSetting(id)
                res = newsetting
            }
        })
    return res;
}


client.on("ready", () =>{
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ activity: { name: 'Using m!help' }, status: 'idle' })
 });


client.on('message',async msg => {
    let author = msg.author

    if (msg.channel.type === 'dm') {
        return;
    }

    if (/m!ask/i.test(msg.content) && author.bot === false) {
        let question = msg.content.split(' '),
            answer = null,
            q = null
            reply = null
            flag = null
        question.shift()
        q = question.toString().replace(',',' ')
        flag = await getGuildSetting(msg.guild.id)
        answer = await getAns(q,flag)
        let getquestion = await getQuestion(q,flag)
        reply = `\n **Question**:\n ${getquestion} \n **Answers:** \n ${answer}`
        msg.reply(reply);
    }

    else if (/m!help/i.test(msg.content) && author.bot === false) {
        msg.reply(`\n **Command** \n -m!ask <your question> \n -m!help`)
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
                          msg.reply(`Switch to ${arg} server`)
                        })
                    }else if(!data){
                        const setting = new Setting({
                            guildId:msg.guild.id,
                            setting:arg
                        })
                        setting.save((err,data) => {
                            if (err) return msg.reply(`[server]${err}`)
                            msg.reply(`Switch to ${arg} server`)
                        })
                    }
                })


        }else {
            msg.reply('Avaible Server [ID,US] :)')
        }
    }
    
    else if (/m!show/i.test(msg.content) && /config/i.test(msg.content)){
        Setting.findOne({guildId:msg.guild.id},(err,data) => {
            if(err) return msg.reply("no config yet,create \n ```m!set <chose one[ID, US]>```")
            return msg.reply(`\n ConfigId:${data._id} \n GuildId:${data.guildId} \n Language:${data.setting} `)
        })        
    }

});

client.login(process.env.TOKEN);
