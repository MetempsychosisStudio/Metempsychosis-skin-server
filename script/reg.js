"use strict";
const SHA256 = require('./SHA256.js')
let script = {}
const low = require('lowdb')
const storage = require('lowdb/file-sync')
const ecc = require('eccjs');
const db = low('db.json', {
    storage
})

script.check = (username) => {
    return !db('users').find({
        _username: username.toLowerCase()
    })
}

script.decrypt = (aec) => JSON.parse(ecc.decrypt(db('eccKey').find().dec, aec))

script.find = () => {
    return db('users').map('username')
}

script.reg = (newUser) => {
    if (newUser.username == undefined || newUser.password == undefined || newUser.rPassword == undefined) {
        return 'lostElement'
    }
    if (newUser.password != newUser.rPassword) {
        return 'passwordNotSame'
    }
    if (!newUser.username.match(/^\w+$/)) {
        return 'illegalUsername'
    }
    if (!script.check(newUser.username)) {
        return 'repeat'
    }
    db('users').push({
        username: newUser.username,
        password: newUser.password,
        _username: newUser.username.toLowerCase(),
        update: new Date().getTime()
    })
    console.log('新用户: ' + newUser.username);
    return 'done'
}

script.remove = (user) => {
    if (script.check(user)) {
        return 'userNotExist'
    }
    console.log('删除用户: ' + db('users').remove({
        _username: user.toLowerCase()
    })[0].username);
    return 'done'
}

script.login = (user) => {
    if (script.check(user.username)) {
        return 'userNotExist'
    } else if (db('users').find({
            username: user.username
        }).password === user.password) {
        return 'good'
    } else {
        return 'bad'
    }
}

script.changePassword = (username, password) => {
    if (script.check(username)) {
        return 'userNotExist'
    } else {
        db('users').chain().find({
            username: username
        }).assign({
            password: password
        }).value()
        return true
    }
}

/*
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
*/

script.save = () => db.write()

script.getECC = () => db('eccKey').find().enc

module.exports = script;
