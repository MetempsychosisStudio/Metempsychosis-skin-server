var fs = require('fs');
"use strict";

function login(username, password) {
    fs.readFile('./data/players.json', function(fileData) {
        var userInfo = JSON.parse(fileData)
    })
}

fs.exists('./data/players.json', function(exists) {
    if (exists == false) {
        fs.writeFile('./data/players.json', '[]', function(err) {
            if (err) throw err;
            console.log('用户登陆数据创建成功');
            login()
        });
    };
});

module.exports = login;
