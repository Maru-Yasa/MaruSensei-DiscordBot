const Discord = require('discord.js');
const client = new Discord.Client();
// const { BrainlyAPI, Server } = require('brainly-api');
const brainly = require('brainly-scraper-v2');
require('dotenv').config()
const http = require("http");

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


async function getAns(q){
    var res = undefined
    await brainly(q,1,"id")
        .then(response => {
            let array = Array.from(response)
            res = response.data[0].jawaban[0].text
        })
    return res;
}


client.on("ready", () =>{
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus('available')
    client.user.setPresence({
        status: "online",  
        game: {
            name: "Using m!help",  
            type: "STREAMING" 
        }
    });
 });


client.on('message',async msg => {
    let author = msg.author
    if (/m!ask/i.test(msg.content) && author.bot === false) {
        let question = msg.content.split(' '),
            answer = null,
            q = null
            reply = null
        question.shift()
        q = question.toString().replace(',',' ')
        answer = await getAns(q)
        reply = `\n >>> **Question**:\n ${q} \n **Answers** \n ${answer}`
        msg.reply(reply);
    }
    if (/m!help/i.test(msg.content) && author.bot === false) {
        msg.reply(`\n >>> **Command** \n -m!ask <your question> \n -m!help`)
    }

});

client.login(process.env.TOKEN);
