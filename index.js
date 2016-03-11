"use strict";
let express = require('express')
let compression = require('compression')
let fs = require('fs')
let SHA256 = require('./script/SHA256.js')
let app = express()
let reg = require('./script/reg.js')
let login = require('./script/login.js')
let checkReg = require('./script/checkReg.js')


fs.stat('./data', function(err, stats) {
    fs.stat('./data/players', function(err, playerStats) {
        fs.stat('./data/players.json', function(err, JSONStats) {
            if (stats == undefined) {
                fs.mkdirSync('./data')
            }
            if (playerStats == undefined) {
                fs.mkdirSync('./data/players')
            }
            if (JSONStats == undefined) {
                fs.writeFileSync('./data/players.json', JSON.stringify([]));
                console.log('用户数据创建成功');
            }
            checkConfig()
        })
    })
})

function checkConfig() {
    fs.stat('./config.js', function(err, stats) {
        if (stats == undefined) {
            fs.writeFileSync('./config.js','"use strict";\nlet setting = {}\n//配置文件 (别改上面的)\n\n//访问端口号\nsetting.port = 8080\n\n\n\n\n//不要改下面的东西\nfunction settingOut() {\nreturn setting\n}\nmodule.exports = settingOut;')
            console.log('创建配置文件: config.js');
        }
        openServer();
    })
}

function openServer() {
    app.all(/json/, compression(), express.static('data/players'));

    app.post(/upload/, function(req, res, next) {
        login(req.body.username, req.body.pass)
    });

    app.post(/login/, function(req, res, next) {
        login(req.body.username, req.body.pass)
    });

    app.post(/register/, function(req, res, next) {
        reg(req.body.username, req.body.pass, req.body.rpass)
    });

    app.all(/indexcss/, compression(), function(req, res, next) {
        res.sendFile('index.css', {
            root: 'public/'
        });
    });

    app.all(/indexjs/, compression(), function(req, res, next) {
        res.sendFile('index.js', {
            root: 'public/'
        });
    });

    app.all(/favicon/, compression(), function(req, res, next) {
        res.sendFile('favicon.ico', {
            root: 'public/'
        });
    });

    app.all('/', compression(), function(req, res, next) {
        res.sendFile('index.html', {
            root: 'public/'
        });
    });
    serverDone()
}

function serverDone() {
    let setting = require('./config.js');
    console.log("配置文件读取成功");
    let server = app.listen(setting().port, function() {
        let host = server.address().address;
        let port = server.address().port;
        console.log('皮肤服务器开启 http://%s:%s', host, port);
    });
}
