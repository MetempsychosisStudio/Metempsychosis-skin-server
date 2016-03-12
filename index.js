"use strict";
let express = require('express')
let compression = require('compression')
let fs = require('fs')
let SHA256 = require('./script/SHA256.js')
let app = express()
let reg = require('./script/reg.js')
let login = require('./script/login.js')
let checkReg = require('./script/checkReg.js')
let getJSON = require('./script/getJSON.js')
var setting


function openServer() {
    setting = require('./config.js');
    console.log("配置文件读取成功");
    app.all(/json/, compression(), function(req, res, next) {
        res.end(getJSON('simon3000'))
    });

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

    app.all(/indexsetting/, compression(), function(req, res, next) {
        res.end('$("title").html(' + setting().interface.title + ')');
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

function checkConfig() {
    fs.stat('./config.js', function(err, stats) {
        if (stats == undefined) {
            console.log('创建配置文件...');
            let defaultConfig = []
            defaultConfig.push('"use strict";')
            defaultConfig.push('let setting = {};setting.server = {};setting.interface = {}')
            defaultConfig.push('//配置文件 (别改上面的)')
            defaultConfig.push('')
            defaultConfig.push('//服务器端口号')
            defaultConfig.push('setting.server.port = 8080')
            defaultConfig.push('')
            defaultConfig.push('//网页标题')
            defaultConfig.push('setting.interface.title = "皮肤服务器"')
            defaultConfig.push('')
            defaultConfig.push('')
            defaultConfig.push('')
            defaultConfig.push('')
            defaultConfig.push('//不要改下面的东西')
            defaultConfig.push('function settingOut() {')
            defaultConfig.push('return setting')
            defaultConfig.push('}')
            defaultConfig.push('module.exports = settingOut;')
            fs.writeFileSync('./config.js', defaultConfig.join('\n'));
            console.log('config.js 创建成功');
        }
        openServer();
    })
}

function serverDone() {
    let server = app.listen(setting().server.port, function() {
        let host = server.address().address;
        let port = server.address().port;
        console.log('服务器开启 http://%s:%s', host, port);
        reg('simon3000','233','233')
    });
}

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
