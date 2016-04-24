"use strict";
const sIM = require('./serverInfoManager.js')
const userScript = require('./reg.js')

module.exports = (io) => {
    io.on('connection', function(socket) {

        let userIndex = sIM.find('ip', socket.conn.remoteAddress)
        if (userIndex >= 0) {
            sIM.onlineUsers[userIndex].connection++
        } else {
            sIM.onlineUsers.push({
                ip: socket.conn.remoteAddress,
                username: undefined,
                hide: false,
                connection: 1
            })
        }

        socket.on('isRegister', (msg, fn) => {
            userScript.check(msg).then(fn)
        });

        socket.on('register', (aec, fn) => {
            userScript.reg(userScript.decrypt(aec)).then(fn)
        })

        socket.on('changePassword', (aec, fn) => {
            let userInfo = userScript.decrypt(aec)
            userScript.changePassword(userInfo.username, userInfo.password, userInfo.newPassword).then(fn)
        })

        socket.on('disconnect', function(msg) {
            sIM.offline(sIM.find('ip', socket.conn.remoteAddress))
        });


        socket.on('error', (e) => {
            console.log('socket.io 出错: '+e);
        })
    });
}
console.log('✓ socket.io');
