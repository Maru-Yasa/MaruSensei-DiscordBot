const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch')
const axios = require('axios')
require('dotenv').config()

async function getres(q){    
    const response = await axios.get(`http://localhost:5000/api?question=${q}`)
    return response.data.data.answer;
}
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message',async msg => {
    if (/m!ask/i.test(msg.content)) {
        let question = msg.content.split(' '),
            answer = null,
            q = null
        question.shift()
        q = question.toString().replace(',',' ')
        answer = await getres(q)
        msg.reply(`\n **Question**:\n ${q} \n **Answers** \n ${answer}`);
    }
});

client.login(process.env.TOKEN);
