const mongoose = require('mongoose')
const { Schema } = mongoose

const settingSchema = new Schema({
    guildId:{
        type:String
    },
    setting:{
        type:String,
        default:'ID'
    },
    guildName:{
      type:String
    }
},{timestamps:true});

const Setting = mongoose.model('Setting', settingSchema)
module.exports = Setting