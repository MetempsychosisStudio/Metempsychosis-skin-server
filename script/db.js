"use strict";
const low = require('lowdb')
const storage = require('lowdb/file-sync')
const lowDB = low('db.json', {
    storage
})
const level = require('level')
const db = level('./levelDB')


module.exports.set = (newUser) => new Promise((r, j) => {
    lowDB('users').push({
        username: newUser.username,
        password: newUser.password,
        _username: newUser.username.toLowerCase(),
        update: new Date().getTime()
    })
    r(newUser.username)
})

module.exports.get = (username) => new Promise((r, j) => {
    r(lowDB('users').find({
        _username: username.toLowerCase()
    }))
})

module.exports.map = (type) => new Promise((r, j) => {
    r(lowDB('users').map(type))
})

module.exports.update = (username, value) => new Promise((r, j) => {
    lowDB('users').chain().find({
        _username: username.toLowerCase()
    }).assign(value).value()
    r('done')
})

module.exports.remove = (username) => new Promise((r, j) => {
    r(lowDB('users').remove({
        _username: username.toLowerCase()
    })[0].username)
})

//module.exports = lowDB

module.exports.close = () => new Promise((r, j) => {
    //lowDB.write()
    r()
})

module.exports.ecc = lowDB('eccKey')
