"use strict";
let SHA256 = require('./SHA256.js')
let fs = require('fs');


function get(username) {
    let userInfo = JSON.parse(fs.readFileSync('./data/players.json'))
    let JSONFile = {}
    JSONFile.errno = 1
    JSONFile.msg = '未注册'
    for (var i = 0; i < userInfo.length; i++) {
        if (userInfo[i].name == username) {
            if (userInfo[i].skins != undefined || userInfo[i].cape != undefined) {
                delete JSONFile.msg
                JSONFile.player_name = username
                JSONFile.last_update = userInfo[i].update
                JSONFile.model_preference = []
                JSONFile.skins = {}
                return JSON.stringify(JSONFile)
            } else {
                JSONFile.msg = '未上传皮肤'
                return JSON.stringify(JSONFile)
            }
        }
    }
    return JSON.stringify(JSONFile)
}

module.exports = get;
