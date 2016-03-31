"use strict";
let express = require('express')
let compression = require('compression')
let bodyParser = require('body-parser')
let app = express()
let errno = require('./script/errno.js');
require('./script/init.js');
let setting = require('./config.js');
console.log("=> 配置文件读取成功");
let userScript = require('./script/reg.js')
let parseUrl = require('parseurl')
let favicon = require('serve-favicon');
let interfaceJS = []
interfaceJS.push('var element = document.createElement("title")')
interfaceJS.push('element.innerHTML = "' + setting.interface.title + '"')
interfaceJS.push('document.head.appendChild(element)')
interfaceJS.push('ECCKey = "' + userScript.getECC() + '"')
interfaceJS = interfaceJS.join('\n')


app.use(favicon('public/favicon.ico'));
app.use(compression())
app.use('/textures', express.static('data/textures'))

app.get(/uskapi\//, (req, res, next) => {
    let path = parseUrl(req).pathname
    if (path.indexOf('.json') !== -1) {
        path = path.match(/[^/]+\.json/)
        path = path[path.length - 1]
        path = path.replace('.json', '')
        let json = userScript.getJSONUniSkinAPI(path)
        if (json.errno !== 1) {
            res.end(JSON.stringify(json))
        } else {
            res.status(404).end(JSON.stringify(json))
        }
    } else {
        res.status(404).end()
    }
    //replace(/\/*\.json$/,'')
    //res.end(userScript.getJSONUniSkinAPI('simon3000'))
});

app.get(/cslapi\//, (req, res, next) => {
    //res.end(userScript.getJSON('simon3000'))
});

app.get(/usernamepng/, (req, res, next) => {
    //res.end(userScript.getJSON('simon3000'))
});

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

app.post(/upload/, (req, res, next) => {
    if (req.body.username !== '' || req.body.username !== undefined) {

    }
});

app.post(/login/, (req, res, next) => {
    if (req.body.username !== '' || req.body.username !== undefined) {

    }
});

app.post(/register/, (req, res, next) => {
    res.end(userScript.reg(req.body.aec))
});

app.post(/isRegister/, (req, res, next) => {
    if (req.body.username !== '' || req.body.username !== undefined) {
        res.end(String(userScript.check(req.body.username)))
    }
});

app.get(/indexsetting/, (req, res, next) => {
    res.end(interfaceJS);
});

app.use(express.static('public'));
let server = app.listen(setting.server.port, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log('\n=> 服务器开启 http://%s:%s', host, port);
});
