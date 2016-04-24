"use strict";
const _ = require('lodash')

const low = require('lowdb')
const storage = require('lowdb/file-sync')
const lowDB = low('db.json', {
    storage
})
const level = require('level')
const levelDB = level('./levelDB', {
    valueEncoding: 'json'
})


module.exports.set = (newUser) => new Promise((r, j) => {
    levelDB.put(newUser.username.toLowerCase(), {
        username: newUser.username,
        password: newUser.password,
        update: new Date().getTime()
    }, (err) => {
        if (err) console.log('LevelDB!', err)
        r(newUser.username)
    })
})

module.exports.get = (username) => new Promise((r, j) => {
    levelDB.get(username.toLowerCase(), (err, value) => {
        if (err) r(undefined)
        r(value)
    })
})

module.exports.map = (type) => new Promise((r, j) => {
    let users = []
    levelDB.createKeyStream()
        .on('data', function(data) {
            users.push(data)
        })
        .on('error', function(err) {
            console.log('LevelDB!', err)
        })
        .on('end', function() {
            r(users)
        })
})

module.exports.update = (username, newValue) => new Promise((r, j) => {
    levelDB.get(username.toLowerCase(), (err, value) => {
        if (err) console.log('LevelDB!', err)
        levelDB.put(username.toLowerCase(), _.assignIn(value, newValue), (err) => {
            if (err) console.log('LevelDB!', err)
            r('done')
        })
    })
})

module.exports.remove = (username) => new Promise((r, j) => {
    levelDB.del(username.toLowerCase(), function(err) {
        if (err) console.log('LevelDB!', err)
        r(username)
    });
})

//module.exports = lowDB

module.exports.close = () => new Promise((r, j) => {
    //lowDB.write()
    levelDB.close(r)
})

module.exports.ecc = lowDB('eccKey')
