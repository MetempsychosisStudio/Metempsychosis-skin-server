"use strict";

module.exports = {
    startTime: new Date(),
    restart: 0,
    reload: 0,
    lastRestartTime: new Date(),
    lastReloadTime: new Date(),
    onlineUsers: []
}

let online = module.exports.onlineUsers

module.exports.list = (all) => {
    if (all) {
        return online
    } else {
        return online.map((user) => {
            if (user.hide && user.username) {
                return user.username
            }
            return false
        })
    }
}

module.exports.find = (type, value) => online.findIndex((user) => {
    if (user[type] == value) {
        return true
    }
})

module.exports.offline = (index) => {
    if (online[index]) {
        if (online[index].connection == 1) {
            online.splice(index, 1)
        } else {
            online[index].connection--
        }
    }
}
