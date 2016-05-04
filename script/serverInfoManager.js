"use strict"

module.exports = {
    startTime: new Date(),
    restart: 0,
    reload: 0,
    lastRestartTime: new Date(),
    lastReloadTime: new Date(),
    onlineUsers: []
}

let ecc
let eccLevel

module.exports.ecc = (key) => {
    if (key) {
        return ((key) => {
            ecc = key
            return ecc
        })(key)
    } else {
        return ecc
    }
}

module.exports.ecc.level = (num) => {
    if (num) {
        eccLevel = num
    }
    return eccLevel
}

module.exports.clean = (type) => {
    switch (type) {
        case 'ecc':
            ecc = undefined
            break;
        default:

    }
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

module.exports.online = (socket) => {
    let userIndex = module.exports.find('ip', socket.conn.remoteAddress)
    if (userIndex >= 0) {
        module.exports.onlineUsers[userIndex].connection++
    } else {
        module.exports.onlineUsers.push({
            ip: socket.conn.remoteAddress,
            username: undefined,
            hide: false,
            connection: 1
        })
    }
}

module.exports.offline = (index) => {
    if (online[index]) {
        if (online[index].connection == 1) {
            online.splice(index, 1)
        } else {
            online[index].connection--
        }
    }
}
