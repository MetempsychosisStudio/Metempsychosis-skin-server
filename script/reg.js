"use strict";
let SHA256 = require('./SHA256.js')
let fs = require('fs');
let checkReg = require('./checkReg.js')


function reg(username, password, rPassword) {
    if (checkReg(username)==true) {
        return 'repeat'
    }
    if (password == rPassword) {
        let userInfo = JSON.parse(fs.readFileSync('./data/players.json'))
        newUser = new Object();
        newUser.name = username
        newUser.pass = password
        userInfo.push(newUser)
        fs.writeFileSync('./data/players.json', JSON.stringify(userInfo));
        console.log('新用户: ' + username);
    }
}
module.exports = reg;
