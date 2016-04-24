"use strict";
const low = require('lowdb')
const storage = require('lowdb/file-sync')
const lowDB = low('db.json', {
    storage
})

module.exports = lowDB('eccKey')
module.exports.db = lowDB
