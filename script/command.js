"use strict"
//const readline = require('readline');
//const rl = readline.createInterface(process.stdin, process.stdout)
//rl.setPrompt('=> ');
const errno = require('./errno')
const userScript = require('./reg')
const pack = require("../package")
const sIM = require('./serverInfoManager')
let lastMap

module.exports = (input) => new Promise((r, j) => {
    let cmd = input.trim().split(' ')
    let force = false
    if (input.trim().match(/-.+$/) !== null) {
        force = input.trim().match(/-.+$/)[0].replace('-', '').indexOf('f') != -1
    }
    switch (cmd[0]) {
        case 'u':
        case 'user':
            switch (cmd[1]) {
                case 'f':
                case 'find':
                    switch (cmd[2]) {
                        case undefined:
                            userScript.find().then((users) => {
                                lastMap = users
                                for (var i = 0; i < users.length; i++) {
                                    console.log(i + '.  ' + users[i])
                                }
                                r()
                            })
                            break
                        default:
                            userScript.get(cmd[2]).then((user) => {
                                if (user) {
                                    console.log(user);
                                    r()
                                } else if (lastMap[cmd[2]]) {
                                    userScript.get(lastMap[cmd[2]]).then((user) => {
                                        console.log(user);
                                        r()
                                    })
                                } else {
                                    console.log('找不到→_→');
                                    r()
                                }
                            })
                    }
                    break
                case 'd':
                case 'delete':
                    switch (cmd[2]) {
                        case undefined:
                            console.log('请输入要删除的用户名')
                            r()
                            break
                        default:
                            userScript.remove(cmd[2]).then((text) => {
                                switch (text) {
                                    case 'done':
                                        break
                                    case 'userNotExist':
                                        console.log('用户不存在')
                                        break
                                    default:
                                        console.log('不明原因错误')
                                }
                                r()
                            })
                    }
                    break
                case 'r':
                case 'register':
                    switch (cmd[2]) {
                        case undefined:
                            console.log('请输入用户名和密码')
                            r()
                            break
                        default:
                            if (cmd[3] === undefined) {
                                console.log('请输入密码')
                                r()
                            } else {
                                userScript.reg({
                                    username: cmd[2],
                                    password: cmd[3],
                                    rPassword: cmd[3]
                                }).then((text) => {
                                    switch (text) {
                                        case 'done':
                                            break
                                        case 'illegalUsername':
                                            console.log('非法用户名')
                                            break
                                        case 'repeat':
                                            console.log('用户已存在')
                                            break
                                        default:
                                            console.log('不明原因错误')
                                    }
                                    r()
                                })
                            }
                    }
                    break
                case 'c':
                case 'changepassword':
                    switch (cmd[2]) {
                        case undefined:
                            console.log('请输入用户名和密码')
                            r()
                            break
                        default:
                            if (cmd[3] === undefined) {
                                console.log('请输入新密码')
                                r()
                            } else {
                                userScript.changePassword(cmd[2], cmd[3]).then((text) => {
                                    switch (text) {
                                        case 'done':
                                            console.log('密码更改成功')
                                            break
                                        case 'userNotExist':
                                            console.log('用户不存在')
                                            break
                                        default:
                                            console.log('不明原因错误')
                                    }
                                    r()
                                })
                            }
                    }
                    break
                case undefined:
                case '?':
                case 'help':
                    console.log('user的帮助')
                    r()
                    break
                default:
                    console.log('找不到指令: ' + cmd[1])
                    module.exports(cmd[0] + ' ?').then(() => r())
            }
            break
        case 'help':
        case '?':
            console.log(pack.name + '@' + pack.version)
            console.log('└─┬ user (u)')
            console.log('  ├── find (f)')
            console.log('  ├── register (r)')
            console.log('  ├── delete (d)')
            console.log('  └── changepassword (c)')
            console.log('输入 "指令 ' + cmd[0] + '" 来查看详细帮助')
            console.log('\n「  ' + __dirname + '  」\n')
            r()
            break
        default:
            console.log('找不到指令: ' + cmd[0])
            r()
            break
    }
})
