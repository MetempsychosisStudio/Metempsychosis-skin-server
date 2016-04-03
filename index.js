"use strict";
const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const app = express()
const errno = require('./script/errno.js');
require('./script/init.js');
const setting = require('./config.js');
console.log("=> 配置文件读取成功");
const userScript = require('./script/reg.js')
const parseUrl = require('parseurl')
const favicon = require('serve-favicon');
const pack = require("./package.json");
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout)
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
    res.end(userScript.reg(userScript.decrypt(req.body.aec)))
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


const command = (input) => {
    let cmd = input.trim().split(' ')
    let force = false
    if (input.trim().match(/-.+$/) != null) {
        force = input.trim().match(/-.+$/)[0].replace('-', '').indexOf('f') != -1
    }
    switch (cmd[0]) {
        case 'u':
        case 'user':
            switch (cmd[1]) {
                case 'd':
                case 'delete':
                    switch (cmd[2]) {
                        case undefined:
                            console.log('请输入要删除的用户名');
                            break;
                        case '?':
                        case 'help':
                            console.log('删除用户');
                            console.log('> ' + input.trim() + ' 用户名');
                            console.log('🌰: ' + input.trim() + ' simon3000');
                            break;
                        default:
                            switch (userScript.remove(cmd[2])) {
                                case 'done':
                                    break;
                                case 'userNotExist':
                                    console.log('用户不存在');
                                    break;
                                default:
                                    console.log('不明原因错误');
                            }
                    }
                    break;
                case 'r':
                case 'register':
                    switch (cmd[2]) {
                        case undefined:
                            console.log('请输入用户名和密码');
                            break;
                        case '?':
                        case 'help':
                            console.log('注册用户→_→');
                            console.log('> ' + input.trim() + ' 用户名 密码');
                            console.log('🌰: ' + input.trim() + ' simon3000 123456');
                            break;
                        default:
                            if (cmd[3] == undefined) {
                                console.log('请输入密码');
                            } else {
                                switch (userScript.reg({
                                    username: cmd[2],
                                    password: cmd[3],
                                    rPassword: cmd[3]
                                })) {
                                    case 'done':
                                        break;
                                    case 'illegalUsername':
                                        console.log('非法用户名');
                                        break;
                                    case 'repeat':
                                        console.log('用户已存在');
                                        break;
                                    default:
                                        console.log('不明原因错误');
                                }
                            }
                    }
                    break;
                case 'c':
                case 'changepassword':
                    switch (cmd[2]) {
                        case undefined:
                            console.log('请输入用户名和密码');
                            break;
                        case '?':
                        case 'help':
                            console.log('改密码→_→');
                            console.log('> ' + input.trim() + ' 用户名 密码');
                            console.log('🌰: ' + input.trim() + ' simon3000 123456');
                            break;
                        default:
                            if (cmd[3] == undefined) {
                                console.log('请输入新密码');
                            } else {
                                switch (userScript.changePassword(cmd[2], cmd[3])) {
                                    case true:
                                        console.log('密码更改成功');
                                        break;
                                    case 'userNotExist':
                                        console.log('用户不存在');
                                        break;
                                    default:
                                        console.log('不明原因错误');
                                }
                            }
                    }
                    break;
                case undefined:
                case '?':
                case 'help':
                    console.log('user的帮助');
                    break;
                default:
                    console.log('找不到指令: ' + cmd[1]);
                    command('user -h')
            }
            break;
        case 'stop':
            process.exit(0);
            break;
        case 'help':
        case '?':
            console.log(pack.name + '@' + pack.version);
            console.log('└─┬ user (u)');
            console.log('  ├── find (f)');
            console.log('  ├── register (r)');
            console.log('  ├── delete (d)');
            console.log('  └── changepassword (c)');
            console.log('输入 "指令 ' + cmd[0] + '" 来查看详细帮助');
            break;
        default:
            console.log('找不到指令: ' + cmd[0]);
            break;
    }
    rl.prompt();
}


const server = app.listen(setting.server.port, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`\n=> 服务器开启 http://:${host}${port}`);
    console.log('\n输入help或?来查看帮助');
    rl.setPrompt('=> ');
    rl.prompt();
    rl.on('line', (e) => {
        if (e.trim().match(/^ *$/) !== null) {
            rl.prompt();
        } else {
            console.log();
            command(e)
        }
    })
    rl.on('close', () => {
        process.exit(0);
    });
});
