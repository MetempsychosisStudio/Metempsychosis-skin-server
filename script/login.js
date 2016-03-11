"use strict";
let fs = require('fs');
let SHA256 = require('./SHA256.js')

function login(username, password) {
    let userInfo = JSON.parse(fs.readFileSync('./data/players.json'))
}

module.exports = login;
