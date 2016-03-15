"use strict";
let SHA256 = require('./SHA256.js')
let fs = require('fs');
let userInfo = JSON.parse(fs.readFileSync('./data/players.json'))
let script = {}

let checkReg = (username) => {
    for (let x of userInfo) {
        if (x.name == username) {
            return true
        }
    }
    return false
}

script.reg = function(username, password, rPassword) {
    if (password != rPassword) {
        return 'notSame'
    } else if (checkReg(username) == true) {
        return 'repeat'
    } else if (password == rPassword) {
        let newUser = new Object();
        newUser.name = username
        newUser.pass = password
        newUser.update = new Date().getTime()
        userInfo.push(newUser)
        fs.writeFile('./data/players.json', JSON.stringify(userInfo), function(e) {
            console.log('新用户: ' + username);
        });
        return 'done'
    }
}

script.login = function(username, password) {
    let userInfo = JSON.parse(fs.readFileSync('./data/players.json'))
}

script.getJSON = function get(username) {
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


module.exports = script;
