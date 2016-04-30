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

        socket.on('changePassword', (aec, fn) => {
            let userInfo = userScript.decrypt(aec)
            userScript.changePassword(userInfo.username, userInfo.password, userInfo.newPassword).then(fn)
        })

        socket.on('disconnect', function(msg) {
            sIM.offline(sIM.find('ip', socket.conn.remoteAddress))
        })


        socket.on('error', (e) => {
            console.error('socket.io 出错: ' + e)
        })
    })

    process.on('socket', (type) => {
        if (type == 'send') {
            interfaceJS.ECCKey = userScript.getECC()
            io.emit('setting', interfaceJS)
        }
    })
}
console.log('✓ socket.io')
