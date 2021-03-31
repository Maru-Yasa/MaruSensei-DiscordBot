const brainly = require('brainly-scraper-v2');
require('dotenv').config()

module.exports = {
    getAns:async function(q, flag) {
        var res = undefined
        await brainly(q, 1, flag)
            .then( async response => {
                let array = Array.from(response)
                try {
                    res = response.data[0].jawaban[0].text                
                } catch (error) {
                    res = undefined
                }
    
            })
        return res;
    },
    getQestion:async function (q, flag) {
        var res = undefined
        await brainly(q, 1, flag)
            .then(async response => {
                let array = Array.from(response)
                try {
                    res = response.data[0].pertanyaan                
                } catch (error) {
                    res = null
                }
            })
        return res;
    }
}