"use strict"
const sIM = require('./serverInfoManager')
const userScript = require('./reg')

const setting = require('./init')

let interfaceJS = {}
interfaceJS.title = setting.interface.title
interfaceJS.ECCKey = userScript.getECC()

module.exports = (io) => {
    io.on('connection', function(socket) {
        sIM.online(socket)

        socket.emit('setting', interfaceJS)

        socket.on('isRegister', (username, fn) => {
            userScript.check(username).then(fn)
        })

        socket.on('register', (aec, fn) => {
            userScript.reg(userScript.decrypt(aec)).then(fn)
        })

        socket.on('login', (aec, fn) => {
            let user = userScript.decrypt(aec)
            if (user == 'err') {
                fn('error')
            } else {
                userScript.login(user.username, user.password).then((result) => {
                    if (result == 'good') {
                        userScript.get(user.username).then(fn)
                    } else {
                        fn('bad')
                    }
                })
            }
        })

        socket.on('changePassword', (aec, fn) => {
            let userInfo = userScript.decrypt(aec)
            userScript.changePassword(userInfo.username, userInfo.password, userInfo.newPassword).then(fn)
        })

        socket.on('disconnect', function(msg) {
            sIM.offline(sIM.find('ip', socket.conn.remoteAddress))
        })
    })
}
console.log('✓ socket.io')
