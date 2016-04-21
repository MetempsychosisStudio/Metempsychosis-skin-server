"use strict";
//const readline = require('readline');
//const rl = readline.createInterface(process.stdin, process.stdout)
//rl.setPrompt('=> ');
const init = require('./init.js')
const userScript = require('./reg.js')
const pack = require("../package.json");
const command = (input) => {
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
                    const users = userScript.find()
                    for (var i = 0; i < users.length; i++) {
                        console.log(i + '.  ' + users[i]);
                    }
                    break;
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
                            if (cmd[3] === undefined) {
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
                            if (cmd[3] === undefined) {
                                console.log('请输入新密码');
                            } else {
                                switch (userScript.changePassword(cmd[2], cmd[3])) {
                                    case 'done':
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
                    command('user ?')
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
            console.log('\n「  ' + __dirname + '  」\n');
            break;
        default:
            console.log('找不到指令: ' + cmd[0]);
            break;
    }
}

module.exports = (e) => {
    command(e)
}
