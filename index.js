"use strict";
let express = require('express')
let compression = require('compression')
let fs = require('fs')
let SHA256 = require('./script/SHA256.js')
let bodyParser = require('body-parser')
let app = express()
let errno = require('./script/errno.js');
require('./script/init.js');
let setting = require('./config.js');
console.log("配置文件读取成功");
let userScript = require('./script/reg.js')

app.get(/uskapi/, compression(), (req, res, next) => {
    res.end(userScript.getJSONUniSkinAPI('simon3000'))
});

app.get(/cslapi/, compression(), (req, res, next) => {
    //res.end(userScript.getJSON('simon3000'))
});

app.get(/json/, compression(), (req, res, next) => {
    //res.end(userScript.getJSON('simon3000'))
});

app.get(/usernamepng/, compression(), (req, res, next) => {
    //res.end(userScript.getJSON('simon3000'))
});

app.get(/textures/, compression(), express.static('data/textures'), (req, res, next) => {
    res.status(404)
})

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
