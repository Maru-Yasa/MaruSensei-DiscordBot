require('dotenv').config()
const Tenor = require("tenorjs").client({
    "Key": process.env.TENOR, // https://tenor.com/developer/keyregistration
    "Filter": "off", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
    "MediaFilter": "minimal", // either minimal or basic, not case sensitive
    "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});

Tenor.Search.Random('anime hug', "10").then(Results => {
    Results.forEach(Post => {
        console.log(Post.url)
    });
}).catch();
