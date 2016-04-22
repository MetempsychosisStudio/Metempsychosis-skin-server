"use strict";

const readline = require('readline');
const command = require('./script/command.js')
const enableDestroy = require('server-destroy');

let app = require('./script/server.js');
let setting = app.setting
let userScript = app.userScript
let restart = false

const open = () => {
    const rl = readline.createInterface(process.stdin, process.stdout)
    const server = app.listen(setting.server.port, () => {
        const host = server.address().address;
        const port = server.address().port;
        console.log(`\n=> 服务器开启 http://:${host}${port}`);
        console.log('\n输入help或?来查看帮助');
        rl.setPrompt('=> ');
        rl.prompt();
        rl.on('line', (e) => {
            const input = e.trim()
            if (input.match(/^ *$/)) {
                rl.prompt();
            } else if (input.match(/^restart$/) || input.match(/^reload$/)) {
                delete require.cache[require.resolve("./script/server.js")]
                delete require.cache[require.resolve("./script/db.js")]
                delete require.cache[require.resolve("./script/init.js")]
                delete require.cache[require.resolve("./config.json")]
                if (input.match(/^reload$/)) {
                    restart = 1
                    console.log('重载...');
                } else if (input.match(/^restart$/)) {
                    restart = 2
                    for (var cache in require.cache) {
                        if (require.cache.hasOwnProperty(cache)) {
                            delete require.cache[cache]
                        }
                    }
                    console.log('重启...');
                }
                rl.close()
            } else {
                console.log();
                command(e)
                rl.prompt();
            }
        })
        rl.on('close', () => {
            console.log('\n=> 关闭服务器...');
            server.destroy(() => {
                console.log('=> 保存数据...');
                userScript.close().then(() => {
                    if (!restart) {
                        console.log('ヾ(￣▽￣)Bye~Bye~');
                        process.exit(0)
                    } else {
                        if (restart === 1) {
                            console.log('\n------------------------------------ reload ------------------------------------\n');
                        } else if (restart === 2) {
                            console.log('\n------------------------------------ restart -----------------------------------\n');
                        }
                        app = require('./script/server.js');
                        setting = app.setting
                        userScript = app.userScript
                        restart = false
                        open()
                    }
                })
            })
        });
    });
}

open()

module.exports = app
