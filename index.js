"use strict"
const readline = require('readline')
let command = require('./script/command')
const sIM = require('./script/serverInfoManager')
const enableDestroy = require('server-destroy')
const http = require('http')
const socketio = require('socket.io')
    //process.stdin.resume();

let express = require('./script/server')
let setting = express.setting
let userScript = express.userScript
let restart = false
let reloadEcc = false

const open = () => {
    const server = http.createServer(express)
    const io = socketio(server)
    require('./script/socket')(io)
    server.listen(setting.server.port, () => {
        enableDestroy(server)
        console.log(`\n=> 服务器开启 http://:${server.address().address}${server.address().port}`)
        console.log('\n输入help或?来查看帮助')
        const rl = readline.createInterface(process.stdin, process.stdout)
        process.on('SIGINT', function() {
            rl.close()
        });
        rl.setPrompt('=> ')
        rl.prompt()
        process.on('stopServer', (type) => {
            if (type == 'reload') {
                restart = 1
            } else if (type == 'ecc') {
                reloadEcc = true
                restart = 1
            }
            rl.close()
        })
        rl.on('line', (e) => {
            const input = e.trim()
            if (input.match(/^ *$/)) {
                rl.prompt()
            } else {
                console.log()
                command(e).then(() => rl.prompt())
            }
        })
        rl.on('close', () => {
            process.removeAllListeners('SIGINT')
            process.removeAllListeners('stopServer')
            console.log('\n=> 关闭网络服务器...')
            server.destroy(() => {
                console.log('=> 保存数据...')
                userScript.close().then(() => {
                    if (!restart) {
                        console.log('ヾ(￣▽￣)Bye~Bye~')
                        process.exit(0)
                    } else {
                        if (restart === 1) {
                            if (reloadEcc) {
                                reloadEcc = false
                                sIM.clean('ecc')
                                console.log('重载... (重置ECC)')
                            } else {
                                console.log('重载...')
                            }
                            for (let i = 0; i < needReload.length; i++) {
                                delete require.cache[require.resolve(needReload[i])]
                            }
                            console.log('\n------------------------------------ reload ------------------------------------\n')
                        } else if (restart === 2) {
                            for (let cache in require.cache) {
                                if (require.cache.hasOwnProperty(cache)) {
                                    delete require.cache[cache]
                                }
                            }
                            console.log('\n------------------------------------ restart -----------------------------------\n')
                        }
                        command = require('./script/command')
                        express = require('./script/server')
                        setting = express.setting
                        userScript = express.userScript
                        restart = false
                        open()
                    }
                })
            })
        })
    })
}

const needReload = ['./script/server.js', './script/db.js', './script/init.js', './config.json', './script/reg.js', './script/command.js', './script/socket.js']

open()

module.exports = express
