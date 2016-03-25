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
let interfaceJS = []
interfaceJS.push('$("title").html("' + setting.interface.title + '")')
interfaceJS.push('ECCKey = "' + userScript.getECC() + '"')
interfaceJS = interfaceJS.join('\n')


app.use(compression())
app.use('/textures', express.static('data/textures'))

app.get(/uskapi/, (req, res, next) => {
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

app.get(/cslapi/, (req, res, next) => {
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
    userScript.login(req.body.username, req.body.pass)
});

app.post(/login/, (req, res, next) => {
    userScript.login(req.body.username, req.body.pass)
});

app.post(/register/, (req, res, next) => {
    res.end(userScript.reg(req.body.username, req.body.pass, req.body.rpass))
});

app.get(/indexsetting/, (req, res, next) => {
    res.end(interfaceJS);
});

app.get(/favicon/, (req, res, next) => {
    res.sendFile('favicon.ico', {
        root: 'public/'
    });
});

app.use(express.static('public'));
let server = app.listen(setting.server.port, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log('\n=> 服务器开启 http://%s:%s', host, port);
});
