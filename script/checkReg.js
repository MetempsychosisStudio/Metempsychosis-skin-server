"use strict";
let fs = require('fs');

function checkReg(username) {
    let repeat = false
    JSON.parse(fs.readFileSync('./data/players.json')).forEach(function(e) {
        if (e.name = username) {
            repeat = true
        }
    })
    return repeat
}

module.exports = checkReg;
