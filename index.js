"use strict";
let express = require('express')
let compression = require('compression')
let fs = require('fs')
let SHA256 = require('./script/SHA256.js')
let bodyParser = require('body-parser')
let app = express()
let userScript
var setting

//for (var i = 0; i < 10; i++) {
//    let random = 0
//    for (var k = 0; k < 100000; k++) {
//        random += Math.random()
//        let w = []
//        for (var b = 0; b < 10; b++) {
//            let c
//            for (var l = 0; l < 10; l++) {
//                c += Math.random()
//            }
//            w[b] = c
//        }
//        w.forEach(function(e) {
//            for (var v = 0; v < e; v++) {
//                Math.random()
//            }
//        })
//    }
//    console.log(SHA256(SHA256(SHA256(SHA256(i + 'w' + random)) + SHA256(SHA256(i + 'w' + SHA256(SHA256(i + 'w' + random)))))));
//}

fs.stat('./data', (err, stats) => {
    fs.stat('./data/players', (err, playerStats) => {
        fs.stat('./data/players.json', (err, JSONStats) => {
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
            userScript = require('./script/reg.js')

            fs.stat('./config.js', (err, stats) => {
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
                    defaultConfig.push('module.exports = setting;')
                    fs.writeFileSync('./config.js', defaultConfig.join('\n'));
                    console.log('config.js 创建成功');
                }

                setting = require('./config.js');
                console.log("配置文件读取成功");
                app.all(/json/, compression(), (req, res, next) => {
                    res.end(userScript.getJSON('simon3000'))
                });

                app.post(/upload/, bodyParser.urlencoded({
                    extended: true
                }), bodyParser.json(), (req, res, next) => {
                    userScript.login(req.body.username, req.body.pass)
                });

                app.post(/login/, bodyParser.urlencoded({
                    extended: true
                }), bodyParser.json(), (req, res, next) => {
                    userScript.login(req.body.username, req.body.pass)
                });

                app.post(/register/, bodyParser.urlencoded({
                    extended: true
                }), bodyParser.json(), (req, res, next) => {
                    res.end(userScript.reg(req.body.username, req.body.pass, req.body.rpass))
                });

                app.get(/indexcss/, compression(), (req, res, next) => {
                    res.sendFile('index.css', {
                        root: 'public/'
                    });
                });

                app.get(/indexjs/, compression(), (req, res, next) => {
                    res.sendFile('index.js', {
                        root: 'public/'
                    });
                });

                app.get(/indexsetting/, compression(), (req, res, next) => {
                    res.end('$("title").html("' + setting.interface.title + '")');
                });

                app.get(/favicon/, compression(), (req, res, next) => {
                    res.sendFile('favicon.ico', {
                        root: 'public/'
                    });
                });

                app.use(compression(), (req, res, next) => {
                    res.sendFile('index.html', {
                        root: 'public/'
                    });
                });
                let server = app.listen(setting.server.port, () => {
                    let host = server.address().address;
                    let port = server.address().port;
                    console.log('服务器开启 http://%s:%s', host, port);
                });
            })
        })
    })
})
