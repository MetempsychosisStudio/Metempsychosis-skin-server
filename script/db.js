"use strict"
const _ = require('lodash')
const setting = require('./init')
const dbType = setting.server.database.type

//const lowDB = require('./ecc.js').db

let levelDB
let lowDB

if (dbType == 'leveldb') {
    levelDB = require('level')('./levelDB', {
        valueEncoding: 'json'
    })
} else if (dbType == 'lowdb') {
    const low = require('lowdb')
    const storage = require('lowdb/file-sync')
    lowDB = low('db.json', {
        storage
    })
}

console.log('=> 数据库连接成功\n')


module.exports.set = (newUser) => new Promise((r, j) => {
    if (dbType == 'lowdb') {
        lowDB('users').push({
            username: newUser.username,
            password: newUser.password,
            _username: newUser.username.toLowerCase(),
            update: new Date().getTime(),
            hit: 0
        })
        r(newUser.username)
    } else if (dbType == 'leveldb') {
        levelDB.put(newUser.username.toLowerCase(), {
            username: newUser.username,
            password: newUser.password,
            update: new Date().getTime(),
            hit: 0
        }, (err) => {
            if (err) console.log('LevelDB!', err)
            r(newUser.username)
        })
    }
})

module.exports.get = (username) => new Promise((r, j) => {
    if (dbType == 'lowdb') {
        r(lowDB('users').find({
            _username: username.toLowerCase()
        }))
    } else if (dbType == 'leveldb') {
        levelDB.get(username.toLowerCase(), (err, value) => {
            if (err) r(undefined)
            r(value)
        })
    }
})

module.exports.map = (type) => new Promise((r, j) => {
    if (dbType == 'lowdb') {
        r(lowDB('users').map(type))
    } else if (dbType == 'leveldb') {
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
    }
})

/**
 * 覆盖
 * @param  {String} username target users
 * @param  {Object} newValue things you want change
 * @return {String}          done?
 */
module.exports.update = (username, newValue) => new Promise((r, j) => {
    if (dbType == 'lowdb') {
        lowDB('users').chain().find({
            _username: username.toLowerCase()
        }).assign(newValue).value()
        r('done')
    } else if (dbType == 'leveldb') {
        levelDB.get(username.toLowerCase(), (err, value) => {
            if (err) console.log('LevelDB!', err)
            levelDB.put(username.toLowerCase(), _.assignIn(value, newValue), (err) => {
                if (err) console.log('LevelDB!', err)
                r('done')
            })
        })
    }
})

module.exports.remove = (username) => new Promise((r, j) => {
    if (dbType == 'lowdb') {
        r(lowDB('users').remove({
            _username: username.toLowerCase()
        })[0].username)
    } else if (dbType == 'leveldb') {
        levelDB.del(username.toLowerCase(), function(err) {
            if (err) console.log('LevelDB!', err)
            r(username)
        })
    }
})

module.exports.close = () => new Promise((r, j) => {
    if (dbType == 'lowdb') {
        r()
    } else if (dbType == 'leveldb') {
        //lowDB.write()
        levelDB.close(r)
    }
})
