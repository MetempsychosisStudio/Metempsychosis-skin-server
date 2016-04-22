"use strict";
const low = require('lowdb')
const storage = require('lowdb/file-sync')
const db = low('db.json', {
    storage
})

//module.exports.get
//module.exports.set
//module.exports.update
//module.exports.remove

module.exports = db

module.exports.close = () => new Promise((r, j) => {
    db.write()
    r()
})
