const Setting = require('./models/setting')
const Command = require('./models/commandModel')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error!'));


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


module.exports = {

    
    getGuildSetting:async(id ,name) => {
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
    },


    setFlag:async(msg,flag) => {
        var res = null
        if (flag === 'ID' || flag === 'US') {
            Setting.findOne({guildId:msg.guild.id})
                .then(data => {
                    if(data){
                        Setting.updateOne({guildId:msg.guild.id}, (err, data) => {
                            if(err) return msg.reply('[server] '+ err)
                            msg.channel.send(`Switch to :flag_${flag.toLowerCase()}: server`)
                        })

                    }else if(!data){
                        const setting = new Setting({
                            guildId:msg.guild.id,
                            setting:flag,
                            guildName:msg.guild.name
                        })
                        setting.save((err, data) => {
                            if(err) return msg.channel.send('[Server] '+ err)
                            msg.channel.send(`Switch to :flag_${arg.toLowerCase()}: server`)
                        })
                    }
                })
        } else {
            msg.channel.send(`Server :flag_${flag.toLowerCase()}: is not supported`)
        }
    }
}