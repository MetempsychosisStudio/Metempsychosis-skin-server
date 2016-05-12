"use strict"
const SHA256 = require('./SHA256')
const ecc = require('eccjs')
const db = require('./db')
const eccDB = require('./serverInfoManager').ecc

module.exports.check = (username) => new Promise((r, j) => {
    db.get(username).then((text) => r(!text))
})

module.exports.find = () => new Promise((r, j) => {
    db.map().then(r)
})

module.exports.get = (username) => new Promise((r, j) => {
    db.get(username).then((result) => {
        let user
        if (result) {
            let userInfo = {}
            for (let variable in result) {
                if (result.hasOwnProperty(variable)) {
                    if (variable != 'password') {
                        userInfo[variable] = result[variable]
                    }
                }
            }
            user = userInfo
        } else {
            user = undefined
        }
        r(user)
    })
})

module.exports.reg = (newUser, log) => new Promise((r, j) => {
    if (typeof newUser !== 'object') {
        r('error')
    } else if (!newUser.username || !newUser.password || !newUser.rPassword) {
        r('lostElement')
    } else if (newUser.password != newUser.rPassword) {
        r('passwordNotSame')
    } else if (!newUser.username.match(/^\w+$/)) {
        r('illegalUsername')
    } else {
        module.exports.check(newUser.username).then((text) => {
            if (text) {
                db.set(newUser).then((text) => {
                    console.log('新用户: ' + text)
                    module.exports.get(newUser.username).then(r)
                })
            } else {
                r('repeat')
            }
        })
    }
})

module.exports.remove = (username) => new Promise((r, j) => {
    module.exports.check(username).then((text) => {
        if (text) {
            r('userNotExist')
        } else {
            db.remove(username).then((username) => {
                console.log('删除用户: ' + username)
                r('done')
            })
        }
    })
})

module.exports.login = (username, password) => new Promise((r, j) => {
    module.exports.check(username).then((text) => {
        if (text) {
            r('userNotExist')
        } else {
            db.get(username).then((user) => {
                if (user.password === password) {
                    r('good')
                } else {
                    r('bad')
                }
            })
        }
    })
})

module.exports.hit = (username) => new Promise((r, j) => {
    db.get(username).then((user) => {
        if (user) {
            db.update(username, {
                hit: user.hit + 1
            }).then(r)
        } else {
            r(user)
        }
    })
})

module.exports.changePassword = (username, password, newPassword) => new Promise((r, j) => {
    if (!username || !password || !newPassword) {
        console.log(username)
        console.log(password)
        console.log(newPassword)
        r('lostElement')
    } else {
        module.exports.login(username, password).then((login) => {
            if (login === 'good') {
                module.exports.check(username).then((text) => {
                    if (text) {
                        r('userNotExist')
                    } else {
                        db.update(username, {
                            password: newPassword
                        }).then((text) => {
                            r(text)
                        })
                    }
                })
            } else {
                r(login)
            }
        })
    }
})

module.exports.close = db.close
module.exports.decrypt = (aec) => {
    let result
    try {
        result = JSON.parse(ecc.decrypt(eccDB().dec, aec))
    } catch (e) {
        console.trace(e)
        result = 'err'
    } finally {
        return result
    }
}
module.exports.getECC = () => eccDB().enc
