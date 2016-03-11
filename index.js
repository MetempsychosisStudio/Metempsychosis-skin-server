var express = require('express');
var compression = require('compression');
var fs = require('fs');
var SHA256 = require('./script/SHA256.js')
var app = express();
setting = new Object();
if (fs.existsSync('./data') == false) {
    fs.mkdir('./data', function(err) {
        if (err) throw err;
        fs.mkdir('./data/players', function(err) {
            if (err) throw err;
"use strict";
            checkConfig()
        })
    })
} else {
    if (fs.existsSync('./data/players') == false) {
        fs.mkdir('./data/players', function(err) {
            if (err) throw err;
            checkConfig()
        })
    } else {
        checkConfig()
    }
}

function checkConfig() {
    var login = require('./script/login.js');
    var reg = require('./script/reg.js');
    fs.exists('./config.js', function(exists) {
        if (exists) {
            require('./config.js');
            console.log("配置文件读取成功");
            openServer();
        } else {
            console.log('创建配置文件: config.js');
            fs.writeFile('./config.js', '//配置文件\n\n//访问端口号\nsetting.port = 8080', function(err) {
                if (err) throw err;
                require('./config.js');
                console.log("配置文件读取成功");
                openServer();
            })
        }
    });
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
    var server = app.listen(setting.port, function() {
        var host = server.address().address;
        var port = server.address().port;
        console.log('皮肤服务器开启 http://%s:%s', host, port);
    });
}
