"use strict";
const express = require('express')
const app = express()
const compression = require('compression')
const responseTime = require('response-time')
const favicon = require('serve-favicon');
const parseUrl = require('parseurl')
const morgan = require('morgan')
const errno = require('./errno.js');
const setting = require('./init.js')
const userScript = require('./reg.js')
    //const pack = require("./package.json");
    //const readline = require('readline');
    //const rl = readline.createInterface(process.stdin, process.stdout)
    //const command = require('./command.js')
let interfaceJS = []
interfaceJS.push('var element = document.createElement("title")')
interfaceJS.push('element.innerHTML = "' + setting.interface.title + '"')
interfaceJS.push('document.head.appendChild(element)')
interfaceJS.push('ECCKey = "' + userScript.getECC() + '"')
interfaceJS = interfaceJS.join('\n')

console.log('✓ 数据库: ' + setting.server.database.type)
if (setting.dev.webLogger) {
    app.use(morgan('combined'))
    console.log('✓ morgan网页访问日志');
}
if (setting.dev.responseTime) {
    app.use(responseTime())
    console.log('✓ 时间消耗');
}
if (!setting.dev.noCompression) {
    app.use(compression())
    console.log('✓ gzip压缩');
}
app.use(require('express-promise')())
app.use(favicon('public/favicon.ico'))
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

app.get(/indexsetting/, (req, res, next) => {
    res.end(interfaceJS);
});

app.use(express.static('public'));

module.exports = app;
module.exports.setting = setting
module.exports.userScript = userScript
