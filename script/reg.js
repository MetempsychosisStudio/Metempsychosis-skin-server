"use strict";
let SHA256 = require('./SHA256.js')
let script = {}
const low = require('lowdb')
const storage = require('lowdb/file-sync')
let ecc = require('eccjs');
const db = low('db.json', {
    storage
})

script.reg = (aec) => {
    let newUser = JSON.parse(ecc.decrypt(db('eccKey').find().dec, aec))
    if (newUser.username == undefined || newUser.password == undefined || newUser.rPassword == undefined) {
        return 'lostElement'
    } else if (newUser.password != newUser.rPassword) {
        return 'passwordNotSame'
    } else if (!newUser.username.match(/^\w+$/)) {
        return 'illegalUsername'
    } else if (!script.check(newUser.username)) {
        return 'repeat'
    } else {
        db('users').push({
            username: newUser.username,
            password: newUser.password,
            _username: newUser.username.toLowerCase(),
            update: new Date().getTime()
        })
        console.log('新用户: ' + newUser.username);
        return 'done'
    }
}

script.login = (username, password) => {

}

script.getJSONUniSkinAPI = (username) => {
    let json = {}
    json.errno = 1
    json.msg = '找不到皮肤'
    return json

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

script.check = (username) => {
    return !db('users').find({
        _username: username.toLowerCase()
    })
}

script.getECC = () => {
    return db('eccKey').find().enc
}

module.exports = script;
