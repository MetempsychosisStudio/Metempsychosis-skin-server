"use strict";
let SHA256 = require('./SHA256.js')
let script = {}
const low = require('lowdb')
const storage = require('lowdb/file-sync')
let ecc = require('eccjs');
const db = low('db.json', {
    storage
})

if (db('users').find({
        username: 'simon30002'
    }) == undefined) {
    db('users').push({
        username: 'simon30002',
        password: '123456'
    })
}

db('users').chain().find({
    username: 'simon3000'
}).assign({
    password: 'hi!'
}).value()

db('users').chain().find({
    username: 'simon3000'
}).assign({
    justTry: 'hi!'
}).value()

db('users').chain().find({
    username: 'simon3000'
}).assign({
    justTry: undefined
}).value()

script.reg = (username, password, rPassword) => {
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

script.login = (username, password) => {
    let userInfo = JSON.parse(fs.readFileSync('./data/players.json'))
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

script.getECC = () => {
    return db('eccKey').find().enc
}

module.exports = script;
