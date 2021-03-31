const wiki = require('wikijs').default;
const Discord = require('discord.js');
const parseInfo = require("infobox-parser")

// wiki({ apiUrl: 'https://id.wikipedia.org/w/api.php' })
//             .page('joko widodo')
//             .then(page => page.mainImage())
//             .then(info => {
//                 console.log(info)
//             })


module.exports = {
    getWikiInfo:async function(q,flag) {
        var url = undefined
        var res = undefined
        if (flag === 'US'){url = 'https://en.wikipedia.org/w/api.php'}
        else{url = `https://${flag.toLowerCase()}.wikipedia.org/w/api.php`}
        try {
            await wiki({ apiUrl: url })
            .page(q)
            .then(page => page.info())
            .then(info => {
                res = info
            })
        } catch (error) {
            console.log('error')
        }
        const keys = Object.keys(res);
        var resArray = []
        keys.forEach((key, index) => {
            let k = key
            let val = res[k]
            if (typeof(val) === 'object') {
                val = JSON.stringify(val)
                val = val.replace(/[\[\]&]+/g, '');
                val = val.replace(/[\{\}&]+/g, '');
                val = val.replace(/[\"\"&]+/g, '');
                val = val.replace(/[\'\'&]+/g, '');
            }
            let str =`[+]**${k}** : ${val}\n`
            resArray.push(str);
        });
        return resArray;
    },

    getWiki: async function (q,flag){
        var url = undefined
        var res = undefined
        if (flag === 'US'){url = 'https://en.wikipedia.org/w/api.php'}
        else{url = `https://${flag.toLowerCase()}.wikipedia.org/w/api.php`}
        try {
            await wiki({ apiUrl: url })
            .page(q)
            .then(page => page.summary())
            .then(info => {
                res = info
            })

        } catch (error) {
            res = undefined
        }

        return res
    },
    getMainImg:async function(q,flag){
        var urlImg = undefined
        if (flag === 'US'){url = 'https://en.wikipedia.org/w/api.php'}
        else{url = `https://${flag.toLowerCase()}.wikipedia.org/w/api.php`}
        try {
            await wiki({ apiUrl: url })
            .page(q)
            .then(img => img.mainImage())
            .then(img => {
                urlImg = img
            })
        } catch (error) {
            urlImg = null
        }
        return urlImg;
    }
}