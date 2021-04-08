require('dotenv').config()
const Tenor = require("tenorjs").client({
    "Key": process.env.TENOR, // https://tenor.com/developer/keyregistration
    "Filter": "off", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
    "MediaFilter": "minimal", // either minimal or basic, not case sensitive
    "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});

module.exports = {
    getGif:async (keyword) => {
        var res = null
        await Tenor.Search.Random(keyword, "1").then(Results => {
            Results.forEach(Post => {
                res = Post.url
            });
        }).catch();
        return res
    }
}
