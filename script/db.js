"use strict";
const low = require('lowdb')
const storage = require('lowdb/file-sync')
const db = low('db.json', {
    storage
})

//module.exports.get
//module.exports.set
//module.exports.update

module.exports = db
